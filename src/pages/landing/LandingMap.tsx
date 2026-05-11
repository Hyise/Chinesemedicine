import React, { useState, useRef, useEffect } from 'react';
import * as echarts from 'echarts/core';
import { MapChart, ScatterChart } from 'echarts/charts';
import { TooltipComponent, VisualMapComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { TownData, ResourceItem } from '../dashboard/components/mapData';

echarts.use([MapChart, ScatterChart, TooltipComponent, VisualMapComponent, CanvasRenderer]);

// 17 vivid bright colors
const FILLS = [
  '#5db8a6', '#cc785c', '#5db872', '#e8a55a', '#9070b8',
  '#8e8b82', '#5db8a6', '#cc785c', '#5db872', '#e8a55a',
  '#5db8a6', '#cc785c', '#c64545', '#5db872', '#e8a55a',
  '#9070b8', '#5db8a6',
];

// GeoJSON town name → mapData index
const TOWN_MAP: Record<string, number> = {
  '丙安镇': 0, '两河口镇': 1, '元厚镇': 2, '复兴镇': 3, '大同镇': 4,
  '天台镇': 5, '长沙镇': 6, '长期镇': 7, '官渡镇': 8, '旺隆镇': 9,
  '葫市镇': 10, '金沙镇': 11, '白云乡': 12, '石堡乡': 13, '宝源乡': 14,
  '后巢乡': 15, '文华街道': 16,
};

const hexRgba = (hex: string, a: number) => {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${a})`;
};

interface LandingMapProps {
  towns: TownData[];
  resources: ResourceItem[];
}

const LandingMap: React.FC<LandingMapProps> = ({ towns, resources }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<string|null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/chishui-towns.json')
      .then(r => r.json())
      .then(ct => {
        if (cancelled) return;
        echarts.registerMap('chishui_towns', ct as any);
        setReady(true);
      }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!chartRef.current || !ready) return;

    const chart = echarts.init(chartRef.current);

    const option = {
      backgroundColor: '#1a2235',

      tooltip: {
        trigger: 'item',
        backgroundColor: '#0d1525',
        borderColor: '#3a4d72',
        borderWidth: 1.5,
        padding: [12, 16],
        textStyle: { color: '#e8e4df', fontSize: 13, fontFamily: '"PingFang SC","Microsoft YaHei",serif' },
        formatter(p: any) {
          if (p.componentType === 'series' && p.seriesType === 'map') {
            const geoName = p.name;
            const idx = TOWN_MAP[geoName] ?? -1;
            const town = idx >= 0 ? towns[idx] : null;
            const color = FILLS[Math.abs(geoName.split('').reduce((a: number, c: string) => a + c.charCodeAt(0), 0)) % FILLS.length];
            if (!town) {
              return `<div style="font-family:'PingFang SC','Microsoft YaHei',serif;">
                <div style="font-size:14px;font-weight:700;color:#e8e4df;padding-bottom:8px;margin-bottom:8px;border-bottom:1px solid #3a4d72;">${geoName}</div>
                <div style="font-size:12px;color:rgba(232,228,223,0.5);">暂无详细数据</div>
              </div>`;
            }
            return `<div style="font-family:'PingFang SC','Microsoft YaHei',serif;min-width:200px;">
              <div style="display:flex;align-items:center;gap:10px;padding-bottom:10px;margin-bottom:10px;border-bottom:1px solid #3a4d72;">
                <span style="width:12px;height:12px;border-radius:3px;background:${color};flex-shrink:0;"></span>
                <span style="font-size:15px;font-weight:700;color:#e8e4df;">${geoName}</span>
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                <div style="background:rgba(255,255,255,0.05);border:1px solid #3a4d72;border-radius:10px;padding:10px 8px;text-align:center;">
                  <div style="font-size:10px;color:rgba(232,228,223,0.4);margin-bottom:4px;">种植面积</div>
                  <div style="font-size:18px;font-weight:700;color:${color};">${town.area.toLocaleString()}亩</div>
                </div>
                <div style="background:rgba(255,255,255,0.05);border:1px solid #3a4d72;border-radius:10px;padding:10px 8px;text-align:center;">
                  <div style="font-size:10px;color:rgba(232,228,223,0.4);margin-bottom:4px;">种植户</div>
                  <div style="font-size:18px;font-weight:700;color:${color};">${town.farmers.toLocaleString()}户</div>
                </div>
                <div style="background:rgba(255,255,255,0.05);border:1px solid #3a4d72;border-radius:10px;padding:10px 8px;text-align:center;">
                  <div style="font-size:10px;color:rgba(232,228,223,0.4);margin-bottom:4px;">年产量</div>
                  <div style="font-size:18px;font-weight:700;color:${color};">${town.production.toLocaleString()}吨</div>
                </div>
                <div style="background:rgba(255,255,255,0.05);border:1px solid #3a4d72;border-radius:10px;padding:10px 8px;text-align:center;">
                  <div style="font-size:10px;color:rgba(232,228,223,0.4);margin-bottom:4px;">设施数</div>
                  <div style="font-size:18px;font-weight:700;color:${color};">${town.bases+town.factories+town.warehouses}个</div>
                </div>
              </div>
              <div style="margin-top:10px;font-size:11px;color:rgba(232,228,223,0.7);background:rgba(255,255,255,0.05);border:1px solid #3a4d72;border-radius:8px;padding:8px 10px;line-height:1.7;">
                ${town.highlight}
              </div>
            </div>`;
          }
          if (p.seriesType === 'scatter' && p.data?._r) {
            const res = p.data._r as ResourceItem;
            const cols: Record<string,string> = { base:'#5db872', factory:'#cc785c', warehouse:'#5db8a6' };
            const labs: Record<string,string> = { base:'种植基地', factory:'加工厂', warehouse:'产地仓' };
            const units: Record<string,string> = { base:'亩', factory:'吨/日', warehouse:'吨' };
            return `<div style="font-family:'PingFang SC','Microsoft YaHei',serif;">
              <div style="font-size:13px;font-weight:700;margin-bottom:6px;padding-bottom:6px;border-bottom:1px solid #3a4d72;color:#e8e4df;">${res.name}</div>
              <div style="font-size:12px;line-height:1.9;color:rgba(232,228,223,0.4);">
                <div>所属：<span style="font-weight:600;color:rgba(232,228,223,0.7);">${res.town}</span></div>
                <div>类型：<span style="font-weight:600;color:${cols[res.type]};">${labs[res.type]}</span></div>
                <div>规模：<span style="font-weight:600;color:rgba(232,228,223,0.7);">${res.value.toLocaleString()} ${units[res.type]}</span></div>
              </div>
            </div>`;
          }
          return '';
        },
      },

      series: [
        {
          type: 'map',
          map: 'chishui_towns',
          roam: false,
          itemStyle: {
          areaColor: '#5db8a6',
            borderColor: (params: any) => {
              const hash = Math.abs(params.name.split('').reduce((a: number, c: string) => a + c.charCodeAt(0), 0));
              return FILLS[hash % FILLS.length];
            },
            borderWidth: 1.5,
            shadowBlur: 8,
            shadowColor: 'rgba(0,0,0,0.3)',
          },
          emphasis: {
            itemStyle: {
              areaColor: (params: any) => {
                const hash = Math.abs(params.name.split('').reduce((a: number, c: string) => a + c.charCodeAt(0), 0));
                return hexRgba(FILLS[hash % FILLS.length], 0.85);
              },
              borderColor: (params: any) => {
                const hash = Math.abs(params.name.split('').reduce((a: number, c: string) => a + c.charCodeAt(0), 0));
                return FILLS[hash % FILLS.length];
              },
              borderWidth: 2.5,
              shadowBlur: 12,
            },
            label: { show: false },
          },
        },
        ...([
          { type: 'base', data: resources.filter(r => r.type === 'base').map(r => ({ name: r.name, value: [r.lng, r.lat, r.value], _r: r })) },
          { type: 'factory', data: resources.filter(r => r.type === 'factory').map(r => ({ name: r.name, value: [r.lng, r.lat, r.value], _r: r })) },
          { type: 'warehouse', data: resources.filter(r => r.type === 'warehouse').map(r => ({ name: r.name, value: [r.lng, r.lat, r.value], _r: r })) },
        ] as { type: 'base'|'factory'|'warehouse'; data: any[] }[]).map(({ type, data }) => ({
          type: 'scatter' as const,
          coordinateSystem: 'geo',
          map: 'chishui_towns',
          zlevel: 10,
          symbol: 'circle',
          symbolSize: (val: any) => Math.sqrt(val[2] as number) / 9 + 12,
          itemStyle: {
            color: type === 'base' ? '#5db872' : type === 'factory' ? '#cc785c' : '#5db8a6',
            borderColor: '#1a2235',
            borderWidth: 2.5,
            shadowBlur: 8,
            shadowColor: 'rgba(93,184,166,0.4)',
          },
          emphasis: {
            scale: true,
            scaleSize: 14,
            itemStyle: { borderWidth: 3, shadowBlur: 16 },
          },
          data,
        })),
      ],
    };

    chart.setOption(option as any, true);

    chart.on('mouseover', (params: any) => {
      if (params.componentType === 'series' && params.seriesType === 'map') {
        (chart.getZr() as any)?.setCursorStyle('pointer');
      }
    });
    chart.on('mouseout', () => {});
    chart.on('click', (params: any) => {
      if (params.componentType === 'series' && params.seriesType === 'map') {
        setSelected(prev => prev === params.name ? null : params.name);
      }
    });

    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(chartRef.current!);
    return () => { ro.disconnect(); chart.dispose(); };
  }, [ready, towns, resources]);

  const sel = selected ? towns[TOWN_MAP[selected] ?? -1] : null;

  return (
    <div style={{ position: 'relative', width: '100%', height: '380px', flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div ref={chartRef} style={{ width: '100%', height: '100%' }} />

      {/* Selected town panel */}
      {sel && (
        <div
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'rgba(13,21,37,0.92)',
            backdropFilter: 'blur(12px)',
            borderTop: '2px solid #5db8a6',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            animation: 'slideUp 0.25s ease',
            fontFamily: '"PingFang SC","Microsoft YaHei",serif',
          }}
        >
          <style>{`@keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: '#5db8a6', flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#e8e4df', marginBottom: 2 }}>{selected}</div>
            <div style={{ fontSize: 11, color: 'rgba(232,228,223,0.4)', lineHeight: 1.5 }}>{sel.highlight}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0 12px', flexShrink: 0 }}>
            {([
              { l:'面积', v:`${sel.area.toLocaleString()}亩` },
              { l:'农户', v:`${sel.farmers.toLocaleString()}户` },
              { l:'产量', v:`${sel.production.toLocaleString()}吨` },
              { l:'设施', v:`${sel.bases+sel.factories+sel.warehouses}个` },
            ] as const).map(s => (
              <div key={s.l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 9, color: 'rgba(232,228,223,0.4)', marginBottom: 2 }}>{s.l}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#5db8a6' }}>{s.v}</div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setSelected(null)}
            style={{
              background: 'rgba(93,184,166,0.1)', border: '1px solid rgba(93,184,166,0.3)',
              borderRadius: 6, color: 'rgba(232,228,223,0.7)', cursor: 'pointer',
              padding: '4px 10px', fontSize: 11, flexShrink: 0, transition: 'all 0.2s',
              fontFamily: '"PingFang SC","Microsoft YaHei",serif',
            }}
            onMouseEnter={e => { (e.target as HTMLElement).style.color = '#5db8a6'; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.color = 'rgba(232,228,223,0.7)'; }}
          >
            关闭
          </button>
        </div>
      )}

      {/* Legend */}
      <div style={{
        position: 'absolute', top: 10, right: 10,
        background: 'rgba(13,21,37,0.88)', backdropFilter: 'blur(8px)',
        border: '1px solid #3a4d72', borderRadius: 10,
        padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 6,
        fontSize: 11,
        fontFamily: '"PingFang SC","Microsoft YaHei",serif',
      }}>
        {([
          { l:'种植基地', c: '#5db872' },
          { l:'加工厂',   c: '#cc785c' },
          { l:'产地仓',   c: '#5db8a6' },
        ] as const).map(item => (
          <div key={item.l} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: item.c, flexShrink: 0 }} />
            <span style={{ color: 'rgba(232,228,223,0.7)', fontWeight: 500 }}>{item.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingMap;
