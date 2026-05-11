import React from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { socialServiceData, CHART_COLORS } from './mockData';

/**
 * 社会化服务一张图
 * 月度农技指导、农机租赁、统防统治等社会化服务的堆叠柱状图
 * Claude Design — warm cream canvas
 */
const SocialServiceChart: React.FC = () => {
  const months = socialServiceData.map(d => {
    const parts = d.month.split('-');
    return `${parts[1]}月`;
  });

  const option: EChartsOption = {
    color: [CHART_COLORS.primary, CHART_COLORS.teal, CHART_COLORS.secondary],
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
          seriesName: string;
          value: number;
          color: string;
        }[];
        if (!p || p.length === 0) return '';
        const rows = p.map(i => {
          const unit = i.seriesName.includes('面积') ? '亩次' :
                       i.seriesName.includes('租赁') ? '台次' : '次';
          return `<div style="display:flex;align-items:center;gap:6px;margin:2px 0">
            <span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:${i.color}"></span>
            <span style="color:#6c6a64">${i.seriesName}：</span>
            <span style="font-weight:500">${i.value.toLocaleString()} ${unit}</span>
          </div>`;
        }).join('');
        return `<div style="min-width:200px;padding:4px 0">
          <div style="font-size:12px;font-weight:500;margin-bottom:6px;padding-bottom:4px;border-bottom:1px solid #ebe6df">${p[0].name}</div>
          ${rows}
        </div>`;
      },
    },
    legend: {
      data: ['农技指导（次）', '农机租赁（台次）', '统防统治（亩次）'],
      bottom: 0,
      textStyle: { color: '#6c6a64', fontSize: 11, fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' },
      icon: 'circle',
      itemWidth: 8,
      itemHeight: 8,
    },
    grid: { top: 16, right: 16, bottom: 44, left: 48, containLabel: false },
    xAxis: {
      type: 'category',
      data: months,
      axisLine: { lineStyle: { color: '#e6dfd8' } },
      axisLabel: { color: '#6c6a64', fontSize: 11, fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      name: '服务量',
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
    series: [
      {
        name: '农技指导（次）',
        type: 'bar',
        stack: 'total',
        barWidth: 16,
        itemStyle: { borderRadius: [2, 2, 0, 0] },
        data: socialServiceData.map(d => d.techGuide),
      },
      {
        name: '农机租赁（台次）',
        type: 'bar',
        stack: 'total',
        barWidth: 16,
        itemStyle: { borderRadius: [2, 2, 0, 0] },
        data: socialServiceData.map(d => d.machineryRent),
      },
      {
        name: '统防统治（亩次）',
        type: 'bar',
        stack: 'total',
        barWidth: 16,
        itemStyle: { borderRadius: [4, 4, 0, 0] },
        data: socialServiceData.map(d => d.unifiedControl),
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 260 }} notMerge={true} />;
};

export default SocialServiceChart;
