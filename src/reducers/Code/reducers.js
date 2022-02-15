import { createAsyncThunk } from "@reduxjs/toolkit";
import { APIService } from "../../apis";

export const _reducerFetchListCode = createAsyncThunk("code/list", async () => {
  try {
    const data = await APIService._getListCode();
    return data;
  } catch (error) {}
});

export const _reducerFetchPutCodeUpdate = createAsyncThunk(
  "store/code/update",
  async ({ idCode, dataUpdate }) => {
    try {
      const data = await APIService._putCode({
        idCode,
        dataUpdate,
      });
      return data;
    } catch (error) {}
  }
);

export const _reducerFetchDeleteCode = createAsyncThunk(
  "store/code/detele",
  async (idCode) => {
    try {
      const data = await APIService._deleteCode(idCode);
      return data;
    } catch (error) {}
  }
);

export const _reducerFetchPostCode = createAsyncThunk(
  "store/code/post",
  async (dataAdd) => {
    try {
      const data = await APIService._postCode(dataAdd);
      return data;
    } catch (error) {}
  }
);
