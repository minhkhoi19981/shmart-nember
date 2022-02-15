import {
  message,
  Button,
  Col,
  Descriptions,
  PageHeader,
  Row,
  Space,
  Tag,
  List,
  Typography,
  Avatar,
} from "antd";
import React, { useState } from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";
import { APIServiceV2 } from "../../apis";
import { priceFormat } from "../../utils";
import FormatterDay from "../../utils/FormatterDay";
import {
  InfoCircleOutlined,
  WalletOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  EditOutlined,
  CarOutlined,
} from "@ant-design/icons";
const formatDay = "#hhh#:#mm#:#ss# #DD#/#MM#/#YYYY#";

export default function DetailOrder() {
  const navigate = useHistory();
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const { state = { item_list: [] } } = useLocation();
  console.log(state);

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

  const _updateStatus = async (dataAdd, id) => {
    try {
      setLoadingSubmit(true);
      await APIServiceV2._postUpdateStatus(dataAdd, id);
      message.success("Cập nhật thành công.");
      navigate.goBack();
    } catch (error) {
    } finally {
      setLoadingSubmit(false);
    }
  };

  const _renderButtonStatus = (status) => {
    // eslint-disable-next-line default-case
    switch (status) {
      case "ONLINE_PAID": {
        return (
          <Space>
            <Button
              icon={<CloseCircleOutlined />}
              onClick={() => {
                _updateStatus(
                  {
                    status: "REJECTED",
                  },
                  state?.id
                );
              }}
              loading={loadingSubmit}
              style={{
                fontWeight: 600,
                background: "#ff4d4f",
                color: "white",
              }}
            >
              Từ chối
            </Button>
            <Button
              onClick={() => {
                _updateStatus(
                  {
                    status: "CONFIRMED",
                  },
                  state?.id
                );
              }}
              loading={loadingSubmit}
              type="primary"
              icon={<WalletOutlined />}
              style={{ fontWeight: 600 }}
            >
              Xác nhận
            </Button>
          </Space>
        );
      }

      case "CONFIRMED": {
        return (
          <Button
            onClick={() => {
              _updateStatus(
                {
                  status: "DELIVERED",
                },
                state?.id
              );
            }}
            loading={loadingSubmit}
            type="primary"
            icon={<CarOutlined />}
            style={{ fontWeight: 600 }}
          >
            Giao hàng
          </Button>
        );
      }

      case "DELIVERED": {
        return (
          <Button
            onClick={() => {
              _updateStatus(
                {
                  status: "COMPLETED",
                },
                state?.id
              );
            }}
            loading={loadingSubmit}
            type="primary"
            style={{ fontWeight: 600 }}
            icon={<CheckCircleOutlined />}
          >
            Hoàn thành
          </Button>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div>
      <PageHeader
        onBack={() => navigate.goBack()}
        title="CHI TIÊT ĐƠN HÀNG"
        style={{ padding: 0, marginBottom: 24 }}
        subTitle={state?.order_title}
        extra={[_renderButtonStatus(state?.status)]}
      />

      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Descriptions
            title="THÔNG TIN NGƯỜI ĐẶT HÀNG"
            column={{ xxl: 4, xl: 4, xs: 4 }}
          >
            <Descriptions.Item label="Họ và tên">
              <strong style={{ color: "red" }}>{state?.user?.last_name}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              <strong style={{ color: "red" }}>{state?.user?.email}</strong>
            </Descriptions.Item>
          </Descriptions>
        </Col>
        <Col span={24}>
          <Descriptions
            title="THÔNG TIN NGƯỜI NHẬN"
            column={{ xxl: 4, xl: 4, xs: 4 }}
          >
            <Descriptions.Item label="Họ và tên">
              <strong style={{ color: "red" }}>{state?.receiver?.name}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              <strong style={{ color: "red" }}>{state?.receiver?.phone}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ nhận hàng:">
              <strong
                style={{ color: "red" }}
              >{`${state?.receiver?.address}, ${state?.receiver?.district}, ${state?.receiver?.ward}, ${state?.receiver?.city}`}</strong>
            </Descriptions.Item>
          </Descriptions>
        </Col>

        <Col span={24}>
          <Descriptions title="THÔNG TIN ĐƠN HÀNG:">
            <Descriptions.Item label="Tổng tiền:">
              <strong style={{ color: "red" }}>
                {`${priceFormat(state.total_price)} ${state.currency}`}
              </strong>
            </Descriptions.Item>
            <Descriptions.Item label="Cashback:">
              <strong style={{ color: "red" }}>
                {`${priceFormat(state.price_sale)} ${state.currency}`}
              </strong>
            </Descriptions.Item>
            <Descriptions.Item label="Tạo bởi">
              {state?.user?.last_name}
            </Descriptions.Item>
            <Descriptions.Item label="Loại ví">
              {state.wallet_type}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái đơn">
              {_renderStatus(state?.status)}
            </Descriptions.Item>
          </Descriptions>
        </Col>
        <Col span={24}>
          <div>
            <List
              itemLayout="vertical"
              size="small"
              header={
                <Typography.Title level={4}>
                  CHI TIẾT ĐƠN HÀNG:
                </Typography.Title>
              }
              style={{ width: "100%" }}
              dataSource={state?.item_list}
              renderItem={(item) => (
                <List.Item
                  key={item.full_name}
                  extra={
                    <Avatar
                      shape="square"
                      style={{
                        width: 272,
                        height: 272,
                        objectFit: "scale-down",
                      }}
                      alt="logo"
                      src={item?.product?.images[0]}
                    />
                  }
                >
                  <List.Item.Meta
                    style={{ fontWeight: "bold", fintSize: "25px" }}
                    title={item?.product?.full_name}
                    description={item?.product?.produc_type}
                  />
                  <Descriptions>
                    <Descriptions.Item label="Giá">
                      {`${priceFormat(item?.product?.base_price)} ${
                        state.currency
                      }`}
                    </Descriptions.Item>

                    <Descriptions.Item label="Số lượng">
                      {`${priceFormat(item?.qty)}`}
                    </Descriptions.Item>
                    <Descriptions.Item label="Cashback">
                      {`${priceFormat(item?.cashback_percent)} VNĐ`}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tên danh mục">
                      {`${item?.product?.category_name}`}
                    </Descriptions.Item>
                    <Descriptions.Item label="Thương hiệu">
                      {`${item?.product?.trade_mark_name}`}
                    </Descriptions.Item>
                  </Descriptions>
                </List.Item>
              )}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}
