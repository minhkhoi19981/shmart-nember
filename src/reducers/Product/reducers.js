import { createAsyncThunk } from "@reduxjs/toolkit";
import { APIService, APIServiceV2 } from "../../apis";

export const _reducerFetchListProduct = createAsyncThunk(
  "store/product",
  async ({ page, limit }) => {
    try {
      const data = await APIServiceV2._getListProduct({ page, limit });
      data._Array.map((item, index) => {
        item.stt = (page - 1) * limit + index + 1;
      });
      return data;
    } catch (error) {}
  }
);

export const _reducerFetchPostProduct = createAsyncThunk(
  "store/product/post",
  async (dataAdd) => {
    try {
      const data = await APIService._postProduct(dataAdd);
      return data;
    } catch (error) {}
  }
);

export const _reducerFetchPostCate = createAsyncThunk(
  "store/cate/post",
  async (dataAdd) => {
    try {
      const data = await APIService._postCate(dataAdd);
      return data;
    } catch (error) {}
  }
);
