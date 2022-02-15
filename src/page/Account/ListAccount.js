import {
  Badge,
  Col,
  Descriptions,
  Row,
  Skeleton,
  Space,
  Tag,
  Typography,
  PageHeader,
  Divider,
  Tooltip
} from "antd";
import { gold, grey } from "@ant-design/colors";
import React, { useEffect, useState } from "react";
import {
  UserOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined, LogoutOutlined
} from "@ant-design/icons";
import FormatterDay from "../../utils/FormatterDay";
import { ISelectV1 } from "../../common";

import { APIService, UserService } from "../../apis";
import ITable from "../../common/Table";
import Text from "antd/lib/typography/Text";
import Avatar from "antd/lib/avatar/avatar";
import Title from "antd/lib/typography/Title";
import { priceFormat } from "../../utils";
import { useHistory } from 'react-router-dom';

const { Link } = Typography;
const formatDay = "#hhh#:#mm#:#ss# #DD#/#MM#/#YYYY#";

const style = {
  background: "#2db7f5",
  padding: "20px",
  margin: "auto",
  textAlign: "center",
};

const style2 = {
  background: "#87d068",
  padding: "20px",
  margin: "auto",
  textAlign: "center",
};

export default function ListAccount() {
  const [levelFilter, setLevelFilter] = useState({
    user_id: UserService._getID(),
    level: 1,
    page: 1,
    limit: 10,
  });

  const [dataDetail, setDataDetail] = useState({
    dob: "2020-11-22T18:24:01.297Z",
    created_date: "2020-11-22T18:24:01.297Z",
    permissions: [],
    bio: [{}],
    your_wallet: [{}],
    cashback_wallet: [{}],
  });

  const [dataCashback, setDataCashback] = useState({
    _Array: [{
      created_date: "2021-07-05T07:40:09.119Z"
    }]
  });
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [loadingCashback, setLoadingCashback] = useState(true);
  const [totalListCashback, setTotalListCashback] = useState(10);
  const navigate = useHistory()


  const columnsCashback = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
    },
    {
      title: "Họ Tên",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Mã code",
      dataIndex: "your_referral_code",
      key: "your_referral_code",
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
      title: "Ví cashback",
      dataIndex: "cashback_wallet",
      key: "cashback_wallet",
      render: (cashback_wallet) =>
        cashback_wallet === -1 ? (
          "-"
        ) : (
          <span>{priceFormat(cashback_wallet)} VNĐ</span>
        ),
    },
  ];

  const _fetchAPIDetail = async (account_id) => {
    try {
      const data = await APIService._getAccountDeatailItem(account_id);
      setDataDetail({ ...data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingDetail(false);
    }
  };

  const _fetchAPIListCashback = async (levelFilter) => {
    try {
      const dataCashback = await APIService._getListLevelUser(levelFilter);
      dataCashback._Array.map((item, index) => {
        item.stt = (levelFilter.page - 1) * levelFilter.limit + index + 1;

      });
      setDataCashback({ ...dataCashback });
      setTotalListCashback(dataCashback.TotalCount);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingCashback(false);
    }
  };


  useEffect(() => {
    _fetchAPIDetail(UserService._getID())
  }, [])

  useEffect(() => {
    if (levelFilter.user_id !== -1) {
      _fetchAPIListCashback(levelFilter);
    }
  }, [levelFilter]);

  return (
    <div>
      <PageHeader
      >
        <Skeleton active paragraph={{ rows: 8 }} loading={loadingDetail}>
          <div style={{ textAlign: 'center' }}>
            <Avatar
              // src={images.logoLogin}
              src="https://register.shmart.vn/imgs/SHMart.8006b2aa70f319c738ae45c0e00b3764.png"
              alt="Neature"
              shape="square"
              style={{
                height: 160,
                width: 220
              }}
            />
          </div>
          <div style={{ textAlign: 'center' }}>
            <Avatar size={128} icon={<UserOutlined />} />
          </div>
          <Descriptions
            column={1}
            style={{
              margin: "24px 0px",
            }}
          >
            <Descriptions.Item className="flex justify-center">
              <Space direction="vertical" size={24} >
                <Space>
                  <Link
                    href={
                      dataDetail.bio ? "" : dataDetail.bio[0].twitter_link
                    }
                    target="_blank"
                  >
                    <Tag color="#55acee" className="cursor">
                      <TwitterOutlined />
                    </Tag>
                  </Link>
                  <Link
                    href={
                      dataDetail.bio ? "" : dataDetail.bio[0].facebook_link
                    }
                    target="_blank"
                  >
                    <Tag color="#3b5999" className="cursor">
                      <FacebookOutlined />
                    </Tag>
                  </Link>
                  <Link
                    href={
                      dataDetail.bio ? "" : dataDetail.bio[0].instagram_link
                    }
                    target="_blank"
                  >
                    <Tag color={gold[4]} className="cursor">
                      <InstagramOutlined />
                    </Tag>
                  </Link>
                  <Tooltip title="Đăng xuất">
                    <Tag color={grey[4]} icon={<LogoutOutlined />} className="cursor" onClick={() => {
                      UserService._setToken("")
                      navigate.replace("/login")
                    }}>
                      Đăng xuất
                    </Tag>
                  </Tooltip>

                </Space>
                <div style={{ textAlign: 'center' }}>
                  {dataDetail.activated ? (
                    <Tag color="success" style={{ borderRadius: 12 }}>
                      <Space size={0}>
                        <Badge status="success" />
                        Đã Kích Hoạt
                      </Space>
                    </Tag>
                  ) : (
                    <Tag color="orange" style={{ borderRadius: 12 }}>
                      Đang Khóa
                    </Tag>
                  )}
                </div>
              </Space>
            </Descriptions.Item>
          </Descriptions>

          <Divider style={{ margin: "5px 0" }} />
          <Title level={4} color="#f50" className="flex justify-center">
            THÔNG TIN TÀI KHOẢN
          </Title>

          <Row>
            <Col md={12} xs={24}>
              <Descriptions column={0}>
                <Descriptions.Item style={style}>
                  <Space direction="horizontal">
                    <label style={{ color: "white" }}> VÍ CHÍNH: </label>
                    <span
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        margin: "0 8px",
                      }}
                    >
                      <span>
                        {priceFormat(dataDetail.your_wallet[0].amount) +
                          " VNĐ"}
                      </span>
                    </span>
                  </Space>
                </Descriptions.Item>
              </Descriptions>
            </Col>
            <Col md={12} xs={24}>
              <Descriptions column={0}>
                <Descriptions.Item style={style2} >
                  <Space direction="horizontal">

                    <label style={{ color: "white" }}> CASHBACK: </label>
                    <span
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        margin: "0 8px",
                      }}
                    >
                      <span>
                        {priceFormat(dataDetail.cashback_wallet[0].amount) +
                          " VNĐ"}
                      </span>
                    </span>
                  </Space>
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>


          <Divider style={{ margin: "5px 0" }} />
          <Title level={4} className="flex justify-center">
            THÔNG TIN CÁ NHÂN
          </Title>
          <Descriptions column={1}>
            <Descriptions.Item label="Họ tên" className="flex">
              {dataDetail.last_name}
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại" className="flex  ">
              {dataDetail.primary_phone_number}
            </Descriptions.Item>
            <Descriptions.Item label="Email" className="flex  ">
              {dataDetail.email}
            </Descriptions.Item>

            <Descriptions.Item label="Địa chỉ" className="flex  ">
              {dataDetail.primary_address}
            </Descriptions.Item>
          </Descriptions>

          <Descriptions column={2}>
            <Descriptions.Item label="Điểm tích luỹ" className="flex  ">
              {dataDetail.bio ? "0" : dataDetail.bio[0].wallet}
            </Descriptions.Item>

            <Descriptions.Item label="Quyền truy cập" className="flex">
              <Space direction="vertical" size={100}>
                <Space>
                  {dataDetail.permissions.map((item) => (
                    <Tag color="success">
                      <Text>{item}</Text>
                    </Tag>
                  ))}
                </Space>
              </Space>
            </Descriptions.Item>

            <Descriptions.Item label="Mã liên Kết" className="flex">
              <Space>
                <Tag color="orange" style={{ padding: "15px ​50p" }}>
                  <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                    {dataDetail.your_referral_code}
                  </Text>
                </Tag>
              </Space>
            </Descriptions.Item>
          </Descriptions>

          <Divider style={{ margin: "8px 0" }} />

          <Title level={4} className="flex justify-center">
            DANH SÁCH LIÊN KẾT
          </Title>

          {loadingCashback ? (
            <Skeleton active />
          ) : (
            <>
              <ISelectV1
                style={{ minWidth: 160, marginBottom: 12 }}
                dataOption={[
                  {
                    value: 1,
                    text: "Tầng 1",
                  },
                  {
                    value: 2,
                    text: "Tầng 2",
                  },
                  {
                    value: 3,
                    text: "Tầng 3",
                  },
                  {
                    value: 4,
                    text: "Tầng 4",
                  },
                  {
                    value: 5,
                    text: "Tầng 5",
                  },
                  {
                    value: 6,
                    text: "Tầng 6",
                  },
                  {
                    value: 7,
                    text: "Tầng 7",
                  },
                ]}
                keyName="value"
                valueName="text"
                onChange={(key) => {
                  setLoadingCashback(true);
                  setLevelFilter({
                    ...levelFilter,
                    level: key,
                  });
                }}
                defaultValue={levelFilter.level}
              />

              <ITable
                dataSource={dataCashback?._Array}
                columns={columnsCashback}
                loading={loadingCashback}
                totalCount={totalListCashback}
                rowKey="id"
                onChange={(pagination) => {
                  setLoadingCashback(true);
                  setLevelFilter({
                    ...levelFilter,
                    page: pagination.current,
                    limit: pagination.pageSize,
                  });
                }}
                pageSize={levelFilter.limit}
              />
            </>
          )}
        </Skeleton>
      </PageHeader>

    </div>
  );
}
