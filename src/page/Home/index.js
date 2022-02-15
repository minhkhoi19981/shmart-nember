import {
  Button,
  Col,
  Drawer,
  Input,
  Row,
  Select,
  Space,
  Table,
  Tag,
  DatePicker,
  Form,
  message
} from 'antd'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ADD_ACCOUNT } from '../../store/reducers'
const { Option } = Select

function tagRender (props) {
  const { label, value } = props

  return (
    <Tag
      color={value.length > 5 ? 'geekblue' : 'green'}
      style={{ marginRight: 3 }}
    >
      {label}
    </Tag>
  )
}

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: text => <a>{text}</a>
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age'
  },
  {
    title: 'DateTime',
    dataIndex: 'dateTime',
    key: 'dateTime'
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address'
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: tags => (
      <>
        {tags.map(tag => {
          let color = tag.length > 5 ? 'geekblue' : 'green'
          if (tag === 'loser') {
            color = 'volcano'
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          )
        })}
      </>
    )
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <Space size='middle'>
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    )
  }
]

export default function Home () {
  const dataStore = useSelector(state => state)
  const dispatch = useDispatch()
  const { data } = dataStore
  const [visible, setVisible] = useState(false)
  const onClose = () => {
    setVisible(!visible)
  }
  return (
    <div>
      <Row gutter={[24, 24]} justify='end'>
        <Col>
          <Button
            type='primary'
            onClick={() => {
              onClose()
            }}
          >
            Tạo mới
          </Button>
        </Col>
        <Col span={24}>
          <Table dataSource={data} columns={columns} />
        </Col>
      </Row>
      <Drawer
        title='Tạo tài khoản mới'
        width={'100%'}
        onClose={() => onClose()}
        visible={visible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form
          layout='vertical'
          hideRequiredMark
          onFinish={values => {
            values.dateTime = Date.parse(values.dateTime)

            dispatch(ADD_ACCOUNT(values))
            message.success('Tạo thành công')
            onClose()
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name='name'
                label='Name'
                rules={[{ required: true, message: 'Please enter user name' }]}
              >
                <Input placeholder='Please enter user name' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='age'
                label='Age'
                rules={[{ required: true, message: 'Please enter age' }]}
              >
                <Input placeholder='Please enter age' />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name='dateTime'
                label='DateTime'
                rules={[
                  { required: true, message: 'Please choose the dateTime' }
                ]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  getPopupContainer={trigger => trigger.parentElement}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name='tags'
                label='Tags'
                rules={[{ required: true, message: 'Please choose the tags' }]}
              >
                <Select
                  placeholder='Please choose the tags'
                  mode='multiple'
                  tagRender={tagRender}
                >
                  <Option value='NICE'>NICE</Option>
                  <Option value='DEVELOPER'>DEVELOPER</Option>
                  <Option value='LOSER'>LOSER</Option>
                  <Option value='COOL'>COOL</Option>
                  <Option value='TEACHER'>TEACHER</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name='address'
                label='Address'
                rules={[
                  {
                    required: true,
                    message: 'please enter address'
                  }
                ]}
              >
                <Input.TextArea rows={4} placeholder='please enter address' />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <div
                style={{
                  textAlign: 'right'
                }}
              >
                <Space size={8}>
                  <Form.Item>
                    <Button onClick={() => onClose()}>Cancel</Button>
                  </Form.Item>
                  <Form.Item>
                    <Button type='primary' htmlType='submit'>
                      Submit
                    </Button>
                  </Form.Item>
                </Space>
              </div>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </div>
  )
}
