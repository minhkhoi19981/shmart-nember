import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  message,
  notification,
  Row,
  Skeleton,
  Space,
} from "antd";
import { ISelect } from "../../common";
import TextArea from "antd/lib/input/TextArea";
import moment from "moment";
import { useDispatch } from "react-redux";
import {
  _reducerFetchStationsCreate,
  _reducerFetchStationsItem,
  _reducerFetchStationsUpdate,
} from "../../reducers/Stations/reducers";
import { unwrapResult } from "@reduxjs/toolkit";
import FormatterDay from "../../utils/FormatterDay";
import { APIService } from "../../apis";

const dateFormat = "DD/MM/YYYY";
const timeNowDate = new Date();
const currentTime = FormatterDay.dateFormatWithString(
  timeNowDate.getTime(),
  "#DD#/#MM#/#YYYY#"
);
export default function CreateStationPage(props) {
  const {
    visibleCreate,
    onCreateCallback,
    onCloseCallback,
    edit,
    idStations,
  } = props;
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [currentDob, setCurrentDob] = useState(currentTime);

  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const openNotificationWithIcon = (title) => {
    notification.error({
      message: "Thông báo",
      description: title,
      placement: "topLeft",
    });
  };

  const _fetchDetailStations = async (idStations) => {
    try {
      const data = await dispatch(_reducerFetchStationsItem(idStations));
      const currentStations = unwrapResult(data);
      if (currentStations.code === "Fail") {
        return openNotificationWithIcon(currentStations.message);
      }
      form.setFieldsValue({
        store_name: currentStations.store_name,
        address: currentStations.address,
        manager_by: currentStations.manager_by,
        owned_by: currentStations.owned_by,
        total_investor: 1,
        investor_list: currentStations.investor_list,
        average_revenue: currentStations.average_revenue,
        is_main_warehouse: currentStations.is_main_warehouse
          ? "Là Kho Chính"
          : "Không Là Kho Chính",
        regional: currentStations.regional,
        staff_captain_shift_one: currentStations.staff_captain_shift_one,
        staff_captain_shift_one_phone:
          currentStations.staff_captain_shift_one_phone,

        staff_vice_captain_shift_one:
          currentStations.staff_vice_captain_shift_one,
        staff_vice_captain_shift_one_phone:
          currentStations.staff_vice_captain_shift_one_phone,

        staff_captain_shift_two: currentStations.staff_captain_shift_two,
        staff_captain_shift_two_phone:
          currentStations.staff_captain_shift_two_phone,

        staff_vice_captain_shift_two:
          currentStations.staff_vice_captain_shift_two,
        staff_vice_captain_shift_two_phone:
          currentStations.staff_vice_captain_shift_two_phone,
      });

      let dateTime = FormatterDay.dateFormatWithString(
        new Date(currentStations.kick_off_date).getTime(),
        "#DD#/#MM#/#YYYY#"
      );
      setCurrentDob(dateTime);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    if (edit) {
      setLoadingDetail(true);
      _fetchDetailStations(idStations);
    } else {
      setLoadingDetail(false);
      setCurrentDob(currentTime);
    }
  }, [edit]);

  const _fetchPostStation = async (dataAdd) => {
    try {
      const data = await dispatch(_reducerFetchStationsCreate(dataAdd));
      const currentStations = unwrapResult(data);
      if (currentStations.code === "Fail") {
        return openNotificationWithIcon(currentStations.message);
      }
      form.resetFields([
        "store_name",
        "address",
        "kick_off_date",
        "manager_by",
        "owned_by",
        "total_investor",
        "investor_list",
        "average_revenue",
        "is_main_warehouse",
        "regional",
        "staff_captain_shift_one",
        "staff_captain_shift_one_phone",
        "staff_captain_shift_two",
        "staff_captain_shift_two_phone",
        "staff_vice_captain_shift_one",
        "staff_vice_captain_shift_one_phone",
        "staff_vice_captain_shift_two",
        "staff_vice_captain_shift_two_phone",
      ]);
      onCreateCallback();
    } catch (error) {
    } finally {
      setLoadingSubmit(false);
    }
  };

  const _fetchUpdateStation = async (idStations, dataUpdate) => {
    try {
      const data = await APIService._putStations(idStations, dataUpdate);
      if (data.code === "Fail") {
        return openNotificationWithIcon(data.message);
      }
      message.success("Chỉnh sửa thông tin.");
      setLoadingDetail(true);
      form.resetFields([
        "store_name",
        "address",
        "kick_off_date",
        "manager_by",
        "owned_by",
        "store_contact",
        "total_investor",
        "investor_list",
        "average_revenue",
        "is_main_warehouse",
        "regional",
        "staff_captain_shift_one",
        "staff_captain_shift_one_phone",
        "staff_captain_shift_two",
        "staff_captain_shift_two_phone",
        "staff_vice_captain_shift_one",
        "staff_vice_captain_shift_one_phone",
        "staff_vice_captain_shift_two",
        "staff_vice_captain_shift_two_phone",
      ]);
      onCreateCallback();
    } catch (erorr) {
      console.log(erorr);
    } finally {
      setLoadingSubmit(false);
    }
  };

  const _fetchSubmit = (value) => {
    if (edit) {
      var dateParts = currentDob.split("/");
      let timeDob = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
      const dataUpdate = {
        store_name: value.store_name,
        address: value.address,
        kick_off_date: timeDob,
        manager_by: value.manager_by,
        owned_by: value.owned_by,
        store_contact: value.store_contact,
        total_investor: 1,
        investor_list: value.investor_list,
        average_revenue: value.average_revenue,
        is_main_warehouse: value.is_main_warehouse === "Active",
        regional: value.regional,

        staff_captain_shift_one: value.staff_captain_shift_one,
        staff_captain_shift_one_phone: value.staff_captain_shift_one_phone,

        staff_vice_captain_shift_one: value.staff_vice_captain_shift_one,
        staff_vice_captain_shift_one_phone:
          value.staff_vice_captain_shift_one_phone,

        staff_captain_shift_two: value.staff_captain_shift_two,
        staff_captain_shift_two_phone: value.staff_captain_shift_two_phone,

        staff_vice_captain_shift_two: value.staff_vice_captain_shift_two,
        staff_vice_captain_shift_two_phone:
          value.staff_vice_captain_shift_two_phone,
        id: idStations,
      };
      setLoadingSubmit(true);
      _fetchUpdateStation(idStations, dataUpdate);
    } else {
      var dateParts = currentDob.split("/");
      let timeDob = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);

      const dataAdd = {
        store_name: `SHMART_` + Math.floor(Math.random() * 1000000 + 1),
        address: value.address,
        kick_off_date: timeDob,
        manager_by: value.manager_by,
        owned_by: value.owned_by,
        store_contact: value.store_contact,
        total_investor: 1,
        investor_list: value.investor_list,
        average_revenue: value.average_revenue,
        is_main_warehouse: value.is_main_warehouse === "Active",
        regional: value.regional,

        staff_captain_shift_one: value.staff_captain_shift_one,
        staff_captain_shift_one_phone: value.staff_captain_shift_one_phone,

        staff_vice_captain_shift_one: value.staff_vice_captain_shift_one,
        staff_vice_captain_shift_one_phone:
          value.staff_vice_captain_shift_one_phone,

        staff_captain_shift_two: value.staff_captain_shift_two,
        staff_captain_shift_two_phone: value.staff_captain_shift_two_phone,

        staff_vice_captain_shift_two: value.staff_vice_captain_shift_two,
        staff_vice_captain_shift_two_phone:
          value.staff_vice_captain_shift_two_phone,
      };

      setLoadingSubmit(true);
      _fetchPostStation(dataAdd);
    }
  };

  return (
    <div>
      <Drawer
        visible={visibleCreate}
        title={edit ? "CHỈNH SỬA" : "TẠO ĐIỂM MỚI"}
        width={"100%"}
        onClose={() => {
          onCloseCallback();
          form.resetFields([
            "store_name",
            "address",
            "kick_off_date",
            "manager_by",
            "owned_by",
            "store_contact",
            "total_investor",
            "investor_list",
            "average_revenue",
            "is_main_warehouse",
            "regional",
            "staff_captain_shift_one",
            "staff_captain_shift_one_phone",
            "staff_captain_shift_two",
            "staff_captain_shift_two_phone",
            "staff_vice_captain_shift_one",
            "staff_vice_captain_shift_one_phone",
            "staff_vice_captain_shift_two",
            "staff_vice_captain_shift_two_phone",
          ]);
        }}
      >
        <Skeleton active paragraph={{ rows: 8 }} loading={loadingDetail}>
          <Form
            layout="vertical"
            hideRequiredMark
            form={form}
            onFinish={(value) => {
              _fetchSubmit(value);
            }}
          >
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="store_name" label="Tên cừa hàng" hasFeedback>
                  <Input
                    placeholder="HỆ THỐNG TỰ ĐỘNG"
                    disabled={true}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="manager_by"
                  label="Người quản lý"
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên người quản lý.",
                    },
                  ]}
                >
                  <Input placeholder="Vui lòng nhập tên người quản lý." />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="owned_by"
                  label="Chủ Cửa Hàng"
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên Chủ Cửa Hàng.",
                    },
                  ]}
                >
                  <Input placeholder="Vui lòng nhập tên Chủ Cửa Hàng." />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="store_contact"
                  label="Số Điện Thoại Cửa Hàng"
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập Số Điện Thoại Cửa Hàng.",
                    },
                  ]}
                >
                  <Input placeholder="Vui lòng nhập Số Điện Thoại Cửa Hàng." />
                </Form.Item>
              </Col>

              {/* <Col span={24}>
                <Form.Item
                  name="average_revenue"
                  label="Doanh số trung bình"
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập doanh số trung bình.",
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="Vui lòng nhập doanh số trung bình."
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
                  hasFeedback
                  name="regional"
                  label="Khu vực"
                  rules={[
                    { required: true, message: "Vui lòng chọn khu vực." },
                  ]}
                >
                  <ISelect
                    showSearch
                    dataOption={[
                      {
                        value: "Cần Thơ",
                        text: "Cần Thơ",
                      },
                      {
                        value: "Vũng Tàu",
                        text: "Vũng Tàu",
                      },
                      {
                        value: "Hà Nội",
                        text: "Hà Nội",
                      },
                      {
                        value: "Nha Trang",
                        text: "Nha Trang",
                      },
                      {
                        value: "Hồ Chí Minh",
                        text: "Hồ Chí Minh",
                      },
                    ]}
                    keyName="value"
                    valueName="text"
                    placeholder="Vui lòng chọn khu vực"
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Ngày bắt đầu">
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
              <Col span={24}>
                <Form.Item name="is_main_warehouse" label="Kho chính">
                  <ISelect
                    showSearch
                    dataOption={[
                      {
                        value: true,
                        text: "Là Kho Chính",
                      },
                      {
                        value: false,
                        text: "Không Là Kho Chính",
                      },
                    ]}
                    keyName="value"
                    valueName="text"
                    placeholder="Vui lòng chọn khu vực"
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="address"
                  label="Địa chỉ"
                  rules={[{ required: true, message: "Vui lòng điền địa chỉ" }]}
                >
                  <TextArea
                    placeholder="Vui lòng điền địa chỉ"
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
        </Skeleton>
      </Drawer>
    </div>
  );
}

CreateStationPage.prototype = {
  visibleCreate: PropTypes.bool.isRequired,
  onCloseCallback: PropTypes.func.isRequired,
  onCreateCallback: PropTypes.func.isRequired,
  idRoles: PropTypes.string.isRequired,
  edit: PropTypes.bool.isRequired,
};
