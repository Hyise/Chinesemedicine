import React from 'react';
import { Card, Row, Col, Table, Progress } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import ReactECharts from 'echarts-for-react';
import { CHART_COLORS } from '../../dashboard/components/mockData';
import type { SalesOrder, MonthlySales, HerbSales } from '@/types/global';

interface Props {
  monthlySales: MonthlySales[];
  herbSales: HerbSales[];
  orders: SalesOrder[];
}

// ============================================================
// 1. 月度销售趋势折线+柱状图
// ============================================================
const MonthlyTrendChart: React.FC<{ data: MonthlySales[] }> = ({ data }) => {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      formatter: (params: { name: string; value: number; seriesName: string }[]) => {
        let result = `<div style="font-weight:600;margin-bottom:4px">${params[0]?.name}</div>`;
        params.forEach((p) => {
          if (p.seriesName === '销售额（万元）') {
            result += `<div><span style="color:#94a3b8">销售额：</span><b>¥${p.value.toLocaleString()}</b></div>`;
          } else {
            result += `<div><span style="color:#94a3b8">订单数：</span><b>${p.value} 笔</b></div>`;
          }
        });
        return result;
      },
    },
    legend: { data: ['销售额（万元）', '订单数'], bottom: 0, textStyle: { fontSize: 11, color: '#64748b' } },
    grid: { left: 50, right: 20, top: 10, bottom: 40 },
    xAxis: {
      type: 'category',
      data: data.map((d) => d.month.slice(5) + '月'),
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisLabel: { fontSize: 10, color: '#64748b' },
      axisTick: { show: false },
    },
    yAxis: [
      {
        type: 'value', name: '万元', nameTextStyle: { fontSize: 10, color: '#94a3b8' },
        axisLine: { show: false }, axisTick: { show: false },
        splitLine: { lineStyle: { color: '#f1f5f9' } },
        axisLabel: { fontSize: 10, color: '#94a3b8' },
      },
      {
        type: 'value', name: '笔', nameTextStyle: { fontSize: 10, color: '#94a3b8' },
        axisLine: { show: false }, axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { fontSize: 10, color: '#94a3b8' },
      },
    ],
    series: [
      {
        name: '销售额（万元）', type: 'bar',
        data: data.map((d) => d.amount / 10000),
        itemStyle: { color: CHART_COLORS.primary, borderRadius: [4, 4, 0, 0] },
        barWidth: '50%',
      },
      {
        name: '订单数', type: 'line', yAxisIndex: 1,
        data: data.map((d) => d.orders),
        smooth: true, symbol: 'circle', symbolSize: 6,
        lineStyle: { color: CHART_COLORS.accent, width: 2 },
        itemStyle: { color: CHART_COLORS.accent },
        areaStyle: { color: 'rgba(245,158,11,0.08)' },
      },
    ],
  };
  return <ReactECharts option={option} style={{ height: 260 }} notMerge={false} />;
};

// ============================================================
// 2. 药材销售占比饼图
// ============================================================
const HerbPieChart: React.FC<{ data: HerbSales[] }> = ({ data }) => {
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: (p: { name: string; value: number; percent: number }) =>
        `<div><b>${p.name}</b></div><div>销售额：¥${p.value.toLocaleString()}</div><div>占比：${p.percent.toFixed(1)}%</div>`,
    },
    legend: { orient: 'vertical', right: 10, top: 'center', textStyle: { fontSize: 10, color: '#64748b' } },
    series: [
      {
        type: 'pie', radius: ['38%', '68%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
        label: { show: false },
        emphasis: {
          label: { show: true, fontSize: 12, fontWeight: 'bold', formatter: (p: { name: string; percent: number }) => `${p.name}\n${p.percent.toFixed(1)}%` },
        },
        data: data.map((d, i) => ({
          value: d.amount, name: d.name,
          itemStyle: { color: CHART_COLORS.gradient[i % CHART_COLORS.gradient.length] },
        })),
      },
    ],
  };
  return <ReactECharts option={option} style={{ height: 260 }} />;
};

// ============================================================
// 3. 客户贡献TOP10柱状图
// ============================================================
const CustomerRankChart: React.FC<{ orders: SalesOrder[] }> = ({ orders }) => {
  const topCustomers = React.useMemo(() => {
    const map = new Map<string, { name: string; amount: number }>();
    orders.forEach((o) => {
      if (o.paymentStatus === 'paid') {
        const existing = map.get(o.customerName);
        if (existing) existing.amount += o.totalAmount;
        else map.set(o.customerName, { name: o.customerName, amount: o.totalAmount });
      }
    });
    return Array.from(map.values()).sort((a, b) => b.amount - a.amount).slice(0, 8);
  }, [orders]);

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (p: { name: string; value: number }[]) =>
        `<b>${p[0].name}</b><br/>销售额：¥${p[0].value.toLocaleString()}`,
    },
    grid: { left: 120, right: 20, top: 10, bottom: 10 },
    xAxis: { type: 'value', axisLine: { show: false }, axisTick: { show: false }, splitLine: { lineStyle: { color: '#f1f5f9' } }, axisLabel: { fontSize: 9, color: '#94a3b8', formatter: (v: number) => `¥${(v / 10000).toFixed(0)}w` } },
    yAxis: { type: 'category', data: topCustomers.map((c) => c.name), axisLine: { show: false }, axisTick: { show: false }, axisLabel: { fontSize: 10, color: '#64748b' } },
    series: [{
      type: 'bar',
      data: topCustomers.map((c, i) => ({
        value: c.amount,
        itemStyle: {
          color: CHART_COLORS.gradient[i % CHART_COLORS.gradient.length],
          borderRadius: [0, 4, 4, 0],
        },
      })),
      barWidth: '60%',
    }],
  };
  return <ReactECharts option={option} style={{ height: 260 }} />;
};

