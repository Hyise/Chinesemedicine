import React, { useState } from 'react';
import {
  Card, Table, Button, Space, Tag, Input, Row, Col, Statistic,
  Progress, Tooltip, message, Typography, Badge, Modal, Form, DatePicker, InputNumber,
} from 'antd';
import {
  SearchOutlined, PlusOutlined, ExportOutlined,
  ExperimentOutlined, DeleteOutlined, ClockCircleOutlined,
  DashboardOutlined, FieldBinaryOutlined, EditOutlined, EyeOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  inventoryProducts, careTasks, careTaskTypes,
  storageTypeMap, type InventoryProduct, type InventoryBatch,
  type CareTask, type CareTaskStatus,
  INVENTORY_STATUS_MAP,
  CARE_STATUS_MAP, CARE_STATUS_COLOR_MAP,
} from '../mockData';
import dayjs from 'dayjs';

const { Text } = Typography;

const getValidityPercent = (validUntil: string): number => {
  const now = new Date();
  const end = new Date(validUntil);
  const start = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
  const total = end.getTime() - start.getTime();
  const elapsed = now.getTime() - start.getTime();
  return Math.max(0, Math.min(100, (total - elapsed) / total * 100));
};

const EnvironmentDashboard: React.FC = () => {
  const zones = [
    { id: 'A', name: 'A区阴凉库', temp: 18, humidity: 55, status: 'normal' },
    { id: 'B', name: 'B区常温库', temp: 27, humidity: 50, status: 'warning' },
    { id: 'C', name: 'C区冷藏库', temp: 5, humidity: 60, status: 'normal' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {zones.map(zone => (
        <Card
          key={zone.id}
          size="small"
          style={{
            borderRadius: 14,
            border: zone.status === 'warning' ? '1px solid #e8a55a' : '1px solid rgba(20,20,19,0.06)',
            background: zone.status === 'warning' ? 'rgba(232,165,90,0.1)' : '#faf9f5',
          }}
          styles={{ body: { padding: '12px 14px' } }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6 }}>{zone.name}</div>
              <Space size={16}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <FieldBinaryOutlined style={{ color: '#c64545', fontSize: 13 }} />
                  <Text style={{ fontSize: 13, fontWeight: 600 }}>{zone.temp}°C</Text>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <DashboardOutlined style={{ color: '#cc785c', fontSize: 13 }} />
                  <Text style={{ fontSize: 13, fontWeight: 600 }}>{zone.humidity}%</Text>
                </span>
              </Space>
            </div>
            <Tag style={{
              fontSize: 11, borderRadius: 9999, border: 'none', padding: '2px 10px', fontWeight: 500,
              background: zone.status === 'normal' ? 'rgba(93,184,114,0.1)' : 'rgba(232,165,90,0.1)',
              color: zone.status === 'normal' ? '#5db872' : '#e8a55a'
            }}>
              {zone.status === 'normal' ? '正常' : '注意'}
            </Tag>
          </div>
          <Progress
            percent={zone.humidity}
            size="small"
            strokeColor={zone.humidity > 60 ? '#cc785c' : zone.humidity < 40 ? '#e8a55a' : '#5db872'}
            trailColor="#efe9de"
            showInfo={false}
            style={{ marginTop: 8 }}
          />
        </Card>
      ))}
    </div>
  );
};

