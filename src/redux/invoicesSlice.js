import { createSlice } from "@reduxjs/toolkit";

const invoicesSlice = createSlice({
  name: "invoices",
  initialState: [],
  reducers: {
    addInvoice: (state, action) => {
      state.push(action.payload);
    },
    deleteInvoice: (state, action) => {
      return state.filter((invoice) => invoice.id !== action.payload);
    },
    updateInvoice: (state, action) => {
      const index = state.findIndex(
        (invoice) => String(invoice.id) === String(action.payload.id)
      );
      if (index !== -1) {
        state[index] = action.payload.updatedInvoice;
      }
    },
    updateWholeInvoice: (state, action) => {
      return action.payload;
    },
  },
});

export const { addInvoice, deleteInvoice, updateInvoice, updateWholeInvoice } =
  invoicesSlice.actions;

export const selectInvoiceList = (state) => state.invoices;

export default invoicesSlice.reducer;
