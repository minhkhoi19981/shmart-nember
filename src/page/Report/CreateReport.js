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
  _reducerFetchReportCreate,
  _reducerFetchReportItem,
  _reducerFetchReportUpdate,
} from "../../reducers/Report/reducers";
import { unwrapResult } from "@reduxjs/toolkit";
import FormatterDay from "../../utils/FormatterDay";
import { APIService } from "../../apis";

const dateFormat = "DD/MM/YYYY";
const timeNowDate = new Date();
const currentTime = FormatterDay.dateFormatWithString(
  timeNowDate.getTime(),
  "#DD#/#MM#/#YYYY#"
);
export default function CreateReport(props) {
  const {
    visibleCreate,
    onCreateCallback,
    onCloseCallback,
    edit,
    idStations,
  } = props;
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [createdDate, setCreatedDate] = useState(currentTime);

  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const openNotificationWithIcon = (title) => {
    notification.error({
      message: "Thông báo",
      description: title,
      placement: "topLeft",
    });
  };

  const _fetchDetailReport = async (id) => {
    try {
      const data = await dispatch(_reducerFetchReportItem(id));
      const currentReport = unwrapResult(data);
      if (currentReport.code === "Fail") {
        return openNotificationWithIcon(currentReport.message);
      }
      form.setFieldsValue({
        total_income: currentReport.total_income,
        net_profit: currentReport.net_profit,
        original_cost: currentReport.original_cost,
        created_date: currentReport.created_date,
        station_name: currentReport.station_name,
        created_by: currentReport.created_by,
      });

      let dateTime = FormatterDay.dateFormatWithString(
        new Date(currentReport.kick_off_date).getTime(),
        "#DD#/#MM#/#YYYY#"
      );
      setCreatedDate(dateTime);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    if (edit) {
      setLoadingDetail(true);
      _fetchDetailReport(idStations);
    } else {
      setLoadingDetail(false);
      setCreatedDate(currentTime);
    }
  }, [edit]);

  const _fetchPostReport = async (dataAdd) => {
    try {
      const data = await dispatch(_reducerFetchReportCreate(dataAdd));
      const currentReport = unwrapResult(data);
      if (currentReport.code === "Fail") {
        return openNotificationWithIcon(currentReport.message);
      }
      form.resetFields([
        "total_income",
        "net_profit",
        "original_cost",
        "created_date",
        "station_name",
        "created_by",
      ]);
      onCreateCallback();
    } catch (error) {
    } finally {
      setLoadingSubmit(false);
    }
  };

  const _fetchUpdateReport = async (id, dataUpdate) => {
    try {
      const data = await APIService._putReportItem(id, dataUpdate);
      if (data.code === "Fail") {
        return openNotificationWithIcon(data.message);
      }
      message.success("Chỉnh sửa thông tin thành công.");
      setLoadingDetail(true);
      form.resetFields([
        "total_income",
        "net_profit",
        "original_cost",
        "created_date",
        "station_name",
        "created_by",
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

      var dateParts = createdDate.split("/");
      let timeCreated = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);

      const dataUpdate = {
        total_income: value.total_income,
        net_profit: value.net_profit,
        original_cost: value.original_cost,
        created_date: timeCreated,
        station_name: value.station_name,
        created_by: value.created_by,
        id: value.id,
      };
      setLoadingSubmit(true);
      _fetchUpdateReport(value.id, dataUpdate);
    } else {

      var dateParts = createdDate.split("/");
      let timeCreated = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);

      const dataAdd = {
        total_income: value.total_income,
        net_profit: value.net_profit,
        original_cost: value.original_cost,

        created_date: timeCreated,

        station_name: value.station_name,
        created_by: value.created_by,
      };

      setLoadingSubmit(true);
      _fetchPostReport(dataAdd);
    }
  };

  return (
    <div>
      <Drawer
        visible={visibleCreate}
        title={edit ? "CHỈNH SỬA BÁO CÁO" : "TẠO BÁO CÁO MỚI"}
        width={'100%'}
        onClose={() => {
          onCloseCallback();
          form.resetFields([
            "total_income",
            "net_profit",
            "original_cost",
            "created_date",
            "station_name",
            "created_by",
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
              <Col span={24}>
                <Form.Item
                  name="station_name"
                  label="Tên điểm bán"
                  hasFeedback
                  rules={[
                    { required: true, message: "Vui lòng nhập tên điểm bán." },
                  ]}
                >
                  <Input placeholder="Vui lòng nhập tên điểm bán." />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="created_by"
                  label="Người tạp"
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên người tạo.",
                    },
                  ]}
                >
                  <Input placeholder="Vui lòng nhập tên người tạo." />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="total_income"
                  label="Doanh thu tổng"
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập doanh thu tổng.",
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="Vui lòng nhập doanh thu tổng."
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
                  name="original_cost"
                  label="Vốn"
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập Vốn.",
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="Vui lòng nhập Vốn."
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
                  name="net_profit"
                  label="Lợi nhuận (NET)"
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập lợi nhuận.",
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="Vui lòng nhập lợi nhuận."
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="Ngày tạo">
                  <DatePicker
                    placeholder="Vùi lòng chọn ngày"
                    defaultValue={moment(createdDate, dateFormat)}
                    format={dateFormat}
                    onChange={(date, dateString) => {
                      setCreatedDate(dateString);
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Skeleton>
      </Drawer>
    </div>
  );
}
