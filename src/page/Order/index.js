import {
  Col,
  Row,
  Space,
  Tag,
  Typography,
  Tooltip,
  DatePicker,
  Button,
} from "antd";
import React, { useEffect, useState } from "react";
import { priceFormat } from "../../utils";
import {
  InfoCircleOutlined,
  WalletOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  FilterOutlined,
  CarOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import FormatterDay from "../../utils/FormatterDay";
import moment from "moment";
import { APIServiceV2 } from "../../apis";
import { ITable, ISelectV1 } from "../../common";
import { useHistory } from "react-router";
const { RangePicker } = DatePicker;

const formatDay = "#hhh#:#mm#:#ss# #DD#/#MM#/#YYYY#";
const dateFormat = "YYYY-MM-DD";

const NewDate = new Date();
const DateStart = new Date();
let startValue = DateStart.setMonth(DateStart.getMonth() - 1);
let endValue = NewDate.setHours(23, 59, 59, 999);

export default function OrderPage() {
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
    status: "",
    start_date: FormatterDay.dateFormatWithString(
      startValue,
      "#YYYY#-#MM#-#DD#"
    ),
    end_date: FormatterDay.dateFormatWithString(endValue, "#YYYY#-#MM#-#DD#"),
  });
  const navigate = useHistory();
  const [dataTable, setDataTable] = useState({});
  const [loadingTable, setLoadingTable] = useState(true);
  const [totalCount, setTotalCount] = useState(1);

  useEffect(() => {
    _fetchAPIListOrder(filter);
  }, [filter]);

  const _renderStatus = (status) => {
    // eslint-disable-next-line default-case
    switch (status) {
      case "ONLINE_PAID": {
        return (
          <Tag
            color="#5b8c00"
            icon={<WalletOutlined />}
            style={{ fontWeight: 600, borderRadius: 12 }}
          >
            Thanh toán trực tiếp
          </Tag>
        );
      }
      case "CANCELED": {
        return (
          <Tag
            color="error"
            style={{ fontWeight: 600, borderRadius: 12 }}
            icon={<CloseCircleOutlined />}
          >
            Hủy đơn
          </Tag>
        );
      }
      case "CONFIRMED": {
        return (
          <Tag
            color="#36cfc9"
            style={{ fontWeight: 600, borderRadius: 12 }}
            icon={<WalletOutlined />}
          >
            Đã xác nhận
          </Tag>
        );
      }
      case "REJECTED": {
        return (
          <Tag
            color="error"
            style={{ fontWeight: 600, borderRadius: 12 }}
            icon={<CloseCircleOutlined />}
          >
            Từ chối đơn
          </Tag>
        );
      }
      case "DELIVERED": {
        return (
          <Tag
            color="processing"
            style={{ fontWeight: 600, borderRadius: 12 }}
            icon={<CarOutlined />}
          >
            Đã giao hàng
          </Tag>
        );
      }
      case "COMPLETED": {
        return (
          <Tag
            color="success"
            style={{ fontWeight: 600, borderRadius: 12 }}
            icon={<CheckCircleOutlined />}
          >
            Hoàn thành
          </Tag>
        );
      }
    }
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
      title: "Mã hóa đơn",
      dataIndex: "order_title",
      key: "order_title",
    },
    {
      title: "Tạo bởi",
      render: (obj) => (
        <Typography.Text>
          {!obj.user.last_name ? "-" : obj.user.last_name}
        </Typography.Text>
      ),
    },
    {
      title: "Tên người nhận",
      render: (obj) => (
        <Typography.Text>
          {!obj.receiver.name ? "-" : obj.receiver.name}
        </Typography.Text>
      ),
    },
    {
      title: "Đ/C Giao Hàng",
      render: (obj) => (
        <Typography.Text>{`${obj.receiver.address}, ${obj.receiver.district}, ${obj.receiver.ward}, ${obj.receiver.city}`}</Typography.Text>
      ),
    },
    {
      title: "SĐT người nhận",
      render: (obj) => (
        <Typography.Text>
          {!obj.receiver.phone ? "-" : obj.receiver.phone}
        </Typography.Text>
      ),
    },

    // {
    //   title: "Thanh Toán",
    //   dataIndex: "payment_geteway",
    //   key: "payment_geteway",
    //   render: (payment_geteway) => (
    //     <Typography.Text>
    //       {payment_geteway === "Cash" ? "Khi Nhận Hàng" : "Tiền Mặt"}
    //     </Typography.Text>
    //   ),
    // },

    {
      title: "Ngày tạo phiếu",
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at) => (
        <Typography.Text>
          {FormatterDay.dateFormatWithString(
            new Date(created_at).getTime(),
            formatDay
          )}
        </Typography.Text>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      render: (status) => _renderStatus(status),
    },

    {
      title: "Casback",
      dataIndex: "price_sale",
      key: "price_sale",
      align: "right",
      render: (price_sale) => (
        <Typography.Text>{priceFormat(price_sale) + " VNĐ"}</Typography.Text>
      ),
    },

    {
      title: "Tổng Tiền",
      dataIndex: "total_price",
      key: "total_price",
      align: "right",

      render: (total_price) => (
        <Typography.Text>{priceFormat(total_price) + " VNĐ"}</Typography.Text>
      ),
    },

    {
      fixed: "right",
      width: 80,
      align: "center",
      render: (obj) => (
        <Tooltip title="Xem chi tiết">
          <InfoCircleOutlined />
        </Tooltip>
      ),
    },
  ];

  const _fetchAPIListOrder = async (filterTable) => {
    try {
      const data = await APIServiceV2._getListOrder(filterTable);
      data._Array.map((item, index) => {
        item.stt = (filter.page - 1) * filter.limit + index + 1;
        const sumCashbackProduct = item?.item_list.reduce(
          (accumulator, currentValue) => {
            return (
              accumulator +
              (currentValue?.product?.cashback_percent / 100) *
                currentValue?.product?.base_price *
                currentValue?.qty
            );
          },
          0
        );
        item.price_sale =
          (sumCashbackProduct * item.config_cashback_percent) / 100;
      });
      console.log(data._Array);
      setTotalCount(data.TotalCount);
      setDataTable({ ...data });
      setLoadingTable(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingTable(false);
    }
  };

  return (
    <div>
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Row align="middle">
            <Col span={12}>
              <Typography.Title level={4}>DANH SÁCH ĐƠN HÀNG</Typography.Title>
            </Col>
            <Col span={12} style={{ textAlign: "right" }}>
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={() => navigate.push("/order/create")}
              >
                Tạo mới
              </Button>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Typography.Text>
            Tìm thấy {totalCount} tài liệu yêu cầu
          </Typography.Text>
        </Col>
        <Col span={24}>
          <Space direction="vertical">
            <Space>
              <FilterOutlined />
              Tìm kiếm
            </Space>
            <Space>
              <RangePicker
                defaultValue={[
                  moment(filter.start_date, dateFormat),
                  moment(filter.end_date, dateFormat),
                ]}
                onChange={(date, dateString) => {
                  setLoadingTable(true);
                  setFilter({
                    ...filter,
                    page: 1,
                    start_date: dateString[0],
                    end_date: dateString[1],
                  });
                }}
              />
              <ISelectV1
                style={{ minWidth: 160 }}
                onChange={(key) => {
                  setLoadingTable(true);
                  setFilter({ ...filter, page: 1, status: key });
                }}
                dataOption={[
                  {
                    value: "",
                    text: "Tất cả",
                  },
                  {
                    value: "ONLINE_PAID",
                    text: "Thanh toán trực tiếp",
                  },
                  {
                    value: "CANCELED",
                    text: "Hủy đơn",
                  },
                  {
                    value: "CONFIRMED",
                    text: "Đã xác nhận",
                  },
                  {
                    value: "REJECTED",
                    text: "Từ chối đơn",
                  },
                  {
                    value: "DELIVERED",
                    text: "Đã giao hàng",
                  },
                ]}
                keyName="value"
                valueName="text"
                placeholder="Trạng thái"
              />
            </Space>
          </Space>
        </Col>
        <Col span={24}>
          <ITable
            dataSource={dataTable._Array}
            columns={columns}
            loading={loadingTable}
            scroll={{ x: 1600 }}
            totalCount={totalCount}
            rowKey="id"
            onRow={(record, rowIndex) => {
              return {
                onClick: (event, rowIndex) => {
                  const id = event.currentTarget.attributes[0].value;
                  const dataOfId = dataTable?._Array.find(
                    (el) => el.id === event.currentTarget.attributes[0].value
                  );
                  navigate.push({
                    pathname: `/order/detail/${id}`,
                    state: dataOfId,
                  });
                }, // click row
              };
            }}
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
