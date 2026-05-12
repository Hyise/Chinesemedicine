import React, { useState } from 'react';
import { Card, Table, Button, Tag, Row, Col, Tabs, Drawer, Descriptions, Timeline, Progress } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  WalletOutlined, ClockCircleOutlined, CheckCircleOutlined,
  EyeOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import PageHeading from '../../components/PageHeading';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import {
  escrowAccounts, disbursementRecords, escrowStats, CHART_COLORS,
  type EscrowAccount, type DisbursementRecord, type EscrowStatus,
} from './mockData';

const ESCROW_STATUS_LABEL: Record<EscrowStatus, string> = {
  in_escrow: '定金托管中', verifying: '验货中', released: '已释放', refunded: '已退款', partial: '部分释放',
};

const ESCROW_COLORS: Record<EscrowStatus, string> = {
  in_escrow: '#cc785c', verifying: '#e8a55a', released: '#5db872', refunded: '#c64545', partial: '#5db8a6',
};

const STAGE_COLORS: Record<string, string> = {
  '定金': '#cc785c', '验货中': '#e8a55a', '尾款': '#5db8a6',
};

const EscrowChart: React.FC = () => {
  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
      backgroundColor: '#ffffff', borderColor: '#e6dfd8', borderWidth: 1,
      textStyle: { color: '#141413', fontSize: 11, fontFamily: '"Inter", sans-serif' },
      formatter: '{b}: {c}万元 ({d}%)',
    },
    series: [{
      type: 'pie', radius: ['50%', '76%'], center: ['50%', '50%'],
      data: [
        { name: '托管中', value: escrowStats.totalInEscrow, itemStyle: { color: CHART_COLORS.primary, borderRadius: 4, borderColor: '#faf9f5', borderWidth: 2 } },
        { name: '已释放', value: escrowStats.totalReleased, itemStyle: { color: CHART_COLORS.secondary, borderRadius: 4, borderColor: '#faf9f5', borderWidth: 2 } },
      ],
      label: { show: false },
      emphasis: { scale: true, scaleSize: 4 },
    }],
  };
  return <ReactECharts option={option} style={{ height: 120 }} notMerge />;
};

const FlowChart: React.FC = () => {
  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#ffffff', borderColor: '#e6dfd8', borderWidth: 1,
      textStyle: { color: '#141413', fontSize: 11, fontFamily: '"Inter", sans-serif' },
    },
    grid: { left: 40, right: 10, top: 8, bottom: 28 },
    xAxis: {
      type: 'category',
      data: ['3月', '4月', '5月', '6月', '7月'],
      axisLine: { lineStyle: { color: '#e6dfd8' } },
      axisLabel: { color: '#8e8b82', fontSize: 10, fontFamily: '"Inter", sans-serif' },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value', axisLine: { show: false }, axisTick: { show: false },
      splitLine: { lineStyle: { color: '#ebe6df' } },
      axisLabel: { color: '#8e8b82', fontSize: 10, fontFamily: '"Inter", sans-serif' },
    },
    series: [
      {
        name: '托管金额', type: 'bar',
        data: [15.6, 58.6, 36.2, 24.8, 82.0],
        itemStyle: { color: CHART_COLORS.primary, borderRadius: [4, 4, 0, 0] },
        barWidth: '40%',
      },
      {
        name: '释放金额', type: 'line', smooth: true, symbol: 'circle', symbolSize: 4,
        data: [15.6, 15.6, 15.6, 40.4, 40.4],
        lineStyle: { color: CHART_COLORS.secondary, width: 2 },
        itemStyle: { color: CHART_COLORS.secondary },
      },
    ],
  };
  return <ReactECharts option={option} style={{ height: 140 }} notMerge />;
};

const EscrowPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('accounts');
  const [detail, setDetail] = useState<EscrowAccount | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const escrowColumns: ColumnsType<EscrowAccount> = [
    {
      title: '托管编号', dataIndex: 'escrowNo', key: 'escrowNo', width: 140,
      render: (n) => <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: '#6c6a64' }}>{n}</span>,
    },
    {
      title: '关联订单', dataIndex: 'orderNo', key: 'orderNo', width: 140,
      render: (o) => <Tag style={{ borderRadius: 4, border: '1px solid #e6dfd8', background: 'transparent', color: '#6c6a64', fontSize: 11 }}>{o}</Tag>,
    },
    {
      title: '商品', dataIndex: 'productName', key: 'productName',
      render: (p) => <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: '#141413' }}>{p}</span>,
    },
    {
      title: '买方', dataIndex: 'buyer', key: 'buyer', width: 160,
      render: (b) => <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: '#6c6a64' }}>{b}</span>,
    },
    {
      title: '卖方', dataIndex: 'seller', key: 'seller', width: 160,
      render: (s) => <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: '#6c6a64' }}>{s}</span>,
    },
    {
      title: '托管总额', dataIndex: 'totalAmount', key: 'totalAmount', width: 100,
      render: (a) => <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 500, color: '#cc785c' }}>{a}万元</span>,
    },
    {
      title: '当前阶段', dataIndex: 'stage', key: 'stage', width: 90,
      render: (s) => (
        <Tag style={{ borderRadius: 9999, border: 'none', background: `${STAGE_COLORS[s] ?? '#8e8b82'}14`, color: STAGE_COLORS[s] ?? '#8e8b82', fontSize: 11 }}>
          {s}
        </Tag>
      ),
    },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 100,
      render: (s: EscrowStatus) => (
        <Tag style={{ borderRadius: 9999, border: 'none', background: `${ESCROW_COLORS[s]}14`, color: ESCROW_COLORS[s], fontSize: 11 }}>
          {ESCROW_STATUS_LABEL[s]}
        </Tag>
      ),
    },
    {
      title: '创建日期', dataIndex: 'createDate', key: 'createDate', width: 100,
      render: (d) => <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: '#6c6a64' }}>{d}</span>,
    },
    {
      title: '操作', key: 'action', width: 80,
      render: (_, r) => (
        <Button type="link" size="small" icon={<EyeOutlined />} style={{ color: '#cc785c', fontSize: 12, padding: '0 4px' }}
          onClick={() => { setDetail(r); setDrawerOpen(true); }}>
          详情
        </Button>
      ),
    },
  ];

  const disbursementColumns: ColumnsType<DisbursementRecord> = [
    {
      title: '托管编号', dataIndex: 'escrowNo', key: 'escrowNo', width: 140,
      render: (n) => <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: '#6c6a64' }}>{n}</span>,
    },
    {
      title: '关联订单', dataIndex: 'orderNo', key: 'orderNo', width: 140,
      render: (o) => <Tag style={{ borderRadius: 4, border: '1px solid #e6dfd8', background: 'transparent', color: '#6c6a64', fontSize: 11 }}>{o}</Tag>,
    },
    {
      title: '阶段', dataIndex: 'stage', key: 'stage', width: 80,
      render: (s) => (
        <Tag style={{ borderRadius: 9999, border: 'none', background: `${STAGE_COLORS[s] ?? '#8e8b82'}14`, color: STAGE_COLORS[s] ?? '#8e8b82', fontSize: 11 }}>
          {s}
        </Tag>
      ),
    },
    {
      title: '金额', dataIndex: 'amount', key: 'amount', width: 100,
      render: (a) => <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 500, color: '#cc785c' }}>{a}万元</span>,
    },
    {
      title: '付款方', dataIndex: 'payer', key: 'payer',
      render: (p) => <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: '#141413' }}>{p}</span>,
    },
    {
      title: '收款方', dataIndex: 'payee', key: 'payee',
      render: (p) => <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: '#6c6a64' }}>{p}</span>,
    },
    {
      title: '日期', dataIndex: 'date', key: 'date', width: 100,
      render: (d) => <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: '#6c6a64' }}>{d}</span>,
    },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 90,
      render: (s) => {
        const color = s === '已支付' ? '#5db872' : s === '待支付' ? '#cc785c' : '#c64545';
        return (
          <Tag style={{ borderRadius: 9999, border: 'none', background: `${color}14`, color, fontSize: 11 }}>
            {s}
          </Tag>
        );
      },
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

  const getStageProgress = (acc: EscrowAccount) => {
    if (acc.status === 'released') return 100;
    if (acc.status === 'verifying') return 60;
    if (acc.status === 'in_escrow') return 30;
    return 0;
  };

  return (
    <div style={{ background: '#faf9f5', minHeight: '100%' }}>
      <PageHeading
        eyebrow="金融服务"
        title="资金托管服务"
        description="定金托管 · 验货确认 · 尾款释放，全流程资金安全保障"
        accentColor="#5db872"
        gradientFrom="#1a3d2e"
        gradientMid="#1d523d"
        gradientTo="#2a6752"
        padding="32px 32px 28px"
      />

      <div style={{ maxWidth: 1360, margin: '0 auto', padding: '20px 32px 32px' }}>
        {/* KPI */}
        <Row gutter={[12, 12]} style={{ marginBottom: 24 }}>
        <Col xs={12} xl={6}><KpiCard title="托管中金额" value={`${escrowStats.totalInEscrow}万元`} icon={<WalletOutlined />} accentColor="#cc785c" /></Col>
        <Col xs={12} xl={6}><KpiCard title="已释放金额" value={`${escrowStats.totalReleased}万元`} icon={<CheckCircleOutlined />} accentColor="#5db872" /></Col>
        <Col xs={12} xl={6}><KpiCard title="活跃托管" value={`${escrowStats.activeEscrow}笔`} icon={<SwapOutlined />} accentColor="#e8a55a" /></Col>
        <Col xs={12} xl={6}><KpiCard title="验货中" value={`${escrowStats.pendingVerify}笔`} icon={<ClockCircleOutlined />} accentColor="#c64545" /></Col>
      </Row>

      {/* Charts */}
      <Row gutter={[12, 12]} style={{ marginBottom: 24 }}>
        <Col xs={24} xl={8}>
          <Card style={{ borderRadius: 12, border: '1px solid #e6dfd8', height: '100%' }} styles={{ body: { padding: '16px 20px' } }}>
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#8e8b82', marginBottom: 4 }}>资金状态分布</div>
            <EscrowChart />
            <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: CHART_COLORS.primary, display: 'inline-block' }} />
                <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: '#6c6a64' }}>托管中 {escrowStats.totalInEscrow}万</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: CHART_COLORS.secondary, display: 'inline-block' }} />
                <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: '#6c6a64' }}>已释放 {escrowStats.totalReleased}万</span>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} xl={16}>
          <Card style={{ borderRadius: 12, border: '1px solid #e6dfd8', height: '100%' }} styles={{ body: { padding: '16px 20px' } }}>
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#8e8b82', marginBottom: 4 }}>托管金额趋势（万元）</div>
            <FlowChart />
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
              { key: 'accounts', label: `托管账户 (${escrowAccounts.length})` },
              { key: 'disbursements', label: `放款记录 (${disbursementRecords.length})` },
            ]}
          />
        </div>
        {activeTab === 'accounts' ? (
          <Table columns={escrowColumns} dataSource={escrowAccounts} rowKey="id" pagination={{ pageSize: 8, showTotal: t => `共 ${t} 条` }} size="middle" />
        ) : (
          <Table columns={disbursementColumns} dataSource={disbursementRecords} rowKey="id" pagination={{ pageSize: 8, showTotal: t => `共 ${t} 条` }} size="middle" />
        )}
      </Card>

      {/* Detail Drawer */}
      <Drawer title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <WalletOutlined style={{ color: '#cc785c' }} />
          <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 15, fontWeight: 500, color: '#141413' }}>托管详情</span>
        </div>
      } placement="right" width={540} open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {detail && (
          <div>
            {/* Progress */}
            <div style={{ background: '#f5f0e8', borderRadius: 10, padding: '16px 20px', marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, fontWeight: 500, color: '#141413' }}>托管进度</span>
                <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: ESCROW_COLORS[detail.status] }}>{ESCROW_STATUS_LABEL[detail.status]}</span>
              </div>
              <Progress
                percent={getStageProgress(detail)}
                strokeColor={ESCROW_COLORS[detail.status]}
                trailColor="#e6dfd8"
                showInfo={false}
                size="small"
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                {['定金', '验货中', '尾款'].map((s, i) => (
                  <div key={s} style={{ textAlign: 'center' }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 4px',
                      background: getStageProgress(detail) >= [30, 60, 100][i] ? STAGE_COLORS[s] : '#e6dfd8',
                      color: getStageProgress(detail) >= [30, 60, 100][i] ? '#fff' : '#8e8b82',
                      fontSize: 10,
                    }}>
                      {i === 0 ? '1' : i === 1 ? '2' : '3'}
                    </div>
                    <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, color: '#8e8b82' }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <Descriptions column={2} bordered size="small" style={{ marginBottom: 20 }}>
              <Descriptions.Item label="托管编号" span={2}>{detail.escrowNo}</Descriptions.Item>
              <Descriptions.Item label="关联订单" span={2}>
                <Tag style={{ borderRadius: 4, border: '1px solid #e6dfd8', background: 'transparent', color: '#6c6a64', fontSize: 11 }}>{detail.orderNo}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="商品名称" span={2}>{detail.productName}</Descriptions.Item>
              <Descriptions.Item label="买方" span={2}>{detail.buyer}</Descriptions.Item>
              <Descriptions.Item label="卖方" span={2}>{detail.seller}</Descriptions.Item>
              <Descriptions.Item label="托管总额" span={2}>
                <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 18, fontWeight: 500, color: '#cc785c' }}>{detail.totalAmount}万元</span>
              </Descriptions.Item>
              <Descriptions.Item label="定金">{detail.depositAmount}万元</Descriptions.Item>
              <Descriptions.Item label="验货款">{detail.verifyAmount}万元</Descriptions.Item>
              <Descriptions.Item label="尾款">{detail.finalAmount}万元</Descriptions.Item>
              <Descriptions.Item label="创建日期">{detail.createDate}</Descriptions.Item>
              <Descriptions.Item label="当前阶段">
                <Tag style={{ borderRadius: 9999, border: 'none', background: `${STAGE_COLORS[detail.stage]}14`, color: STAGE_COLORS[detail.stage], fontSize: 11 }}>
                  {detail.stage}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <div style={{ background: '#f5f0e8', borderRadius: 10, padding: '16px 20px' }}>
              <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, fontWeight: 500, color: '#141413', marginBottom: 12 }}>资金流转记录</div>
              <Timeline items={[
                { color: '#cc785c', children: <div><div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, fontWeight: 500, color: '#141413' }}>定金托管</div><div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: '#6c6a64' }}>{detail.depositDate} · {detail.depositAmount}万元</div></div> },
                { color: detail.verifyDate ? '#e8a55a' : '#e6dfd8', children: <div><div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, fontWeight: 500, color: detail.verifyDate ? '#141413' : '#8e8b82' }}>验货确认{detail.verifyDate ? `（${detail.verifyDate}）` : '（待验货）'}</div><div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: '#6c6a64' }}>{detail.verifyDate ? `${detail.verifyAmount}万元` : '—'}</div></div> },
                { color: detail.releaseDate ? '#5db872' : '#e6dfd8', children: <div><div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, fontWeight: 500, color: detail.releaseDate ? '#141413' : '#8e8b82' }}>尾款释放{detail.releaseDate ? `（${detail.releaseDate}）` : '（待释放）'}</div><div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: '#6c6a64' }}>{detail.releaseDate ? `${detail.finalAmount}万元` : '—'}</div></div> },
              ]} />
            </div>
          </div>
        )}
      </Drawer>
    </div>
    </div>
  );
};

export default EscrowPage;
