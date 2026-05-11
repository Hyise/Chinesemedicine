import React, { useState } from 'react';
import { Table, Card, Button, Space, Tag, Input, Select, Row, Col, Drawer, Descriptions, Statistic, message, Typography, Modal, Form, DatePicker, InputNumber } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, CheckCircleOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { InboundOrder } from '@/types/global';
import dayjs from 'dayjs';
import { INBOUND_STATUS_MAP } from '@/types/global';

const { Option } = Select;
const { Text } = Typography;

const statusColorMap: Record<string, string> = {
  pending: 'default',
  confirmed: 'blue',
  completed: 'green',
  cancelled: 'red',
};

const mockInbound: InboundOrder[] = [
  { id: 1, inboundNo: 'RK-2026042201', batchNo: 'SH-20260401', herbName: '金钗石斛', quantity: 1200, unit: 'kg', warehouse: '赤水中心仓', location: 'A-01-03', supplier: '官渡镇石斛林下经济示范园', inboundDate: '2026-04-01', status: 'completed', inspector: '刘师傅', remark: '质检合格，已完成入库', createdAt: '2026-04-01 10:00:00' },
  { id: 2, inboundNo: 'RK-2026042202', batchNo: 'SH-20260315', herbName: '金钗石斛', quantity: 800, unit: 'kg', warehouse: '赤水中心仓', location: 'B-02-01', supplier: '长期镇石斛产业园', inboundDate: '2026-03-15', status: 'completed', inspector: '陈师傅', remark: '符合药典标准', createdAt: '2026-03-15 14:00:00' },
  { id: 3, inboundNo: 'RK-2026042203', batchNo: 'SH-20260410', herbName: '金钗石斛', quantity: 500, unit: 'kg', warehouse: '赤水中心仓', location: 'A-02-05', supplier: '大同镇石斛示范园', inboundDate: '2026-04-10', status: 'confirmed', inspector: '刘师傅', createdAt: '2026-04-10 11:00:00' },
  { id: 4, inboundNo: 'RK-2026042204', batchNo: 'SH-20260420', herbName: '金钗石斛', quantity: 200, unit: 'kg', warehouse: '旺隆分仓', location: 'C-01-02', supplier: '旺隆镇石斛种植基地', inboundDate: '2026-04-20', status: 'pending', createdAt: '2026-04-20 09:00:00' },
];

