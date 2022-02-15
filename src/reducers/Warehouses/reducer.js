import { createAsyncThunk } from "@reduxjs/toolkit";
import { APIService } from "../../apis";

export const _reducerFetchListImportWarehouse = createAsyncThunk(
  "store/warehouses/import",
  async ({ page, limit }) => {
    try {
      const data = await APIService._getListImportWarehouse({ page, limit });
      let sumPrice = 0;
      data._Array.map((item, index) => {
        item.stt = (page - 1) * limit + index + 1;
        item.product_list.forEach((item1) => {
          sumPrice += item1.total_price;
        });
        item.product_price = sumPrice;
        sumPrice = 0;
      });
      return data;
    } catch (error) {}
  }
);

export const _reducerFetchCountImportWarehouse = createAsyncThunk(
  "store/warehouses/import/count",
  async () => {
    try {
      const data = await APIService._getImportWarehouseCount();
      return data;
    } catch (error) {}
  }
);

export const _reducerFetchDeleteImportWarehouse = createAsyncThunk(
  "store/warehouses/import/detele",
  async (id_import_warehouse) => {
    try {
      const data = await APIService._deleteImportWarehouse(id_import_warehouse);
      return data;
    } catch (error) {}
  }
);

export const _reducerFetchImportWarehouseItem = createAsyncThunk(
  "store/warehouses/import/detail",
  async (id_import_warehouse) => {
    try {
      const data = await APIService._getItemImportWarehouse(
        id_import_warehouse
      );
      return data;
    } catch (error) {}
  }
);

export const _reducerFetchImportWarehouseCreate = createAsyncThunk(
  "store/warehouses/import/create",
  async (dataAdd) => {
    try {
      const data = await APIService._postImportWarehouse(dataAdd);
      return data;
    } catch (error) {}
  }
);

export const _reducerFetchImportWareUpdate = createAsyncThunk(
  "store/warehouses/import/edit",
  async (id_import_warehouse, dataUpdate) => {
    try {
      const data = await APIService._putImportWarehouse(
        id_import_warehouse,
        dataUpdate
      );
      return data;
    } catch (error) {}
  }
);

export const _reducerFetchListExportWarehouse = createAsyncThunk(
  "store/warehouses/export",
  async ({ page, limit }) => {
    try {
      const data = await APIService._getListExportWarehouse({ page, limit });
      let sumPrice = 0;
      data._Array.map((item, index) => {
        item.stt = (page - 1) * limit + index + 1;
        item.product_list.forEach((item1) => {
          sumPrice += item1.total_price;
        });
        item.product_price = sumPrice;
      });
      return data;
    } catch (error) {}
  }
);

export const _reducerFetchCountExportWarehouse = createAsyncThunk(
  "store/warehouses/export/count",
  async () => {
    try {
      const data = await APIService._getExportWarehouseCount();
      return data;
    } catch (error) {}
  }
);

export const _reducerFetchDeleteExportWarehouse = createAsyncThunk(
  "store/warehouses/export/detele",
  async (id_export_warehouse) => {
    try {
      const data = await APIService._deleteExportWarehouse(id_export_warehouse);
      return data;
    } catch (error) {}
  }
);

export const _reducerFetchExportWarehouseItem = createAsyncThunk(
  "store/warehouses/export/detail",
  async (id_export_warehouse) => {
    try {
      const data = await APIService._getItemExportWarehouse(
        id_export_warehouse
      );
      return data;
    } catch (error) {}
  }
);

export const _reducerFetchExportWarehouseCreate = createAsyncThunk(
  "store/warehouses/export/create",
  async (dataAdd) => {
    try {
      const data = await APIService._postExportWarehouse(dataAdd);
      return data;
    } catch (error) {}
  }
);

export const _reducerFetchExportWareUpdate = createAsyncThunk(
  "store/warehouses/export/edit",
  async (id_export_warehouse, dataUpdate) => {
    try {
      const data = await APIService._putExportWarehouse(
        id_export_warehouse,
        dataUpdate
      );
      return data;
    } catch (error) {}
  }
);
