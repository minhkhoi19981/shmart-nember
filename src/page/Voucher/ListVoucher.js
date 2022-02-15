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
import {
  InfoCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
} from "@ant-design/icons";

// import FormatterDay from "../../utils/FormatterDay";
// import EditAccount from "./EditAccount";

import { APIService } from "../../apis";
import ITable from "../../common/Table";
import Title from "antd/lib/typography/Title";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { _reducerFetchListVoucher } from "../../reducers/Voucher/reducers";
import { priceFormat } from "../../utils";
import CreateVoucher from "./CreateVoucher";
import { colors } from "../../utils/color";
import Avatar from "antd/lib/avatar/avatar";

// const { Link } = Typography;
// const formatDay = "#hhh#:#mm#:#ss# #DD#/#MM#/#YYYY#";

export default function ListVoucher() {
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
  });
  const dispatch = useDispatch();

  const [dataDetail, setDataDetail] = useState({
    created_date: "2020-11-22T18:24:01.297Z",
  });
  const [loadingDetail, setLoadingDetail] = useState(true);

  const [isEdit, setIsEdit] = useState(false);
  const [dataEdit, setDataEdit] = useState({});
  const [visibleCreate, setVisibleCreate] = useState(false);
  const [visible, setVisible] = useState(false);

  const menu = (data) => (
    <Menu
      onClick={({ item, key }) => {
        // eslint-disable-next-line default-case
        switch (Number(key)) {
          case 1: {
            setIsEdit(true);
            _handleDrawerCreate();
            setDataEdit({ ...data });
            break;
          }
          case 2: {
            _handleDrawer();
            setLoadingDetail(true);
            _fetchAPIDetail(data._id);
          }
        }
      }}
    >
      <Menu.Item
        key="1"
        icon={<EditOutlined />}
        disabled={data.is_delivered || data.is_canceled}
      >
        Chỉnh sửa
      </Menu.Item>
      <Menu.Item key="2" icon={<EyeOutlined />}>
        Xem chi tiết
      </Menu.Item>
    </Menu>
  );

  const [dataTable, setDataTable] = useState([]);
  const [loadingTable, setLoadingTable] = useState(true);
  const [totalCount, setTotalCount] = useState(1);

  const _handleDrawerCreate = () => {
    setVisibleCreate(!visibleCreate);
  };

  const _fetchAPIDetail = async (idVoucher) => {
    try {
      const data = await APIService._getDetailVoucher(idVoucher);
      setDataDetail({ ...data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingDetail(false);
    }
  };

  const _handleDrawer = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    _fetchAPIListVoucher();
  }, []);

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      width: 80,
      align: "center",
      key: "stt",
    },
    {
      title: "Chiến Dịch",
      dataIndex: "voucher_title",
      key: "voucher_title",
      ellipsis: true,
      align: "center",
    },

    {
      title: "Giá Trị Áp Dụng",
      dataIndex: "cost_discount",
      key: "cost_discount",
      align: "center",
      render: (cost_discount) => (
        <Typography.Text>{priceFormat(cost_discount)}</Typography.Text>
      ),
    },

    // {
    //   title: "Ngày tạo code",
    //   dataIndex: "created_date",
    //   ellipsis: true,

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
      title: "Giới Hạn",
      dataIndex: "maximum_activated",
      key: "maximum_activated",
      align: "center",
    },
    {
      title: "Đã dùng",
      dataIndex: "times_activated",
      key: "times_activated",
      align: "center",
    },
    // {
    //   title: "Giá trị chuyển Đổi (Cam)",
    //   dataIndex: "price_voucher",
    //   key: "price_voucher",
    //   ellipsis: true,
    //   align: "center",
    // },
    {
      title: "Ưu đãi đặc biệt",
      dataIndex: "special_code",
      key: "special_code",
      align: "center",

      render: (special_code) => {
        return special_code ? (
          <CheckOutlined style={{ color: "green" }} />
        ) : (
          <CloseOutlined />
        );
      },
    },

    {
      title: "Trạng thái",
      align: "center",
      render: (obj) =>
        obj.activated ? (
          <Tag color="success" style={{ borderRadius: 12 }}>
            <Space size={0}>
              <Badge status="success" />
              Kích Hoạt
            </Space>
          </Tag>
        ) : (
          <Tag color="red" style={{ borderRadius: 12 }}>
            Chưa Kích Hoạt
          </Tag>
        ),
    },

    // {
    //   title: "Hiệu lực",

    //   width: 120,
    //   render: (obj) =>
    //     obj.is_exprired ? (
    //       <Tag color="success" style={{ borderRadius: 12 }}>
    //         <Space size={0}>
    //           <Badge status="success" />
    //           Còn hiệu lực
    //         </Space>
    //       </Tag>
    //     ) : (
    //       <Tag color="red" style={{ borderRadius: 12 }}>
    //         Hết hiệu lực
    //       </Tag>
    //     ),
    // },

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
              _deleteVoucherTable(obj.id);
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

  const _fetchAPIListVoucher = async () => {
    try {
      const listVoucher = await dispatch(_reducerFetchListVoucher());
      let currentRoot = unwrapResult(listVoucher);
      currentRoot._Array.map((item, index) => (item.stt = index + 1));
      setDataTable([...currentRoot._Array]);
      setTotalCount(currentRoot.TotalCount);
      setLoadingTable(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingTable(false);
    }
  };

  const _deleteVoucherTable = async (code_id) => {
    try {
      await APIService._deleteVoucher(code_id);
      message.success("Xóa thành công");
      setLoadingTable(true);
      _fetchAPIListVoucher(filter);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Row align="middle">
            <Col span={12}>
              <Title level={4}>DANH SÁCH MÃ KHUYẾN MÃI</Title>
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
            Tìm thấy {totalCount} tài liệu yêu cầu
          </Typography.Text>
        </Col>
        <Col span={24}>
          <ITable
            dataSource={dataTable}
            columns={columns}
            loading={loadingTable}
            totalCount={totalCount}
            rowKey="id"
            scroll={{ x: 0 }}
            onChange={(pagination) => {
              //   setLoadingTable(true);
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
                setIsEdit(true);
                _handleDrawerCreate();
                setVisible(false);
                setDataEdit({ ...dataDetail });
              }}
            >
              Chỉnh sửa
            </Button>,
          ]}
        >
          <Skeleton active paragraph={{ rows: 8 }} loading={loadingDetail}>
            <Descriptions column={1}>
              <Descriptions.Item
                className="flex justify-center"
                style={{ margin: "24px 0px" }}
              >
                <Space direction="vertical" size={24}>
                  <Avatar size={128} src={dataDetail.img_link} />
                </Space>
              </Descriptions.Item>
              <Descriptions.Item
                label="Tên nhận diện Voucher"
                className="flex justify-center"
              >
                {dataDetail.voucher_title}
              </Descriptions.Item>
              <Descriptions.Item
                label="Ưu đãi đặc biệt"
                className="flex justify-center"
              >
                {dataDetail.special_code ? "Có" : "Không"}
              </Descriptions.Item>
              <Descriptions.Item
                label="Mã Voucher"
                className="flex justify-center"
              >
                {dataDetail.voucher_code_manual}
              </Descriptions.Item>
              <Descriptions.Item
                label="Gía chuyển đổi (point)"
                className="flex justify-center"
              >
                {priceFormat(dataDetail.price_voucher)}
              </Descriptions.Item>
              <Descriptions.Item
                label="Giảm giá"
                className="flex justify-center"
              >
                {priceFormat(dataDetail.cost_discount)}
              </Descriptions.Item>
              <Descriptions.Item
                label="Trạng thái"
                className="flex justify-center"
              >
                {dataDetail.activated ? "Kích hoạt" : "Chưa kích hoạt"}
              </Descriptions.Item>
              <Descriptions.Item
                label="Hiệu lực mã"
                className="flex justify-center"
              >
                {dataDetail.is_exprired ? "Còn hiệu lực" : "Hết hiệu lực"}
              </Descriptions.Item>
              <Descriptions.Item
                label="Kích hoạt tối đa"
                className="flex justify-center"
              >
                {dataDetail.maximum_activated}
              </Descriptions.Item>
              <Descriptions.Item
                label="Ghi chú cho Voucher"
                className="flex justify-center"
              >
                {dataDetail.voucher_desc}
              </Descriptions.Item>
              <Descriptions.Item
                label="Điều kiện sử dụng"
                className="flex justify-center"
              >
                {dataDetail.voucher_policy}
              </Descriptions.Item>
            </Descriptions>
          </Skeleton>
        </PageHeader>
      </Drawer>

      <CreateVoucher
        visibleCreate={visibleCreate}
        edit={isEdit}
        dataEdit={dataEdit}
        onCreateCallback={async () => {
          _handleDrawerCreate();
          setLoadingTable(true);
          setIsEdit(false);

          await _fetchAPIListVoucher(filter);
        }}
        onCloseCallback={() => {
          setIsEdit(false);
          setDataDetail({});
          _handleDrawerCreate();
        }}
      />
    </div>
  );
}
