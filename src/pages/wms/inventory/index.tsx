import React, { useState } from 'react';
import {
  Card, Table, Button, Space, Tag, Input, Row, Col,
  Progress, Tooltip, message, Typography, Badge, Modal, Form, DatePicker, InputNumber, Segmented,
} from 'antd';
import {
  SearchOutlined, PlusOutlined, ExportOutlined,
  ExperimentOutlined, DeleteOutlined, ClockCircleOutlined,
  DashboardOutlined, FieldBinaryOutlined, EyeOutlined,
  WarningOutlined, SwapOutlined, ToolOutlined,
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

const getDaysRemaining = (validUntil: string): number => {
  const now = new Date();
  const end = new Date(validUntil);
  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};

// ============================================================
// 环境监控面板
// ============================================================
const EnvironmentDashboard: React.FC = () => {
  const zones = [
    { id: 'A', name: 'A区阴凉库', temp: 18, humidity: 55, status: 'normal' },
    { id: 'B', name: 'B区常温库', temp: 27, humidity: 50, status: 'warning' },
    { id: 'C', name: 'C区冷藏库', temp: 5, humidity: 60, status: 'normal' },
  ];

  const getHumidColor = (h: number) => h > 65 ? '#c64545' : h > 55 ? '#e8a55a' : '#5db872';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {zones.map((zone) => {
        const humidColor = getHumidColor(zone.humidity);
        return (
          <div
            key={zone.id}
            style={{
              background: zone.status === 'warning' ? 'rgba(232,165,90,0.08)' : '#faf9f5',
              border: zone.status === 'warning' ? '1px solid rgba(232,165,90,0.3)' : '1px solid rgba(20,20,19,0.05)',
              borderRadius: 10,
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#1d1d1f' }}>{zone.name}</span>
                <Tag
                  style={{
                    fontSize: 10, borderRadius: 9999, border: 'none',
                    padding: '1px 8px', fontWeight: 500,
                    background: zone.status === 'normal' ? 'rgba(93,184,114,0.12)' : 'rgba(232,165,90,0.12)',
                    color: zone.status === 'normal' ? '#5db872' : '#e8a55a',
                  }}
                >
                  {zone.status === 'normal' ? '正常' : '注意'}
                </Tag>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <DashboardOutlined style={{ color: '#cc785c', fontSize: 12 }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#1d1d1f' }}>{zone.temp}°C</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <FieldBinaryOutlined style={{ color: humidColor, fontSize: 12 }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: humidColor }}>{zone.humidity}%</span>
                </div>
              </div>
              <Progress
                percent={zone.humidity}
                size="small"
                strokeColor={humidColor}
                trailColor="rgba(0,0,0,0.06)"
                showInfo={false}
                style={{ marginTop: 5, marginBottom: 0 }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ============================================================
// 养护任务卡片
// ============================================================
const CareTaskCard: React.FC<{
  task: CareTask;
  onStatusChange: (id: string, status: CareTaskStatus) => void;
  colorBgMap: Record<string, string>;
}> = ({ task, onStatusChange, colorBgMap }) => {
  const typeInfo = careTaskTypes[task.type];
  const isOverdue = task.status === 'overdue' || (new Date(task.scheduledDate) < new Date() && task.status === 'pending');

  return (
    <div
      style={{
        background: isOverdue ? 'rgba(198,69,69,0.06)' : '#fff',
        border: isOverdue ? '1px solid rgba(198,69,69,0.2)' : '1px solid rgba(20,20,19,0.05)',
        borderLeft: `3px solid ${typeInfo.color}`,
        borderRadius: 10,
        padding: '10px 12px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Tag
            style={{
              fontSize: 10, margin: 0, borderRadius: 9999, border: 'none',
              background: colorBgMap[typeInfo.color] ?? '#faf9f5',
              color: typeInfo.color, padding: '1px 7px',
            }}
          >
            {typeInfo.label}
          </Tag>
          <Text style={{ fontSize: 11, color: '#8e8b82' }}>{task.location}</Text>
        </div>
        <Tag
          style={{
            fontSize: 10, borderRadius: 9999, border: 'none', padding: '1px 7px', fontWeight: 500,
            background: colorBgMap[CARE_STATUS_COLOR_MAP[task.status]] ?? '#faf9f5',
            color: CARE_STATUS_COLOR_MAP[task.status],
          }}
        >
          {CARE_STATUS_MAP[task.status]}
        </Tag>
      </div>
      <div style={{ fontSize: 11, marginBottom: 3 }}>
        <Text type="secondary">批次：</Text>
        <Text code style={{ fontSize: 10 }}>{task.targetBatch}</Text>
      </div>
      <div style={{ fontSize: 11, color: '#8e8b82', marginBottom: 6, lineHeight: 1.4 }}>
        {task.reason}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 11, color: isOverdue ? '#c64545' : '#8e8b82' }}>
          <ClockCircleOutlined style={{ marginRight: 3 }} />
          {task.scheduledDate} · {task.executor}
        </Text>
        {task.status === 'pending' && (
          <Button
            type="primary"
            size="small"
            onClick={() => onStatusChange(task.id, 'inProgress')}
            style={{ fontSize: 11, padding: '0 10px', height: 22, background: typeInfo.color, borderColor: typeInfo.color }}
          >
            开始
          </Button>
        )}
        {task.status === 'inProgress' && (
          <Button
            size="small"
            onClick={() => onStatusChange(task.id, 'completed')}
            style={{ fontSize: 11, padding: '0 10px', height: 22, background: '#5db872', color: '#fff', borderColor: '#5db872' }}
          >
            完成
          </Button>
        )}
      </div>
    </div>
  );
};

// ============================================================
// 批次展开列
// ============================================================
const buildBatchColumns = (onDetail: (batch: InventoryBatch) => void): ColumnsType<InventoryBatch> => [
  {
    title: '批次号', dataIndex: 'batchNo', key: 'batchNo', width: 140,
    render: (no: string) => <Text code style={{ fontSize: 11 }}>{no ?? '—'}</Text>,
  },
  {
    title: '库位', dataIndex: 'location', key: 'location', width: 90,
    render: (loc: string) => (
      <Tag style={{ fontSize: 10, borderRadius: 9999, border: 'none', background: '#f5f0e8', color: '#6c6a64', padding: '1px 8px' }}>
        {loc ?? '—'}
      </Tag>
    ),
  },
  {
    title: '供应商', dataIndex: 'supplier', key: 'supplier', width: 140, ellipsis: true,
    render: (s: string) => <Text style={{ fontSize: 11, color: '#6c6a64' }}>{s || '—'}</Text>,
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
      <Text style={{ fontSize: 11, color: v != null && v > 9 ? '#e8a55a' : '#5db872', fontWeight: 600 }}>{v != null ? `${v}%` : '—'}</Text>
    ),
  },
  {
    title: '有效期剩余', dataIndex: 'validUntil', key: 'validUntil', width: 160,
    render: (date: string | undefined) => {
      if (!date) return <Text type="secondary">—</Text>;
      const percent = getValidityPercent(date);
      const days = getDaysRemaining(date);
      const isLow = percent < 20;
      return (
        <Tooltip title={`有效期至 ${date}，剩余 ${days} 天`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Progress
              percent={percent}
              size="small"
              strokeColor={isLow ? '#c64545' : percent < 40 ? '#e8a55a' : '#5db872'}
              trailColor="rgba(0,0,0,0.06)"
              style={{ flex: 1, minWidth: 60, marginBottom: 0 }}
              format={() => null}
            />
            <Text style={{ fontSize: 10, color: isLow ? '#c64545' : '#8e8b82', whiteSpace: 'nowrap', fontWeight: 600 }}>
              {days}d
            </Text>
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
        color: INVENTORY_STATUS_MAP[status] === '正常' ? '#5db872' : '#e8a55a',
      }}>
        {INVENTORY_STATUS_MAP[status] ?? '—'}
      </Tag>
    ),
  },
  {
    title: '操作', key: 'action', width: 120,
    render: (_: unknown, record: InventoryBatch) => (
      <Space size={4}>
        <Button type="link" size="small" icon={<EyeOutlined />} style={{ fontSize: 11, padding: '0 4px' }} onClick={() => onDetail(record)}>详情</Button>
        <Button type="link" size="small" icon={<DeleteOutlined />} danger style={{ fontSize: 11, padding: '0 4px' }} onClick={() => message.warning(`请通过出库流程处理批次 ${record.batchNo}`)}>出库</Button>
      </Space>
    ),
  },
];

// ============================================================
// KPI 卡片组件
// ============================================================
interface KpiCardProps {
  title: string;
  value: number | string;
  suffix?: string;
  prefix?: React.ReactNode;
  valueStyle?: React.CSSProperties;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  trend?: string;
}
const KpiCard: React.FC<KpiCardProps> = ({ title, value, suffix, prefix, valueStyle, icon, iconBg, iconColor, trend }) => (
  <Card
    size="small"
    bordered={false}
    style={{ borderRadius: 12, background: '#fff' }}
    styles={{ body: { padding: '14px 16px' } }}
    hoverable
  >
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontSize: 12, color: '#6c6a64', lineHeight: 1 }}>{title}</span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginTop: 4 }}>
          {prefix}
          <span style={{ fontSize: 24, fontWeight: 700, color: '#1d1d1f', lineHeight: 1, ...valueStyle }}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>
          {suffix && <span style={{ fontSize: 12, color: '#8e8b82', marginLeft: 1 }}>{suffix}</span>}
        </div>
        {trend && <span style={{ fontSize: 11, color: '#5db872', marginTop: 2 }}>{trend}</span>}
      </div>
      <div style={{
        width: 44, height: 44, borderRadius: 10,
        background: iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, color: iconColor,
        flexShrink: 0,
      }}>
        {icon}
      </div>
    </div>
  </Card>
);

// ============================================================
// 主组件
// ============================================================
const WmsInventory: React.FC = () => {
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const [storageFilter, setStorageFilter] = useState<string>('all');
  const [formFilter, setFormFilter] = useState<string>('all');
  const [tasks, setTasks] = useState<CareTask[]>(careTasks);
  const [products] = useState(inventoryProducts);
  const [addInboundModalOpen, setAddInboundModalOpen] = useState(false);
  const [allTasksModalOpen, setAllTasksModalOpen] = useState(false);
  const [batchDetailModalOpen, setBatchDetailModalOpen] = useState(false);
  const [viewingBatch, setViewingBatch] = useState<InventoryBatch | null>(null);
  const [addInboundForm] = Form.useForm();

  const colorBgMap: Record<string, string> = {
    '#e8a55a': 'rgba(232,165,90,0.1)',
    '#c64545': 'rgba(198,69,69,0.1)',
    '#cc785c': 'rgba(204,120,92,0.1)',
    '#5db872': 'rgba(93,184,114,0.1)',
    '#5db8a6': '#f5f0e8',
    '#6c6a64': '#faf9f5',
  };

  const treeData: (InventoryProduct & { key: string })[] = products.map((product) => ({
    ...product,
    key: product.id,
    children: product.children.map((batch) => ({ ...batch, key: batch.id })),
  }));

  const filteredTreeData = treeData
    .filter((p) => storageFilter === 'all' || p.storageType === storageFilter)
    .filter((p) => formFilter === 'all' || p.form === formFilter)
    .map((p) => ({
      ...p,
      children: p.children.filter(
        (b: InventoryBatch) =>
          b.batchNo.toLowerCase().includes(searchText.toLowerCase()) ||
          b.supplier?.toLowerCase().includes(searchText.toLowerCase()) ||
          p.name.toLowerCase().includes(searchText.toLowerCase())
      ),
    }))
    .filter((p) => p.children.length > 0);

  const totalStock = products.reduce((s, p) => s + p.totalStock, 0);
  const totalBatches = products.reduce((s, p) => s + p.children.length, 0);
  const pendingTasks = tasks.filter((t) => t.status === 'pending' || t.status === 'inProgress').length;
  const overdueTasks = tasks.filter((t) => t.status === 'overdue' || (t.status === 'pending' && new Date(t.scheduledDate) < new Date())).length;

  const handleTaskStatus = (id: string, status: CareTaskStatus) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status } : t));
    message.success(`养护任务已更新为"${CARE_STATUS_MAP[status]}"`);
  };

  const handleAddInbound = async () => {
    try {
      const values = await addInboundForm.validateFields();
      message.success(`批次 ${values.batchNo} 入库成功`);
      setAddInboundModalOpen(false);
      addInboundForm.resetFields();
    } catch {}
  };

  const handleExport = () => {
    const headers = ['产品名称', '规格', '库位', '批次号', '库存量', '含水率', '有效期至', '状态'];
    const rows: string[][] = [];
    products.forEach((p) => {
      p.children.forEach((b) => {
        rows.push([
          `${p.name}（${p.form}）`, p.spec, b.location || '', b.batchNo || '',
          `${b.quantity}`, b.moisture != null ? `${b.moisture}%` : '',
          b.validUntil || '', INVENTORY_STATUS_MAP[b.status] ?? '',
        ]);
      });
    });
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `库存台账_${dayjs().format('YYYYMMDD')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    message.success(`已导出 ${rows.length} 条库存记录`);
  };

  const handleBatchDetail = (batch: InventoryBatch) => {
    setViewingBatch(batch);
    setBatchDetailModalOpen(true);
  };

  const mainColumns: ColumnsType<InventoryProduct & { key: string }> = [
    {
      title: '产品信息', key: 'name', width: 220,
      render: (_: unknown, record: InventoryProduct & { children?: InventoryBatch[] }) => (
        <Space size={6}>
          <Tag
            style={{
              fontSize: 10, borderRadius: 9999, border: 'none',
              background: storageTypeMap[record.storageType]?.color + '18',
              color: storageTypeMap[record.storageType]?.color,
              padding: '1px 7px',
            }}
          >
            {storageTypeMap[record.storageType]?.label}
          </Tag>
          <div>
            <Text strong style={{ fontSize: 13, color: '#1d1d1f' }}>{record.name}</Text>
            <Text type="secondary" style={{ fontSize: 11, marginLeft: 4 }}>{record.form}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: '规格', dataIndex: 'spec', key: 'spec', width: 150,
      render: (s: string) => <Text style={{ fontSize: 12, color: '#6c6a64' }}>{s}</Text>,
    },
    {
      title: '总库存', dataIndex: 'totalStock', key: 'totalStock', width: 110, align: 'right',
      render: (v: number | undefined, record: InventoryProduct) => (
        <div>
          <Text strong style={{ fontSize: 14, color: '#cc785c', fontWeight: 700 }}>
            {v != null ? v.toLocaleString() : '—'}
          </Text>
          <Text style={{ fontSize: 11, color: '#8e8b82', marginLeft: 3 }}>{record.unit}</Text>
        </div>
      ),
    },
    {
      title: '批次', key: 'batchCount', width: 90, align: 'center',
      render: (_: unknown, record: InventoryProduct & { children?: InventoryBatch[] }) => {
        const totalQty = record.children?.reduce((s, b) => s + b.quantity, 0) ?? 0;
        return (
          <Tag
            style={{
              fontSize: 11, borderRadius: 9999, border: 'none',
              background: 'rgba(204,120,92,0.1)', color: '#cc785c',
              padding: '2px 9px', fontWeight: 600,
            }}
          >
            {record.children?.length ?? 0} 批 / {totalQty.toLocaleString()}{record.unit}
          </Tag>
        );
      },
    },
    {
      title: '平均单价', dataIndex: 'avgPrice', key: 'avgPrice', width: 110, align: 'right',
      render: (v: number | undefined) => (
        <Text style={{ fontSize: 12, color: '#6c6a64' }}>
          {v != null ? `¥${v.toLocaleString()}` : '—'}
        </Text>
      ),
    },
    {
      title: '操作', key: 'action', width: 90,
      render: (_: unknown, record: InventoryProduct & { key?: string }) => (
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          style={{ fontSize: 11, padding: '0 4px' }}
          onClick={() => {
            if (record.key) {
              const k = record.key;
              setExpandedKeys((prev) => prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]);
            }
          }}
        >
          {expandedKeys.includes(record.key ?? '') ? '收起' : '展开批次'}
        </Button>
      ),
    },
  ];

  return (
    <div style={{ background: '#faf9f5', minHeight: '100%' }}>
      {/* 页面头部 */}
      <div style={{
        background: 'linear-gradient(135deg, #1d1d1f 0%, #3d2c1e 50%, #5c3d2a 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: '32px 32px 28px',
      }}>
        <div style={{ maxWidth: 1360, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#5db872', boxShadow: '0 0 8px rgba(93,184,114,0.5)',
            }} />
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', fontWeight: 500 }}>
              WMS · 仓储管理
            </span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: '-0.3px', marginBottom: 6 }}>
            库存台账与在库养护
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
            实时监控库内温湿度、批次效期及中药材特有养护任务
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1360, margin: '0 auto', padding: '20px 32px 32px' }}>
        {/* KPI 卡片区 */}
        <Row gutter={[10, 10]} style={{ marginBottom: 16 }}>
          <Col xs={12} sm={6}>
            <KpiCard
              title="总库存量"
              value={totalStock.toLocaleString()}
              suffix="kg"
              icon={<FieldBinaryOutlined />}
              iconBg="rgba(204,120,92,0.12)"
              iconColor="#cc785c"
              trend="较上月 +12.5%"
            />
          </Col>
          <Col xs={12} sm={6}>
            <KpiCard
              title="批次总数"
              value={totalBatches}
              suffix="个"
              valueStyle={{ color: '#5db872' }}
              icon={<SwapOutlined />}
              iconBg="rgba(93,184,114,0.12)"
              iconColor="#5db872"
            />
          </Col>
          <Col xs={12} sm={6}>
            <KpiCard
              title="养护任务"
              value={pendingTasks}
              suffix="待执行"
              valueStyle={{ color: '#e8a55a' }}
              icon={<ToolOutlined />}
              iconBg="rgba(232,165,90,0.12)"
              iconColor="#e8a55a"
            />
          </Col>
          <Col xs={12} sm={6}>
            <KpiCard
              title="逾期任务"
              value={overdueTasks}
              valueStyle={{ color: overdueTasks > 0 ? '#c64545' : '#5db872' }}
              icon={overdueTasks > 0 ? <WarningOutlined /> : <SwapOutlined />}
              iconBg={overdueTasks > 0 ? 'rgba(198,69,69,0.12)' : 'rgba(93,184,114,0.12)'}
              iconColor={overdueTasks > 0 ? '#c64545' : '#5db872'}
            />
          </Col>
        </Row>

        {/* 主体布局：左侧库存表格 + 右侧监控/任务 */}
        <Row gutter={[14, 14]}>
          <Col xs={24} lg={16}>
            {/* 筛选工具栏 */}
            <Card
              size="small"
              bordered={false}
              style={{ borderRadius: 12, marginBottom: 12 }}
              styles={{ body: { padding: '10px 14px' } }}
            >
              <Row gutter={[10, 10]} align="middle">
                <Col xs={24} sm={8}>
                  <Input
                    prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                    placeholder="搜索批次号 / 供应商 / 产品"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    allowClear
                    size="middle"
                  />
                </Col>
                <Col xs={24} sm={10}>
                  <Space size={8} wrap>
                    <Text style={{ fontSize: 12, color: '#6c6a64' }}>库区：</Text>
                    <Segmented
                      size="small"
                      value={storageFilter}
                      onChange={(v) => setStorageFilter(v as string)}
                      options={[
                        { label: '全部', value: 'all' },
                        { label: '阴凉库', value: 'shade' },
                        { label: '冷藏库', value: 'cold' },
                        { label: '常温库', value: 'ambient' },
                      ]}
                    />
                    <Text style={{ fontSize: 12, color: '#6c6a64' }}>形态：</Text>
                    <Segmented
                      size="small"
                      value={formFilter}
                      onChange={(v) => setFormFilter(v as string)}
                      options={[
                        { label: '全部', value: 'all' },
                        { label: '干条', value: '干条' },
                        { label: '切片', value: '切片' },
                        { label: '鲜条', value: '鲜条' },
                        { label: '微粉', value: '微粉' },
                      ]}
                    />
                  </Space>
                </Col>
                <Col xs={24} sm={6} style={{ textAlign: 'right' }}>
                  <Space>
                    <Button icon={<ExportOutlined />} size="middle" onClick={handleExport}>导出</Button>
                    <Button type="primary" icon={<PlusOutlined />} size="middle" onClick={() => { addInboundForm.resetFields(); setAddInboundModalOpen(true); }}>
                      新增入库
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Card>

            {/* 产品表格 */}
            <Card
              bordered={false}
              style={{ borderRadius: 12 }}
              styles={{ body: { padding: 0 } }}
            >
              <Table
                columns={mainColumns}
                dataSource={filteredTreeData as unknown as InventoryProduct[]}
                rowKey="key"
                expandable={{
                  expandedRowKeys: expandedKeys,
                  onExpand: (expanded, record) => {
                    const rec = record as InventoryProduct & { key: string };
                    setExpandedKeys(expanded ? [rec.key] : []);
                  },
                  expandedRowRender: (record: InventoryProduct & { children?: InventoryBatch[] }) => {
                    if (!record.children?.length) return <div style={{ padding: '8px 16px', color: '#8e8b82', fontSize: 12 }}>无批次数据</div>;
                    return (
                      <div style={{ padding: '4px 16px 8px' }}>
                        <div style={{
                          fontSize: 11, color: '#8e8b82', marginBottom: 6,
                          padding: '4px 8px', background: '#faf9f5', borderRadius: 6,
                          display: 'inline-block',
                        }}>
                          {record.name}（{record.form}）— 共 {record.children.length} 个批次
                        </div>
                        <Table
                          columns={buildBatchColumns(handleBatchDetail)}
                          dataSource={record.children}
                          rowKey="id"
                          pagination={false}
                          size="small"
                          scroll={{ x: 800 }}
                        />
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

          <Col xs={24} lg={8}>
            {/* 库区温湿度监控 */}
            <Card
              size="small"
              bordered={false}
              style={{ borderRadius: 12, marginBottom: 12 }}
              headStyle={{ fontSize: 13, fontWeight: 600, borderBottom: '1px solid rgba(20,20,19,0.05)', paddingLeft: 4 }}
              title={
                <Space>
                  <FieldBinaryOutlined style={{ color: '#cc785c' }} />
                  <span style={{ color: '#1d1d1f' }}>库区温湿度监控</span>
                </Space>
              }
              styles={{ body: { padding: '10px 12px' } }}
            >
              <EnvironmentDashboard />
            </Card>

            {/* 养护任务单 */}
            <Card
              size="small"
              bordered={false}
              style={{ borderRadius: 12 }}
              headStyle={{ fontSize: 13, fontWeight: 600, borderBottom: '1px solid rgba(20,20,19,0.05)', paddingLeft: 4 }}
              title={
                <Space>
                  <Badge dot offset={[8, 0]}>
                    <ExperimentOutlined style={{ color: '#cc785c' }} />
                  </Badge>
                  <span style={{ color: '#1d1d1f' }}>养护任务单</span>
                  <Badge
                    count={tasks.filter((t) => t.status === 'pending' || t.status === 'inProgress').length}
                    style={{ backgroundColor: '#e8a55a', fontSize: 10 }}
                  />
                </Space>
              }
              extra={
                <Button type="link" size="small" style={{ fontSize: 11, padding: '0 4px' }} onClick={() => setAllTasksModalOpen(true)}>
                  全部任务 →
                </Button>
              }
              styles={{ body: { padding: '8px 12px' } }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {tasks.slice(0, 5).map((task) => (
                  <CareTaskCard key={task.id} task={task} onStatusChange={handleTaskStatus} colorBgMap={colorBgMap} />
                ))}
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {/* 新增入库 Modal */}
      <Modal
        title={
          <Space>
            <PlusOutlined style={{ color: '#cc785c' }} />
            新增入库
          </Space>
        }
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

      {/* 批次详情 Modal */}
      <Modal
        title={
          <Space>
            <FieldBinaryOutlined style={{ color: '#cc785c' }} />
            批次详情
          </Space>
        }
        open={batchDetailModalOpen}
        onCancel={() => { setBatchDetailModalOpen(false); setViewingBatch(null); }}
        footer={null}
        width={600}
      >
        {viewingBatch && (
          <div style={{ marginTop: 16 }}>
            <Row gutter={[12, 8]}>
              {[
                { label: '批次号', value: viewingBatch.batchNo, span: 24, code: true },
                { label: '供应商', value: viewingBatch.supplier, span: 24 },
                { label: '库位', value: viewingBatch.location, span: 8 },
                { label: '库存量', value: `${viewingBatch.quantity} ${viewingBatch.unit}`, span: 8 },
                { label: '含水率', value: viewingBatch.moisture != null ? `${viewingBatch.moisture}%` : '—', span: 8 },
                { label: '生产日期', value: viewingBatch.productionDate, span: 12 },
                { label: '有效期至', value: viewingBatch.validUntil, span: 12 },
                { label: '外观性状', value: viewingBatch.appearance, span: 24 },
                { label: '质检证书', value: viewingBatch.certNo || '—', span: 12 },
                { label: '状态', value: INVENTORY_STATUS_MAP[viewingBatch.status], span: 12, tag: true },
              ].map((field, i) => (
                <Col span={field.span as 24 | 12 | 8} key={i}>
                  <div style={{
                    background: '#faf9f5', borderRadius: 8, padding: '8px 12px',
                    border: '1px solid rgba(20,20,19,0.05)',
                  }}>
                    <div style={{ fontSize: 11, color: '#8e8b82', marginBottom: 2 }}>{field.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1d1d1f' }}>
                      {field.code ? (
                        <Text code style={{ fontSize: 12 }}>{field.value}</Text>
                      ) : field.tag ? (
                        <Tag style={{
                          fontSize: 10, borderRadius: 9999, border: 'none',
                          background: INVENTORY_STATUS_MAP[viewingBatch.status] === '正常' ? 'rgba(93,184,114,0.1)' : 'rgba(232,165,90,0.1)',
                          color: INVENTORY_STATUS_MAP[viewingBatch.status] === '正常' ? '#5db872' : '#e8a55a',
                        }}>{field.value}</Tag>
                      ) : field.value}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
            {/* 效期进度 */}
            <div style={{ marginTop: 16 }}>
              <Text style={{ fontSize: 12, color: '#6c6a64', marginBottom: 8, display: 'block' }}>效期进度</Text>
              <Progress
                percent={getValidityPercent(viewingBatch.validUntil)}
                strokeColor={getValidityPercent(viewingBatch.validUntil) < 20 ? '#c64545' : getValidityPercent(viewingBatch.validUntil) < 40 ? '#e8a55a' : '#5db872'}
                trailColor="rgba(0,0,0,0.06)"
              />
              <Text style={{ fontSize: 11, color: '#8e8b82', marginTop: 4 }}>
                有效期至 {viewingBatch.validUntil}，剩余 {getDaysRemaining(viewingBatch.validUntil)} 天
              </Text>
            </div>
          </div>
        )}
      </Modal>

      {/* 全部养护任务 Modal */}
      <Modal
        title={
          <Space>
            <ExperimentOutlined style={{ color: '#cc785c' }} />
            养护任务管理
          </Space>
        }
        open={allTasksModalOpen}
        onCancel={() => setAllTasksModalOpen(false)}
        footer={null}
        width={640}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
          {tasks.map((task) => {
            const typeInfo = careTaskTypes[task.type];
            const isOverdue = task.status === 'overdue' || (task.status === 'pending' && new Date(task.scheduledDate) < new Date());
            return (
              <div
                key={task.id}
                style={{
                  background: isOverdue ? 'rgba(198,69,69,0.06)' : '#fff',
                  border: isOverdue ? '1px solid rgba(198,69,69,0.2)' : '1px solid rgba(20,20,19,0.05)',
                  borderLeft: `3px solid ${typeInfo.color}`,
                  borderRadius: 10,
                  padding: '10px 14px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <Space>
                    <Tag style={{
                      fontSize: 11, margin: 0, borderRadius: 9999, border: 'none',
                      background: colorBgMap[typeInfo.color] ?? '#faf9f5',
                      color: typeInfo.color, padding: '1px 8px',
                    }}>
                      {typeInfo.label}
                    </Tag>
                    <Text style={{ fontSize: 12, color: '#6c6a64' }}>{task.location}</Text>
                  </Space>
                  <Space>
                    <Tag style={{
                      fontSize: 10, borderRadius: 9999, border: 'none', padding: '1px 8px', fontWeight: 500,
                      background: colorBgMap[CARE_STATUS_COLOR_MAP[task.status]] ?? '#faf9f5',
                      color: CARE_STATUS_COLOR_MAP[task.status],
                    }}>
                      {CARE_STATUS_MAP[task.status]}
                    </Tag>
                    {task.status === 'pending' && (
                      <Button type="primary" size="small" onClick={() => handleTaskStatus(task.id, 'inProgress')} style={{ fontSize: 11, padding: '0 8px', height: 22, background: typeInfo.color, borderColor: typeInfo.color }}>开始</Button>
                    )}
                    {task.status === 'inProgress' && (
                      <Button size="small" onClick={() => handleTaskStatus(task.id, 'completed')} style={{ fontSize: 11, padding: '0 8px', height: 22, background: '#5db872', color: '#fff', borderColor: '#5db872' }}>完成</Button>
                    )}
                  </Space>
                </div>
                <div style={{ fontSize: 12, marginBottom: 3 }}>
                  <Text type="secondary">批次：</Text>
                  <Text code style={{ fontSize: 11 }}>{task.targetBatch}</Text>
                </div>
                <div style={{ fontSize: 11, color: '#8e8b82', marginBottom: 4, lineHeight: 1.4 }}>原因：{task.reason}</div>
                {task.remark && (
                  <div style={{ fontSize: 11, color: '#cc785c', marginBottom: 4, background: 'rgba(204,120,92,0.08)', padding: '3px 8px', borderRadius: 4 }}>
                    备注：{task.remark}
                  </div>
                )}
                <div style={{ fontSize: 11, color: isOverdue ? '#c64545' : '#8e8b82' }}>
                  <ClockCircleOutlined style={{ marginRight: 3 }} />
                  {task.scheduledDate} · {task.executor}
                </div>
              </div>
            );
          })}
        </div>
      </Modal>
    </div>
  );
};

export default WmsInventory;
