import { createAsyncThunk } from "@reduxjs/toolkit";
import { APIService } from "../../apis";

export const _reducerFetchListVoucher = createAsyncThunk("voucher/list", async () => {
  try {
    const data = await APIService._getListVoucher();
    return data;
  } catch (error) {}
});

export const _reducerFetchPutVoucherUpdate = createAsyncThunk(
  "store/voucher/update",
  async ({ idCode, dataUpdate }) => {
    try {
      const data = await APIService._putVoucher({
        idCode,
        dataUpdate,
      });
      return data;
    } catch (error) {}
  }
);

export const _reducerFetchDeleteVoucher = createAsyncThunk(
  "store/voucher/detele",
  async (idCode) => {
    try {
      const data = await APIService._deleteVoucher(idCode);
      return data;
    } catch (error) {}
  }
);

export const _reducerFetchPostVoucher = createAsyncThunk(
  "store/voucher/post",
  async (dataAdd) => {
    try {
      const data = await APIService._postVoucher(dataAdd);
      return data;
    } catch (error) {}
  }
);
