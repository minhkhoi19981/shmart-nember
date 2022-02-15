import {
  Button,
  Col,
  Descriptions,
  Drawer,
  message,
  Popconfirm,
  Row,
  Skeleton,
  Space,
  Tooltip,
  Typography
} from "antd";
import { blue, red } from "@ant-design/colors";
import React, { useEffect, useState } from "react";
import { priceFormat } from "../../utils";
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import FormatterDay from "../../utils/FormatterDay";
import ITable from "../../common/Table";
// import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";

import {
  _reducerFetchCountReport,
  _reducerFetchDeleteReport,
  _reducerFetchListReport,
  _reducerFetchReportItem,
} from "../../reducers/Report/reducers";

// import { colors } from "../../utils/color";
import Text from "antd/lib/typography/Text";
import CreateReport from "./CreateReport";
import { Container } from "../Dashboard/styled";

import styled from "styled-components";

const formatDay = "#hhh#:#mm#:#ss# #DD#/#MM#/#YYYY#";


const TotalSection = styled.div`
    padding: 20px;
    margin: 10px 50px 0 10px;
    background: #85a5af;
    border-radius: 5px;
    color: white;
    font-weight: bold;
    text-transform: uppercase;

    p {
        font-size: 25px;
        position: relative;
    }
`

export default function ListReport() {
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
  });
  const dispatch = useDispatch();

  // const navigate = useHistory();

  const [dataTable, setDataTable] = useState({});
  const [loadingTable, setLoadingTable] = useState(true);
  const [totalCount, setTotalCount] = useState(1);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [visible, setVisible] = useState(false);
  const [visibleCreate, setVisibleCreate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [idStations, setIdStations] = useState("");

  const [dataDetail, setDataDetail] = useState({});

  const _fetchTotalCount = async () => {
    try {
      const data = await dispatch(_reducerFetchCountReport());
      const currentReport = unwrapResult(data);
      if (currentReport.code === "Fail") {
        message.error(currentReport.message);
        return;
      }
      setTotalCount(currentReport.TotalItems);
    } catch (error) { }
  };

  const _fetchItemReport = async (dataId) => {
    try {
      const data = await dispatch(_reducerFetchReportItem(dataId));
      const currentReport = unwrapResult(data);
      if (currentReport.code === "Fail") {
        message.error(currentReport.message);
        return;
      }
      setDataDetail({ ...currentReport });
    } catch (error) {
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    _fetchTotalCount();
  }, []);

  useEffect(() => {
    _fetchAPIList(filter);
  }, [filter]);

  const _handleDrawerCreate = () => {
    setVisibleCreate(!visibleCreate);
  };

  const _fetchAPIRemoveStations = async (idStations) => {
    try {
      const data = await dispatch(_reducerFetchDeleteReport(idStations));
      const currentReport = unwrapResult(data);
      if (currentReport.code === "Fail") {
        message.error(currentReport.message);
        return;
      }
      _fetchTableDouble();
    } catch (error) { }
  };

  const _fetchTableDouble = async () => {
    try {
      await _fetchTotalCount();
      await _fetchAPIList(filter);
    } catch (error) { }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      width: 80,
      align: "center",
      key: "stt",
    },

    {
      title: "Tên cửa hàng",
      dataIndex: "station_name",
      key: "station_name",
    },
    {
      title: "Tổng Thu (VNĐ)",
      dataIndex: "total_income",
      key: "total_income",
      render: (total_income) => <Text>{priceFormat(total_income)}</Text>,
    },
    {
      title: "Ngày",
      dataIndex: "created_date",
      key: "created_date",
      render: (created_date) => (
        <Typography.Text>
          {FormatterDay.dateFormatWithString(
            new Date(created_date).getTime(),
            formatDay
          )}
        </Typography.Text>
      ),
    },
    {
      title: "Lợi Nhuận (VNĐ)",
      dataIndex: "net_profit",
      key: "net_profit",
      render: (net_profit) => <Text>{priceFormat(net_profit)}</Text>,
    },

    {
      title: "Người Tạo",
      dataIndex: "created_by",
      key: "created_by",
    },

    {
      title: "Mã đơn",
      dataIndex: "id",
      key: "id",
    },

    {
      fixed: "right",
      width: 100,
      align: "center",
      render: (obj) => (
        <Space size={12}>
          {/* <Tooltip title="Chi tiết">
            <InfoCircleOutlined
              style={{ color: blue[5] }}
              onClick={() => {
                setVisible(true);
                _fetchItemReport(obj.id);
              }}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <EditOutlined onClick={() => setIdStations(obj.id)} />
          </Tooltip> */}
          <Tooltip title="Xóa">
            <Popconfirm
              title="Are you sure to delete?"
              onConfirm={() => {
                setLoadingTable(true);
                _fetchAPIRemoveStations(obj.id);
              }}
              okText="Yes"
              cancelText="No"
            >
              <DeleteOutlined style={{ color: red[4] }} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    if (idStations === "") {
      return;
    }
    _handleDrawerCreate();
  }, [idStations]);

  useEffect(() => {
    if (idStations !== "") {
      setIsEdit(true);
    }
  }, [idStations]);

  const _fetchAPIList = async (filterTable) => {
    try {
      const data = await dispatch(_reducerFetchListReport(filterTable));
      const currentReport = unwrapResult(data);
      if (currentReport.code === "Fail") {
        message.error(currentReport.message);
        return;
      }
      setDataTable({ ...currentReport });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingTable(false);
    }
  };

  const _handleDrawer = () => {
    setVisible(!visible);
  };

  const randomRevenue = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
  }
  
  return (
    <div>
      <Container>
        <TotalSection>
          <Col>
            <span>DOANH THU MIỀN BẮC (Hà Nội):</span>
            <p><strong>{priceFormat(randomRevenue(60000000, 62000000))} vnđ</strong></p>
          </Col>
        </TotalSection>
        <br />
        <TotalSection>
          <Col>
            <span>DOANH THU TPHCM: </span>
            <p><strong>{priceFormat(randomRevenue(80000000, 83000000))} vnđ</strong></p>
          </Col>
        </TotalSection>
        <br />
        <TotalSection>
          <Col>
            <span>DOANH THU MIỀN TÂY (Cần Thơ): </span>
            <p><strong>{priceFormat(randomRevenue(52000000, 60000000))} vnđ</strong></p>
          </Col>
        </TotalSection>
      </Container>
      <Container>
        <Row gutter={[0, 20]}>
          <Col span={24}>
            <Typography.Title level={4}>BÁO CÁO DOANH THU</Typography.Title>
          </Col>

          <hr />
          <Col span={24} style={{ textAlign: "right" }}>
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={() => _handleDrawerCreate()}
            >
              Tạo mới
          </Button>
          </Col>
          <Col span={24}>
            <Typography.Text>
              Tìm thấy {totalCount} tài liệu yêu cầu
          </Typography.Text>
          </Col>
          <Col span={24}>
            <ITable
              dataSource={dataTable._Array}
              columns={columns}
              loading={loadingTable}
              scroll={{ x: 1600 }}
              totalCount={totalCount}
              rowKey="id"
              onChange={(pagination) => {
                setLoadingTable(true);
                setFilter({
                  ...filter,
                  page: pagination.current,
                  limit: pagination.pageSize,
                });
              }}
              pageSize={filter.limit}
            />
          </Col>
        </Row>
      </Container>
      <Drawer
        visible={visible}
        width={'100%'}
        placement="right"
        closable={false}
        onClose={() => _handleDrawer()}
      >
        <Skeleton active paragraph={{ rows: 8 }} loading={loadingDetail}>
          <Descriptions
            title="BÁO CÁO CHI TIẾT"
            column={1}
            extra={
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => {
                  _handleDrawer();
                  setIdStations(dataDetail.id);
                }}
              >
                Chỉnh sửa
              </Button>
            }
          >
            <Descriptions.Item label="Tên cửa hàng">
              {dataDetail.station_name}
            </Descriptions.Item>
            <Descriptions.Item label="Người Tạo">
              {dataDetail.created_by}
            </Descriptions.Item>
            <Descriptions.Item label="Tổng thu:">
              {priceFormat(dataDetail.total_income) + "đ"}
            </Descriptions.Item>
            <Descriptions.Item label="Vốn:">
              {priceFormat(dataDetail.original_cost) + "đ"}
            </Descriptions.Item>
            <Descriptions.Item label="Lợi nhuận (NET):">
              {priceFormat(dataDetail.net_profit) + "đ"}
            </Descriptions.Item>
          </Descriptions>
        </Skeleton>
      </Drawer>

      <CreateReport
        visibleCreate={visibleCreate}
        edit={isEdit}
        idStations={idStations}
        onCloseCallback={() => {
          setIdStations("");
          setIsEdit(false);
          _handleDrawerCreate();
        }}
        onCreateCallback={async () => {
          _handleDrawerCreate();
          setIdStations("");
          setLoadingTable(true);
          setIsEdit(false);
          await _fetchAPIList(filter);
        }}
      />
    </div>
  );
}
