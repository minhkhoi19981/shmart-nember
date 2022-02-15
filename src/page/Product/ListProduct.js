import {
  Col,
  Row,
  Space,
  Typography,
  InputNumber,
  Modal,
  message,
  notification,
  Skeleton,
  Upload,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import {
  EditOutlined,
  ExclamationCircleFilled,
  PlusOutlined,
} from "@ant-design/icons";

// import FormatterDay from "../../utils/FormatterDay";
// import EditAccount from "./EditAccount";

import { APIService, APIServiceV2 } from "../../apis";
import ITable from "../../common/Table";
import Title from "antd/lib/typography/Title";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { priceFormat } from "../../utils";
import Avatar from "antd/lib/avatar/avatar";
import { _reducerFetchListProduct } from "../../reducers/Product/reducers";
import images from "./../../utils/images/index";

// const { Link } = Typography;
// const formatDay = "#hhh#:#mm#:#ss# #DD#/#MM#/#YYYY#";

export default function ListProduct() {
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
  });
  const [visible, setVisible] = useState(false);
  const [dataEdit, setDataEdit] = useState({
    id: -1,
    cashback: 0,
    list_img: [],
  });

  const inputRef = useRef(null);
  const dispatch = useDispatch();

  // const menu = (data) => (
  //   <Menu
  //     onClick={({ item, key }) => {
  //       // eslint-disable-next-line default-case
  //       switch (Number(key)) {
  //         case 1: {
  //           setIsEdit(true);
  //           _handleDrawerCreate();
  //           setDataEdit({ ...data });
  //           break;
  //         }
  //         case 2: {
  //           _handleDrawer();
  //           setLoadingDetail(true);
  //           _fetchAPIDetail(data._id);
  //         }
  //       }
  //     }}
  //   >
  //     <Menu.Item
  //       key="1"
  //       icon={<EditOutlined />}
  //       disabled={data.is_delivered || data.is_canceled}
  //     >
  //       Chỉnh sửa
  //     </Menu.Item>
  //     <Menu.Item key="2" icon={<EyeOutlined />}>
  //       Xem chi tiết
  //     </Menu.Item>
  //   </Menu>
  // );

  const [dataTable, setDataTable] = useState([]);
  const [loadingTable, setLoadingTable] = useState(true);
  const [totalCount, setTotalCount] = useState(1);

  // const _fetchAPIDetail = async (idProduct) => {
  //   try {
  //     const data = await APIService._getDetailProduct(idProduct);
  //     setDataDetail({ ...data });
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setLoadingDetail(false);
  //   }
  // };

  useEffect(() => {
    if (dataEdit.id !== -1) {
      setVisible(true);
      // return showConfirm(dataEdit.cashback, dataEdit.id, dataEdit.list_img);
    }
  }, [dataEdit.id]);

  useEffect(() => {
    _fetchAPIList(filter);
  }, [filter]);

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      width: 80,
      align: "center",
      key: "stt",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "full_name",
      key: "full_name",
    },
    {
      title: "Hình Ảnh",
      dataIndex: "imagesPhone",
      key: "imagesPhone",
      align: "center",

      render: (imagesPhone) => {
        return !imagesPhone.length ? (
          <Skeleton.Image />
        ) : (
          <Avatar
            shape="square"
            size="large"
            src={imagesPhone[0].url}
            style={{ width: 96, height: 96 }}
          />
        );
      },
    },
    {
      title: "Mã sản phẩm",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Tên danh mục",
      dataIndex: "category_name",
      key: "category_name",
    },
    {
      title: "Tên thương hiệu",
      dataIndex: "trade_mark_name",
      key: "trade_mark_name",
    },

    {
      title: "Tồn kho",
      dataIndex: "qty",
      key: "qty",
      align: "right",
      render: (qty) => <span>{priceFormat(qty)}</span>,
    },
    {
      title: "Giá sản phẩm",
      dataIndex: "base_price",
      key: "base_price",
      align: "right",

      render: (base_price) => <span>{priceFormat(base_price)}đ</span>,
    },

    {
      title: "CASHBACK",

      align: "right",

      render: (obj) => (
        <Space>
          <span>{priceFormat(obj.cashback_percent)}</span>

          <EditOutlined
            style={{
              cursor: "pointer",
            }}
            onClick={() => {
              setDataEdit({
                ...dataEdit,
                id: obj.id,
                cashback: obj.cashback_percent,
                list_img: [...obj.imagesPhone],
              });
            }}
          />
        </Space>
      ),
    },
  ];

  const openNotificationWithIcon = (title) => {
    notification.error({
      message: "Thông báo",
      description: title,
      placement: "topLeft",
    });
  };

  // function showConfirm(value, id) {
  //   return Modal.confirm({
  //     title: "CHỈNH SỬA SẢN PHẨM",
  //     icon: <ExclamationCircleFilled />,
  //     content: (
  //       <Row gutter={[16, 16]}>
  //         <Col span={24}>
  //           <strong>Cashback</strong>
  //           <InputNumber
  //             defaultValue={value}
  //             style={{ width: "100%" }}
  //             min={0}
  //             key={id}
  //             ref={inputRef}
  //             formatter={(value) =>
  //               `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  //             }
  //             parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
  //           />
  //         </Col>
  //         <Col span={24}>{dataEdit.list_img.length}</Col>
  //         <Col span={24}>
  //           <strong>Hình ảnh</strong>
  //           <Upload
  //             listType="picture-card"
  //             fileList={dataEdit.list_img}
  //             onRemove={(file) => {
  //               let dataTemp = [...dataEdit.list_img];
  //               const idx = dataTemp.map((el) => el.url).indexOf(file.url);
  //               dataTemp.splice(idx, 1);
  //               setDataEdit((dataEdit) => {
  //                 const dataFinsh = { ...dataEdit, list_img: [...dataTemp] };
  //                 debugger;
  //                 return dataFinsh;
  //               });
  //             }}
  //             onChange={async ({ file }) => {
  //               try {
  //                 if (file.status === "uploading") {
  //                   const data = await APIService._uploadImage(
  //                     file.originFileObj
  //                   );
  //                   const arrURL = [...dataEdit.list_img];
  //                   arrURL.push({
  //                     uid: dataEdit.list_img.length - 1,
  //                     url: `https://api.shmart.vn/public/${data.attachment.filename}`,
  //                   });
  //                   setDataEdit({
  //                     ...dataEdit,
  //                     list_img: [...arrURL],
  //                   });
  //                 } else {
  //                 }
  //               } catch (error) {
  //                 console.log(error);
  //               }
  //             }}
  //           >
  //             {dataEdit.list_img?.length <= 6 && (
  //               <div>
  //                 <PlusOutlined />
  //                 <div style={{ marginTop: 8 }}>Upload</div>
  //               </div>
  //             )}
  //           </Upload>
  //         </Col>
  //       </Row>

  //     ),
  //     async onOk() {
  //       try {
  //         setLoadingTable(true);
  //         const data = await APIServiceV2._putCashBackProduct(
  //           {
  //             cashback_percent: Number(
  //               inputRef.current.value.replace(/\$\s?|(,*)/g, "")
  //             ),
  //           },
  //           id
  //         );
  //         if (data.code === "Fail") {
  //           return openNotificationWithIcon(data.message);
  //         }
  //         await _fetchAPIList(filter);
  //         message.success("Update cashback thành công.");
  //       } catch (error) {
  //       } finally {
  //         setLoadingTable(false);
  //       }
  //     },
  //     okText: "Lưu",
  //     cancelText: "Hủy",
  //     onCancel() {
  //       console.log("Cancel");
  //     },
  //   });
  // }

  const _fetchAPIList = async (filter) => {
    try {
      const listProduct = await dispatch(_reducerFetchListProduct(filter));
      let currentRoot = unwrapResult(listProduct);
      currentRoot._Array.map((item, index) => {
        item.stt = index + 1;
        item.isEdit = false;
        const imagesPhoneUrl = item.imagesPhone.map((item1, index1) => {
          return { url: item1, uid: index1 - 1 };
        });
        item.imagesPhone = [...imagesPhoneUrl];
      });

      setDataTable([...currentRoot._Array]);
      setTotalCount(currentRoot.TotalCount);
      setLoadingTable(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingTable(false);
    }
  };

  useEffect(() => {
    if (!visible) {
      setDataEdit({
        id: -1,
        cashback: 0,
        list_img: [],
      });
    }
  }, [visible]);

  const hideModal = () => {
    setVisible(false);
  };

  return (
    <div>
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Row align="middle">
            <Col span={24}>
              <Title level={4}>DANH SÁCH SẢN PHẨM</Title>
            </Col>
            {/* <Col span={12} style={{ textAlign: "right" }}>
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={() => _handleDrawerCreate()}
              >
                Tạo mới
              </Button>
            </Col> */}
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
            scroll={{ x: 1400 }}
            onChange={(obj) => {
              setLoadingTable(true);
              setFilter({
                ...filter,
                page: obj.current,
                limit: obj.pageSize,
              });
            }}
            pageSize={filter.limit}
          />
        </Col>
        <Modal
          title="CHỈNH SỬA SẢN PHẨM"
          visible={visible}
          centered={true}
          confirmLoading={loadingTable}
          onOk={async () => {
            try {
              setLoadingTable(true);
              const data = await APIServiceV2._putCashBackProduct(
                {
                  cashback_percent: Number(
                    inputRef.current.value.replace(/\$\s?|(,*)/g, "")
                  ),
                  imagesPhone: dataEdit.list_img.map((el) => el.url),
                },
                dataEdit.id
              );
              if (data.code === "Fail") {
                return openNotificationWithIcon(data.message);
              }
              hideModal();
              await _fetchAPIList(filter);
              message.success("Update cashback thành công.");
            } catch (error) {
            } finally {
              setLoadingTable(false);
            }
          }}
          onCancel={hideModal}
          okText="Lưu"
          maskClosable={false}
          cancelText="Hủy"
        >
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <strong>Cashback</strong>
              <InputNumber
                defaultValue={dataEdit.cashback}
                style={{ width: "100%" }}
                min={0}
                key={dataEdit.id}
                ref={inputRef}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Col>
            <Col span={24}>
              <strong>Hình ảnh</strong>
              <Upload
                listType="picture-card"
                fileList={dataEdit.list_img}
                onRemove={(file) => {
                  let dataTemp = [...dataEdit.list_img];
                  const idx = dataTemp.map((el) => el.url).indexOf(file.url);
                  dataTemp.splice(idx, 1);
                  setDataEdit((dataEdit) => {
                    const dataFinsh = { ...dataEdit, list_img: [...dataTemp] };
                    return dataFinsh;
                  });
                }}
                onChange={async ({ file }) => {
                  try {
                    if (file.status === "uploading") {
                      const data = await APIService._uploadImage(
                        file.originFileObj
                      );
                      const arrURL = [...dataEdit.list_img];
                      arrURL.push({
                        uid: dataEdit.list_img.length - 1,
                        url: `https://api.shmart.vn/public/${data.attachment.filename}`,
                      });
                      setDataEdit({
                        ...dataEdit,
                        list_img: [...arrURL],
                      });
                    } else {
                    }
                  } catch (error) {
                    console.log(error);
                  }
                }}
              >
                {dataEdit.list_img?.length <= 6 && (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </Col>
          </Row>
        </Modal>
      </Row>
    </div>
  );
}
