import {
  Button,
  Col,
  message,
  Popconfirm,
  Row,
  Space,
  Tooltip,
  Typography,
} from "antd";
import { blue, red } from "@ant-design/colors";
import React, { useEffect, useState } from "react";
import { priceFormat } from "../../utils";
import {
  InfoCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import FormatterDay from "../../utils/FormatterDay";

import ITable from "../../common/Table";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import Text from "antd/lib/typography/Text";
import {
  _reducerFetchListExportWarehouse,
  _reducerFetchCountExportWarehouse,
  _reducerFetchDeleteExportWarehouse,
} from "../../reducers/Warehouses/reducer";

const formatDay = "#hhh#:#mm#:#ss# #DD#/#MM#/#YYYY#";

export default function ListExportWarehouses() {
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
  });
  const dispatch = useDispatch();

  const [dataTable, setDataTable] = useState({});
  const [loadingTable, setLoadingTable] = useState(true);
  const [totalCount, setTotalCount] = useState(1);

  const _fetchTotalCount = async () => {
    try {
      const data = await dispatch(_reducerFetchCountExportWarehouse());
      const currentData = unwrapResult(data);
      if (currentData.code === "Fail") {
        message.error(currentData.message);
        return;
      }
      setTotalCount(currentData.TotalItems);
    } catch (error) {}
  };

  useEffect(() => {
    _fetchTotalCount();
  }, []);

  useEffect(() => {
    _fetchAPIList(filter);
  }, [filter]);

  const _fetchAPIRemove = async (id) => {
    try {
      const data = await dispatch(
        _reducerFetchDeleteExportWarehouse(id)
      );
      const currentData = unwrapResult(data);
      if (currentData.code === "Fail") {
        message.error(currentData.message);
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
      title: "Tên phiếu",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Người tạo phiếu",
      dataIndex: "application_creator",
      key: "application_creator",
    },
    {
      title: "Tổng tiền sản phẩm",
      dataIndex: "product_price",
      key: "product_price",
      render: (product_price) => <Text>{priceFormat(product_price)}</Text>,
    },
    {
      title: "Ngày tạo phiếu",
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
      title: "Kho xuất",
      dataIndex: "export_for_warehouse",
      key: "export_for_warehouse",
    },
    {
      title: "Người kiểm hàng",
      dataIndex: "verify_by_stocker",
      key: "verify_by_stocker",
    },
    {
      title: "Người nhận hàng",
      dataIndex: "verify_by_receiver",
      key: "verify_by_receiver",
    },
    {
      title: "Giao hàng",
      dataIndex: "delivered_by",
      key: "delivered_by",
    },

    {
      fixed: "right",
      width: 100,
      align: "center",
      render: (obj) => (
        <Space size={12}>
          <Tooltip title="Chi tiết">
            <Link to={`/warehouses/export/${obj.id}`}>
              <InfoCircleOutlined style={{ color: blue[5] }} />
            </Link>
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Link to={`/warehouses/export/edit/${obj.id}`}>
              <EditOutlined />
            </Link>
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Are you sure to delete?"
              onConfirm={() => {
                setLoadingTable(true);
                _fetchAPIRemove(obj.id);
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

  const _fetchAPIList = async (filterTable) => {
    try {
      const data = await dispatch(
        _reducerFetchListExportWarehouse(filterTable)
      );
      const currentData = unwrapResult(data);
      if (currentData.code === "Fail") {
        message.error(currentData.message);
        return;
      }
      setDataTable({ ...currentData });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingTable(false);
    }
  };

  return (
    <div>
      <Row gutter={[0, 24]}>
        <Col span={12}>
          <Typography.Title level={4}>
            PHIẾU XUẤT HÀNG / TRẢ HÀNG 
          </Typography.Title>
        </Col>
        <Col span={12} style={{ textAlign: "right" }}>
          <Link to={`/warehouses/export/create/0`}>
            <Button type="primary" icon={<PlusCircleOutlined />}>
              Tạo mới
            </Button>
          </Link>
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
    </div>
  );
}
