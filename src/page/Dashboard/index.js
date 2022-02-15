import AmCharts from "@amcharts/amcharts3-react";
import { Row, Col, Typography, DatePicker, Space, Card } from "antd";
import React, { Fragment, useState, useEffect } from "react";
import { APIServiceV2 } from "../../apis";
import FormatterDay from "../../utils/FormatterDay";
import moment from "moment";
import {
  FilterOutlined,
} from "@ant-design/icons";


const NewDate = new Date();
const DateStart = new Date();
let startValue = DateStart.setMonth(DateStart.getMonth() - 1);
let endValue = NewDate.setHours(23, 59, 59, 999);
const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";

function compare(a, b) {
  if (new Date(a.date).getTime() < new Date(b.date).getTime()) {
    return -1;
  }
  if (new Date(a.date).getTime() > new Date(b.date).getTime()) {
    return 1;
  }
  return 0;
}

const Dashboard = () => {
  const [config, setConfig] = useState({
    type: "serial",
    theme: "light",
    marginRight: 40,
    marginLeft: 40,
    autoMarginOffset: 20,
    mouseWheelZoomEnabled: true,
    dataDateFormat: "YYYY-MM-DD",
    valueAxes: [
      {
        id: "v1",
        axisAlpha: 0,
        position: "left",
        ignoreAxisWidth: true,
      },
    ],
    balloon: {
      borderThickness: 1,
      shadowAlpha: 0,
    },
    graphs: [
      {
        id: "g1",
        balloon: {
          drop: true,
          adjustBorderColor: false,
          color: "#ffffff",
        },
        bullet: "round",
        bulletBorderAlpha: 1,
        bulletColor: "#FFFFFF",
        bulletSize: 5,
        hideBulletsCount: 50,
        lineThickness: 2,
        title: "red line",
        useLineColorForBulletBorder: true,
        valueField: "value",
        balloonText: "<span style='font-size:18px;'>[[value]]</span>",
      },
    ],
    chartScrollbar: {
      graph: "g1",
      oppositeAxis: false,
      offset: 30,
      scrollbarHeight: 80,
      backgroundAlpha: 0,
      selectedBackgroundAlpha: 0.1,
      selectedBackgroundColor: "#888888",
      graphFillAlpha: 0,
      graphLineAlpha: 0.5,
      selectedGraphFillAlpha: 0,
      selectedGraphLineAlpha: 1,
      autoGridCount: true,
      color: "#AAAAAA",
    },
    chartCursor: {
      pan: true,
      valueLineEnabled: true,
      valueLineBalloonEnabled: true,
      cursorAlpha: 1,
      cursorColor: "#258cbb",
      limitToGraph: "g1",
      valueLineAlpha: 0.2,
      valueZoomable: true,
    },
    valueScrollbar: {
      oppositeAxis: false,
      offset: 50,
      scrollbarHeight: 10,
    },
    categoryField: "date",
    categoryAxis: {
      parseDates: true,
      dashLength: 1,
      minorGridEnabled: true,
    },
    export: {
      enabled: true,
    },
    dataProvider: [],
  });

  const [config2, setConfig2] = useState({
    type: "serial",
    theme: "light",
    marginRight: 40,
    marginLeft: 40,
    autoMarginOffset: 20,
    mouseWheelZoomEnabled: true,
    dataDateFormat: "YYYY-MM-DD",
    valueAxes: [
      {
        id: "v1",
        axisAlpha: 0,
        position: "left",
        ignoreAxisWidth: true,
      },
    ],
    balloon: {
      borderThickness: 1,
      shadowAlpha: 0,
    },
    graphs: [
      {
        id: "g1",
        balloon: {
          drop: true,
          adjustBorderColor: false,
          color: "#ffffff",
        },
        bullet: "round",
        bulletBorderAlpha: 1,
        bulletColor: "#FFFFFF",
        bulletSize: 5,
        hideBulletsCount: 50,
        lineThickness: 2,
        title: "red line",
        useLineColorForBulletBorder: true,
        valueField: "value",
        balloonText: "<span style='font-size:18px;'>[[value]]</span>",
      },
    ],
    chartScrollbar: {
      graph: "g1",
      oppositeAxis: false,
      offset: 30,
      scrollbarHeight: 80,
      backgroundAlpha: 0,
      selectedBackgroundAlpha: 0.1,
      selectedBackgroundColor: "#888888",
      graphFillAlpha: 0,
      graphLineAlpha: 0.5,
      selectedGraphFillAlpha: 0,
      selectedGraphLineAlpha: 1,
      autoGridCount: true,
      color: "#AAAAAA",
    },
    chartCursor: {
      pan: true,
      valueLineEnabled: true,
      valueLineBalloonEnabled: true,
      cursorAlpha: 1,
      cursorColor: "#258cbb",
      limitToGraph: "g1",
      valueLineAlpha: 0.2,
      valueZoomable: true,
    },
    valueScrollbar: {
      oppositeAxis: false,
      offset: 50,
      scrollbarHeight: 10,
    },
    categoryField: "date",
    categoryAxis: {
      parseDates: true,
      dashLength: 1,
      minorGridEnabled: true,
    },
    export: {
      enabled: true,
    },
    dataProvider: [],
  });

  const [loading, setLoading] = useState(true)

  const [filter, setFilter] = useState({
    start_date: FormatterDay.dateFormatWithString(
      startValue,
      "#YYYY#-#MM#-#DD#"
    ),
    end_date: FormatterDay.dateFormatWithString(endValue, "#YYYY#-#MM#-#DD#")
  })


  useEffect(() => {
    _fetchAPI(filter)
  }, [filter])

  const _fetchAPI = async (filterTable) => {
    try {
      const data = await APIServiceV2._getStatisticOrder(filterTable);
      data.group_date.sort(compare)
      const dataDashboard = data.group_date.map((item, index) => {
        const date = item.date
        const value = item.total_order
        return { date, value }
      });
      const dataDashboard2 = data.group_date.map((item, index) => {
        const date = item.date
        const value = item.total_price
        return { date, value }
      });
      setConfig({
        ...config, dataProvider: [...dataDashboard]
      })
      setConfig2({
        ...config, dataProvider: [...dataDashboard2]
      })
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Fragment>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Typography.Title level={4}>THỐNG KÊ ĐƠN HÀNG</Typography.Title>
        </Col>
        <Col span={24}>
          <Space direction="vertical">
            <Space>
              <FilterOutlined />
              Tìm kiếm
            </Space>
            <Space>
              <RangePicker
                defaultValue={[
                  moment(filter.start_date, dateFormat),
                  moment(filter.end_date, dateFormat),
                ]}
                onChange={(date, dateString) => {
                  setLoading(true);
                  setFilter({
                    start_date: dateString[0],
                    end_date: dateString[1],
                  });
                }}
              />
            </Space>
          </Space>
        </Col>

        <Col span={24}>
          <Card loading={loading} title="Số lượng đơn hàng" style={{ boxShadow: "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)" }}>
            <AmCharts.React
              style={{ width: "100%", height: 500 }}
              options={config}
            />
          </Card>
        </Col>
        <Col span={24} >
          <Card loading={loading} title="Tổng doanh thu đơn hàng" style={{ marginBottom: 24, boxShadow: "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)" }}>
            <AmCharts.React
              style={{ width: "100%", height: 500 }}
              options={config2}
            />
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default Dashboard;
