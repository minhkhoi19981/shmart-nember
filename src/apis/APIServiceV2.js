import UserService from "./UserService";
import { message, notification } from "antd";

import "regenerator-runtime/runtime";

class APIServiceV2 {
  constructor() {
    if (!APIServiceV2.instance) {
      APIServiceV2.instance = this;
    }
    this.ConfigHost = process.env.DB_HOST_v2;
    return APIServiceV2.instance;
  }

  queryParams(params) {
    return Object.keys(params)
      .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
      .join("&");
  }

  get(func, params = {}) {
    var query = this.queryParams(params);
    var url = this.ConfigHost + func;
    if (query) {
      url += "?" + query;
    }

    // console.log('GET: ' + url);dđ
    var token = UserService._getToken();
    return new Request(url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
  }

  post(func, params = {}) {
    var url = this.ConfigHost + func;
    // console.log('POST: ' + url);
    console.log(params);
    var token = UserService._getToken();
    return new Request(url, {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
  }

  put(func, params = {}) {
    var url = this.ConfigHost + func;
    // console.log('POST: ' + url);
    console.log(params);
    var token = UserService._getToken();
    return new Request(url, {
      method: "PUT",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
  }

  delete(func, params = {}) {
    var url = this.ConfigHost + func;
    // console.log('POST: ' + url);
    console.log(params);
    var token = UserService._getToken();
    return new Request(url, {
      method: "DELETE",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
  }
  openNotificationWithIcon = (title) => {
    notification.error({
      message: "Thông báo",
      description: title,
      placement: "topLeft",
    });
  };

  multipart = (func, body) => {
    try {
      var url = this.ConfigHost + func;
      let formData = new FormData(); //formdata object

      //   formData.append("name", "ABC"); //append the values with key, value pair
      //   formData.append("age", 20);

      if (body) {
        Object.keys(body).forEach((item) => {
          var obj = body[item];
          if (Array.isArray(obj)) {
            for (let i = 0; i < obj.length; i++) {
              formData.append(item, obj[i]);
            }
          } else {
            formData.append(item, body[item]);
          }
        });
      }
      var token = UserService._getToken();
      // console.log(token);
      var request = new Request(url, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: "Bearer " + token,
          token: token,
        },
      });
      return request;
    } catch (error) {
      //this.handleError(error.code, error.message);
      throw error;
    }
  };

  execute = async (request) => {
    try {
      const response = await fetch(request);
      const responseJson = await response.json();
      if (response.status !== 200) {
        this.openNotificationWithIcon(responseJson.message);
        return {
          code: "Fail",
          message: responseJson.message,
          statusText: response.statusText,
        };
      }

      if (request.method === "POST") {
        console.log(request.body);
      }
      // console.log(response);
      if (response.status === 200) {
        return { ...responseJson, code: "Sucess" };
      }

      throw responseJson.message;
    } catch (message) {
      console.log(message);
    }
  };

  getDefaultParams = () => {
    // eslint-disable-next-line no-new-object
    var params = new Object();
    return params;
  };

  _postLoginAuth = async ({ username, password }) => {
    try {
      var params = this.getDefaultParams();
      params = { ...params, ...{ username, password } };

      let request = this.post("/users/authenticate", params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _postRegisterAuth = async (dataPost) => {
    try {
      var params = this.getDefaultParams();
      params = { ...params, ...dataPost };

      let request = this.post("/users/register", params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _getListOrder = async ({ page, limit, status, start_date, end_date }) => {
    try {
      var params = this.getDefaultParams();
      params = {
        ...params,
        ...{ page, limit, status, start_date, end_date },
      };
      let request = this.get("/orders", params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _postDeleteOrder = async (orderId) => {
    try {
      var params = this.getDefaultParams();
      let request = this.delete(`/invoices/${orderId}`);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  //REPORT
  _getListReport = async ({ page, limit }) => {
    try {
      var params = this.getDefaultParams();
      params = { ...params, ...{ page, limit } };
      let request = this.get("/reports", params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _getReportCount = async () => {
    try {
      var params = this.getDefaultParams();
      let request = this.get(`/reports/count`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _postReport = async (dataAdd) => {
    try {
      var params = this.getDefaultParams();
      params = { ...dataAdd };
      let request = this.post(`/reports`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _postDeleteReport = async (reportId) => {
    try {
      var params = this.getDefaultParams();
      let request = this.delete(`/reports/${reportId}`);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _putReportItem = async (reportId, dataUpdate) => {
    try {
      var params = this.getDefaultParams();
      params = { ...dataUpdate };
      let request = this.put(`/reports/${reportId}`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _getReportDetailItem = async (reportId) => {
    try {
      var params = this.getDefaultParams();
      let request = this.get(`/reports/${reportId}`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _putInvoicesItem = async (orderID, dataUpdate) => {
    try {
      var params = this.getDefaultParams();
      params = { ...dataUpdate };
      let request = this.put(`/invoices/${orderID}`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _getInvoicesCount = async () => {
    try {
      var params = this.getDefaultParams();
      let request = this.get(`/invoices/count`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _getInvoicesDeatailItem = async (invoices_id) => {
    try {
      var params = this.getDefaultParams();
      let request = this.get(`/invoices/${invoices_id}`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _getListWarehouses = async ({ page, limit }) => {
    try {
      var params = this.getDefaultParams();
      params = { ...params, ...{ page, limit } };
      let request = this.get("/warehouses", params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _getWarehouseCount = async () => {
    try {
      var params = this.getDefaultParams();
      let request = this.get(`/warehouses/count`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _getWarehouseDeatailItem = async (warehouses_id) => {
    try {
      var params = this.getDefaultParams();
      let request = this.get(`/warehouses/${warehouses_id}`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _getListCategory = async () => {
    try {
      var params = this.getDefaultParams();
      let request = this.get(`/categories`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _postAddWarehouse = async (dataAdd) => {
    try {
      var params = this.getDefaultParams();
      params = { ...dataAdd };
      let request = this.post(`/warehouses`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _deleteWarehouse = async (warehouses_id) => {
    try {
      var params = this.getDefaultParams();
      let request = this.delete(`/warehouses/${warehouses_id}`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _putUpdateWarehouse = async (warehouses_id, dataUpdate) => {
    try {
      var params = this.getDefaultParams();
      params = { ...dataUpdate };
      let request = this.put(`/warehouses/${warehouses_id}`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _getListAccount = async ({ page, limit }) => {
    try {
      var params = this.getDefaultParams();
      params = { ...params, ...{ page, limit } };

      let request = this.get(`/users`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _getListWallet = async ({ page, limit, q }) => {
    try {
      var params = this.getDefaultParams();
      params = { ...params, ...{ page, limit, q } };

      let request = this.get(`/admin/request`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _postRequestWallet = async (dataAdd, id) => {
    try {
      var params = this.getDefaultParams();
      params = { ...dataAdd };
      let request = this.post(`/admin/request/${id}`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _getAccountCount = async () => {
    try {
      var params = this.getDefaultParams();
      let request = this.get(`/users/count`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _getAccountDeatailItem = async (account_id) => {
    try {
      var params = this.getDefaultParams();
      let request = this.get(`/users/${account_id}`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _deleteAccount = async (account_id) => {
    try {
      var params = this.getDefaultParams();
      let request = this.delete(`/users/${account_id}`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _getListRole = async () => {
    try {
      var params = this.getDefaultParams();
      let request = this.get(`/roles`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };
  _getItemRole = async (id_role) => {
    try {
      var params = this.getDefaultParams();
      let request = this.get(`/roles/${id_role}`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _putRoleItem = async (idAccount, dataUpdate) => {
    try {
      var params = this.getDefaultParams();
      params = { ...dataUpdate };
      let request = this.put(`/users/${idAccount}`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _deleteRoles = async (idRoles) => {
    try {
      var params = this.getDefaultParams();
      let request = this.delete(`/roles/${idRoles}`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _postRoles = async (dataAdd) => {
    try {
      var params = this.getDefaultParams();
      params = { ...dataAdd };
      let request = this.post(`/roles`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _putRolesItemPermission = async (idRoles, dataUpdate) => {
    try {
      var params = this.getDefaultParams();
      params = { ...dataUpdate };
      let request = this.put(`/roles/${idRoles}`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _getListStations = async ({ page, limit }) => {
    try {
      var params = this.getDefaultParams();
      params = { ...params, ...{ page, limit } };

      let request = this.get(`/stations`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _getStationsCount = async () => {
    try {
      var params = this.getDefaultParams();
      let request = this.get(`/stations/count`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _deleteStations = async (idStations) => {
    try {
      var params = this.getDefaultParams();
      let request = this.delete(`/stations/${idStations}`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _getItemStations = async (id_role) => {
    try {
      var params = this.getDefaultParams();
      let request = this.get(`/stations/${id_role}`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _postStations = async (dataAdd) => {
    try {
      var params = this.getDefaultParams();
      params = { ...dataAdd };
      let request = this.post(`/stations`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _putStations = async (idStations, dataUpdate) => {
    try {
      var params = this.getDefaultParams();
      params = { ...dataUpdate };
      let request = this.put(`/stations/${idStations}`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _getListImportWarehouse = async ({ page, limit }) => {
    try {
      var params = this.getDefaultParams();
      params = { ...params, ...{ page, limit } };

      let request = this.get(`/import_warehouse`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _getItemImportWarehouse = async (id_import_warehouse) => {
    try {
      var params = this.getDefaultParams();
      let request = this.get(
        `/import_warehouse/${id_import_warehouse}`,
        params
      );
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _deleteImportWarehouse = async (id_import_warehouse) => {
    try {
      var params = this.getDefaultParams();
      let request = this.delete(
        `/import_warehouse/${id_import_warehouse}`,
        params
      );
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _postImportWarehouse = async (dataAdd) => {
    try {
      var params = this.getDefaultParams();
      params = { ...dataAdd };
      let request = this.post(`/import_warehouse`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _putImportWarehouse = async (id_import_warehouse, dataUpdate) => {
    try {
      var params = this.getDefaultParams();
      params = { ...dataUpdate };
      let request = this.put(
        `/import_warehouse/${id_import_warehouse}`,
        params
      );
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _getImportWarehouseCount = async () => {
    try {
      var params = this.getDefaultParams();
      let request = this.get(`/import_warehouse/count`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _getListExportWarehouse = async ({ page, limit }) => {
    try {
      var params = this.getDefaultParams();
      params = { ...params, ...{ page, limit } };

      let request = this.get(`/export_warehouse`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _getItemExportWarehouse = async (id_export_warehouse) => {
    try {
      var params = this.getDefaultParams();
      let request = this.get(
        `/export_warehouse/${id_export_warehouse}`,
        params
      );
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _deleteExportWarehouse = async (id_export_warehouse) => {
    try {
      var params = this.getDefaultParams();
      let request = this.delete(
        `/export_warehouse/${id_export_warehouse}`,
        params
      );
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _postExportWarehouse = async (dataAdd) => {
    try {
      var params = this.getDefaultParams();
      params = { ...dataAdd };
      let request = this.post(`/export_warehouse`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _putExportWarehouse = async (id_export_warehouse, dataUpdate) => {
    try {
      var params = this.getDefaultParams();
      params = { ...dataUpdate };
      let request = this.put(
        `/export_warehouse/${id_export_warehouse}`,
        params
      );
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _getExportWarehouseCount = async () => {
    try {
      var params = this.getDefaultParams();
      let request = this.get(`/export_warehouse/count`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _getListCode = async () => {
    try {
      var params = this.getDefaultParams();
      let request = this.get(`/code`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _putCode = async ({ idCode, dataUpdate }) => {
    try {
      var params = this.getDefaultParams();
      params = { ...dataUpdate };
      let request = this.put(`/code/${idCode}`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _deleteCode = async (idCode) => {
    try {
      var params = this.getDefaultParams();
      let request = this.delete(`/code/${idCode}`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _postCode = async (dataAdd) => {
    try {
      var params = this.getDefaultParams();
      params = { ...dataAdd };
      let request = this.post(`/code/code-gen-v0`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _putRolesItemCode = async (idCode, dataUpdate) => {
    try {
      var params = this.getDefaultParams();
      params = { ...dataUpdate };
      let request = this.put(`/code/${idCode}`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  //Voucher
  _getListVoucher = async () => {
    try {
      var params = this.getDefaultParams();
      let request = this.get(`/voucher`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _putVoucher = async ({ idCode, dataUpdate }) => {
    try {
      var params = this.getDefaultParams();
      params = { ...dataUpdate };
      let request = this.put(`/voucher/${idCode}`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _deleteVoucher = async (idCode) => {
    try {
      var params = this.getDefaultParams();
      let request = this.delete(`/voucher/${idCode}`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _postVoucher = async (dataAdd) => {
    try {
      var params = this.getDefaultParams();
      params = { ...dataAdd };
      let request = this.post(`/voucher`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _putRolesItemVoucher = async (idCode, dataUpdate) => {
    try {
      var params = this.getDefaultParams();
      params = { ...dataUpdate };
      let request = this.put(`/voucher/${idCode}`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _uploadImage = async (image) => {
    try {
      var params = this.getDefaultParams();
      params.image = image;
      let request = this.multipart("/upload-image", params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _getDetailVoucher = async (idVoucher) => {
    try {
      var params = this.getDefaultParams();
      let request = this.get(`/voucher/${idVoucher}`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _getListProduct = async ({ page, limit }) => {
    try {
      var params = this.getDefaultParams();
      params = { ...params, ...{ page, limit } };
      let request = this.get(`/products-kv`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };
  _deleteProduct = async (idProduct) => {
    try {
      var params = this.getDefaultParams();
      let request = this.delete(`/products/${idProduct}`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };
  _putCashBackProduct = async (dataUpdate, id) => {
    try {
      var params = this.getDefaultParams();
      params = { ...dataUpdate };
      let request = this.put(`/products-kv/${id}`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _getDetailProduct = async (idProduct) => {
    try {
      var params = this.getDefaultParams();
      let request = this.get(`/products/${idProduct}`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _postProduct = async (dataAdd) => {
    try {
      var params = this.getDefaultParams();
      params = { ...dataAdd };
      let request = this.post(`/products`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _putRolesItemProduct = async (idCode, dataUpdate) => {
    try {
      var params = this.getDefaultParams();
      params = { ...dataUpdate };
      let request = this.put(`/products/${idCode}`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _getDetailCate = async (idCate) => {
    try {
      var params = this.getDefaultParams();
      let request = this.get(`/categories/${idCate}`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _deleteCate = async (idCate) => {
    try {
      var params = this.getDefaultParams();
      let request = this.delete(`/categories/${idCate}`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _postCate = async (dataAdd) => {
    try {
      var params = this.getDefaultParams();
      params = { ...dataAdd };
      let request = this.post(`/categories`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _putRolesItemCate = async (idCode, dataUpdate) => {
    try {
      var params = this.getDefaultParams();
      params = { ...dataUpdate };
      let request = this.put(`/categories/${idCode}`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _postUpdateStatus = async (dataAdd, id) => {
    try {
      var params = this.getDefaultParams();
      params = { ...dataAdd };
      let request = this.post(`/orders/${id}/change-status`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _postNews = async (dataAdd) => {
    try {
      var params = this.getDefaultParams();
      params = { ...dataAdd };
      let request = this.post(`/admin/news`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _getListNew = async ({ category_name, page, limit }) => {
    try {
      var params = this.getDefaultParams();
      params = { ...params, ...{ page, limit, category_name } };
      let request = this.get(`/news`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _getListProductViral = async ({ status, page, limit, type }) => {
    try {
      var params = this.getDefaultParams();
      params = { ...params, ...{ status, page, limit, type } };
      let request = this.get(`/products-viral`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };
  _postProductViral = async (dataAdd) => {
    try {
      var params = this.getDefaultParams();
      params = { ...dataAdd };
      let request = this.post(`/admin/products-viral`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _postCreateOrder = async (dataAdd) => {
    try {
      var params = this.getDefaultParams();
      params = { ...dataAdd };
      let request = this.post(`/orders`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };


  _postCreateRequest = async (dataAdd) => {
    try {
      var params = this.getDefaultParams();
      params = { ...dataAdd };
      let request = this.post(`/request`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };

  _getStatisticOrder = async ({ start_date, end_date }) => {
    try {
      var params = this.getDefaultParams();
      params = { ...params, ...{ start_date, end_date } };
      let request = this.get(`/statistic-order/group-date`, params);
      let data = await this.execute(request);
      return data;
    } catch (error) {
      throw error;
    }
  };
}

const instance = new APIServiceV2();
Object.freeze(instance);
export default instance;
