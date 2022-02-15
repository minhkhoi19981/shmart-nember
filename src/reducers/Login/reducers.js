import { createAsyncThunk } from "@reduxjs/toolkit";
import { APIService, UserService } from "../../apis";

export const _reducerFetchPostLoginAuth = createAsyncThunk(
  "store/user/auth",
  async ({ username, password }) => {
    try {
      const data = await APIService._postLoginAuth({ username, password });
      
      UserService._setToken(data.token);
      UserService._setData(data.username);

      UserService._setID(data._id);
      return data;
    } catch (error) {}
  }
);

export const _reducerFetchPostRegisterAuth = createAsyncThunk(
  "store/user/register",
  async (dataRegister) => {
    try {
      const data = await APIService._postRegisterAuth(dataRegister);
      return data;
    } catch (error) {}
  }
);
