import React from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { qualityData, radarIndicators, CHART_COLORS } from './mockData';

/**
 * 质量控制一张图
 * 多批次在石斛碱、水分、重金属、农残等指标上的综合达标率雷达图
 * Claude Design — warm cream canvas
 */
const QualityChart: React.FC = () => {
  const colors = [
    CHART_COLORS.primary,
    CHART_COLORS.teal,
    CHART_COLORS.accent,
    CHART_COLORS.secondary,
  ];

  const option: EChartsOption = {
    color: colors,
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: '#ffffff',
      borderColor: '#e6dfd8',
      borderWidth: 1,
      textStyle: { color: '#141413', fontSize: 12, fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' },
      formatter: (params: unknown) => {
        const p = params as {
          seriesName: string;
          value: number[];
          color: string;
        };
        const indicatorNames = radarIndicators.map(ind => ind.name);
        const rows = p.value.map((v, i) =>
          `<div style="display:flex;justify-content:space-between;gap:16px;margin:2px 0">
            <span style="color:#6c6a64">${indicatorNames[i] ?? ''}</span>
            <span style="font-weight:500">${v}%</span>
          </div>`
        ).join('');
        return `<div style="min-width:180px;padding:4px 0">
          <div style="font-weight:500;margin-bottom:6px;padding-bottom:4px;border-bottom:1px solid #ebe6df">${p.seriesName}</div>
          ${rows}
        </div>`;
      },
    },
    legend: {
      data: qualityData.map(b => b.batchName),
      bottom: 0,
      textStyle: { color: '#6c6a64', fontSize: 11, fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' },
      icon: 'circle',
      itemWidth: 6,
      itemHeight: 6,
    },
    radar: {
      indicator: radarIndicators.map(ind => ({
        name: ind.name,
        max: ind.max,
      })),
      shape: 'polygon',
      splitNumber: 4,
      axisName: { color: '#6c6a64', fontSize: 11, fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' },
      splitLine: { lineStyle: { color: '#ebe6df' } },
      splitArea: { areaStyle: { color: ['rgba(250,249,245,0.01)', 'rgba(235,230,223,0.05)'] } },
      axisLine: { lineStyle: { color: '#e6dfd8' } },
      center: ['50%', '50%'],
      radius: '68%',
    },
    series: [
      {
        type: 'radar',
        data: qualityData.map((batch, i) => ({
          value: [
            batch.dendrobine,
            batch.moisture,
            batch.heavyMetalPb,
            batch.heavyMetalCd,
            batch.pesticide,
          ],
          name: batch.batchName,
          lineStyle: { width: 2, color: colors[i] },
          areaStyle: { color: colors[i], opacity: 0.1 },
          itemStyle: { color: colors[i] },
          symbol: 'circle',
          symbolSize: 4,
        })),
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 280 }} notMerge={true} />;
};

export default QualityChart;
