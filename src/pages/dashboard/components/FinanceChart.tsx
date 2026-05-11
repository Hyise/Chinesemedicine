import React from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { financeData, CHART_COLORS } from './mockData';

/**
 * 金融服务一张图
 * 助农贷款发放总额（柱）与农业保险覆盖率（折线）双轴图
 * Claude Design — warm cream canvas, coral/teal palette
 */
const FinanceChart: React.FC = () => {
  const months = financeData.map(d => {
    const parts = d.month.split('-');
    return `${parts[1]}月`;
  });

  const option: EChartsOption = {
    color: [CHART_COLORS.primary, CHART_COLORS.teal],
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#ffffff',
      borderColor: '#e6dfd8',
      borderWidth: 1,
      textStyle: { color: '#141413', fontSize: 12, fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' },
      axisPointer: { type: 'cross', label: { backgroundColor: '#141413' } },
      formatter: (params: unknown) => {
        const p = params as {
          name: string;
          seriesName: string;
          value: number;
          color: string;
        }[];
        if (!p || p.length === 0) return '';
        const rows = p.map(i => {
          const val = i.seriesName.includes('贷款')
            ? `${i.value.toLocaleString()} 万元`
            : `${i.value}%`;
          return `<div style="display:flex;align-items:center;gap:6px;margin:3px 0">
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${i.color}"></span>
            <span style="color:#6c6a64">${i.seriesName}：</span>
            <span style="font-weight:500">${val}</span>
          </div>`;
        }).join('');
        return `<div style="min-width:180px;padding:4px 0">
          <div style="font-size:12px;font-weight:500;margin-bottom:6px;padding-bottom:4px;border-bottom:1px solid #ebe6df">${p[0].name}</div>
          ${rows}
        </div>`;
      },
    },
    legend: {
      data: ['助农贷款发放总额', '农业保险覆盖率'],
      bottom: 0,
      textStyle: { color: '#6c6a64', fontSize: 11, fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' },
      icon: 'circle',
      itemWidth: 8,
      itemHeight: 8,
    },
    grid: { top: 20, right: 56, bottom: 44, left: 56, containLabel: false },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: months,
      axisLine: { lineStyle: { color: '#e6dfd8' } },
      axisLabel: { color: '#6c6a64', fontSize: 11, fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' },
      axisTick: { show: false },
    },
    yAxis: [
      {
        type: 'value',
        name: '贷款（万元）',
        nameTextStyle: { color: '#6c6a64', fontSize: 11, fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' },
        splitLine: { lineStyle: { color: '#ebe6df' } },
        axisLabel: {
          color: '#6c6a64',
          fontSize: 11,
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
          formatter: (v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v),
        },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      {
        type: 'value',
        name: '保险覆盖率（%）',
        nameTextStyle: { color: '#6c6a64', fontSize: 11, fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' },
        min: 0,
        max: 100,
        splitLine: { show: false },
        axisLabel: { color: '#6c6a64', fontSize: 11, fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif', formatter: (v: number) => `${v}%` },
        axisLine: { show: false },
        axisTick: { show: false },
      },
    ],
    series: [
      {
        name: '助农贷款发放总额',
        type: 'bar',
        yAxisIndex: 0,
        barWidth: 12,
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#cc785c' },
              { offset: 1, color: 'rgba(204, 120, 92, 0.15)' },
            ],
          },
        },
        data: financeData.map(d => d.loanAmount),
      },
      {
        name: '农业保险覆盖率',
        type: 'line',
        yAxisIndex: 1,
        smooth: 0.4,
        symbol: 'circle',
        symbolSize: 5,
        lineStyle: { width: 2, color: CHART_COLORS.teal },
        itemStyle: { color: CHART_COLORS.teal },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(93, 184, 166, 0.1)' },
              { offset: 1, color: 'rgba(93, 184, 166, 0)' },
            ],
          },
        },
        data: financeData.map(d => d.insuranceCoverage),
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 260 }} notMerge={true} />;
};

export default FinanceChart;