const WmsInbound: React.FC = () => {
  const [dataSource, setDataSource] = useState<InboundOrder[]>(mockInbound);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [detailDrawer, setDetailDrawer] = useState<{ open: boolean; record: InboundOrder | null }>({ open: false, record: null });
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addForm] = Form.useForm();

  const pendingCount = dataSource.filter(d => d.status === 'pending').length;
  const completedCount = dataSource.filter(d => d.status === 'completed').length;
  const totalQty = dataSource.reduce((s, d) => s + d.quantity, 0);

  const columns: ColumnsType<InboundOrder> = [
    { title: '入库单号', dataIndex: 'inboundNo', key: 'inboundNo', width: 140, fixed: 'left', render: (no: string) => <Text style={{ fontFamily: 'monospace', color: '#6366f1', fontWeight: 600, fontSize: 12 }}>{no}</Text> },
    { title: '批次号', dataIndex: 'batchNo', key: 'batchNo', width: 130, render: (no: string) => <Text style={{ fontFamily: 'monospace', fontSize: 12 }}>{no}</Text> },
    { title: '药材', dataIndex: 'herbName', key: 'herbName', width: 90 },
    { title: '入库数量', dataIndex: 'quantity', key: 'quantity', width: 110, align: 'right' as const, render: (qty: number) => <Text strong style={{ color: '#5db872' }}>{qty.toLocaleString()}</Text> },
    { title: '仓库', dataIndex: 'warehouse', key: 'warehouse', width: 110 },
    { title: '库位', dataIndex: 'location', key: 'location', width: 100 },
    { title: '供应商', dataIndex: 'supplier', key: 'supplier', ellipsis: true },
    { title: '入库日期', dataIndex: 'inboundDate', key: 'inboundDate', width: 110 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100, render: (status: InboundOrder['status']) => <Tag color={statusColorMap[status]}>{INBOUND_STATUS_MAP[status]}</Tag> },
    { title: '质检员', dataIndex: 'inspector', key: 'inspector', width: 90, render: (i: string) => i || <Text type="secondary">—</Text> },
    { title: '操作', key: 'action', width: 140, fixed: 'right' as const, render: (_, record) => (
      <Space size={4}>
        <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => setDetailDrawer({ open: true, record })}>详情</Button>
        {record.status === 'pending' && (
          <Button type="link" size="small" icon={<CheckCircleOutlined />} style={{ color: '#10b981' }} onClick={() => {
            setDataSource(prev => prev.map(d => d.id === record.id ? { ...d, status: 'confirmed' } : d));
            message.success(`入库单 ${record.inboundNo} 已确认`);
          }}>确认</Button>
        )}
        {record.status === 'confirmed' && (
          <Button type="primary" size="small" icon={<CheckCircleOutlined />} onClick={() => {
            setDataSource(prev => prev.map(d => d.id === record.id ? { ...d, status: 'completed', inspector: '当前用户' } : d));
            message.success(`入库单 ${record.inboundNo} 已完成质检`);
          }}>完成入库</Button>
        )}
      </Space>
    )},
  ];

  const filteredData = dataSource.filter(item => {
    const kw = searchText.toLowerCase();
    const matchSearch = !kw || item.inboundNo.toLowerCase().includes(kw) || item.batchNo.toLowerCase().includes(kw) || item.herbName.toLowerCase().includes(kw) || item.supplier.toLowerCase().includes(kw);
    const matchStatus = !statusFilter || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleAddInbound = async () => {
    try {
      const values = await addForm.validateFields();
      const dateStr = dayjs().format('YYYYMMDD');
      const seq = String(dataSource.length + 1).padStart(2, '0');
      const newRecord: InboundOrder = {
        id: Date.now(),
        inboundNo: `RK-${dateStr}${seq}`,
        batchNo: values.batchNo || `B-${dateStr}-${String(dataSource.length + 1).padStart(3, '0')}`,
        herbName: values.herbName,
        quantity: values.quantity,
        unit: values.unit || 'kg',
        warehouse: values.warehouse,
        location: values.location,
        supplier: values.supplier,
        inboundDate: values.inboundDate?.format('YYYY-MM-DD') || dayjs().format('YYYY-MM-DD'),
        status: 'pending',
        remark: values.remark,
        createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      };
      setDataSource(prev => [newRecord, ...prev]);
      message.success(`入库单 ${newRecord.inboundNo} 创建成功`);
      setAddModalOpen(false);
      addForm.resetFields();
    } catch {
      // validation failed
    }
  };

  const handleExport = () => {
    const headers = ['入库单号', '批次号', '药材', '入库数量', '单位', '仓库', '库位', '供应商', '入库日期', '状态', '质检员', '创建时间'];
    const rows = filteredData.map(d => [
      d.inboundNo, d.batchNo, d.herbName, d.quantity, d.unit,
      d.warehouse, d.location, d.supplier, d.inboundDate,
      INBOUND_STATUS_MAP[d.status], d.inspector || '', d.createdAt,
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `入库记录_${dayjs().format('YYYYMMDD')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    message.success(`已导出 ${filteredData.length} 条入库记录`);
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 16 }}>
        <h3 className="page-title" style={{ margin: '0 0 4px' }}>入库管理</h3>
        <p className="page-desc">管理中药材入库登记、质检确认与库位分配</p>
      </div>

      {/* KPI */}
      <Row gutter={[12, 12]} style={{ marginBottom: 14 }}>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 10 }} styles={{ body: { padding: '12px 16px', textAlign: 'center' } }}>
            <Statistic title={<Text type="secondary" style={{ fontSize: 11 }}>入库单总数</Text>} value={dataSource.length} valueStyle={{ fontSize: 22, color: '#1677ff' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 10 }} styles={{ body: { padding: '12px 16px', textAlign: 'center' } }}>
            <Statistic title={<Text type="secondary" style={{ fontSize: 11 }}>待确认</Text>} value={pendingCount} valueStyle={{ fontSize: 22, color: '#f59e0b' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 10 }} styles={{ body: { padding: '12px 16px', textAlign: 'center' } }}>
            <Statistic title={<Text type="secondary" style={{ fontSize: 11 }}>已完成</Text>} value={completedCount} valueStyle={{ fontSize: 22, color: '#10b981' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 10 }} styles={{ body: { padding: '12px 16px', textAlign: 'center' } }}>
            <Statistic title={<Text type="secondary" style={{ fontSize: 11 }}>入库总量</Text>} value={totalQty.toLocaleString()} suffix="kg" valueStyle={{ fontSize: 22, color: '#6366f1' }} />
          </Card>
        </Col>
      </Row>

      <Card bordered={false} style={{ borderRadius: 10, marginBottom: 14 }} styles={{ body: { padding: '12px 16px' } }}>
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Input prefix={<SearchOutlined />} placeholder="搜索单号/批次/药材/供应商" value={searchText} onChange={e => setSearchText(e.target.value)} allowClear />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select placeholder="状态筛选" style={{ width: '100%' }} allowClear value={statusFilter} onChange={setStatusFilter}>
              <Option value="pending">待确认</Option><Option value="confirmed">已确认</Option><Option value="completed">已完成</Option><Option value="cancelled">已取消</Option>
            </Select>
          </Col>
          <Col style={{ marginLeft: 'auto' }}>
            <Space>
              <Button icon={<ExportOutlined />} onClick={handleExport}>导出</Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => { addForm.resetFields(); setAddModalOpen(true); }}>新增入库</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card bordered={false} style={{ borderRadius: 8 }}>
        <Table columns={columns} dataSource={filteredData} rowKey="id" pagination={{ pageSize: 10, showSizeChanger: true, showTotal: t => `共 ${t} 条` }} scroll={{ x: 1400 }} size="middle" />
      </Card>

      {/* 详情抽屉 */}
      <Drawer title={<Space><EyeOutlined style={{ color: '#1677ff' }} />入库详情</Space>} placement="right" width={520} open={detailDrawer.open} onClose={() => setDetailDrawer({ open: false, record: null })}>
        {detailDrawer.record && (
          <>
            <div style={{ background: '#f8fafc', borderRadius: 8, padding: '12px 16px', marginBottom: 16 }}>
              <Row gutter={[16, 8]}>
                <Col span={12}><Text type="secondary" style={{ fontSize: 11 }}>入库单号</Text><div style={{ fontWeight: 700, fontSize: 15, color: '#6366f1', fontFamily: 'monospace' }}>{detailDrawer.record.inboundNo}</div></Col>
                <Col span={12}><Text type="secondary" style={{ fontSize: 11 }}>批次号</Text><div style={{ fontWeight: 600 }}>{detailDrawer.record.batchNo}</div></Col>
              </Row>
            </div>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="药材名称"><Text strong>{detailDrawer.record.herbName}</Text></Descriptions.Item>
              <Descriptions.Item label="入库数量"><Text strong style={{ color: '#10b981' }}>{detailDrawer.record.quantity.toLocaleString()} {detailDrawer.record.unit}</Text></Descriptions.Item>
              <Descriptions.Item label="仓库">{detailDrawer.record.warehouse}</Descriptions.Item>
              <Descriptions.Item label="库位"><Tag color="blue">{detailDrawer.record.location}</Tag></Descriptions.Item>
              <Descriptions.Item label="供应商" span={2}>{detailDrawer.record.supplier}</Descriptions.Item>
              <Descriptions.Item label="入库日期">{detailDrawer.record.inboundDate}</Descriptions.Item>
              <Descriptions.Item label="质检员">{detailDrawer.record.inspector || '—'}</Descriptions.Item>
              <Descriptions.Item label="状态"><Tag color={statusColorMap[detailDrawer.record.status]}>{INBOUND_STATUS_MAP[detailDrawer.record.status]}</Tag></Descriptions.Item>
              {detailDrawer.record.remark && <Descriptions.Item label="备注" span={2}>{detailDrawer.record.remark}</Descriptions.Item>}
              <Descriptions.Item label="创建时间" span={2}>{detailDrawer.record.createdAt}</Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Drawer>

      {/* 新增入库 Modal */}
      <Modal
        title={<Space><PlusOutlined style={{ color: '#1677ff' }} />新增入库</Space>}
        open={addModalOpen}
        onOk={handleAddInbound}
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
              <Form.Item label="入库数量" name="quantity" rules={[{ required: true, message: '请输入数量' }]}>
                <InputNumber min={0.1} style={{ width: '100%' }} addonAfter="kg" placeholder="0.00" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="批次号" name="batchNo" rules={[{ required: true, message: '请输入批次号' }]}>
                <Input placeholder="如：HQ-20260401" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="入库日期" name="inboundDate" rules={[{ required: true, message: '请选择入库日期' }]}>
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
              <Form.Item label="供应商" name="supplier" rules={[{ required: true, message: '请输入供应商' }]}>
                <Input placeholder="如：官渡镇石斛林下经济示范园" />
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

export default WmsInbound;
