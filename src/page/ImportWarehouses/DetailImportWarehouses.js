import { EditOutlined, FilePdfOutlined } from "@ant-design/icons";
import { unwrapResult } from "@reduxjs/toolkit";
import {
  Col,
  Descriptions,
  PageHeader,
  Row,
  Skeleton,
  List,
  message,
  Button,
} from "antd";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useHistory, useParams } from "react-router-dom";
import { _reducerFetchImportWarehouseItem } from "../../reducers/Warehouses/reducer";
import { priceFormat } from "../../utils";
import FormatterDay from "../../utils/FormatterDay";

const formatDay = "#hhh#:#mm#:#ss# #DD#/#MM#/#YYYY#";

export default function DetailImportWarehouses() {
  const [dataDetail, setDataDetail] = useState({
    product_list: [],
    created_date: "2020-12-17T00:00:00.000Z",
    delivered_info: [],
  });

  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useHistory();
  const dispatch = useDispatch();

  const _fetchItem = async (id_import_warehouse) => {
    try {
      const data = await dispatch(
        _reducerFetchImportWarehouseItem(id_import_warehouse)
      );
      const currentStations = unwrapResult(data);
      if (currentStations.code === "Fail") {
        message.error(currentStations.message);
        return;
      }
      setDataDetail({ ...currentStations });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    _fetchItem(id);
  }, [id]);

  return (
    <div>
      <PageHeader
        onBack={() => navigate.goBack()}
        title="Chi Tiết Phiếu Xuất Hàng / Trả Hàng"
        style={{ padding: 0, marginBottom: 24 }}
        subTitle={id}
        extra={[
          <Link to={`/warehouses/import/edit/${id}`}>
            <Button type="primary" icon={<EditOutlined />}>
              Chỉnh sửa
            </Button>
          </Link>,
          <Link to={`/pdf/import/${id}`}>
            <Button type="primary" icon={<FilePdfOutlined />}>
              In Pdf
            </Button>
          </Link>,
        ]}
      />
      {loading ? (
        <div>
          <Skeleton active paragraph={{ rows: 12 }} loading={true} />
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Descriptions
              title="Thông tin phiếu"
              column={{ xxl: 4, xl: 2, xs: 2 }}
            >
              <Descriptions.Item label="Tên phiếu">
                {dataDetail.title}
              </Descriptions.Item>
              <Descriptions.Item label="Họ và Tên">
                {dataDetail.full_name}
              </Descriptions.Item>
              <Descriptions.Item label="Tên đối tác">
                {dataDetail.partner_name}
              </Descriptions.Item>
              <Descriptions.Item label="Người tạo phiếu">
                {dataDetail.application_creator}
              </Descriptions.Item>

              <Descriptions.Item label="Ngày tạo phiếu">
                {FormatterDay.dateFormatWithString(
                  new Date(dataDetail.created_date).getTime(),
                  formatDay
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Kho nhập">
                {dataDetail.import_for_warehouse}
              </Descriptions.Item>
              <Descriptions.Item label="Người kiểm hàng">
                {dataDetail.verify_by_stocker}
              </Descriptions.Item>
              <Descriptions.Item label="Người nhận hàng">
                {dataDetail.verify_by_receiver}
              </Descriptions.Item>
              <Descriptions.Item label="Giao hàng">
                {dataDetail.delivered_by}
              </Descriptions.Item>
              <Descriptions.Item label="Ghi chú">
                {dataDetail.notes}
              </Descriptions.Item>
            </Descriptions>
          </Col>
          {/* <Col span={24}>
            <Descriptions title="Thông tin shipper" column={{ xxl: 3 }}>
              {dataDetail.delivered_info.map((item) => (
                <>
                  <Descriptions.Item label="Họ và tên">
                    {item.shipper_name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại">
                    {item.shipper_phone}
                  </Descriptions.Item>
                  <Descriptions.Item label="Địa chỉ">
                    {item.shipper_address}
                  </Descriptions.Item>
                </>
              ))}
            </Descriptions>
          </Col> */}

          <Col span={24}>
            <div>
              <List
                itemLayout="vertical"
                size="small"
                header={<Title level={4}>Sản phẩm nhập kho</Title>}
                style={{ width: "100%" }}
                dataSource={dataDetail.product_list}
                renderItem={(item) => (
                  <List.Item key={item.title} extra={item.product_code}>
                    <List.Item.Meta title={item.product_name} />
                    <Descriptions column={{ xxl: 4, xl: 2, xs: 2 }}>
                      <Descriptions.Item label="Số lượng">
                        {priceFormat(item.quantity) + ` ${item.unit}`}
                      </Descriptions.Item>
                      <Descriptions.Item label="Giá tiền">
                        {priceFormat(item.product_price) + " VNĐ"}
                      </Descriptions.Item>
                      <Descriptions.Item label={<Text strong>Tổng tiền</Text>}>
                        {priceFormat(item.total_price) + " VNĐ"}
                      </Descriptions.Item>
                    </Descriptions>
                  </List.Item>
                )}
              />
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
}
