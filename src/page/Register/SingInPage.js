import React, { useState } from "react";
import {
  Alert,
  Button,
  Col,
  Form,
  Input,
  message,
  Row,
  Space,
  Typography,
} from "antd";

import { _reducerFetchPostRegisterAuth } from "../../reducers/Login/reducers";
import { ACTION_LOGIN_SIGUP } from "../../store/reducers";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { images } from "../../utils";
import { colors } from "../../utils/color";
import { useHistory } from "react-router-dom";

const { Title, Text } = Typography;

export default function SingInPage() {
  const navigate = useHistory();
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isError, setIsError] = useState(false);
  const dispatch = useDispatch();
  const _fetchPostSignIn = async (dataSignIn) => {
    try {
      const data = await dispatch(_reducerFetchPostRegisterAuth(dataSignIn));
      const currentSignIn = unwrapResult(data);
      if (currentSignIn.code === "Fail") {
        setIsError(true);
      } else {
        dispatch(
          ACTION_LOGIN_SIGUP({
            username: data.payload.username,
            password: dataSignIn.password,
          })
        );
        message.success("Tạo thành công");
        navigate.replace("/login");
      }

      console.log(currentSignIn);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingSubmit(false);
    }
  };

  const onFinish = async (values) => {
    try {
      setLoadingSubmit(true);
      const dataPost = {
        username: values.username,
        email: values.email,
        password: values.password,
        primary_phone_pumber: values.phone,
        secondary_phone_pumber: values.phone,
        primary_address: values.address,
        secondary_address: values.address,
        first_name: " ",
        last_name: values.username,
        parent_code: "pilepm",
        middle_name: " ",
        roles: "Admin",
        bio: [
          {
            avatar: "",
            introduce: "",
            facebook_link: "#",
            twitter_link: "#",
            instagram_link: "#",
            wallet: 0,
          },
        ],
      };
      _fetchPostSignIn(dataPost);

      console.log("finish", values);
    } catch (error) {}
  };

  return (
    <div className="flex-center-center" style={{ height: "70vh" }}>
      <div style={{ width: 750 }} className="shadow">
        <Row gutter={[24, 0]} wrap={false} justify="middle">
          <Col flex="none" style={{ height: "100%" }}>
            <div style={{ height: "100%" }}>
              <img
                src={"https://i.imgur.com/vAfCjSJ.jpg"}
                alt="Neature"
                style={{
                  borderTopLeftRadius: 12,
                  borderBottomLeftRadius: 12,
                  height: "100%",
                }}
              />
              <div
                style={{ position: "absolute", left: 46, top: 46, zIndex: 22 }}
              >
                <Space direction="vertical">
                  <Title style={{ color: "white" }} level={2}>
                    Sign In
                  </Title>
                  <Text style={{ color: "white" }}>
                    Sign in with your email.
                  </Text>
                  <Text style={{ color: "white" }}> Get an account!!! </Text>
                </Space>
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 46,
                  bottom: 12,
                  zIndex: 22,
                }}
              >
                <Space align="baseline">
                  <img
                    src={images.logoSnackHours}
                    style={{ width: 20, height: 20, borderRadius: 10 }}
                    alt="logo"
                  />
                  <Title style={{ color: "white" }} level={5}>
                    SnackHouse
                  </Title>
                </Space>
              </div>
            </div>
          </Col>
          <Col flex="auto" style={{ height: "100%" }}>
            <div
              style={{
                padding: "24px 24px 0px 24px",
                height: "100%",
              }}
            >
              <Form
                name="normal_login"
                className="login-form"
                onFinish={onFinish}
              >
                <Form.Item
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập Tên của bạn!",
                      // type: "email",
                    },
                  ]}
                >
                  <Input placeholder="UserName" size="middle" />
                </Form.Item>
                <Form.Item
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập Email của bạn!",
                    },
                    {
                      type: "email",
                      message: "Email có định dạng abc@****",
                    },
                  ]}
                >
                  <Input placeholder="Email" size="middle" />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập mật khẩu của bạn!",
                    },
                    {
                      max: 32,
                      min: 8,
                      message: "Mật khẩu trên 8 kí tự và dưới 32 kí tự",
                    },
                    {
                      // regex có chữ hoa ^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]$
                      pattern:
                        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                      message:
                        "Mật khẩu phải ít nhất một ký tự viết thường, một số và một ký tự đặc biệt.",
                    },
                  ]}
                >
                  <Input.Password
                    placeholder="Password"
                    size="middle"
                    iconRender={(visible) =>
                      visible ? (
                        <EyeOutlined style={{ color: colors.main }} />
                      ) : (
                        <EyeInvisibleOutlined />
                      )
                    }
                  />
                </Form.Item>
                <Form.Item
                  name="phone"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập Số điện thoại của bạn!",
                      // type: "email",
                    },
                    {
                      pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                      message: "Định dạng sdt :09*******,84*******",
                    },
                  ]}
                >
                  <Input placeholder="Số điện thoại" size="middle" />
                </Form.Item>

                <Form.Item
                  name="address"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập Địa chỉ của bạn!",
                      // type: "email",
                    },
                  ]}
                >
                  <Input placeholder="Địa chỉ" size="middle" />
                </Form.Item>
                {isError ? (
                  <Form.Item>
                    <Alert
                      message="Tên đặng nhập ,email và sđt một trong ba đã đượ người khác sử dụng."
                      type="error"
                      showIcon
                      closable
                      onClose={() => {
                        setIsError(false);
                      }}
                    />
                  </Form.Item>
                ) : null}

                <Form.Item>
                  <Button
                    type="primary"
                    loading={loadingSubmit}
                    htmlType="submit"
                    className="login-form-button"
                  >
                    Sign Up
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
