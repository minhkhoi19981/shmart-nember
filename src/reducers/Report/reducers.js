import { createAsyncThunk } from "@reduxjs/toolkit";
import { APIService } from "../../apis";

export const _reducerFetchListReport = createAsyncThunk(
  "store/reports",
  async ({ page, limit }) => {
    try {
      const data = await APIService._getListReport({ page, limit });
      data._Array.map((item, index) => {
        item.stt = (page - 1) * limit + index + 1;
      });
      return data;
    } catch (error) {}
  }
);

export const _reducerFetchCountReport = createAsyncThunk(
  "store/reports/count",
  async () => {
    try {
      const data = await APIService._getReportCount();
      return data;
    } catch (error) {}
  }
);

export const _reducerFetchDeleteReport = createAsyncThunk(
  "store/reports/detele",
  async (id) => {
    try {
      const data = await APIService._postDeleteReport(id);
      return data;
    } catch (error) {}
  }
);

export const _reducerFetchReportItem = createAsyncThunk(
  "store/reports/detail",
  async (id) => {
    try {
      const data = await APIService._getReportDetailItem(id);
      return data;
    } catch (error) {}
  }
);

export const _reducerFetchReportCreate = createAsyncThunk(
  "store/reports/create",
  async (dataAdd) => {
    try {
      const data = await APIService._postReport(dataAdd);
      return data;
    } catch (error) {}
  }
);

export const _reducerFetchReportUpdate = createAsyncThunk(
  "store/reports/update",
  async (id, dataUpdate) => {
    try {
      
      const data = await APIService._putReportItem(id, dataUpdate);
      return data;
    } catch (error) {}
  }
);
