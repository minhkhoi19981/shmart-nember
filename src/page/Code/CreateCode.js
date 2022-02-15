import {
  Col,
  Divider,
  Drawer,
  Input,
  Row,
  Select,
  Form,
  notification,
  Space,
  Button,
  InputNumber,
  message,
} from "antd";

import React, { useEffect, useState } from "react";
import { ISelect } from "../../common";
import PropTypes from "prop-types";

import TextArea from "antd/lib/input/TextArea";
import { useDispatch } from "react-redux";
import { _reducerFetchPostCode } from "../../reducers/Code/reducers";
import { unwrapResult } from "@reduxjs/toolkit";
import { APIService } from "../../apis";

export default function CreateCode(props) {
  
  const {
    visibleCreate,
    onCreateCallback,
    onCloseCallback,
    edit,
    dataEdit,
  } = props;

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

  const _fetchAPIPostAddCode = async (dataAdd) => {
    try {
      const data = await dispatch(_reducerFetchPostCode(dataAdd));
      const currentCode = unwrapResult(data);
      if (currentCode.code === "Fail") {
        return openNotificationWithIcon(currentCode.message);
      }
      message.success("Tạo thành công");

      form.resetFields([
        "code_title",
        "code_desc",
        "content",
        "is_exprired",
        "maximum_activated",
        "activated",
        "cost_discount",
      ]);
      onCreateCallback();
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingSubmit(false);
    }
  };

  const _fetchAPIPostUpdateCode = async (idCode, dataUpdate) => {
    try {
      const data = await APIService._putRolesItemCode(idCode, dataUpdate);

      if (data.code === "Fail") {
        return openNotificationWithIcon(data.message);
      }
      message.success("Chỉnh sửa thành công");
      form.resetFields([
        "code_title",
        "code_desc",
        "content",
        "is_exprired",
        "maximum_activated",
        "activated",
        "cost_discount",
      ]);
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
        maximum_activated: dataEdit.maximum_activated,
        times_activated: dataEdit.times_activated,
        created_by: dataEdit.created_by,
        _id: dataEdit._id,
        code_title: dataEdit.code_title,
        code_desc: dataEdit.code_desc,
        content: dataEdit.content,
        export_code: dataEdit.export_code,
        created_date: dataEdit.created_date,
        id: dataEdit.id,
      });
    }
  }, [edit]);

  return (
    <div>
      <Drawer
        visible={visibleCreate}
        title={edit ? "Chỉnh mã khuyến mãi" : "Tạo mã khuyến mãi"}
        width={'100%'}
        onClose={() => {
          onCloseCallback();
          form.resetFields([
            "code_title",
            "code_desc",
            "content",
            "is_exprired",
            "maximum_activated",
            "activated",
            "cost_discount",
          ]);
        }}
      >
        <Form
          layout="vertical"
          hideRequiredMark
          form={form}
          onFinish={async (value) => {
            const time = new Date();

            if (edit) {
              const dataUpdate = {
                code_title: value.code_title,
                code_desc: value.code_desc,
                content: value.content,
                is_exprired: value.is_exprired === "Còn hiệu lực",
                activated: value.activated === "Kích hoạt",

                maximum_activated: value.maximum_activated,
                times_activated: value.times_activated,
                created_by: dataEdit.created_by,
                cost_discount: value.cost_discount,
                _id: dataEdit._id,
                export_code: dataEdit.export_code,
                created_date: dataEdit.created_date,
                id: dataEdit.id,
              };
              setLoadingSubmit(true);
              _fetchAPIPostUpdateCode(dataEdit.id, dataUpdate);
            } else {
              const time = new Date();

              const dataAdd = {
                code_title: value.code_title,
                code_desc: value.code_desc,
                content: value.content,
                is_exprired: value.is_exprired === "Còn hiệu lực",
                activated: value.activated === "Kích hoạt",

                maximum_activated: value.maximum_activated,
                times_activated: 0,
                created_by: "admin",
                cost_discount: value.cost_discount,
              };
              setLoadingSubmit(true);
              await _fetchAPIPostAddCode(dataAdd);
            }
          }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="code_title"
                label="Tên code"
                hasFeedback
                rules={[{ required: true, message: "Vui lòng nhập tên code." }]}
              >
                <Input placeholder="Vui lòng nhập tên code." />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="code_desc"
                label="Loại code"
                hasFeedback
                rules={[
                  { required: true, message: "Vui lòng nhập loại code." },
                ]}
              >
                <Input placeholder="Vui lòng nhập loại code." />
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
                name="content"
                label="CODE"
                rules={[{ required: true, message: "Vui lòng điền nội dung" }]}
              >
                <TextArea
                  placeholder="Vui lòng điền nội dung"
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

CreateCode.prototype = {
  visibleCreate: PropTypes.bool.isRequired,
  onCloseCallback: PropTypes.func.isRequired,
  onCreateCallback: PropTypes.func.isRequired,
  dataEdit: PropTypes.string.isRequired,
  edit: PropTypes.bool.isRequired,
};
