import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Col,
  Input,
  InputNumber,
  message,
  Modal,
  notification,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import Title from "antd/lib/typography/Title";
import { APIServiceV2, APIService, UserService } from "../../apis";
import { ISelect, ITable, ISelectV1 } from "../../common";
import FormatterDay from "../../utils/FormatterDay";
import { priceFormat } from "../../utils";
import {
  SyncOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  EditOutlined,
  ExclamationCircleFilled, PlusCircleOutlined
} from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";

const formatDay = "#hhh#:#mm#:#ss# #DD#/#MM#/#YYYY#";

const _renderStatusWallet = (status) => {
  if (status === "ACCEPT") {
    return (
      <Tag
        color="success"
        style={{ borderRadius: 12 }}
        icon={<CheckCircleOutlined />}
      >
        Đã nạp ví
      </Tag>
    );
  }
  if (status === "REJECT") {
    return (
      <Tag
        color="error"
        style={{ borderRadius: 12 }}
        icon={<CloseCircleOutlined />}
      >
        <Space size={0}>Từ chối nạp</Space>
      </Tag>
    );
  }
  return (
    <Tag
      color="processing"
      style={{ borderRadius: 12 }}
      icon={<SyncOutlined spin />}
    >
      <Space size={0}>Đang xử lý</Space>
    </Tag>
  );
};

const dataRequest = [
  {
    text: "Ví cá nhân",
    value: "ADD"
  }, {
    text: "Hóa đơn tiền điện",
    value: "ELECTRIC_BILL"
  },
  {
    text: "Hóa đơn điện thoại",
    value: "PHONE_BILL"
  }, {
    text: "Hóa đơn tiền nước",
    value: "WATER_BILL"
  },
]

