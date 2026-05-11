import React from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { marketRegionData, CHART_COLORS } from './mockData';

/**
 * 市场服务一张图
 * 大宗采购商地域分布 — 南丁格尔玫瑰图
 * Claude Design — warm cream canvas
 */
const MarketChart: React.FC = () => {
  const roseColors = [
    CHART_COLORS.primary,
    CHART_COLORS.teal,
    CHART_COLORS.accent,
    CHART_COLORS.secondary,
    CHART_COLORS.amber,
    '#8e8b82',
  ];

  const option: EChartsOption = {
    color: roseColors,
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: '#ffffff',
      borderColor: '#e6dfd8',
      borderWidth: 1,
      textStyle: { color: '#141413', fontSize: 12, fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' },
      formatter: (params: unknown) => {
        const p = params as {
          name: string;
          value: number;
          percent: number;
          color: string;
        };
        const regionData = marketRegionData.find(r => r.region === p.name);
        return `<div style="min-width:170px;padding:4px 0">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;padding-bottom:4px;border-bottom:1px solid #ebe6df">
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${p.color}"></span>
            <span style="font-weight:500">${p.name}</span>
          </div>
          <div style="display:flex;justify-content:space-between;gap:16px;margin:3px 0">
            <span style="color:#6c6a64">占比</span>
            <span style="font-weight:500">${p.percent.toFixed(1)}%</span>
          </div>
          <div style="display:flex;justify-content:space-between;gap:16px;margin:3px 0">
            <span style="color:#6c6a64">成交额</span>
            <span style="font-weight:500">${regionData?.amount ?? 0} 万元</span>
          </div>
          <div style="display:flex;justify-content:space-between;gap:16px;margin:3px 0">
            <span style="color:#6c6a64">采购商数</span>
            <span style="font-weight:500">${regionData?.buyerCount ?? 0} 家</span>
          </div>
        </div>`;
      },
    },
    legend: {
      orient: 'vertical',
      right: 8,
      top: 'middle',
      textStyle: { color: '#6c6a64', fontSize: 11, fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' },
      icon: 'circle',
      itemWidth: 6,
      itemHeight: 6,
      itemGap: 6,
    },
    series: [
      {
        name: '采购商地域分布',
        type: 'pie',
        radius: ['28%', '72%'],
        center: ['38%', '50%'],
        roseType: 'area',
        label: {
          show: true,
          color: '#6c6a64',
          fontSize: 11,
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
          formatter: (p: any) => `${p.percent?.toFixed(0) ?? 0}%`,
        },
        labelLine: { length: 4, length2: 6, lineStyle: { color: '#e6dfd8' } },
        itemStyle: { borderRadius: 4, borderColor: '#faf9f5', borderWidth: 2 },
        data: marketRegionData.map((r, i) => ({
          name: r.region,
          value: r.proportion,
          itemStyle: { color: roseColors[i % roseColors.length] },
        })),
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 280 }} notMerge={true} />;
};

export default MarketChart;
