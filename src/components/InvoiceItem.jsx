import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { BiSolidPencil, BiTrash } from "react-icons/bi";
import EditableField from "./EditableField";
import { useInvoiceListData, useProductList } from "../redux/hooks";
import { Col, Container, Form, Row } from "react-bootstrap";
import generateRandomId from "../utils/generateRandomId";
import ProductCard from "./ProductCard";

const InvoiceItem = (props) => {
  const { onItemizedItemEdit, currency, onRowDel, items, onRowAdd } = props;

  const itemTable = items.map((item) => {
    if (item?.itemName !== "") {
      return (
        <ItemRow
          key={item.itemId}
          item={item}
          onDelEvent={onRowDel}
          onItemizedItemEdit={onItemizedItemEdit}
          currency={currency}
        />
      );
    } else {
      return null;
    }
  });

  return (
    <div>
      {!(items.length === 0) ? (
        <Table>
          <thead>
            <tr>
              <th>ITEM</th>
              <th>QTY</th>
              <th>PRICE/RATE</th>
              <th className="text-center">ACTION</th>
            </tr>
          </thead>
          <tbody className="">{itemTable}</tbody>
        </Table>
      ) : (
        <p className=" fw-bold fs-5 text-center justify-content-center w-100">
          No items added yet
        </p>
      )}

      {/* <Button className="fw-bold" onClick={onRowAdd}>
        Add Item
      </Button> */}
      <div className="d-flex flex-row align-items-center mb-2">
        <span className="fw-bold d-block me-2">Select the items:</span>
        <ProductSelectionList items={items} rowAdd={onRowAdd} />
      </div>
      <div>
        <ProductCard usage="create">Add Items to Product List</ProductCard>
      </div>
    </div>
  );
};

const ItemRow = (props) => {
  const onDelEvent = () => {
    props.onDelEvent(props.item);
  };
  console.log(props);
  return (
    <tr>
      <td style={{ width: "100%" }}>
        <EditableField
          onItemizedItemEdit={(evt) =>
            props.onItemizedItemEdit(evt, props.item.itemId)
          }
          cellData={{
            type: "text",
            name: "itemName",
            placeholder: "Item name",
            value: props.item.itemName,
            id: props.item.itemId,
          }}
          readOnly="true"
        />
        <EditableField
          onItemizedItemEdit={(evt) =>
            props.onItemizedItemEdit(evt, props.item.itemId)
          }
          cellData={{
            type: "text",
            name: "itemDescription",
            placeholder: "Item description",
            value: props.item.itemDescription,
            id: props.item.itemId,
          }}
          readOnly={true}
        />
      </td>
      <td style={{ minWidth: "70px" }}>
        <EditableField
          onItemizedItemEdit={(evt) =>
            props.onItemizedItemEdit(evt, props.item.itemId)
          }
          cellData={{
            type: "number",
            name: "itemQuantity",
            min: 1,
            step: "1",
            value: props.item.itemQuantity,
            id: props.item.itemId,
          }}
        />
      </td>
      <td style={{ minWidth: "130px" }}>
        <EditableField
          onItemizedItemEdit={(evt) =>
            props.onItemizedItemEdit(evt, props.item.itemId)
          }
          cellData={{
            leading: props.currency,
            type: "number",
            name: "itemPrice",
            min: 1,
            step: "0.01",
            presicion: 2,
            textAlign: "text-end",
            value: props.item.itemPrice,
            id: props.item.itemId,
          }}
          readOnly="true"
        />
      </td>
      <td className="text-center" style={{ minWidth: "50px" }}>
        <BiTrash
          onClick={onDelEvent}
          style={{ height: "33px", width: "33px", padding: "7.5px" }}
          className="text-white mt-1 btn btn-danger mb-1"
        />
        <ProductCard
          usage="edit"
          id={Number(props?.item?.itemId)}
          btnType="outline-info"
        >
          <div className="d-flex align-items-center justify-content-center gap-0">
            <BiSolidPencil />
          </div>
        </ProductCard>
      </td>
    </tr>
  );
};

export default InvoiceItem;

const ProductSelectionList = (props) => {
  const { productList, getOneProduct } = useProductList();

  const handleAddProduct = (id) => {
    console.log(String(id).localeCompare("Select Items"));
    if (String(id).localeCompare("Select Items") === -1) {
      const product = getOneProduct(Number(id));
      props.rowAdd(
        id,
        product.productName,
        product.productDescription,
        product.productPrice
      );
    }
  };
  return (
    <Form.Select
      onChange={(e) => {
        handleAddProduct(e.target.value);
        // e.target.value = "Select Items";
      }}
      className=" w-25"
    >
      <option>Select Items</option>
      {productList &&
        productList.map((eachProduct, index) => {
          return (
            <option key={index} value={eachProduct.id}>
              {eachProduct.productName}
            </option>
          );
        })}
    </Form.Select>
  );
};
