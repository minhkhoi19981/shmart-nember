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
import { _reducerFetchPostCate } from "../../reducers/Product/reducers";

export default function CreateCate(props) {
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

  const _fetchAPIPostAdd = async (dataAdd) => {
    try {
      const data = await dispatch(_reducerFetchPostCate(dataAdd));
      const currentCode = unwrapResult(data);
      if (currentCode.code === "Fail") {
        return openNotificationWithIcon(currentCode.message);
      }
      message.success("Tạo thành công");

      form.resetFields([
        "category_name",
        "category_description",
        "add_by",
        "activated",
      ]);
      onCreateCallback();
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingSubmit(false);
    }
  };

  const _fetchAPIPostUpdate = async (idCode, dataUpdate) => {
    try {
      const data = await APIService._putRolesItemCate(idCode, dataUpdate);

      if (data.code === "Fail") {
        return openNotificationWithIcon(data.message);
      }
      message.success("Chỉnh sửa thành công");
      form.resetFields([
        "category_name",
        "category_description",
        "add_by",
        "activated",
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
        ...dataEdit,
        category_name: dataEdit.category_name,
        category_description: dataEdit.category_description,
        activated: dataEdit.activated ? "Hoạt động" : "Ngưng hoạt động",
      });
    }
  }, [edit]);

  return (
    <div>
      <Drawer
        visible={visibleCreate}
        title={edit ? "Chỉnh sửa nhóm sản phẩm" : "Tạo nhóm sản phẩm"}
        width={'100%'}
        onClose={() => {
          onCloseCallback();
          form.resetFields([
            "category_name",
            "category_description",
            "add_by",
            "activated",
          ]);
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
                category_name: value.category_name,
                category_description: value.category_description,
                add_by: UserService._getID(),
                activated: value.activated === "Hoạt động",
              };
            
              setLoadingSubmit(true);
              _fetchAPIPostUpdate(dataEdit.id, dataUpdate);
            } else {
              const dataAdd = {
                ...value,
                category_name: value.category_name,
                category_description: value.category_description,
                add_by: UserService._getID(),
                activated: value.activated === "Hoạt động",
              };

              setLoadingSubmit(true);
              await _fetchAPIPostAdd(dataAdd);
            }
          }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="category_name"
                label="Tên nhóm sản phẩm"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên nhóm sản phẩm.",
                  },
                ]}
              >
                <Input placeholder="Vui lòng nhập tên nhóm sản phẩm." />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="activated"
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
                name="category_description"
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

CreateCate.prototype = {
  visibleCreate: PropTypes.bool.isRequired,
  onCloseCallback: PropTypes.func.isRequired,
  onCreateCallback: PropTypes.func.isRequired,
  dataEdit: PropTypes.string.isRequired,
  edit: PropTypes.bool.isRequired,
};