// ============================================================
// 药材销售汇总表
// ============================================================
const herbTableColumns: ColumnsType<HerbSales> = [
  { title: '药材/规格', dataIndex: 'name', key: 'name' },
  { title: '销售数量', dataIndex: 'quantity', key: 'quantity', align: 'right', render: (v: number) => `${v.toLocaleString()} kg` },
  {
    title: '销售额', dataIndex: 'amount', key: 'amount', align: 'right',
    render: (v: number) => <span style={{ color: '#10b981', fontWeight: 600 }}>¥{v.toLocaleString()}</span>,
  },
  {
    title: '占比', dataIndex: 'proportion', key: 'proportion',
    render: (v: number) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Progress percent={v} size="small" showInfo={false} strokeColor={CHART_COLORS.primary} trailColor="#e2e8f0" style={{ flex: 1, minWidth: 80 }} />
        <span style={{ fontSize: 11, color: '#64748b' }}>{v.toFixed(1)}%</span>
      </div>
    ),
  },
];

// ============================================================
// 综合统计看板
// ============================================================
const OverviewStats: React.FC<{ monthlySales: MonthlySales[]; herbSales: HerbSales[]; orders: SalesOrder[] }> = ({ monthlySales, herbSales, orders }) => {
  const totalRevenue = herbSales.reduce((s, d) => s + d.amount, 0);
  const avgUnitPrice = herbSales.length > 0 ? Math.round(herbSales.reduce((s, d) => s + d.amount, 0) / herbSales.reduce((s, d) => s + d.quantity, 0)) : 0;
  const maxMonth = [...monthlySales].sort((a, b) => b.amount - a.amount)[0];
  const completionRate = Math.round((orders.filter((o) => o.status === 'completed').length / orders.length) * 100);

  return (
    <Row gutter={[12, 12]} style={{ marginBottom: 14 }}>
      <Col xs={12} sm={6}>
        <Card bordered={false} style={{ borderRadius: 8 }} styles={{ body: { padding: '12px 16px' } }}>
          <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>累计销售总额</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#10b981' }}>¥{(totalRevenue / 10000).toFixed(1)}万</div>
        </Card>
      </Col>
      <Col xs={12} sm={6}>
        <Card bordered={false} style={{ borderRadius: 8 }} styles={{ body: { padding: '12px 16px' } }}>
          <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>历史最高单月</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#6366f1' }}>{maxMonth?.month.slice(5)}月 ¥{(maxMonth?.amount ?? 0 / 10000).toFixed(1)}万</div>
        </Card>
      </Col>
      <Col xs={12} sm={6}>
        <Card bordered={false} style={{ borderRadius: 8 }} styles={{ body: { padding: '12px 16px' } }}>
          <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>加权平均单价</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#06b6d4' }}>¥{avgUnitPrice}/kg</div>
        </Card>
      </Col>
      <Col xs={12} sm={6}>
        <Card bordered={false} style={{ borderRadius: 8 }} styles={{ body: { padding: '12px 16px' } }}>
          <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>订单完成率</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#f59e0b' }}>{completionRate}%</div>
        </Card>
      </Col>
    </Row>
  );
};

// ============================================================
// 主组件
// ============================================================
const SalesChart: React.FC<Props> = ({ monthlySales, herbSales, orders }) => {
  return (
    <div>
      <OverviewStats monthlySales={monthlySales} herbSales={herbSales} orders={orders} />

      <Row gutter={[12, 12]}>
        {/* 月度趋势 */}
        <Col xs={24} xl={16}>
          <Card bordered={false} style={{ borderRadius: 8 }} headStyle={{ borderBottom: '1px solid #f1f5f9', fontSize: 13, fontWeight: 600 }} title={
            <span style={{ color: '#374151' }}>月度销售趋势</span>
          }>
            <MonthlyTrendChart data={monthlySales} />
          </Card>
        </Col>

        {/* 药材占比 */}
        <Col xs={24} xl={8}>
          <Card bordered={false} style={{ borderRadius: 8 }} headStyle={{ borderBottom: '1px solid #f1f5f9', fontSize: 13, fontWeight: 600 }} title={
            <span style={{ color: '#374151' }}>药材销售占比</span>
          }>
            <HerbPieChart data={herbSales} />
          </Card>
        </Col>

        {/* 客户贡献排名 */}
        <Col xs={24} xl={14}>
          <Card bordered={false} style={{ borderRadius: 8 }} headStyle={{ borderBottom: '1px solid #f1f5f9', fontSize: 13, fontWeight: 600 }} title={
            <span style={{ color: '#374151' }}>客户贡献TOP8</span>
          }>
            <CustomerRankChart orders={orders} />
          </Card>
        </Col>

        {/* 药材销售明细表 */}
        <Col xs={24} xl={10}>
          <Card bordered={false} style={{ borderRadius: 8 }} headStyle={{ borderBottom: '1px solid #f1f5f9', fontSize: 13, fontWeight: 600 }} title={
            <span style={{ color: '#374151' }}>药材销售明细</span>
          }>
            <Table columns={herbTableColumns} dataSource={herbSales} rowKey="name" pagination={false} size="small" />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SalesChart;
