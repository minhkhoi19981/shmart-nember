import {
  Badge,
  Button,
  Col,
  Descriptions,
  Drawer,
  Dropdown,
  Menu,
  message,
  Popconfirm,
  Row,
  Skeleton,
  Space,
  Tag,
  Typography,
  PageHeader,
} from "antd";
import { blue, red } from "@ant-design/colors";
import React, { useEffect, useState } from "react";
import { priceFormat } from "../../utils";
import {
  InfoCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import FormatterDay from "../../utils/FormatterDay";

import { APIService } from "../../apis";
import ITable from "../../common/Table";
import CreateWarehouses from "./CreateWarehouses";
import Title from "antd/lib/typography/Title";

const { Text } = Typography;
const formatDay = "#hhh#:#mm#:#ss# #DD#/#MM#/#YYYY#";

export default function WareHousesPage() {
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
  });
  const [idWarehouse, setIdWarehouse] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [visibleCreate, setVisibleCreate] = useState(false);
  const [dataDetail, setDataDetail] = useState({
    import_date: "2020-11-22T18:24:01.297Z",
    created_date: "2020-11-22T18:24:01.297Z",
  });

  const [visible, setVisible] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(true);

  const _handleDrawer = () => {
    setVisible(!visible);
  };

  const _handleDrawerCreate = () => {
    setVisibleCreate(!visibleCreate);
  };

  const _fetchAPIDetailWarehouse = async (id) => {
    try {
      const data = await APIService._getWarehouseDeatailItem(id);
      if (typeof data.product_type === "string") {
        data.product_type = [data.product_type];
      }
      
      setDataDetail({ ...data });
    } catch (error) {
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    if (idWarehouse !== "") {
      setIsEdit(true);
    }
  }, [idWarehouse]);

  const menu = (data) => (
    <Menu
      onClick={({ item, key }) => {
        // eslint-disable-next-line default-case
        switch (Number(key)) {
          case 1: {
            _handleDrawerCreate();
            setIdWarehouse(data.id);
            break;
          }
          // eslint-disable-next-line no-fallthrough
          case 2: {
            _handleDrawer();
            setLoadingDetail(true);
            _fetchAPIDetailWarehouse(data._id);
            break;
          }
        }
      }}
    >
      <Menu.Item key="1" icon={<EditOutlined />}>
        Chỉnh sửa
      </Menu.Item>
      <Menu.Item key="2" icon={<EyeOutlined />} loading={true}>
        Xem chi tiết
      </Menu.Item>
    </Menu>
  );

  const [dataTable, setDataTable] = useState({});
  const [loadingTable, setLoadingTable] = useState(true);
  const [totalCount, setTotalCount] = useState(1);

  const _fetchTotalCount = async () => {
    try {
      const data = await APIService._getWarehouseCount();
      setTotalCount(data.TotalItems);
    } catch (error) {}
  };

  const _deleteWareHouse = async (warehouses_id) => {
    try {
      await APIService._deleteWarehouse(warehouses_id);
      message.success("Xóa thành công");
      setLoadingTable(true);
      _fetchAPIListWarehouses(filter);
      _fetchTotalCount();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    _fetchTotalCount();
  }, []);

  useEffect(() => {
    _fetchAPIListWarehouses(filter);
  }, [filter]);

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      width: 80,
      align: "center",
      key: "stt",
    },

    {
      title: "ID Đối Tác",
      dataIndex: "title",
      key: "title",
      render: (title) => <Text>{!title ? "-" : title}</Text>,
    },
    {
      title: "Họ và Tên",
      dataIndex: "full_name",
      key: "full_name",
      render: (full_name) => <Text>{!full_name ? "-" : full_name}</Text>,
    },
    {
      title: "Tên Đối Tác",
      dataIndex: "partner_name",
      key: "partner_name",
      render: (partner_name) => (
        <Text>{!partner_name ? "-" : partner_name}</Text>
      ),
    },
    {
      title: "Địa Chỉ",
      dataIndex: "address",
      key: "address",
      render: (address) => <Text>{!address ? "-" : address}</Text>,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      render: (phone) => <Text>{!phone ? "-" : phone}</Text>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => <Text>{!email ? "-" : email}</Text>,
    },
    // {
    //   title: "Nội Dung Kèm Theo",
    //   dataIndex: "message_leave",
    //   key: "message_leave",
    //   render: (message_leave) => (
    //     <Text>{message_leave === null ? "-" : message_leave}</Text>
    //   ),
    // },
    {
      title: "Hình thức xuất",
      dataIndex: "import_by",
      key: "import_by",
      render: (import_by) => (
        <Text>{import_by === null ? "-" : import_by}</Text>
      ),
    },
    {
      title: "Ngân Sách Đối Ứng",
      dataIndex: "gia_tri_von",
      key: "gia_tri_von",
      render: (gia_tri_von) => (
        <Typography.Text>{priceFormat(gia_tri_von)}</Typography.Text>
      ),
    },
    // {
    //   title: "Người tạo",
    //   dataIndex: "created_by",
    //   key: "created_by",
    // },

    // {
    //   title: "Ngày tạo",
    //   dataIndex: "created_date",
    //   key: "created_date",
    //   render: (created_date) => (
    //     <Typography.Text>
    //       {FormatterDay.dateFormatWithString(
    //         new Date(created_date).getTime(),
    //         formatDay
    //       )}
    //     </Typography.Text>
    //   ),
    // },

    {
      title: "Trạng thái",

      width: 150,
      render: (obj) =>
        obj.is_activated ? (
          <Tag color="success" style={{ borderRadius: 12 }}>
            <Space size={0}>
              <Badge status="success" />
              Hoạt động
            </Space>
          </Tag>
        ) : (
          <Tag color="orange" style={{ borderRadius: 12 }}>
            Không hoạt động
          </Tag>
        ),
    },
    {
      fixed: "right",
      width: 80,
      align: "center",
      render: (obj) => (
        <Space>
          <Dropdown overlay={menu(obj)} placement="bottomCenter">
            <InfoCircleOutlined style={{ color: blue[5] }} />
          </Dropdown>
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => {
              _deleteWareHouse(obj.id);
            }}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined style={{ color: red[4] }} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const _fetchAPIListWarehouses = async (filterTable) => {
    try {
      const data = await APIService._getListWarehouses(filterTable);
      data._Array.map((item, index) => {
        item.stt = (filter.page - 1) * filter.limit + index + 1;
        item.import_by = item.import_by === null ? "Import" : item.import_by;
        item.xuat_hang = "Nha Trang";
        item.gia_tri_von = 12500000;
      });

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
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Row align="middle">
            <Col span={12}>
              <Title level={4}>ĐỐI TÁC LIÊN KẾT</Title>
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
            scroll={{ x: 0 }}
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
          title="CHI TIẾT"
          extra={[
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => {
                _handleDrawerCreate();
                _handleDrawer();
                setIdWarehouse(dataDetail.id);
              }}
            >
              Chỉnh sửa
            </Button>,
          ]}
        >
          <Skeleton active paragraph={{ rows: 8 }} loading={loadingDetail}>
            <Descriptions column={1}>
              <Descriptions.Item label="ID Đối tác">
                {dataDetail.title}
              </Descriptions.Item>
              <Descriptions.Item label="Họ và tên">
                {!dataDetail.full_name ? "-" : dataDetail.full_name}
              </Descriptions.Item>
              <Descriptions.Item label="Tên đối tác">
                {!dataDetail.partner_name ? "-" : dataDetail.partner_name}
              </Descriptions.Item>
              <Descriptions.Item label="Loại sản phẩm">
                {!dataDetail.product_type
                  ? "-"
                  : dataDetail.product_type.map((item) => (
                      <>
                        <span>{item}</span>
                        <br />
                      </>
                    ))}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {dataDetail.is_activated ? (
                  <Tag color="success" style={{ borderRadius: 12 }}>
                    <Space size={0}>
                      <Badge status="success" />
                      Hoạt động
                    </Space>
                  </Tag>
                ) : (
                  <Tag color="orange" style={{ borderRadius: 12 }}>
                    Không hoạt động
                  </Tag>
                )}
              </Descriptions.Item>

              <Descriptions.Item label="Địa chỉ">
                {dataDetail.description}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {!dataDetail.phone ? "-" : dataDetail.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {!dataDetail.email ? "-" : dataDetail.email}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {FormatterDay.dateFormatWithString(
                  new Date(dataDetail.created_date).getTime(),
                  formatDay
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày nhập khẩu">
                {FormatterDay.dateFormatWithString(
                  new Date(dataDetail.import_date).getTime(),
                  formatDay
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Hình thức nhập">
                {dataDetail.import_by === null ? "-" : dataDetail.import_by}
              </Descriptions.Item>
              <Descriptions.Item label="Hình thức xuất">
                {dataDetail.verify_by === null ? "-" : dataDetail.verify_by}
              </Descriptions.Item>
              <Descriptions.Item label="Người tạo">
                {dataDetail.created_by}
              </Descriptions.Item>

              <Descriptions.Item label="Lời nhắn">
                {dataDetail.message_leave}
              </Descriptions.Item>
            </Descriptions>
          </Skeleton>
        </PageHeader>
      </Drawer>

      <CreateWarehouses
        edit={isEdit}
        visibleCreate={visibleCreate}
        idWarehouse={idWarehouse}
        onCreateCallback={async () => {
          _handleDrawerCreate();
          setLoadingTable(true);
          setIsEdit(false);
          setIdWarehouse("");
          await _fetchAPIListWarehouses(filter);
        }}
        onCloseCallback={() => {
          setIsEdit(false);
          setIdWarehouse("");
          _handleDrawerCreate();
        }}
      />
    </div>
  );
}
