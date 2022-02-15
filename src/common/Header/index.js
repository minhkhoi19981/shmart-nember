import React from "react";
import { HeaderWrapper } from "./styled";
import { Row, Col, Space } from "antd";
import { useHistory } from "react-router";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';

import Text from "antd/lib/typography/Text";
import styled from "styled-components";

HeaderLayout.propTypes = {};

const LogoutButton = styled.button`
  padding: 5px 15px;
  border-radius: 20px;
  box-shadow: none;
  border: none;
  color: red;
  cursor: pointer;
`

const TextWelcome = styled.span`
  position: fixed;
  left: 15px;
  top: 18px;
  font-weight: bold;
  color: white;
  letter-spacing: 2px;
`

function HeaderLayout(props) {
  const navigate = useHistory();

  function LogoutFunc() {
    localStorage.removeItem('token');

    setTimeout(() => {
      navigate.push('/login');
    }, 2000)
  }

  return (
    <div>
      <HeaderWrapper>
        <Row>
          <Col span={24}>
            <TextWelcome>SHMart - Chuỗi Siêu Thị 4.0</TextWelcome>
            <Space
              size={24}
              align="center"
              style={{
                height: 64,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <LogoutButton onClick={() => LogoutFunc()}>
                <FontAwesomeIcon icon={faPowerOff} />
                <Text> Đăng Xuất </Text>
              </LogoutButton>
            </Space>
          </Col>
        </Row>
      </HeaderWrapper>
    </div>
  );
}

export default HeaderLayout;
