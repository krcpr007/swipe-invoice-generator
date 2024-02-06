import React from "react";
import toast from "react-hot-toast";
import { Button, Card,  Table } from "react-bootstrap";
import { useDispatch} from "react-redux";
import { useInvoiceListData, useProductList } from "../redux/hooks";
import ProductCard from "./ProductCard";
import { BsEyeFill, BsTrash } from "react-icons/bs";
import { BiSolidPencil } from "react-icons/bi";
import { deleteProduct } from "../redux/productSlice";
import { updateWholeInvoice } from "../redux/invoicesSlice";

const ProductList = () => {
  const { productList } = useProductList();
  const isProductListEmpty = productList.length === 0 ? true : false;
  console.log(productList);
  return (
    <>
      <h3 className="fw-bold pb-0 pb-md-0 text-center">Product Tab</h3>
      <Card className="d-flex p-3 p-md-4 my-3 my-md-4 ">

        {isProductListEmpty ? null : (
          <div style={{ width: "100%" }}>
            <Table
              responsive
              className=" mt-2 justify-content-between text-center"
            >
              <thead>
                <tr>
                  <th>Product Id</th>
                  <th>Product Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {productList &&
                  productList?.map((eachProduct) => {
                    return (
                      <ProductRow
                        id={eachProduct?.id}
                        name={eachProduct?.productName}
                      />
                    );
                  })}
              </tbody>
            </Table>
          </div>
        )}

        {isProductListEmpty ? (
          <div className="d-flex flex-column align-items-center">
            <h3 className="fw-bold pb-2 pb-md-4">Nothing is there</h3>
            <ProductCard usage="create">Add Product</ProductCard>
          </div>
        ) : (
          <div className="d-flex flex-column align-items-center">
            <ProductCard usage="create">Add Product</ProductCard>
          </div>
        )}
      </Card>
    </>
  );
};

const ProductRow = (props) => {
  const dispatch = useDispatch();
  const { invoiceList } = useInvoiceListData();
  function deleteProductInInvoiceList(invoiceList, productId) {
    // Create a deep copy of the invoiceList to avoid mutating the original state
    const updatedInvoiceList = invoiceList.map((invoice) => ({
      ...invoice,
      items: [...invoice.items],
    }));

    // Iterate through the updatedInvoiceList
    for (let i = 0; i < updatedInvoiceList.length; i++) {
      let invoice = updatedInvoiceList[i];

      // Find the index of the item to be deleted
      let itemIndex = invoice.items.findIndex(
        (item) => String(item.itemId) === String(productId)
      );
      console.log(itemIndex, productId);

      if (itemIndex !== -1) {
        // Remove the item from the items array in the invoice
        invoice.items = [
          ...invoice.items.slice(0, itemIndex),
          ...invoice.items.slice(itemIndex + 1),
        ];

        // Recalculate the total based on the updated items array
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

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
    const updateList = deleteProductInInvoiceList(invoiceList, id);
    dispatch(updateWholeInvoice(updateList));
    toast.success("Product Deleted Successfully");
  };
  return (
    <tr className=" text-center">
      <td className=" text-center">{props?.id}</td>
      <td className=" text-center">{props?.name}</td>
      <td>
        <div className="d-flex gap-2 justify-content-center">
          <ProductCard usage="edit" id={props?.id} btnType="outline-info">
            <div className="d-flex align-items-center justify-content-center gap-0">
              <BiSolidPencil />
            </div>
          </ProductCard>
          <ProductCard usage="view" id={props?.id} btnType="secondary">
            <div className="d-flex align-items-center justify-content-center gap-0">
              <BsEyeFill />
            </div>
          </ProductCard>
          <Button
            variant="danger"
            type="button"
            onClick={() => {
              handleDelete(props.id);
            }}
          >
            <div className="d-flex align-items-center justify-content-center gap-0">
              <BsTrash />
            </div>
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default ProductList;
