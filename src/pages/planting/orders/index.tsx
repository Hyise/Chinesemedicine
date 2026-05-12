import React, { useState, useMemo } from 'react';
import {
  Card, Table, Button, Space, Tag, Input, Typography, Tabs,
  Row, Col, Statistic, Modal, Descriptions, Divider, Badge,
  message, Drawer,
} from 'antd';
import {
  SearchOutlined, PlusOutlined, ExportOutlined, EyeOutlined,
  EditOutlined, ClockCircleOutlined, CheckCircleOutlined,
  SyncOutlined, UserOutlined, EnvironmentOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  orders,
  type OrderPlanting,
  ORDER_STATUS_MAP,
  ORDER_STATUS_COLOR_MAP,
} from '../mockData';
import PageHeading from '../../../components/PageHeading';

const { Text } = Typography;

// ============================================================
// 类型映射
// ============================================================

const orderTypeMap: Record<OrderPlanting['type'], { label: string; color: string }> = {
  customGarden: { label: '定制药园', color: 'green' },
  trustManagement: { label: '种植托管', color: 'blue' },
  unifiedControl: { label: '统防统治', color: 'orange' },
};

// ============================================================
// 订单详情抽屉
// ============================================================

interface OrderDetailDrawerProps {
  order: OrderPlanting | null;
  open: boolean;
  onClose: () => void;
}

