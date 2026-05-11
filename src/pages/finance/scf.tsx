import React, { useState } from 'react';
import { Card, Table, Button, Tag, Row, Col, Tabs, Drawer, Descriptions, Timeline } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  FileTextOutlined, ClockCircleOutlined,
  MoneyCollectOutlined, BankOutlined,
  ArrowRightOutlined, EyeOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import {
  receivables, financingApplications, scfStats, CHART_COLORS,
  type Receivable, type FinancingApplication,
  type ReceivableStatus, type FinancingStatus,
} from './mockData';

const RCV_STATUS_LABEL: Record<ReceivableStatus, string> = {
  pending: '待确权', confirmed: '已确权', financed: '已融资', repaid: '已结清',
};
const FIN_STATUS_LABEL: Record<FinancingStatus, string> = {
  pending: '待审批', approved: '已通过', rejected: '已拒绝', financed: '已放款', repaid: '已结清',
};
const STATUS_COLORS: Record<string, string> = {
  pending: '#cc785c', confirmed: '#5db8a6', financed: '#e8a55a', repaid: '#5db872',
  approved: '#5db8a6', rejected: '#c64545', '已结清': '#6c6a64',
};

const DonutChart: React.FC<{ data: { name: string; value: number; color: string }[]; title: string }> = ({ data, title }) => {
  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
      backgroundColor: '#ffffff',
      borderColor: '#e6dfd8',
      borderWidth: 1,
      textStyle: { color: '#141413', fontSize: 11, fontFamily: '"Inter", sans-serif' },
      formatter: '{b}: {c}万元 ({d}%)',
    },
    legend: { show: false },
    series: [{
      type: 'pie', radius: ['52%', '76%'],
      center: ['50%', '50%'],
      data: data.map(d => ({ ...d, itemStyle: { borderRadius: 4, borderColor: '#faf9f5', borderWidth: 2 } })),
      label: { show: false },
      emphasis: { scale: true, scaleSize: 4 },
    }],
  };
  return (
    <div>
      <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#8e8b82', marginBottom: 10 }}>{title}</div>
      <ReactECharts option={option} style={{ height: 120 }} notMerge />
    </div>
  );
};

const BarChart: React.FC = () => {
  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#ffffff', borderColor: '#e6dfd8', borderWidth: 1,
      textStyle: { color: '#141413', fontSize: 11, fontFamily: '"Inter", sans-serif' },
    },
    grid: { left: 40, right: 10, top: 8, bottom: 28 },
    xAxis: {
      type: 'category',
      data: ['5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      axisLine: { lineStyle: { color: '#e6dfd8' } },
      axisLabel: { color: '#8e8b82', fontSize: 10, fontFamily: '"Inter", sans-serif' },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value', axisLine: { show: false }, axisTick: { show: false },
      splitLine: { lineStyle: { color: '#ebe6df' } },
      axisLabel: { color: '#8e8b82', fontSize: 10, fontFamily: '"Inter", sans-serif' },
    },
    series: [{
      type: 'bar',
      data: [
        { value: 45, itemStyle: { color: CHART_COLORS.teal, borderRadius: [4, 4, 0, 0] } },
        { value: 28, itemStyle: { color: CHART_COLORS.teal, borderRadius: [4, 4, 0, 0] } },
        { value: 62, itemStyle: { color: CHART_COLORS.primary, borderRadius: [4, 4, 0, 0] } },
        { value: 55, itemStyle: { color: CHART_COLORS.primary, borderRadius: [4, 4, 0, 0] } },
        { value: 38, itemStyle: { color: CHART_COLORS.teal, borderRadius: [4, 4, 0, 0] } },
        { value: 70, itemStyle: { color: CHART_COLORS.primary, borderRadius: [4, 4, 0, 0] } },
        { value: 58, itemStyle: { color: CHART_COLORS.accent, borderRadius: [4, 4, 0, 0] } },
        { value: 82, itemStyle: { color: CHART_COLORS.accent, borderRadius: [4, 4, 0, 0] } },
      ],
      barWidth: '40%',
    }],
  };
  return <ReactECharts option={option} style={{ height: 140 }} notMerge />;
};

const ScfPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('receivables');
  const [detailRcv, setDetailRcv] = useState<Receivable | null>(null);
  const [detailFin, setDetailFin] = useState<FinancingApplication | null>(null);
  const [rcvDrawer, setRcvDrawer] = useState(false);
  const [finDrawer, setFinDrawer] = useState(false);

  const rcvColumns: ColumnsType<Receivable> = [
    {
      title: '应收账款编号', dataIndex: 'receivableNo', key: 'receivableNo', width: 150,
      render: (n) => <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: '#6c6a64' }}>{n}</span>,
    },
    {
      title: '关联订单', dataIndex: 'orderNo', key: 'orderNo', width: 140,
      render: (o) => <Tag style={{ borderRadius: 4, border: '1px solid #e6dfd8', background: 'transparent', color: '#6c6a64', fontSize: 11 }}>{o}</Tag>,
    },
    {
      title: '金额', dataIndex: 'amount', key: 'amount', width: 90,
      render: (a) => <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 500, color: '#cc785c' }}>{a}万元</span>,
    },
    {
      title: '买方（核心企业）', dataIndex: 'buyer', key: 'buyer',
      render: (b) => <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: '#141413' }}>{b}</span>,
    },
    {
      title: '卖方（供应商）', dataIndex: 'seller', key: 'seller',
      render: (s) => <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: '#6c6a64' }}>{s}</span>,
    },
    {
      title: '品名', dataIndex: 'herbName', key: 'herbName', width: 100,
      render: (h) => <Tag style={{ borderRadius: 9999, border: 'none', background: '#efe9de', color: '#6c6a64', fontSize: 11 }}>{h}</Tag>,
    },
    {
      title: '到期日', dataIndex: 'dueDate', key: 'dueDate', width: 100,
      render: (d) => <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: '#6c6a64' }}>{d}</span>,
    },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 100,
      render: (s: ReceivableStatus) => {
        const color = STATUS_COLORS[s] || '#6c6a64';
        return (
          <Tag style={{ borderRadius: 9999, border: 'none', background: `${color}14`, color, fontSize: 11 }}>
            {RCV_STATUS_LABEL[s]}
          </Tag>
        );
      },
    },
    {
      title: '操作', key: 'action', width: 80,
      render: (_, r) => (
        <Button type="link" size="small" icon={<EyeOutlined />} style={{ color: '#cc785c', fontSize: 12, padding: '0 4px' }}
          onClick={() => { setDetailRcv(r); setRcvDrawer(true); }}>
          详情
        </Button>
      ),
    },
  ];

  const finColumns: ColumnsType<FinancingApplication> = [
    {
      title: '融资申请编号', dataIndex: 'financingNo', key: 'financingNo', width: 150,
      render: (n) => <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: '#6c6a64' }}>{n}</span>,
    },
    {
      title: '关联应收账款', dataIndex: 'receivableNo', key: 'receivableNo', width: 150,
      render: (r) => <Tag style={{ borderRadius: 4, border: '1px solid #e6dfd8', background: 'transparent', color: '#6c6a64', fontSize: 11 }}>{r}</Tag>,
    },
    {
      title: '融资额', dataIndex: 'amount', key: 'amount', width: 100,
      render: (a) => <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 500, color: '#cc785c' }}>{a}万元</span>,
    },
    {
      title: '年化利率', dataIndex: 'financingRate', key: 'financingRate', width: 90,
      render: (r) => <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: '#6c6a64' }}>{r}%</span>,
    },
    {
      title: '金融机构', dataIndex: 'bank', key: 'bank', width: 150,
      render: (b) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <BankOutlined style={{ color: '#8e8b82', fontSize: 12 }} />
          <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: '#6c6a64' }}>{b}</span>
        </div>
      ),
    },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 100,
      render: (s: FinancingStatus) => {
        const color = STATUS_COLORS[s] || '#6c6a64';
        return (
          <Tag style={{ borderRadius: 9999, border: 'none', background: `${color}14`, color, fontSize: 11 }}>
            {FIN_STATUS_LABEL[s]}
          </Tag>
        );
      },
    },
    {
      title: '申请日期', dataIndex: 'applyDate', key: 'applyDate', width: 100,
      render: (d) => <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: '#6c6a64' }}>{d}</span>,
    },
    {
      title: '操作', key: 'action', width: 80,
      render: (_, r) => (
        <Button type="link" size="small" icon={<EyeOutlined />} style={{ color: '#cc785c', fontSize: 12, padding: '0 4px' }}
          onClick={() => { setDetailFin(r); setFinDrawer(true); }}>
          详情
        </Button>
      ),
    },
  ];

  const KpiCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; accentColor: string }> =
    ({ title, value, icon, accentColor }) => (
      <Card style={{ borderRadius: 12, border: '1px solid #e6dfd8' }} styles={{ body: { padding: '16px 20px' } }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: `${accentColor}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accentColor, fontSize: 16 }}>
            {icon}
          </div>
          <div>
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#6c6a64', marginBottom: 2 }}>{title}</div>
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 20, fontWeight: 500, color: '#141413' }}>{value}</div>
          </div>
        </div>
      </Card>
    );

  return (
    <div style={{ background: '#faf9f5', minHeight: '100vh', padding: '40px 64px' }}>
      {/* Hero */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: '"Tiempos Headline", "Cormorant Garamond", Garamond, serif', fontSize: 32, fontWeight: 400, letterSpacing: '-0.3px', color: '#141413', margin: '0 0 6px', lineHeight: 1.1 }}>
          供应链金融
        </h1>
        <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, color: '#6c6a64', margin: 0 }}>
          应收账款确权 · 融资申请管理 · 核心企业信用穿透
        </p>
      </div>

      {/* KPI */}
      <Row gutter={[12, 12]} style={{ marginBottom: 24 }}>
        <Col xs={12} xl={6}><KpiCard title="应收账款总额" value={`${scfStats.totalReceivables}万元`} icon={<FileTextOutlined />} accentColor="#e8a55a" /></Col>
        <Col xs={12} xl={6}><KpiCard title="已融资总额" value={`${scfStats.totalFinanced}万元`} icon={<MoneyCollectOutlined />} accentColor="#5db8a6" /></Col>
        <Col xs={12} xl={6}><KpiCard title="未结清余额" value={`${scfStats.outstandingAmount}万元`} icon={<ClockCircleOutlined />} accentColor="#cc785c" /></Col>
        <Col xs={12} xl={6}><KpiCard title="待融资申请" value={`${scfStats.pendingCount}笔`} icon={<ArrowRightOutlined />} accentColor="#c64545" /></Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={[12, 12]} style={{ marginBottom: 24 }}>
        <Col xs={24} xl={8}>
          <Card style={{ borderRadius: 12, border: '1px solid #e6dfd8', height: '100%' }} styles={{ body: { padding: '16px 20px' } }}>
            <DonutChart
              title="应收账款状态分布"
              data={[
                { name: '已确权', value: receivables.filter(r => r.status === 'confirmed').reduce((s, r) => s + r.amount, 0), color: CHART_COLORS.teal },
                { name: '已融资', value: receivables.filter(r => r.status === 'financed').reduce((s, r) => s + r.amount, 0), color: CHART_COLORS.accent },
                { name: '已结清', value: receivables.filter(r => r.status === 'repaid').reduce((s, r) => s + r.amount, 0), color: CHART_COLORS.secondary },
                { name: '待确权', value: receivables.filter(r => r.status === 'pending').reduce((s, r) => s + r.amount, 0), color: CHART_COLORS.primary },
              ]}
            />
          </Card>
        </Col>
        <Col xs={24} xl={16}>
          <Card style={{ borderRadius: 12, border: '1px solid #e6dfd8', height: '100%' }} styles={{ body: { padding: '16px 20px' } }}>
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#8e8b82', marginBottom: 4 }}>月度融资趋势（万元）</div>
            <BarChart />
          </Card>
        </Col>
      </Row>

      {/* Tables */}
      <Card style={{ borderRadius: 12, border: '1px solid #e6dfd8' }} styles={{ body: { padding: 0 } }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #ebe6df' }}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              { key: 'receivables', label: `应收账款确权 (${receivables.length})` },
              { key: 'financing', label: `融资申请 (${financingApplications.length})` },
            ]}
          />
        </div>
        {activeTab === 'receivables' ? (
          <Table columns={rcvColumns} dataSource={receivables} rowKey="id" pagination={{ pageSize: 8, showTotal: t => `共 ${t} 条` }} size="middle" />
        ) : (
          <Table columns={finColumns} dataSource={financingApplications} rowKey="id" pagination={{ pageSize: 8, showTotal: t => `共 ${t} 条` }} size="middle" />
        )}
      </Card>

      {/* Receivable Detail */}
      <Drawer title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FileTextOutlined style={{ color: '#e8a55a' }} />
          <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 15, fontWeight: 500, color: '#141413' }}>应收账款详情</span>
        </div>
      } placement="right" width={520} open={rcvDrawer} onClose={() => setRcvDrawer(false)}>
        {detailRcv && (
          <div>
            <Descriptions column={2} bordered size="small" style={{ marginBottom: 20 }}>
              <Descriptions.Item label="应收账款编号" span={2}>{detailRcv.receivableNo}</Descriptions.Item>
              <Descriptions.Item label="关联订单" span={2}>
                <Tag style={{ borderRadius: 4, border: '1px solid #e6dfd8', background: 'transparent', color: '#6c6a64', fontSize: 11 }}>{detailRcv.orderNo}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="金额" span={2}>
                <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 18, fontWeight: 500, color: '#cc785c' }}>{detailRcv.amount}万元</span>
              </Descriptions.Item>
              <Descriptions.Item label="买方" span={2}>{detailRcv.buyer}</Descriptions.Item>
              <Descriptions.Item label="卖方" span={2}>{detailRcv.seller}</Descriptions.Item>
              <Descriptions.Item label="药材品名">{detailRcv.herbName}</Descriptions.Item>
              <Descriptions.Item label="到期日">{detailRcv.dueDate}</Descriptions.Item>
              <Descriptions.Item label="创建日期">{detailRcv.createDate}</Descriptions.Item>
              <Descriptions.Item label="确权日期">{detailRcv.confirmedDate ?? '—'}</Descriptions.Item>
              <Descriptions.Item label="状态" span={2}>
                <Tag style={{ borderRadius: 9999, border: 'none', background: `${STATUS_COLORS[detailRcv.status]}14`, color: STATUS_COLORS[detailRcv.status], fontSize: 11 }}>
                  {RCV_STATUS_LABEL[detailRcv.status]}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
            <div style={{ background: '#f5f0e8', borderRadius: 10, padding: '16px 20px' }}>
              <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, fontWeight: 500, color: '#141413', marginBottom: 12 }}>流转说明</div>
              <Timeline items={[
                { color: '#5db8a6', children: <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12 }}><div style={{ fontWeight: 500, color: '#141413' }}>生成应收账款</div><div style={{ color: '#6c6a64' }}>{detailRcv.createDate}</div></div> },
                { color: detailRcv.confirmedDate ? '#5db8a6' : '#cc785c', children: <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12 }}><div style={{ fontWeight: 500, color: '#141413' }}>核心企业确权</div><div style={{ color: '#6c6a64' }}>{detailRcv.confirmedDate ?? '待确权'}</div></div> },
                { color: '#e8a55a', children: <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12 }}><div style={{ fontWeight: 500, color: '#141413' }}>金融机构融资</div><div style={{ color: '#6c6a64' }}>可发起融资申请</div></div> },
                { color: '#5db872', children: <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12 }}><div style={{ fontWeight: 500, color: '#141413' }}>到期结算</div><div style={{ color: '#6c6a64' }}>{detailRcv.dueDate}</div></div> },
              ]} />
            </div>
          </div>
        )}
      </Drawer>

      {/* Financing Detail */}
      <Drawer title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <MoneyCollectOutlined style={{ color: '#5db8a6' }} />
          <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 15, fontWeight: 500, color: '#141413' }}>融资申请详情</span>
        </div>
      } placement="right" width={520} open={finDrawer} onClose={() => setFinDrawer(false)}>
        {detailFin && (
          <div>
            <Descriptions column={2} bordered size="small" style={{ marginBottom: 20 }}>
              <Descriptions.Item label="融资编号" span={2}>{detailFin.financingNo}</Descriptions.Item>
              <Descriptions.Item label="关联应收账款" span={2}>
                <Tag style={{ borderRadius: 4, border: '1px solid #e6dfd8', background: 'transparent', color: '#6c6a64', fontSize: 11 }}>{detailFin.receivableNo}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="关联订单" span={2}>
                <Tag style={{ borderRadius: 4, border: '1px solid #e6dfd8', background: 'transparent', color: '#6c6a64', fontSize: 11 }}>{detailFin.orderNo}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="融资额" span={2}>
                <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 18, fontWeight: 500, color: '#cc785c' }}>{detailFin.amount}万元</span>
              </Descriptions.Item>
              <Descriptions.Item label="年化利率">{detailFin.financingRate}%</Descriptions.Item>
              <Descriptions.Item label="金融机构">{detailFin.bank}</Descriptions.Item>
              <Descriptions.Item label="申请日期">{detailFin.applyDate}</Descriptions.Item>
              <Descriptions.Item label="审批日期">{detailFin.approveDate ?? '—'}</Descriptions.Item>
              <Descriptions.Item label="放款日期">{detailFin.financeDate ?? '—'}</Descriptions.Item>
              <Descriptions.Item label="应还款日">{detailFin.repayDate ?? '—'}</Descriptions.Item>
              <Descriptions.Item label="状态" span={2}>
                <Tag style={{ borderRadius: 9999, border: 'none', background: `${STATUS_COLORS[detailFin.status]}14`, color: STATUS_COLORS[detailFin.status], fontSize: 11 }}>
                  {FIN_STATUS_LABEL[detailFin.status]}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default ScfPage;
