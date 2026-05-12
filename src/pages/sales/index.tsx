import React, { useState, useMemo } from 'react';
import {
  Table, Card, Button, Space, Tag, Input, Row, Col, Statistic, Tabs,
  Modal, Form, Select, InputNumber, DatePicker, message, Popconfirm,
  Descriptions, Timeline, Tooltip, Drawer, Divider,
} from 'antd';
import {
  PlusOutlined, SearchOutlined, ExportOutlined, EyeOutlined,
  EditOutlined, DeleteOutlined, WarningOutlined,
  DollarOutlined, ShoppingOutlined, AccountBookOutlined, RiseOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import PageHeading from '../../components/PageHeading';
import type {
  SalesOrder, SalesCustomer, PaymentRecord,
  SalesOrderStatus, PaymentStatus, CustomerLevel,
  MonthlySales, HerbSales,
} from '@/types/global';
import {
  SALES_ORDER_STATUS_MAP, PAYMENT_STATUS_MAP,
  CUSTOMER_LEVEL_MAP, CUSTOMER_LEVEL_COLOR_MAP,
} from '@/types/global';
import SalesChart from './components/SalesChart';

// ============================================================
// 状态色彩映射
// ============================================================
const ORDER_STATUS_COLOR: Record<SalesOrderStatus, string> = {
  pending: 'default',
  paid: 'processing',
  shipped: 'cyan',
  completed: 'green',
  cancelled: 'red',
};

const PAYMENT_COLOR: Record<PaymentStatus, string> = {
  unpaid: 'orange',
  paid: 'green',
  refunded: 'red',
};

const PAYMENT_METHOD_COLOR: Record<string, string> = {
  bank: 'blue',
  wechat: 'green',
  alipay: 'cyan',
  cash: 'orange',
};

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  bank: '银行转账',
  wechat: '微信支付',
  alipay: '支付宝',
  cash: '现金',
};

// ============================================================
// Mock 数据
// ============================================================
const mockCustomers: SalesCustomer[] = [
  {
    id: 1, name: '华润三九医药股份有限公司', contact: '张经理', phone: '138-8001-1234',
    address: '广东省深圳市龙华区华润三九医药产业园', level: 'excellent',
    totalOrders: 28, totalAmount: 458000, pendingAmount: 0, creditLimit: 500000, status: 'active', createdAt: '2024-01-15',
  },
  {
    id: 2, name: '广州清平药材行', contact: '李总监', phone: '139-2002-5678',
    address: '广东省广州市荔湾区清平路88号', level: 'excellent',
    totalOrders: 35, totalAmount: 682000, pendingAmount: 10200, creditLimit: 800000, status: 'active', createdAt: '2023-11-20',
  },
  {
    id: 3, name: '安徽亳州药材市场', contact: '王主任', phone: '138-3003-9012',
    address: '安徽省亳州市谯城区药材市场大道66号', level: 'normal',
    totalOrders: 15, totalAmount: 234000, pendingAmount: 16500, creditLimit: 300000, status: 'active', createdAt: '2024-03-08',
  },
  {
    id: 4, name: '北京同仁堂', contact: '刘经理', phone: '010-6600-4321',
    address: '北京市东城区前门大街186号', level: 'excellent',
    totalOrders: 52, totalAmount: 1280000, pendingAmount: 0, creditLimit: 2000000, status: 'active', createdAt: '2023-06-01',
  },
  {
    id: 5, name: '成都华安堂药店', contact: '陈药师', phone: '138-5005-3456',
    address: '四川省成都市武侯区科华北路120号', level: 'normal',
    totalOrders: 8, totalAmount: 56000, pendingAmount: 0, creditLimit: 100000, status: 'active', createdAt: '2025-06-12',
  },
  {
    id: 6, name: '赤水源中药材合作社', contact: '赵社长', phone: '139-6006-7890',
    address: '贵州省赤水市大同镇民族村', level: 'normal',
    totalOrders: 6, totalAmount: 38000, pendingAmount: 18000, creditLimit: 50000, status: 'active', createdAt: '2025-09-01',
  },
];

