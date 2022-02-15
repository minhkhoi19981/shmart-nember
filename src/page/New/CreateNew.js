import {
  Button,
  Col,
  Drawer,
  InputNumber,
  Form,
  Input,
  message,
  Row,
  Space,
  DatePicker,
} from "antd";
import React, { useState } from "react";

import { ISelect, ISelectV1 } from "../../common";
import TextArea from "antd/lib/input/TextArea";
import { APIService, APIServiceV2 } from "../../apis";

export default function CreateNew(props) {
  const { visibleCreate, onCreateCallback, onCloseCallback } = props;
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [form] = Form.useForm();

  const _fetchAddNew = async (data) => {
    try {
      await APIServiceV2._postNews(data);
      message.success("Tạo tin tức thành công.");
      form.resetFields([
        "category_name",
        "product_name",
        "price",
        "detail",
        "status",
        "priority",
        "created_date",
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
      setLoadingSubmit(true);
      _fetchAddNew(value);
    } catch (error) {}
  };

  return (
    <div>
      <Drawer
        visible={visibleCreate}
        title="TẠO TIN TỨC"
        width={"100%"}
        onClose={() => {
          onCloseCallback();
          form.resetFields([
            "category_name",
            "product_name",
            "price",
            "detail",
            "status",
            "priority",
            "created_date",
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
              <Form.Item
                hasFeedback
                name="product_name"
                label="Tên tin tức"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên tin tức.",
                  },
                ]}
              >
                <Input placeholder="Vui lòng nhập tên tin tức" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                hasFeedback
                name="category_name"
                label="Danh mục"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập danh mục.",
                  },
                ]}
              >
                <ISelectV1
                  style={{ minWidth: 160, textAlign: "left" }}
                  dataOption={[
                    {
                      value: "health",
                      text: "Sức khỏe",
                    },
                    {
                      value: "travel",
                      text: "DU LỊCH",
                    },
                    {
                      value: "insurance",
                      text: "BẢO HIỂM",
                    },
                    {
                      value: "sport",
                      text: "THỂ THAO",
                    },
                    {
                      value: "home-stay",
                      text: "Home - Stay",
                    },
                  ]}
                  keyName="value"
                  valueName="text"
                  placeholder="Vui lòng nhập danh mục."
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                hasFeedback
                name="priority"
                label="Độ ưu tiên"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập độ ưu tiên.",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Vui lòng nhập độ ưu tiên."
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                hasFeedback
                name="price"
                label="Giá vé"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập giá vé.",
                  },
                ]}
              >
                <InputNumber
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  style={{ width: "100%" }}
                  placeholder="Vui lòng nhập giá vé."
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                hasFeedback
                name="created_date"
                label="Ngày tạo"
                rules={[{ required: true, message: "Vui lòng chọn ngày tạo." }]}
              >
                <DatePicker placeholder="Vùi lòng chọn ngày tạo" />
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
                <ISelectV1
                  dataOption={[
                    {
                      value: "ACTIVE",
                      text: "Hoạt động",
                    },
                    {
                      value: "INACTIVE",
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
                name="detail"
                label="Mô tả"
                rules={[{ required: true, message: "Vui lòng điền mô tả" }]}
              >
                <TextArea
                  placeholder="Vui lòng điền mô tả."
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
                      Tạo mới
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
