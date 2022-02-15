import React, { useState } from "react";
import { Layout, Row, Col, Affix, Typography, Space } from "antd";
import RouteService from "../router/index";

import HeaderLayout from "../common/Header/index";

import MenuLayout from "../common/Menu/index";
import { Redirect, Route, Switch } from "react-router-dom";
import _menuDynamic from "../menu";
import { useWindowSize } from "../utils";

import styled from "styled-components";

const Footer = styled.div`
  position: fixed;
  bottom: -5px;
  z-index: 99;
  width: 100%;
  padding: 5px 0 0 5px;
  background: #078762;
  color: white;
  font-weight: bold;
  font-size: 10px;
`;

const { Content } = Layout;

function DefaultLayout(props) {
  const screenW_H = useWindowSize();
  return (
    <Layout>
      <Row>
        <Col span={24}>
          {/* <HeaderLayout /> */}

          <Layout style={{ minHeight: "100vh" }}>
            {/* <Affix offsetTop={0}>
              <MenuLayout />
            </Affix> */}

            <Content
              style={{
                background: "white",
              }}
              className="site-layout-background shadow"
            >
              <Switch>
                {RouteService.map((route) => {
                  return route.component ? (
                    <Route
                      key={route.name}
                      path={route.path}
                      breadcrumbName={route.name}
                      exact={true}
                      name={route.name}
                      component={route.component}
                    />
                  ) : null;
                })}
                <Redirect from="/" to="/login" />
              </Switch>
            </Content>
          </Layout>
          {/* <Footer>
            <p>Powered by SDTech</p>
          </Footer> */}
        </Col>
      </Row>
    </Layout>
  );
}

export default DefaultLayout;