const mockOrders: SalesOrder[] = [
  {
    id: 1, orderNo: 'XS-2026042201', customerId: 1, customerName: '华润三九医药股份有限公司',
    herbName: '金钗石斛', specification: '统货/枫斗', quantity: 50, unit: 'kg', unitPrice: 580,
    totalAmount: 29000, orderDate: '2026-04-10', status: 'completed', paymentStatus: 'paid',
    plannedPaymentDate: '2026-04-20', actualPaymentDate: '2026-04-15', logisticsNo: 'SF1089234567890',
    remark: '长期合作客户，品质稳定', createdAt: '2026-04-10 09:00:00',
  },
  {
    id: 2, orderNo: 'XS-2026042202', customerId: 2, customerName: '广州清平药材行',
    herbName: '金钗石斛', specification: '特级/鲜条', quantity: 30, unit: 'kg', unitPrice: 120,
    totalAmount: 3600, orderDate: '2026-04-15', status: 'completed', paymentStatus: 'paid',
    plannedPaymentDate: '2026-04-25', actualPaymentDate: '2026-04-18', logisticsNo: 'YT9876543210123',
    createdAt: '2026-04-15 10:30:00',
  },
  {
    id: 3, orderNo: 'XS-2026042203', customerId: 3, customerName: '安徽亳州药材市场',
    herbName: '金钗石斛', specification: '优等/切片', quantity: 80, unit: 'kg', unitPrice: 320,
    totalAmount: 25600, orderDate: '2026-04-18', status: 'shipped', paymentStatus: 'paid',
    plannedPaymentDate: '2026-04-28', logisticsNo: 'JD20260418123',
    createdAt: '2026-04-18 14:20:00',
  },
  {
    id: 4, orderNo: 'XS-2026042204', customerId: 4, customerName: '北京同仁堂',
    herbName: '金钗石斛', specification: '特选/枫斗', quantity: 20, unit: 'kg', unitPrice: 880,
    totalAmount: 17600, orderDate: '2026-04-20', status: 'shipped', paymentStatus: 'paid',
    plannedPaymentDate: '2026-04-30', logisticsNo: 'SF20260420123',
    createdAt: '2026-04-20 08:45:00',
  },
  {
    id: 5, orderNo: 'XS-2026042205', customerId: 3, customerName: '安徽亳州药材市场',
    herbName: '金钗石斛', specification: '统货/片', quantity: 100, unit: 'kg', unitPrice: 260,
    totalAmount: 26000, orderDate: '2026-04-22', status: 'pending', paymentStatus: 'unpaid',
    plannedPaymentDate: '2026-05-02', createdAt: '2026-04-22 16:00:00',
  },
  {
    id: 6, orderNo: 'XS-2026042206', customerId: 5, customerName: '成都华安堂药店',
    herbName: '金钗石斛', specification: '普通/枫斗', quantity: 5, unit: 'kg', unitPrice: 520,
    totalAmount: 2600, orderDate: '2026-04-23', status: 'pending', paymentStatus: 'unpaid',
    plannedPaymentDate: '2026-05-03', createdAt: '2026-04-23 11:00:00',
  },
  {
    id: 7, orderNo: 'XS-2026042207', customerId: 6, customerName: '赤水源中药材合作社',
    herbName: '金钗石斛', specification: '统货/鲜条', quantity: 60, unit: 'kg', unitPrice: 110,
    totalAmount: 6600, orderDate: '2026-04-23', status: 'paid', paymentStatus: 'paid',
    plannedPaymentDate: '2026-05-03', actualPaymentDate: '2026-04-24',
    createdAt: '2026-04-23 15:30:00',
  },
  {
    id: 8, orderNo: 'XS-2026042208', customerId: 4, customerName: '北京同仁堂',
    herbName: '金钗石斛', specification: '精选/枫斗', quantity: 15, unit: 'kg', unitPrice: 980,
    totalAmount: 14700, orderDate: '2026-04-24', status: 'completed', paymentStatus: 'paid',
    plannedPaymentDate: '2026-05-04', actualPaymentDate: '2026-04-26', logisticsNo: 'SF20260424056',
    createdAt: '2026-04-24 09:15:00',
  },
  {
    id: 9, orderNo: 'XS-2026042209', customerId: 1, customerName: '华润三九医药股份有限公司',
    herbName: '金钗石斛', specification: '优等/切片', quantity: 40, unit: 'kg', unitPrice: 340,
    totalAmount: 13600, orderDate: '2026-04-25', status: 'completed', paymentStatus: 'paid',
    plannedPaymentDate: '2026-05-05', actualPaymentDate: '2026-04-28', logisticsNo: 'SF20260425089',
    createdAt: '2026-04-25 10:00:00',
  },
  {
    id: 10, orderNo: 'XS-2026042210', customerId: 2, customerName: '广州清平药材行',
    herbName: '金钗石斛', specification: '统货/枫斗', quantity: 60, unit: 'kg', unitPrice: 560,
    totalAmount: 33600, orderDate: '2026-04-26', status: 'paid', paymentStatus: 'paid',
    plannedPaymentDate: '2026-05-06', actualPaymentDate: '2026-04-27',
    createdAt: '2026-04-26 14:30:00',
  },
  {
    id: 11, orderNo: 'XS-2026042211', customerId: 3, customerName: '安徽亳州药材市场',
    herbName: '金钗石斛', specification: '特级/枫斗', quantity: 25, unit: 'kg', unitPrice: 680,
    totalAmount: 17000, orderDate: '2026-04-26', status: 'pending', paymentStatus: 'unpaid',
    plannedPaymentDate: '2026-05-06', createdAt: '2026-04-26 16:45:00',
  },
];

const mockPayments: PaymentRecord[] = [
  { id: 1, orderId: 1, orderNo: 'XS-2026042201', customerName: '华润三九医药股份有限公司', amount: 29000, paymentMethod: 'bank', paymentDate: '2026-04-15', operator: '李财务', createdAt: '2026-04-15' },
  { id: 2, orderId: 2, orderNo: 'XS-2026042202', customerName: '广州清平药材行', amount: 3600, paymentMethod: 'wechat', paymentDate: '2026-04-18', operator: '李财务', createdAt: '2026-04-18' },
  { id: 3, orderId: 3, orderNo: 'XS-2026042203', customerName: '安徽亳州药材市场', amount: 25600, paymentMethod: 'bank', paymentDate: '2026-04-20', operator: '李财务', createdAt: '2026-04-20' },
  { id: 4, orderId: 4, orderNo: 'XS-2026042204', customerName: '北京同仁堂', amount: 17600, paymentMethod: 'alipay', paymentDate: '2026-04-22', operator: '王会计', createdAt: '2026-04-22' },
  { id: 5, orderId: 7, orderNo: 'XS-2026042207', customerName: '赤水源中药材合作社', amount: 6600, paymentMethod: 'cash', paymentDate: '2026-04-24', operator: '李财务', createdAt: '2026-04-24' },
  { id: 6, orderId: 8, orderNo: 'XS-2026042208', customerName: '北京同仁堂', amount: 14700, paymentMethod: 'bank', paymentDate: '2026-04-26', operator: '王会计', createdAt: '2026-04-26' },
  { id: 7, orderId: 9, orderNo: 'XS-2026042209', customerName: '华润三九医药股份有限公司', amount: 13600, paymentMethod: 'bank', paymentDate: '2026-04-28', operator: '李财务', createdAt: '2026-04-28' },
  { id: 8, orderId: 10, orderNo: 'XS-2026042210', customerName: '广州清平药材行', amount: 33600, paymentMethod: 'alipay', paymentDate: '2026-04-27', operator: '李财务', createdAt: '2026-04-27' },
];

