import {
  Col,
  Divider,
  Drawer,
  Input,
  Row,
  Select,
  Form,
  notification,
  Space,
  Button,
  Skeleton,
} from "antd";
import React, { useEffect, useState } from "react";
import { ISelect } from "../../common";
import PropTypes from "prop-types";
import { PlusOutlined } from "@ant-design/icons";
import Text from "antd/lib/typography/Text";
import TextArea from "antd/lib/input/TextArea";
import { useDispatch } from "react-redux";
import {
  _reducerFetchDetailRoles,
  _reducerFetchPostRoles,
  _reducerFetchPutRolesUpdate,
} from "../../reducers/Role/reducers";
import { unwrapResult } from "@reduxjs/toolkit";
import { APIService, UserService } from "../../apis";
const { Option } = Select;
const deafuatQueryPermissions = ["create", "update", "delete"];
const deafuatModulesAuthorized = ["all", "dashboard"];
export default function CreateRoles(props) {
  const {
    visibleCreate,
    onCreateCallback,
    onCloseCallback,
    edit,
    idRoles,
  } = props;
  const [form] = Form.useForm();
  const [arrQueryPermissions, setArrQueryPermissions] = useState([
    ...deafuatQueryPermissions,
  ]);
  const [arrModulesAuthorized, setArrModulesAuthorized] = useState([
    ...deafuatModulesAuthorized,
  ]);
  const [name, setName] = useState("");
  const [nameAuthorized, setNameAuthorized] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const dispatch = useDispatch();
  const _handleChangleText = (value) => {
    setName(value);
  };

  const _handleChangleTextAuthorized = (value) => {
    setNameAuthorized(value);
  };

  const openNotificationWithIcon = (title) => {
    notification.error({
      message: "Thông báo",
      description: title,
      placement: "topLeft",
    });
  };

  const _fetchAPIDetailRoles = async (idRoles) => {
    try {
      const data = await dispatch(_reducerFetchDetailRoles(idRoles));
      const currentRoles = unwrapResult(data);
      if (currentRoles.code === "Fail") {
        return openNotificationWithIcon(currentRoles.message);
      }
      setArrQueryPermissions([...currentRoles.query_permissions]);
      setArrModulesAuthorized([...currentRoles.modules_authorized]);
      form.setFieldsValue({
        title: currentRoles.title,
        description: currentRoles.description,
        query_permissions: currentRoles.query_permissions,
        modules_authorized: currentRoles.modules_authorized,
        is_verified: currentRoles.is_verified ? "Hoạt động" : "Không hoạt động",
      });
    } catch (error) {
    } finally {
      // setLoadingTable(false);
    }
  };

  useEffect(() => {
    if (edit) {
      _fetchAPIDetailRoles(idRoles);
    } else {
      setLoadingDetail(false);
    }
  }, [edit]);

  useEffect(() => {
    setName("");
  }, [arrQueryPermissions]);

  useEffect(() => {
    setNameAuthorized("");
  }, [arrModulesAuthorized]);

  const _handleAddItem = () => {
    if (name === "") {
      return openNotificationWithIcon(
        "Tên quyền truy cập không được để trống."
      );
    }
    setArrQueryPermissions([...arrQueryPermissions, name]);
  };

  const _handleAddItemAuthorized = () => {
    if (nameAuthorized === "") {
      return openNotificationWithIcon("Tên ủy quyền không được để trống.");
    }
    setArrModulesAuthorized([...arrModulesAuthorized, nameAuthorized]);
  };

  const _fetchAPIPostAddRoles = async (dataAdd) => {
    try {
      const data = await dispatch(_reducerFetchPostRoles(dataAdd));
      const currentRoles = unwrapResult(data);
      if (currentRoles.code === "Fail") {
        return openNotificationWithIcon(currentRoles.message);
      }
      form.resetFields([
        "title",
        "description",
        "query_permissions",
        "modules_authorized",
        "is_verified",
      ]);
      onCreateCallback();
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingSubmit(false);
    }
  };

  const _fetchAPIPostUpdateRoles = async (idRoles, dataUpdate) => {
    try {
      const data = await APIService._putRolesItemPermission(
        idRoles,
        dataUpdate
      );

      if (data.code === "Fail") {
        return openNotificationWithIcon(data.message);
      }
      form.resetFields([
        "title",
        "description",
        "query_permissions",
        "modules_authorized",
        "is_verified",
      ]);
      onCreateCallback();
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
        title={edit ? "Chỉnh sửa nhóm Phân Quyền" : "Tạo mới nhóm Phân Quyền"}
        width={'100%'}
        onClose={() => {
          onCloseCallback();
          form.resetFields([
            "title",
            "description",
            "query_permissions",
            "modules_authorized",
            "is_verified",
            "created_by",
          ]);
        }}
      >
        <Skeleton active paragraph={{ rows: 8 }} loading={loadingDetail}>
          <Form
            layout="vertical"
            hideRequiredMark
            form={form}
            onFinish={async (value) => {
              const tokenID = UserService._getID();

              if (edit) {
                const dataUpdate = {
                  title: value.title,
                  description: value.description,
                  query_permissions: value.query_permissions,
                  modules_authorized: value.modules_authorized,
                  is_verified: value.is_verified === "Hoạt động",
                  created_by: tokenID,
                };
                setLoadingSubmit(true);
                _fetchAPIPostUpdateRoles(idRoles, dataUpdate);
              } else {
                const dataAdd = {
                  title: value.title,
                  description: value.description,
                  query_permissions: value.query_permissions,
                  modules_authorized: value.modules_authorized,
                  is_verified: value.is_verified === "Hoạt động",
                  created_by: tokenID,
                };
                setLoadingSubmit(true);
                await _fetchAPIPostAddRoles(dataAdd);
              }
            }}
          >
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="title"
                  label="Tên nhóm"
                  hasFeedback
                  rules={[
                    { required: true, message: "Vui lòng nhập loại nhóm." },
                  ]}
                >
                  <Input placeholder="Vui lòng nhập loại nhóm." />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  hasFeedback
                  name="is_verified"
                  label="Trạng thái"
                  rules={[
                    { required: true, message: "Vui lòng chọn trạng thái." },
                  ]}
                >
                  <ISelect
                    dataOption={[
                      {
                        value: true,
                        text: "Hoạt động",
                      },
                      {
                        value: false,
                        text: "Không hoạt động",
                      },
                    ]}
                    keyName="value"
                    valueName="text"
                    placeholder="Vui lòng chọn trạng thái"
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="query_permissions"
                  label="Quyền truy cập"
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn quyền truy cập.",
                    },
                  ]}
                >
                  <Select
                    style={{ width: "100%" }}
                    mode="multiple"
                    placeholder="Vui lòng chọn quyền truy cập"
                    dropdownRender={(menu) => (
                      <div>
                        {menu}
                        <Divider style={{ margin: "4px 0" }} />
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "nowrap",
                            padding: 8,
                          }}
                        >
                          <Input
                            style={{ flex: "auto" }}
                            value={name}
                            onChange={(e) => _handleChangleText(e.target.value)}
                          />
                          <Text
                            style={{
                              flex: "none",
                              padding: "8px",
                              display: "block",
                              cursor: "pointer",
                            }}
                            type="success"
                            onClick={() => {
                              _handleAddItem();
                            }}
                          >
                            <PlusOutlined /> Thêm Quyền Mới
                          </Text>
                        </div>
                      </div>
                    )}
                  >
                    {arrQueryPermissions.map((item) => (
                      <Option key={item}>{item}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="modules_authorized"
                  label="Ủy quyền"
                  hasFeedback
                  rules={[
                    { required: true, message: "Vui lòng chọn ủy quyền." },
                  ]}
                >
                  <Select
                    style={{ width: "100%" }}
                    mode="multiple"
                    placeholder="Vui lòng chọn ủy quyền"
                    dropdownRender={(menu) => (
                      <div>
                        {menu}
                        <Divider style={{ margin: "4px 0" }} />
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "nowrap",
                            padding: 8,
                          }}
                        >
                          <Input
                            style={{ flex: "auto" }}
                            value={nameAuthorized}
                            onChange={(e) =>
                              _handleChangleTextAuthorized(e.target.value)
                            }
                          />
                          <Text
                            style={{
                              flex: "none",
                              padding: "8px",
                              display: "block",
                              cursor: "pointer",
                            }}
                            type="success"
                            onClick={() => {
                              _handleAddItemAuthorized();
                            }}
                          >
                            <PlusOutlined /> Thêm mới
                          </Text>
                        </div>
                      </div>
                    )}
                  >
                    {arrModulesAuthorized.map((item) => (
                      <Option key={item}>{item}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="description"
                  label="Miêu tả"
                  rules={[{ required: true, message: "Vui lòng điền miêu tả" }]}
                >
                  <TextArea
                    placeholder="Vui lòng điền miêu tả"
                    autoSize={{ minRows: 4, maxRows: 8 }}
                  />
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
                      onClick={() => onCloseCallback()}
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

CreateRoles.prototype = {
  visibleCreate: PropTypes.bool.isRequired,
  onCloseCallback: PropTypes.func.isRequired,
  onCreateCallback: PropTypes.func.isRequired,
  idRoles: PropTypes.string.isRequired,
  edit: PropTypes.bool.isRequired,
};
