import {
  Col,
  Drawer,
  Input,
  Row,
  Form,
  notification,
  Space,
  Button,
  InputNumber,
  message,
  Upload,
} from "antd";

import React, { useEffect, useState } from "react";
import { ISelect } from "../../common";
import PropTypes from "prop-types";

import TextArea from "antd/lib/input/TextArea";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { APIService, UserService } from "../../apis";
import { PlusOutlined } from "@ant-design/icons";
import { _reducerFetchPostProduct } from "../../reducers/Product/reducers";
import axios from "axios";

export default function CreateProduct(props) {
  const {
    visibleCreate,
    onCreateCallback,
    onCloseCallback,
    edit,
    dataEdit,
  } = props;

  const [listImg, setListImg] = useState([]);
  const [list_warehouse, setListWarehouses] = useState([]);
  const [list_cate, setListCate] = useState([]);

  const [form] = Form.useForm();

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const dispatch = useDispatch();

  const openNotificationWithIcon = (title) => {
    notification.error({
      message: "Thông báo",
      description: title,
      placement: "topLeft",
    });
  };

  const _fetchAPIListCate = async () => {
    try {
      await axios({
        method: "get",
        url: `${process.env.DB_HOST}/categories`,
        headers: {
          Authorization: "Bearer " + UserService._getToken(),
        },
      })
        .then(function (response) {
          setListCate([
            ...response.data.filter((item) => item.activated === true),
          ]);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  useEffect(() => {
    _fetchAPIListCate();
  }, []);

  const _fetchAPIListWarehouses = async () => {
    try {
      const data = await APIService._getListWarehouses({
        page: 1,
        limit: 1000,
      });
      data._Array.map((item) => {
        item.id = JSON.stringify({
          title: item.title,
          full_name: item.full_name,
          partner_name: item.partner_name,
        });
      });
      setListWarehouses([...data._Array]);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  useEffect(() => {
    _fetchAPIListWarehouses();
  }, []);

  const _fetchAPIPostAddProduct = async (dataAdd) => {
    try {
      const data = await dispatch(_reducerFetchPostProduct(dataAdd));
      const currentCode = unwrapResult(data);
      if (currentCode.code === "Fail") {
        return openNotificationWithIcon(currentCode.message);
      }
      message.success("Tạo thành công");

      form.resetFields([
        "product_images",
        "product_name",
        "product_code",
        "product_serial",
        "product_type",
        "product_characteristics",
        "product_color",
        "is_activated",
        "product_currency",
        "import_for_warehouse",
        "product_inventory",
        "product_price",
        "product_discount_price",
        "product_quantily",
        "product_contry",
        "product_details",
        "product_amount",
        "full_name",
        "partner_name",
      ]);
      setListImg([]);
      onCreateCallback();
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingSubmit(false);
    }
  };

  const _fetchAPIPostUpdateVoucher = async (idCode, dataUpdate) => {
    try {
      const data = await APIService._putRolesItemProduct(idCode, dataUpdate);

      if (data.code === "Fail") {
        return openNotificationWithIcon(data.message);
      }
      message.success("Chỉnh sửa thành công");
      form.resetFields([
        "product_images",
        "product_name",
        "product_code",
        "product_serial",
        "product_type",
        "product_characteristics",
        "product_color",
        "is_activated",
        "product_currency",
        "import_for_warehouse",
        "product_inventory",
        "product_price",
        "product_discount_price",
        "product_quantily",
        "product_contry",
        "product_details",
        "product_amount",
        "full_name",
        "partner_name",
      ]);
      setListImg([]);

      onCreateCallback();
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingSubmit(false);
    }
  };

  useEffect(() => {
    if (edit) {
      form.setFieldsValue({
        ...dataEdit,
        product_images: dataEdit.product_images,
        product_discount_price: dataEdit.product_discount_price,
        product_quantily: dataEdit.product_quantily,
        product_color: dataEdit.product_color,
        product_characteristics: dataEdit.product_characteristics,
        product_price: dataEdit.product_price,
        is_activated: dataEdit.is_activated ? "Hoạt động" : "Ngưng hoạt động",
        full_name: dataEdit.full_name,
        partner_name: dataEdit.partner_name,
      });
      setListImg([
        {
          uid: -1,
          name: dataEdit.product_images[0],
          status: "done",
          url: dataEdit.product_images[0],
        },
      ]);
    }
  }, [edit]);

  return (
    <div>
      <Drawer
        visible={visibleCreate}
        title={edit ? "CHỈNH SỬA SẢN PHẨM" : "TẠO SẢN PHẨM"}
        width={"40%"}
        onClose={() => {
          onCloseCallback();
          form.resetFields([
            "product_images",
            "product_name",
            "product_code",
            "product_serial",
            "product_type",
            "product_characteristics",
            "product_color",
            "is_activated",
            "product_currency",
            "import_for_warehouse",
            "product_inventory",
            "product_price",
            "product_discount_price",
            "product_quantily",
            "product_contry",
            "product_details",
            "product_amount",
            "full_name",
            "partner_name",
          ]);
          setListImg([]);
        }}
      >
        <Form
          layout="vertical"
          hideRequiredMark
          form={form}
          onFinish={async (value) => {
            if (edit) {
              const dataUpdate = {
                ...value,
                product_images: value.product_images,
                product_discount_price: `${value.product_discount_price}`,
                product_quantily: `${value.product_quantily}`,
                product_price: `${value.product_price}`,
                product_color: `${value.product_color}`,
                product_characteristics: `${value.product_characteristics}`,
                created_by: new Date(),
                is_activated: value.is_activated === "Hoạt động",
                full_name: value.full_name,
                partner_name: value.partner_name,
              };

              setLoadingSubmit(true);
              _fetchAPIPostUpdateVoucher(dataEdit.id, dataUpdate);
            } else {
              const dataAdd = {
                ...value,
                product_images: [value.product_images],
                product_discount_price: `${value.product_discount_price}`,
                product_quantily: `${value.product_quantily}`,
                product_price: `${value.product_price}`,
                product_color: `${value.product_color}`,
                product_characteristics: `${value.product_characteristics}`,
                created_by: new Date(),
                is_activated: value.is_activated === "Hoạt động",
                product_code: `SHMart_${Math.floor(
                  Math.random() * 1000001
                )}_${Math.floor(Math.random() * 1000001)}`,
                full_name: value.full_name,
                partner_name: value.partner_name,
              };
              setLoadingSubmit(true);
              await _fetchAPIPostAddProduct(dataAdd);
            }
          }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <div
                style={{
                  textAlign: "right",
                }}
              >
                <Space align="middle">
                  <Button
                    style={{ marginRight: 8 }}
                    onClick={() => {
                      form.resetFields([
                        "product_images",
                        "product_name",
                        "product_code",
                        "product_serial",
                        "product_type",
                        "product_characteristics",
                        "product_color",
                        "is_activated",
                        "product_currency",
                        "import_for_warehouse",
                        "product_inventory",
                        "product_price",
                        "product_discount_price",
                        "product_quantily",
                        "product_contry",
                        "product_details",
                        "product_amount",
                        "full_name",
                        "partner_name",
                      ]);
                      onCloseCallback();
                    }}
                  >
                    Hủy bỏ
                  </Button>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loadingSubmit}
                    >
                      {edit ? "Cập nhật" : "Lưu"}
                    </Button>
                  </Form.Item>
                </Space>
              </div>
            </Col>
            <Col span={24}>
              <Form.Item
                name="product_images"
                label="Hình ảnh"
                hasFeedback
                rules={[{ required: true, message: "Vui lòng chọn hình." }]}
              >
                <Upload
                  listType="picture-card"
                  fileList={listImg}
                  onChange={async ({ file }) => {
                    try {
                      if (file.status === "uploading") {
                        const data = await APIService._uploadImage(
                          file.originFileObj
                        );
                        form.setFieldsValue({
                          product_images: `https://cms.shmart.vn/images/${data.attachment.filename}`,
                        });
                        setListImg([
                          {
                            uid: -1,
                            name: data.attachment.filename,
                            status: "done",
                            url: `https://cms.shmart.vn/images/${data.attachment.filename}`,
                          },
                        ]);
                      } else {
                        setListImg([]);
                      }
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                >
                  {listImg.length < 1 && (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="import_for_warehouse"
                label="Đối tác"
                hasFeedback
                rules={[{ required: true, message: "Vui lòng chọn đối tác." }]}
              >
                <ISelect
                  dataOption={list_warehouse}
                  keyName="id"
                  valueName="title"
                  placeholder="Vui lòng chọn đối tác"
                  onChange={(key, option) => {
                    const dataParse = JSON.parse(option.key);
                    form.setFieldsValue({
                      full_name: dataParse.full_name,
                      partner_name: dataParse.partner_name,
                    });
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item hasFeedback name="full_name" label="Kho">
                <Input placeholder="Chưa có thông tin" disabled={true} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item hasFeedback name="partner_name" label="Đối tác">
                <Input placeholder="Chưa có thông tin" disabled={true} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="product_name"
                label="Tên sản phẩm"
                hasFeedback
                rules={[
                  { required: true, message: "Vui lòng nhập tên sản phẩm." },
                ]}
              >
                <Input placeholder="Vui lòng nhập tên sản phẩm." />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="product_code"
                label="Mã sản phẩm"
                hasFeedback
                // rules={[
                //   { required: true, message: "Vui lòng nhập mã sản phẩm." },
                // ]}
              >
                <Input placeholder="Hệ thống tự động" disabled />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="product_price"
                label="Giá sản phẩm (VNĐ)"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập giá sản phẩm.",
                  },
                ]}
              >
                <InputNumber
                  placeholder="Vui lòng nhập giá sản phẩm."
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="product_discount_price"
                label="CASHBACK (VNĐ)"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập Cashback của sản phẩm.",
                  },
                ]}
              >
                <InputNumber
                  placeholder="Vui lòng nhập Cashback của sản phẩm."
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="product_characteristics"
                label="Đặc tính sản phẩm"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập thêm Đặc tính sản phẩm.",
                  },
                ]}
              >
                <TextArea placeholder="Vui lòng nhập thêm Đặc tính sản phẩm." />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="product_color"
                label="Màu sắc"
                hasFeedback
                rules={[
                  { required: true, message: "Vui lòng nhập màu sản phẩm" },
                ]}
              >
                <Input placeholder="Vui lòng nhập màu sản phẩm." />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="product_serial"
                label="BARCODE (vui lòng nhập N/A nếu sản phẩm không có mã BARCODE)"
                hasFeedback
                // rules={[{ required: true, message: "Vui lòng nhập BARCODE." }]}
              >
                <Input placeholder="BARCODE." />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="product_type"
                label="Loại sản phẩm"
                hasFeedback
                rules={[
                  { required: true, message: "Vui lòng chọn loại sản phẩm." },
                ]}
              >
                <ISelect
                  dataOption={list_cate}
                  keyName="category_name"
                  valueName="category_name"
                  placeholder="Vui lòng chọn loại sản phẩm."
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="is_activated"
                label="Trạng thái"
                hasFeedback
                rules={[
                  { required: true, message: "Vui lòng chọn trạng thái." },
                ]}
              >
                <ISelect
                  dataOption={[
                    {
                      value: true,
                      text: "Hoạt động",
                    },
                    {
                      value: false,
                      text: "Ngưng hoạt động",
                    },
                  ]}
                  keyName="value"
                  valueName="text"
                  placeholder="Vui lòng chọn trạng thái"
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="product_currency"
                label="Đơn vị"
                hasFeedback
                rules={[
                  { required: true, message: "Vui lòng nhập đơn vị sản phẩm." },
                ]}
              >
                <ISelect
                  dataOption={[
                    {
                      value: "Kg",
                      text: "Kg",
                    },
                    {
                      value: "Chiếc",
                      text: "Chiếc",
                    },
                    {
                      value: "Bó",
                      text: "Bó",
                    },
                    {
                      value: "Khay",
                      text: "Khay",
                    },
                    {
                      value: "Lon",
                      text: "Lon",
                    },
                    {
                      value: "Thùng (24 lon)",
                      text: "Thùng (24 lon)",
                    },
                    {
                      value: "Thùng (12 lon)",
                      text: "Thùng (12 lon)",
                    },
                    {
                      value: "Chai",
                      text: "Chai",
                    },
                  ]}
                  keyName="value"
                  valueName="text"
                  placeholder="Vui lòng chọn đơn vị sản phẩm"
                />
              </Form.Item>
            </Col>

            {/* <Col span={24}>
              <Form.Item
                name="product_inventory"
                label="Số lượng tồn kho"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số lượng tồn kho.",
                  },
                ]}
              >
                <InputNumber
                  placeholder="Vui lòng nhập số lượng tồn kho."
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col> */}

            <Col span={24}>
              <Form.Item
                name="product_amount"
                label="Số lượng"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số lượng sản phẩm.",
                  },
                ]}
              >
                <InputNumber
                  placeholder="Vui lòng nhập số lượng sản phẩm."
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="product_quantily"
                label="Trọng lượng (gram)"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập trọng lượng sản phẩm.",
                  },
                ]}
              >
                <InputNumber
                  placeholder="Vui lòng nhập trọng lượng sản phẩm."
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="product_contry"
                label="Thương Hiệu"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập Thương Hiệu.",
                  },
                ]}
              >
                <Input placeholder="Vui lòng nhập Thương Hiệu." />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="product_details"
                label="Mô tả"
                hasFeedback
                rules={[{ required: true, message: "Vui lòng nhập mô tả." }]}
              >
                <TextArea
                  placeholder="Vui lòng nhập mô tả"
                  autoSize={{ minRows: 4, maxRows: 8 }}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <div
                style={{
                  textAlign: "right",
                }}
              >
                <Space align="middle">
                  <Button
                    style={{ marginRight: 8 }}
                    onClick={() => onCloseCallback()}
                  >
                    Hủy bỏ
                  </Button>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loadingSubmit}
                    >
                      {edit ? "Cập nhật" : "Lưu"}
                    </Button>
                  </Form.Item>
                </Space>
              </div>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </div>
  );
}

CreateProduct.prototype = {
  visibleCreate: PropTypes.bool.isRequired,
  onCloseCallback: PropTypes.func.isRequired,
  onCreateCallback: PropTypes.func.isRequired,
  dataEdit: PropTypes.string.isRequired,
  edit: PropTypes.bool.isRequired,
};
