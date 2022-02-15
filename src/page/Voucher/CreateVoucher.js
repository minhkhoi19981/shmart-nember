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
import { _reducerFetchPostVoucher } from "../../reducers/Voucher/reducers";
import { unwrapResult } from "@reduxjs/toolkit";
import { APIService } from "../../apis";
import { PlusOutlined } from "@ant-design/icons";

export default function CreateVoucher(props) {
  const { visibleCreate, onCreateCallback, onCloseCallback, edit, dataEdit } =
    props;

  const [listImg, setListImg] = useState([]);

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

  const _fetchAPIPostAddVoucher = async (dataAdd) => {
    try {
      const data = await dispatch(_reducerFetchPostVoucher(dataAdd));
      const currentCode = unwrapResult(data);
      if (currentCode.code === "Fail") {
        return openNotificationWithIcon(currentCode.message);
      }
      message.success("Tạo thành công");

      form.resetFields([
        "voucher_title",
        "voucher_desc",
        "voucher_code_manual",
        "is_exprired",
        "price_voucher",
        "maximum_activated",
        "activated",
        "cost_discount",
        "img_link",
        "special_code",
        "voucher_policy",
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
      const data = await APIService._putRolesItemVoucher(idCode, dataUpdate);

      if (data.code === "Fail") {
        return openNotificationWithIcon(data.message);
      }
      message.success("Chỉnh sửa thành công");
      form.resetFields([
        "voucher_title",
        "voucher_desc",
        "voucher_code_manual",
        "is_exprired",
        "price_voucher",
        "maximum_activated",
        "activated",
        "cost_discount",
        "img_link",
        "special_code",
        "voucher_policy",
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
        is_exprired: dataEdit.is_exprired ? "Còn hiệu lực" : "Hết hiệu lực",
        activated: dataEdit.activated ? "Kích hoạt" : "Chưa kích hoạt",
        cost_discount: dataEdit.cost_discount,
        price_voucher: dataEdit.price_voucher,
        maximum_activated: dataEdit.maximum_activated,
        times_activated: dataEdit.times_activated,
        created_by: dataEdit.created_by,
        _id: dataEdit._id,
        voucher_title: dataEdit.voucher_title,
        voucher_desc: dataEdit.voucher_desc,
        voucher_code_manual: dataEdit.voucher_code_manual,
        export_code: dataEdit.export_code,
        created_date: dataEdit.created_date,
        id: dataEdit.id,
        img_link: dataEdit.img_link,
        special_code: dataEdit.special_code ? "Có" : "Không",
        voucher_policy: dataEdit.voucher_policy,
      });
      setListImg([
        {
          uid: -1,
          name: dataEdit.img_link,
          status: "done",
          url: dataEdit.img_link,
        },
      ]);
    }
  }, [edit]);

  return (
    <div>
      <Drawer
        visible={visibleCreate}
        title={edit ? "Chỉnh mã khuyến mãi" : "Tạo mã khuyến mãi"}
        width={"100%"}
        onClose={() => {
          onCloseCallback();
          form.resetFields([
            "voucher_title",
            "voucher_desc",
            "voucher_code_manual",
            "is_exprired",
            "price_voucher",
            "maximum_activated",
            "activated",
            "cost_discount",
            "img_link",
            "special_code",
            "voucher_policy",
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
                voucher_title: value.voucher_title,
                voucher_desc: value.voucher_desc,
                voucher_code_manual: value.voucher_code_manual,
                is_exprired: value.is_exprired === "Còn hiệu lực",
                activated: value.activated === "Kích hoạt",
                price_voucher: value.price_voucher,
                maximum_activated: value.maximum_activated,
                times_activated: dataEdit.times_activated,
                created_by: dataEdit.created_by,
                cost_discount: value.cost_discount,
                _id: dataEdit._id,
                export_code: dataEdit.export_code,
                created_date: dataEdit.created_date,
                id: dataEdit.id,
                img_link: value.img_link,
                special_code: value.special_code === "Có",
                voucher_policy: value.voucher_policy,
              };
              setLoadingSubmit(true);
              _fetchAPIPostUpdateVoucher(dataEdit.id, dataUpdate);
            } else {
              const dataAdd = {
                voucher_title: value.voucher_title,
                voucher_desc: value.voucher_desc,
                voucher_code_manual: value.voucher_code_manual,
                is_exprired: value.is_exprired === "Còn hiệu lực",
                activated: value.activated === "Kích hoạt",
                price_voucher: value.price_voucher,
                maximum_activated: value.maximum_activated,
                times_activated: 0,
                export_code: "",
                created_by: "admin",
                cost_discount: value.cost_discount,
                img_link: value.img_link,
                special_code: value.special_code === "Có",
                voucher_policy: value.voucher_policy,
              };

              setLoadingSubmit(true);
              await _fetchAPIPostAddVoucher(dataAdd);
            }
          }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="img_link"
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
                          img_link: `https://api.shmart.vn/public/${data.attachment.filename}`,
                        });
                        setListImg([
                          {
                            uid: -1,
                            name: data.attachment.filename,
                            status: "done",
                            url: `https://api.shmart.vn/public/${data.attachment.filename}`,
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
                name="voucher_title"
                label="Tên nhận diện voucher"
                hasFeedback
                rules={[
                  { required: true, message: "Vui lòng nhập tên voucher." },
                ]}
              >
                <Input placeholder="Vui lòng nhập tên voucher." />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="special_code"
                label="Ưu đãi đặc biệt"
                hasFeedback
                rules={[
                  { required: true, message: "Vui lòng chọn ưu đãi đặc biệt." },
                ]}
              >
                <ISelect
                  dataOption={[
                    {
                      value: true,
                      text: "Có",
                    },
                    {
                      value: false,
                      text: "Không",
                    },
                  ]}
                  keyName="value"
                  valueName="text"
                  placeholder="Vui lòng chọn trạng thái ưu đãi"
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="voucher_code_manual"
                label="Mã Voucher"
                rules={[
                  { required: true, message: "Vui lòng điền mã voucher" },
                ]}
              >
                <Input placeholder="Vui lòng điền mã voucher." />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="price_voucher"
                label="Giá Chuyển Đổi (point)"
                hasFeedback
                rules={[
                  { required: true, message: "Vui lòng nhập Giá Chuyển Đổi." },
                ]}
              >
                <Input placeholder="Vui lòng nhập Giá Chuyển Đổi." />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="cost_discount"
                label="Giảm giá"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số tiền giảm giá.",
                  },
                ]}
              >
                <InputNumber
                  placeholder="Vui lòng nhập số tiền giảm giá."
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
                hasFeedback
                name="activated"
                label="Trạng thái"
                rules={[
                  { required: true, message: "Vui lòng chọn trạng thái." },
                ]}
              >
                <ISelect
                  dataOption={[
                    {
                      value: true,
                      text: "Kích hoạt",
                    },
                    {
                      value: false,
                      text: "Chưa kích hoạt",
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
                hasFeedback
                name="is_exprired"
                label="Hiệu lực mã"
                rules={[{ required: true, message: "Vui lòng chọn hiệu lực." }]}
              >
                <ISelect
                  dataOption={[
                    {
                      value: false,
                      text: "Còn hiệu lực",
                    },
                    {
                      value: true,
                      text: "Hết hiệu lực",
                    },
                  ]}
                  keyName="value"
                  valueName="text"
                  placeholder="Vui lòng chọn hiệu lực mã"
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="maximum_activated"
                label="Kich hoạt tối da"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số lần kích hoạt tối đa.",
                  },
                ]}
              >
                <InputNumber
                  placeholder="Vui lòng nhập số lần kích hoạt tối đa."
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="voucher_desc"
                label="Ghi chú cho voucher"
                hasFeedback
                rules={[{ required: true, message: "Vui lòng nhập ghi chú." }]}
              >
                <TextArea
                  placeholder="Vui lòng điền mã voucher"
                  autoSize={{ minRows: 4, maxRows: 8 }}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="voucher_policy"
                label="Điều kiện sử dụng"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền điều kiện sử dụng",
                  },
                ]}
              >
                <TextArea
                  placeholder="Vui lòng điền điều kiện sử dụng"
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

CreateVoucher.prototype = {
  visibleCreate: PropTypes.bool.isRequired,
  onCloseCallback: PropTypes.func.isRequired,
  onCreateCallback: PropTypes.func.isRequired,
  dataEdit: PropTypes.string.isRequired,
  edit: PropTypes.bool.isRequired,
};
