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
  UserOutlined,
} from "@ant-design/icons";
import { APIService, UserService } from "../../apis";
import ITable from "../../common/Table";
import Title from "antd/lib/typography/Title";
import FormatterDay from "../../utils/FormatterDay";
import axios from "axios";
import CreateCate from "./CreateCate";
const formatDay = "#hhh#:#mm#:#ss# #DD#/#MM#/#YYYY#";

export default function ListCate() {
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
  });
  const [isEdit, setIsEdit] = useState(false);

  const [loadingDetail, setLoadingDetail] = useState(true);
  const [dataDetail, setDataDetail] = useState({
    created_date: "2020-11-22T18:24:01.297Z",
  });
  const [visibleCreate, setVisibleCreate] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [dataEdit, setDataEdit] = useState({});

  const [loadingTable, setLoadingTable] = useState(true);
  const [totalCount, setTotalCount] = useState(1);
  const _handleDrawerCreate = () => {
    setVisibleCreate(!visibleCreate);
  };
  const [visible, setVisible] = useState(false);

  const _fetchAPIList = async () => {
    try {
      let currentRoot = [];
      await axios({
        method: "get",
        url: `${process.env.DB_HOST_v2}/categories-kv`,
        headers: {
          Authorization: "Bearer " + UserService._getToken(),
        },
      })
        .then(function (response) {
          return (currentRoot = [...response.data._Array]);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
      currentRoot.map((item, index) => (item.stt = index + 1));
      setDataTable([...currentRoot]);
      setTotalCount(currentRoot.length);
      setLoadingTable(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingTable(false);
    }
  };

  const _fetchAPIDetail = async (id) => {
    try {
      const data = await APIService._getDetailCate(id);
      setDataDetail({ ...data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    _fetchAPIList(filter);
  }, [filter]);

  // const menu = (data) => (
  //   <Menu
  //     onClick={({ item, key }) => {
  //       // eslint-disable-next-line default-case
  //       switch (Number(key)) {
  //         case 1: {
  //           setIsEdit(true);
  //           _handleDrawerCreate();
  //           setDataEdit({ ...data });
  //           break;
  //         }
  //         case 2: {
  //           _handleDrawer();
  //           setLoadingDetail(true);
  //           _fetchAPIDetail(data._id);
  //         }
  //       }
  //     }}
  //   >
  //     <Menu.Item
  //       key="1"
  //       icon={<EditOutlined />}
  //       disabled={data.is_delivered || data.is_canceled}
  //     >
  //       Chỉnh sửa
  //     </Menu.Item>
  //     <Menu.Item key="2" icon={<EyeOutlined />}>
  //       Xem chi tiết
  //     </Menu.Item>
  //   </Menu>
  // );

  const _handleDrawer = () => {
    setVisible(!visible);
  };

  const _deleteCateTable = async (code_id) => {
    try {
      await APIService._deleteCate(code_id);
      message.success("Xóa thành công");
      setLoadingTable(true);
      _fetchAPIList(filter);
    } catch (error) {
      console.log(error);
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
      title: "Tên nhóm",
      dataIndex: "category_name",
      key: "category_name",
    },
    {
      title: "Ngày tạo",
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
      title: "Trạng thái",
      render: (obj) =>
        obj.activated ? (
          <Tag color="success" style={{ borderRadius: 12 }}>
            <Space size={0}>
              <Badge status="success" />
              Hoạt động
            </Space>
          </Tag>
        ) : (
          <Tag color="red" style={{ borderRadius: 12 }}>
            Ngưng hoạt động
          </Tag>
        ),
    },

    // {
    //   fixed: "right",
    //   width: 80,
    //   align: "center",
    //   render: (obj) => (
    //     <Space>
    //       <Dropdown overlay={menu(obj)} placement="bottomCenter">
    //         <InfoCircleOutlined style={{ color: blue[5] }} />
    //       </Dropdown>
    //       <Popconfirm
    //         title="Are you sure to delete?"
    //         onConfirm={() => {
    //           _deleteCateTable(obj.id);
    //         }}
    //         okText="Yes"
    //         cancelText="No"
    //       >
    //         <DeleteOutlined style={{ color: red[4] }} />
    //       </Popconfirm>
    //     </Space>
    //   ),
    // },
  ];

  return (
    <div>
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Row align="middle">
            <Col span={24}>
              <Title level={4}>DANH SÁCH DANH MỤC </Title>
            </Col>
            {/* <Col span={12} style={{ textAlign: "right" }}>
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={() => _handleDrawerCreate()}
              >
                Tạo mới
              </Button>
            </Col> */}
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
            pagination={false}
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
                label="Tên nhóm sản phẩm"
                labelStyle={{ fontWeight: 600 }}
              >
                {dataDetail.category_name}
              </Descriptions.Item>

              <Descriptions.Item
                label="Trạng thái"
                labelStyle={{ fontWeight: 600 }}
              >
                {dataDetail.is_activated ? (
                  <Tag color="success" style={{ borderRadius: 12 }}>
                    <Space size={0}>
                      <Badge status="success" />
                      Hoạt động
                    </Space>
                  </Tag>
                ) : (
                  <Tag color="orange" style={{ borderRadius: 12 }}>
                    Ngưng hoạt động
                  </Tag>
                )}
              </Descriptions.Item>

              <Descriptions.Item
                label="Ngày tạo"
                labelStyle={{ fontWeight: 600 }}
              >
                {FormatterDay.dateFormatWithString(
                  new Date(dataDetail.created_date).getTime(),
                  formatDay
                )}
              </Descriptions.Item>

              <Descriptions.Item
                label="Mô tả"
                labelStyle={{ fontWeight: 600 }}
              ></Descriptions.Item>
              <pre>{dataDetail.category_description}</pre>
            </Descriptions>
          </Skeleton>
        </PageHeader>
      </Drawer>

      <CreateCate
        visibleCreate={visibleCreate}
        edit={isEdit}
        dataEdit={dataEdit}
        onCreateCallback={async () => {
          _handleDrawerCreate();
          setLoadingTable(true);
          setIsEdit(false);

          await _fetchAPIList(filter);
        }}
        onCloseCallback={() => {
          setIsEdit(false);
          setDataDetail({
            created_date: "2020-11-22T18:24:01.297Z",
          });
          _handleDrawerCreate();
        }}
      />
    </div>
  );
}
