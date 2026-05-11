import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col } from 'antd';
import {
  TeamOutlined,
  ClusterOutlined,
  PayCircleOutlined,
  DatabaseOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import ResourceMap from './components/ResourceMap';
import { TOWN_DATA, RESOURCE_DATA } from './components/mapData';
import ProductionChart from './components/ProductionChart';
import QualityChart from './components/QualityChart';
import TradeChart from './components/TradeChart';
import MarketChart from './components/MarketChart';
import SocialServiceChart from './components/SocialServiceChart';
import FinanceChart from './components/FinanceChart';
import { kpiData } from './components/mockData';
import styles from './index.module.css';

const iconMap: Record<string, React.ReactNode> = {
  team: <TeamOutlined />,
  cluster: <ClusterOutlined />,
  money: <PayCircleOutlined />,
  database: <DatabaseOutlined />,
};

const CHART_TO_ROUTE: Record<string, string> = {
  '生产服务': '/app/planting/archives',
  '质量控制': '/app/quality-control',
  '交易中心': '/app/sales',
  '市场服务': '/app/social-service',
  '社会化服务': '/app/social-service',
  '金融服务': '/app/finance',
};

// KPI Card — Claude Design
const KpiCard: React.FC<typeof kpiData[0]> = ({ title, value, unit, icon, trend, trendUp, color }) => (
  <div className={styles.kpiCard}>
    <div className={styles.kpiIcon} style={{ background: `${color}14`, color }}>
      {iconMap[icon]}
    </div>
    <div className={styles.kpiBody}>
      <div className={styles.kpiLabel}>{title}</div>
      <div className={styles.kpiValue}>
        {typeof value === 'number' && value % 1 !== 0
          ? value.toLocaleString('zh-CN', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
          : value.toLocaleString()}
        <span className={styles.kpiUnit}>{unit}</span>
      </div>
      <div className={styles.kpiTrend} style={{ color: trendUp ? '#5db872' : '#c64545' }}>
        {trendUp
          ? <ArrowUpOutlined style={{ fontSize: 10 }} />
          : <ArrowDownOutlined style={{ fontSize: 10 }} />
        }
        <span>{trend > 0 ? '+' : ''}{trend}%</span>
        <span className={styles.kpiTrendLabel}>较上月</span>
      </div>
    </div>
  </div>
);

// Chart Card
interface ChartCardProps {
  title: string;
  tag?: string;
  tagColor?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, tag, tagColor = '#cc785c', children, onClick }) => (
  <div
    className={styles.chartCard}
    onClick={onClick}
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
    onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
  >
    <div className={styles.chartCardHeader}>
      <div className={styles.chartCardTitleRow}>
        <div className={styles.chartCardDot} style={{ background: tagColor }} />
        <span className={styles.chartCardTitle}>{title}</span>
        {tag && (
          <span className={styles.chartCardTag} style={{ color: tagColor, background: `${tagColor}12` }}>
            {tag}
          </span>
        )}
      </div>
      {onClick && (
        <span className={styles.chartCardArrow}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5.25 3.5L9.625 7L5.25 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      )}
    </div>
    <div className={styles.chartCardBody}>{children}</div>
  </div>
);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleChartClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className={styles.page}>
      {/* ── Hero Header ── */}
      <section className={styles.hero}>
        <div className={styles.heroEyebrow}>7S 产地仓</div>
        <h1 className={styles.heroTitle}>产业大脑数据平台</h1>
        <p className={styles.heroSubtitle}>贵州省赤水市 · 中药材全产业链数字化管理</p>
      </section>

      {/* ── KPI Core Metrics ── */}
      <section className={styles.kpiSection}>
        <Row gutter={[16, 16]}>
          {kpiData.map((kpi) => (
            <Col xs={24} sm={12} xl={6} key={kpi.title}>
              <KpiCard {...kpi} />
            </Col>
          ))}
        </Row>
      </section>

      {/* ── Charts Grid ── */}
      <section className={styles.chartsSection}>
        <div className={styles.chartsGrid}>
          {/* Left — 2 stacked cards */}
          <div className={styles.chartCol}>
            <ChartCard
              title="生产服务"
              tag="一张图"
              tagColor="#cc785c"
              onClick={() => handleChartClick(CHART_TO_ROUTE['生产服务'])}
            >
              <ProductionChart />
            </ChartCard>
            <ChartCard
              title="质量控制"
              tag="一张图"
              tagColor="#5db8a6"
              onClick={() => handleChartClick(CHART_TO_ROUTE['质量控制'])}
            >
              <QualityChart />
            </ChartCard>
          </div>

          {/* Center — Resource Map (spans 2 rows) */}
          <div className={styles.chartColMap}>
            <ChartCard title="产业资源" tag="一张图" tagColor="#e8a55a">
              <ResourceMap towns={TOWN_DATA} resources={RESOURCE_DATA} />
            </ChartCard>
          </div>

          {/* Right — 2 stacked cards */}
          <div className={styles.chartCol}>
            <ChartCard
              title="交易中心"
              tag="一张图"
              tagColor="#c64545"
              onClick={() => handleChartClick(CHART_TO_ROUTE['交易中心'])}
            >
              <TradeChart />
            </ChartCard>
            <ChartCard
              title="市场服务"
              tag="一张图"
              tagColor="#5db8a6"
              onClick={() => handleChartClick(CHART_TO_ROUTE['市场服务'])}
            >
              <MarketChart />
            </ChartCard>
          </div>

          {/* Bottom — 2 columns */}
          <div className={styles.chartCol}>
            <ChartCard
              title="社会化服务"
              tag="一张图"
              tagColor="#5db872"
              onClick={() => handleChartClick(CHART_TO_ROUTE['社会化服务'])}
            >
              <SocialServiceChart />
            </ChartCard>
          </div>

          <div className={styles.chartCol}>
            <ChartCard
              title="金融服务"
              tag="一张图"
              tagColor="#cc785c"
              onClick={() => handleChartClick(CHART_TO_ROUTE['金融服务'])}
            >
              <FinanceChart />
            </ChartCard>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <span>数据更新时间：{new Date().toLocaleString('zh-CN')}</span>
          <span>贵州省赤水市 · 7S 中药材产业大脑</span>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
