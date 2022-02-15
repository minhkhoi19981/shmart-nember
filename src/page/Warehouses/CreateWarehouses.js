import { Button, Col, Drawer, Form, Input, message, Row, Space } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { _reducerFetchListCate } from "../../reducers/Cate/reducers";
import { unwrapResult } from "@reduxjs/toolkit";
import { ISelect } from "../../common";
import TextArea from "antd/lib/input/TextArea";
import { APIService, UserService } from "../../apis";
import axios from "axios";

export default function CreateWarehouses(props) {
  const {
    visibleCreate,
    onCreateCallback,
    onCloseCallback,
    edit,
    idWarehouse,
  } = props;
  const dispatch = useDispatch();
  const dataRoot = useSelector((state) => state);
  const { cate } = dataRoot;
  const [loadingCate, setLoadingCate] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [form] = Form.useForm();
  const [list_cate, setListCate] = useState([]);

  useEffect(() => {
    if (edit) {
      _fetchAPIDetailWarehouse(idWarehouse);
    }
  }, [edit]);

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

  const _fetchAPIDetailWarehouse = async (id) => {
    try {
      const data = await APIService._getWarehouseDeatailItem(id);
      form.setFieldsValue({
        product_type: data.product_type,
        import_by: data.import_by,
        title: data.title,
        address: data.address,
        description: data.description,
        message_leave: "NA",
        is_activated: data.is_activated ? "Hoạt động" : "Không hoạt động",
        email: data.email,
        phone: data.phone,
        full_name: data.full_name,
        partner_name: data.partner_name,
      });
    } catch (error) {
    } finally {
      // setLoadingDetail(false);
    }
  };

  const _fetchListCate = async () => {
    try {
      const data = await dispatch(_reducerFetchListCate());

      const currentCate = unwrapResult(data);
      setLoadingCate(false);
      console.log(currentCate);
    } catch (error) {}
  };

  const _fetchAddWareHouse = async (data) => {
    try {
      await APIService._postAddWarehouse(data);
      message.success("Tạo kho thành công.");
      form.resetFields([
        "product_type",
        "import_by",
        "title",
        "message_leave",
        "description",
        "is_activated",
        "email",
        "phone",
        "full_name",
        "partner_name",
      ]);
      onCreateCallback();
    } catch (erorr) {
      console.log(erorr);
    } finally {
      setLoadingSubmit(false);
    }
  };

  const _fetchUpdateWareHouse = async (id, data) => {
    try {
      await APIService._putUpdateWarehouse(id, data);
      message.success("Chỉnh sửa kho thành công.");
      form.resetFields([
        "product_type",
        "import_by",
        "title",
        "message_leave",
        "description",
        "is_activated",
        "address",
        "email",
        "phone",
        "full_name",
        "partner_name",
      ]);
      onCreateCallback();
    } catch (erorr) {
      console.log(erorr);
    } finally {
      setLoadingSubmit(false);
    }
  };

  const _fetchSubmit = (value) => {
    try {
      if (edit) {
        const tokenID = UserService._getID();
        const timeCurrent = new Date();
        const dataUpdate = {
          product_type: value.product_type,
          import_by: value.import_by,
          verify_by: "Admin",
          is_verified: false,
          title: value.title,
          address: value.address,
          description: value.description,
          full_name: value.full_name,
          partner_name: value.partner_name,
          phone: value.phone,
          email: value.email,
          message_leave: "NA",
          created_by: tokenID,
          import_date: timeCurrent.toISOString(),
          created_date: timeCurrent.toISOString(),
          is_activated: value.is_activated === "Hoạt động",
          __v: 0,
        };
        setLoadingSubmit(true);
        _fetchUpdateWareHouse(idWarehouse, dataUpdate);
      } else {
        const tokenID = UserService._getID();
        const timeCurrent = new Date();
        const dataAdd = {
          product_type: value.product_type,
          import_by: value.import_by,
          address: value.address,
          phone: value.phone,
          email: value.email,
          verify_by: "Admin",
          is_verified: false,
          title: `SHMart_` + Math.floor(Math.random() * 1000000 + 1),
          description: value.description,
          message_leave: "NA",
          is_activated: value.is_activated === "Hoạt động",
          full_name: value.full_name,
          partner_name: value.partner_name,
          created_by: tokenID,
          import_date: timeCurrent.toISOString(),
          created_date: timeCurrent.toISOString(),
          __v: 0,
        };
        setLoadingSubmit(true);
        _fetchAddWareHouse(dataAdd);
      }
    } catch (error) {}
  };

  useEffect(() => {
    _fetchListCate();
  }, []);

  return (
    <div>
      <Drawer
        visible={visibleCreate}
        title={edit ? "CHỈNH SỬA THÔNG TIN ĐỐI TÁC" : "TẠO LIÊN KẾT MỚI"}
        width={"100%"}
        onClose={() => {
          onCloseCallback();
          form.resetFields([
            "product_type",
            "import_by",
            "title",
            "message_leave",
            "description",
            "is_activated",
            "address",
            "email",
            "phone",
            "full_name",
            "partner_name",
          ]);
        }}
      >
        <Form
          layout="vertical"
          hideRequiredMark
          form={form}
          onFinish={(value) => {
            _fetchSubmit(value);
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="title" label="ID Đối Tác" hasFeedback>
                <Input placeholder="HỆ THỐNG TỰ ĐỘNG" disabled={true} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                hasFeedback
                name="full_name"
                label="Họ và Tên"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên đối tác.",
                  },
                ]}
              >
                <Input placeholder="Vui lòng nhập tên đối tác" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                hasFeedback
                name="partner_name"
                label="Tên đối tác"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên công ty / tổ chức.",
                  },
                ]}
              >
                <Input placeholder="Vui lòng nhập tên công ty / tổ chức." />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="product_type"
                label="Ngành Hàng"
                hasFeedback
                rules={[
                  { required: true, message: "Vui lòng chọn loại sản phẩm" },
                ]}
              >
                {/* <ISelect
                  loading={loadingCate}
                  dataOption={cate}
                  keyName="id"
                  valueName="category_name"
                  placeholder="Vui lòng chọn loại sản phẩm"
                /> */}

                <ISelect
                  mode="multiple"
                  dataOption={list_cate}
                  keyName="category_name"
                  valueName="category_name"
                  placeholder="Vui lòng chọn loại sản phẩm"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                hasFeedback
                name="phone"
                label="Số điện thoại"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền số điện thoại.",
                  },
                  {
                    pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                    message: "Định dạng sdt :09*******,84*******",
                  },
                ]}
              >
                <Input placeholder="Vui lòng điền số điện thoại." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                hasFeedback
                name="email"
                label="Email"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền email.",
                  },
                  {
                    type: "email",
                    message: "Email có định dạng abc@****",
                  },
                ]}
              >
                <Input placeholder="Vui lòng điền email." />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="address"
                label="Địa chỉ"
                rules={[
                  { required: true, message: "Vui lòng điền địa chỉ kho" },
                ]}
              >
                <TextArea
                  placeholder="Vui lòng điền địa chỉ kho."
                  autoSize={{ minRows: 4, maxRows: 8 }}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                hasFeedback
                name="import_by"
                label="Hình thức vận chuyển"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền hình thức vận chuyển.",
                  },
                ]}
              >
                <Input placeholder="Vui lòng nhập hình thức vận chuyển." />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                hasFeedback
                name="is_activated"
                label="Trạng thái"
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
                      text: "Không hoạt động",
                    },
                  ]}
                  keyName="value"
                  valueName="text"
                  placeholder="Vui lòng chọn trạng thái"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="description"
                label="Mô tả"
                rules={[{ required: true, message: "Vui lòng điền mô tả" }]}
              >
                <TextArea
                  placeholder="Vui lòng điền mô tả."
                  autoSize={{ minRows: 4, maxRows: 8 }}
                />
              </Form.Item>
            </Col>
            {/* <Col span={12}>
              <Form.Item
                name="message_leave"
                label="Lời nhắn"
                rules={[{ required: true, message: "Vui lòng điền lời nhắn" }]}
              >
                <TextArea
                  placeholder="Vui lòng điền lời nhắn."
                  autoSize={{ minRows: 4, maxRows: 8 }}
                />
              </Form.Item>
            </Col> */}

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
                      {edit ? "Chỉnh sửa kho" : "Tạo mới kho"}
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