// 月度销售趋势 mock
const monthlySales: MonthlySales[] = [
  { month: '2025-07', amount: 58000, orders: 4 },
  { month: '2025-08', amount: 72000, orders: 5 },
  { month: '2025-09', amount: 95000, orders: 7 },
  { month: '2025-10', amount: 113000, orders: 8 },
  { month: '2025-11', amount: 86000, orders: 6 },
  { month: '2025-12', amount: 142000, orders: 10 },
  { month: '2026-01', amount: 98000, orders: 7 },
  { month: '2026-02', amount: 125000, orders: 9 },
  { month: '2026-03', amount: 168000, orders: 12 },
  { month: '2026-04', amount: 189300, orders: 11 },
];

// 药材销售分布 mock
const herbSales: HerbSales[] = [
  { name: '金钗石斛（枫斗）', amount: 420000, quantity: 720, proportion: 42.8 },
  { name: '金钗石斛（鲜条）', amount: 280000, quantity: 2400, proportion: 28.5 },
  { name: '金钗石斛（切片）', amount: 185000, quantity: 560, proportion: 18.9 },
  { name: '金钗石斛（石斛粉）', amount: 97000, quantity: 180, proportion: 9.8 },
];

// ============================================================
// 常量
// ============================================================
const HERB_OPTIONS = ['金钗石斛', '金钗石斛（枫斗）', '金钗石斛（鲜条）', '金钗石斛（切片）', '金钗石斛（石斛粉）'];
const SPEC_OPTIONS = ['特级/枫斗', '特级/鲜条', '优等/枫斗', '优等/切片', '优等/段', '统货/枫斗', '统货/片', '统货/鲜条', '普通/枫斗', '普通/鲜条'];
const UNIT_OPTIONS = ['kg', 'g', '盒', '袋', '支', '瓶'];
const PAYMENT_METHOD_OPTIONS = [
  { value: 'bank', label: '银行转账' },
  { value: 'wechat', label: '微信支付' },
  { value: 'alipay', label: '支付宝' },
  { value: 'cash', label: '现金' },
];
const CUSTOMER_LEVEL_OPTIONS = [
  { value: 'excellent', label: '优质客户' },
  { value: 'normal', label: '普通客户' },
  { value: 'new', label: '新客户' },
];

// ============================================================
// KPI 指标卡
// ============================================================
interface KpiCardProps {
  title: string;
  value: number | string;
  suffix?: string;
  prefix?: React.ReactNode;
  valueStyle?: React.CSSProperties;
  trend?: number;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, suffix, prefix, valueStyle, trend, icon, iconBg, iconColor }) => (
  <Card
    bordered={false}
    style={{ borderRadius: 12 }}
    styles={{ body: { padding: '16px 20px' } }}
    className="card-interactive"
  >
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-1">
        <span style={{ fontSize: 12, color: '#64748b' }}>{title}</span>
        <div className="flex items-baseline gap-1">
          <span style={{ fontSize: 24, fontWeight: 700, color: '#1e293b', lineHeight: 1, ...valueStyle }}>
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </span>
        </div>
        {trend !== undefined && (
          <div className="flex items-center gap-1.5" style={{ marginTop: 4 }}>
            {trend >= 0 ? (
              <RiseOutlined style={{ fontSize: 11, color: '#10b981' }} />
            ) : (
              <WarningOutlined style={{ fontSize: 11, color: '#ef4444' }} />
            )}
            <span style={{ fontSize: 11, color: trend >= 0 ? '#10b981' : '#ef4444', fontWeight: 600 }}>
              {trend >= 0 ? '+' : ''}{trend}%
            </span>
            <span style={{ fontSize: 10, color: '#cbd5e1' }}>较上月</span>
          </div>
        )}
      </div>
      <div
        style={{
          width: 46, height: 46, borderRadius: 10,
          background: iconBg, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: 20, color: iconColor, flexShrink: 0,
        }}
      >
        {icon}
      </div>
    </div>
  </Card>
);

// ============================================================
// 搜索工具栏
// ============================================================
interface ToolbarProps {
  searchText: string;
  onSearch: (v: string) => void;
  statusFilter: string;
  onStatusFilter: (v: string) => void;
  onAdd: () => void;
}

const SearchToolbar: React.FC<ToolbarProps> = ({ searchText, onSearch, statusFilter, onStatusFilter, onAdd }) => (
  <Card bordered={false} style={{ borderRadius: 8, marginBottom: 12 }} styles={{ body: { padding: '12px 16px' } }}>
    <Row gutter={[12, 8]} align="middle">
      <Col xs={24} sm={12} md={8}>
        <Input
          prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
          placeholder="搜索订单号、客户或药材"
          value={searchText}
          onChange={(e) => onSearch(e.target.value)}
          allowClear
        />
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Select
          placeholder="订单状态"
          value={statusFilter}
          onChange={onStatusFilter}
          allowClear
          style={{ width: '100%' }}
          options={[
            { value: '', label: '全部状态' },
            { value: 'pending', label: '待处理' },
            { value: 'paid', label: '已付款' },
            { value: 'shipped', label: '已发货' },
            { value: 'completed', label: '已完成' },
            { value: 'cancelled', label: '已取消' },
          ]}
        />
      </Col>
      <Col style={{ marginLeft: 'auto' }}>
        <Space>
          <Button icon={<ExportOutlined />}>导出</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
            新增订单
          </Button>
        </Space>
      </Col>
    </Row>
  </Card>
);

