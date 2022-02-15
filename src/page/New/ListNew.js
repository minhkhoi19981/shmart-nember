import React, { useEffect, useRef, useState } from "react";
import {
  Badge,
  Button,
  Col,
  Input,
  InputNumber,
  message,
  Modal,
  notification,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import Title from "antd/lib/typography/Title";
import { APIServiceV2 } from "../../apis";
import { ISelectV1, ITable } from "../../common";
import FormatterDay from "../../utils/FormatterDay";
import { priceFormat } from "../../utils";
import {
  PlusCircleOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  EditOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import CreateNew from "./CreateNew";

const formatDay = "#hhh#:#mm#:#ss# #DD#/#MM#/#YYYY#";

export default function ListNew() {
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
    category_name: "",
  });

  const [dataTable, setDataTable] = useState({
    created_date: "2020-11-22T18:24:01.297Z",
  });
  const [visibleCreate, setVisibleCreate] = useState(false);

  const [loadingTable, setLoadingTable] = useState(true);

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      width: 50,
      align: "center",
      key: "stt",
    },
    {
      title: "Tin tức",
      dataIndex: "product_name",
      key: "product_name",
    },
    {
      title: "Danh mục",
      dataIndex: "category_name",
      key: "category_name",
    },
    {
      title: "Ngày tạo ",
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
      title: "Mô tả",
      dataIndex: "detail",
      align: "detail",
      ellipsis: true,
    },
    {
      title: "Độ ưu tiên",
      dataIndex: "priority",
      align: "right",
      key: "priority",
      render: (priority) => <span>{priceFormat(priority)}</span>,
    },
    {
      title: "Giá vé",
      dataIndex: "price",
      align: "right",
      key: "price",
      render: (price) => <span>{priceFormat(price) + " VNĐ"}</span>,
    },

    {
      title: "Trạng thái",
      align: "center",

      dataIndex: "status",
      key: "status",
      render: (status) =>
        status === "ACTIVE" ? (
          <Tag
            color="success"
            icon={<CheckCircleOutlined />}
            style={{ fontWeight: 600, borderRadius: 12 }}
          >
            Hoạt động
          </Tag>
        ) : (
          <Tag
            color="error"
            icon={<CloseCircleOutlined />}
            style={{ fontWeight: 600, borderRadius: 12 }}
          >
            Ngưng hoạt động
          </Tag>
        ),
    },
  ];

  const _fetchAPIListNew = async (filterTable) => {
    try {
      const data = await APIServiceV2._getListNew(filterTable);
      data._Array.map((item, index) => {
        item.stt = (filter.page - 1) * filter.limit + index + 1;
      });

      setDataTable({ ...data });
      setLoadingTable(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingTable(false);
    }
  };

  useEffect(() => {
    _fetchAPIListNew(filter);
  }, [filter]);

  const _handleDrawerCreate = () => {
    setVisibleCreate(!visibleCreate);
  };

  return (
    <div>
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Row align="middle">
            <Col span={12}>
              <Title level={4}>DANH SÁCH TIN TỨC</Title>
            </Col>
            <Col span={12} style={{ textAlign: "right" }}>
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={() => _handleDrawerCreate()}
              >
                Tạo mới
              </Button>
            </Col>
          </Row>
        </Col>

        <Col span={12}>
          <Typography.Text>
            Tìm thấy {dataTable.TotalCount} tài liệu yêu cầu
          </Typography.Text>
        </Col>
        <Col span={12} style={{ textAlign: "right" }}>
          <Space>
            <FilterOutlined />
            Tìm kiếm
            <ISelectV1
              style={{ minWidth: 160, textAlign: "left" }}
              onChange={(key) => {
                setLoadingTable(true);
                setFilter({ ...filter, page: 1, category_name: key });
              }}
              dataOption={[
                {
                  value: "",
                  text: "Tất cả",
                },
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
              placeholder="Danh mục"
            />
          </Space>
        </Col>

        <Col span={24}>
          <ITable
            dataSource={dataTable._Array}
            columns={columns}
            loading={loadingTable}
            totalCount={dataTable.TotalCount}
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
      <CreateNew
        visibleCreate={visibleCreate}
        onCreateCallback={async () => {
          _handleDrawerCreate();
          setLoadingTable(true);
          await _fetchAPIListNew(filter);
        }}
        onCloseCallback={() => {
          _handleDrawerCreate();
        }}
      />
    </div>
  );
}