const CareTaskCard: React.FC<{
  task: CareTask;
  onStatusChange: (id: string, status: CareTaskStatus) => void;
  colorBgMap: Record<string, string>;
}> = ({ task, onStatusChange, colorBgMap }) => {
  const typeInfo = careTaskTypes[task.type];
  const isOverdue = new Date(task.scheduledDate) < new Date() && task.status === 'pending';

  return (
    <Card
      size="small"
      style={{
        borderRadius: 14,
        borderLeft: `3px solid ${typeInfo.color}`,
        background: isOverdue ? 'rgba(198,69,69,0.1)' : '#ffffff',
        border: isOverdue ? '1px solid #c64545' : '1px solid rgba(20,20,19,0.06)',
      }}
      styles={{ body: { padding: '12px 14px' } }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Tag style={{ fontSize: 11, margin: 0, borderRadius: 9999, border: 'none', background: colorBgMap[typeInfo.color] ?? '#faf9f5', color: typeInfo.color, padding: '2px 8px' }}>{typeInfo.label}</Tag>
          <Text style={{ fontSize: 12, color: '#6c6a64' }}>{task.location}</Text>
        </div>
        <Tag style={{
          fontSize: 10, borderRadius: 9999, border: 'none', padding: '1px 8px', fontWeight: 500,
          background: colorBgMap[CARE_STATUS_COLOR_MAP[task.status]] ?? '#faf9f5',
          color: CARE_STATUS_COLOR_MAP[task.status]
        }}>
          {CARE_STATUS_MAP[task.status]}
        </Tag>
      </div>
      <div style={{ fontSize: 12, marginBottom: 4 }}>
        <Text type="secondary">批次：</Text>
        <Text code style={{ fontSize: 11 }}>{task.targetBatch}</Text>
      </div>
      <div style={{ fontSize: 11, color: '#8e8b82', marginBottom: 8 }}>
        原因：{task.reason}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 11, color: '#8e8b82' }}>
          <ClockCircleOutlined style={{ marginRight: 3 }} />
          {task.scheduledDate} · {task.executor}
        </Text>
        {task.status === 'pending' && (
          <Button type="primary" size="small" onClick={() => onStatusChange(task.id, 'inProgress')} style={{ fontSize: 11, padding: '0 10px', height: 24 }}>
            开始
          </Button>
        )}
        {task.status === 'inProgress' && (
          <Button size="small" onClick={() => onStatusChange(task.id, 'completed')} style={{ fontSize: 11, padding: '0 10px', height: 24, background: '#5db872', color: '#fff', borderColor: '#5db872' }}>
            完成
          </Button>
        )}
      </div>
    </Card>
  );
};

