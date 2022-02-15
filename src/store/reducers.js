import { createSlice } from "@reduxjs/toolkit";
import { _reducerFetchListCate } from "../reducers/Cate/reducers";
import {
  _reducerFetchPostLoginAuth,
  _reducerFetchPostRegisterAuth,
} from "../reducers/Login/reducers";

import { _reducerFetchListRoles } from "../reducers/Role/reducers";
import { _reducerFetchListStations } from "../reducers/Stations/reducers";

const initialStore = {
  errorLogin: false,
  username: "",
  password: "",
  info: {},
  cate: [],
  roles: [],
  stations: [],
  data: [
    {
      key: "1",
      name: "John Brown",
      age: 32,
      dateTime: "10/9/2020",
      address: "New York No. 1 Lake Park",
      tags: ["nice", "developer"],
    },
    {
      key: "2",
      name: "Jim Green",
      age: 42,
      dateTime: "10/12/2020",

      address: "London No. 1 Lake Park",
      tags: ["loser"],
    },
    {
      key: "3",
      name: "Joe Black",
      age: 32,
      dateTime: "22/9/2020",
      address: "Sidney No. 1 Lake Park",
      tags: ["cool", "teacher"],
    },
  ],
};
const storeReducers = createSlice({
  name: "store",
  initialState: initialStore,
  reducers: {
    ADD_ACCOUNT: (state, action) => {
      state.data.unshift(action.payload);
    },
    ACTION_LOGIN_SIGUP: (state, action) => {
      state.username = action.payload.username;
      state.password = action.payload.password;
    },
  },
  extraReducers: {
    [_reducerFetchPostLoginAuth.fulfilled]: (state, action) => {
      if (action.payload.roles === "admin") {
        state.info = action.payload;
      }
    },

    [_reducerFetchPostRegisterAuth.fulfilled]: (state, action) => {},
    // [_reducerFetchListCate.fulfilled]: (state, action) => {
    //   const cateActive = action.payload.filter((item) => item.activated);
    //   state.cate = cateActive;
    // },

    [_reducerFetchListRoles.fulfilled]: (state, action) => {
      const dataRolesActive = action.payload._Array.filter(
        (item) => item.is_verified === true
      );
      state.roles = dataRolesActive;
    },

    [_reducerFetchListStations.fulfilled]: (state, action) => {
      const dataStoreActive = action.payload._Array.filter(
        (item) => item.is_activated === false
      );
      state.stations = dataStoreActive;
    },
  },
});

const { reducer, actions } = storeReducers;

export const { ADD_ACCOUNT, ACTION_LOGIN_SIGUP } = actions;

export default reducer;
