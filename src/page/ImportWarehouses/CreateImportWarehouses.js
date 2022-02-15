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
  SaveOutlined,
} from "@ant-design/icons";

import { ISelect } from "../../common";

import { useHistory, useParams } from "react-router-dom";
import FormatterDay from "../../utils/FormatterDay";
import { useState } from "react";
import moment from "moment";
import Paragraph from "antd/lib/typography/Paragraph";
import TextArea from "antd/lib/input/TextArea";
import Text from "antd/lib/typography/Text";
import { useDispatch } from "react-redux";
import {
  _reducerFetchImportWarehouseCreate,
  _reducerFetchImportWarehouseItem,
  _reducerFetchImportWareUpdate,
} from "../../reducers/Warehouses/reducer";
import { unwrapResult } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { APIService, UserService } from "../../apis";
import { _reducerFetchListProduct } from "../../reducers/Product/reducers";

const dateFormat = "DD/MM/YYYY";
const timeNowDate = new Date();
const currentTime = FormatterDay.dateFormatWithString(
  timeNowDate.getTime(),
  "#DD#/#MM#/#YYYY#"
);
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

export default function CreateImportWarehouses() {
  const navigate = useHistory();
  const { type, id } = useParams();
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [currentDob, setCurrentDob] = useState(currentTime);
  const [loading, setLoading] = useState(type === "edit");
  const [form] = Form.useForm();
  const [list_product, setListProduct] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const [filter, setFilter] = useState({
    page: 1,
    limit: 1000,
  });

  const [warehouseList, setWarehouseList] = useState();

  const dispatch = useDispatch();

  const openNotificationWithIcon = (title) => {
    notification.error({
      message: "Thông báo",
      description: title,
      placement: "topLeft",
    });
  };

  const _fetchAPIList = async () => {
    try {
      const listProduct = await dispatch(
        _reducerFetchListProduct({ page: 1, limit: 10000 })
      );

      let currentRoot = unwrapResult(listProduct);
      const dataNew = currentRoot._Array.map((item) => {
        const text = item.product_name;

        const value = JSON.stringify({
          value: item.product_name,
          product_code: item.product_code,
          product_price: item.product_price,
          quantity: item.quantity || 1,
          unit: item.unit,
        });

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

  useEffect(() => {
    if (Number(id) === 0 && type === "create") {
      return;
    }
    _fetchItem(id);
  }, [id]);

  useEffect(() => {
    _fetchAPIListWarehouses();
  }, []);

  const _fetchAPIListWarehouses = async () => {
    try {
      const data = await APIService._getListWarehouses(filter);
      data._Array.map((item) => {
        item.id = JSON.stringify({
          title: item.title,
          full_name: item.full_name,
          partner_name: item.partner_name,
        });
      });
      setWarehouseList(data._Array);
    } catch (error) {
      console.log(error);
    } finally {
      // setLoadingTable(false);
    }
  };

  const _fetchItem = async (id_import_warehouse) => {
    try {
      const data = await dispatch(
        _reducerFetchImportWarehouseItem(id_import_warehouse)
      );
      const currentData = unwrapResult(data);
      if (currentData.code === "Fail") {
        message.error(currentData.message);
        return;
      }

      form.setFieldsValue({
        notes: currentData.notes,
        title: currentData.title,
        import_for_warehouse: currentData.import_for_warehouse,
        product_list: currentData.product_list,
        delivered_info: currentData.delivered_info || [],
        verify_by_stocker: currentData.verify_by_stocker,
        application_creator: currentData.application_creator,
        verify_by_receiver: currentData.verify_by_receiver,
        delivered_by: currentData.delivered_by,
        full_name: currentData.full_name,
        partner_name: currentData.partner_name,
      });
      let dateTime = FormatterDay.dateFormatWithString(
        new Date(currentData.created_date).getTime(),
        "#DD#/#MM#/#YYYY#"
      );
      setCurrentDob(dateTime);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    if (Number(id) === 0 && type === "create") {
      setLoadingSubmit(true);
      var dateParts = currentDob.split("/");
      let timeDob = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
      values.product_list.map((item) => {
        item.supplier_name = values.import_for_warehouse;
      });
    
      const dataAdd = {
        notes: values.notes,
        title: `${values.import_for_warehouse}`,
        created_date: timeDob,
        import_for_warehouse: values.import_for_warehouse,
        product_list: values.product_list,
        delivered_info: values.delivered_info || [],
        verify_by_stocker: values.verify_by_stocker,
        application_creator: values.application_creator,
        verify_by_receiver: values.verify_by_receiver,
        delivered_by: values.delivered_by,
        full_name: values.full_name,
        partner_name: values.partner_name,
        supplier_name: values.import_for_warehouse,
      };
      const data = await dispatch(_reducerFetchImportWarehouseCreate(dataAdd));
      const currentData = unwrapResult(data);
      if (currentData.code === "Fail") {
        setLoadingSubmit(false);

        return openNotificationWithIcon(currentData.message);
      }
      message.success("Tạo phiếu thành công");

      navigate.push("/warehouses/import");
    } else {
      setLoadingSubmit(true);
      var dateParts = currentDob.split("/");
      let timeDob = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
      values.product_list.map((item) => {
        item.supplier_name = values.import_for_warehouse;
      });
      const dataUpdate = {
        notes: values.notes,
        title: values.title,
        created_date: timeDob,
        import_for_warehouse: values.import_for_warehouse,
        product_list: values.product_list,
        delivered_info: values.delivered_info || [],
        verify_by_stocker: values.verify_by_stocker,
        application_creator: values.application_creator,
        verify_by_receiver: values.verify_by_receiver,
        delivered_by: values.delivered_by,
        full_name: values.full_name,
        partner_name: values.partner_name,
        supplier_name: values.import_for_warehouse,
      };
      const data = await APIService._putImportWarehouse(id, dataUpdate);
      if (data.code === "Fail") {
        setLoadingSubmit(false);

        return openNotificationWithIcon(data.message);
      }
      message.success("Chỉnh sửa thành công");
      navigate.push("/warehouses/import");
    }
  };

  console.log(warehouseList);

  return (
    <div>
      <Skeleton active paragraph={{ rows: 12 }} loading={loading}>
        <Form form={form} onFinish={onFinish} autoComplete="off" {...layout}>
          <PageHeader
            onBack={() => navigate.goBack()}
            title="TẠO PHIẾU NHẬP KHO"
            style={{ padding: 0, marginBottom: 24 }}
            extra={[
              <Space align="baseline">
                <Form.Item>
                  {type === "create" ? (
                    <Button
                      loading={loadingSubmit}
                      type="primary"
                      icon={<PlusCircleOutlined />}
                      htmlType="submit"
                    >
                      Tạo mới
                    </Button>
                  ) : (
                    <Button
                      loading={loadingSubmit}
                      type="primary"
                      icon={<SaveOutlined />}
                      htmlType="submit"
                    >
                      Lưu
                    </Button>
                  )}
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
                  name="import_for_warehouse"
                  label="Nhà Cung Cấp"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng điền tên Nhà Cung Cấp.",
                    },
                  ]}
                >
                  <ISelect
                    dataOption={warehouseList}
                    keyName="id"
                    valueName="title"
                    placeholder="Vui lòng chọn Kho"
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
            </Row>
            <Row gutter={[16, 0]}>
              <Col span={12}>
                <Form.Item hasFeedback name="full_name" label="Họ và Tên">
                  <Input placeholder="Vui lòng chọn Kho" disabled={true} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item hasFeedback name="partner_name" label="Tên đối tác">
                  <Input placeholder="Vui lòng chọn Kho" disabled={true} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item hasFeedback name="title" label="Tên phiếu">
                  <Input placeholder="Tên phiếu tự sinh ra" disabled={true} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item hasFeedback label="Ngày tạo phiếu">
                  <DatePicker
                    placeholder="Vùi lòng chọn ngày bắt đầu làm việc"
                    defaultValue={moment(currentDob, dateFormat)}
                    format={dateFormat}
                    onChange={(date, dateString) => {
                      setCurrentDob(dateString);
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  hasFeedback
                  name="application_creator"
                  label="Người tạo phiếu"
                  initialValue={UserService._getData()}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên người tạo phiếu.",
                    },
                  ]}
                >
                  <Input
                    placeholder="Vui lòng nhập tên người tạo phiếu."
                    disabled={true}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  hasFeedback
                  name="verify_by_stocker"
                  label="Người kiểm hàng"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng điền tên người khiểm hàng.",
                    },
                  ]}
                >
                  <Input placeholder="Vui lòng điền tên người khiểm hàng." />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  hasFeedback
                  name="verify_by_receiver"
                  label="Người nhận hàng"
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
                  label="Hình thức vận chuyển"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng điền hình thức vận chuyển",
                    },
                  ]}
                >
                  <Input placeholder="Vui lòng điền hình thức vận chuyển" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Paragraph>
                  <Text style={{ color: "red" }}>*</Text> Sản phẩm nhập kho
                </Paragraph>
                <Form.List name="product_list">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field) => (
                        <Space
                          key={field.key}
                          style={{ marginBottom: 8 }}
                          align="baseline"
                          direction="vertical"
                        >
                          <Row gutter={[16, 0]}>
                            <Col span={24} style={{ textAlign: "right" }}>
                              <CloseCircleFilled
                                onClick={() => remove(field.name)}
                              />
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                {...field}
                                label="Tên sản phẩm"
                                name={[field.name, "product_name"]}
                                fieldKey={[field.fieldKey, "product_name"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Vui lòng điền tên sản phẩm.",
                                  },
                                ]}
                              >
                                <ISelect
                                  onChange={(key, option) => {
                                    const dataParse = JSON.parse(option.key);

                                    let value = form.getFieldValue(
                                      "product_list"
                                    );

                                    const total_price =
                                      dataParse.product_price *
                                      dataParse.quantity;

                                    value[field.fieldKey].product_code =
                                      dataParse.product_code;

                                    value[field.fieldKey].product_price =
                                      dataParse.product_price;

                                    value[field.fieldKey].quantity =
                                      dataParse.quantity;

                                    value[field.fieldKey].unit = dataParse.unit;

                                    value[
                                      field.fieldKey
                                    ].total_price = total_price;

                                    form.setFieldsValue({
                                      product_list: [...value],
                                    });
                                  }}
                                  dataOption={list_product}
                                  keyName="value"
                                  valueName="text"
                                  placeholder="Vui lòng chọn tên sản phẩm"
                                />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                {...field}
                                label="BARCODE"
                                name={[field.name, "product_code"]}
                                fieldKey={[field.fieldKey, "product_code"]}
                              >
                                <Input disabled={true} />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                {...field}
                                label="Số lượng"
                                name={[field.name, "quantity"]}
                                fieldKey={[field.fieldKey, "quantity"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Vui lòng nhập số lượng sản phẩm.",
                                  },
                                ]}
                              >
                                <InputNumber
                                  onChange={(e) => {
                                    let value = form.getFieldValue(
                                      "product_list"
                                    );
                                    value[field.fieldKey].total_price =
                                      value[field.fieldKey].product_price * e;
                                    form.setFieldsValue({
                                      product_list: [...value],
                                    });
                                  }}
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
                            <Col span={12}>
                              <Form.Item
                                {...field}
                                label="Giá"
                                name={[field.name, "product_price"]}
                                fieldKey={[field.fieldKey, "product_price"]}
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
                                  disabled={true}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                {...field}
                                label="Đơn vị"
                                name={[field.name, "unit"]}
                                fieldKey={[field.fieldKey, "unit"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Vui lòng điền đơn vị sản phẩm.",
                                  },
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
                            <Col span={12}>
                              <Form.Item
                                {...field}
                                label="Tổng tiền"
                                name={[field.name, "total_price"]}
                                fieldKey={[field.fieldKey, "total_price"]}
                                // value={
                                //   form.getFieldValue("product_list")[
                                //     field.fieldKey
                                //   ].total_price *
                                //   form.getFieldValue("product_list")[
                                //     field.fieldKey
                                //   ].quantity
                                // }
                              >
                                <InputNumber
                                  style={{ width: "100%" }}
                                  formatter={(totalPrice) =>
                                    `${totalPrice}`.replace(
                                      /\B(?=(\d{3})+(?!\d))/g,
                                      ","
                                    )
                                  }
                                  parser={(totalPrice) =>
                                    totalPrice.replace(/\$\s?|(,*)/g, "")
                                  }
                                  disabled={true}
                                />
                              </Form.Item>
                            </Col>
                            {/* <Col span={12}>
                              <Form.Item
                                {...field}
                                label="Nhà cung cấp"
                                name={[field.name, "supplier_name"]}
                                fieldKey={[field.fieldKey, "supplier_name"]}
                                rules={[
                                  {
                                    required: true,
                                    message:
                                      "Vui lòng nhập đơn vị cung cấp sản phẩm.",
                                  },
                                ]}
                              >
                                <ISelect
                                  dataOption={warehouseList}
                                  keyName="id"
                                  valueName="title"
                                  placeholder="Vui lòng chọn Kho"
                                />
                              </Form.Item>
                            </Col> */}
                          </Row>
                        </Space>
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
          </div>
        </Form>
      </Skeleton>
    </div>
  );
}
