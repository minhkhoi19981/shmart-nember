import React, { useState } from "react";
import {
  Alert,
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  message,
  Row,
  Space,
  Typography, Avatar
} from "antd";

import { _reducerFetchPostLoginAuth } from "../../reducers/Login/reducers";

import {
  EyeOutlined,
  LockOutlined,
  MailOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { images } from "../../utils";
import { colors } from "../../utils/color";
import { Link, useHistory } from "react-router-dom";

const { Title, Text } = Typography;

export default function LoginPage() {
  const navigate = useHistory();
  const dataRoot = useSelector((state) => state);
  const { username, password } = dataRoot;
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isError, setIsError] = useState(false);
  const dispatch = useDispatch();
  const _fetchPostLoginAuth = async ({ username, password }) => {
    try {
      const data = await dispatch(
        _reducerFetchPostLoginAuth({ username, password })
      );
      const currentLogin = unwrapResult(data);
      if (currentLogin.code === "Fail") {
        setIsError(true);
      } else {
        navigate.replace("/account");
      }

      console.log(currentLogin);
    } catch (error) {
    } finally {
      setLoadingSubmit(false);
    }
  };

  const onFinish = async (values) => {
    try {
      setLoadingSubmit(true);
      _fetchPostLoginAuth(values);

      console.log("finish", values);
    } catch (error) {
      onFinishFailed();
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="flex-center-center bg" style={{ minHeight: "100vh", padding: 24 }}>
      <Space direction="vertical">
        <Col span={24} style={{ textAlign: 'center' }}>
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
        </Col>
        <div style={{ maxWidth: 600 }} className="shadow">
          <Row justify="middle">
            <Col md={12} xs={24} >
              <Avatar
                // src={images.logoLogin}
                src="https://res.cloudinary.com/snackhouse/image/upload/v1616227361/Splack/Screen_Shot_2021-03-20_at_14.57.16_y1ojmx.png"
                alt="Neature"
                shape="square"
                style={{
                  minHeight: 264,
                  width: '100%'
                }}
              />

            </Col>
            <Col md={12} xs={24} >
              <div
                style={{
                  padding: "46px 24px 32px 24px",
                  height: "100%",
                }}
              >
                <Form
                  name="normal_login"
                  className="login-form"
                  initialValues={{
                    password: password,
                    username: username,
                  }}
                  onFinish={onFinish}
                >
                  <Form.Item
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tên đăng nhập!",
                        // type: "email",
                      },
                    ]}
                  >
                    <Input
                      prefix={<MailOutlined className="site-form-item-icon" />}
                      placeholder="Email"
                      size="large"
                    />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập mật khẩu!",
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
                        message: "Mật khẩu không đúng đinh dạng!",
                      },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined className="site-form-item-icon" />}
                      placeholder="Password"
                      size="large"
                      iconRender={(visible) =>
                        visible ? (
                          <EyeOutlined style={{ color: colors.main }} />
                        ) : (
                          <EyeInvisibleOutlined />
                        )
                      }
                    />
                  </Form.Item>
                  {isError ? (
                    <Form.Item>
                      <Alert
                        message="Tên đặng nhập hoặc mật khẩu của bạn không đúng."
                        type="error"
                        showIcon
                        closable
                        onClose={() => {
                          setIsError(false);
                        }}
                      />
                    </Form.Item>
                  ) : null}

                  <Form.Item style={{ textAlign: 'center' }}>
                    <Button
                      type="primary"
                      loading={loadingSubmit}
                      htmlType="submit"
                      className="login-form-button"
                    >
                      ĐĂNG NHẬP
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </Col>
          </Row>
        </div>

      </Space>


    </div>
  );
}
