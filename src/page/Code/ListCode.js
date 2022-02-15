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
} from "antd";
import { blue, gold, red } from "@ant-design/colors";
import React, { useEffect, useState } from "react";
import {
  InfoCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
  EditOutlined,
  UserOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import FormatterDay from "../../utils/FormatterDay";
// import EditAccount from "./EditAccount";

import { APIService } from "../../apis";
import ITable from "../../common/Table";
import { useHistory } from "react-router-dom";
import Text from "antd/lib/typography/Text";
import Avatar from "antd/lib/avatar/avatar";
import Title from "antd/lib/typography/Title";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { _reducerFetchListCode } from "../../reducers/Code/reducers";
import { priceFormat } from "../../utils";
import CreateCode from "./CreateCode";

const { Link } = Typography;
const formatDay = "#hhh#:#mm#:#ss# #DD#/#MM#/#YYYY#";

export default function ListCode() {
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
  });
  const dispatch = useDispatch();

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
    </Menu>
  );

  const [dataTable, setDataTable] = useState([]);
  const [loadingTable, setLoadingTable] = useState(true);
  const [totalCount, setTotalCount] = useState(1);

  const _handleDrawerCreate = () => {
    setVisibleCreate(!visibleCreate);
  };

  const _handleDrawer = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    _fetchAPIListCode();
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
      dataIndex: "code_title",
      key: "code_title",
      ellipsis: true,
      align: "center",
    },
    // {
    //   title: "Loại code",
    //   dataIndex: "code_desc",
    //   key: "code_desc",
    //   ellipsis: true,
    // },
    {
      title: "Giá Giảm (VNĐ)",
      dataIndex: "cost_discount",
      key: "cost_discount",
      align: "center",
      render: (cost_discount) => (
        <Typography.Text>{priceFormat(cost_discount)}</Typography.Text>
      ),
    },

    // {
    //   title: "Người tạo",
    //   dataIndex: "created_by",
    //   key: "created_by",
    //   ellipsis: true,
    // },

    {
      title: "CODE",
      dataIndex: "content",
      key: "content",
      ellipsis: true,
      align: "center"
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

    {
      title: "Trạng thái",
      align: "center",
      render: (obj) =>
        obj.activated ? (
          <Tag color="success" style={{ borderRadius: 12 }}>
            <Space size={0}>
              <Badge status="success" />
              Đã Kích Hoạt
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
              _deleteCodeTable(obj.id);
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

  const _fetchAPIListCode = async () => {
    try {
      const listCode = await dispatch(_reducerFetchListCode());
      let currentRoot = unwrapResult(listCode);
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

  const _deleteCodeTable = async (code_id) => {
    try {
      await APIService._deleteCode(code_id);
      message.success("Xóa thành công");
      setLoadingTable(true);
      _fetchAPIListCode(filter);
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

      <CreateCode
        visibleCreate={visibleCreate}
        edit={isEdit}
        dataEdit={dataEdit}
        onCreateCallback={async () => {
          _handleDrawerCreate();
          setLoadingTable(true);
          setIsEdit(false);

          await _fetchAPIListCode(filter);
        }}
        onCloseCallback={() => {
          setIsEdit(false);

          _handleDrawerCreate();
        }}
      />
    </div>
  );
}
