import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { APIService, UserService } from "../../apis";

export const _reducerFetchListCate = createAsyncThunk(
  "store/cate/list",
  async () => {
    try {
      await axios({
        method: "get",
        url: `${process.env.DB_HOST}/categories`,
        headers: {
          Authorization: "Bearer " + UserService._getToken(),
        },
      })
        .then(function (response) {
          
          return response.data;
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
    } catch (error) {}
  }
);
