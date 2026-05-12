import React, { useState } from 'react';
import {
  Card, Row, Col, Table, Button, Space, Tag, Input, Select, Modal, Form,
  DatePicker, InputNumber, Rate, Divider, Progress, Tabs, Descriptions,
  Popconfirm, message,
} from 'antd';
import {
  PlusOutlined, SearchOutlined, SolutionOutlined, ToolOutlined,
  ExperimentOutlined, BankOutlined,
  UserOutlined, CarOutlined, TeamOutlined, CheckCircleOutlined,
  ClockCircleOutlined, EyeOutlined, EditOutlined, RiseOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import ReactECharts from 'echarts-for-react';
import type {
  TechGuideRecord, MachineryItem, MachineryBooking, PestControlTask,
  FinanceService, Expert, TechGuideStatus,
  PestControlStatus, FinanceServiceType,
} from '@/types/global';
import {
  TECH_GUIDE_STATUS_MAP, TECH_GUIDE_STATUS_COLOR,
  PEST_CONTROL_STATUS_MAP, PEST_CONTROL_STATUS_COLOR,
  FINANCE_STATUS_MAP, FINANCE_STATUS_COLOR,
  FINANCE_TYPE_MAP, BOOKING_STATUS_MAP, BOOKING_STATUS_COLOR,
} from '@/types/global';
import { CHART_COLORS } from '../dashboard/components/mockData';

// ============================================================
// Mock 专家数据
// ============================================================
const mockExperts: Expert[] = [
  { id: 1, name: '陈农艺', title: '高级农艺师', specialty: '石斛栽培技术', phone: '139-0001-0001', rating: 4.9, totalGuides: 128 },
  { id: 2, name: '李植保', title: '植保工程师', specialty: '病虫害绿色防控', phone: '139-0002-0002', rating: 4.8, totalGuides: 96 },
  { id: 3, name: '王土壤', title: '土壤肥料师', specialty: '有机肥施用技术', phone: '139-0003-0003', rating: 4.7, totalGuides: 82 },
  { id: 4, name: '张加工', title: '加工工程师', specialty: '石斛加工工艺', phone: '139-0004-0004', rating: 4.6, totalGuides: 54 },
];

// ============================================================
// Mock 农技指导记录
// ============================================================
const mockTechGuides: TechGuideRecord[] = [
  { id: 1, farmerName: '张三', phone: '139-1234-0001', baseName: '官渡镇石斛林下经济示范园', herbName: '金钗石斛', issueType: '病虫害', description: '叶片出现黄褐色斑点，面积约2亩，疑似炭疽病', appointmentDate: '2026-04-20', expertId: 2, expertName: '李植保', guideDate: '2026-04-22', content: '确认为炭疽病，建议使用苦参碱生物农药进行叶面喷施，7天后复检', evaluation: 5, status: 'evaluated', createdAt: '2026-04-20' },
  { id: 2, farmerName: '李四', phone: '139-1234-0002', baseName: '长期镇石斛产业园', herbName: '金钗石斛', issueType: '施肥', description: '询问有机肥发酵腐熟判断标准及施用方法', appointmentDate: '2026-04-22', expertId: 3, expertName: '王土壤', guideDate: '2026-04-23', content: '现场讲解有机肥腐熟判断标准（温度、颜色、气味），演示开沟深施技术', evaluation: 5, status: 'evaluated', createdAt: '2026-04-22' },
  { id: 3, farmerName: '王五', phone: '139-1234-0003', baseName: '大同镇种植基地', herbName: '金钗石斛', issueType: '灌溉', description: '询问干旱季节石斛节水灌溉方案', appointmentDate: '2026-04-24', expertId: 1, expertName: '陈农艺', status: 'processing', createdAt: '2026-04-24' },
  { id: 4, farmerName: '赵六', phone: '139-1234-0004', baseName: '丙安镇种植合作社', herbName: '金钗石斛', issueType: '采收', description: '咨询金钗石斛最佳采收期判断标准', appointmentDate: '2026-04-25', expertId: 1, expertName: '陈农艺', status: 'pending', createdAt: '2026-04-25' },
  { id: 5, farmerName: '孙七', phone: '139-1234-0005', baseName: '元厚镇生态种植园', herbName: '金钗石斛', issueType: '其他', description: '咨询石斛花期管理及采后加工注意事项', appointmentDate: '2026-04-26', expertId: 4, expertName: '张加工', status: 'pending', createdAt: '2026-04-26' },
  { id: 6, farmerName: '周八', phone: '139-1234-0006', baseName: '长沙镇药材种植园', herbName: '金钗石斛', issueType: '病虫害', description: '发现少量蜗牛啃食嫩叶，影响产量', appointmentDate: '2026-04-18', expertId: 2, expertName: '李植保', guideDate: '2026-04-19', content: '建议使用茶籽饼撒施法，物理隔离防治蜗牛，配合地面干燥管理', evaluation: 4, status: 'evaluated', createdAt: '2026-04-18' },
];

// ============================================================
// Mock 农机数据
// ============================================================
const mockMachinery: MachineryItem[] = [
  { id: 1, name: '高压喷雾机', model: '3W-500', type: '植保机械', serviceArea: '官渡镇/长期镇', dailyRate: 300, status: 'idle', totalUses: 86, thisMonthUses: 8 },
  { id: 2, name: '微耕机', model: '1WG-4.0Q', type: '耕作机械', serviceArea: '全市', dailyRate: 200, status: 'in_use', totalUses: 142, thisMonthUses: 12 },
  { id: 3, name: '烘干机', model: '5HG-4.5', type: '加工机械', serviceArea: '长期镇/丙安镇', dailyRate: 500, status: 'idle', totalUses: 58, thisMonthUses: 5 },
  { id: 4, name: '割灌机', model: 'BG431', type: '修剪机械', serviceArea: '全市', dailyRate: 150, status: 'maintenance', totalUses: 203, thisMonthUses: 18 },
  { id: 5, name: '施肥机', model: '2F-1500', type: '施肥机械', serviceArea: '官渡镇/大同镇', dailyRate: 250, status: 'idle', totalUses: 67, thisMonthUses: 7 },
  { id: 6, name: '灌溉泵', model: 'QDX50-15-3', type: '灌溉设备', serviceArea: '全市', dailyRate: 100, status: 'in_use', totalUses: 310, thisMonthUses: 24 },
];

const mockBookings: MachineryBooking[] = [
  { id: 1, machineryId: 1, machineryName: '高压喷雾机', farmerName: '张三', phone: '139-1234-0001', baseName: '官渡镇石斛林下经济示范园', bookingDate: '2026-04-20', duration: 2, fee: 600, status: 'completed', createdAt: '2026-04-18' },
  { id: 2, machineryId: 2, machineryName: '微耕机', farmerName: '李四', phone: '139-1234-0002', baseName: '长期镇石斛产业园', bookingDate: '2026-04-22', duration: 3, fee: 600, status: 'in_use', createdAt: '2026-04-20' },
  { id: 3, machineryId: 3, machineryName: '烘干机', farmerName: '王五', phone: '139-1234-0003', baseName: '大同镇种植基地', bookingDate: '2026-04-25', duration: 2, fee: 1000, status: 'booked', createdAt: '2026-04-23' },
  { id: 4, machineryId: 1, machineryName: '高压喷雾机', farmerName: '赵六', phone: '139-1234-0004', baseName: '丙安镇种植合作社', bookingDate: '2026-04-27', duration: 1, fee: 300, status: 'booked', createdAt: '2026-04-25' },
  { id: 5, machineryId: 6, machineryName: '灌溉泵', farmerName: '孙七', phone: '139-1234-0005', baseName: '元厚镇生态种植园', bookingDate: '2026-04-26', duration: 2, fee: 200, status: 'in_use', createdAt: '2026-04-24' },
];

// ============================================================
// Mock 统防统治任务
// ============================================================
const mockPestTasks: PestControlTask[] = [
  { id: 1, taskName: '2026年春季石斛炭疽病统防', region: '官渡镇', executeDate: '2026-04-15', drugScheme: '苦参碱 + 嘧啶核苷类抗菌素', coverageArea: 3200, farmerCount: 86, executor: '李植保', status: 'completed', effectBefore: 18, effectAfter: 3, createdAt: '2026-04-10' },
  { id: 2, taskName: '2026年春季石斛蜗牛统防', region: '长期镇', executeDate: '2026-04-18', drugScheme: '茶籽饼浸出液 + 地面撒施', coverageArea: 4500, farmerCount: 112, executor: '李植保', status: 'completed', effectBefore: 22, effectAfter: 5, createdAt: '2026-04-12' },
  { id: 3, taskName: '2026年春季石斛叶斑病统防', region: '大同镇', executeDate: '2026-04-25', drugScheme: '波尔多液（自制配方）', coverageArea: 2800, farmerCount: 68, executor: '陈农艺', status: 'executing', createdAt: '2026-04-20' },
  { id: 4, taskName: '2026年春季石斛蚜虫统防', region: '丙安镇', executeDate: '2026-04-28', drugScheme: '苦参碱 + 吡虫啉（减量30%）', coverageArea: 1500, farmerCount: 42, executor: '李植保', status: 'planned', createdAt: '2026-04-23' },
];

// ============================================================
// Mock 金融服务
// ============================================================
const mockFinance: FinanceService[] = [
  { id: 1, applicantName: '张三', phone: '139-1234-0001', baseName: '官渡镇石斛林下经济示范园', serviceType: 'loan', amount: 50000, term: '12个月', status: 'disbursed', applyDate: '2026-03-01', reviewDate: '2026-03-05', remark: '用于购买有机肥及农膜', createdAt: '2026-03-01' },
  { id: 2, applicantName: '李四', phone: '139-1234-0002', baseName: '长期镇石斛产业园', serviceType: 'insurance', amount: 12000, term: '一年期', status: 'approved', applyDate: '2026-03-15', reviewDate: '2026-03-18', createdAt: '2026-03-15' },
  { id: 3, applicantName: '王五', phone: '139-1234-0003', baseName: '大同镇种植基地', serviceType: 'subsidy', amount: 8000, term: '一次性', status: 'pending', applyDate: '2026-04-20', createdAt: '2026-04-20' },
  { id: 4, applicantName: '赵六', phone: '139-1234-0004', baseName: '丙安镇种植合作社', serviceType: 'loan', amount: 80000, term: '24个月', status: 'pending', applyDate: '2026-04-22', createdAt: '2026-04-22' },
  { id: 5, applicantName: '孙七', phone: '139-1234-0005', baseName: '元厚镇生态种植园', serviceType: 'insurance', amount: 15000, term: '一年期', status: 'rejected', applyDate: '2026-03-20', reviewDate: '2026-03-25', remark: '地块风险评级不达标', createdAt: '2026-03-20' },
  { id: 6, applicantName: '周八', phone: '139-1234-0006', baseName: '长沙镇药材种植园', serviceType: 'subsidy', amount: 6000, term: '一次性', status: 'disbursed', applyDate: '2026-02-10', reviewDate: '2026-02-15', createdAt: '2026-02-10' },
];

// ============================================================
// 月度服务趋势数据
// ============================================================
const monthlyServiceData = [
  { month: '2025-07', techGuide: 12, machineryRent: 18, pestControl: 5, finance: 3 },
  { month: '2025-08', techGuide: 15, machineryRent: 22, pestControl: 8, finance: 4 },
  { month: '2025-09', techGuide: 18, machineryRent: 25, pestControl: 12, finance: 5 },
  { month: '2025-10', techGuide: 14, machineryRent: 20, pestControl: 15, finance: 6 },
  { month: '2025-11', techGuide: 10, machineryRent: 15, pestControl: 10, finance: 4 },
  { month: '2025-12', techGuide: 8, machineryRent: 12, pestControl: 3, finance: 3 },
  { month: '2026-01', techGuide: 9, machineryRent: 10, pestControl: 2, finance: 5 },
  { month: '2026-02', techGuide: 11, machineryRent: 14, pestControl: 4, finance: 6 },
  { month: '2026-03', techGuide: 16, machineryRent: 22, pestControl: 8, finance: 8 },
  { month: '2026-04', techGuide: 20, machineryRent: 28, pestControl: 15, finance: 7 },
];

// ============================================================
// 常量选项
// ============================================================
const ISSUE_TYPE_OPTIONS = ['病虫害', '施肥', '灌溉', '采收', '修剪', '加工', '土壤', '其他'];
const FINANCE_TYPE_OPTIONS = [
  { value: 'loan', label: '贷款申请' },
  { value: 'insurance', label: '保险投保' },
  { value: 'subsidy', label: '补贴申报' },
];
const FINANCE_STATUS_OPTIONS = [
  { value: 'pending', label: '待审核' },
  { value: 'approved', label: '已通过' },
  { value: 'rejected', label: '已驳回' },
  { value: 'disbursed', label: '已放款' },
];

// ============================================================
// KPI 卡片组件
// ============================================================
interface KpiProps {
  title: string;
  value: number | string;
  suffix?: string;
  prefix?: React.ReactNode;
  valueStyle?: React.CSSProperties;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}
const KpiCard: React.FC<KpiProps> = ({ title, value, suffix, prefix, valueStyle, icon, iconBg, iconColor }) => (
  <Card
    bordered={false}
    style={{ borderRadius: 12, background: '#fff' }}
    styles={{ body: { padding: '16px 20px' } }}
    className="card-interactive"
    hoverable
  >
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontSize: 12, color: '#64748b', lineHeight: 1 }}>{title}</span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginTop: 6 }}>
          {prefix}
          <span style={{ fontSize: 26, fontWeight: 700, color: '#1e293b', lineHeight: 1, ...valueStyle }}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>
          {suffix && <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 400, marginLeft: 2 }}>{suffix}</span>}
        </div>
      </div>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20, color: iconColor,
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
const SocialService: React.FC = () => {
  const [guides, setGuides] = useState<TechGuideRecord[]>(mockTechGuides);
  const [machinery] = useState<MachineryItem[]>(mockMachinery);
  const [bookings, setBookings] = useState<MachineryBooking[]>(mockBookings);
  const [pestTasks, setPestTasks] = useState<PestControlTask[]>(mockPestTasks);
  const [finance, setFinance] = useState<FinanceService[]>(mockFinance);
  const [activeTab, setActiveTab] = useState('tech');

  // 农技指导 Modal
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [guideModalMode, setGuideModalMode] = useState<'add' | 'view' | 'evaluate'>('add');
  const [viewingGuide, setViewingGuide] = useState<TechGuideRecord | null>(null);
  const [guideForm] = Form.useForm();
  const [evalForm] = Form.useForm();

  // 农机预约 Modal
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingForm] = Form.useForm();

  // 统防任务 Modal
  const [pestModalOpen, setPestModalOpen] = useState(false);
  const [pestModalMode, setPestModalMode] = useState<'add' | 'view'>('add');
  const [viewingPest, setViewingPest] = useState<PestControlTask | null>(null);
  const [pestForm] = Form.useForm();

  // 金融服务 Modal
  const [financeModalOpen, setFinanceModalOpen] = useState(false);
  const [financeModalMode, setFinanceModalMode] = useState<'add' | 'view'>('add');
  const [viewingFinance, setViewingFinance] = useState<FinanceService | null>(null);
  const [financeForm] = Form.useForm();

  // ============================================================
  // KPI 计算
  // ============================================================
  const kpiData = {
    tech: {
      total: guides.length,
      pending: guides.filter((g) => g.status === 'pending' || g.status === 'processing').length,
      completed: guides.filter((g) => g.status === 'completed' || g.status === 'evaluated').length,
      avgRating: (guides.filter((g) => g.evaluation).reduce((s, g) => s + (g.evaluation || 0), 0) / guides.filter((g) => g.evaluation).length).toFixed(1),
    },
    machinery: {
      total: machinery.length,
      idle: machinery.filter((m) => m.status === 'idle').length,
      inUse: machinery.filter((m) => m.status === 'in_use').length,
      usageRate: Math.round((machinery.filter((m) => m.status === 'in_use').length / machinery.length) * 100),
      monthlyFee: bookings.filter((b) => b.status === 'completed').reduce((s, b) => s + b.fee, 0),
    },
    pest: {
      total: pestTasks.length,
      completed: pestTasks.filter((p) => p.status === 'completed').length,
      executing: pestTasks.filter((p) => p.status === 'executing').length,
      totalCoverage: pestTasks.filter((p) => p.status === 'completed').reduce((s, p) => s + p.coverageArea, 0),
      avgEffect: pestTasks.filter((p) => p.effectAfter !== undefined).length > 0
        ? Math.round((1 - pestTasks.filter((p) => p.effectAfter !== undefined).reduce((s, p) => s + (p.effectAfter || 0), 0) / pestTasks.filter((p) => p.effectBefore !== undefined).reduce((s, p) => s + (p.effectBefore || 0), 0)) * 100)
        : 0,
    },
    finance: {
      total: finance.length,
      pending: finance.filter((f) => f.status === 'pending').length,
      disbursed: finance.filter((f) => f.status === 'disbursed').reduce((s, f) => s + f.amount, 0),
      approved: finance.filter((f) => f.status === 'approved' || f.status === 'disbursed').length,
    },
  };

  // ============================================================
  // 表格列定义
  // ============================================================
  const guideColumns: ColumnsType<TechGuideRecord> = [
    { title: '申请日期', dataIndex: 'appointmentDate', key: 'appointmentDate', width: 110 },
    { title: '农户', dataIndex: 'farmerName', key: 'farmerName', width: 80, render: (_, record) => (
      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <UserOutlined style={{ color: '#94a3b8', fontSize: 11 }} />
        {record.farmerName}
      </span>
    )},
    { title: '基地', dataIndex: 'baseName', key: 'baseName', ellipsis: true },
    { title: '问题类型', dataIndex: 'issueType', key: 'issueType', width: 90, render: (t: string) => <Tag color="blue">{t}</Tag> },
    { title: '预约专家', dataIndex: 'expertName', key: 'expertName', width: 90, render: (n: string) => n || <span style={{ color: '#cbd5e1' }}>待分配</span> },
    {
      title: '指导日期', dataIndex: 'guideDate', key: 'guideDate', width: 110,
      render: (d: string) => d || <span style={{ color: '#cbd5e1' }}>待指导</span>,
    },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 100,
      render: (s: TechGuideStatus) => <Tag color={TECH_GUIDE_STATUS_COLOR[s]}>{TECH_GUIDE_STATUS_MAP[s]}</Tag>,
    },
    {
      title: '评价', dataIndex: 'evaluation', key: 'evaluation', width: 110,
      render: (e: number) => e ? <Rate disabled value={e} style={{ fontSize: 12 }} /> : <span style={{ color: '#cbd5e1' }}>未评价</span>,
    },
    {
      title: '操作', key: 'action', width: 120,
      render: (_: unknown, record: TechGuideRecord) => (
        <Space size={4}>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => { setViewingGuide(record); setGuideModalMode('view'); setGuideModalOpen(true); }} style={{ padding: '0 4px' }}>详情</Button>
          {record.status === 'completed' && !record.evaluation && (
            <Button type="link" size="small" icon={<EditOutlined />} onClick={() => { setViewingGuide(record); setGuideModalMode('evaluate'); evalForm.resetFields(); setGuideModalOpen(true); }} style={{ padding: '0 4px' }}>评价</Button>
          )}
        </Space>
      ),
    },
  ];

  const bookingColumns: ColumnsType<MachineryBooking> = [
    { title: '预约设备', dataIndex: 'machineryName', key: 'machineryName', width: 110, render: (n: string) => <Tag color="blue" style={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{n}</Tag> },
    { title: '农户', dataIndex: 'farmerName', key: 'farmerName', width: 72, ellipsis: true },
    { title: '基地', dataIndex: 'baseName', key: 'baseName', ellipsis: true },
    { title: '预约日期', dataIndex: 'bookingDate', key: 'bookingDate', width: 105 },
    {
      title: '天数', dataIndex: 'duration', key: 'duration', width: 62, align: 'center',
      render: (d: number) => `${d}天`,
    },
    {
      title: '费用', dataIndex: 'fee', key: 'fee', width: 72, align: 'right',
      render: (f: number) => <span style={{ color: '#f59e0b', fontWeight: 600 }}>¥{f.toLocaleString()}</span>,
    },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 70,
      render: (s: string) => <Tag color={BOOKING_STATUS_COLOR[s]} style={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{BOOKING_STATUS_MAP[s]}</Tag>,
    },
    {
      title: '操作', key: 'action', width: 56,
      render: (_: unknown, record: MachineryBooking) => (
        <Popconfirm title="确认取消此预约？" onConfirm={() => setBookings((prev) => prev.map((b) => b.id === record.id ? { ...b, status: 'cancelled' } : b))} okText="确认">
          <Button type="link" size="small" danger disabled={record.status === 'completed' || record.status === 'cancelled'} style={{ padding: '0 4px' }}>取消</Button>
        </Popconfirm>
      ),
    },
  ];

  const pestColumns: ColumnsType<PestControlTask> = [
    { title: '任务名称', dataIndex: 'taskName', key: 'taskName', ellipsis: true, render: (n: string) => <span style={{ fontWeight: 600 }}>{n}</span> },
    { title: '执行区域', dataIndex: 'region', key: 'region', width: 90, render: (r: string) => <Tag color="purple">{r}</Tag> },
    { title: '计划日期', dataIndex: 'executeDate', key: 'executeDate', width: 110 },
    { title: '覆盖面积', dataIndex: 'coverageArea', key: 'coverageArea', width: 100, align: 'right', render: (a: number) => `${a.toLocaleString()} 亩` },
    { title: '涉及农户', dataIndex: 'farmerCount', key: 'farmerCount', width: 90, align: 'center', render: (n: number) => `${n} 户` },
    { title: '执行人', dataIndex: 'executor', key: 'executor', width: 90 },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 90,
      render: (s: PestControlStatus) => <Tag color={PEST_CONTROL_STATUS_COLOR[s]}>{PEST_CONTROL_STATUS_MAP[s]}</Tag>,
    },
    {
      title: '防控效果', key: 'effect', width: 130,
      render: (_: unknown, record: PestControlTask) => {
        if (record.effectBefore === undefined || record.effectAfter === undefined) return <span style={{ color: '#cbd5e1' }}>—</span>;
        const rate = Math.round((1 - record.effectAfter / record.effectBefore) * 100);
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#94a3b8', marginBottom: 3 }}>
              <span>{record.effectBefore}%</span>
              <span style={{ color: '#10b981', fontWeight: 600 }}>-{rate}%</span>
              <span>{record.effectAfter}%</span>
            </div>
            <Progress percent={rate} size="small" showInfo={false} strokeColor={CHART_COLORS.primary} trailColor="#e2e8f0" />
          </div>
        );
      },
    },
    {
      title: '操作', key: 'action', width: 80,
      render: (_: unknown, record: PestControlTask) => (
        <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => { setViewingPest(record); setPestModalMode('view'); setPestModalOpen(true); }} style={{ padding: '0 4px' }}>详情</Button>
      ),
    },
  ];

  const financeColumns: ColumnsType<FinanceService> = [
    { title: '申请人', dataIndex: 'applicantName', key: 'applicantName', width: 90, render: (_, record) => (
      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <UserOutlined style={{ color: '#94a3b8', fontSize: 11 }} />
        {record.applicantName}
      </span>
    )},
    { title: '基地', dataIndex: 'baseName', key: 'baseName', ellipsis: true },
    {
      title: '服务类型', dataIndex: 'serviceType', key: 'serviceType', width: 110,
      render: (t: FinanceServiceType) => <Tag color={t === 'loan' ? 'blue' : t === 'insurance' ? 'cyan' : 'gold'}>{FINANCE_TYPE_MAP[t]}</Tag>,
    },
    {
      title: '申请金额', dataIndex: 'amount', key: 'amount', width: 110, align: 'right',
      render: (a: number) => <span style={{ color: '#f59e0b', fontWeight: 600 }}>¥{a.toLocaleString()}</span>,
    },
    { title: '期限', dataIndex: 'term', key: 'term', width: 90 },
    { title: '申请日期', dataIndex: 'applyDate', key: 'applyDate', width: 110 },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 90,
      render: (s: string) => <Tag color={FINANCE_STATUS_COLOR[s]}>{FINANCE_STATUS_MAP[s]}</Tag>,
    },
    {
      title: '操作', key: 'action', width: 80,
      render: (_: unknown, record: FinanceService) => (
        <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => { setViewingFinance(record); setFinanceModalMode('view'); setFinanceModalOpen(true); }} style={{ padding: '0 4px' }}>详情</Button>
      ),
    },
  ];

  // ============================================================
  // 月度趋势图表
  // ============================================================
  const monthlyTrendOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
    legend: { data: ['农技指导', '农机租赁', '统防统治', '金融服务'], bottom: 0, textStyle: { fontSize: 11, color: '#64748b' } },
    grid: { left: 40, right: 20, top: 10, bottom: 40 },
    xAxis: {
      type: 'category',
      data: monthlyServiceData.map((d) => d.month.slice(5) + '月'),
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisLabel: { fontSize: 10, color: '#64748b' },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value', axisLine: { show: false }, axisTick: { show: false },
      splitLine: { lineStyle: { color: '#f1f5f9' } },
      axisLabel: { fontSize: 10, color: '#94a3b8' },
    },
    series: [
      { name: '农技指导', type: 'bar', data: monthlyServiceData.map((d) => d.techGuide), itemStyle: { color: CHART_COLORS.primary, borderRadius: [4, 4, 0, 0] }, barWidth: '40%' },
      { name: '农机租赁', type: 'bar', data: monthlyServiceData.map((d) => d.machineryRent), itemStyle: { color: CHART_COLORS.secondary, borderRadius: [4, 4, 0, 0] }, barWidth: '40%' },
      { name: '统防统治', type: 'bar', data: monthlyServiceData.map((d) => d.pestControl), itemStyle: { color: CHART_COLORS.accent, borderRadius: [4, 4, 0, 0] }, barWidth: '40%' },
      { name: '金融服务', type: 'line', data: monthlyServiceData.map((d) => d.finance), smooth: true, symbol: 'circle', symbolSize: 5, lineStyle: { color: CHART_COLORS.purple, width: 2 }, itemStyle: { color: CHART_COLORS.purple } },
    ],
  };

  // ============================================================
  // 操作处理
  // ============================================================
  const handleSaveGuide = async () => {
    try {
      const values = await guideForm.validateFields();
      const expert = mockExperts.find((e) => e.id === values.expertId);
      const newGuide: TechGuideRecord = {
        ...values, id: Date.now(), status: 'pending',
        appointmentDate: values.appointmentDate?.format('YYYY-MM-DD') || '',
        expertName: expert?.name || '', createdAt: dayjs().format('YYYY-MM-DD'),
      };
      setGuides((prev) => [newGuide, ...prev]);
      message.success('农技指导申请已提交');
      setGuideModalOpen(false);
    } catch {}
  };

  const handleSaveEvaluation = async () => {
    try {
      const values = await evalForm.validateFields();
      setGuides((prev) => prev.map((g) => g.id === viewingGuide?.id ? { ...g, evaluation: values.evaluation, status: 'evaluated' as const } : g));
      message.success('评价已提交，感谢您的反馈！');
      setGuideModalOpen(false);
    } catch {}
  };

  const handleSaveBooking = async () => {
    try {
      const values = await bookingForm.validateFields();
      const machineryItem = machinery.find((m) => m.id === values.machineryId);
      const totalFee = (values.duration || 1) * (machineryItem?.dailyRate || 0);
      const newBooking: MachineryBooking = {
        ...values, id: Date.now(), fee: totalFee, status: 'booked',
        farmerName: '系统用户', phone: '139-0000-0000', baseName: '待填写基地名称',
        bookingDate: values.bookingDate?.format('YYYY-MM-DD') || '', createdAt: dayjs().format('YYYY-MM-DD'),
      };
      setBookings((prev) => [newBooking, ...prev]);
      message.success('农机预约成功');
      setBookingModalOpen(false);
    } catch {}
  };

  const handleSavePest = async () => {
    try {
      const values = await pestForm.validateFields();
      const newTask: PestControlTask = {
        ...values, id: Date.now(), status: 'planned',
        executeDate: values.executeDate?.format('YYYY-MM-DD') || '', createdAt: dayjs().format('YYYY-MM-DD'),
      };
      setPestTasks((prev) => [newTask, ...prev]);
      message.success('统防任务已创建');
      setPestModalOpen(false);
    } catch {}
  };

  const handleSaveFinance = async () => {
    try {
      const values = await financeForm.validateFields();
      const newFinance: FinanceService = {
        ...values, id: Date.now(), status: 'pending',
        applyDate: dayjs().format('YYYY-MM-DD'), createdAt: dayjs().format('YYYY-MM-DD'),
      };
      setFinance((prev) => [newFinance, ...prev]);
      message.success('金融服务申请已提交');
      setFinanceModalOpen(false);
    } catch {}
  };

  // ============================================================
  // Tab 配置 — 带徽标计数
  // ============================================================
  const tabItems = [
    {
      key: 'tech',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <SolutionOutlined />
          农技服务
          {kpiData.tech.pending > 0 && (
            <span style={{
              background: '#fef3c7', color: '#d97706',
              fontSize: 10, fontWeight: 700,
              padding: '1px 5px', borderRadius: 8,
              lineHeight: '16px',
            }}>{kpiData.tech.pending}</span>
          )}
        </span>
      ),
      children: (
        <>
          <Row gutter={[10, 10]} style={{ marginBottom: 12 }}>
            <Col xs={12} sm={6}>
              <KpiCard title="累计指导" value={kpiData.tech.total} suffix="次" icon={<SolutionOutlined />} iconBg="rgba(16,185,129,0.1)" iconColor="#10b981" />
            </Col>
            <Col xs={12} sm={6}>
              <KpiCard title="待处理" value={kpiData.tech.pending} suffix="条" valueStyle={{ color: '#f59e0b' }} icon={<ClockCircleOutlined />} iconBg="rgba(245,158,11,0.1)" iconColor="#f59e0b" />
            </Col>
            <Col xs={12} sm={6}>
              <KpiCard title="已完成" value={kpiData.tech.completed} suffix="次" valueStyle={{ color: '#10b981' }} icon={<CheckCircleOutlined />} iconBg="rgba(16,185,129,0.1)" iconColor="#10b981" />
            </Col>
            <Col xs={12} sm={6}>
              <KpiCard title="平均评分" value={kpiData.tech.avgRating} suffix="分" icon={<RiseOutlined />} iconBg="rgba(99,102,241,0.1)" iconColor="#6366f1" />
            </Col>
          </Row>
          {/* 筛选工具条 */}
          <Card
            bordered={false}
            style={{ borderRadius: 10, marginBottom: 12 }}
            styles={{ body: { padding: '10px 14px' } }}
          >
            <Row gutter={10} align="middle">
              <Col xs={24} sm={10} md={8}>
                <Input
                  prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                  placeholder="搜索农户 / 基地 / 专家"
                  allowClear
                  size="middle"
                />
              </Col>
              <Col xs={24} sm={10} md={6}>
                <Select placeholder="状态筛选" allowClear style={{ width: '100%' }} size="middle" options={[
                  { value: 'pending', label: '待处理' },
                  { value: 'processing', label: '处理中' },
                  { value: 'completed', label: '已完成' },
                  { value: 'evaluated', label: '已评价' },
                ]} />
              </Col>
              <Col xs={24} sm={4} md={{ span: 4, offset: 6 }}>
                <Button type="primary" icon={<PlusOutlined />} block onClick={() => { guideForm.resetFields(); setGuideModalMode('add'); setGuideModalOpen(true); }}>
                  预约指导
                </Button>
              </Col>
            </Row>
          </Card>
          <Card bordered={false} style={{ borderRadius: 10 }} styles={{ body: { padding: 0 } }}>
            <Table columns={guideColumns} dataSource={guides} rowKey="id" pagination={{ pageSize: 8, showTotal: (t) => `共 ${t} 条` }} size="middle" />
          </Card>
        </>
      ),
    },
    {
      key: 'machinery',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <ToolOutlined />
          农机共享
          {kpiData.machinery.idle > 0 && (
            <span style={{
              background: '#dcfce7', color: '#16a34a',
              fontSize: 10, fontWeight: 700,
              padding: '1px 5px', borderRadius: 8,
              lineHeight: '16px',
            }}>{kpiData.machinery.idle}</span>
          )}
        </span>
      ),
      children: (
        <>
          <Row gutter={[10, 10]} style={{ marginBottom: 12 }}>
            <Col xs={12} sm={6}>
              <KpiCard title="农机总数" value={kpiData.machinery.total} suffix="台" icon={<ToolOutlined />} iconBg="rgba(6,182,212,0.1)" iconColor="#06b6d4" />
            </Col>
            <Col xs={12} sm={6}>
              <KpiCard title="空闲设备" value={kpiData.machinery.idle} suffix="台" valueStyle={{ color: '#10b981' }} icon={<CheckCircleOutlined />} iconBg="rgba(16,185,129,0.1)" iconColor="#10b981" />
            </Col>
            <Col xs={12} sm={6}>
              <KpiCard title="使用率" value={kpiData.machinery.usageRate} suffix="%" icon={<CarOutlined />} iconBg="rgba(245,158,11,0.1)" iconColor="#f59e0b" />
            </Col>
            <Col xs={12} sm={6}>
              <KpiCard title="本月租金收入" value={kpiData.machinery.monthlyFee} prefix={<span style={{ fontSize: 16 }}>¥</span>} icon={<BankOutlined />} iconBg="rgba(99,102,241,0.1)" iconColor="#6366f1" />
            </Col>
          </Row>

          {/* 设备横向卡片 — 更紧凑的网格 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 10,
            marginBottom: 12,
          }}>
            {machinery.map((m) => {
              const statusColor = m.status === 'idle' ? '#10b981' : m.status === 'in_use' ? '#06b6d4' : '#f59e0b';
              const statusBg = m.status === 'idle' ? 'rgba(16,185,129,0.08)' : m.status === 'in_use' ? 'rgba(6,182,212,0.08)' : 'rgba(245,158,11,0.08)';
              const statusLabel = m.status === 'idle' ? '空闲' : m.status === 'in_use' ? '使用中' : '维护中';
              return (
                <Card
                  key={m.id}
                  bordered={false}
                  style={{
                    borderRadius: 10,
                    border: '1px solid #f1f5f9',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  styles={{ body: { padding: '12px 14px' } }}
                  className="card-interactive"
                  hoverable
                  onClick={() => { bookingForm.setFieldsValue({ machineryId: m.id, machineryName: m.name, dailyRate: m.dailyRate }); setBookingModalOpen(true); }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', lineHeight: 1.3, flex: 1, marginRight: 8 }}>{m.name}</div>
                    <span style={{
                      fontSize: 10, fontWeight: 600,
                      color: statusColor,
                      background: statusBg,
                      padding: '2px 7px', borderRadius: 6,
                      whiteSpace: 'nowrap',
                    }}>{statusLabel}</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 8 }}>{m.model} · {m.type}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 15, color: '#f59e0b', fontWeight: 700 }}>¥{m.dailyRate}<span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 400 }}>/天</span></span>
                    <span style={{ fontSize: 11, color: '#64748b' }}>{m.serviceArea}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 12, paddingTop: 8, borderTop: '1px solid #f1f5f9' }}>
                    <span style={{ fontSize: 11, color: '#64748b' }}>累计 <strong style={{ color: '#374151' }}>{m.totalUses}</strong> 次</span>
                    <span style={{ fontSize: 11, color: '#64748b' }}>本月 <strong style={{ color: '#374151' }}>{m.thisMonthUses}</strong> 次</span>
                  </div>
                </Card>
              );
            })}
          </div>

          <Card
            bordered={false}
            style={{ borderRadius: 10 }}
            headStyle={{ fontSize: 13, fontWeight: 600, borderBottom: '1px solid #f1f5f9', paddingLeft: 4 }}
            title={<span style={{ color: '#374151' }}>预约记录</span>}
            styles={{ body: { padding: '8px 4px' } }}
          >
            <Table
              columns={bookingColumns}
              dataSource={bookings}
              rowKey="id"
              pagination={{ pageSize: 5, showTotal: (t) => `共 ${t} 条`, size: 'small' }}
              size="small"
            />
          </Card>
        </>
      ),
    },
    {
      key: 'pest',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <ExperimentOutlined />
          统防统治
          {kpiData.pest.executing > 0 && (
            <span style={{
              background: '#ede9fe', color: '#7c3aed',
              fontSize: 10, fontWeight: 700,
              padding: '1px 5px', borderRadius: 8,
              lineHeight: '16px',
            }}>{kpiData.pest.executing}</span>
          )}
        </span>
      ),
      children: (
        <>
          <Row gutter={[10, 10]} style={{ marginBottom: 12 }}>
            <Col xs={12} sm={6}>
              <KpiCard title="任务总数" value={kpiData.pest.total} suffix="个" icon={<ExperimentOutlined />} iconBg="rgba(245,158,11,0.1)" iconColor="#f59e0b" />
            </Col>
            <Col xs={12} sm={6}>
              <KpiCard title="已完成" value={kpiData.pest.completed} suffix="个" valueStyle={{ color: '#10b981' }} icon={<CheckCircleOutlined />} iconBg="rgba(16,185,129,0.1)" iconColor="#10b981" />
            </Col>
            <Col xs={12} sm={6}>
              <KpiCard title="执行中" value={kpiData.pest.executing} suffix="个" valueStyle={{ color: '#6366f1' }} icon={<ClockCircleOutlined />} iconBg="rgba(99,102,241,0.1)" iconColor="#6366f1" />
            </Col>
            <Col xs={12} sm={6}>
              <KpiCard title="累计覆盖" value={kpiData.pest.totalCoverage} suffix="亩" valueStyle={{ color: '#06b6d4' }} icon={<TeamOutlined />} iconBg="rgba(6,182,212,0.1)" iconColor="#06b6d4" />
            </Col>
          </Row>
          {/* 筛选工具条 */}
          <Card
            bordered={false}
            style={{ borderRadius: 10, marginBottom: 12 }}
            styles={{ body: { padding: '10px 14px' } }}
          >
            <Row gutter={10} align="middle">
              <Col xs={24} sm={10} md={8}>
                <Input prefix={<SearchOutlined style={{ color: '#94a3b8' }} />} placeholder="搜索任务 / 区域 / 执行人" allowClear size="middle" />
              </Col>
              <Col xs={24} sm={10} md={6}>
                <Select placeholder="状态筛选" allowClear style={{ width: '100%' }} size="middle" options={[
                  { value: 'planned', label: '已计划' },
                  { value: 'executing', label: '执行中' },
                  { value: 'completed', label: '已完成' },
                ]} />
              </Col>
              <Col xs={24} sm={4} md={{ span: 4, offset: 6 }}>
                <Button type="primary" icon={<PlusOutlined />} block onClick={() => { pestForm.resetFields(); setPestModalMode('add'); setPestModalOpen(true); }}>
                  新增任务
                </Button>
              </Col>
            </Row>
          </Card>
          <Card bordered={false} style={{ borderRadius: 10 }} styles={{ body: { padding: 0 } }}>
            <Table columns={pestColumns} dataSource={pestTasks} rowKey="id" pagination={{ pageSize: 8 }} size="middle" />
          </Card>
        </>
      ),
    },
    {
      key: 'finance',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <BankOutlined />
          金融服务
          {kpiData.finance.pending > 0 && (
            <span style={{
              background: '#fef3c7', color: '#d97706',
              fontSize: 10, fontWeight: 700,
              padding: '1px 5px', borderRadius: 8,
              lineHeight: '16px',
            }}>{kpiData.finance.pending}</span>
          )}
        </span>
      ),
      children: (
        <>
          <Row gutter={[10, 10]} style={{ marginBottom: 12 }}>
            <Col xs={12} sm={6}>
              <KpiCard title="服务总数" value={kpiData.finance.total} suffix="笔" icon={<BankOutlined />} iconBg="rgba(99,102,241,0.1)" iconColor="#6366f1" />
            </Col>
            <Col xs={12} sm={6}>
              <KpiCard title="待审核" value={kpiData.finance.pending} suffix="笔" valueStyle={{ color: '#f59e0b' }} icon={<ClockCircleOutlined />} iconBg="rgba(245,158,11,0.1)" iconColor="#f59e0b" />
            </Col>
            <Col xs={12} sm={6}>
              <KpiCard title="已放款总额" value={kpiData.finance.disbursed} prefix={<span style={{ fontSize: 16 }}>¥</span>} icon={<RiseOutlined />} iconBg="rgba(16,185,129,0.1)" iconColor="#10b981" />
            </Col>
            <Col xs={12} sm={6}>
              <KpiCard title="通过率" value={Math.round((kpiData.finance.approved / kpiData.finance.total) * 100)} suffix="%" valueStyle={{ color: '#06b6d4' }} icon={<CheckCircleOutlined />} iconBg="rgba(6,182,212,0.1)" iconColor="#06b6d4" />
            </Col>
          </Row>
          {/* 金融政策卡片 */}
          <Row gutter={[10, 10]} style={{ marginBottom: 12 }}>
            {[
              { title: '石斛种植贷', desc: '最高50万元，利率3.85%，政府贴息30%', bg: 'rgba(16,185,129,0.05)', border: '#10b981', accent: '#10b981' },
              { title: '气象指数保险', desc: '保费政府补贴60%，触发理赔自动到账', bg: 'rgba(6,182,212,0.05)', border: '#06b6d4', accent: '#06b6d4' },
              { title: '有机肥补贴', desc: '每亩补贴200元，认证基地优先', bg: 'rgba(245,158,11,0.05)', border: '#f59e0b', accent: '#f59e0b' },
            ].map((policy, i) => (
              <Col xs={24} sm={8} key={i}>
                <Card
                  bordered={false}
                  style={{
                    borderRadius: 10,
                    borderLeft: `3px solid ${policy.border}`,
                    background: policy.bg,
                  }}
                  styles={{ body: { padding: '12px 16px' } }}
                  className="card-interactive"
                  hoverable
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 8,
                      background: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <BankOutlined style={{ fontSize: 18, color: policy.accent }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: '#1e293b', marginBottom: 2 }}>{policy.title}</div>
                      <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.4 }}>{policy.desc}</div>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
          {/* 筛选工具条 */}
          <Card
            bordered={false}
            style={{ borderRadius: 10, marginBottom: 12 }}
            styles={{ body: { padding: '10px 14px' } }}
          >
            <Row gutter={10} align="middle">
              <Col xs={24} sm={8} md={6}>
                <Input prefix={<SearchOutlined style={{ color: '#94a3b8' }} />} placeholder="搜索申请人 / 基地" allowClear size="middle" />
              </Col>
              <Col xs={12} sm={6} md={4}>
                <Select placeholder="服务类型" allowClear style={{ width: '100%' }} size="middle" options={FINANCE_TYPE_OPTIONS} />
              </Col>
              <Col xs={12} sm={6} md={4}>
                <Select placeholder="状态筛选" allowClear style={{ width: '100%' }} size="middle" options={FINANCE_STATUS_OPTIONS} />
              </Col>
              <Col xs={24} sm={4} md={{ span: 4, offset: 6 }}>
                <Button type="primary" icon={<PlusOutlined />} block onClick={() => { financeForm.resetFields(); setFinanceModalMode('add'); setFinanceModalOpen(true); }}>
                  申请服务
                </Button>
              </Col>
            </Row>
          </Card>
          <Card bordered={false} style={{ borderRadius: 10 }} styles={{ body: { padding: 0 } }}>
            <Table columns={financeColumns} dataSource={finance} rowKey="id" pagination={{ pageSize: 8 }} size="middle" />
          </Card>
        </>
      ),
    },
    {
      key: 'trend',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <RiseOutlined />
          服务趋势
        </span>
      ),
      children: (
        <>
          <Row gutter={[10, 10]} style={{ marginBottom: 12 }}>
            <Col xs={12} sm={6}>
              <KpiCard title="农技指导" value={128} suffix="次" icon={<SolutionOutlined />} iconBg="rgba(16,185,129,0.1)" iconColor="#10b981" />
            </Col>
            <Col xs={12} sm={6}>
              <KpiCard title="农机租赁" value={186} suffix="台次" icon={<ToolOutlined />} iconBg="rgba(6,182,212,0.1)" iconColor="#06b6d4" />
            </Col>
            <Col xs={12} sm={6}>
              <KpiCard title="统防统治" value={72} suffix="次" icon={<ExperimentOutlined />} iconBg="rgba(245,158,11,0.1)" iconColor="#f59e0b" />
            </Col>
            <Col xs={12} sm={6}>
              <KpiCard title="金融服务" value={46} suffix="笔" icon={<BankOutlined />} iconBg="rgba(99,102,241,0.1)" iconColor="#6366f1" />
            </Col>
          </Row>
          <Card
            bordered={false}
            style={{ borderRadius: 10, marginBottom: 12 }}
            headStyle={{ fontSize: 13, fontWeight: 600, borderBottom: '1px solid #f1f5f9', paddingLeft: 4 }}
            title={<span style={{ color: '#374151' }}>月度服务统计趋势</span>}
          >
            <ReactECharts option={monthlyTrendOption} style={{ height: 320 }} />
          </Card>
          <Card
            bordered={false}
            style={{ borderRadius: 10, marginBottom: 10 }}
            headStyle={{ fontSize: 13, fontWeight: 600, borderBottom: '1px solid #f1f5f9', paddingLeft: 4 }}
            title={<span style={{ color: '#374151' }}>专家库</span>}
            styles={{ body: { padding: '4px 4px 12px' } }}
          >
            <Row gutter={[8, 0]}>
              {mockExperts.map((expert) => (
                <Col xs={12} sm={6} key={expert.id}>
                  <div style={{ padding: '12px 12px', borderRight: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: CHART_COLORS.primary + '18',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16, color: CHART_COLORS.primary,
                      flexShrink: 0,
                    }}>
                      <UserOutlined />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontWeight: 600, fontSize: 13, color: '#1e293b' }}>{expert.name}</span>
                        <span style={{ fontSize: 10, color: '#10b981', background: 'rgba(16,185,129,0.08)', padding: '1px 5px', borderRadius: 4 }}>{expert.rating}</span>
                      </div>
                      <div style={{ fontSize: 11, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{expert.title} · {expert.specialty}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 10, color: '#94a3b8' }}>累计指导</div>
                      <div style={{ fontWeight: 700, color: CHART_COLORS.primary }}>{expert.totalGuides}次</div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
          <Card
            bordered={false}
            style={{ borderRadius: 10 }}
            headStyle={{ fontSize: 13, fontWeight: 600, borderBottom: '1px solid #f1f5f9', paddingLeft: 4 }}
            title={<span style={{ color: '#374151' }}>服务汇总统计</span>}
            styles={{ body: { padding: '12px 16px' } }}
          >
            <Row gutter={[16, 12]}>
              {[
                { label: '农技指导', value: 128, max: 200, color: CHART_COLORS.primary },
                { label: '农机租赁', value: 186, max: 300, color: CHART_COLORS.secondary },
                { label: '统防统治', value: 72, max: 200, color: CHART_COLORS.accent },
                { label: '金融服务', value: 46, max: 100, color: CHART_COLORS.purple },
                { label: '覆盖农户', value: 1240, max: 2000, color: CHART_COLORS.pink },
              ].map((item, i) => (
                <Col xs={24} sm={12} md={8} key={i}>
                  <div style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: '#374151' }}>{item.label}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: item.color }}>{item.value.toLocaleString()}</span>
                    </div>
                    <Progress
                      percent={Math.round((item.value / item.max) * 100)}
                      size="small"
                      showInfo={false}
                      strokeColor={item.color}
                      trailColor="#e2e8f0"
                    />
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </>
      ),
    },
  ];

  // ============================================================
  // 渲染
  // ============================================================
  return (
    <div style={{ padding: 20, maxWidth: 1400, margin: '0 auto' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 16 }}>
        <h3 className="page-title" style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 700, color: '#1e293b' }}>社会化服务管理平台</h3>
        <p style={{ margin: 0, fontSize: 13, color: '#94a3b8' }}>整合区域农机、农技、金融等服务资源，为种植主体提供一站式服务</p>
      </div>

      {/* 全局概览条 */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        {(() => {
          const pendingGuides = guides.filter((g) => g.status === 'pending' || g.status === 'processing').length;
          const idleMachinery = bookings.filter((b) => b.status === 'booked').length;
          const activePests = pestTasks.filter((p) => p.status === 'executing' || p.status === 'planned').length;
          const pendingFinance = finance.filter((f) => f.status === 'pending').length;

          const items = [
            { icon: <SolutionOutlined />, label: '待处理农技', value: pendingGuides, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
            { icon: <ToolOutlined />, label: '农机待执行', value: idleMachinery, color: '#6366f1', bg: 'rgba(99,102,241,0.08)' },
            { icon: <ExperimentOutlined />, label: '统防任务', value: activePests, color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
            { icon: <BankOutlined />, label: '待审核金融', value: pendingFinance, color: '#06b6d4', bg: 'rgba(6,182,212,0.08)' },
          ];
          return items.map((item) => (
            <div
              key={item.label}
              style={{
                flex: 1,
                background: '#fff',
                borderRadius: 10,
                border: '1px solid #f1f5f9',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                cursor: 'default',
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: item.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: item.color, fontSize: 16,
                flexShrink: 0,
              }}>
                {item.icon}
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1 }}>{item.label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: item.color, lineHeight: 1.2, marginTop: 3 }}>{item.value}</div>
              </div>
            </div>
          ));
        })()}
      </div>

      <Tabs activeKey={activeTab} onChange={(k) => setActiveTab(k)} items={tabItems} />

      {/* 农技指导 Modal */}
      <Modal
        title={guideModalMode === 'add' ? '预约农技指导' : guideModalMode === 'evaluate' ? '服务评价' : '指导详情'}
        open={guideModalOpen}
        onOk={guideModalMode === 'evaluate' ? handleSaveEvaluation : handleSaveGuide}
        onCancel={() => setGuideModalOpen(false)}
        width={600}
        okText={guideModalMode === 'evaluate' ? '提交评价' : '提交申请'}
        cancelText="取消"
        footer={guideModalMode === 'view' ? null : undefined}
      >
        {guideModalMode === 'view' && viewingGuide ? (
          <Descriptions column={2} bordered size="small" style={{ marginTop: 16 }}>
            <Descriptions.Item label="农户">{viewingGuide.farmerName}</Descriptions.Item>
            <Descriptions.Item label="联系电话">{viewingGuide.phone}</Descriptions.Item>
            <Descriptions.Item label="基地名称" span={2}>{viewingGuide.baseName}</Descriptions.Item>
            <Descriptions.Item label="问题类型"><Tag color="blue">{viewingGuide.issueType}</Tag></Descriptions.Item>
            <Descriptions.Item label="申请日期">{viewingGuide.appointmentDate}</Descriptions.Item>
            <Descriptions.Item label="指导专家">{viewingGuide.expertName || '待分配'}</Descriptions.Item>
            <Descriptions.Item label="指导日期">{viewingGuide.guideDate || '待安排'}</Descriptions.Item>
            <Descriptions.Item label="状态"><Tag color={TECH_GUIDE_STATUS_COLOR[viewingGuide.status]}>{TECH_GUIDE_STATUS_MAP[viewingGuide.status]}</Tag></Descriptions.Item>
            <Descriptions.Item label="服务评价" span={2}>
              {viewingGuide.evaluation ? <Rate disabled value={viewingGuide.evaluation} /> : <span style={{ color: '#cbd5e1' }}>未评价</span>}
            </Descriptions.Item>
            <Descriptions.Item label="问题描述" span={2}>{viewingGuide.description}</Descriptions.Item>
            {viewingGuide.content && <Descriptions.Item label="指导内容" span={2}>{viewingGuide.content}</Descriptions.Item>}
          </Descriptions>
        ) : guideModalMode === 'evaluate' ? (
          <Form form={evalForm} layout="vertical" style={{ marginTop: 16 }}>
            <Form.Item label="服务评分" name="evaluation" rules={[{ required: true, message: '请选择评分' }]}>
              <Rate />
            </Form.Item>
          </Form>
        ) : (
          <Form form={guideForm} layout="vertical" style={{ marginTop: 16 }}>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item label="农户姓名" name="farmerName" rules={[{ required: true, message: '请输入农户姓名' }]}>
                  <Input placeholder="请输入农户姓名" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="联系电话" name="phone" rules={[{ required: true, message: '请输入联系电话' }]}>
                  <Input placeholder="请输入联系电话" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="基地名称" name="baseName" rules={[{ required: true, message: '请输入基地名称' }]}>
                  <Input placeholder="请输入基地名称" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="问题类型" name="issueType" rules={[{ required: true, message: '请选择问题类型' }]}>
                  <Select placeholder="请选择">
                    {ISSUE_TYPE_OPTIONS.map((o) => <Select.Option key={o} value={o}>{o}</Select.Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="预约专家" name="expertId" rules={[{ required: true, message: '请选择专家' }]}>
                  <Select placeholder="请选择">
                    {mockExperts.map((e) => <Select.Option key={e.id} value={e.id}>{e.name} — {e.specialty}</Select.Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="预约日期" name="appointmentDate" rules={[{ required: true, message: '请选择预约日期' }]}>
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="问题描述" name="description" rules={[{ required: true, message: '请输入问题描述' }]}>
                  <Input.TextArea rows={3} placeholder="请详细描述您遇到的问题" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
      </Modal>

      {/* 农机预约 Modal */}
      <Modal
        title="农机预约"
        open={bookingModalOpen}
        onOk={handleSaveBooking}
        onCancel={() => setBookingModalOpen(false)}
        width={480}
        okText="确认预约"
        cancelText="取消"
      >
        <Form form={bookingForm} layout="vertical" style={{ marginTop: 16 }}>
          <Descriptions column={2} bordered size="small" style={{ marginBottom: 16 }}>
            <Descriptions.Item label="设备名称" span={2}>{bookingForm.getFieldValue('machineryName')}</Descriptions.Item>
            <Descriptions.Item label="日租金"><span style={{ color: '#f59e0b', fontWeight: 600 }}>¥{bookingForm.getFieldValue('dailyRate') || 0}/天</span></Descriptions.Item>
          </Descriptions>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="使用天数" name="duration" rules={[{ required: true, message: '请输入使用天数' }]}>
                <InputNumber min={1} max={30} style={{ width: '100%' }} addonAfter="天" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="预约日期" name="bookingDate" rules={[{ required: true, message: '请选择预约日期' }]}>
                <DatePicker style={{ width: '100%' }} />
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

      {/* 统防任务 Modal */}
      <Modal
        title={pestModalMode === 'add' ? '新增统防任务' : '任务详情'}
        open={pestModalOpen}
        onOk={pestModalMode === 'add' ? handleSavePest : undefined}
        onCancel={() => setPestModalOpen(false)}
        width={560}
        okText={pestModalMode === 'add' ? '创建任务' : undefined}
        cancelText="关闭"
        footer={pestModalMode === 'view' ? null : undefined}
      >
        {pestModalMode === 'view' && viewingPest ? (
          <>
            <Descriptions column={2} bordered size="small" style={{ marginTop: 16 }}>
              <Descriptions.Item label="任务名称" span={2}>{viewingPest.taskName}</Descriptions.Item>
              <Descriptions.Item label="执行区域"><Tag color="purple">{viewingPest.region}</Tag></Descriptions.Item>
              <Descriptions.Item label="执行日期">{viewingPest.executeDate}</Descriptions.Item>
              <Descriptions.Item label="覆盖面积">{viewingPest.coverageArea.toLocaleString()} 亩</Descriptions.Item>
              <Descriptions.Item label="涉及农户">{viewingPest.farmerCount} 户</Descriptions.Item>
              <Descriptions.Item label="执行人">{viewingPest.executor}</Descriptions.Item>
              <Descriptions.Item label="状态"><Tag color={PEST_CONTROL_STATUS_COLOR[viewingPest.status]}>{PEST_CONTROL_STATUS_MAP[viewingPest.status]}</Tag></Descriptions.Item>
              <Descriptions.Item label="用药方案" span={2}>{viewingPest.drugScheme}</Descriptions.Item>
              {viewingPest.effectBefore !== undefined && (
                <>
                  <Descriptions.Item label="用药前发病率">{viewingPest.effectBefore}%</Descriptions.Item>
                  <Descriptions.Item label="用药后发病率">{viewingPest.effectAfter}%</Descriptions.Item>
                </>
              )}
            </Descriptions>
            {viewingPest.effectBefore !== undefined && viewingPest.effectAfter !== undefined && (
              <>
                <Divider>防控效果</Divider>
                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 28, fontWeight: 700, color: '#ef4444' }}>{viewingPest.effectBefore}%</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>用药前</div>
                  </div>
                  <div style={{ fontSize: 24, color: '#cbd5e1' }}>→</div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 28, fontWeight: 700, color: '#10b981' }}>{viewingPest.effectAfter}%</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>用药后</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>发病率下降</div>
                    <Progress percent={Math.round((1 - viewingPest.effectAfter / viewingPest.effectBefore) * 100)} strokeColor="#10b981" />
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <Form form={pestForm} layout="vertical" style={{ marginTop: 16 }}>
            <Row gutter={12}>
              <Col span={24}>
                <Form.Item label="任务名称" name="taskName" rules={[{ required: true, message: '请输入任务名称' }]}>
                  <Input placeholder="请输入任务名称" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="执行区域" name="region" rules={[{ required: true, message: '请选择执行区域' }]}>
                  <Select placeholder="请选择">
                    {['官渡镇', '长期镇', '大同镇', '丙安镇', '元厚镇', '长沙镇', '复兴镇'].map((r) => <Select.Option key={r} value={r}>{r}</Select.Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="执行日期" name="executeDate" rules={[{ required: true, message: '请选择执行日期' }]}>
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="覆盖面积（亩）" name="coverageArea" rules={[{ required: true, message: '请输入覆盖面积' }]}>
                  <InputNumber min={0} style={{ width: '100%' }} addonAfter="亩" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="涉及农户" name="farmerCount" rules={[{ required: true, message: '请输入涉及农户数' }]}>
                  <InputNumber min={0} style={{ width: '100%' }} addonAfter="户" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="执行人" name="executor" rules={[{ required: true, message: '请输入执行人' }]}>
                  <Input placeholder="请输入执行人" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="用药方案" name="drugScheme" rules={[{ required: true, message: '请输入用药方案' }]}>
                  <Input.TextArea rows={2} placeholder="请描述用药方案" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
      </Modal>

      {/* 金融服务 Modal */}
      <Modal
        title={financeModalMode === 'add' ? '申请金融服务' : '服务详情'}
        open={financeModalOpen}
        onOk={financeModalMode === 'add' ? handleSaveFinance : undefined}
        onCancel={() => setFinanceModalOpen(false)}
        width={560}
        okText={financeModalMode === 'add' ? '提交申请' : undefined}
        cancelText="关闭"
        footer={financeModalMode === 'view' ? null : undefined}
      >
        {viewingFinance ? (
          <Descriptions column={2} bordered size="small" style={{ marginTop: 16 }}>
            <Descriptions.Item label="申请人">{viewingFinance.applicantName}</Descriptions.Item>
            <Descriptions.Item label="联系电话">{viewingFinance.phone}</Descriptions.Item>
            <Descriptions.Item label="基地名称" span={2}>{viewingFinance.baseName}</Descriptions.Item>
            <Descriptions.Item label="服务类型"><Tag color={viewingFinance.serviceType === 'loan' ? 'blue' : viewingFinance.serviceType === 'insurance' ? 'cyan' : 'gold'}>{FINANCE_TYPE_MAP[viewingFinance.serviceType]}</Tag></Descriptions.Item>
            <Descriptions.Item label="申请金额"><span style={{ color: '#f59e0b', fontWeight: 600 }}>¥{viewingFinance.amount.toLocaleString()}</span></Descriptions.Item>
            <Descriptions.Item label="期限">{viewingFinance.term}</Descriptions.Item>
            <Descriptions.Item label="状态"><Tag color={FINANCE_STATUS_COLOR[viewingFinance.status]}>{FINANCE_STATUS_MAP[viewingFinance.status]}</Tag></Descriptions.Item>
            <Descriptions.Item label="申请日期">{viewingFinance.applyDate}</Descriptions.Item>
            {viewingFinance.reviewDate && <Descriptions.Item label="审核日期">{viewingFinance.reviewDate}</Descriptions.Item>}
            {viewingFinance.remark && <Descriptions.Item label="备注" span={2}>{viewingFinance.remark}</Descriptions.Item>}
          </Descriptions>
        ) : (
          <Form form={financeForm} layout="vertical" style={{ marginTop: 16 }}>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item label="申请人姓名" name="applicantName" rules={[{ required: true, message: '请输入申请人姓名' }]}>
                  <Input placeholder="请输入申请人姓名" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="联系电话" name="phone" rules={[{ required: true, message: '请输入联系电话' }]}>
                  <Input placeholder="请输入联系电话" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="基地名称" name="baseName" rules={[{ required: true, message: '请输入基地名称' }]}>
                  <Input placeholder="请输入基地名称" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="服务类型" name="serviceType" rules={[{ required: true, message: '请选择服务类型' }]}>
                  <Select placeholder="请选择">
                    {FINANCE_TYPE_OPTIONS.map((o) => <Select.Option key={o.value} value={o.value}>{o.label}</Select.Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="申请金额（元）" name="amount" rules={[{ required: true, message: '请输入申请金额' }]}>
                  <InputNumber min={0} style={{ width: '100%' }} prefix="¥" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="期限" name="term" rules={[{ required: true, message: '请输入期限' }]}>
                  <Input placeholder="如：12个月 / 一年期 / 一次性" />
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
    </div>
  );
};

export default SocialService;
