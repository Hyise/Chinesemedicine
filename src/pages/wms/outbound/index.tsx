import React, { useState } from 'react';
import { Table, Card, Button, Space, Tag, Input, Select, Row, Col, Drawer, Descriptions, Statistic, message, Typography, Modal, Form, DatePicker, InputNumber } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, EyeOutlined, RocketOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { OutboundOrder } from '@/types/global';
import dayjs from 'dayjs';
import { OUTBOUND_STATUS_MAP } from '@/types/global';

const { Option } = Select;
const { Text } = Typography;

const statusColorMap: Record<string, string> = {
  pending: 'default',
  confirmed: 'blue',
  shipped: 'cyan',
  completed: 'green',
};

const mockOutbound: OutboundOrder[] = [
  { id: 1, outboundNo: 'CK-2026042201', batchNo: 'SH-20260401', herbName: '金钗石斛', quantity: 200, unit: 'kg', warehouse: '赤水中心仓', location: 'A-01-03', customer: '华润三九医药股份有限公司-李总', outboundDate: '2026-04-20', status: 'completed', handler: '王调度', remark: '已送达，客户签收', createdAt: '2026-04-19 10:00:00' },
  { id: 2, outboundNo: 'CK-2026042202', batchNo: 'SH-20260315', herbName: '金钗石斛', quantity: 150, unit: 'kg', warehouse: '赤水中心仓', location: 'B-02-01', customer: '广州清平药材行-张经理', outboundDate: '2026-04-22', status: 'shipped', handler: '王调度', createdAt: '2026-04-21 09:00:00' },
  { id: 3, outboundNo: 'CK-2026042203', batchNo: 'SH-20260410', herbName: '金钗石斛', quantity: 300, unit: 'kg', warehouse: '赤水中心仓', location: 'A-02-05', customer: '安徽毫州药材市场-刘总', outboundDate: '2026-04-23', status: 'pending', createdAt: '2026-04-22 14:00:00' },
  { id: 4, outboundNo: 'CK-2026042204', batchNo: 'SH-20260301', herbName: '金钗石斛', quantity: 100, unit: 'kg', warehouse: '旺隆分仓', location: 'C-01-02', customer: '北京同仁堂-采购部', outboundDate: '2026-04-23', status: 'confirmed', handler: '赵调度', createdAt: '2026-04-22 16:00:00' },
];

