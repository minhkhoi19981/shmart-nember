import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  Row,
  Space,
  DatePicker,
  Badge,
  Typography,
  Skeleton,
  message,
  Table,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { unwrapResult } from "@reduxjs/toolkit";
import { ISelect } from "../../common";
import TextArea from "antd/lib/input/TextArea";
import { APIService } from "../../apis";
import Avatar from "antd/lib/avatar/avatar";
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  _reducerFetchListRoles,
  _reducerFetchDetailRoles,
} from "../../reducers/Role/reducers";
import moment from "moment";
import PropTypes from "prop-types";
import FormatterDay from "../../utils/FormatterDay";
import { _reducerFetchPostRegisterAuth } from "../../reducers/Login/reducers";
import { colors } from "../../utils/color";

const dateFormat = "DD/MM/YYYY";

const timeNowDate = new Date();
const currentTime = FormatterDay.dateFormatWithString(
  timeNowDate.getTime(),
  "#DD#/#MM#/#YYYY#"
);

export default function EditAccount(props) {
  const {
    visibleCreate,
    onCreateCallback,
    onCloseCallback,
    idAccount,
    edit,
  } = props;
  const dispatch = useDispatch();
  const dataRoot = useSelector((state) => state);
  const { roles } = dataRoot;
  const [query_permissions, setQuery_permissions] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [dataDetail, setDataDetail] = useState();
  const [dataStores, setDataStores] = useState();
  const [form] = Form.useForm();
  const [currentDob, setCurrentDob] = useState(currentTime);

  const _fetchListRoles = async () => {
    try {
      const data = await dispatch(_reducerFetchListRoles());
      const currentCate = unwrapResult(data);
      setLoadingRoles(false);
      console.log(currentCate);
    } catch (error) { }
  };

  const _fetchStationsList = async () => {
    try {
      const dataRes = await APIService._getListStations(1, 100);

      setLoadingRoles(false);
      setDataStores(dataRes._Array);
    } catch (erorr) {
      console.log(erorr);
    }
  };

  useEffect(() => {
    _fetchStationsList();
    _fetchListRoles();
  }, []);

  useEffect(() => {
    if (edit) {
      setLoadingDetail(true);
      _fetchAPIDetail(idAccount);
    } else {
      setLoadingDetail(false);
      setCurrentDob(currentTime);
    }
  }, [edit]);

  const _fetchAPIDetail = async (account_id) => {
    try {
      const data = await APIService._getAccountDeatailItem(account_id);

      form.setFieldsValue({
        last_name: data.last_name,
        email: data.email,
        primary_address: data.primary_address,
        activated: data.activated ? "Kích Hoạt" : "Khóa",
        jobs: data.jobs,
        roles: data.roles,
        permissions: data.permissions,
        your_wallet: data.your_wallet,
        cashback_wallet: data.cashback_wallet,
        group_members: data.group_members[0],
        owner_store: data.owner_store,
        introduce: data.bio[0].introduce,
        facebook_link: data.bio[0].facebook_link,
        twitter_link: data.bio[0].twitter_link,
        instagram_link: data.bio[0].instagram_link,
        primary_phone_number: data.primary_phone_number,
        username: data.username,
        password: data.password,
      });

      let dateTime = FormatterDay.dateFormatWithString(
        new Date(data.dob).getTime(),
        "#DD#/#MM#/#YYYY#"
      );
      setCurrentDob(dateTime);
      setQuery_permissions([...data.permissions]);
      setDataDetail(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingDetail(false);
    }
  };

  const _fetchSubmit = (value) => {
    try {
      if (edit) {
        var dateParts = currentDob.split("/");

        let timeDob = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
        const dataUpdate = {
          follow: [],
          bio: [
            {
              avatar: "",
              introduce: value.introduce,
              facebook_link: value.facebook_link,
              twitter_link: value.twitter_link,
              instagram_link: value.instagram_link,
              wallet: 0,
            },
          ],
          roles: value.roles,
          permissions: query_permissions,
          jobs: value.jobs,
          activated: value.activated === "Kích Hoạt" ? true : false,
          _id: dataDetail._id,
          username: value.username,
          owner_store: value.owner_store,
          email: value.email,
          primary_address: value.primary_address,
          secondary_address: value.secondary_address,
          first_name: dataDetail.first_name,
          last_name: value.last_name,
          middle_name: dataDetail.middle_name,
          dob: timeDob,
          primary_phone_number: value.primary_phone_number,
          secondary_phone_number: value.primary_phone_number,
          created_date: dataDetail.created_date,
          id: dataDetail.id,
        };
        setLoadingSubmit(true);

        // console.log(dataUpdate)

        _fetchUpdateRoles(idAccount, dataUpdate);
      } else {
        setLoadingSubmit(true);
        const dataPost = {
          username: value.username,
          activated: value.activated === "Kích Hoạt" ? true : false,
          email: value.email,
          password: value.password,
          owner_store: value.owner_store,
          permissions: query_permissions,
          primary_phone_pumber: value.primary_phone_pumber,
          secondary_phone_pumber: value.primary_phone_pumber,
          primary_address: value.primary_address,
          secondary_address: value.secondary_address,
          first_name: " ",
          last_name: value.last_name,
          middle_name: " ",
          roles: value.roles,
          primary_phone_number: value.primary_phone_number,
          secondary_phone_number: value.primary_phone_number,
          bio: [
            {
              avatar: "",
              introduce: value.introduce,
              facebook_link: value.facebook_link,
              twitter_link: value.twitter_link,
              instagram_link: value.instagram_link,
              wallet: 0,
            },
          ],
        };
        setLoadingSubmit(true);

        _fetchPostSignIn(dataPost);
      }
    } catch (error) { }
  };

  const _fetchDetailRoles = async (id_role) => {
    try {
      const data = await dispatch(_reducerFetchDetailRoles(id_role));
      const currentRoles = unwrapResult(data);

      setQuery_permissions([...currentRoles.query_permissions]);
    } catch (error) {
      console.log(error);
    }
  };

  const _fetchUpdateRoles = async (id, data) => {
    try {
      const dataRes = await APIService._putRoleItem(id, data);
      if (dataRes.code === "Fail") {
        message.error(dataRes.message);
        return;
      }
      message.success("Chỉnh sửa thông tin.");
      setLoadingDetail(true);

      onCreateCallback();
    } catch (erorr) {
      console.log(erorr);
    } finally {
      setLoadingSubmit(false);
    }
  };

  const _fetchPostSignIn = async (dataSignIn) => {
    try {
      const data = await dispatch(_reducerFetchPostRegisterAuth(dataSignIn));
      const currentSignIn = unwrapResult(data);
      if (currentSignIn.code === "Fail") {
        message.error(currentSignIn.message);
        return;
      } else {
        message.success("Tạo thành công");
        setLoadingDetail(true);
        onCreateCallback();
        form.resetFields([
          "introduce",
          "facebook_link",
          "twitter_link",
          "instagram_link",
          "roles",
          "permissions",
          "jobs",
          "activated",
          "owner_store",
          "username",
          "email",
          "last_name",
          "primary_phone_number",
          "primary_address",
          "password",
          "group_members"
        ]);
      }

      console.log(currentSignIn);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div>
      <Drawer
        visible={visibleCreate}
        title={edit ? "Chỉnh sửa tài khoản" : "Tạo tài khoản"}
        width={'100%'}
        onClose={() => {
          onCloseCallback();
          form.resetFields([
            "introduce",
            "facebook_link",
            "twitter_link",
            "instagram_link",
            "roles",
            "permissions",
            "jobs",
            "activated",
            "owner_store",
            "username",
            "email",
            "last_name",
            "primary_phone_number",
            "primary_address",
            "password",
            "group_members"
          ]);
          setQuery_permissions([]);
        }}
      >
        <Skeleton active paragraph={{ rows: 8 }} loading={loadingDetail}>
          <Form
            layout="vertical"
            hideRequiredMark
            form={form}
            onFinish={(value) => {
              _fetchSubmit(value);
            }}
          >
            <Row gutter={16}>
              <Col span={24}>
                <div
                  className="flex justify-center"
                  style={{ margin: "12px 0px" }}
                >
                  <Avatar size={128} icon={<UserOutlined />} />
                </div>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="last_name"
                  label="Họ Tên"
                  hasFeedback
                  rules={[{ required: true, message: "Vui lòng nhập họ tên." }]}
                >
                  <Input placeholder="Vui lòng nhập họ tên." />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  hasFeedback
                  rules={[
                    { required: true, message: "Vui lòng nhập email." },
                    {
                      type: "email",
                      message: "Email có định dạng abc@****",
                    },
                  ]}
                >
                  <Input placeholder="Vui lòng nhập email." />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="username"
                  label="Tài khoản"
                  hasFeedback
                  rules={[
                    { required: true, message: "Vui lòng nhập tài khoản." },
                  ]}
                >
                  <Input placeholder="Vui lòng nhập tài khoản." />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="password"
                  label="Mật khẩu"
                  rules={[
                    {
                      required: !edit,
                      message: "Vui lòng nhập mật khẩu của bạn!",
                    },
                    {
                      max: 32,
                      min: 8,
                      message: "Mật khẩu trên 8 kí tự và dưới 32 kí tự",
                    },
                    {
                      // regex có chữ hoa ^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]$
                      pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                      message:
                        "Mật khẩu phải ít nhất một ký tự viết thường, một số và một ký tự đặc biệt.",
                    },
                  ]}
                >
                  <Input.Password
                    placeholder="Password"
                    size="middle"
                    defaultValue={edit ? "123456" : undefined}
                    disabled={edit}
                    iconRender={(visible) =>
                      visible ? (
                        <EyeOutlined style={{ color: colors.main }} />
                      ) : (
                        <EyeInvisibleOutlined />
                      )
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="primary_phone_number"
                  label="Số điện thoại"
                  hasFeedback
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại." },
                    {
                      pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                      message: "Định dạng sdt :09*******,84*******",
                    },
                  ]}
                >
                  <Input placeholder="Vui lòng nhập số điện thoại." />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  hasFeedback
                  name="activated"
                  label="Trạng thái"
                  rules={[
                    { required: true, message: "Vui lòng chọn trạng thái." },
                  ]}
                >
                  <ISelect
                    dataOption={[
                      {
                        value: true,
                        text: "Kích Hoạt",
                      },
                      {
                        value: false,
                        text: "Khóa",
                      },
                    ]}
                    keyName="value"
                    valueName="text"
                    placeholder="Vui lòng chọn trạng thái"
                  />
                </Form.Item>
              </Col>

              {/* <Col span={12}>
                <Form.Item
                  name="owner_store"
                  label="Chủ Cửa Hàng:"
                  hasFeedback
                >
                  <Input placeholder="Vui lòng nhập Cửa Hàng." />
                </Form.Item>
              </Col> */}

              <Col span={12}>
                <Form.Item
                  name="jobs"
                  label="Loại công việc"
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập loại công việc.",
                    },
                  ]}
                >
                  <Input placeholder="Vui lòng nhập loại công việc." />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  hasFeedback
                  name="owner_store"
                  label="Chủ Cửa Hàng:"
                  rules={[{ required: false, message: "Vui lòng chọn Cửa Hàng:." }]}
                >
                  <ISelect
                    dataOption={dataStores}
                    keyName="id"
                    valueName="store_name"
                    placeholder="Vui lòng chọn Cửa Hàng:"
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  hasFeedback
                  name="roles"
                  label="Nhóm"
                  rules={[{ required: true, message: "Vui lòng chọn nhóm." }]}
                >
                  <ISelect
                    dataOption={roles}
                    loading={loadingRoles}
                    keyName="id"
                    valueName="title"
                    placeholder="Vui lòng chọn trạng nhóm"
                    onChange={(value, option) => {
                      _fetchDetailRoles(option.key);
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="permissions" label="Quyền truy cập">
                  <Table>
                    <tr>
                      {query_permissions.map((item) => (
                        <td>
                          <Badge status="processing" />
                          <Typography.Text>{item}</Typography.Text>
                        </td>
                      ))}
                    </tr>
                  </Table>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="primary_address"
                  label="Địa chỉ"
                  hasFeedback
                  rules={[
                    { required: true, message: "Vui lòng nhập địa chỉ." },
                  ]}
                >
                  <TextArea
                    placeholder="Vui lòng nhập địa chỉ."
                    autoSize={{ minRows: 3, maxRows: 5 }}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="introduce" label="Giới thiệu">
                  <TextArea
                    placeholder="Giới thiệu bản thân"
                    autoSize={{ minRows: 3, maxRows: 5 }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="facebook_link" label="Facebook">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="twitter_link" label="Twitter">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="instagram_link" label="Instagram">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24}>
                <div
                  style={{
                    textAlign: "right",
                  }}
                >
                  <Space align="middle">
                    <Button
                      style={{ marginRight: 8 }}
                      onClick={() => {
                        onCloseCallback();
                      }}
                    >
                      Hủy bỏ
                    </Button>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loadingSubmit}
                      >
                        {edit ? "Cập nhật" : "Lưu"}
                      </Button>
                    </Form.Item>
                  </Space>
                </div>
              </Col>
            </Row>
          </Form>
        </Skeleton>
      </Drawer>
    </div>
  );
}

EditAccount.prototype = {
  visibleCreate: PropTypes.bool.isRequired,
  onCloseCallback: PropTypes.func.isRequired,
  onCreateCallback: PropTypes.func.isRequired,
  idAccount: PropTypes.string.isRequired,
  edit: PropTypes.bool.isRequired,
};
