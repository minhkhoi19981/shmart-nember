import {
  Col,
  Row,
  Tag,
  Space,
  Typography,
  Skeleton,
  Button,
  Modal,
  message,
  InputNumber,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  FilterOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { APIServiceV2 } from "../../apis";
import Title from "antd/lib/typography/Title";
import { ITable, ISelectV1 } from "../../common";

import { priceFormat } from "../../utils";
import Avatar from "antd/lib/avatar/avatar";

export default function ListProductMobile() {
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
    status: "",
    type: "",
  });
  const [visible, setVisible] = useState(false);
  const [listProduct, setListProduct] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [loadingTable, setLoadingTable] = useState(true);
  const [totalCount, setTotalCount] = useState(1);
  const [dataAdd, setDataAdd] = useState({
    product_id: "Sản phẩm",
    type: "Loại",
    priority: 0,
  });

  const _fetchAPIList = async (filter) => {
    try {
      const listProduct = await APIServiceV2._getListProductViral(filter);
      listProduct._Array.map((item, index) => {
        item.stt = index + 1;
        item.isEdit = false;
      });

      setDataTable([...listProduct._Array]);
      setTotalCount(listProduct.TotalCount);
      setLoadingTable(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingTable(false);
    }
  };

  const _fetchAPIListProduct = async () => {
    try {
      const listProduct = await APIServiceV2._getListProduct({
        page: 1,
        limit: 100,
      });
      const list = listProduct._Array.map((item, index) => {
        const value = item.id;
        const text = item.full_name;
        return { value, text };
      });

      setListProduct([...list]);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  useEffect(() => {
    _fetchAPIListProduct();
  }, []);

  useEffect(() => {
    _fetchAPIList(filter);
  }, [filter]);

  const _renderStatus = (status) => {
    // eslint-disable-next-line default-case
    switch (status) {
      case "INACTIVE": {
        return (
          <Tag
            color="error"
            style={{ fontWeight: 600, borderRadius: 12 }}
            icon={<CloseCircleOutlined />}
          >
            Ngưng hoạt động
          </Tag>
        );
      }

      case "ACTIVE": {
        return (
          <Tag
            color="success"
            style={{ fontWeight: 600, borderRadius: 12 }}
            icon={<CheckCircleOutlined />}
          >
            Hoạt động
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
      title: "Tên sản phẩm",
      render: (obj) => <span>{obj?.product_id?.full_name}</span>,
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      render: (status) => _renderStatus(status),
    },
    {
      title: "Hình Ảnh",

      align: "center",

      render: (obj) => {
        return !obj?.product_id?.imagesPhone.length ? (
          <Skeleton.Image />
        ) : (
          <Avatar
            shape="square"
            size="large"
            src={obj?.product_id?.imagesPhone[0].url}
            style={{ width: 96, height: 96 }}
          />
        );
      },
    },
    {
      title: "Mã sản phẩm",
      render: (obj) => <span>{obj?.product_id?.code}</span>,
    },
    {
      title: "Tên danh mục",
      render: (obj) => <span>{obj?.product_id?.category_name}</span>,
    },
    {
      title: "Tên thương hiệu",
      render: (obj) => <span>{obj?.product_id?.trade_mark_name}</span>,
    },
    {
      title: "Loại hiển thị",
      key: "type",
      dataIndex: "type",
    },
    {
      title: "Ưu tiên",
      key: "priority",
      dataIndex: "priority",
      render: (priority) => <span>{priceFormat(priority)}</span>,
    },

    {
      title: "Tồn kho",
      align: "right",
      render: (obj) => <span>{priceFormat(obj?.product_id?.qty)}</span>,
    },
    {
      title: "Giá sản phẩm",
      align: "right",

      render: (obj) => <span>{priceFormat(obj?.product_id?.base_price)}đ</span>,
    },
  ];

  const hideModal = () => {
    setVisible(!visible);
  };

  return (
    <div>
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Row align="middle">
            <Col span={12}>
              <Title level={4}>DANH SÁCH SẢN PHẨM MOBILE</Title>
            </Col>
            <Col span={12} style={{ textAlign: "right" }}>
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={hideModal}
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
                    value: "ACTIVE",
                    text: "Hoạt động",
                  },
                  {
                    value: "INACTIVE",
                    text: "Ngưng hoạt động",
                  },
                ]}
                keyName="value"
                valueName="text"
                placeholder="Trạng thái"
              />
              <ISelectV1
                style={{ minWidth: 160 }}
                onChange={(key) => {
                  setLoadingTable(true);
                  setFilter({ ...filter, page: 1, type: key });
                }}
                dataOption={[
                  {
                    value: "",
                    text: "Tất cả",
                  },
                  {
                    value: "TOP_TREND",
                    text: "Xu hướng hàng đầu",
                  },
                  {
                    value: "BEST_SELLER",
                    text: "Người bán hàng",
                  },
                  {
                    value: "SPECIAL",
                    text: "Đặc biệt",
                  },
                ]}
                keyName="value"
                valueName="text"
                placeholder="Loại"
              />
            </Space>
          </Space>
        </Col>
        <Col span={24}>
          <ITable
            dataSource={dataTable}
            columns={columns}
            loading={loadingTable}
            totalCount={totalCount}
            rowKey="id"
            scroll={{ x: 1400 }}
            onChange={(obj) => {
              setLoadingTable(true);
              setFilter({
                ...filter,
                page: obj.current,
                limit: obj.pageSize,
              });
            }}
            pageSize={filter.limit}
          />
        </Col>
      </Row>
      <Modal
        title="TẠO MỚI SẢN PHẨM"
        visible={visible}
        centered={true}
        confirmLoading={loadingTable}
        onOk={async () => {
          try {
            if (
              dataAdd.product_id === "Sản phẩm" ||
              dataAdd.type === "Loại" ||
              dataAdd.priority === 0
            ) {
              return message.error("Dữ liệu không được để trống");
            }
            setLoadingTable(true);
            await APIServiceV2._postProductViral(dataAdd);
            setDataAdd({
              product_id: "Sản phẩm",
              type: "Loại",
              priority: 0,
            });
            hideModal();
            await _fetchAPIList(filter);
            message.success("Tạo sản phẩm thành công.");
          } catch (error) {
          } finally {
            setLoadingTable(false);
          }
        }}
        onCancel={hideModal}
        okText="Lưu"
        maskClosable={false}
        cancelText="Hủy"
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <p>
              <strong>Sản phẩm</strong>
            </p>
            <ISelectV1
              showSearch={true}
              style={{ width: "100%" }}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={(key) => {
                setDataAdd({ ...dataAdd, product_id: key });
              }}
              value={dataAdd.product_id}
              dataOption={listProduct}
              keyName="value"
              valueName="text"
              placeholder="Sản phẩm"
            />
          </Col>
          <Col span={24}>
            <p>
              <strong>Loại hiển thị</strong>
            </p>
            <ISelectV1
              onChange={(key) => {
                setDataAdd({ ...dataAdd, type: key });
              }}
              value={dataAdd.type}
              style={{ width: "100%" }}
              dataOption={[
                {
                  value: "TOP_TREND",
                  text: "Xu hướng hàng đầu",
                },
                {
                  value: "BEST_SELLER",
                  text: "Người bán hàng",
                },
                {
                  value: "SPECIAL",
                  text: "Đặc biệt",
                },
              ]}
              keyName="value"
              valueName="text"
              placeholder="Loại"
            />
          </Col>
          <Col span={24}>
            <p>
              <strong>Độ ưu tiên</strong>
            </p>
            <InputNumber
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              min={0}
              style={{ width: "100%" }}
              onChange={(value) => {
                setDataAdd({ ...dataAdd, priority: value });
              }}
              value={dataAdd.priority}
            />
          </Col>
        </Row>
      </Modal>
    </div>
  );
}