const buildBatchColumns = (): ColumnsType<InventoryBatch> => [
  {
    title: '批次号', dataIndex: 'batchNo', key: 'batchNo', width: 150,
    render: (no: string) => <Text code style={{ fontSize: 11 }}>{no ?? '—'}</Text>,
  },
  {
    title: '库位', dataIndex: 'location', key: 'location', width: 90,
    render: (loc: string) => (
      <Tag style={{ fontSize: 11, borderRadius: 9999, border: 'none', background: '#faf9f5', color: '#6c6a64', padding: '2px 8px' }}>
        {loc ?? '—'}
      </Tag>
    ),
  },
  {
    title: '库存量', dataIndex: 'quantity', key: 'quantity', width: 90, align: 'right',
    render: (qty: number | undefined) => (
      <Text strong style={{ fontSize: 12 }}>{qty != null ? qty.toLocaleString() : '—'}</Text>
    ),
  },
  {
    title: '含水率', dataIndex: 'moisture', key: 'moisture', width: 70, align: 'right',
    render: (v: number | undefined) => (
      <Text style={{ fontSize: 11, color: v != null && v > 9 ? '#e8a55a' : '#5db872' }}>{v != null ? `${v}%` : '—'}</Text>
    ),
  },
  {
    title: '有效期剩余', dataIndex: 'validUntil', key: 'validUntil', width: 150,
    render: (date: string | undefined) => {
      if (!date) return <Text type="secondary">—</Text>;
      const percent = getValidityPercent(date);
      const isLow = percent < 20;
      return (
        <Tooltip title={`有效期至 ${date}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Progress percent={percent} size="small" strokeColor={isLow ? '#c64545' : percent < 40 ? '#e8a55a' : '#5db872'} trailColor="#efe9de" style={{ flex: 1, minWidth: 60 }} format={() => null} />
            <Text style={{ fontSize: 10, color: isLow ? '#c64545' : '#8e8b82', whiteSpace: 'nowrap' }}>{percent.toFixed(0)}%</Text>
          </div>
        </Tooltip>
      );
    },
  },
  {
    title: '状态', dataIndex: 'status', key: 'status', width: 70,
    render: (status: InventoryBatch['status']) => (
      <Tag style={{
        fontSize: 10, borderRadius: 9999, border: 'none', padding: '1px 8px',
        background: INVENTORY_STATUS_MAP[status] === '正常' ? 'rgba(93,184,114,0.1)' : 'rgba(232,165,90,0.1)',
        color: INVENTORY_STATUS_MAP[status] === '正常' ? '#5db872' : '#e8a55a'
      }}>
        {INVENTORY_STATUS_MAP[status] ?? '—'}
      </Tag>
    ),
  },
  {
    title: '操作', key: 'action', width: 150,
    render: (_, record: InventoryBatch) => (
      <Space size={4}>
        <Button type="link" size="small" icon={<EyeOutlined />} style={{ fontSize: 11, padding: 0 }} onClick={() => message.info(`批次 ${record.batchNo} 详情`)}>详情</Button>
        <Button type="link" size="small" icon={<EditOutlined />} style={{ fontSize: 11, padding: 0 }} onClick={() => message.info(`调整批次 ${record.batchNo} 库存`)}>调整</Button>
        <Button type="link" size="small" icon={<DeleteOutlined />} danger style={{ fontSize: 11, padding: 0 }} onClick={() => message.warning(`请通过出库流程处理批次 ${record.batchNo}`)}>出库</Button>
      </Space>
    ),
  },
];

const WmsInventory: React.FC = () => {
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const [tasks, setTasks] = useState<CareTask[]>(careTasks);
  const [products, setProducts] = useState(inventoryProducts);
  const [addInboundModalOpen, setAddInboundModalOpen] = useState(false);
  const [allTasksModalOpen, setAllTasksModalOpen] = useState(false);
  const [addInboundForm] = Form.useForm();

  const colorBgMap: Record<string, string> = {
    '#e8a55a': 'rgba(232,165,90,0.1)',
    '#c64545': 'rgba(198,69,69,0.1)',
    '#cc785c': 'rgba(204,120,92,0.1)',
    '#5db872': 'rgba(93,184,114,0.1)',
    '#5db8a6': '#f5f0e8',
    '#6c6a64': '#faf9f5',
  };

  interface ProductWithKey extends InventoryProduct { key: string; id: string; name: string; }

  const treeData: ProductWithKey[] = products.map((product) => ({
    id: product.id,
    key: product.id,
    name: product.name,
    form: product.form,
    spec: product.spec,
    totalStock: product.totalStock,
    unit: product.unit,
    storageType: product.storageType,
    avgPrice: product.avgPrice,
    children: product.children.map((batch) => ({ ...batch, key: batch.id, name: batch.batchNo })),
  }));

  const filteredTreeData = searchText
    ? treeData.map(p => ({
        ...p,
        children: p.children.filter(
          (b: InventoryBatch) =>
            b.batchNo.toLowerCase().includes(searchText.toLowerCase()) ||
            b.supplier?.toLowerCase().includes(searchText.toLowerCase()) ||
            p.name.toLowerCase().includes(searchText.toLowerCase())
        ),
      })).filter(p => p.children.length > 0)
    : treeData;

  const totalStock = products.reduce((s, p) => s + p.totalStock, 0);
  const totalBatches = products.reduce((s, p) => s + p.children.length, 0);
  const overdueTasks = tasks.filter(t => t.status === 'pending' && new Date(t.scheduledDate) < new Date()).length;

  const handleTaskStatus = (id: string, status: CareTaskStatus) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    message.success(`养护任务已更新为"${CARE_STATUS_MAP[status]}"`);
  };

  const handleAddInbound = async () => {
    try {
      const values = await addInboundForm.validateFields();
      const newBatch: InventoryBatch = {
        id: `batch-${Date.now()}`,
        parentId: 'prod-gc-dry',
        batchNo: values.batchNo,
        storageType: 'shade',
        location: values.location,
        quantity: values.quantity,
        unit: 'kg',
        productionDate: values.productionDate?.format('YYYY-MM-DD') || '',
        validUntil: values.validUntil?.format('YYYY-MM-DD') || '',
        moisture: values.moisture,
        status: 'normal',
        supplier: values.supplier,
        appearance: '符合标准',
        createdAt: dayjs().format('YYYY-MM-DD'),
        updatedAt: dayjs().format('YYYY-MM-DD'),
      };
      setProducts(prev => prev.map((p, i) =>
        i === 0 ? { ...p, totalStock: p.totalStock + values.quantity, children: [newBatch, ...p.children] } : p
      ));
      message.success(`批次 ${newBatch.batchNo} 入库成功`);
      setAddInboundModalOpen(false);
      addInboundForm.resetFields();
    } catch {}
  };

  const handleExport = () => {
    const headers = ['产品名称', '规格', '库位', '批次号', '库存量', '含水率', '有效期至', '状态'];
    const rows: string[][] = [];
    products.forEach(p => {
      p.children.forEach(b => {
        rows.push([
          `${p.name}（${p.form}）`, p.spec, b.location || '', b.batchNo || '',
          `${b.quantity}`, b.moisture != null ? `${b.moisture}%` : '',
          b.validUntil || '', INVENTORY_STATUS_MAP[b.status] ?? '',
        ]);
      });
    });
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `库存台账_${dayjs().format('YYYYMMDD')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    message.success(`已导出 ${rows.length} 条库存记录`);
  };

  return (
    <div style={{ background: '#faf9f5', minHeight: '100%' }}>
      <div style={{ background: '#ffffff', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '32px 32px 28px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontSize: 12, color: '#cc785c', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 6 }}>仓储管理</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#1d1d1f', letterSpacing: '-0.3px', marginBottom: 6 }}>库存台账与在库养护</div>
          <div style={{ fontSize: 13, color: '#6c6a64' }}>实时监控库内温湿度、批次效期及中药材特有养护任务</div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 32px 32px' }}>
        <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Card size="small" className="card-interactive" style={{ borderRadius: 16, border: '1px solid rgba(20,20,19,0.06)', textAlign: 'center' }} styles={{ body: { padding: '14px 16px' } }}>
              <Statistic title={<Text type="secondary" style={{ fontSize: 11 }}>总库存</Text>} value={totalStock} suffix="kg" valueStyle={{ fontSize: 24, color: '#cc785c', fontWeight: 700 }} />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" className="card-interactive" style={{ borderRadius: 16, border: '1px solid rgba(20,20,19,0.06)', textAlign: 'center' }} styles={{ body: { padding: '14px 16px' } }}>
              <Statistic title={<Text type="secondary" style={{ fontSize: 11 }}>批次总数</Text>} value={totalBatches} suffix="个" valueStyle={{ fontSize: 24, color: '#5db872', fontWeight: 700 }} />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" className="card-interactive" style={{ borderRadius: 16, border: '1px solid rgba(20,20,19,0.06)', textAlign: 'center' }} styles={{ body: { padding: '14px 16px' } }}>
              <Statistic title={<Text type="secondary" style={{ fontSize: 11 }}>养护任务</Text>} value={tasks.filter(t => t.status === 'pending').length} suffix="待执行" valueStyle={{ fontSize: 24, color: '#e8a55a', fontWeight: 700 }} />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" className="card-interactive" style={{ borderRadius: 16, border: '1px solid rgba(20,20,19,0.06)', textAlign: 'center' }} styles={{ body: { padding: '14px 16px' } }}>
              <Statistic title={<Text type="secondary" style={{ fontSize: 11 }}>逾期任务</Text>} value={overdueTasks} valueStyle={{ fontSize: 24, color: overdueTasks > 0 ? '#c64545' : '#5db872', fontWeight: 700 }} />
            </Card>
          </Col>
        </Row>

        <Row gutter={[14, 14]}>
          <Col span={16}>
            <Card size="small" style={{ borderRadius: 16, border: '1px solid rgba(20,20,19,0.06)', marginBottom: 14 }} styles={{ body: { padding: '12px 16px' } }}>
              <Row gutter={[12, 12]} align="middle">
                <Col xs={24} sm={14}>
                  <Input prefix={<SearchOutlined />} placeholder="搜索批次号或供应商" value={searchText} onChange={e => setSearchText(e.target.value)} allowClear size="small" />
                </Col>
                <Col style={{ marginLeft: 'auto' }}>
                  <Space>
                    <Button icon={<ExportOutlined />} size="small" onClick={handleExport}>导出</Button>
                    <Button type="primary" icon={<PlusOutlined />} size="small" onClick={() => { addInboundForm.resetFields(); setAddInboundModalOpen(true); }}>新增入库</Button>
                  </Space>
                </Col>
              </Row>
            </Card>

            <Card style={{ borderRadius: 16, border: '1px solid rgba(20,20,19,0.06)' }} styles={{ body: { padding: '0 16px' } }}>
              <Table
                columns={[
                  {
                    title: '产品名称', key: 'name', width: 200,
                    render: (_: unknown, record: InventoryProduct & { key?: string; children?: InventoryBatch[] }) => (
                      <Space>
                        <Tag style={{ fontSize: 10, borderRadius: 9999, border: 'none', background: '#f5f0e8', color: '#cc785c', padding: '1px 6px' }}>
                          {storageTypeMap[record.storageType].label}
                        </Tag>
                        <Text strong style={{ fontSize: 13 }}>{record.name}（{record.form}）</Text>
                      </Space>
                    ),
                  },
                  { title: '规格', dataIndex: 'spec', key: 'spec', width: 140 },
                  {
                    title: '总库存', dataIndex: 'totalStock', key: 'totalStock', width: 100, align: 'right',
                    render: (v: number | undefined, record: InventoryProduct) => (
                      <Text strong style={{ fontSize: 13, color: '#cc785c' }}>{v != null ? v.toLocaleString() : '—'} {record.unit}</Text>
                    ),
                  },
                  {
                    title: '批次', key: 'batchCount', width: 80, align: 'center',
                    render: (_: unknown, record: InventoryProduct & { children?: InventoryBatch[] }) => (
                      <Tag style={{ fontSize: 11, borderRadius: 9999, border: 'none', background: 'rgba(204,120,92,0.1)', color: '#cc785c', padding: '2px 8px' }}>
                        {record.children?.length ?? 0} 个批次
                      </Tag>
                    ),
                  },
                  {
                    title: '平均单价', dataIndex: 'avgPrice', key: 'avgPrice', width: 100, align: 'right',
                    render: (v: number | undefined) => <Text>{v != null ? `${v.toLocaleString()} 元/kg` : '—'}</Text>,
                  },
                  {
                    title: '操作', key: 'action', width: 90,
                    render: (_: unknown, record: InventoryProduct & { key?: string; children?: InventoryBatch[] }) => (
                      <Button type="link" size="small" icon={<EyeOutlined />} style={{ fontSize: 11, padding: 0 }} onClick={() => { if (record.key) { const k = record.key; setExpandedKeys(prev => prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k]); } }}>
                        展开批次
                      </Button>
                    ),
                  },
                ]}
                dataSource={filteredTreeData as unknown as InventoryProduct[]}
                rowKey="key"
                expandable={{
                  expandedRowKeys: expandedKeys,
                  onExpand: (expanded, record) => {
                    const rec = record as unknown as InventoryProduct & { key: string };
                    setExpandedKeys(expanded ? [rec.key] : []);
                  },
                  expandedRowRender: (record: InventoryProduct & { children?: InventoryBatch[] }) => {
                    if (!record.children?.length) return null;
                    return (
                      <div style={{ padding: '4px 0 8px 32px' }}>
                        <Table columns={buildBatchColumns()} dataSource={record.children as InventoryBatch[]} rowKey="id" pagination={false} size="small" scroll={{ x: 700 }} />
                      </div>
                    );
                  },
                  rowExpandable: (record) => !!(record.children?.length),
                }}
                pagination={false}
                size="small"
                scroll={{ x: 700 }}
              />
            </Card>
          </Col>

          <Col span={8}>
            <Card size="small" title={
              <Space>
                <FieldBinaryOutlined style={{ color: '#cc785c' }} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>库区温湿度监控</span>
              </Space>
            } style={{ borderRadius: 16, border: '1px solid rgba(20,20,19,0.06)', marginBottom: 14 }} styles={{ body: { padding: '10px 14px' } }}>
              <EnvironmentDashboard />
            </Card>

            <Card size="small" title={
              <Space>
                <Badge dot={overdueTasks > 0} offset={[8, 0]}>
                  <ExperimentOutlined style={{ color: '#cc785c' }} />
                </Badge>
                <span style={{ fontSize: 13, fontWeight: 600 }}>养护任务单</span>
                <Badge count={tasks.filter(t => t.status === 'pending').length} style={{ backgroundColor: '#e8a55a' }} />
              </Space>
            } extra={<Button type="link" size="small" style={{ fontSize: 11, padding: 0 }} onClick={() => setAllTasksModalOpen(true)}>全部任务</Button>}
            style={{ borderRadius: 16, border: '1px solid rgba(20,20,19,0.06)' }} styles={{ body: { padding: '10px 14px' } }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {tasks.slice(0, 5).map(task => (
                  <CareTaskCard key={task.id} task={task} onStatusChange={handleTaskStatus} colorBgMap={colorBgMap} />
                ))}
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      <Modal
        title={<Space><PlusOutlined style={{ color: '#cc785c' }} />新增入库</Space>}
        open={addInboundModalOpen}
        onOk={handleAddInbound}
        onCancel={() => { setAddInboundModalOpen(false); addInboundForm.resetFields(); }}
        okText="确认入库"
        cancelText="取消"
        width={560}
        destroyOnClose
      >
        <Form form={addInboundForm} layout="vertical" style={{ marginTop: 16 }}>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="批次号" name="batchNo" rules={[{ required: true, message: '请输入批次号' }]}>
                <Input placeholder="如：GCH-D-20260429" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="库位" name="location" rules={[{ required: true, message: '请输入库位' }]}>
                <Input placeholder="如：A-01-01" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="入库数量" name="quantity" rules={[{ required: true, message: '请输入数量' }]}>
                <InputNumber min={0.1} style={{ width: '100%' }} addonAfter="kg" placeholder="0.00" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="含水率" name="moisture" rules={[{ required: true, message: '请输入含水率' }]}>
                <InputNumber min={0} max={100} style={{ width: '100%' }} addonAfter="%" placeholder="0.0" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="生产日期" name="productionDate" rules={[{ required: true, message: '请选择生产日期' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="有效期至" name="validUntil" rules={[{ required: true, message: '请选择有效期' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="供应商" name="supplier" rules={[{ required: true, message: '请输入供应商' }]}>
                <Input placeholder="如：官渡镇石斛林下经济示范园" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal
        title={<Space><ExperimentOutlined style={{ color: '#cc785c' }} />养护任务管理</Space>}
        open={allTasksModalOpen}
        onCancel={() => setAllTasksModalOpen(false)}
        footer={null}
        width={720}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
          {tasks.map(task => (
            <Card key={task.id} size="small" style={{
              borderRadius: 14,
              borderLeft: `3px solid ${careTaskTypes[task.type].color}`,
              background: task.status === 'overdue' ? 'rgba(198,69,69,0.1)' : '#ffffff',
              border: task.status === 'overdue' ? '1px solid #c64545' : '1px solid rgba(20,20,19,0.06)',
            }} styles={{ body: { padding: '12px 16px' } }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <Space>
                  <Tag style={{ fontSize: 11, margin: 0, borderRadius: 9999, border: 'none', background: colorBgMap[careTaskTypes[task.type].color] ?? '#faf9f5', color: careTaskTypes[task.type].color, padding: '2px 8px' }}>
                    {careTaskTypes[task.type].label}
                  </Tag>
                  <Text style={{ fontSize: 12, color: '#6c6a64' }}>{task.location}</Text>
                </Space>
                <Space>
                  <Tag style={{
                    fontSize: 10, borderRadius: 9999, border: 'none', padding: '1px 8px', fontWeight: 500,
                    background: colorBgMap[CARE_STATUS_COLOR_MAP[task.status]] ?? '#faf9f5',
                    color: CARE_STATUS_COLOR_MAP[task.status]
                  }}>
                    {CARE_STATUS_MAP[task.status]}
                  </Tag>
                  {task.status === 'pending' && (
                    <Button type="primary" size="small" onClick={() => handleTaskStatus(task.id, 'inProgress')} style={{ fontSize: 11, padding: '0 8px', height: 22 }}>开始</Button>
                  )}
                  {task.status === 'inProgress' && (
                    <Button size="small" onClick={() => handleTaskStatus(task.id, 'completed')} style={{ fontSize: 11, padding: '0 8px', height: 22, background: '#5db872', color: '#fff', borderColor: '#5db872' }}>完成</Button>
                  )}
                </Space>
              </div>
              <div style={{ fontSize: 12, marginBottom: 4 }}>
                <Text type="secondary">批次：</Text>
                <Text code style={{ fontSize: 11 }}>{task.targetBatch}</Text>
              </div>
              <div style={{ fontSize: 11, color: '#8e8b82', marginBottom: 4 }}>原因：{task.reason}</div>
              <div style={{ fontSize: 11, color: '#8e8b82' }}><ClockCircleOutlined style={{ marginRight: 3 }} />{task.scheduledDate} · {task.executor}</div>
            </Card>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default WmsInventory;