// ============================================================
// 主页面
// ============================================================
const Sales: React.FC = () => {
  const [orders, setOrders] = useState<SalesOrder[]>(mockOrders);
  const [customers, setCustomers] = useState<SalesCustomer[]>(mockCustomers);
  const [payments] = useState<PaymentRecord[]>(mockPayments);

  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [activeTab, setActiveTab] = useState('orders');

  // 订单 Modal
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderModalMode, setOrderModalMode] = useState<'add' | 'edit'>('add');
  const [editingOrder, setEditingOrder] = useState<SalesOrder | null>(null);
  const [orderForm] = Form.useForm();

  // 详情 Drawer
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [detailOrder, setDetailOrder] = useState<SalesOrder | null>(null);

  // 客户 Modal
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [customerModalMode, setCustomerModalMode] = useState<'add' | 'edit'>('add');
  const [editingCustomer, setEditingCustomer] = useState<SalesCustomer | null>(null);
  const [customerForm] = Form.useForm();

  // 回款 Modal
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentForm] = Form.useForm();
  const [payingOrderId, setPayingOrderId] = useState<number | string | null>(null);

  // ============================================================
  // 计算属性
  // ============================================================
  const kpiData = useMemo(() => {
    const now = dayjs();
    const thisMonth = now.format('YYYY-MM');
    const lastMonth = now.subtract(1, 'month').format('YYYY-MM');

    const thisMonthOrders = orders.filter((o) => o.orderDate.startsWith(thisMonth));
    const lastMonthOrders = orders.filter((o) => o.orderDate.startsWith(lastMonth));

    const thisMonthAmount = thisMonthOrders.filter((o) => o.paymentStatus === 'paid').reduce((s, o) => s + o.totalAmount, 0);
    const lastMonthAmount = lastMonthOrders.filter((o) => o.paymentStatus === 'paid').reduce((s, o) => s + o.totalAmount, 0);

    const totalCollected = orders.filter((o) => o.paymentStatus === 'paid').reduce((s, o) => s + o.totalAmount, 0);
    const totalPending = orders.filter((o) => o.paymentStatus === 'unpaid').reduce((s, o) => s + o.totalAmount, 0);
    const overdueCount = orders.filter((o) => {
      if (o.paymentStatus !== 'unpaid' || !o.plannedPaymentDate) return false;
      return dayjs(o.plannedPaymentDate).isBefore(now, 'day');
    }).length;

    const monthTrend = lastMonthAmount > 0 ? ((thisMonthAmount - lastMonthAmount) / lastMonthAmount) * 100 : 0;
    const ordersTrend = lastMonthOrders.length > 0 ? ((thisMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length) * 100 : 0;
    const overdueRate = orders.length > 0 ? (overdueCount / orders.filter((o) => o.paymentStatus === 'unpaid').length) * 100 : 0;

    return { thisMonthAmount, totalCollected, totalPending, thisMonthOrders: thisMonthOrders.length, lastMonthOrders: lastMonthOrders.length, monthTrend, ordersTrend, overdueCount, overdueRate };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch = !searchText || o.orderNo.includes(searchText) || o.customerName.includes(searchText) || o.herbName.includes(searchText);
      const matchStatus = !statusFilter || o.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, searchText, statusFilter]);

  // ============================================================
  // 订单表格列
  // ============================================================
  const orderColumns: ColumnsType<SalesOrder> = [
    {
      title: '订单号', dataIndex: 'orderNo', key: 'orderNo', width: 140,
      render: (no: string) => <span style={{ fontFamily: 'monospace', color: '#6366f1', fontWeight: 600 }}>{no}</span>,
    },
    {
      title: '客户', dataIndex: 'customerName', key: 'customerName', ellipsis: true,
      render: (name: string, record: SalesOrder) => {
        const customer = customers.find((c) => c.id === record.customerId);
        return (
          <div>
            <div style={{ fontWeight: 500 }}>{name}</div>
            {customer && <Tag color={CUSTOMER_LEVEL_COLOR_MAP[customer.level]} style={{ fontSize: 10, marginTop: 2 }}>{CUSTOMER_LEVEL_MAP[customer.level]}</Tag>}
          </div>
        );
      },
    },
    { title: '药材', dataIndex: 'herbName', key: 'herbName', width: 120 },
    { title: '规格', dataIndex: 'specification', key: 'specification', width: 110, ellipsis: true },
    {
      title: '数量', dataIndex: 'quantity', key: 'quantity', width: 90, align: 'right',
      render: (qty: number, record: SalesOrder) => `${qty.toLocaleString()} ${record.unit}`,
    },
    {
      title: '单价', dataIndex: 'unitPrice', key: 'unitPrice', width: 90, align: 'right',
      render: (p: number) => `¥${p.toLocaleString()}`,
    },
    {
      title: '总金额', dataIndex: 'totalAmount', key: 'totalAmount', width: 110, align: 'right',
      render: (a: number, record: SalesOrder) => (
        <span style={{ color: record.paymentStatus === 'paid' ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
          ¥{a.toLocaleString()}
        </span>
      ),
    },
    { title: '下单日期', dataIndex: 'orderDate', key: 'orderDate', width: 110 },
    {
      title: '计划回款', dataIndex: 'plannedPaymentDate', key: 'plannedPaymentDate', width: 110,
      render: (d: string, record: SalesOrder) => {
        if (!d) return <span style={{ color: '#cbd5e1' }}>—</span>;
        const isOverdue = record.paymentStatus === 'unpaid' && dayjs(d).isBefore(dayjs(), 'day');
        return (
          <Tooltip title={isOverdue ? '已逾期' : ''}>
            <span style={{ color: isOverdue ? '#ef4444' : '#64748b', fontWeight: isOverdue ? 600 : 400 }}>
              {d} {isOverdue && <WarningOutlined style={{ fontSize: 10, color: '#ef4444' }} />}
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: '订单状态', dataIndex: 'status', key: 'status', width: 100,
      render: (s: SalesOrderStatus) => <Tag color={ORDER_STATUS_COLOR[s]}>{SALES_ORDER_STATUS_MAP[s]}</Tag>,
    },
    {
      title: '付款状态', dataIndex: 'paymentStatus', key: 'paymentStatus', width: 100,
      render: (s: PaymentStatus) => <Tag color={PAYMENT_COLOR[s]}>{PAYMENT_STATUS_MAP[s]}</Tag>,
    },
    {
      title: '操作', key: 'action', width: 180, fixed: 'right',
      render: (_: unknown, record: SalesOrder) => (
        <Space size={4}>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => { setDetailOrder(record); setDetailDrawerOpen(true); }}>
            详情
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEditOrder(record)}>
            编辑
          </Button>
          {record.paymentStatus === 'unpaid' && (
            <Button type="link" size="small" icon={<DollarOutlined />} style={{ color: '#10b981' }} onClick={() => handleOpenPayment(record)}>
              回款
            </Button>
          )}
          <Popconfirm title="确认取消此订单？" onConfirm={() => handleCancelOrder(record.id)} okText="确认" cancelText="取消">
            <Button type="link" size="small" danger icon={<DeleteOutlined />} disabled={record.status === 'completed'}>
              取消
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // ============================================================
  // 客户表格列
  // ============================================================
  const customerColumns: ColumnsType<SalesCustomer> = [
    { title: '客户名称', dataIndex: 'name', key: 'name', ellipsis: true, render: (n: string, r: SalesCustomer) => <div><div style={{ fontWeight: 500 }}>{n}</div><div style={{ fontSize: 11, color: '#94a3b8' }}>{r.contact} · {r.phone}</div></div> },
    {
      title: '客户等级', dataIndex: 'level', key: 'level', width: 110,
      render: (l: CustomerLevel) => <Tag color={CUSTOMER_LEVEL_COLOR_MAP[l]}>{CUSTOMER_LEVEL_MAP[l]}</Tag>,
    },
    { title: '累计订单', dataIndex: 'totalOrders', key: 'totalOrders', width: 90, align: 'center', render: (n: number) => `${n} 笔` },
    {
      title: '累计金额', dataIndex: 'totalAmount', key: 'totalAmount', width: 110, align: 'right',
      render: (a: number) => <span style={{ color: '#10b981', fontWeight: 600 }}>¥{a.toLocaleString()}</span>,
    },
    {
      title: '待收款', dataIndex: 'pendingAmount', key: 'pendingAmount', width: 110, align: 'right',
      render: (a: number) => a > 0 ? <span style={{ color: '#f59e0b', fontWeight: 600 }}>¥{a.toLocaleString()}</span> : '—',
    },
    {
      title: '信用额度', dataIndex: 'creditLimit', key: 'creditLimit', width: 110, align: 'right',
      render: (a: number) => `¥${a.toLocaleString()}`,
    },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 90,
      render: (s: string) => <Tag color={s === 'active' ? 'green' : 'red'}>{s === 'active' ? '正常' : '已禁用'}</Tag>,
    },
    {
      title: '操作', key: 'action', width: 120,
      render: (_: unknown, record: SalesCustomer) => (
        <Space size={4}>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEditCustomer(record)}>编辑</Button>
          <Popconfirm title={`确认${record.status === 'active' ? '禁用' : '启用'}此客户？`} onConfirm={() => handleToggleCustomer(record)}>
            <Button type="link" size="small" danger={record.status === 'active'}>
              {record.status === 'active' ? '禁用' : '启用'}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // ============================================================
  // 回款表格列
  // ============================================================
  const paymentColumns: ColumnsType<PaymentRecord> = [
    { title: '收款流水号', dataIndex: 'id', key: 'id', width: 120, render: (id: number) => <span style={{ fontFamily: 'monospace' }}>PAY-{String(id).padStart(6, '0')}</span> },
    { title: '关联订单', dataIndex: 'orderNo', key: 'orderNo', width: 140, render: (no: string) => <span style={{ fontFamily: 'monospace', color: '#6366f1' }}>{no}</span> },
    { title: '客户', dataIndex: 'customerName', key: 'customerName', ellipsis: true },
    {
      title: '收款金额', dataIndex: 'amount', key: 'amount', width: 110, align: 'right',
      render: (a: number) => <span style={{ color: '#10b981', fontWeight: 600 }}>¥{a.toLocaleString()}</span>,
    },
    {
      title: '支付方式', dataIndex: 'paymentMethod', key: 'paymentMethod', width: 110,
      render: (m: string) => <Tag color={PAYMENT_METHOD_COLOR[m]}>{PAYMENT_METHOD_LABEL[m]}</Tag>,
    },
    { title: '收款日期', dataIndex: 'paymentDate', key: 'paymentDate', width: 110 },
    { title: '操作员', dataIndex: 'operator', key: 'operator', width: 90 },
    { title: '备注', dataIndex: 'remark', key: 'remark', ellipsis: true },
  ];

  // ============================================================
  // 操作处理
  // ============================================================
  const handleAddOrder = () => {
    setEditingOrder(null);
    setOrderModalMode('add');
    orderForm.resetFields();
    orderForm.setFieldsValue({ unit: 'kg', unitPrice: 0, quantity: 0, orderDate: dayjs() });
    setOrderModalOpen(true);
  };

  const handleEditOrder = (order: SalesOrder) => {
    setEditingOrder(order);
    setOrderModalMode('edit');
    orderForm.setFieldsValue({
      ...order,
      orderDate: order.orderDate ? dayjs(order.orderDate) : undefined,
      plannedPaymentDate: order.plannedPaymentDate ? dayjs(order.plannedPaymentDate) : undefined,
    });
    setOrderModalOpen(true);
  };

  const handleSaveOrder = async () => {
    try {
      const values = await orderForm.validateFields();
      const base = { ...values, orderDate: values.orderDate?.format('YYYY-MM-DD') || '', plannedPaymentDate: values.plannedPaymentDate?.format('YYYY-MM-DD') || '' };
      base.totalAmount = base.quantity * base.unitPrice;
      const customer = customers.find((c) => c.id === base.customerId);
      base.customerName = customer?.name || '';

      if (orderModalMode === 'add') {
        const newOrder: SalesOrder = {
          ...base, id: Date.now(), orderNo: `XS-${dayjs().format('YYYYMMDD')}${String(orders.length + 1).padStart(2, '0')}`,
          status: 'pending', paymentStatus: 'unpaid', unit: base.unit || 'kg', createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        };
        setOrders((prev) => [newOrder, ...prev]);
        message.success('订单创建成功');
      } else {
        setOrders((prev) => prev.map((o) => (o.id === editingOrder!.id ? { ...o, ...base } : o)));
        message.success('订单更新成功');
      }
      setOrderModalOpen(false);
    } catch {}
  };

  const handleCancelOrder = (id: number | string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: 'cancelled' as const } : o)));
    message.success('订单已取消');
  };

  const handleOpenPayment = (order: SalesOrder) => {
    setPayingOrderId(order.id);
    paymentForm.resetFields();
    paymentForm.setFieldsValue({ orderId: order.id, orderNo: order.orderNo, customerName: order.customerName, amount: order.totalAmount, paymentDate: dayjs() });
    setPaymentModalOpen(true);
  };

  const handleSavePayment = async () => {
    try {
      const values = await paymentForm.validateFields();
      const order = orders.find((o) => o.id === payingOrderId);
      if (!order) return;

      const newPayment: PaymentRecord = {
        ...values, id: Date.now(), paymentDate: values.paymentDate?.format('YYYY-MM-DD') || '',
        operator: '系统管理员', createdAt: dayjs().format('YYYY-MM-DD'),
      };
      payments.push(newPayment);

      setOrders((prev) => prev.map((o) => (o.id === payingOrderId ? { ...o, paymentStatus: 'paid' as const, actualPaymentDate: newPayment.paymentDate } : o)));
      setPaymentModalOpen(false);
      message.success(`成功收款 ¥${order.totalAmount.toLocaleString()}`);
    } catch {}
  };

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setCustomerModalMode('add');
    customerForm.resetFields();
    customerForm.setFieldsValue({ status: 'active', level: 'normal' });
    setCustomerModalOpen(true);
  };

  const handleEditCustomer = (customer: SalesCustomer) => {
    setEditingCustomer(customer);
    setCustomerModalMode('edit');
    customerForm.setFieldsValue(customer);
    setCustomerModalOpen(true);
  };

  const handleSaveCustomer = async () => {
    try {
      const values = await customerForm.validateFields();
      if (customerModalMode === 'add') {
        const newCustomer: SalesCustomer = { ...values, id: Date.now(), totalOrders: 0, totalAmount: 0, pendingAmount: 0, createdAt: dayjs().format('YYYY-MM-DD') };
        setCustomers((prev) => [newCustomer, ...prev]);
        message.success('客户添加成功');
      } else {
        setCustomers((prev) => prev.map((c) => (c.id === editingCustomer!.id ? { ...c, ...values } : c)));
        message.success('客户信息已更新');
      }
      setCustomerModalOpen(false);
    } catch {}
  };

  const handleToggleCustomer = (customer: SalesCustomer) => {
    setCustomers((prev) => prev.map((c) => (c.id === customer.id ? { ...c, status: c.status === 'active' ? 'disabled' : 'active' } : c)));
    message.success(`客户已${customer.status === 'active' ? '禁用' : '启用'}`);
  };

  // ============================================================
  // Tab 项配置
  // ============================================================
  const tabItems = [
    {
      key: 'orders',
      label: (
        <span><ShoppingOutlined /> 订单管理</span>
      ),
      children: (
        <>
          <SearchToolbar
            searchText={searchText} onSearch={setSearchText}
            statusFilter={statusFilter} onStatusFilter={setStatusFilter}
            onAdd={handleAddOrder}
          />
          <Card bordered={false} style={{ borderRadius: 8 }} styles={{ body: { padding: 0 } }}>
            <Table
              columns={orderColumns} dataSource={filteredOrders} rowKey="id"
              pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (t) => `共 ${t} 条` }}
              scroll={{ x: 1600 }}
              size="middle"
            />
          </Card>
        </>
      ),
    },
    {
      key: 'customers',
      label: (
        <span><AccountBookOutlined /> 客户管理</span>
      ),
      children: (
        <>
          <Card bordered={false} style={{ borderRadius: 8, marginBottom: 12 }} styles={{ body: { padding: '12px 16px' } }}>
            <Row gutter={12} align="middle">
              <Col style={{ marginLeft: 'auto' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCustomer}>新增客户</Button>
              </Col>
            </Row>
          </Card>
          <Card bordered={false} style={{ borderRadius: 8 }} styles={{ body: { padding: 0 } }}>
            <Table
              columns={customerColumns} dataSource={customers} rowKey="id"
              pagination={{ pageSize: 10 }}
              scroll={{ x: 1200 }}
              size="middle"
            />
          </Card>
        </>
      ),
    },
    {
      key: 'statistics',
      label: (
        <span><RiseOutlined /> 销售统计</span>
      ),
      children: <SalesChart monthlySales={monthlySales} herbSales={herbSales} orders={orders} />,
    },
    {
      key: 'payments',
      label: (
        <span>
          <DollarOutlined /> 回款管理
          {kpiData.overdueCount > 0 && (
            <Tag color="red" style={{ marginLeft: 6, fontSize: 10 }}>{kpiData.overdueCount} 逾期</Tag>
          )}
        </span>
      ),
      children: (
        <>
          <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
            <Col xs={24} sm={8}>
              <Card bordered={false} style={{ borderRadius: 8 }} styles={{ body: { padding: '16px 20px' } }}>
                <Statistic title="已收款总额" value={kpiData.totalCollected} prefix="¥" valueStyle={{ color: '#10b981' }} />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card bordered={false} style={{ borderRadius: 8 }} styles={{ body: { padding: '16px 20px' } }}>
                <Statistic title="待收款总额" value={kpiData.totalPending} prefix="¥" valueStyle={{ color: '#f59e0b' }} />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card bordered={false} style={{ borderRadius: 8 }} styles={{ body: { padding: '16px 20px' } }}>
                <Statistic
                  title="逾期未收订单"
                  value={kpiData.overdueCount}
                  valueStyle={{ color: '#ef4444' }}
                  suffix={<span style={{ fontSize: 14, color: '#ef4444' }}>笔 <WarningOutlined /></span>}
                />
              </Card>
            </Col>
          </Row>
          <Card bordered={false} style={{ borderRadius: 8 }} styles={{ body: { padding: 0 } }}>
            <Table
              columns={paymentColumns} dataSource={payments} rowKey="id"
              pagination={{ pageSize: 10, showTotal: (t) => `共 ${t} 条` }}
              scroll={{ x: 1200 }}
              size="middle"
            />
          </Card>
        </>
      ),
    },
  ];

  // ============================================================
  // 渲染
  // ============================================================
  return (
    <div style={{ background: '#faf9f5', minHeight: '100%' }}>
      <PageHeading
        eyebrow="市场销售"
        title="市场销售服务平台"
        description="统一管理销售订单、客户信息、销售统计与回款跟踪"
        accentColor="#6366f1"
        gradientFrom="#1e1b4b"
        gradientMid="#2d2565"
        gradientTo="#3730a3"
        padding="32px 32px 28px"
      />

      <div style={{ maxWidth: 1360, margin: '0 auto', padding: '20px 32px 32px' }}>
        {/* KPI 指标卡 */}
        <Row gutter={[12, 12]} style={{ marginBottom: 14 }}>
          <Col xs={24} sm={12} xl={6}>
            <KpiCard
              title="本月订单数" value={kpiData.thisMonthOrders} suffix="笔"
              trend={kpiData.ordersTrend} icon={<ShoppingOutlined />}
              iconBg="rgba(99,102,241,0.1)" iconColor="#6366f1"
            />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <KpiCard
            title="本月销售额" value={kpiData.thisMonthAmount} prefix="¥"
            trend={kpiData.monthTrend} icon={<RiseOutlined />}
            iconBg="rgba(16,185,129,0.1)" iconColor="#10b981"
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <KpiCard
            title="已收款总额" value={kpiData.totalCollected} prefix="¥"
            icon={<DollarOutlined />}
            iconBg="rgba(6,182,212,0.1)" iconColor="#06b6d4"
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <KpiCard
            title="待收款金额" value={kpiData.totalPending} prefix="¥"
            icon={<AccountBookOutlined />}
            iconBg="rgba(245,158,11,0.1)" iconColor="#f59e0b"
          />
        </Col>
      </Row>

      {/* Tab 切换 */}
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />

      {/* 新增/编辑订单 Modal */}
      <Modal
        title={orderModalMode === 'add' ? '新增订单' : '编辑订单'}
        open={orderModalOpen}
        onOk={handleSaveOrder}
        onCancel={() => setOrderModalOpen(false)}
        width={600}
        okText="保存"
        cancelText="取消"
      >
        <Form form={orderForm} layout="vertical" style={{ marginTop: 16 }}>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="customerId" label="客户" rules={[{ required: true, message: '请选择客户' }]}>
                <Select placeholder="请选择客户" showSearch optionFilterProp="children">
                  {customers.filter((c) => c.status === 'active').map((c) => (
                    <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="herbName" label="药材名称" rules={[{ required: true, message: '请输入药材名称' }]}>
                <Select placeholder="请选择药材">
                  {HERB_OPTIONS.map((h) => <Select.Option key={h} value={h}>{h}</Select.Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="specification" label="规格" rules={[{ required: true, message: '请选择规格' }]}>
                <Select placeholder="请选择规格">
                  {SPEC_OPTIONS.map((s) => <Select.Option key={s} value={s}>{s}</Select.Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="orderDate" label="下单日期">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="quantity" label="数量" rules={[{ required: true, message: '请输入数量' }]}>
                <InputNumber min={0} style={{ width: '100%' }} addonAfter={
                  <Form.Item noStyle name="unit">
                    <Select style={{ width: 60 }} defaultValue="kg">
                      {UNIT_OPTIONS.map((u) => <Select.Option key={u} value={u}>{u}</Select.Option>)}
                    </Select>
                  </Form.Item>
                } />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="unitPrice" label="单价（元）" rules={[{ required: true, message: '请输入单价' }]}>
                <InputNumber min={0} style={{ width: '100%' }} addonAfter="元/kg" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="plannedPaymentDate" label="计划回款日期">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="remark" label="备注">
                <Input.TextArea rows={2} placeholder="可选：备注信息" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 订单详情 Drawer */}
      <Drawer
        title="订单详情" placement="right" width={560}
        open={detailDrawerOpen} onClose={() => setDetailDrawerOpen(false)}
      >
        {detailOrder && (
          <>
            <Descriptions column={2} bordered size="small" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="订单号" span={2}>
                <span style={{ fontFamily: 'monospace', color: '#6366f1', fontWeight: 600 }}>{detailOrder.orderNo}</span>
              </Descriptions.Item>
              <Descriptions.Item label="客户">{detailOrder.customerName}</Descriptions.Item>
              <Descriptions.Item label="客户等级">
                {(() => { const c = customers.find((c) => c.id === detailOrder.customerId); return c ? <Tag color={CUSTOMER_LEVEL_COLOR_MAP[c.level]}>{CUSTOMER_LEVEL_MAP[c.level]}</Tag> : '—'; })()}
              </Descriptions.Item>
              <Descriptions.Item label="药材">{detailOrder.herbName}</Descriptions.Item>
              <Descriptions.Item label="规格">{detailOrder.specification}</Descriptions.Item>
              <Descriptions.Item label="数量">{detailOrder.quantity} {detailOrder.unit}</Descriptions.Item>
              <Descriptions.Item label="单价">¥{detailOrder.unitPrice.toLocaleString()}/kg</Descriptions.Item>
              <Descriptions.Item label="总金额">
                <span style={{ color: '#10b981', fontWeight: 700, fontSize: 16 }}>¥{detailOrder.totalAmount.toLocaleString()}</span>
              </Descriptions.Item>
              <Descriptions.Item label="下单日期">{detailOrder.orderDate}</Descriptions.Item>
              <Descriptions.Item label="计划回款">{detailOrder.plannedPaymentDate || '—'}</Descriptions.Item>
              <Descriptions.Item label="实际回款">{detailOrder.actualPaymentDate || '—'}</Descriptions.Item>
              <Descriptions.Item label="物流单号">{detailOrder.logisticsNo || '—'}</Descriptions.Item>
              <Descriptions.Item label="订单状态">
                <Tag color={ORDER_STATUS_COLOR[detailOrder.status]}>{SALES_ORDER_STATUS_MAP[detailOrder.status]}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="付款状态" span={2}>
                <Tag color={PAYMENT_COLOR[detailOrder.paymentStatus]}>{PAYMENT_STATUS_MAP[detailOrder.paymentStatus]}</Tag>
              </Descriptions.Item>
              {detailOrder.remark && (
                <Descriptions.Item label="备注" span={2}>{detailOrder.remark}</Descriptions.Item>
              )}
            </Descriptions>

            <Divider>订单状态流转</Divider>
            <Timeline
              items={[
                { color: 'green', children: <div><div style={{ fontWeight: 600 }}>订单创建</div><div style={{ fontSize: 12, color: '#94a3b8' }}>{detailOrder.createdAt}</div></div> },
                ...(detailOrder.paymentStatus === 'paid' ? [{ color: 'blue', children: <div><div style={{ fontWeight: 600 }}>款项已收</div><div style={{ fontSize: 12, color: '#94a3b8' }}>{detailOrder.actualPaymentDate}</div></div> }] : []),
                ...(detailOrder.status === 'shipped' || detailOrder.status === 'completed' ? [{ color: 'cyan', children: <div><div style={{ fontWeight: 600 }}>已发货</div><div style={{ fontSize: 12, color: '#94a3b8' }}>物流：{detailOrder.logisticsNo || '暂无'}</div></div> }] : []),
                ...(detailOrder.status === 'completed' ? [{ color: 'green', children: <div><div style={{ fontWeight: 600 }}>已完成</div></div> }] : []),
                ...(detailOrder.status === 'cancelled' ? [{ color: 'red', children: <div><div style={{ fontWeight: 600 }}>已取消</div></div> }] : []),
              ]}
            />
          </>
        )}
      </Drawer>

      {/* 新增/编辑客户 Modal */}
      <Modal
        title={customerModalMode === 'add' ? '新增客户' : '编辑客户'}
        open={customerModalOpen}
        onOk={handleSaveCustomer}
        onCancel={() => setCustomerModalOpen(false)}
        width={560}
        okText="保存"
        cancelText="取消"
      >
        <Form form={customerForm} layout="vertical" style={{ marginTop: 16 }}>
          <Row gutter={12}>
            <Col span={24}>
              <Form.Item name="name" label="客户名称" rules={[{ required: true, message: '请输入客户名称' }]}>
                <Input placeholder="请输入客户名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="contact" label="联系人" rules={[{ required: true, message: '请输入联系人' }]}>
                <Input placeholder="请输入联系人" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="联系电话" rules={[{ required: true, message: '请输入联系电话' }]}>
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="address" label="收货地址">
                <Input.TextArea rows={2} placeholder="请输入收货地址" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="level" label="客户等级">
                <Select>
                  {CUSTOMER_LEVEL_OPTIONS.map((o) => <Select.Option key={o.value} value={o.value}>{o.label}</Select.Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="creditLimit" label="信用额度（元）">
                <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入信用额度" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 回款登记 Modal */}
      <Modal
        title="回款登记" open={paymentModalOpen}
        onOk={handleSavePayment} onCancel={() => setPaymentModalOpen(false)}
        width={480} okText="确认收款" cancelText="取消"
      >
        <Form form={paymentForm} layout="vertical" style={{ marginTop: 16 }}>
          <Descriptions column={2} bordered size="small" style={{ marginBottom: 16 }}>
            <Descriptions.Item label="关联订单" span={2}>{paymentForm.getFieldValue('orderNo')}</Descriptions.Item>
            <Descriptions.Item label="客户">{paymentForm.getFieldValue('customerName')}</Descriptions.Item>
            <Descriptions.Item label="应收金额">
              <span style={{ color: '#f59e0b', fontWeight: 700 }}>¥{paymentForm.getFieldValue('amount')?.toLocaleString() || 0}</span>
            </Descriptions.Item>
          </Descriptions>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="amount" label="收款金额" rules={[{ required: true, message: '请输入收款金额' }]}>
                <InputNumber min={0} style={{ width: '100%' }} prefix="¥" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="paymentMethod" label="支付方式" rules={[{ required: true, message: '请选择支付方式' }]}>
                <Select placeholder="请选择">
                  {PAYMENT_METHOD_OPTIONS.map((o) => <Select.Option key={o.value} value={o.value}>{o.label}</Select.Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="paymentDate" label="收款日期" rules={[{ required: true, message: '请选择收款日期' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="remark" label="备注">
                <Input.TextArea rows={2} placeholder="可选" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
    </div>
  );
};

export default Sales;
