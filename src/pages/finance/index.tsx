import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card } from 'antd';
import {
  DollarOutlined,
  SafetyOutlined,
  FileTextOutlined,
  WalletOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import {
  loanStats,
  insuranceStats,
  scfStats,
  escrowStats,
  CHART_COLORS,
} from './mockData';

interface ModuleCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  accentColor: string;
  stats: { label: string; value: string | number }[];
  badge?: string;
  badgeColor?: string;
  onClick: () => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  title, subtitle, icon, accentColor, stats, badge, badgeColor, onClick,
}) => (
  <Card
    hoverable
    onClick={onClick}
    style={{ borderRadius: 12, border: '1px solid #e6dfd8', cursor: 'pointer', overflow: 'hidden' }}
    styles={{ body: { padding: '24px' } }}
  >
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
      <div style={{
        width: 48, height: 48, borderRadius: 10,
        background: `${accentColor}14`, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        color: accentColor, fontSize: 20,
      }}>
        {icon}
      </div>
      {badge && (
        <span style={{
          fontSize: 11, fontWeight: 500, borderRadius: 9999,
          padding: '2px 10px', background: `${badgeColor ?? accentColor}14`,
          color: badgeColor ?? accentColor,
        }}>
          {badge}
        </span>
      )}
    </div>
    <div style={{ marginBottom: 6 }}>
      <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 16, fontWeight: 500, color: '#141413' }}>{title}</span>
    </div>
    <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: '#6c6a64', marginBottom: 16 }}>{subtitle}</div>
    <Row gutter={[12, 8]}>
      {stats.map((s, i) => (
        <Col span={12} key={i}>
          <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, color: '#8e8b82', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>
            {s.label}
          </div>
          <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 18, fontWeight: 500, color: '#141413' }}>
            {s.value}
          </div>
        </Col>
      ))}
    </Row>
    <div style={{
      marginTop: 16, paddingTop: 16, borderTop: '1px solid #ebe6df',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: '#6c6a64' }}>查看详情</span>
      <ArrowRightOutlined style={{ fontSize: 12, color: '#8e8b82', transition: 'transform 0.15s' }} />
    </div>
  </Card>
);

const TrendChart: React.FC = () => {
  const option: EChartsOption = {
    color: [CHART_COLORS.primary, CHART_COLORS.teal, CHART_COLORS.accent],
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#ffffff',
      borderColor: '#e6dfd8',
      borderWidth: 1,
      textStyle: { color: '#141413', fontSize: 11, fontFamily: '"Inter", sans-serif' },
    },
    legend: {
      data: ['贷款发放', '保险保费', '融资额'],
      bottom: 0,
      textStyle: { color: '#6c6a64', fontSize: 11, fontFamily: '"Inter", sans-serif' },
      icon: 'circle', itemWidth: 6, itemHeight: 6,
    },
    grid: { left: 40, right: 16, top: 8, bottom: 40 },
    xAxis: {
      type: 'category',
      data: loanStats.monthlyData.map(d => d.month.slice(5) + '月'),
      axisLine: { lineStyle: { color: '#e6dfd8' } },
      axisLabel: { color: '#6c6a64', fontSize: 10, fontFamily: '"Inter", sans-serif' },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#ebe6df' } },
      axisLabel: { color: '#8e8b82', fontSize: 10, fontFamily: '"Inter", sans-serif' },
    },
    series: [
      {
        name: '贷款发放', type: 'bar',
        data: loanStats.monthlyData.map(d => d.approved * 10),
        itemStyle: { color: CHART_COLORS.primary, borderRadius: [4, 4, 0, 0] },
        barWidth: '28%',
      },
      {
        name: '保险保费', type: 'bar',
        data: loanStats.monthlyData.map(d => d.approved * 3),
        itemStyle: { color: CHART_COLORS.teal, borderRadius: [4, 4, 0, 0] },
        barWidth: '28%',
      },
      {
        name: '融资额', type: 'line',
        data: loanStats.monthlyData.map(d => d.approved * 8),
        smooth: true, symbol: 'circle', symbolSize: 4,
        lineStyle: { color: CHART_COLORS.accent, width: 2 },
        itemStyle: { color: CHART_COLORS.accent },
      },
    ],
  };
  return <ReactECharts option={option} style={{ height: 200 }} notMerge />;
};

const FinancePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#faf9f5', minHeight: '100vh', padding: '48px 64px' }}>
      {/* Hero */}
      <div style={{ marginBottom: 40 }}>
        <div style={{
          fontFamily: '"Inter", sans-serif', fontSize: 11, fontWeight: 500,
          letterSpacing: '1.5px', textTransform: 'uppercase', color: '#cc785c',
          marginBottom: 10,
        }}>
          7S 产地仓
        </div>
        <h1 style={{
          fontFamily: '"Tiempos Headline", "Cormorant Garamond", Garamond, serif',
          fontSize: 36, fontWeight: 400, letterSpacing: '-0.5px',
          color: '#141413', margin: '0 0 8px', lineHeight: 1.1,
        }}>
          金融服务模块
        </h1>
        <p style={{
          fontFamily: '"Inter", sans-serif', fontSize: 15, color: '#6c6a64',
          margin: 0, lineHeight: 1.55,
        }}>
          为产业链各参与方提供助农贷款、农业保险、供应链金融、资金托管等一站式金融服务
        </p>
      </div>

      {/* Module Entry Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} xl={12}>
          <ModuleCard
            title="助农贷款服务"
            subtitle="为农户、合作社、加工企业提供种植、收购、加工等全链条信贷支持"
            icon={<DollarOutlined />}
            accentColor="#cc785c"
            stats={[
              { label: '累计放款', value: `${loanStats.totalApproved}万元` },
              { label: '待审批', value: `${loanStats.totalPending}万元` },
              { label: '还款中', value: `${loanStats.activeLoans}笔` },
              { label: '逾期', value: `${loanStats.overdueCount}笔` },
            ]}
            badge={`${loanStats.totalPending}万元待审批`}
            badgeColor="#d4a017"
            onClick={() => navigate('/finance/loans')}
          />
        </Col>
        <Col xs={24} xl={12}>
          <ModuleCard
            title="农业保险服务"
            subtitle="气象灾害险、质量保障险、综合收入险，护航石斛全生长周期"
            icon={<SafetyOutlined />}
            accentColor="#5db8a6"
            stats={[
              { label: '生效保单', value: `${insuranceStats.activePolicies}份` },
              { label: '参保面积', value: `${insuranceStats.totalInsuredArea}亩` },
              { label: '累计保费', value: `${(insuranceStats.totalPremium / 10000).toFixed(1)}万元` },
              { label: '待理赔', value: `${insuranceStats.pendingClaims}件` },
            ]}
            onClick={() => navigate('/finance/insurance')}
          />
        </Col>
        <Col xs={24} xl={12}>
          <ModuleCard
            title="供应链金融"
            subtitle="应收账款确权与融资，帮助供应商提前回款，加速资金周转"
            icon={<FileTextOutlined />}
            accentColor="#e8a55a"
            stats={[
              { label: '应收账款', value: `${scfStats.totalReceivables}万元` },
              { label: '已融资', value: `${scfStats.totalFinanced}万元` },
              { label: '待融资', value: `${scfStats.pendingCount}笔` },
              { label: '未结清', value: `${scfStats.outstandingAmount}万元` },
            ]}
            onClick={() => navigate('/finance/scf')}
          />
        </Col>
        <Col xs={24} xl={12}>
          <ModuleCard
            title="资金托管服务"
            subtitle="交易资金分阶段托管，验货后放款，保障买卖双方权益"
            icon={<WalletOutlined />}
            accentColor="#5db872"
            stats={[
              { label: '托管中', value: `${escrowStats.totalInEscrow}万元` },
              { label: '已释放', value: `${escrowStats.totalReleased}万元` },
              { label: '活跃托管', value: `${escrowStats.activeEscrow}笔` },
              { label: '验货中', value: `${escrowStats.pendingVerify}笔` },
            ]}
            onClick={() => navigate('/finance/escrow')}
          />
        </Col>
      </Row>

      {/* Trend Chart */}
      <Card
        title={<span style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, fontWeight: 500, color: '#141413' }}>
          金融服务月度趋势
        </span>}
        extra={<span style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: '#8e8b82' }}>近10个月</span>}
        style={{ borderRadius: 12, border: '1px solid #e6dfd8' }}
        styles={{ body: { padding: '16px 24px 8px' } }}
      >
        <TrendChart />
      </Card>
    </div>
  );
};

export default FinancePage;
