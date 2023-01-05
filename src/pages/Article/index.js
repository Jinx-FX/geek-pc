import { Link, useNavigate } from 'react-router-dom'
import { Card, Breadcrumb, Form, Button, Radio, DatePicker, Select, Table, Tag, Space, Popconfirm } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import 'moment/locale/zh-cn'
import locale from 'antd/es/date-picker/locale/zh_CN'

import img404 from '@/assets/error.png'
import { useEffect, useState } from 'react'
import { http } from '@/utils'

const { Option } = Select
const { RangePicker } = DatePicker

const Article = () => {
  // 管理频道数据
  const [channels, setchannels] = useState([])
  useEffect(() => {
    async function fetchChannels () {
      const res = await http.get('/channels')
      setchannels(res.data.channels)
    }
    fetchChannels()
  }, [])

  // 文章列表数据管理
  const [article, setArticleList] = useState({
    list: [],
    count: 0
  })

  // 参数管理
  const [params, setParams] = useState({
    page: 1,
    per_page: 10
  })

  // 发送接口请求
  // * 如果异步请求需要依赖一些数据的变化而重新执行，推荐把它写到 useEffect 内部
  // * 统一不抽离函数到外面，只要涉及到异步请求的函数，都放到其内部
  // * 本质区别：写到外面每次组件更新都会重新进行函数初始化，这本身就是一次性能损耗
  // * 而写到 useEffect 里面，只会在依赖项发生变化时，函数才会重新初始化；避免性能损耗
  useEffect(() => {
    async function fetchArticleList () {
      const res = await http.get('/mp/articles', { params })
      const { results, total_count } = res.data
      setArticleList({
        list: results,
        count: total_count
      })
    }
    fetchArticleList()
  }, [params])

  const onSearch = (values) => {
    const { status, channel_id, date } = values
    // 格式化表单数据
    const _params = {}
    // 格式化status,channel_id
    _params.status = status
    _params.channel_id = channel_id
    if (date) {
      _params.begin_pubdate = date[0].format('YYYY-MM-DD')
      _params.end_pubdate = date[1].format('YYYY-MM-DD')
    }
    // 修改params参数 触发接口再次发起
    // 对象的合并是一个整体覆盖，改了对象的整体引用
    setParams({ ...params, ..._params })
  }

  const delArticle = async (data) => {
    await http.delete(`/mp/articles/${data.id}`)
    // 更新列表
    setParams({
      ...params
    })
  }

  const navigate = useNavigate()
  const goPublish = (data) => {
    navigate(`/publish?id=${data.id}`)
  }

  const columns = [
    {
      title: '封面',
      dataIndex: 'cover',
      width: 120,
      render: cover => {
        return <img src={cover || img404} width={80} height={60} alt="" />
      }
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 220
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: data => <Tag color="green">审核通过</Tag>
    },
    {
      title: '发布时间',
      dataIndex: 'pubdate'
    },
    {
      title: '阅读数',
      dataIndex: 'read_count'
    },
    {
      title: '评论数',
      dataIndex: 'comment_count'
    },
    {
      title: '点赞数',
      dataIndex: 'like_count'
    },
    {
      title: '操作',
      render: data => {
        return (
          <Space size="middle">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => goPublish(data)}
            />
            <Popconfirm
              title="确认删除该条文章吗?"
              onConfirm={() => delArticle(data)}
              okText="确认"
              cancelText="取消"
            >
              <Button
                type="primary"
                danger
                shape="circle"
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Space>
        )
      }
    }
  ]

  const pageChange = (page) => {
    // 拿到当前页参数 修改params 引起接口更新
    setParams({
      ...params,
      page
    })
  }

  return (
    <div>
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/home">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>内容管理</Breadcrumb.Item>
          </Breadcrumb>
        }
        style={{ marginBottom: 20 }}
      >
        <Form
          onFinish={onSearch}
          initialValues={{ status: -1, channel_id: 0 }}
        >
          <Form.Item label="状态" name="status">
            <Radio.Group>
              <Radio value={-1}>全部</Radio>
              <Radio value={0}>草稿</Radio>
              <Radio value={1}>待审核</Radio>
              <Radio value={2}>审核通过</Radio>
              <Radio value={3}>审核失败</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="频道" name="channel_id">
            <Select
              placeholder="请选择文章频道"
              style={{ width: 120 }}
            >
              {channels.map(channel => (<Option key={channel.id} value={channel.id}>
                {channel.name}
              </Option>))}
            </Select>
          </Form.Item>

          <Form.Item label="日期" name="date">
            {/* 传入locale属性 控制中文显示*/}
            <RangePicker locale={locale}></RangePicker>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 80 }}>
              筛选
            </Button>
          </Form.Item>
        </Form>
      </Card>
      {/* {文章列表区域} */}
      <Card title={`根据筛选条件共查询到 ${article.count} 条结果：`}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={article.list}
          pagination={{
            showSizeChanger: false,
            total: article.count,
            current: params.page,
            onChange: pageChange
          }}
        />
      </Card>
    </div>
  )
}

export default Article