import React, { useState } from "react";
import toast from "react-hot-toast";
import { Button, Form, Modal } from "react-bootstrap";
import generateRandomId from "../utils/generateRandomId";
import { useInvoiceListData, useProductList } from "../redux/hooks";
import { useDispatch } from "react-redux";
import { addProduct, editProduct } from "../redux/productSlice";
import { updateWholeInvoice } from "../redux/invoicesSlice";

const ProductCard = (props) => {
  const [show, setShow] = useState(false);
  const { getOneProduct } = useProductList();
  const dispatch = useDispatch();
  const { invoiceList } = useInvoiceListData();
  const isEdit = (props?.usage === "edit" || props?.usage==="view") ? true : false;
  const [productData, setProductData] = useState(
    isEdit
      ? getOneProduct(props?.id)
      : {
          productName: "",
          productDescription: "",
          productPrice: 0,
        }
  );

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function updateProductInInvoiceList(
    invoiceList,
    productId,
    updatedProductDetails
  ) {
    // Create a deep copy of the invoiceList to avoid mutating the original state
    const updatedInvoiceList = invoiceList.map((invoice) => ({
      ...invoice,
      items: [...invoice.items],
    }));

    // Iterate through the updatedInvoiceList
    for (let i = 0; i < updatedInvoiceList.length; i++) {
      let invoice = updatedInvoiceList[i];

      // Find the index of the item to be updated
      let itemIndex = invoice.items.findIndex(
        (item) => String(item.itemId) === String(productId)
      );

      if (itemIndex !== -1) {
        // Create a deep copy of the item and update the product details
        const updatedItem = {
          ...invoice.items[itemIndex],
          ...updatedProductDetails,
        };

        // Update the items array in the invoice
        invoice.items = [
          ...invoice.items.slice(0, itemIndex),
          updatedItem,
          ...invoice.items.slice(itemIndex + 1),
        ];

        invoice.total = calculateTotal(invoice.items);
      }
    }

    // Optionally, return the updated invoiceList
    console.log(updatedInvoiceList);
    return updatedInvoiceList;
  }

  function calculateTotal(items) {
    // Calculate the total based on the item prices and quantities
    let total = items.reduce(
      (accumulator, item) => accumulator + item.itemPrice * item.itemQuantity,
      0
    );

    // You can add tax, discount, or other calculations here if needed

    return total.toFixed(2); // Assuming you want to keep two decimal places
  }

  const handleSubmit = () => {
    if (isEdit) {
      dispatch(editProduct({ id: props?.id, updateProduct: productData }));
      // update the item containing this product
      const updatedItem = {
        itemId: props.id,
        itemName: productData.productName,
        itemDescription: productData.productDescription,
        itemPrice: productData.productPrice,
      };
      const updateInvoiceList = updateProductInInvoiceList(
        invoiceList,
        props?.id,
        updatedItem
      );

      dispatch(updateWholeInvoice(updateInvoiceList));
      toast.success("Product Updated Successfully");
    } else {
      const { productName, productDescription, productPrice } = productData;
      if (!productName || !productDescription || !productPrice) {
        toast.error("Please fill all the fields");
        return;
      }
      dispatch(addProduct({ id: generateRandomId(), ...productData }));
      setProductData({
        productName: "",
        productDescription: "",
        productPrice: 0,
      });
     toast.success("Product Added Successfully");
    }
  };
  return (
    <>
      <Button
        variant={props.btnType ? props.btnType : "info"}
        onClick={handleShow}
      >
        {props?.children}
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Product Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Form.Control
              type="text"
              value={productData?.productName}
              placeholder="Product Name"
              onChange={(e) => {
                setProductData((prev) => {
                  return { ...prev, productName: e.target.value };
                });
              }}
              className=" my-2"
              disabled = {props.usage ==="view" ? true:false}
            />
            <Form.Control
              type="text"
              value={productData?.productDescription}
              placeholder="Product Description"
              onChange={(e) => {
                setProductData((prev) => {
                  return { ...prev, productDescription: e.target.value };
                });
              }}
              className=" my-2"
              disabled = {props.usage ==="view" ? true:false}
            />
            <Form.Control
              type="number"
              value={productData?.productPrice}
              placeholder="Product Name"
              onChange={(e) => {
                setProductData((prev) => {
                  return { ...prev, productPrice: e.target.value };
                });
              }}
              className=" my-2"
              disabled = {props.usage ==="view" ? true:false}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {props?.usage === "view" ? null : (
            <Button
              variant="info"
              onClick={() => {
                handleClose();
                handleSubmit();
              }}
            >
              {isEdit ? "Update Product" : "Add Product"}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProductCard;