const OrderDetailDrawer: React.FC<OrderDetailDrawerProps> = ({ order, open, onClose }) => {
  if (!order) return null;

  return (
    <Drawer
      title={
        <Space>
          <EyeOutlined style={{ color: '#1677ff' }} />
          订单详情
        </Space>
      }
      placement="right"
      width={560}
      open={open}
      onClose={onClose}
      styles={{ body: { padding: '16px 20px' } }}
      extra={
        <Tag color={ORDER_STATUS_COLOR_MAP[order.status]}>
          {ORDER_STATUS_MAP[order.status]}
        </Tag>
      }
    >
      {/* 订单标识 */}
      <div style={{ background: '#f8fafc', borderRadius: 8, padding: '12px 16px', marginBottom: 16 }}>
        <Row gutter={[16, 8]}>
          <Col span={12}>
            <Text type="secondary" style={{ fontSize: 11 }}>订单编号</Text>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#1677ff' }}>
              {order.orderNo || order.orderNoDisplay}
            </div>
          </Col>
          <Col span={12}>
            <Text type="secondary" style={{ fontSize: 11 }}>订单类型</Text>
            <div style={{ marginTop: 2 }}>
              <Tag color={orderTypeMap[order.type].color}>{orderTypeMap[order.type].label}</Tag>
            </div>
          </Col>
        </Row>
      </div>

      {/* 客户信息 */}
      <Divider orientation="left" plain>
        <Text style={{ fontSize: 12, color: '#8c8c8c' }}>客户信息</Text>
      </Divider>
      <Descriptions column={2} size="small" labelStyle={{ color: '#8c8c8c', fontSize: 12 }}>
        <Descriptions.Item label="客户名称">{order.customerName}</Descriptions.Item>
        <Descriptions.Item label="客户类型">
          <Tag color={order.customerType === 'enterprise' ? 'blue' : 'green'} style={{ fontSize: 11 }}>
            {order.customerType === 'enterprise' ? '企业' : '个人'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="联系人">{order.contactPerson}</Descriptions.Item>
        <Descriptions.Item label="联系电话">{order.contactPhone}</Descriptions.Item>
      </Descriptions>

      {/* 订单内容 */}
      <Divider orientation="left" plain>
        <Text style={{ fontSize: 12, color: '#8c8c8c' }}>订单内容</Text>
      </Divider>
      <Descriptions column={2} size="small" labelStyle={{ color: '#8c8c8c', fontSize: 12 }}>
        <Descriptions.Item label="关联基地">{order.baseName}</Descriptions.Item>
        <Descriptions.Item label="签约日期">{order.signDate}</Descriptions.Item>
        <Descriptions.Item label="认购面积">{order.plantingArea.toLocaleString()} 亩</Descriptions.Item>
        <Descriptions.Item label="合同金额">
          <Text strong style={{ color: '#f59e0b' }}>
            {order.contractAmount.toLocaleString()} 元
          </Text>
        </Descriptions.Item>
        <Descriptions.Item label="当前阶段" span={2}>
          <Badge status={
            order.status === 'completed' ? 'success' :
            order.status === 'inProgress' ? 'processing' : 'default'
          } />
          {order.growthStage}
        </Descriptions.Item>
        <Descriptions.Item label="预计采收">{order.estimatedHarvest}</Descriptions.Item>
        <Descriptions.Item label="当前状态" span={2}>
          <Tag color={ORDER_STATUS_COLOR_MAP[order.status]}>{ORDER_STATUS_MAP[order.status]}</Tag>
        </Descriptions.Item>
        {order.remark && (
          <Descriptions.Item label="备注说明" span={2}>
            <Text type="secondary">{order.remark}</Text>
          </Descriptions.Item>
        )}
      </Descriptions>
    </Drawer>
  );
};

// ============================================================
// 主页面
// ============================================================

const PlantingOrders: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [activeTab, setActiveTab] = useState<string>('customGarden');
  const [selectedOrder, setSelectedOrder] = useState<OrderPlanting | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [ordersData, setOrdersData] = useState<OrderPlanting[]>(orders);

  const tabItems = [
    {
      key: 'customGarden',
      label: (
        <Space>
          <UserOutlined />
          定制药园订单
          <Badge count={ordersData.filter(o => o.type === 'customGarden').length} style={{ backgroundColor: '#10b981' }} />
        </Space>
      ),
    },
    {
      key: 'trustManagement',
      label: (
        <Space>
          <SyncOutlined />
          种植托管协议
          <Badge count={ordersData.filter(o => o.type === 'trustManagement').length} style={{ backgroundColor: '#1677ff' }} />
        </Space>
      ),
    },
    {
      key: 'unifiedControl',
      label: (
        <Space>
          <ClockCircleOutlined />
          统防统治服务
          <Badge count={ordersData.filter(o => o.type === 'unifiedControl').length} style={{ backgroundColor: '#f59e0b' }} />
        </Space>
      ),
    },
  ];

  const filtered = useMemo(() => {
    return ordersData
      .filter(o => o.type === activeTab)
      .filter(o => {
        if (!keyword) return true;
        const kw = keyword.toLowerCase();
        return (
          (o.orderNo || '').toLowerCase().includes(kw) ||
          o.customerName.toLowerCase().includes(kw) ||
          o.baseName.toLowerCase().includes(kw) ||
          o.contactPerson.toLowerCase().includes(kw)
        );
      });
  }, [ordersData, activeTab, keyword]);

  const columns: ColumnsType<OrderPlanting> = [
    {
      title: '订单编号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 150,
      render: (no, record) => (
        <Text style={{ fontSize: 12, color: '#1677ff', fontWeight: 600 }}>
          {no || (record as OrderPlanting & { orderNoDisplay?: string }).orderNoDisplay}
        </Text>
      ),
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 180,
      ellipsis: true,
      render: (name, record) => (
        <div>
          <Text strong style={{ fontSize: 13 }}>{name}</Text>
          <div>
            <Tag color={record.customerType === 'enterprise' ? 'blue' : 'green'} style={{ fontSize: 10, marginTop: 2 }}>
              {record.customerType === 'enterprise' ? '企业' : '个人'}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: '关联地块',
      dataIndex: 'baseName',
      key: 'baseName',
      width: 160,
      ellipsis: true,
      render: (name) => (
        <Space>
          <EnvironmentOutlined style={{ color: '#1677ff', fontSize: 11 }} />
          <Text style={{ fontSize: 12 }}>{name}</Text>
        </Space>
      ),
    },
    {
      title: '面积（亩）',
      dataIndex: 'plantingArea',
      key: 'plantingArea',
      width: 100,
      align: 'right',
      render: (v) => v.toLocaleString(),
    },
    {
      title: '合同金额',
      dataIndex: 'contractAmount',
      key: 'contractAmount',
      width: 120,
      align: 'right',
      render: (v) => <Text strong style={{ color: '#f59e0b' }}>{v.toLocaleString()}</Text>,
    },
    {
      title: '当前阶段',
      dataIndex: 'growthStage',
      key: 'growthStage',
      width: 140,
      ellipsis: true,
      render: (stage) => <Text style={{ fontSize: 12 }}>{stage}</Text>,
    },
    {
      title: '预计采收',
      dataIndex: 'estimatedHarvest',
      key: 'estimatedHarvest',
      width: 110,
      render: (v) => <Text style={{ fontSize: 12 }}>{v}</Text>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (status: OrderPlanting['status']) => (
        <Tag color={ORDER_STATUS_COLOR_MAP[status]} icon={
          status === 'completed' ? <CheckCircleOutlined /> :
          status === 'inProgress' ? <SyncOutlined /> :
          status === 'signed' ? <ClockCircleOutlined /> : undefined
        }>
          {ORDER_STATUS_MAP[status]}
        </Tag>
      ),
      filters: [
        { text: '待签约', value: 'pending' },
        { text: '已签约', value: 'signed' },
        { text: '履约中', value: 'inProgress' },
        { text: '已交付', value: 'completed' },
        { text: '已取消', value: 'cancelled' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '操作',
      key: 'action',
      width: 130,
      fixed: 'right',
      render: (_, record) => (
        <Space size={4}>
          <Button type="link" size="small" icon={<EyeOutlined />}
            onClick={() => { setSelectedOrder(record); setDrawerOpen(true); }}>详情</Button>
          <Button type="link" size="small" icon={<EditOutlined />}
            onClick={() => message.info(`编辑订单 ${record.orderNo || (record as any).orderNoDisplay} 功能开发中`)}>编辑</Button>
          <Button type="link" size="small" icon={<ClockCircleOutlined />} danger
            onClick={() => {
              Modal.confirm({
                title: '确认删除',
                content: `确定要删除订单「${record.customerName}」吗？`,
                okText: '确认删除',
                okButtonProps: { danger: true },
                onOk: () => {
                  setOrdersData(prev => prev.filter(o => o.id !== record.id));
                  message.success('订单已删除');
                },
              });
            }}>删除</Button>
        </Space>
      ),
    },
  ];

  const calcStats = (type: string) => {
    const list = ordersData.filter(o => o.type === type);
    const inProgress = list.filter(o => o.status === 'inProgress').length;
    const totalAmount = list.reduce((s, o) => s + o.contractAmount, 0);
    const totalArea = list.reduce((s, o) => s + o.plantingArea, 0);
    return { total: list.length, inProgress, totalAmount, totalArea };
  };

  const currentStats = useMemo(() => calcStats(activeTab), [ordersData, activeTab]);

  return (
    <div style={{ padding: 0 }} className="page-container page-enter">
      {/* 页面标题 */}
      <PageHeading
        eyebrow="种植服务管理系统"
        title="订单种植与托管服务"
        description="管理定制药园、种植托管协议及统防统治服务的全流程订单"
        accentColor="#52c41a"
        gradientFrom="#1d3a1a"
        gradientMid="#2d4a1a"
        gradientTo="#3d5a2a"
        padding="32px 32px 28px"
      />

      {/* 总体统计 */}
      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card size="small" style={{ borderRadius: 8, textAlign: 'center' }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: 11 }}>订单总数</Text>}
              value={ordersData.length}
              valueStyle={{ fontSize: 22, color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" style={{ borderRadius: 8, textAlign: 'center' }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: 11 }}>履约中</Text>}
              value={orders.filter(o => o.status === 'inProgress').length}
              valueStyle={{ fontSize: 22, color: '#10b981' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" style={{ borderRadius: 8, textAlign: 'center' }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: 11 }}>合同总金额</Text>}
              value={orders.reduce((s, o) => s + o.contractAmount, 0)}
              suffix="元"
              valueStyle={{ fontSize: 20, color: '#f59e0b' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" style={{ borderRadius: 8, textAlign: 'center' }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: 11 }}>服务总面积</Text>}
              value={orders.reduce((s, o) => s + o.plantingArea, 0)}
              suffix="亩"
              valueStyle={{ fontSize: 22, color: '#8b5cf6' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 工具栏 */}
      <Card size="small" style={{ borderRadius: 8, marginBottom: 12 }} styles={{ body: { padding: '12px 16px' } }}>
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} sm={12} md={10}>
            <Input
              prefix={<SearchOutlined />}
              placeholder="搜索订单号、客户名称、基地或联系人"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              allowClear
            />
          </Col>
          <Col style={{ marginLeft: 'auto' }}>
            <Space>
              <Button icon={<ExportOutlined />}>导出</Button>
              <Button type="primary" icon={<PlusOutlined />}>新建订单</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 类型统计（Tab 内） */}
      <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
        <Col span={6}>
          <Card size="small" style={{ borderRadius: 8, textAlign: 'center', border: '1px solid #e6f4ff' }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: 11 }}>{orderTypeMap[activeTab as OrderPlanting['type']].label}总数</Text>}
              value={currentStats.total}
              valueStyle={{ fontSize: 20, color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" style={{ borderRadius: 8, textAlign: 'center', border: '1px solid #f6ffed' }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: 11 }}>履约中</Text>}
              value={currentStats.inProgress}
              valueStyle={{ fontSize: 20, color: '#10b981' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" style={{ borderRadius: 8, textAlign: 'center', border: '1px solid #fffbe6' }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: 11 }}>合同金额合计</Text>}
              value={(currentStats.totalAmount / 10000).toFixed(1)}
              suffix="万元"
              valueStyle={{ fontSize: 20, color: '#f59e0b' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" style={{ borderRadius: 8, textAlign: 'center', border: '1px solid #f9f0ff' }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: 11 }}>服务面积合计</Text>}
              value={currentStats.totalArea.toLocaleString()}
              suffix="亩"
              valueStyle={{ fontSize: 20, color: '#8b5cf6' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 标签页切换 */}
      <Card style={{ borderRadius: 8 }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          size="small"
        />

        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          pagination={{ pageSize: 8, showSizeChanger: true, showTotal: (t) => `共 ${t} 条订单` }}
          size="small"
          scroll={{ x: 1200 }}
          rowHoverable
        />
      </Card>

      {/* 订单详情抽屉 */}
      <OrderDetailDrawer
        order={selectedOrder}
        open={drawerOpen}
        onClose={() => { setDrawerOpen(false); setSelectedOrder(null); }}
      />
    </div>
  );
};

export default PlantingOrders;