export default function ListResquestWallet() {
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
    q: "",
  });
  const [listUser, setListUser] = useState([])
  const [loadingUser, setLoadingUser] = useState(true)
  const inputAmoutRef = useRef(null);
  const inputNoteRef = useRef(null);
  const [dataTable, setDataTable] = useState({
    created_date: "2020-11-22T18:24:01.297Z",
  });
  const [visible, setVisible] = useState(false);
  const [dataAdd, setDataAdd] = useState({
    detail: "",
    type: "ADD",
    amount: 0,
    user_id: UserService._getID()
  });

  const [loadingTable, setLoadingTable] = useState(true);

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      width: 50,
      align: "center",
      key: "stt",
    },
    {
      title: "Họ Tên",
      render: (obj) => <span>{obj?.user_id?.last_name}</span>,
    },
    {
      title: "Số điện thoại",
      render: (obj) => <span>{obj?.user_id?.primary_phone_number}</span>,
    },
    {
      title: "Email",
      render: (obj) => <span>{obj?.user_id?.email}</span>,
    },
    {
      title: "Ngày tạo nạp ví",
      dataIndex: "created_date",
      key: "created_date",
      render: (created_date) =>
        !created_date ? (
          "-"
        ) : (
          <Typography.Text>
            {FormatterDay.dateFormatWithString(
              new Date(created_date).getTime(),
              formatDay
            )}
          </Typography.Text>
        ),
    },
    {
      title: "Ghi chú",
      dataIndex: "detail",
      align: "detail",
    },
    {
      title: "Số tiền nạp",
      dataIndex: "amount",
      align: "right",
      key: "amount",
      render: (amount) => <span>{priceFormat(amount) + " VNĐ"}</span>,
    },

    {
      title: "Trạng thái",
      align: "center",

      width: 150,
      dataIndex: "status",
      key: "status",
      render: (status) => _renderStatusWallet(status),
    },
    {
      align: "center",
      width: 50,
      render: (obj) =>
        obj.status === "PENDING" && (
          <Space>
            <span>{priceFormat(obj.cashback_percent)}</span>

            <EditOutlined
              style={{
                cursor: "pointer",
              }}
              onClick={() => {
                showConfirm(
                  { amount: obj.amount, detail: obj.detail },
                  obj._id
                );
              }}
            />
          </Space>
        ),
    },
  ];

  const _fetchAPIListWallet = async (filterTable) => {
    try {
      const data = await APIServiceV2._getListWallet(filterTable);
      data._Array.map((item, index) => {
        item.stt = (filter.page - 1) * filter.limit + index + 1;
      });

      setDataTable({ ...data });
      setLoadingTable(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingTable(false);
    }
  };

  const hideModal = () => {
    setVisible(!visible);
  };


  function showConfirm(obj, id) {
    let statusAmout = "ACCEPT";

    return Modal.confirm({
      title: "CHỈNH SỬA YÊU CẦU",
      icon: <ExclamationCircleFilled />,
      content: (
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <span>Số tiền :</span>
            <InputNumber
              defaultValue={obj.amount}
              style={{ width: "100%" }}
              min={0}
              key={`${id}_amout`}
              ref={inputAmoutRef}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Col>
          <Col span={24}>
            <span>Ghi chú :</span>
            <TextArea
              key={`${id}_note`}
              defaultValue={obj.detail}
              style={{ width: "100%" }}
              ref={inputNoteRef}
            />
          </Col>
          <Col span={24}>
            <span>Trạng thái:</span>
            <br />
            <ISelect
              style={{ width: "100%" }}
              defaultValue={statusAmout}
              dataOption={[
                {
                  value: "ACCEPT",
                  text: "ACCEPT",
                },
                {
                  value: "REJECT",
                  text: "REJECT",
                },
              ]}
              onChange={(key) => {
                statusAmout = key;
              }}
              keyName="text"
              valueName="value"
              placeholder="Vui lòng chọn trạng thái"
            />
          </Col>
        </Row>
      ),
      async onOk() {
        try {
          setLoadingTable(true);
          const dataAdd = {
            status: statusAmout,
            amount: Number(
              inputAmoutRef.current.value.replace(/\$\s?|(,*)/g, "")
            ),
            detail: inputNoteRef.current.resizableTextArea.textArea.value,
          };
          const data = await APIServiceV2._postRequestWallet(dataAdd, id);
          if (data.code === "Fail") {
            return openNotificationWithIcon(data.message);
          }
          await _fetchAPIListWallet(filter);
          message.success("Chỉnh sửa thành công.");
        } catch (error) {
        } finally {
          setLoadingTable(false);
        }
      },
      okText: "Lưu",
      cancelText: "Hủy",
      onCancel() {
        console.log("Cancel");
      },
    });
  }

  const openNotificationWithIcon = (title) => {
    notification.error({
      message: "Thông báo",
      description: title,
      placement: "topLeft",
    });
  };


  useEffect(() => {
    _fetchAPIListAccount();
  }, []);

  const _fetchAPIListAccount = async () => {
    try {
      const data = await APIService._getListAccount(({
        page: 1,
        limit: 100
      }));
      const dataSelect = data._Array.map(item => {
        const value = item.id;
        const text = `${item.last_name} - ${item.email}`
        return { value, text }
      })

      setListUser([...dataSelect]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    _fetchAPIListWallet(filter);
  }, [filter]);

  return (
    <div>
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Row align="middle">
            <Col span={12}>
              <Title level={4}>DANH SÁCH YÊU CẦU NẠP VÍ</Title>
            </Col>
            <Col span={12} style={{ textAlign: "right" }}>
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={hideModal}
              >
                Tạo mới
              </Button>
            </Col>
          </Row>
        </Col>

        <Col span={12}>
          <Typography.Text>
            Tìm thấy {dataTable.TotalCount} tài liệu yêu cầu
          </Typography.Text>
        </Col>
        <Col span={12} style={{ textAlign: "right" }}>
          <Space>
            <span>Tìm kiếm: </span>
            <Input
              placeholder="Tìm kiếm theo tên và số điện thoại."
              style={{ minWidth: 260 }}
              onPressEnter={(e) => {
                let keysearch = e.target.value;
                setLoadingTable(true);
                setFilter({
                  ...filter,
                  q: keysearch,
                  page: 1,
                });
              }}
            />
          </Space>
        </Col>
        <Col span={24}>
          <ITable
            dataSource={dataTable._Array}
            columns={columns}
            loading={loadingTable}
            totalCount={dataTable.TotalCount}
            rowKey="id"
            onChange={(pagination) => {
              setLoadingTable(true);
              setFilter({
                ...filter,
                page: pagination.current,
                limit: pagination.pageSize,
              });
            }}
            pageSize={filter.limit}
          />
        </Col>
      </Row>
      <Modal
        title="NẠP VÍ"
        visible={visible}
        centered={true}
        confirmLoading={loadingTable}
        onOk={async () => {
          try {
            if (
              !dataAdd.amount
            ) {
              return message.error("Số tiền nạp phải lớn hơn 0.");
            }
            setLoadingTable(true);
            await APIServiceV2._postCreateRequest(dataAdd);
            setDataAdd({
              detail: "",
              type: "ADD",
              amount: 0,
              user_id: UserService._getID()
            });
            hideModal();
            await _fetchAPIListWallet(filter);
            message.success("Gửi yêu cầu thành công.");
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
            <p>
              <strong>Người nạp</strong>
            </p>
            <ISelectV1
              showSearch={true}
              style={{ width: "100%" }}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={(key) => {
                setDataAdd({ ...dataAdd, user_id: key });
              }}
              value={dataAdd.user_id}
              dataOption={listUser}
              keyName="value"
              valueName="text"
              placeholder="Người nạp"
            />
          </Col>
          <Col span={24}>
            <p>
              <strong>Loại ví</strong>
            </p>
            <ISelectV1
              onChange={(key) => {
                setDataAdd({ ...dataAdd, type: key });
              }}
              value={dataAdd.type}
              style={{ width: "100%" }}
              dataOption={dataRequest}
              keyName="value"
              valueName="text"
              placeholder="Loại"
            />
          </Col>
          <Col span={24}>
            <p>
              <strong>Tiền nạp</strong>
            </p>
            <InputNumber
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              min={0}
              style={{ width: "100%" }}
              onChange={(value) => {
                setDataAdd({ ...dataAdd, amount: value });
              }}
              value={dataAdd.amount}
            />
          </Col>
          <Col span={24}>
            <p>
              <strong>Ghi chú</strong>
            </p>
            <TextArea
              style={{ width: "100%" }}
              onChange={(e) => {
                setDataAdd({ ...dataAdd, detail: e.target.value });
              }}
              placeholder="Nhập ghi chú"
              rows={3}
              value={dataAdd.detail}
            />
          </Col>
        </Row>
      </Modal>

    </div>
  );
}
