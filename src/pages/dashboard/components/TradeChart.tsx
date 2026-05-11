import React from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { tradeData, CHART_COLORS } from './mockData';

/**
 * 交易中心一张图
 * 当前交易最活跃的单品排行横向渐变柱状图
 * Claude Design — coral gradient bars
 */
const TradeChart: React.FC = () => {
  const sortedData = [...tradeData].sort((a, b) => b.volume - a.volume);

  const option: EChartsOption = {
    color: [CHART_COLORS.primary],
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: '#ffffff',
      borderColor: '#e6dfd8',
      borderWidth: 1,
      textStyle: { color: '#141413', fontSize: 12, fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' },
      formatter: (params: unknown) => {
        const p = params as {
          name: string;
          value: number;
          color: string;
          seriesIndex: number;
        }[];
        if (!p || p.length === 0) return '';
        const data = sortedData.find(d => d.product === p[0].name);
        return `<div style="min-width:180px;padding:4px 0">
          <div style="font-weight:500;margin-bottom:6px;padding-bottom:4px;border-bottom:1px solid #ebe6df">${p[0].name}</div>
          <div style="display:flex;gap:8px;align-items:center;margin:3px 0">
            <span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:${CHART_COLORS.primary}"></span>
            <span style="color:#6c6a64">成交量：</span>
            <span style="font-weight:500">${data?.volume.toLocaleString() ?? p[0].value} 吨</span>
          </div>
          <div style="display:flex;gap:8px;align-items:center;margin:3px 0">
            <span style="color:#6c6a64">成交额：</span>
            <span style="font-weight:500">${data?.amount.toLocaleString() ?? '-'} 万元</span>
          </div>
          ${data ? `<div style="margin:3px 0">
            <span style="color:#6c6a64">环比涨跌：</span>
            <span style="font-weight:500;color:${data.trendUp ? CHART_COLORS.green : CHART_COLORS.red}">
              ${data.trendUp ? '+' : ''}${data.trend}%
            </span>
          </div>` : ''}
        </div>`;
      },
    },
    grid: { top: 12, right: 90, bottom: 12, left: 4, containLabel: true },
    xAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#ebe6df' } },
      axisLabel: { color: '#6c6a64', fontSize: 11, fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'category',
      data: sortedData.map(d => d.product),
      inverse: true,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#6c6a64',
        fontSize: 11,
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
        interval: 0,
      },
    },
    series: [
      {
        name: '成交量',
        type: 'bar',
        barWidth: 12,
        label: {
          show: true,
          position: 'right',
          color: '#8e8b82',
          fontSize: 11,
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
          formatter: (p: any) => `${p.value}t`,
        },
        itemStyle: {
          borderRadius: [0, 4, 4, 0],
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [
              { offset: 0, color: '#cc785c' },
              { offset: 1, color: '#e8a55a' },
            ],
          },
        },
        data: sortedData.map(d => d.volume),
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 280 }} notMerge={true} />;
};

export default TradeChart;
