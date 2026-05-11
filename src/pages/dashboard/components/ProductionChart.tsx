import React from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { productionData, CHART_COLORS } from './mockData';

/**
 * 生产服务一张图
 * 近12个月「计划种植面积」与「实际产出鲜条量」双轴趋势面积图
 * Claude Design — warm cream canvas, coral/teal palette
 */
const ProductionChart: React.FC = () => {
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
          const unit = i.seriesName.includes('面积') ? '亩' : '吨';
          return `<div style="display:flex;align-items:center;gap:6px;margin:3px 0">
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${i.color}"></span>
            <span style="color:#6c6a64">${i.seriesName}：</span>
            <span style="font-weight:500">${i.value.toLocaleString()} ${unit}</span>
          </div>`;
        }).join('');
        return `<div style="min-width:160px;padding:4px 0">
          <div style="font-size:12px;font-weight:500;margin-bottom:6px;color:#141413;border-bottom:1px solid #ebe6df;padding-bottom:4px">${p[0].name}</div>
          ${rows}
        </div>`;
      },
    },
    legend: {
      data: ['计划种植面积', '实际产出鲜条量'],
      bottom: 0,
      textStyle: { color: '#6c6a64', fontSize: 12, fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' },
      icon: 'circle',
      itemWidth: 8,
      itemHeight: 8,
    },
    grid: { top: 20, right: 60, bottom: 44, left: 56, containLabel: false },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: productionData.map(d => {
        const parts = d.month.split('-');
        return `${parts[1]}月`;
      }),
      axisLine: { lineStyle: { color: '#e6dfd8' } },
      axisLabel: { color: '#6c6a64', fontSize: 11, fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' },
      axisTick: { show: false },
    },
    yAxis: [
      {
        type: 'value',
        name: '面积（亩）',
        nameTextStyle: { color: '#6c6a64', fontSize: 11, fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' },
        splitLine: { lineStyle: { color: '#ebe6df' } },
        axisLabel: { color: '#6c6a64', fontSize: 11, fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      {
        type: 'value',
        name: '产量（吨）',
        nameTextStyle: { color: '#6c6a64', fontSize: 11, fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' },
        splitLine: { show: false },
        axisLabel: { color: '#6c6a64', fontSize: 11, fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' },
        axisLine: { show: false },
        axisTick: { show: false },
      },
    ],
    series: [
      {
        name: '计划种植面积',
        type: 'line',
        yAxisIndex: 0,
        smooth: 0.5,
        symbol: 'circle',
        symbolSize: 5,
        lineStyle: { width: 2, color: CHART_COLORS.primary },
        itemStyle: { color: CHART_COLORS.primary },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(204, 120, 92, 0.1)' },
              { offset: 1, color: 'rgba(204, 120, 92, 0)' },
            ],
          },
        },
        data: productionData.map(d => d.plannedArea),
      },
      {
        name: '实际产出鲜条量',
        type: 'line',
        yAxisIndex: 1,
        smooth: 0.5,
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
        data: productionData.map(d => d.actualOutput),
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 260 }} notMerge={true} />;
};

export default ProductionChart;
