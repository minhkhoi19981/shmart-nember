import React from "react";
import {
  Form,
  Input,
  Button,
  Space,
  Row,
  Col,
  PageHeader,
  DatePicker,
  InputNumber,
  BackTop,
  notification,
  message,
  Skeleton,
} from "antd";
import {
  PlusOutlined,
  PlusCircleOutlined,
  CloseCircleFilled,
} from "@ant-design/icons";

import { ISelect, ISelectV1 } from "../../common";

import { useHistory, useParams } from "react-router-dom";
import { useState } from "react";
import Paragraph from "antd/lib/typography/Paragraph";
import TextArea from "antd/lib/input/TextArea";
import Text from "antd/lib/typography/Text";
import { useEffect } from "react";
import { APIService, UserService, APIServiceV2 } from "../../apis";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

export default function CreateOrder() {
  const navigate = useHistory();
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [form] = Form.useForm();
  const [list_product, setListProduct] = useState([]);

  const _fetchAPIList = async () => {
    try {
      const listProduct = await APIServiceV2._getListProduct({
        page: 1,
        limit: 100,
      });

      const dataNew = listProduct._Array.map((item) => {
        const value = Number(item.id);
        const text = item.full_name;

        return { text, value };
      });
      setListProduct([...dataNew]);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  useEffect(() => {
    _fetchAPIList();
  }, []);

  const onFinish = async (values) => {
    try {
      setLoadingSubmit(true);
      const dataAdd = {
        receiver: {
          name: values.name,
          phone: values.phone,
          city: values.city,
          district: values.district,
          ward: values.ward,
          address: values.address,
        },
        wallet_type: values.wallet_type,
        note: !values.note ? "" : values.note,
        item_list: values.product_list,
      };
      const data = await APIServiceV2._postCreateOrder(dataAdd);
      if (data.code === "Fail") return
      message.success("Tạo đơn hàng thành công.");
      navigate.goBack();
    } catch (error) {
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div>
      <Form form={form} onFinish={onFinish} autoComplete="off" {...layout}>
        <PageHeader
          onBack={() => navigate.goBack()}
          title="TẠO ĐƠN HÀNG"
          style={{ padding: 0, marginBottom: 24 }}
          extra={[
            <Space align="baseline">
              <Form.Item>
                <Button
                  loading={loadingSubmit}
                  type="primary"
                  icon={<PlusCircleOutlined />}
                  htmlType="submit"
                >
                  Tạo mới
                </Button>
              </Form.Item>
              <Button
                type="primary"
                danger
                onClick={() => {
                  navigate.goBack();
                }}
              >
                Hủy
              </Button>
            </Space>,
          ]}
        />
        <BackTop duration={500} />

        <div
          style={{ width: "100%", padding: 24, marginBottom: 16 }}
          className="shadow"
        >
          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item
                hasFeedback
                name="name"
                label="Họ và Tên"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền tên người nhận hàng.",
                  },
                ]}
              >
                <Input placeholder="Vui lòng điền tên người nhận hàng." />
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
                name="address"
                label="Địa chỉ"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền số địa chỉ.",
                  },
                ]}
              >
                <Input placeholder="Vui lòng điền số địa chỉ." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                hasFeedback
                name="district"
                label="Phường"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền phường.",
                  },
                ]}
              >
                <Input placeholder="Vui lòng điền phường." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                hasFeedback
                name="ward"
                label="Quận"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền quận.",
                  },
                ]}
              >
                <Input placeholder="Vui lòng điền quận." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                hasFeedback
                name="city"
                label="Thành phố"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền thành phố.",
                  },
                ]}
              >
                <Input placeholder="Vui lòng điền thành phố." />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="notes" label="Ghi chú">
                <TextArea
                  placeholder="Nhập ghi chú"
                  autoSize={{ minRows: 3, maxRows: 5 }}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                hasFeedback
                name="delivered_by"
                label="Loại ví"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn loại ví",
                  },
                ]}
              >
                <ISelectV1
                  dataOption={[
                    {
                      value: "MAIN",
                      text: "Ví chính",
                    },
                    {
                      value: "CASH_BACK",
                      text: "Cashback",
                    },
                  ]}
                  keyName="value"
                  valueName="text"
                  placeholder="Vui lòng chọn loại ví"
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Row>
                <Col span={24}>
                  <Paragraph>
                    <Text style={{ color: "red" }}>*</Text> Sản phẩm
                  </Paragraph>
                </Col>
                <Col span={24}>
                  <Form.List name="product_list">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field) => (
                          <Row gutter={[16, 0]} key={field.key}>
                            <Col span={24} style={{ textAlign: "right" }}>
                              <CloseCircleFilled
                                onClick={() => remove(field.name)}
                              />
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                {...field}
                                label="Tên sản phẩm"
                                name={[field.name, "id"]}
                                fieldKey={[field.fieldKey, "id"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Vui lòng điền tên sản phẩm.",
                                  },
                                ]}
                              >
                                <ISelectV1
                                  dataOption={list_product}
                                  showSearch={true}
                                  style={{ width: "100%" }}
                                  filterOption={(input, option) =>
                                    option.children
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  }
                                  keyName="value"
                                  valueName="text"
                                  placeholder="Vui lòng chọn tên sản phẩm"
                                />
                              </Form.Item>
                            </Col>

                            <Col span={12}>
                              <Form.Item
                                {...field}
                                label="Số lượng"
                                name={[field.name, "qty"]}
                                fieldKey={[field.fieldKey, "qty"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Vui lòng nhập số lượng sản phẩm.",
                                  },
                                ]}
                              >
                                <InputNumber
                                  style={{ width: "100%" }}
                                  formatter={(value) =>
                                    `${value}`.replace(
                                      /\B(?=(\d{3})+(?!\d))/g,
                                      ","
                                    )
                                  }
                                  parser={(value) =>
                                    value.replace(/\$\s?|(,*)/g, "")
                                  }
                                  placeholder="Vui lòng nhập số lượng sản phẩm."
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        ))}
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => add()}
                            block
                            icon={<PlusOutlined />}
                          >
                            Thêm sản phẩm
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </Form>
    </div>
  );
}