const WmsOutbound: React.FC = () => {
  const [dataSource, setDataSource] = useState<OutboundOrder[]>(mockOutbound);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [detailDrawer, setDetailDrawer] = useState<{ open: boolean; record: OutboundOrder | null }>({ open: false, record: null });
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addForm] = Form.useForm();

  const pendingCount = dataSource.filter(d => d.status === 'pending').length;
  const shippedCount = dataSource.filter(d => d.status === 'shipped').length;
  const totalQty = dataSource.reduce((s, d) => s + d.quantity, 0);

  const columns: ColumnsType<OutboundOrder> = [
    { title: '出库单号', dataIndex: 'outboundNo', key: 'outboundNo', width: 140, fixed: 'left' as const, render: (no: string) => <Text style={{ fontFamily: 'monospace', color: '#6366f1', fontWeight: 600, fontSize: 12 }}>{no}</Text> },
    { title: '批次号', dataIndex: 'batchNo', key: 'batchNo', width: 130, render: (no: string) => <Text style={{ fontFamily: 'monospace', fontSize: 12 }}>{no}</Text> },
    { title: '药材', dataIndex: 'herbName', key: 'herbName', width: 90 },
    { title: '出库数量', dataIndex: 'quantity', key: 'quantity', width: 110, align: 'right' as const, render: (qty: number) => <Text strong style={{ color: '#ef4444' }}>{qty.toLocaleString()}</Text> },
    { title: '仓库', dataIndex: 'warehouse', key: 'warehouse', width: 110 },
    { title: '库位', dataIndex: 'location', key: 'location', width: 100 },
    { title: '客户', dataIndex: 'customer', key: 'customer', ellipsis: true },
    { title: '出库日期', dataIndex: 'outboundDate', key: 'outboundDate', width: 110 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100, render: (status: OutboundOrder['status']) => <Tag color={statusColorMap[status]}>{OUTBOUND_STATUS_MAP[status]}</Tag> },
    { title: '处理人', dataIndex: 'handler', key: 'handler', width: 90 },
    { title: '操作', key: 'action', width: 150, fixed: 'right' as const, render: (_, record) => (
      <Space size={4}>
        <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => setDetailDrawer({ open: true, record })}>详情</Button>
        {record.status === 'pending' && (
          <Button type="link" size="small" icon={<RocketOutlined />} style={{ color: '#f59e0b' }} onClick={() => {
            setDataSource(prev => prev.map(d => d.id === record.id ? { ...d, status: 'shipped' } : d));
            message.warning(`出库单 ${record.outboundNo} 已发货，请跟踪物流`);
          }}>发货</Button>
        )}
        {record.status === 'shipped' && (
          <Button type="primary" size="small" icon={<RocketOutlined />} onClick={() => {
            setDataSource(prev => prev.map(d => d.id === record.id ? { ...d, status: 'completed' } : d));
            message.success(`出库单 ${record.outboundNo} 已完成`);
          }}>确认签收</Button>
        )}
      </Space>
    )},
  ];

  const filteredData = dataSource.filter(item => {
    const kw = searchText.toLowerCase();
    const matchSearch = !kw || item.outboundNo.toLowerCase().includes(kw) || item.batchNo.toLowerCase().includes(kw) || item.herbName.toLowerCase().includes(kw) || item.customer.toLowerCase().includes(kw);
    const matchStatus = !statusFilter || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleAddOutbound = async () => {
    try {
      const values = await addForm.validateFields();
      const dateStr = dayjs().format('YYYYMMDD');
      const seq = String(dataSource.length + 1).padStart(2, '0');
      const newRecord: OutboundOrder = {
        id: Date.now(),
        outboundNo: `CK-${dateStr}${seq}`,
        batchNo: values.batchNo,
        herbName: values.herbName,
        quantity: values.quantity,
        unit: values.unit || 'kg',
        warehouse: values.warehouse,
        location: values.location,
        customer: values.customer,
        outboundDate: values.outboundDate?.format('YYYY-MM-DD') || dayjs().format('YYYY-MM-DD'),
        status: 'pending',
        remark: values.remark,
        createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      };
      setDataSource(prev => [newRecord, ...prev]);
      message.success(`出库单 ${newRecord.outboundNo} 创建成功`);
      setAddModalOpen(false);
      addForm.resetFields();
    } catch {}
  };

  const handleExport = () => {
    const headers = ['出库单号', '批次号', '药材', '出库数量', '单位', '仓库', '库位', '客户', '出库日期', '状态', '处理人', '创建时间'];
    const rows = filteredData.map(d => [
      d.outboundNo, d.batchNo, d.herbName, d.quantity, d.unit,
      d.warehouse, d.location, d.customer, d.outboundDate,
      OUTBOUND_STATUS_MAP[d.status], d.handler || '', d.createdAt,
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `出库记录_${dayjs().format('YYYYMMDD')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    message.success(`已导出 ${filteredData.length} 条出库记录`);
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 16 }}>
        <h3 className="page-title" style={{ margin: '0 0 4px' }}>出库管理</h3>
        <p className="page-desc">管理中药材出库订单、物流跟踪与客户发货</p>
      </div>

      {/* KPI */}
      <Row gutter={[12, 12]} style={{ marginBottom: 14 }}>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 10 }} styles={{ body: { padding: '12px 16px', textAlign: 'center' } }}>
            <Statistic title={<Text type="secondary" style={{ fontSize: 11 }}>出库单总数</Text>} value={dataSource.length} valueStyle={{ fontSize: 22, color: '#1677ff' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 10 }} styles={{ body: { padding: '12px 16px', textAlign: 'center' } }}>
            <Statistic title={<Text type="secondary" style={{ fontSize: 11 }}>待处理</Text>} value={pendingCount} valueStyle={{ fontSize: 22, color: '#f59e0b' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 10 }} styles={{ body: { padding: '12px 16px', textAlign: 'center' } }}>
            <Statistic title={<Text type="secondary" style={{ fontSize: 11 }}>已发货</Text>} value={shippedCount} valueStyle={{ fontSize: 22, color: '#06b6d4' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 10 }} styles={{ body: { padding: '12px 16px', textAlign: 'center' } }}>
            <Statistic title={<Text type="secondary" style={{ fontSize: 11 }}>出库总量</Text>} value={totalQty.toLocaleString()} suffix="kg" valueStyle={{ fontSize: 22, color: '#ef4444' }} />
          </Card>
        </Col>
      </Row>

      <Card bordered={false} style={{ borderRadius: 10, marginBottom: 14 }} styles={{ body: { padding: '12px 16px' } }}>
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Input prefix={<SearchOutlined />} placeholder="搜索单号/批次/药材/客户" value={searchText} onChange={e => setSearchText(e.target.value)} allowClear />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select placeholder="状态筛选" style={{ width: '100%' }} allowClear value={statusFilter} onChange={setStatusFilter}>
              <Option value="pending">待处理</Option><Option value="confirmed">已确认</Option><Option value="shipped">已发货</Option><Option value="completed">已完成</Option>
            </Select>
          </Col>
          <Col style={{ marginLeft: 'auto' }}>
            <Space>
              <Button icon={<ExportOutlined />} onClick={handleExport}>导出</Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => { addForm.resetFields(); setAddModalOpen(true); }}>新增出库</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card bordered={false} style={{ borderRadius: 8 }}>
        <Table columns={columns} dataSource={filteredData} rowKey="id" pagination={{ pageSize: 10, showSizeChanger: true, showTotal: t => `共 ${t} 条` }} scroll={{ x: 1400 }} size="middle" />
      </Card>

      {/* 详情抽屉 */}
      <Drawer
        title={<Space><EyeOutlined style={{ color: '#1677ff' }} />出库详情</Space>}
        placement="right" width={520}
        open={detailDrawer.open}
        onClose={() => setDetailDrawer({ open: false, record: null })}
      >
        {detailDrawer.record && (
          <>
            <div style={{ background: '#f8fafc', borderRadius: 8, padding: '12px 16px', marginBottom: 16 }}>
              <Row gutter={[16, 8]}>
                <Col span={12}><Text type="secondary" style={{ fontSize: 11 }}>出库单号</Text><div style={{ fontWeight: 700, fontSize: 15, color: '#6366f1', fontFamily: 'monospace' }}>{detailDrawer.record.outboundNo}</div></Col>
                <Col span={12}><Text type="secondary" style={{ fontSize: 11 }}>批次号</Text><div style={{ fontFamily: 'monospace', fontWeight: 600 }}>{detailDrawer.record.batchNo}</div></Col>
              </Row>
            </div>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="药材"><Text strong>{detailDrawer.record.herbName}</Text></Descriptions.Item>
              <Descriptions.Item label="出库数量"><Text strong style={{ color: '#ef4444' }}>{detailDrawer.record.quantity.toLocaleString()} {detailDrawer.record.unit}</Text></Descriptions.Item>
              <Descriptions.Item label="仓库">{detailDrawer.record.warehouse}</Descriptions.Item>
              <Descriptions.Item label="库位"><Tag color="blue">{detailDrawer.record.location}</Tag></Descriptions.Item>
              <Descriptions.Item label="客户" span={2}>{detailDrawer.record.customer}</Descriptions.Item>
              <Descriptions.Item label="出库日期">{detailDrawer.record.outboundDate}</Descriptions.Item>
              <Descriptions.Item label="处理人">{detailDrawer.record.handler || '—'}</Descriptions.Item>
              <Descriptions.Item label="状态"><Tag color={statusColorMap[detailDrawer.record.status]}>{OUTBOUND_STATUS_MAP[detailDrawer.record.status]}</Tag></Descriptions.Item>
              {detailDrawer.record.remark && <Descriptions.Item label="备注" span={2}>{detailDrawer.record.remark}</Descriptions.Item>}
              <Descriptions.Item label="创建时间" span={2}>{detailDrawer.record.createdAt}</Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Drawer>

      {/* 新增出库 Modal */}
      <Modal
        title={<Space><PlusOutlined style={{ color: '#1677ff' }} />新增出库</Space>}
        open={addModalOpen}
        onOk={handleAddOutbound}
        onCancel={() => { setAddModalOpen(false); addForm.resetFields(); }}
        okText="确认创建"
        cancelText="取消"
        width={640}
        destroyOnClose
      >
        <Form form={addForm} layout="vertical" style={{ marginTop: 16 }}>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="药材名称" name="herbName" rules={[{ required: true, message: '请输入药材名称' }]}>
                <Input placeholder="如：金钗石斛、鲜石斛" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="批次号" name="batchNo" rules={[{ required: true, message: '请输入批次号' }]}>
                <Input placeholder="如：HQ-20260401" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="出库数量" name="quantity" rules={[{ required: true, message: '请输入数量' }]}>
                <InputNumber min={0.1} style={{ width: '100%' }} addonAfter="kg" placeholder="0.00" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="出库日期" name="outboundDate" rules={[{ required: true, message: '请选择出库日期' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="仓库" name="warehouse" rules={[{ required: true, message: '请选择仓库' }]}>
                <Select placeholder="请选择仓库">
                  <Option value="赤水中心仓">赤水中心仓</Option>
                  <Option value="旺隆分仓">旺隆分仓</Option>
                  <Option value="丙安分仓">丙安分仓</Option>
                  <Option value="两河口分仓">两河口分仓</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="库位" name="location" rules={[{ required: true, message: '请输入库位' }]}>
                <Input placeholder="如：A-01-03" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="客户" name="customer" rules={[{ required: true, message: '请输入客户信息' }]}>
                <Input placeholder="如：华润三九医药股份有限公司-李总" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="备注" name="remark">
                <Input.TextArea rows={2} placeholder="备注信息（可选）" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default WmsOutbound;
