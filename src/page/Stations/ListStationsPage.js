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
  Typography,
  PageHeader,
} from "antd";
import { blue, red } from "@ant-design/colors";
import React, { useEffect, useState } from "react";
import { priceFormat } from "../../utils";
import {
  InfoCircleOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  PlusCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import FormatterDay from "../../utils/FormatterDay";
import styled from "styled-components";
import ITable from "../../common/Table";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import {
  _reducerFetchCountStations,
  _reducerFetchDeleteStations,
  _reducerFetchListStations,
  _reducerFetchStationsItem,
} from "../../reducers/Stations/reducers";
import { colors } from "../../utils/color";
import Text from "antd/lib/typography/Text";
import CreateStationPage from "./CreateStationPage";

const formatDay = "#hhh#:#mm#:#ss# #DD#/#MM#/#YYYY#";

const dividerSection = styled.p`
  border-bottom: 1px solid;
`;

export default function ListStationsPage() {
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
  });
  const dispatch = useDispatch();

  const navigate = useHistory();

  const [dataTable, setDataTable] = useState({});
  const [loadingTable, setLoadingTable] = useState(true);
  const [totalCount, setTotalCount] = useState(1);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [visible, setVisible] = useState(false);
  const [visibleCreate, setVisibleCreate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [idStations, setIdStations] = useState("");

  const [dataDetail, setDataDetail] = useState({
    kick_off_date: "2020-12-09T18:42:07.890Z",
    investor_list: [],
    staff_list: [],
  });

  const _fetchTotalCount = async () => {
    try {
      const data = await dispatch(_reducerFetchCountStations());
      const currentStations = unwrapResult(data);
      if (currentStations.code === "Fail") {
        message.error(currentStations.message);
        return;
      }
      setTotalCount(currentStations.TotalItems);
    } catch (error) {}
  };

  const _fetchItemStations = async (idStations) => {
    try {
      const data = await dispatch(_reducerFetchStationsItem(idStations));
      const currentStations = unwrapResult(data);
      if (currentStations.code === "Fail") {
        message.error(currentStations.message);
        return;
      }
      setDataDetail({ ...currentStations });
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
      const data = await dispatch(_reducerFetchDeleteStations(idStations));
      const currentStations = unwrapResult(data);
      if (currentStations.code === "Fail") {
        message.error(currentStations.message);
        return;
      }
      _fetchTableDouble();
    } catch (error) {}
  };

  const _fetchTableDouble = async () => {
    try {
      await _fetchTotalCount();
      await _fetchAPIList(filter);
    } catch (error) {}
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
      dataIndex: "store_name",
      key: "store_name",
    },

    {
      title: "Chủ cửa hàng",
      dataIndex: "owned_by",
      key: "owned_by",
    },

    {
      title: "Số Điện Thoại Cửa Hàng ",
      dataIndex: "store_contact",
      key: "store_contact",
    },

    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },

    {
      title: "Người quản lý",
      dataIndex: "manager_by",
      key: "manager_by",
    },
    // {
    //   title: "Sở Hữu",
    //   dataIndex: "investor_list",
    //   key: "investor_list",
    //   render: (investorList) => (
    //     <Space direction="vertical">
    //       {investorList.length === 0
    //         ? "-"
    //         : investorList.map((item) => (
    //           <Space size={4}>
    //             <UserOutlined />
    //             <Text>{item}</Text>
    //           </Space>
    //         ))}
    //     </Space>
    //   )
    // },
    // {
    //   title: "Khu vực",
    //   dataIndex: "regional",
    //   key: "regional",
    // },
    // {
    //   title: "Doanh Thu TB",
    //   dataIndex: "average_revenue",
    //   key: "average_revenue",
    //   render: (average_revenue) => <Text>{priceFormat(average_revenue)}</Text>,
    // },
    {
      fixed: "right",
      width: 100,
      align: "center",
      render: (obj) => (
        <Space size={12}>
          <Tooltip title="Chi tiết">
            <InfoCircleOutlined
              style={{ color: blue[5] }}
              onClick={() => {
                setVisible(true);
                _fetchItemStations(obj.id);
              }}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <EditOutlined onClick={() => setIdStations(obj.id)} />
          </Tooltip>
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
      const data = await dispatch(_reducerFetchListStations(filterTable));
      const currentStations = unwrapResult(data);
      if (currentStations.code === "Fail") {
        message.error(currentStations.message);
        return;
      }
      setDataTable({ ...currentStations });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingTable(false);
    }
  };

  const _handleDrawer = () => {
    setVisible(!visible);
  };

  return (
    <div>
      <Row gutter={[0, 20]}>
        <Col span={24}>
          <Typography.Title level={4}>
            DANH SÁCH CỬA HÀNG & ĐỊA CHỈ
          </Typography.Title>
        </Col>
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
            Tìm thấy <strong>{totalCount}</strong> tài liệu yêu cầu
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

      <Drawer
        visible={visible}
        width={"calc(100% - 220px)"}
        placement="right"
        closable={false}
        onClose={() => _handleDrawer()}
      >
        <PageHeader
          onBack={() => _handleDrawer()}
          title="CHI TIẾT ĐIỂM BÁN"
          extra={[
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => {
                _handleDrawer();
                setIdStations(dataDetail.id);
              }}
            >
              Chỉnh sửa
            </Button>,
          ]}
        >
          <Skeleton active paragraph={{ rows: 8 }} loading={loadingDetail}>
            <Descriptions column={1}>
              <Descriptions.Item label="Tên cửa hàng">
                {dataDetail.store_name}
              </Descriptions.Item>
              <Descriptions.Item label="Người quản lý">
                {dataDetail.manager_by}
              </Descriptions.Item>
              <Descriptions.Item label="Kho chính">
                {dataDetail.is_main_warehouse ? (
                  <CheckOutlined style={{ color: colors.main, marginTop: 3 }} />
                ) : (
                  <CloseOutlined style={{ color: "#ff4d4f", marginTop: 3 }} />
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày bắt đầu:">
                {FormatterDay.dateFormatWithString(
                  new Date(dataDetail.kick_off_date).getTime(),
                  formatDay
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Doanh thu trung bình:">
                {priceFormat(dataDetail.average_revenue) + "đ"}
              </Descriptions.Item>
              <Descriptions.Item label="Khu vực:">
                {dataDetail.regional}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại liên hệ">
                {dataDetail.store_contact}
              </Descriptions.Item>
              <Descriptions.Item label="Địa Chỉ:">
                {dataDetail.address}
              </Descriptions.Item>
              <Descriptions.Item label="Tổng nhà đầu tư">
                {dataDetail.total_investor}
              </Descriptions.Item>
              <Descriptions.Item label="Nhà đầu tư">
                <Space direction="vertical">
                  {dataDetail.investor_list.length === 0
                    ? "-"
                    : dataDetail.investor_list.map((item) => (
                        <Space size={4}>
                          <UserOutlined />
                          <Text>{item}</Text>
                        </Space>
                      ))}
                </Space>
              </Descriptions.Item>
              <dividerSection />
              <br />
              <h1>
                <strong>PHÂN CÔNG</strong>
              </h1>
              <hr />
              <Descriptions.Item label="Nhân Viên Điểm Bán (Ca sáng 6:00 - 11:30)"></Descriptions.Item>
              <Descriptions.Item>
                <Text>
                  1. <strong>{dataDetail.staff_captain_shift_one}</strong> -{" "}
                  {dataDetail.staff_captain_shift_one_phone} (Ca Trưởng)
                </Text>
              </Descriptions.Item>
              <Descriptions.Item>
                <Text>
                  2. {dataDetail.staff_vice_captain_shift_one} -{" "}
                  {dataDetail.staff_vice_captain_shift_one_phone}
                </Text>
              </Descriptions.Item>
              <br />
              <Descriptions.Item label="Nhân Viên Điểm Bán (Ca chiều 15:00 - 20:30)"></Descriptions.Item>
              <Descriptions.Item>
                <Text>
                  1. <strong>{dataDetail.staff_captain_shift_two}</strong> -{" "}
                  {dataDetail.staff_captain_shift_two_phone} (Ca Trưởng)
                </Text>
              </Descriptions.Item>
              <Descriptions.Item>
                <Text>
                  2. {dataDetail.staff_vice_captain_shift_two} -{" "}
                  {dataDetail.staff_vice_captain_shift_two_phone}
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </Skeleton>
        </PageHeader>
      </Drawer>

      <CreateStationPage
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
