import React, { useState } from 'react';
import {
  Card, Row, Col, Table, Button, Space, Tag, Input, Select, Modal, Form,
  DatePicker, InputNumber, message, Tabs, Progress, Timeline,
  Drawer, Descriptions, Divider, Badge, Popconfirm, Alert,
} from 'antd';
import {
  PlusOutlined, SearchOutlined, ExperimentOutlined, SafetyOutlined,
  NodeIndexOutlined, WarningOutlined, CheckCircleOutlined, CloseCircleOutlined,
  ClockCircleOutlined, EyeOutlined, FileTextOutlined, SyncOutlined,
  RiseOutlined, DatabaseOutlined, AlertOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import ReactECharts from 'echarts-for-react';
import type { QualityTest, QualityStandard, QualityWarning, TraceRecord, TestResult, InspectionStatus } from '@/types/global';
import {
  INSPECTION_STATUS_MAP, INSPECTION_STATUS_COLOR,
  WARNING_TYPE_LABEL, TRACE_STATUS_MAP, TRACE_STATUS_COLOR,
} from '@/types/global';
import { CHART_COLORS } from '../dashboard/components/mockData';

// ============================================================
// Mock 检测记录数据
// ============================================================
const mockTests: QualityTest[] = [
  {
    id: 1, batchNo: 'GZ-QC-202604-001', herbName: '金钗石斛', specification: '统货/枫斗',
    sampleAmount: 500, submitter: '张仓库', submitDate: '2026-04-10',
    tester: '赵检测员', testDate: '2026-04-11',
    items: [
      { item: 'dendrobine', itemLabel: '石斛碱含量', result: 42.5, unit: '%', limit: '≥30%', isPass: true },
      { item: 'moisture', itemLabel: '含水率', result: 8.2, unit: '%', limit: '≤12%', isPass: true },
      { item: 'heavyMetalPb', itemLabel: '重金属-铅(Pb)', result: 0.3, unit: 'mg/kg', limit: '≤5mg/kg', isPass: true },
      { item: 'heavyMetalCd', itemLabel: '重金属-镉(Cd)', result: 0.08, unit: 'mg/kg', limit: '≤0.3mg/kg', isPass: true },
      { item: 'pesticideOP', itemLabel: '有机磷农药残留', result: 0.01, unit: 'mg/kg', limit: '≤0.05mg/kg', isPass: true },
    ],
    overallResult: 'pass', status: 'reported', reportNo: 'QR-202604-001', createdAt: '2026-04-10',
  },
  {
    id: 2, batchNo: 'GZ-QC-202604-002', herbName: '金钗石斛', specification: '特级/枫斗',
    sampleAmount: 300, submitter: '李仓库', submitDate: '2026-04-15',
    tester: '赵检测员', testDate: '2026-04-16',
    items: [
      { item: 'dendrobine', itemLabel: '石斛碱含量', result: 38.7, unit: '%', limit: '≥30%', isPass: true },
      { item: 'moisture', itemLabel: '含水率', result: 11.5, unit: '%', limit: '≤12%', isPass: true },
      { item: 'heavyMetalPb', itemLabel: '重金属-铅(Pb)', result: 0.5, unit: 'mg/kg', limit: '≤5mg/kg', isPass: true },
      { item: 'heavyMetalCd', itemLabel: '重金属-镉(Cd)', result: 0.1, unit: 'mg/kg', limit: '≤0.3mg/kg', isPass: true },
      { item: 'pesticideOP', itemLabel: '有机磷农药残留', result: 0.02, unit: 'mg/kg', limit: '≤0.05mg/kg', isPass: true },
    ],
    overallResult: 'pass', status: 'reported', reportNo: 'QR-202604-002', createdAt: '2026-04-15',
  },
  {
    id: 3, batchNo: 'GZ-QC-202604-003', herbName: '金钗石斛', specification: '优等/切片',
    sampleAmount: 400, submitter: '王仓库', submitDate: '2026-04-18',
    tester: '钱检测员', testDate: '2026-04-19',
    items: [
      { item: 'dendrobine', itemLabel: '石斛碱含量', result: 36.2, unit: '%', limit: '≥30%', isPass: true },
      { item: 'moisture', itemLabel: '含水率', result: 13.5, unit: '%', limit: '≤12%', isPass: false },
      { item: 'heavyMetalPb', itemLabel: '重金属-铅(Pb)', result: 0.4, unit: 'mg/kg', limit: '≤5mg/kg', isPass: true },
      { item: 'heavyMetalCd', itemLabel: '重金属-镉(Cd)', result: 0.12, unit: 'mg/kg', limit: '≤0.3mg/kg', isPass: true },
      { item: 'pesticideOP', itemLabel: '有机磷农药残留', result: 0.01, unit: 'mg/kg', limit: '≤0.05mg/kg', isPass: true },
    ],
    overallResult: 'fail', status: 'reported', reportNo: 'QR-202604-003', remark: '含水率超标，建议复检后重新干燥处理', createdAt: '2026-04-18',
  },
  {
    id: 4, batchNo: 'GZ-QC-202604-004', herbName: '金钗石斛', specification: '统货/鲜条',
    sampleAmount: 600, submitter: '赵仓库', submitDate: '2026-04-22',
    tester: '孙检测员', testDate: '2026-04-23',
    items: [
      { item: 'dendrobine', itemLabel: '石斛碱含量', result: 40.1, unit: '%', limit: '≥30%', isPass: true },
      { item: 'moisture', itemLabel: '含水率', result: 78.5, unit: '%', limit: '≤85%', isPass: true },
      { item: 'heavyMetalPb', itemLabel: '重金属-铅(Pb)', result: 0.2, unit: 'mg/kg', limit: '≤5mg/kg', isPass: true },
      { item: 'heavyMetalCd', itemLabel: '重金属-镉(Cd)', result: 0.05, unit: 'mg/kg', limit: '≤0.3mg/kg', isPass: true },
    ],
    overallResult: 'pass', status: 'testing', createdAt: '2026-04-22',
  },
  {
    id: 5, batchNo: 'GZ-QC-202604-005', herbName: '金钗石斛', specification: '普通/枫斗',
    sampleAmount: 200, submitter: '陈仓库', submitDate: '2026-04-25',
    items: [
      { item: 'dendrobine', itemLabel: '石斛碱含量', unit: '%', limit: '≥30%' },
      { item: 'moisture', itemLabel: '含水率', unit: '%', limit: '≤12%' },
      { item: 'heavyMetalPb', itemLabel: '重金属-铅(Pb)', unit: 'mg/kg', limit: '≤5mg/kg' },
      { item: 'heavyMetalCd', itemLabel: '重金属-镉(Cd)', unit: 'mg/kg', limit: '≤0.3mg/kg' },
    ],
    overallResult: 'pending', status: 'assigned', tester: '赵检测员', createdAt: '2026-04-25',
  },
  {
    id: 6, batchNo: 'GZ-QC-202604-006', herbName: '金钗石斛', specification: '特选/枫斗',
    sampleAmount: 350, submitter: '周仓库', submitDate: '2026-04-26',
    items: [
      { item: 'dendrobine', itemLabel: '石斛碱含量', unit: '%', limit: '≥30%' },
      { item: 'moisture', itemLabel: '含水率', unit: '%', limit: '≤12%' },
      { item: 'heavyMetalPb', itemLabel: '重金属-铅(Pb)', unit: 'mg/kg', limit: '≤5mg/kg' },
      { item: 'heavyMetalCd', itemLabel: '重金属-镉(Cd)', unit: 'mg/kg', limit: '≤0.3mg/kg' },
      { item: 'pesticideOP', itemLabel: '有机磷农药残留', unit: 'mg/kg', limit: '≤0.05mg/kg' },
    ],
    overallResult: 'pending', status: 'submitted', createdAt: '2026-04-26',
  },
];

// ============================================================
// Mock 质量标准数据
// ============================================================
const mockStandards: QualityStandard[] = [
  { id: 1, name: '中国药典2020版 — 金钗石斛', source: 'chp2020', herbName: '金钗石斛', dendrobineMin: 30, moistureMax: 12, heavyMetalPbMax: 5, heavyMetalCdMax: 0.3, pesticideMax: 0.05, microbialLimit: '需氧菌总数≤10⁵cfu/g', description: '依据《中华人民共和国药典》2020年版一部', updatedAt: '2026-01-15' },
  { id: 2, name: '企业内控标准 — 特级枫斗', source: 'enterprise', herbName: '金钗石斛', dendrobineMin: 35, moistureMax: 10, heavyMetalPbMax: 4, heavyMetalCdMax: 0.2, pesticideMax: 0.03, microbialLimit: '需氧菌总数≤10⁴cfu/g', description: '企业内控标准，严于药典', updatedAt: '2026-02-01' },
];

// ============================================================
// Mock 预警数据
// ============================================================
const mockWarnings: QualityWarning[] = [
  { id: 1, batchNo: 'GZ-QC-202604-003', herbName: '金钗石斛', warningType: 'moisture', level: 'warning', description: '批次GZ-QC-202604-003含水率13.5%，超出标准上限12%', createdAt: '2026-04-19', status: 'active' },
  { id: 2, batchNo: 'KC-202512-015', herbName: '金钗石斛', warningType: 'expiry', level: 'warning', description: '库存批次KC-202512-015距有效期不足30天', createdAt: '2026-04-20', status: 'active' },
  { id: 3, batchNo: 'KC-202511-008', herbName: '金钗石斛', warningType: 'heavyMetal', level: 'critical', description: '批次KC-202511-008重金属铅含量接近临界值，需重点监控', createdAt: '2026-04-18', status: 'resolved', resolvedAt: '2026-04-19' },
  { id: 4, batchNo: 'CK-202512-003', herbName: '金钗石斛', warningType: 'recall', level: 'critical', description: '根据药监局通知，批次CK-202512-003需启动召回程序', createdAt: '2026-04-15', status: 'resolved', resolvedAt: '2026-04-17' },
];

// ============================================================
// Mock 溯源数据
// ============================================================
const mockTrace: TraceRecord[] = [
  { id: 1, traceCode: '7S-T-20260401-A01', batchNo: 'GZ-QC-202604-001', herbName: '金钗石斛', baseName: '官渡镇石斛林下经济示范园', plantingDate: '2023-04-15', harvestDate: '2026-03-20', processingDate: '2026-03-25', warehouseInDate: '2026-04-05', currentLocation: '赤水金钗石斛7S产地仓-A区-03', status: 'traceable', chainCount: 5, currentStatus: '已完成', chainStatus: 'valid' as const, createdAt: '2026-04-01' },
  { id: 2, traceCode: '7S-T-20260401-B02', batchNo: 'GZ-QC-202604-002', herbName: '金钗石斛', baseName: '长期镇石斛产业园', plantingDate: '2023-05-10', harvestDate: '2026-03-25', processingDate: '2026-03-30', warehouseInDate: '2026-04-08', currentLocation: '赤水金钗石斛7S产地仓-B区-07', status: 'traceable', chainCount: 5, currentStatus: '已完成', chainStatus: 'valid' as const, createdAt: '2026-04-01' },
  { id: 3, traceCode: '7S-T-20260402-C03', batchNo: 'GZ-QC-202604-003', herbName: '金钗石斛', baseName: '大同镇种植基地', plantingDate: '2023-06-01', harvestDate: '2026-04-02', processingDate: '2026-04-06', warehouseInDate: '2026-04-12', currentLocation: '赤水金钗石斛7S产地仓-C区-02', status: 'partial', chainCount: 3, currentStatus: '进行中', chainStatus: 'unknown' as const, createdAt: '2026-04-02' },
  { id: 4, traceCode: '7S-T-20260315-D04', batchNo: 'GZ-QC-202603-005', herbName: '金钗石斛', baseName: '丙安镇种植合作社', plantingDate: '2023-07-15', harvestDate: '2026-02-20', processingDate: '2026-02-25', warehouseInDate: '2026-03-10', currentLocation: '已出库', status: 'traceable', chainCount: 5, currentStatus: '已交付', chainStatus: 'valid' as const, createdAt: '2026-03-15' },
];

// ============================================================
// Mock 月度合格率趋势
// ============================================================
const monthlyPassRate = [
  { month: '2025-07', rate: 88, tested: 12 },
  { month: '2025-08', rate: 91, tested: 14 },
  { month: '2025-09', rate: 85, tested: 16 },
  { month: '2025-10', rate: 93, tested: 15 },
  { month: '2025-11', rate: 90, tested: 18 },
  { month: '2025-12', rate: 95, tested: 20 },
  { month: '2026-01', rate: 92, tested: 13 },
  { month: '2026-02', rate: 89, tested: 11 },
  { month: '2026-03', rate: 94, tested: 19 },
  { month: '2026-04', rate: 96, tested: 22 },
];

// ============================================================
// KPI 卡片
// ============================================================
interface KpiProps { title: string; value: number | string; suffix?: string; valueStyle?: React.CSSProperties; icon: React.ReactNode; iconBg: string; iconColor: string; }
const KpiCard: React.FC<KpiProps> = ({ title, value, suffix, valueStyle, icon, iconBg, iconColor }) => (
  <Card bordered={false} style={{ borderRadius: 12 }} styles={{ body: { padding: '16px 20px' } }} className="card-interactive">
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-1">
        <span style={{ fontSize: 12, color: '#64748b' }}>{title}</span>
        <div className="flex items-baseline gap-1">
          <span style={{ fontSize: 24, fontWeight: 700, color: '#1e293b', lineHeight: 1, ...valueStyle }}>
            {typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </span>
        </div>
      </div>
      <div style={{ width: 46, height: 46, borderRadius: 10, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: iconColor }}>
        {icon}
      </div>
    </div>
  </Card>
);

// ============================================================
// 主组件
// ============================================================
const QualityControl: React.FC = () => {
  const [tests] = useState<QualityTest[]>(mockTests);
  const [warnings] = useState<QualityWarning[]>(mockWarnings);
  const [standards] = useState<QualityStandard[]>(mockStandards);
  const [activeTab, setActiveTab] = useState('inspection');

  // 检测 Modal
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testModalMode, setTestModalMode] = useState<'add' | 'view'>('add');
  const [viewingTest, setViewingTest] = useState<QualityTest | null>(null);
  const [testForm] = Form.useForm();

  // 溯源 Drawer
  const [traceDrawerOpen, setTraceDrawerOpen] = useState(false);
  const [viewingTrace, setViewingTrace] = useState<TraceRecord | null>(null);

  // ============================================================
  // KPI 计算
  // ============================================================
  const kpiData = {
    totalTests: tests.length,
    passedTests: tests.filter((t) => t.overallResult === 'pass').length,
    pendingTests: tests.filter((t) => t.overallResult === 'pending').length,
    failTests: tests.filter((t) => t.overallResult === 'fail').length,
    passRate: tests.length > 0 ? Math.round((tests.filter((t) => t.overallResult === 'pass').length / tests.filter((t) => t.overallResult !== 'pending').length) * 100) : 0,
    activeWarnings: warnings.filter((w) => w.status === 'active').length,
    criticalWarnings: warnings.filter((w) => w.status === 'active' && w.level === 'critical').length,
    traceableRate: Math.round((mockTrace.filter((t) => t.status === 'traceable').length / mockTrace.length) * 100),
    totalStandards: standards.length,
  };

  // ============================================================
  // 雷达图 — 当前批次 vs 药典标准
  // ============================================================
  const radarOption = {
    tooltip: {},
    legend: { data: ['当前批次', '药典标准'], bottom: 0, textStyle: { fontSize: 11, color: '#64748b' } },
    radar: {
      indicator: [
        { name: '石斛碱含量', max: 100 },
        { name: '水分控制', max: 100 },
        { name: '重金属-铅', max: 100 },
        { name: '重金属-镉', max: 100 },
        { name: '有机磷农残', max: 100 },
      ],
      center: ['50%', '50%'],
      radius: '65%',
      axisName: { color: '#64748b', fontSize: 11 },
      splitArea: { areaStyle: { color: ['rgba(16,185,129,0.03)', 'rgba(16,185,129,0.06)'] } },
      splitLine: { lineStyle: { color: '#e2e8f0' } },
      axisLine: { lineStyle: { color: '#e2e8f0' } },
    },
    series: [{
      type: 'radar',
      data: [
        {
          value: [85, 92, 95, 94, 90],
          name: '当前批次',
          lineStyle: { color: CHART_COLORS.primary, width: 2 },
          areaStyle: { color: 'rgba(16,185,129,0.2)' },
          itemStyle: { color: CHART_COLORS.primary },
          symbol: 'circle', symbolSize: 5,
        },
        {
          value: [80, 80, 80, 80, 80],
          name: '药典标准',
          lineStyle: { color: CHART_COLORS.accent, width: 2, type: 'dashed' },
          areaStyle: { color: 'rgba(245,158,11,0.08)' },
          itemStyle: { color: CHART_COLORS.accent },
          symbol: 'rect', symbolSize: 4,
        },
      ],
    }],
  };

  // 月度合格率趋势
  const passRateOption = {
    tooltip: {
      trigger: 'axis',
      formatter: (params: { name: string; value: number }[]) =>
        `<b>${params[0].name}</b><br/>合格率：<b>${params[0].value}%</b>`,
    },
    grid: { left: 40, right: 20, top: 10, bottom: 30 },
    xAxis: {
      type: 'category',
      data: monthlyPassRate.map((d) => d.month.slice(5) + '月'),
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisLabel: { fontSize: 10, color: '#64748b' },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value', max: 100,
      axisLine: { show: false }, axisTick: { show: false },
      splitLine: { lineStyle: { color: '#f1f5f9' } },
      axisLabel: { fontSize: 10, color: '#94a3b8', formatter: (v: number) => `${v}%` },
    },
    series: [{
      type: 'line',
      data: monthlyPassRate.map((d) => d.rate),
      smooth: true, symbol: 'circle', symbolSize: 6,
      lineStyle: { color: CHART_COLORS.primary, width: 2 },
      itemStyle: { color: CHART_COLORS.primary },
      areaStyle: { color: 'rgba(16,185,129,0.1)' },
      markLine: {
        silent: true,
        lineStyle: { color: '#ef4444', type: 'dashed' },
        data: [{ yAxis: 80 }],
        label: { formatter: '药典基线80%', fontSize: 9, color: '#ef4444' },
      },
    }],
  };

  // 检测项合格率
  const itemPassRateOption = {
    tooltip: { trigger: 'axis' as const, axisPointer: { type: 'shadow' as const } },
    grid: { left: 120, right: 20, top: 10, bottom: 10 },
    xAxis: { type: 'value' as const, max: 100, axisLine: { show: false }, axisTick: { show: false }, splitLine: { lineStyle: { color: '#f1f5f9' } }, axisLabel: { fontSize: 9, color: '#94a3b8', formatter: (v: number) => `${v}%` } },
    yAxis: { type: 'category' as const, data: ['有机磷农残', '重金属-镉', '重金属-铅', '含水率', '石斛碱含量'], axisLine: { show: false }, axisTick: { show: false }, axisLabel: { fontSize: 10, color: '#64748b' } },
    series: [{
      type: 'bar' as const, data: [98, 96, 95, 92, 90],
      itemStyle: { color: (params: { value: number }) => params.value >= 90 ? CHART_COLORS.primary : params.value >= 80 ? CHART_COLORS.accent : '#ef4444', borderRadius: [0, 4, 4, 0] },
      barWidth: '50%',
    }],
  };

  // ============================================================
  // 表格列
  // ============================================================
  const testColumns: ColumnsType<QualityTest> = [
    {
      title: '批次号', dataIndex: 'batchNo', key: 'batchNo', width: 160,
      render: (no: string) => <span style={{ fontFamily: 'monospace', color: '#6366f1', fontWeight: 600 }}>{no}</span>,
    },
    { title: '药材', dataIndex: 'herbName', key: 'herbName', width: 100 },
    { title: '规格', dataIndex: 'specification', key: 'specification', width: 100, ellipsis: true },
    { title: '送检人', dataIndex: 'submitter', key: 'submitter', width: 90 },
    { title: '送检日期', dataIndex: 'submitDate', key: 'submitDate', width: 110 },
    {
      title: '检测状态', dataIndex: 'status', key: 'status', width: 100,
      render: (s: InspectionStatus) => <Tag color={INSPECTION_STATUS_COLOR[s]}>{INSPECTION_STATUS_MAP[s]}</Tag>,
    },
    {
      title: '判定结果', dataIndex: 'overallResult', key: 'overallResult', width: 100,
      render: (r: TestResult) => r === 'pass' ? (
        <Tag color="green" icon={<CheckCircleOutlined />}>合格</Tag>
      ) : r === 'fail' ? (
        <Tag color="red" icon={<CloseCircleOutlined />}>不合格</Tag>
      ) : (
        <Tag color="default">待检</Tag>
      ),
    },
    {
      title: '操作', key: 'action', width: 90,
      render: (_: unknown, record: QualityTest) => (
        <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => { setViewingTest(record); setTestModalMode('view'); setTestModalOpen(true); }}>详情</Button>
      ),
    },
  ];

  const warningColumns: ColumnsType<QualityWarning> = [
    { title: '批次号', dataIndex: 'batchNo', key: 'batchNo', width: 160, render: (no: string) => <span style={{ fontFamily: 'monospace', color: '#6366f1' }}>{no}</span> },
    { title: '药材', dataIndex: 'herbName', key: 'herbName', width: 100 },
    {
      title: '预警类型', dataIndex: 'warningType', key: 'warningType', width: 120,
      render: (t: string) => <Tag color="orange">{WARNING_TYPE_LABEL[t as keyof typeof WARNING_TYPE_LABEL]}</Tag>,
    },
    {
      title: '级别', dataIndex: 'level', key: 'level', width: 80,
      render: (l: string) => {
        const colorMap: Record<string, string> = { info: 'blue', warning: 'orange', critical: 'red' };
        return <Badge status={colorMap[l] as any} text={l === 'info' ? '提示' : l === 'warning' ? '警告' : '紧急'} />;
      },
    },
    { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
    { title: '产生时间', dataIndex: 'createdAt', key: 'createdAt', width: 110 },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 90,
      render: (s: string) => <Tag color={s === 'active' ? 'red' : 'green'}>{s === 'active' ? '未处理' : '已处理'}</Tag>,
    },
    {
      title: '操作', key: 'action', width: 90,
      render: (_: unknown, record: QualityWarning) => record.status === 'active' ? (
        <Popconfirm title="确认处理此预警？" onConfirm={() => message.success('预警已处理')} okText="确认">
          <Button type="link" size="small" icon={<CheckCircleOutlined />}>处理</Button>
        </Popconfirm>
      ) : <span style={{ color: '#cbd5e1' }}>—</span>,
    },
  ];

  const standardColumns: ColumnsType<QualityStandard> = [
    {
      title: '标准名称', dataIndex: 'name', key: 'name', ellipsis: true,
      render: (n: string, r: QualityStandard) => (
        <div>
          <div style={{ fontWeight: 600 }}>{n}</div>
          <Tag color={r.source === 'chp2020' ? 'blue' : 'gold'} style={{ fontSize: 10, marginTop: 2 }}>
            {r.source === 'chp2020' ? '中国药典2020' : '企业标准'}
          </Tag>
        </div>
      ),
    },
    { title: '药材', dataIndex: 'herbName', key: 'herbName', width: 100 },
    { title: '石斛碱≥', dataIndex: 'dendrobineMin', key: 'dendrobineMin', width: 80, align: 'center', render: (v: number) => `${v}%` },
    { title: '水分≤', dataIndex: 'moistureMax', key: 'moistureMax', width: 80, align: 'center', render: (v: number) => `${v}%` },
    { title: '铅≤', dataIndex: 'heavyMetalPbMax', key: 'heavyMetalPbMax', width: 80, align: 'center', render: (v: number) => `${v}mg/kg` },
    { title: '镉≤', dataIndex: 'heavyMetalCdMax', key: 'heavyMetalCdMax', width: 80, align: 'center', render: (v: number) => `${v}mg/kg` },
    { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt', width: 110 },
  ];

  const traceColumns: ColumnsType<TraceRecord> = [
    {
      title: '溯源码', dataIndex: 'traceCode', key: 'traceCode', width: 170,
      render: (c: string) => <span style={{ fontFamily: 'monospace', color: '#6366f1', fontWeight: 600 }}>{c}</span>,
    },
    { title: '批次号', dataIndex: 'batchNo', key: 'batchNo', width: 160, render: (n: string) => <span style={{ fontFamily: 'monospace' }}>{n}</span> },
    { title: '药材', dataIndex: 'herbName', key: 'herbName', width: 90 },
    { title: '种植基地', dataIndex: 'baseName', key: 'baseName', ellipsis: true },
    {
      title: '溯源状态', dataIndex: 'status', key: 'status', width: 100,
      render: (s: TraceRecord['status']) => <Tag color={TRACE_STATUS_COLOR[s]}>{TRACE_STATUS_MAP[s]}</Tag>,
    },
    {
      title: '链路节点', dataIndex: 'chainCount', key: 'chainCount', width: 100, align: 'center',
      render: (n: number) => <span style={{ color: '#10b981', fontWeight: 600 }}>{n} 个节点</span>,
    },
    {
      title: '当前库位', dataIndex: 'currentLocation', key: 'currentLocation', ellipsis: true,
    },
    {
      title: '操作', key: 'action', width: 90,
      render: (_: unknown, record: TraceRecord) => (
        <Button type="link" size="small" icon={<NodeIndexOutlined />} onClick={() => { setViewingTrace(record); setTraceDrawerOpen(true); }}>链路</Button>
      ),
    },
  ];

  // ============================================================
  // Tab 配置
  // ============================================================
  const tabItems = [
    {
      key: 'inspection',
      label: <span><ExperimentOutlined /> 质量检测</span>,
      children: (
        <>
          <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
            <Col xs={12} sm={6}>
              <KpiCard title="送检批次" value={kpiData.totalTests} suffix="批次" icon={<ExperimentOutlined />} iconBg="rgba(99,102,241,0.1)" iconColor="#6366f1" />
            </Col>
            <Col xs={12} sm={6}>
              <KpiCard title="合格率" value={kpiData.passRate} suffix="%" valueStyle={{ color: '#10b981' }} icon={<SafetyOutlined />} iconBg="rgba(16,185,129,0.1)" iconColor="#10b981" />
            </Col>
            <Col xs={12} sm={6}>
              <KpiCard title="待检批次" value={kpiData.pendingTests} suffix="批次" valueStyle={{ color: '#f59e0b' }} icon={<ClockCircleOutlined />} iconBg="rgba(245,158,11,0.1)" iconColor="#f59e0b" />
            </Col>
            <Col xs={12} sm={6}>
              <KpiCard title="不合格批次" value={kpiData.failTests} suffix="批次" valueStyle={{ color: '#ef4444' }} icon={<CloseCircleOutlined />} iconBg="rgba(239,68,68,0.1)" iconColor="#ef4444" />
            </Col>
          </Row>
          <Card bordered={false} style={{ borderRadius: 8, marginBottom: 12 }} styles={{ body: { padding: '12px 16px' } }}>
            <Row gutter={12} align="middle">
              <Col xs={24} sm={12} md={8}>
                <Input prefix={<SearchOutlined style={{ color: '#94a3b8' }} />} placeholder="搜索批次号/药材" allowClear />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Select placeholder="检测状态" allowClear style={{ width: '100%' }} options={[
                  { value: 'submitted', label: '已提交' },
                  { value: 'assigned', label: '已分配' },
                  { value: 'testing', label: '检测中' },
                  { value: 'reported', label: '已出报告' },
                ]} />
              </Col>
              <Col style={{ marginLeft: 'auto' }}>
                <Space>
                  <Button icon={<SyncOutlined />}>同步药监</Button>
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => { testForm.resetFields(); setTestModalMode('add'); setTestModalOpen(true); }}>新增送检</Button>
                </Space>
              </Col>
            </Row>
          </Card>
          <Card bordered={false} style={{ borderRadius: 8 }} styles={{ body: { padding: 0 } }}>
            <Table columns={testColumns} dataSource={tests} rowKey="id" pagination={{ pageSize: 8, showTotal: (t) => `共 ${t} 条` }} size="middle" />
          </Card>
        </>
      ),
    },
    {
      key: 'standards',
      label: <span><SafetyOutlined /> 标准管理</span>,
      children: (
        <>
          <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
            <Col xs={12} sm={8}>
              <KpiCard title="已建标准" value={kpiData.totalStandards} suffix="项" icon={<SafetyOutlined />} iconBg="rgba(6,182,212,0.1)" iconColor="#06b6d4" />
            </Col>
            <Col xs={12} sm={8}>
              <KpiCard title="药典标准" value={standards.filter((s) => s.source === 'chp2020').length} suffix="项" icon={<FileTextOutlined />} iconBg="rgba(99,102,241,0.1)" iconColor="#6366f1" />
            </Col>
            <Col xs={12} sm={8}>
              <KpiCard title="企业标准" value={standards.filter((s) => s.source === 'enterprise').length} suffix="项" icon={<DatabaseOutlined />} iconBg="rgba(245,158,11,0.1)" iconColor="#f59e0b" />
            </Col>
          </Row>
          <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
            <Col xs={24} xl={14}>
              <Card bordered={false} style={{ borderRadius: 8 }} headStyle={{ fontSize: 13, fontWeight: 600, borderBottom: '1px solid #f1f5f9' }} title={<span style={{ color: '#374151' }}>质量标准库</span>}>
                <Table columns={standardColumns} dataSource={standards} rowKey="id" pagination={false} size="middle" />
              </Card>
            </Col>
            <Col xs={24} xl={10}>
              <Card bordered={false} style={{ borderRadius: 8 }} headStyle={{ fontSize: 13, fontWeight: 600, borderBottom: '1px solid #f1f5f9' }} title={<span style={{ color: '#374151' }}>检测项合格率</span>}>
                <ReactECharts option={itemPassRateOption} style={{ height: 220 }} />
              </Card>
            </Col>
          </Row>
          {/* 药典简介卡片 */}
          <Card bordered={false} style={{ borderRadius: 8 }} headStyle={{ fontSize: 13, fontWeight: 600, borderBottom: '1px solid #f1f5f9' }} title={<span style={{ color: '#374151' }}>《中国药典》2020版 — 金钗石斛质量标准</span>}>
            <Row gutter={[16, 12]}>
              {[
                { label: '石斛碱含量', value: '≥30%（干燥品）', color: CHART_COLORS.primary },
                { label: '水分', value: '≤12.0%', color: CHART_COLORS.secondary },
                { label: '总灰分', value: '≤6.0%', color: CHART_COLORS.accent },
                { label: '重金属及有害元素', value: '铅≤5mg/kg; 镉≤0.3mg/kg; 砷≤2mg/kg; 汞≤0.2mg/kg', color: CHART_COLORS.red },
                { label: '有机磷农药残留', value: '每1g含总农药≤0.5mg', color: CHART_COLORS.purple },
                { label: '浸出物', value: '≥6.5%（醇溶性浸出物）', color: CHART_COLORS.pink },
              ].map((item, i) => (
                <Col xs={24} sm={12} md={8} key={i}>
                  <div style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${item.color}30`, background: `${item.color}06` }}>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: item.color }}>{item.value}</div>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </>
      ),
    },
    {
      key: 'warnings',
      label: (
        <span>
          <WarningOutlined /> 预警中心
          {kpiData.activeWarnings > 0 && <Tag color="red" style={{ marginLeft: 6, fontSize: 10 }}>{kpiData.activeWarnings}</Tag>}
        </span>
      ),
      children: (
        <>
          <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
            <Col xs={12} sm={8}>
              <KpiCard title="活跃预警" value={kpiData.activeWarnings} suffix="条" valueStyle={{ color: '#ef4444' }} icon={<WarningOutlined />} iconBg="rgba(239,68,68,0.1)" iconColor="#ef4444" />
            </Col>
            <Col xs={12} sm={8}>
              <KpiCard title="紧急预警" value={kpiData.criticalWarnings} suffix="条" valueStyle={{ color: '#ef4444' }} icon={<AlertOutlined />} iconBg="rgba(239,68,68,0.15)" iconColor="#dc2626" />
            </Col>
            <Col xs={12} sm={8}>
              <KpiCard title="已处理预警" value={warnings.filter((w) => w.status === 'resolved').length} suffix="条" valueStyle={{ color: '#10b981' }} icon={<CheckCircleOutlined />} iconBg="rgba(16,185,129,0.1)" iconColor="#10b981" />
            </Col>
          </Row>
          {/* 紧急预警 Alert */}
          {kpiData.criticalWarnings > 0 && (
            <Alert
              message={`当前存在 ${kpiData.criticalWarnings} 条紧急预警，请立即处理`}
              type="error"
              showIcon
              icon={<WarningOutlined />}
              action={<Button size="small" danger onClick={() => setActiveTab('warnings')}>立即处理</Button>}
              style={{ marginBottom: 12, borderRadius: 8 }}
            />
          )}
          <Card bordered={false} style={{ borderRadius: 8 }} styles={{ body: { padding: 0 } }}>
            <Table columns={warningColumns} dataSource={warnings} rowKey="id" pagination={{ pageSize: 8 }} size="middle" />
          </Card>
        </>
      ),
    },
    {
      key: 'trace',
      label: <span><NodeIndexOutlined /> 合规溯源</span>,
      children: (
        <>
          <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
            <Col xs={12} sm={8}>
              <KpiCard title="可溯源批次" value={mockTrace.filter((t) => t.status === 'traceable').length} suffix="批次" valueStyle={{ color: '#10b981' }} icon={<NodeIndexOutlined />} iconBg="rgba(16,185,129,0.1)" iconColor="#10b981" />
            </Col>
            <Col xs={12} sm={8}>
              <KpiCard title="溯源覆盖率" value={kpiData.traceableRate} suffix="%" valueStyle={{ color: '#6366f1' }} icon={<RiseOutlined />} iconBg="rgba(99,102,241,0.1)" iconColor="#6366f1" />
            </Col>
            <Col xs={12} sm={8}>
              <KpiCard title="总链路节点" value={mockTrace.reduce((s, t) => s + t.chainCount, 0)} suffix="个" icon={<NodeIndexOutlined />} iconBg="rgba(6,182,212,0.1)" iconColor="#06b6d4" />
            </Col>
          </Row>
          <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
            <Col xs={24} xl={10}>
              <Card bordered={false} style={{ borderRadius: 8 }} headStyle={{ fontSize: 13, fontWeight: 600, borderBottom: '1px solid #f1f5f9' }} title={<span style={{ color: '#374151' }}>批次溯源列表</span>}>
                <Table columns={traceColumns} dataSource={mockTrace} rowKey="id" pagination={{ pageSize: 8 }} size="middle" />
              </Card>
            </Col>
            <Col xs={24} xl={14}>
              <Card bordered={false} style={{ borderRadius: 8 }} headStyle={{ fontSize: 13, fontWeight: 600, borderBottom: '1px solid #f1f5f9' }} title={<span style={{ color: '#374151' }}>质量雷达 — 当前批次 vs 药典标准</span>}>
                <ReactECharts option={radarOption} style={{ height: 300 }} />
              </Card>
            </Col>
          </Row>
          {/* 溯源链路说明 */}
          <Card bordered={false} style={{ borderRadius: 8 }} headStyle={{ fontSize: 13, fontWeight: 600, borderBottom: '1px solid #f1f5f9' }} title={<span style={{ color: '#374151' }}>溯源链路节点说明</span>}>
            <Timeline
              items={[
                { color: 'green', children: <div><div style={{ fontWeight: 600 }}>节点1：种植档案</div><div style={{ fontSize: 12, color: '#94a3b8' }}>基地信息、种植日期、农事记录（施肥/用药/采收）</div></div> },
                { color: 'green', children: <div><div style={{ fontWeight: 600 }}>节点2：采收记录</div><div style={{ fontSize: 12, color: '#94a3b8' }}>采收时间、批次号、初加工方式</div></div> },
                { color: 'blue', children: <div><div style={{ fontWeight: 600 }}>节点3：质量检测</div><div style={{ fontSize: 12, color: '#94a3b8' }}>送检记录、检测报告、各项指标数据</div></div> },
                { color: 'cyan', children: <div><div style={{ fontWeight: 600 }}>节点4：入库仓储</div><div style={{ fontSize: 12, color: '#94a3b8' }}>仓库、库位、温湿度监控数据</div></div> },
                { color: 'purple', children: <div><div style={{ fontWeight: 600 }}>节点5：出库流通</div><div style={{ fontSize: 12, color: '#94a3b8' }}>出库时间、物流信息、销售去向</div></div> },
              ]}
            />
          </Card>
        </>
      ),
    },
    {
      key: 'stats',
      label: <span><RiseOutlined /> 质量统计</span>,
      children: (
        <>
          <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
            <Col xs={12} sm={6}>
              <KpiCard title="本月送检" value={kpiData.totalTests} suffix="批次" icon={<ExperimentOutlined />} iconBg="rgba(99,102,241,0.1)" iconColor="#6366f1" />
            </Col>
            <Col xs={12} sm={6}>
              <KpiCard title="本月合格率" value={kpiData.passRate} suffix="%" valueStyle={{ color: '#10b981' }} icon={<SafetyOutlined />} iconBg="rgba(16,185,129,0.1)" iconColor="#10b981" />
            </Col>
            <Col xs={12} sm={6}>
              <KpiCard title="活跃预警" value={kpiData.activeWarnings} suffix="条" valueStyle={{ color: '#ef4444' }} icon={<WarningOutlined />} iconBg="rgba(239,68,68,0.1)" iconColor="#ef4444" />
            </Col>
            <Col xs={12} sm={6}>
              <KpiCard title="溯源覆盖率" value={kpiData.traceableRate} suffix="%" valueStyle={{ color: '#6366f1' }} icon={<NodeIndexOutlined />} iconBg="rgba(99,102,241,0.1)" iconColor="#6366f1" />
            </Col>
          </Row>
          <Row gutter={[12, 12]}>
            <Col xs={24} xl={12}>
              <Card bordered={false} style={{ borderRadius: 8 }} headStyle={{ fontSize: 13, fontWeight: 600, borderBottom: '1px solid #f1f5f9' }} title={<span style={{ color: '#374151' }}>月度合格率趋势</span>}>
                <ReactECharts option={passRateOption} style={{ height: 280 }} />
              </Card>
            </Col>
            <Col xs={24} xl={12}>
              <Card bordered={false} style={{ borderRadius: 8 }} headStyle={{ fontSize: 13, fontWeight: 600, borderBottom: '1px solid #f1f5f9' }} title={<span style={{ color: '#374151' }}>各检测项合格率</span>}>
                <ReactECharts option={itemPassRateOption} style={{ height: 280 }} />
              </Card>
            </Col>
          </Row>
          {/* 质量统计表格 */}
          <Card bordered={false} style={{ borderRadius: 8, marginTop: 12 }} headStyle={{ fontSize: 13, fontWeight: 600, borderBottom: '1px solid #f1f5f9' }} title={<span style={{ color: '#374151' }}>月度检测明细</span>}>
            <Table
              dataSource={monthlyPassRate.map((m) => ({ month: m.month, passRate: m.rate, tested: m.tested, passed: Math.round(m.tested * m.rate / 100), failed: m.tested - Math.round(m.tested * m.rate / 100) }))}
              rowKey="month"
              pagination={false}
              size="small"
              columns={[
                { title: '月份', dataIndex: 'month', key: 'month', width: 100 },
                { title: '送检批次', dataIndex: 'tested', key: 'tested', width: 100, align: 'center' },
                { title: '合格批次', dataIndex: 'passed', key: 'passed', width: 100, align: 'center', render: (v: number) => <span style={{ color: '#10b981', fontWeight: 600 }}>{v}</span> },
                { title: '不合格批次', dataIndex: 'failed', key: 'failed', width: 100, align: 'center', render: (v: number) => <span style={{ color: '#ef4444' }}>{v}</span> },
                {
                  title: '合格率', dataIndex: 'passRate', key: 'passRate', width: 200,
                  render: (v: number) => (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Progress percent={v} size="small" showInfo={false} strokeColor={v >= 90 ? '#10b981' : v >= 80 ? '#f59e0b' : '#ef4444'} trailColor="#e2e8f0" style={{ flex: 1 }} />
                      <span style={{ fontSize: 11, fontWeight: 600, color: v >= 90 ? '#10b981' : v >= 80 ? '#f59e0b' : '#ef4444' }}>{v}%</span>
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 16 }}>
        <h3 className="page-title" style={{ margin: '0 0 4px' }}>产业监管与质控系统</h3>
        <p className="page-desc">对接药监部门，实现中药材质量全程可追溯与合规监管</p>
      </div>

      <Tabs activeKey={activeTab} onChange={(k) => setActiveTab(k)} items={tabItems} />

      {/* 检测详情 Modal */}
      <Modal
        title={testModalMode === 'add' ? '新增送检申请' : '检测详情'}
        open={testModalOpen}
        onCancel={() => setTestModalOpen(false)}
        footer={testModalMode === 'add' ? (
          <>
            <Button onClick={() => setTestModalOpen(false)}>取消</Button>
            <Button type="primary" onClick={() => { message.success('送检申请已提交'); setTestModalOpen(false); }}>提交申请</Button>
          </>
        ) : null}
        width={700}
        cancelText="关闭"
      >
        {viewingTest ? (
          <>
            <Descriptions column={2} bordered size="small" style={{ marginTop: 16 }}>
              <Descriptions.Item label="批次号" span={2}>
                <span style={{ fontFamily: 'monospace', color: '#6366f1', fontWeight: 600 }}>{viewingTest.batchNo}</span>
              </Descriptions.Item>
              <Descriptions.Item label="药材">{viewingTest.herbName}</Descriptions.Item>
              <Descriptions.Item label="规格">{viewingTest.specification}</Descriptions.Item>
              <Descriptions.Item label="送检人">{viewingTest.submitter}</Descriptions.Item>
              <Descriptions.Item label="送检日期">{viewingTest.submitDate}</Descriptions.Item>
              <Descriptions.Item label="检测员">{viewingTest.tester || '待分配'}</Descriptions.Item>
              <Descriptions.Item label="检测日期">{viewingTest.testDate || '待检测'}</Descriptions.Item>
              <Descriptions.Item label="报告编号">{viewingTest.reportNo || '—'}</Descriptions.Item>
              <Descriptions.Item label="检测状态"><Tag color={INSPECTION_STATUS_COLOR[viewingTest.status]}>{INSPECTION_STATUS_MAP[viewingTest.status]}</Tag></Descriptions.Item>
              <Descriptions.Item label="判定结果">
                {viewingTest.overallResult === 'pass' ? <Tag color="green" icon={<CheckCircleOutlined />}>合格</Tag>
                  : viewingTest.overallResult === 'fail' ? <Tag color="red" icon={<CloseCircleOutlined />}>不合格</Tag>
                    : <Tag>待检</Tag>}
              </Descriptions.Item>
              {viewingTest.remark && <Descriptions.Item label="备注" span={2}>{viewingTest.remark}</Descriptions.Item>}
            </Descriptions>
            <Divider>检测项目明细</Divider>
            <Table
              dataSource={viewingTest.items}
              rowKey="item"
              pagination={false}
              size="small"
              columns={[
                { title: '检测项目', dataIndex: 'itemLabel', key: 'itemLabel' },
                { title: '检测结果', dataIndex: 'result', key: 'result', align: 'center', render: (v: number | undefined) => v !== undefined ? `${v} ${viewingTest.items.find((i) => i.result === v)?.unit || ''}` : '—' },
                { title: '标准限值', dataIndex: 'limit', key: 'limit', align: 'center' },
                {
                  title: '判定', dataIndex: 'isPass', key: 'isPass', align: 'center',
                  render: (p: boolean | undefined) => p === true ? <Tag color="green" icon={<CheckCircleOutlined />}>合格</Tag>
                    : p === false ? <Tag color="red" icon={<CloseCircleOutlined />}>不合格</Tag>
                      : <Tag color="default">—</Tag>,
                },
              ]}
              footer={() => (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: '#64748b' }}>依据：《中国药典》2020年版一部 金钗石斛</span>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>
                    综合判定：
                    {viewingTest.overallResult === 'pass' ? <span style={{ color: '#10b981' }}> 合格</span>
                      : viewingTest.overallResult === 'fail' ? <span style={{ color: '#ef4444' }}> 不合格</span>
                        : <span style={{ color: '#64748b' }}> 待检</span>}
                  </span>
                </div>
              )}
            />
          </>
        ) : (
          <Form form={testForm} layout="vertical" style={{ marginTop: 16 }}>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item label="批次号" name="batchNo" rules={[{ required: true, message: '请输入批次号' }]}>
                  <Input placeholder="如 GZ-QC-202604-001" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="药材名称" name="herbName" rules={[{ required: true, message: '请输入药材名称' }]}>
                  <Input defaultValue="金钗石斛" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="规格" name="specification" rules={[{ required: true, message: '请选择规格' }]}>
                  <Select placeholder="请选择规格">
                    {['特级/枫斗', '优等/枫斗', '统货/枫斗', '特级/鲜条', '统货/鲜条', '优等/切片', '普通/枫斗'].map((s) => <Select.Option key={s} value={s}>{s}</Select.Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="送检人" name="submitter" rules={[{ required: true, message: '请输入送检人' }]}>
                  <Input placeholder="请输入送检人姓名" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="送检日期" name="submitDate" rules={[{ required: true, message: '请选择送检日期' }]}>
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="样品数量" name="sampleAmount">
                  <InputNumber min={0} style={{ width: '100%' }} addonAfter="g" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="备注" name="remark">
                  <Input.TextArea rows={2} placeholder="备注信息（可选）" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
      </Modal>

      {/* 溯源链路 Drawer */}
      <Drawer
        title="溯源链路详情" placement="right" width={600}
        open={traceDrawerOpen} onClose={() => setTraceDrawerOpen(false)}
      >
        {viewingTrace && (
          <>
            <Descriptions column={2} bordered size="small" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="溯源码" span={2}>
                <span style={{ fontFamily: 'monospace', color: '#6366f1', fontWeight: 600 }}>{viewingTrace.traceCode}</span>
              </Descriptions.Item>
              <Descriptions.Item label="批次号">{viewingTrace.batchNo}</Descriptions.Item>
              <Descriptions.Item label="药材">{viewingTrace.herbName}</Descriptions.Item>
              <Descriptions.Item label="种植基地" span={2}>{viewingTrace.baseName}</Descriptions.Item>
              <Descriptions.Item label="溯源状态">
                <Tag color={TRACE_STATUS_COLOR[viewingTrace.status]}>{TRACE_STATUS_MAP[viewingTrace.status]}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="链路节点">{viewingTrace.chainCount} 个节点</Descriptions.Item>
            </Descriptions>

            <Divider>溯源链路时间轴</Divider>
            <Timeline
              items={[
                {
                  color: 'green', children: (
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>节点1：种植档案</div>
                      <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>种植日期：{viewingTrace.plantingDate}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>基地：{viewingTrace.baseName}</div>
                      <Tag color="green" style={{ marginTop: 4 }}>已完成</Tag>
                    </div>
                  ),
                },
                {
                  color: 'green', children: (
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>节点2：采收记录</div>
                      <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>采收日期：{viewingTrace.harvestDate}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>批次号：{viewingTrace.batchNo}</div>
                      <Tag color="green" style={{ marginTop: 4 }}>已完成</Tag>
                    </div>
                  ),
                },
                {
                  color: viewingTrace.processingDate ? 'blue' : 'gray', children: (
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>节点3：加工记录</div>
                      <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>加工日期：{viewingTrace.processingDate || '待加工'}</div>
                      <Tag color={viewingTrace.processingDate ? 'processing' : 'default'} style={{ marginTop: 4 }}>
                        {viewingTrace.processingDate ? '已完成' : '待执行'}
                      </Tag>
                    </div>
                  ),
                },
                {
                  color: viewingTrace.warehouseInDate ? 'cyan' : 'gray', children: (
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>节点4：入库仓储</div>
                      <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>入库日期：{viewingTrace.warehouseInDate || '待入库'}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>当前库位：{viewingTrace.currentLocation}</div>
                      <Tag color={viewingTrace.warehouseInDate ? 'cyan' : 'default'} style={{ marginTop: 4 }}>
                        {viewingTrace.warehouseInDate ? '已完成' : '待执行'}
                      </Tag>
                    </div>
                  ),
                },
                {
                  color: viewingTrace.currentLocation === '已出库' ? 'purple' : 'gray', children: (
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>节点5：出库流通</div>
                      <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>状态：{viewingTrace.currentLocation}</div>
                      <Tag color={viewingTrace.currentLocation === '已出库' ? 'purple' : 'default'} style={{ marginTop: 4 }}>
                        {viewingTrace.currentLocation === '已出库' ? '已完成' : '流通中'}
                      </Tag>
                    </div>
                  ),
                },
              ]}
            />
          </>
        )}
      </Drawer>
    </div>
  );
};

export default QualityControl;
