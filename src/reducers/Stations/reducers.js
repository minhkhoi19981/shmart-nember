import { createAsyncThunk } from "@reduxjs/toolkit";
import { APIService } from "../../apis";

export const _reducerFetchListStations = createAsyncThunk(
  "store/stations",
  async ({ page, limit }) => {
    try {
      const data = await APIService._getListStations({ page, limit });
      data._Array.map((item, index) => {
        item.stt = (page - 1) * limit + index + 1;
      });
      return data;
    } catch (error) {}
  }
);

export const _reducerFetchCountStations = createAsyncThunk(
  "store/stations/count",
  async () => {
    try {
      const data = await APIService._getStationsCount();
      return data;
    } catch (error) {}
  }
);

export const _reducerFetchDeleteStations = createAsyncThunk(
  "store/stations/detele",
  async (idStations) => {
    try {
      const data = await APIService._deleteStations(idStations);
      return data;
    } catch (error) {}
  }
);

export const _reducerFetchStationsItem = createAsyncThunk(
  "store/stations/detail",
  async (idStations) => {
    try {
      const data = await APIService._getItemStations(idStations);
      return data;
    } catch (error) {}
  }
);

export const _reducerFetchStationsCreate = createAsyncThunk(
  "store/stations/create",
  async (dataAdd) => {
    try {
      const data = await APIService._postStations(dataAdd);
      return data;
    } catch (error) {}
  }
);

export const _reducerFetchStationsUpdate = createAsyncThunk(
  "store/stations/update",
  async (idStations, dataUpdate) => {
    try {
      
      const data = await APIService._putStations(idStations, dataUpdate);
      return data;
    } catch (error) {}
  }
);
