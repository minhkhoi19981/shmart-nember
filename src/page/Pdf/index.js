import { unwrapResult } from "@reduxjs/toolkit";
import {
  Space,
  Typography,
  Row,
  Col,
  Table,
  Skeleton,
  Button,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import { Fragment } from "react/cjs/react.production.min";
import styled from "styled-components";
import ITableHtml from "../../common/ITableHtml";
import { _reducerFetchImportWarehouseItem } from "../../reducers/Warehouses/reducer";
import { priceFormat } from "../../utils";
import FormatterDay from "../../utils/FormatterDay";

const { Title, Text, Paragraph } = Typography;

const StyledTableHTML = styled(ITableHtml)`
  height: 100% !important;
  td,
  th {
    border: 1px solid black !important;
  }
  .td-table-1 {
    border-right: 1px solid black !important;
  }
  .tr-table {
    border-right: 1px solid black !important;
    color: black !important;
  }
`;

const StyledTitle = styled(Title)`
  font-family: "Times New Roman";
`;

const StyledText = styled(Text)`
  font-weight: 500;
  font-family: "Times New Roman";
  color: black;
  line-height: initial;
`;

const headerTable = [
  {
    name: "STT",
    align: "center",
    width: 40,
  },
  {
    name: "Tên Sản Phẩm Nhập Kho",
    align: "center",
    width: 290,
  },
  {
    name: "ĐVT",
    align: "center",
    width: 60,
  },
  {
    name: "SL YÊU CẦU",
    align: "center",
    width: 60,
    br: true,
  },
  {
    name: "SL THÙNG/BAO",
    align: "center",
    width: 60,
    br: true,
  },
  {
    name: "TRỌNG LƯỢNG",
    align: "center",
    width: 60,
    br: true,
  },
  {
    name: "GHI CHÚ",
    align: "center",
    width: 90,
  },
];

const bodyTableProduct = (contentTable) => {
  return contentTable.map((item, index) => (
    <tr className="tr-table">
      <td
        className="td-table"
        style={{
          textAlign: "center",
          borderRight: "1px solid black",
          borderBottom: "1px solid black",
          padding: "2px 6px",

          width: 40,
          color: "black",
        }}
      >
        <StyledText style={{ fontSize: 12 }}> {index + 1}</StyledText>
      </td>
      <td
        className="td-table"
        style={{
          borderRight: "1px solid black",
          wordWrap: "break-word",
          wordBreak: "break-word",
          overflow: "hidden",
          borderBottom: "1px solid black",
          padding: "2px 3px",
          whiteSpace: "nowrap",

          width: 290,
        }}
      >
        <Space direction="vertical">
          <StyledText style={{ fontSize: 12 }}>{item.product_name}</StyledText>
          <StyledText style={{ fontSize: 12 }}>{item.product_code}</StyledText>
        </Space>
      </td>

      <td
        className="td-table"
        style={{
          borderRight: "1px solid black",
          borderBottom: "1px solid black",
          padding: "2px 3px",
          textAlign: "center",

          color: "black",

          width: 60,
        }}
      >
        <StyledText style={{ fontSize: 12 }}>{item.unit}</StyledText>
      </td>
      <td
        className="td-table"
        style={{
          borderRight: "1px solid black",
          borderBottom: "1px solid black",
          padding: "2px 3px",

          textAlign: "center",
          color: "black",

          width: 60,
        }}
      >
        <StyledText style={{ fontSize: 12 }}></StyledText>
      </td>

      <td
        className="td-table"
        style={{
          borderRight: "1px solid black",
          borderBottom: "1px solid black",
          textAlign: "center",
          padding: "2px 3px",

          color: "black",

          width: 60,
        }}
      >
        <StyledText style={{ fontSize: 12 }}>
          {priceFormat(item.quantity)}
        </StyledText>
      </td>
      <td
        className="td-table"
        style={{
          borderRight: "1px solid black",
          borderBottom: "1px solid black",
          padding: "2px 3px",

          textAlign: "center",
          color: "black",

          width: 120,
        }}
      >
        <StyledText style={{ fontSize: 12 }}>
          {priceFormat(item.product_price)}
        </StyledText>
      </td>
      <td
        className="td-table"
        style={{
          borderRight: "1px solid black",
          borderBottom: "1px solid black",
          padding: "2px 3px",

          textAlign: "center",
          color: "black",

          width: 120,
        }}
      >
        <StyledText style={{ fontSize: 12 }}>
          {priceFormat(item.total_price)}
        </StyledText>
      </td>
    </tr>
  ));
};

const headerTableProduct = (headerTable) => {
  return (
    <tr className="tr-table scroll" style={{ background: "transparent" }}>
      <td
        className="th-table-1"
        style={{
          textAlign: "center",
          fontSize: 12,
          fontWeight: "bold",
          fontFamily: "Times New Roman",
          borderRight: "1px solid black",
          borderBottom: "1px solid black",
          width: 40,
          padding: "4px 6px",
          whiteSpace: "normal",
          // : "nowrap",
        }}
      >
        STT
      </td>
      <td
        className="th-table-1"
        style={{
          textAlign: "center",
          fontSize: 12,
          fontWeight: "bold",
          fontFamily: "Times New Roman",
          borderRight: "1px solid black",
          borderBottom: "1px solid black",
          width: 290,
          padding: "4px 6px",
          whiteSpace: "normal",
          // : "nowrap",
        }}
      >
        Tên Sản Phẩm Nhập Kho
      </td>
      <td
        className="th-table-1"
        style={{
          textAlign: "center",
          fontSize: 12,
          fontWeight: "bold",
          fontFamily: "Times New Roman",
          borderRight: "1px solid black",
          borderBottom: "1px solid black",
          width: 60,
          padding: "4px 6px",
          whiteSpace: "nowrap",
        }}
      >
        ĐVT
      </td>

      <td
        className="th-table-1"
        style={{
          textAlign: "center",
          fontSize: 12,
          fontWeight: "bold",
          fontFamily: "Times New Roman",
          borderRight: "1px solid black",
          borderBottom: "1px solid black",
          width: 60,
          padding: "4px 6px",
          whiteSpace: "nowrap",
        }}
      >
        Theo chứng từ
      </td>
      <td
        className="th-table-1"
        style={{
          textAlign: "center",
          fontSize: 12,
          fontWeight: "bold",
          fontFamily: "Times New Roman",
          borderRight: "1px solid black",
          borderBottom: "1px solid black",
          width: 60,
          padding: "4px 6px",
          whiteSpace: "nowrap",
        }}
      >
        Thực nhận
      </td>
      <td
        className="th-table-1"
        style={{
          textAlign: "center",
          fontSize: 12,
          fontWeight: "bold",
          fontFamily: "Times New Roman",
          borderRight: "1px solid black",
          borderBottom: "1px solid black",
          width: 120,
          padding: "4px 6px",
          whiteSpace: "nowrap",
        }}
      >
        Đơn giá bán
      </td>
      <td
        className="th-table-1"
        style={{
          textAlign: "center",
          fontSize: 12,
          fontWeight: "bold",
          fontFamily: "Times New Roman",
          borderRight: "1px solid black",
          borderBottom: "1px solid black",
          width: 120,
          padding: "4px 6px",
          whiteSpace: "nowrap",
        }}
      >
        Thành tiền
      </td>
    </tr>
  );
};

export default function Index() {
  const params = useParams();
  const { id } = params;
  const [data, setData] = useState({
    created_date: "2021-04-03T17:00:00.000Z",
    product_list: [],
  });
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const _fetchItem = async (id) => {
    try {
      const data = await dispatch(_reducerFetchImportWarehouseItem(id));
      const currentStations = unwrapResult(data);
      if (currentStations.code === "Fail") {
        message.error(currentStations.message);
        return;
      }
      let sum = 0;
      currentStations.product_list.forEach((item) => (sum += item.total_price));
      currentStations.total_price = sum;
      setData({ ...currentStations });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const _api = async () => {
    await _fetchItem(id);

    window.print();
  };

  useEffect(() => {
    _api();
  }, []);

  const footMoney = (dataObj) => (
    <tr className="tr-table">
      <td
        style={{
          textAlign: "right",
          borderRight: "1px solid black",
          borderBottom: "1px solid black",
          color: "black",
          fontWeight: "bold",
          fontSize: 12,
        }}
      />
      <td
        className="td-table"
        style={{
          textAlign: "center",
          borderRight: "1px solid black",
          borderBottom: "1px solid black",
          color: "black",
          fontWeight: "bold",
          fontSize: 12,
        }}
      >
        TỔNG CỘNG:
      </td>
      <td
        style={{
          textAlign: "right",
          borderRight: "1px solid black",
          borderBottom: "1px solid black",
          color: "black",
          fontWeight: "bold",
          fontSize: 12,
        }}
      />
      <td
        style={{
          textAlign: "right",
          borderRight: "1px solid black",
          borderBottom: "1px solid black",
          color: "black",
          fontWeight: "bold",
          fontSize: 12,
        }}
      />
      <td
        style={{
          textAlign: "right",
          borderRight: "1px solid black",
          borderBottom: "1px solid black",
          color: "black",
          fontWeight: "bold",
          fontSize: 12,
        }}
      />
      <td
        style={{
          textAlign: "right",
          borderRight: "1px solid black",
          borderBottom: "1px solid black",
          color: "black",
          fontWeight: "bold",
          fontSize: 12,
        }}
      />
      <td
        style={{
          textAlign: "center",
          borderRight: "1px solid black",
          borderBottom: "1px solid black",
          color: "black",
          fontWeight: "bold",
          fontSize: 12,
        }}
      >
        {priceFormat(data.total_price)}
      </td>
    </tr>
  );

  return (
    <div>
      <div
        style={{
          width: 720,
          margin: "0px auto",
          padding: "24px 0px",
          // ...styledMargin,
        }}
        className="page-break-after"
      >
        <Skeleton loading={loading} active>
          <Row gutter={[0, 8]}>
            <Col span={24} style={{ textAlign: "center" }}>
              <StyledTitle level={3} style={{ fontWeight: "bold" }}>
                CÔNG TY CỔ PHẦN SHMART
              </StyledTitle>
            </Col>
            <Col span={24} style={{ textAlign: "center" }}>
              <StyledTitle level={4} style={{ fontSize: 16 }}>
                PHIẾU NHẬP KHO
              </StyledTitle>
            </Col>
            <Col span={24} style={{ textAlign: "center" }}>
              <StyledTitle level={4} style={{ fontSize: 14 }}>
                Số phiếu : {data.id}
              </StyledTitle>
            </Col>

            <Col span={24}>
              <div>
                <Row gutter={[0, 12]}>
                  <Col span={24}>
                    <div style={{ paddingLeft: 24 }}>
                      <Row gutter={[12, 0]} align="middle">
                        <Col flex="150px">
                          <StyledText>- Họ và tên người giao : </StyledText>
                        </Col>
                        <Col
                          flex="auto"
                          style={{ borderBottom: "1px dotted black" }}
                        >
                          <StyledText>{data.full_name}</StyledText>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ paddingLeft: 24 }}>
                      <Row gutter={[12, 0]} align="middle">
                        <Col flex="110px">
                          <StyledText>- Nhà cung cấp : </StyledText>
                        </Col>
                        <Col
                          flex="auto"
                          style={{ borderBottom: "1px dotted black" }}
                        >
                          <StyledText>{data.partner_name}</StyledText>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ paddingLeft: 24 }}>
                      <Row gutter={[12, 0]} align="middle">
                        <Col flex="130px">
                          <StyledText>- Mã nhà cung cấp : </StyledText>
                        </Col>
                        <Col
                          flex="auto"
                          style={{ borderBottom: "1px dotted black" }}
                        >
                          <StyledText>{data.import_for_warehouse}</StyledText>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                  <Col span={11}>
                    <div style={{ paddingLeft: 24 }}>
                      <Row gutter={[12, 0]} align="middle">
                        <Col flex="100px">
                          <StyledText>- Nhập tại kho : </StyledText>
                        </Col>
                        <Col
                          flex="auto"
                          style={{ borderBottom: "1px dotted black" }}
                        >
                          <StyledText>SHMart Gò Vấp</StyledText>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                  <Col span={13}>
                    <div style={{ paddingLeft: 24 }}>
                      <Row gutter={[14, 0]} align="middle">
                        <Col flex="90px">
                          <StyledText>- Địa điểm : </StyledText>
                        </Col>
                        <Col
                          flex="auto"
                          style={{ borderBottom: "1px dotted black" }}
                        >
                          <StyledText>
                            CityLand, 18 Phan Văn Trị, Gò Vấp, TPHCM
                          </StyledText>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>

            <Col span={24}>
              <StyledTableHTML
                childrenBody={bodyTableProduct(data.product_list)}
                isNoClass={true}
                styleTalbe={{
                  // maxWidth: '100%',
                  border: "1px solid black",
                }}
                isfoot={true}
                childrenFoot={footMoney(data)}
                childrenHeader={headerTableProduct(headerTable)}
              />
            </Col>
            <Col span={24}>
              <div>
                <Row gutter={[12, 0]} align="middle">
                  <Col flex="90px">
                    <StyledText>Tổng số tiền: </StyledText>
                  </Col>
                  <Col flex="auto" style={{ textAlign: "center" }}>
                    <div
                      style={{
                        width: "100%",
                        borderBottom: "1px dotted black",
                        height: 23,
                      }}
                    >
                      {/* <StyledText>{priceFormat(data.total_price)}</StyledText> */}
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col span={24} style={{ paddingTop: 0, paddingBottom: 0 }}>
              <Col span={14} offset={10} style={{ textAlign: "center" }}>
                <Space direction="vertical" size={12}>
                  <Space align="baseline">
                    <StyledText>Ngày</StyledText>
                    <StyledText>
                      {FormatterDay.dateFormatWithString(
                        new Date(data.created_date).getTime(),
                        "#DD#"
                      )}
                    </StyledText>
                    <StyledText style={{ fontStyle: "italic" }}>
                      Tháng
                    </StyledText>
                    <StyledText>
                      {FormatterDay.dateFormatWithString(
                        new Date(data.created_date).getTime(),
                        "#MM#"
                      )}
                    </StyledText>
                    <StyledText style={{ fontStyle: "italic" }}>Năm</StyledText>
                    <StyledText style={{ fontStyle: "italic" }}>
                      {FormatterDay.dateFormatWithString(
                        new Date(data.created_date).getTime(),
                        "#YYYY#"
                      )}
                    </StyledText>
                  </Space>
                </Space>
              </Col>
            </Col>
            <Col span={24}>
              <Fragment>
                <Row gutter={[12, 12]}>
                  <Col span={6} style={{ textAlign: "center" }}>
                    <Space direction="vertical" size={4}>
                      <StyledText strong>Người lập phiếu</StyledText>
                      <StyledText style={{ fontStyle: "italic" }}>
                        (Ký, họ tên)
                      </StyledText>
                    </Space>
                  </Col>
                  <Col span={6} style={{ textAlign: "center" }}>
                    <Space direction="vertical" size={4}>
                      <StyledText strong>Người giao hàng</StyledText>
                      <StyledText style={{ fontStyle: "italic" }}>
                        (Ký, họ tên)
                      </StyledText>
                    </Space>
                  </Col>
                  <Col span={6} style={{ textAlign: "center" }}>
                    <Space direction="vertical" size={4}>
                      <StyledText strong>Thủ kho</StyledText>
                      <StyledText style={{ fontStyle: "italic" }}>
                        (Ký, họ tên)
                      </StyledText>
                    </Space>
                  </Col>
                  <Col span={6} style={{ textAlign: "center" }}>
                    <Space direction="vertical" size={4}>
                      <StyledText strong>Kế toán trưởng</StyledText>
                      <StyledText style={{ fontStyle: "italic" }}>
                        (Hoặc bộ phận có nhu cầu nhập)
                      </StyledText>
                      <StyledText style={{ fontStyle: "italic" }}>
                        (Ký, họ tên)
                      </StyledText>
                    </Space>
                  </Col>
                </Row>
              </Fragment>
            </Col>
          </Row>
        </Skeleton>
      </div>
    </div>
  );
}
