import { useSelector } from "react-redux";
import { selectInvoiceList } from "./invoicesSlice";

export const useInvoiceListData = () => {
  const invoiceList = useSelector(selectInvoiceList);

  const getOneInvoice = (receivedId) => {
    return (
      invoiceList.find(
        (invoice) => invoice.id.toString() === receivedId.toString()
      ) || null
    );
  };

  const listSize = invoiceList.length;

  return {
    invoiceList,
    getOneInvoice,
    listSize,
  };
};

export const useProductList = () => {
  const productList = useSelector((state) => state.products);

  const getOneProduct = (productId) => {
    const product = productList.find((product) => {
      if (product.id === productId) {
        return product;
      }
    });

    if (product) {
      return product;
    } else {
      return null;
    }
  };

  const totalProduct = productList.length;
  return {
    productList,
    getOneProduct,
    totalProduct,
  };
};
