import { createAsyncThunk } from "@reduxjs/toolkit";
import { APIService } from "../../apis";

export const _reducerFetchListRoles = createAsyncThunk(
  "store/roles",
  async () => {
    try {
      const data = await APIService._getListRole();
      data._Array.map((item, index) => {
        item.stt = index + 1;
      });
      return data;
    } catch (error) {}
  }
);

export const _reducerFetchDetailRoles = createAsyncThunk(
  "store/roles/detail",
  async (id_role) => {
    try {
      const data = await APIService._getItemRole(id_role);
      return data;
    } catch (error) {}
  }
);

export const _reducerFetchDeleteRoles = createAsyncThunk(
  "store/roles/delete",
  async (id_role) => {
    try {
      const data = await APIService._deleteRoles(id_role);
      return data;
    } catch (error) {}
  }
);

export const _reducerFetchPostRoles = createAsyncThunk(
  "store/roles/add",
  async (dataAdd) => {
    try {
      const data = await APIService._postRoles(dataAdd);
      return data;
    } catch (error) {}
  }
);

export const _reducerFetchPutRolesUpdate = createAsyncThunk(
  "store/roles/update",
  async (idRoles, dataUpdate) => {
    try {
      
      const data = await APIService._putRolesItemPermission(
        idRoles,
        dataUpdate
      );
      return data;
    } catch (error) {}
  }
);
