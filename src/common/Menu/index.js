import React, { useState } from "react";
import { Layout, Menu, Space } from "antd";
import styled from "styled-components";
import { useHistory } from "react-router";
import _menuDynamic from "../../menu";
import { ISvg } from "../index";
import Text from "antd/lib/typography/Text";
import { colors } from "../../utils/color";

// import { svgs } from "../../assets";
// import './Menu.scss';

import { useWindowSize } from "../../utils";
const { Sider } = Layout;
const { SubMenu } = Menu;

const MenuCustom = styled(Menu)`
  position: relative;
  min-height: 550px;
  max-height: 1250px;
  overflow-x: hidden;
  overflow-y: scroll;

  .ant-menu-item-selected {
    background-color: transparent !important;
  }

  .ant-menu-item:hover {
    fill: #13a751;
  }
  .ant-menu-item .ant-tooltip-content {
    opacity: 0 !important;
  }
`;

const Welcome = styled.div`
  margin: 0 0 10px;
  padding: 50px 0 0;
  position: relative;
  top: 20px;
`;

const Img = styled.img`
  width: 100px;
  position: relative;
  left: 60px;
`;

const WelconeZone = styled(Menu)`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 20px;
  margin: 30px 0 0;
`;

function MenuLayout(props) {
  const history = useHistory();
  const [isDrawer, setIsDrawer] = useState(false);
  const screenW_H = useWindowSize();

  const onCloseDrawer = () => {
    setIsDrawer(!isDrawer);
  };

  const [current, setCurrent] = useState(-1);
  const [selectKey, setSelectKey] = useState([]);
  const [activeChildren, setActiveChildren] = useState(-1);
  return (
    <div style={{ minHeight: screenW_H.height }} className="shadow-no-radius">
      <Sider
        trigger={null}
        collapsible
        collapsed={isDrawer}
        width={220}
        style={{
          zIndex: 2,
          height: "100%",
        }}
      >
        <MenuCustom
          openKeys={selectKey}
          mode="inline"
          onClick={(e) => {
            let path = "";
            setSelectKey([e.keyPath[0]]);
            if (e.keyPath.length === 1) {
              let pareJsonKey = JSON.parse(e.keyPath[0]);
              path = pareJsonKey.path;
              setCurrent(pareJsonKey.index);
            } else {
              let length = e.keyPath.length;
              let arrPath = [];
              for (let i = 0; i < length; i++) {
                arrPath.push(JSON.parse(e.keyPath[i]));
              }
              setActiveChildren(arrPath[0].index);
              setCurrent(arrPath[0].subMenu);
              path = arrPath[0].path;
            }

            history.push(path);
          }}
        >
          {_menuDynamic.map((item, index) => {
            const active = index === current;
            return item.children.length === 0 ? (
              <MenuCustom.Item
                className="menu-custom"
                key={JSON.stringify({
                  path: item.path,
                  index: index,
                })}
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "24px 0px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <Space size={28}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <ISvg
                        SVG={item.name}
                        width={20}
                        height={24}
                        fill={active ? colors.main : colors.svg_default}
                      />
                    </div>
                    <Text
                      style={{
                        color: active ? colors.main : colors.icon.default,
                      }}
                    >
                      {item.value}
                    </Text>
                  </Space>
                </div>
              </MenuCustom.Item>
            ) : (
              <SubMenu
                key={item.subMenu}
                onTitleClick={({ key, domEvent }) => {
                  setSelectKey([key]);
                }}
                title={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    <Space size={28}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <ISvg
                          SVG={item.name}
                          width={20}
                          height={24}
                          fill={active ? colors.main : colors.svg_default}
                        />
                      </div>
                      <Text
                        style={{
                          color: active ? colors.main : colors.icon.default,
                        }}
                      >
                        {item.value}
                      </Text>
                    </Space>
                  </div>
                }
              >
                {item.children.map((item1, index2) => {
                  let activeSubmenu =
                    current === item.subMenu && activeChildren === item1.index;
                  return (
                    <Menu.Item
                      key={JSON.stringify({
                        path: item1.path,
                        index: item1.index,
                        subMenu: item1.subMenu,
                      })}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginLeft: 24,
                        }}
                      >
                        <Text
                          style={{
                            color: activeSubmenu
                              ? colors.main
                              : colors.icon.default,
                          }}
                        >
                          {item1.value}
                        </Text>
                      </div>
                    </Menu.Item>
                  );
                })}
              </SubMenu>
            );
          })}
        </MenuCustom>
      </Sider>
    </div>
  );
}

export default MenuLayout;
