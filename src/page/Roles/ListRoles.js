import { blue, red } from "@ant-design/colors";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { unwrapResult } from "@reduxjs/toolkit";
import {
  Badge,
  Button,
  Col,
  Dropdown,
  Menu,
  Popconfirm,
  Row,
  Space,
  Tag,
  Drawer,
  Skeleton,
  Descriptions,
  PageHeader,
} from "antd";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ITable } from "../../common";
import {
  _reducerFetchDeleteRoles,
  _reducerFetchDetailRoles,
  _reducerFetchListRoles,
} from "../../reducers/Role/reducers";
import CreateRoles from "./CreateRoles";

export default function ListRoles() {
  const [loadingTable, setLoadingTable] = useState(true);
  const [dataTable, setDataTable] = useState({});
  const [visible, setVisible] = useState(false);
  const [dataDetail, setDataDetail] = useState({
    query_permissions: [],
    modules_authorized: [],
  });
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [visibleCreate, setVisibleCreate] = useState(false);
  const [idRoles, setIdRoles] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (idRoles !== "") {
      setIsEdit(true);
    }
  }, [idRoles]);

  const _fetchAPIListRoles = async () => {
    try {
      const data = await dispatch(_reducerFetchListRoles());
      let currentRoles = unwrapResult(data);
      setDataTable({ ...currentRoles });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingTable(false);
    }
  };

  const _fetchRemoveItemRoles = async (id_role) => {
    try {
      const data = await dispatch(_reducerFetchDeleteRoles(id_role));
      const currentRoles = unwrapResult(data);
      console.log(currentRoles);
      setLoadingTable(true);
      await _fetchAPIListRoles();
    } catch (error) {
      console.log(error);
    }
  };

  const _fetchDetailRoles = async (id_role) => {
    try {
      const data = await dispatch(_reducerFetchDetailRoles(id_role));
      const currentRoles = unwrapResult(data);
      setDataDetail({ ...currentRoles });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingDetail(false);
    }
  };
  useEffect(() => {
    _fetchAPIListRoles();
  }, []);

  const _handleDrawer = () => {
    setVisible(!visible);
  };

  const _handleDrawerCreate = () => {
    setVisibleCreate(!visibleCreate);
  };

  const menu = (data) => (
    <Menu
      onClick={({ item, key }) => {
        // eslint-disable-next-line default-case
        switch (Number(key)) {
          case 1: {
            _handleDrawerCreate();
            setIdRoles(data._id);
            break;
          }
          case 2: {
            _handleDrawer();
            setLoadingDetail(true);
            _fetchDetailRoles(data._id);
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

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      width: 80,
      align: "center",
      key: "stt",
    },
    {
      title: "Nhóm",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Quyền truy cập",
      render: (obj) => (
        <Text>
          {obj.query_permissions.map((item, index) => (
            <Text>
              {item}
              {index === obj.query_permissions.length - 1 ? "" : " | "}{" "}
            </Text>
          ))}
        </Text>
      ),
    },
    {
      title: "Loại Công Việc",
      render: (obj) => (
        <Text>
          {obj.modules_authorized.map((item, index) => (
            <Text>
              {item}
              {index === obj.modules_authorized.length - 1 ? "" : " | "}{" "}
            </Text>
          ))}
        </Text>
      ),
    },

    // {
    //   title: "Người tạo",
    //   dataIndex: "created_by",
    //   key: "created_by",
    // },

    {
      title: "Trạng thái",

      width: 150,
      render: (obj) =>
        obj.is_verified ? (
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
              _fetchRemoveItemRoles(obj._id);
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

  return (
    <div>
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Row align="middle">
            <Col span={12}>
              <Title level={4}>DANH SÁCH QUYỀN</Title>
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
          <Text>Tìm thấy {dataTable.TotalCount} tài liệu yêu cầu</Text>
        </Col>
        <Col span={24}>
          <ITable
            dataSource={dataTable._Array}
            columns={columns}
            loading={loadingTable}
            totalCount={dataTable.TotalCount}
            rowKey="id"
            scroll={{ x: 0 }}
            pageSize={dataTable.TotalCount}
            pagination={false}
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
                setIdRoles(dataDetail.id);
              }}
            >
              Chỉnh sửa
            </Button>,
          ]}
        >
          <Skeleton active paragraph={{ rows: 8 }} loading={loadingDetail}>
            <Descriptions column={1}>
              <Descriptions.Item label="Nhóm">
                {dataDetail.title}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {dataDetail.is_verified ? (
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
              <Descriptions.Item label="Quyền truy cập">
                <Space>
                  {dataDetail.query_permissions.map((item) => (
                    <Space size={0}>
                      <Badge status="processing" />
                      <Text>{item}</Text>
                    </Space>
                  ))}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Loại ủy quyền">
                <Space>
                  {dataDetail.modules_authorized.map((item) => (
                    <Space size={0}>
                      <Badge status="processing" />
                      <Text>{item}</Text>
                    </Space>
                  ))}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Người tạo">
                {dataDetail.created_by}
              </Descriptions.Item>
              <Descriptions.Item label="Miêu tả">
                {dataDetail.description}
              </Descriptions.Item>
            </Descriptions>
          </Skeleton>
        </PageHeader>
      </Drawer>
      <CreateRoles
        visibleCreate={visibleCreate}
        edit={isEdit}
        idRoles={idRoles}
        onCloseCallback={() => {
          setIdRoles("");
          setIsEdit(false);
          _handleDrawerCreate();
        }}
        onCreateCallback={async () => {
          _handleDrawerCreate();
          setIdRoles("");
          setLoadingTable(true);
          setIsEdit(false);
          await _fetchAPIListRoles();
        }}
      />
    </div>
  );
}
