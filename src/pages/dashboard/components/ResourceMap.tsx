import React, { useState, useRef, useEffect } from 'react';
import * as echarts from 'echarts/core';
import { MapChart, ScatterChart } from 'echarts/charts';
import {
  TooltipComponent,
  GeoComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { TownData, ResourceItem } from './mapData';

echarts.use([
  MapChart, ScatterChart, TooltipComponent, GeoComponent, CanvasRenderer,
]);

// ─── Warm Earthy Palette (Original) ─────────────────────────────
const T = {
  bg:         '#f5f0e8',
  card:       '#faf7f2',
  hairline:   '#ddd5c8',
  hairline2:  '#c8bfb0',
  ink:        '#2a2318',
  body:       '#4a4035',
  muted:      '#8a7e72',
  mutedLight: '#b5a99d',

  // Town fill colors — 17 earthy tones
  fills: [
    '#c87860', // terracotta
    '#a87858', // copper
    '#d0a060', // golden sand
    '#6e9a62', // sage
    '#5a8a9a', // slate teal
    '#9070b8', // heather
    '#9a7858', // warm brown
    '#6890a8', // steel
    '#d07868', // coral
    '#c8a060', // amber
    '#5a9870', // forest
    '#8870a8', // plum
    '#907860', // khaki
    '#b87870', // dusty rose
    '#607080', // slate
    '#a09060', // olive
    '#78a0b0', // sky blue
  ],

  // Resource dot colors
  baseColor:     '#5db872',
  factoryColor:  '#cc785c',
  warehouseColor:'#5db8a6',
};

// ─── Helpers ───────────────────────────────────────────────
const hexRgba = (hex: string, a: number) => {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${a})`;
};

// ─── Component ─────────────────────────────────────────────
const ResourceMap: React.FC<{ towns: TownData[]; resources: ResourceItem[] }>
= ({ towns, resources }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [loadState, setLoadState] = useState<'loading'|'ready'>('loading');
  const [hoveredTown, setHoveredTown] = useState<string|null>(null);
  const [selectedTown, setSelectedTown] = useState<string|null>(null);

  const townColorMap = new Map(towns.map((t,i) => [t.name, T.fills[i % T.fills.length]]));
  const townMap = new Map(towns.map(t => [t.name, t]));

  const total = {
    area:      towns.reduce((s,t) => s+t.area,0),
    farmers:   towns.reduce((s,t) => s+t.farmers,0),
    production:towns.reduce((s,t) => s+t.production,0),
    bases:     towns.reduce((s,t) => s+t.bases,0),
    factories: towns.reduce((s,t) => s+t.factories,0),
    warehouses:towns.reduce((s,t) => s+t.warehouses,0),
  };

  // Load GeoJSON
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch('/china.json').then(r=>r.json()),
      fetch('/chishui-towns.json').then(r=>r.json()),
    ]).then(([china, chishuiTowns]) => {
      if (cancelled) return;
      echarts.registerMap('china', china);
      echarts.registerMap('chishui_towns', chishuiTowns as any);
      setLoadState('ready');
    }).catch(()=>{});
    return ()=>{ cancelled=true; };
  }, []);

  // Build chart
  useEffect(() => {
    if (!chartRef.current || loadState !== 'ready') return;

    const chart = echarts.init(chartRef.current);
    chartInstance.current = chart;

    // Town colors as series data (for map itemStyle)
    const townData = towns.map((t,i) => ({
      name: t.name,
      value: i,
      itemStyle: { color: T.fills[i % T.fills.length] },
    }));

    const scatterData = resources.map(r => ({
      name: r.name,
      value: [r.lng, r.lat, r.value],
      _r: r,
    }));

    const option = {
      backgroundColor: 'transparent',

      tooltip: {
        trigger: 'item',
        backgroundColor: T.card,
        borderColor: T.hairline,
        borderWidth: 1.5,
        padding: [12,16],
        textStyle: { color: T.ink, fontSize: 13, fontFamily: '"PingFang SC","Microsoft YaHei",serif' },
        formatter(p: any) {
          // Town polygon
          if (p.componentType === 'series' && p.seriesType === 'map') {
            const town = townMap.get(p.name);
            if (!town) return '';
            const color = townColorMap.get(p.name) || T.fills[0];
            return `<div style="font-family:'PingFang SC','Microsoft YaHei',serif;min-width:180px;">
              <div style="display:flex;align-items:center;gap:10px;padding-bottom:10px;margin-bottom:10px;border-bottom:1.5px solid ${T.hairline};">
                <span style="width:12px;height:12px;border-radius:3px;background:${color};flex-shrink:0;"></span>
                <span style="font-size:15px;font-weight:700;">${p.name}</span>
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                <div style="background:${hexRgba(color,0.08)};border:1px solid ${T.hairline};border-radius:10px;padding:10px 8px;text-align:center;">
                  <div style="font-size:10px;color:${T.muted};margin-bottom:4px;">种植面积</div>
                  <div style="font-size:18px;font-weight:700;color:${color};">${town.area.toLocaleString()}亩</div>
                </div>
                <div style="background:${hexRgba(color,0.08)};border:1px solid ${T.hairline};border-radius:10px;padding:10px 8px;text-align:center;">
                  <div style="font-size:10px;color:${T.muted};margin-bottom:4px;">种植户</div>
                  <div style="font-size:18px;font-weight:700;color:${color};">${town.farmers.toLocaleString()}户</div>
                </div>
                <div style="background:${hexRgba(color,0.08)};border:1px solid ${T.hairline};border-radius:10px;padding:10px 8px;text-align:center;">
                  <div style="font-size:10px;color:${T.muted};margin-bottom:4px;">年产量</div>
                  <div style="font-size:18px;font-weight:700;color:${color};">${town.production.toLocaleString()}吨</div>
                </div>
                <div style="background:${hexRgba(color,0.08)};border:1px solid ${T.hairline};border-radius:10px;padding:10px 8px;text-align:center;">
                  <div style="font-size:10px;color:${T.muted};margin-bottom:4px;">设施数</div>
                  <div style="font-size:18px;font-weight:700;color:${color};">${town.bases+town.factories+town.warehouses}个</div>
                </div>
              </div>
              <div style="margin-top:10px;font-size:11px;color:${T.body};background:${hexRgba(color,0.06)};border:1px solid ${T.hairline};border-radius:8px;padding:8px 10px;line-height:1.7;">
                ${town.highlight}
              </div>
            </div>`;
          }
          // Resource point
          if (p.seriesType === 'scatter' && p.data?._r) {
            const res = p.data._r as ResourceItem;
            const colors: Record<string,string> = { base: T.baseColor, factory: T.factoryColor, warehouse: T.warehouseColor };
            const labels: Record<string,string> = { base: '种植基地', factory: '加工厂', warehouse: '产地仓' };
            const units: Record<string,string> = { base: '亩', factory: '吨/日', warehouse: '吨' };
            return `<div style="font-family:'PingFang SC','Microsoft YaHei',serif;">
              <div style="font-size:13px;font-weight:700;margin-bottom:6px;padding-bottom:6px;border-bottom:1.5px solid ${T.hairline};">${res.name}</div>
              <div style="font-size:12px;line-height:1.9;">
                <div><span style="color:${T.muted};">所属：</span><span style="font-weight:600;color:${T.body};">${res.town}</span></div>
                <div><span style="color:${T.muted};">类型：</span><span style="font-weight:600;color:${colors[res.type]};">${labels[res.type]}</span></div>
                <div><span style="color:${T.muted};">规模：</span><span style="font-weight:600;color:${T.body};">${res.value.toLocaleString()} ${units[res.type]}</span></div>
                ${res.description ? `<div style="margin-top:6px;font-size:11px;color:${T.muted};background:${hexRgba(colors[res.type],0.06)};border:1px solid ${T.hairline};border-radius:6px;padding:6px 8px;line-height:1.6;">${res.description}</div>` : ''}
              </div>
            </div>`;
          }
          return '';
        },
      },

      geo: [
        // Background: surrounding provinces, very subtle
        {
          map: 'china',
          roam: false,
          silent: true,
          itemStyle: {
            areaColor: '#e8e0d0',
            borderColor: '#d0c8b8',
            borderWidth: 0.6,
          },
          emphasis: { disabled: true },
          select: { disabled: true },
        },
        // Foreground: Chishui town polygons
        {
          map: 'chishui_towns',
          roam: false,
          boundingCoords: [[105.60, 28.28], [106.28, 28.78]],
          itemStyle: {
            areaColor: (params: any) => {
              const name = params.name;
              const fill = townColorMap.get(name);
              if (!fill) return '#f0ebe3';
              if (hoveredTown === name || selectedTown === name) {
                return hexRgba(fill, 0.58);
              }
              return hexRgba(fill, 0.28);
            },
            borderColor: (params: any) => {
              const name = params.name;
              const fill = townColorMap.get(name);
              if (!fill) return T.hairline2;
              if (hoveredTown === name || selectedTown === name) return fill;
              return fill;
            },
            borderWidth: (params: any) => {
              const name = params.name;
              if (hoveredTown === name || selectedTown === name) return 2.2;
              return 1.4;
            },
            shadowColor: (params: any) => {
              const name = params.name;
              const fill = townColorMap.get(name);
              if (hoveredTown === name || selectedTown === name) return fill || 'transparent';
              return 'transparent';
            },
            shadowBlur: (params: any) => {
              return (hoveredTown === params.name || selectedTown === params.name) ? 16 : 0;
            },
            emphasis: {
              itemStyle: {
                areaColor: (params: any) => {
                  const fill = townColorMap.get(params.name);
                  return fill ? hexRgba(fill, 0.52) : 'rgba(93,184,166,0.3)';
                },
                borderColor: (params: any) => townColorMap.get(params.name) || T.hairline2,
                borderWidth: 2.4,
                shadowColor: (params: any) => townColorMap.get(params.name) || 'transparent',
                shadowBlur: 20,
              },
              label: { show: false },
            },
          },
          select: { disabled: true },
        },
      ],

      series: [
        // Town polygons via map series (ensures geoIndex boundary rendering)
        {
          type: 'map',
          map: 'chishui_towns',
          geoIndex: 1,
          zlevel: 1,
          silent: true,
          data: [],
        },

        // Resource: 种植基地
        {
          type: 'scatter',
          coordinateSystem: 'geo',
          geoIndex: 1,
          zlevel: 20,
          symbol: 'circle',
          symbolSize: (val: any) => Math.sqrt(val[2] as number) / 10 + 11,
          itemStyle: {
            color: T.baseColor,
            borderColor: '#faf7f2',
            borderWidth: 2.5,
            shadowColor: hexRgba(T.baseColor, 0.55),
            shadowBlur: 10,
          },
          emphasis: {
            scale: true,
            scaleSize: 14,
            itemStyle: { borderWidth: 3, shadowBlur: 18 },
          },
          data: scatterData.filter((_: any) => (_ as any)._r.type === 'base'),
        },

        // Resource: 加工厂
        {
          type: 'scatter',
          coordinateSystem: 'geo',
          geoIndex: 1,
          zlevel: 21,
          symbol: 'circle',
          symbolSize: (val: any) => Math.sqrt(val[2] as number) / 8 + 9,
          itemStyle: {
            color: T.factoryColor,
            borderColor: '#faf7f2',
            borderWidth: 2,
            shadowColor: hexRgba(T.factoryColor, 0.55),
            shadowBlur: 8,
          },
          emphasis: {
            scale: true,
            scaleSize: 13,
            itemStyle: { borderWidth: 3, shadowBlur: 16 },
          },
          data: scatterData.filter((_: any) => (_ as any)._r.type === 'factory'),
        },

        // Resource: 产地仓
        {
          type: 'scatter',
          coordinateSystem: 'geo',
          geoIndex: 1,
          zlevel: 22,
          symbol: 'circle',
          symbolSize: (val: any) => Math.sqrt(val[2] as number) / 8 + 8,
          itemStyle: {
            color: T.warehouseColor,
            borderColor: '#faf7f2',
            borderWidth: 2,
            shadowColor: hexRgba(T.warehouseColor, 0.55),
            shadowBlur: 8,
          },
          emphasis: {
            scale: true,
            scaleSize: 12,
            itemStyle: { borderWidth: 3, shadowBlur: 14 },
          },
          data: scatterData.filter((_: any) => (_ as any)._r.type === 'warehouse'),
        },
      ],
    };

    chart.setOption(option as any, true);

    // Events
    chart.on('mouseover', (params: any) => {
      if (params.componentType === 'series' && params.seriesType === 'map') {
        setHoveredTown(params.name);
        (chart.getZr() as any)?.setCursorStyle('pointer');
      }
    });
    chart.on('mouseout', (params: any) => {
      if (params.componentType === 'series' && params.seriesType === 'map') setHoveredTown(null);
    });
    chart.on('click', (params: any) => {
      if (params.componentType === 'series' && params.seriesType === 'map') {
        setSelectedTown(prev => prev === params.name ? null : params.name);
      }
    });

    const ro = new ResizeObserver(()=>chart.resize());
    ro.observe(chartRef.current!);
    return ()=>{ ro.disconnect(); chart.dispose(); chartInstance.current=null; };
  }, [loadState, towns, resources, hoveredTown, selectedTown]);

  // ── Render ──────────────────────────────────────────────
  const sel = selectedTown ? towns.find(t=>t.name===selectedTown) : null;

  return (
    <div style={{
      width:'100%', height:'100%', display:'flex', flexDirection:'column',
      background: T.bg,
      position:'relative', overflow:'hidden',
      fontFamily:'"PingFang SC","Microsoft YaHei",serif',
    }}>
      {/* Summary bar */}
      <div style={{
        display:'flex', padding:'12px 24px',
        background: T.card, borderBottom:`1px solid ${T.hairline}`,
        flexShrink:0,
      }}>
        {([
          { label:'种植总面积', value:total.area,       unit:'亩', color:T.baseColor },
          { label:'种植户数',   value:total.farmers,    unit:'户', color:T.warehouseColor },
          { label:'年产量',     value:total.production, unit:'吨', color:'#c8a060' },
          { label:'种植基地',   value:total.bases,       unit:'个', color:T.baseColor },
          { label:'加工厂',     value:total.factories,   unit:'个', color:T.factoryColor },
          { label:'产地仓',     value:total.warehouses,  unit:'个', color:T.warehouseColor },
        ] as const).map((item,i) => (
          <div key={item.label} style={{
            flex:1, textAlign:'center' as const, padding:'6px 12px',
            borderRight: i<5 ? `1px solid ${T.hairline}` : 'none',
          }}>
            <div style={{ fontSize:11, color:T.muted, marginBottom:3 }}>{item.label}</div>
            <div style={{ fontSize:22, fontWeight:700, color:item.color, letterSpacing:'-0.5px', lineHeight:1 }}>
              {item.value.toLocaleString()}
              <span style={{ fontSize:11, marginLeft:3, opacity:0.55, fontWeight:400 }}>{item.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div style={{ flex:1, display:'flex', overflow:'hidden', position:'relative' }}>
        {/* Map */}
        <div ref={chartRef} style={{ flex:1, minWidth:0 }} />

        {/* Detail panel */}
        <div style={{
          width: selectedTown ? 260 : 0,
          overflow:'hidden',
          transition: 'width 0.32s cubic-bezier(0.25,0.1,0.25,1)',
          flexShrink:0,
          background: T.card,
          borderLeft: selectedTown ? `1.5px solid ${T.hairline}` : 'none',
          display:'flex', flexDirection:'column',
        }}>
          {sel && (() => {
            const color = townColorMap.get(sel.name) || T.fills[0];
            return (
              <>
                <div style={{ padding:'18px 20px', borderBottom:`1px solid ${T.hairline}` }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
                    <span style={{
                      display:'inline-block', width:14, height:14, borderRadius:4,
                      background:color, boxShadow:`0 2px 8px ${hexRgba(color,0.5)}`,
                    }} />
                    <span style={{ fontSize:17, fontWeight:700, color:T.ink }}>{sel.name}</span>
                  </div>
                  <div style={{ fontSize:12, color:T.muted, lineHeight:1.7, paddingLeft:24 }}>
                    {sel.highlight}
                  </div>
                </div>

                <div style={{ padding:'16px 20px', borderBottom:`1px solid ${T.hairline}` }}>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                    {([
                      { l:'种植面积', v:sel.area.toLocaleString(), u:'亩' },
                      { l:'种植户',   v:sel.farmers.toLocaleString(), u:'户' },
                      { l:'年产量',   v:sel.production.toLocaleString(), u:'吨' },
                      { l:'设施数',   v:`${sel.bases+sel.factories+sel.warehouses}`, u:'个' },
                    ] as const).map(s=>(
                      <div key={s.l} style={{
                        background:T.bg, border:`1px solid ${T.hairline}`,
                        borderRadius:12, padding:'12px 8px', textAlign:'center',
                      }}>
                        <div style={{ fontSize:10, color:T.muted, marginBottom:5 }}>{s.l}</div>
                        <div style={{ fontSize:22, fontWeight:800, color, letterSpacing:'-0.5px', lineHeight:1 }}>
                          {s.v}
                        </div>
                        <div style={{ fontSize:10, color:'#b5a99d', marginTop:3 }}>{s.u}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ padding:'16px 20px', borderBottom:`1px solid ${T.hairline}` }}>
                  <div style={{ fontSize:11, color:T.muted, marginBottom:14, fontWeight:600, letterSpacing:'0.5px' }}>
                    设施分布
                  </div>
                  {([
                    { l:'种植基地', k:'bases',     c:T.baseColor },
                    { l:'加工厂',   k:'factories', c:T.factoryColor },
                    { l:'产地仓',   k:'warehouses',c:T.warehouseColor },
                  ] as const).map(item=>{
                    const val = (sel as any)[item.k] as number;
                    const tot = (total as any)[item.k] as number;
                    const pct = Math.max((val/Math.max(tot,1))*100, val>0?8:0);
                    return (
                      <div key={item.k} style={{ marginBottom:14 }}>
                        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:7 }}>
                          <span style={{ fontSize:13, color:T.body, fontWeight:600 }}>{item.l}</span>
                          <span style={{ fontSize:13, fontWeight:800, color:item.c }}>{val} 个</span>
                        </div>
                        <div style={{ height:5, background:T.hairline, borderRadius:3, overflow:'hidden' }}>
                          <div style={{
                            width:`${pct}%`, height:'100%',
                            background:item.c, borderRadius:3,
                            transition:'width 0.6s cubic-bezier(0.25,0.1,0.25,1)',
                          }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ padding:'16px 20px', flex:1, overflowY:'auto' }}>
                  <div style={{ fontSize:11, color:T.muted, marginBottom:10, fontWeight:600, letterSpacing:'0.5px' }}>
                    区域特色
                  </div>
                  <div style={{
                    fontSize:12, color:T.body, lineHeight:1.9,
                    background:T.bg, border:`1px solid ${T.hairline}`,
                    borderRadius:12, padding:'12px 14px',
                  }}>
                    {sel.name}位于赤水市{sel.name.includes('乡')?'乡':'镇'}域，
                    {sel.highlight}，石斛产业基础良好，
                    当前种植面积达 <strong style={{ color }}>{sel.area.toLocaleString()}</strong> 亩，
                    覆盖 <strong style={{ color }}>{sel.farmers.toLocaleString()}</strong> 户种植户，
                    年产优质石斛 <strong style={{ color }}>{sel.production.toLocaleString()}</strong> 吨。
                  </div>

                  {(() => {
                    const res = resources.filter(r=>r.town===sel.name);
                    if (!res.length) return null;
                    const colors: Record<string,string> = { base:T.baseColor, factory:T.factoryColor, warehouse:T.warehouseColor };
                    const labels: Record<string,string> = { base:'种植基地', factory:'加工厂', warehouse:'产地仓' };
                    const units: Record<string,string> = { base:'亩', factory:'吨/日', warehouse:'吨' };
                    return (
                      <div style={{ marginTop:16 }}>
                        <div style={{ fontSize:11, color:T.muted, marginBottom:10, fontWeight:600, letterSpacing:'0.5px' }}>
                          产业设施
                        </div>
                        {res.map((r,i)=>(
                          <div key={i} style={{
                            display:'flex', alignItems:'flex-start', gap:10,
                            padding:'10px 12px', background:T.bg, border:`1px solid ${T.hairline}`,
                            borderRadius:10, marginBottom:8,
                          }}>
                            <div style={{
                              width:9, height:9, borderRadius:'50%', background:colors[r.type],
                              flexShrink:0, marginTop:4,
                              boxShadow:`0 0 6px ${hexRgba(colors[r.type],0.5)}`,
                            }} />
                            <div>
                              <div style={{ fontSize:12, fontWeight:700, color:T.ink, lineHeight:1.4 }}>{r.name}</div>
                              <div style={{ fontSize:10, color:T.muted, marginTop:3 }}>
                                {labels[r.type]} · {r.value.toLocaleString()} {units[r.type]}
                              </div>
                              {r.description && (
                                <div style={{ fontSize:10, color:'#b5a99d', marginTop:2, lineHeight:1.5 }}>{r.description}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </>
            );
          })()}
        </div>
      </div>

      {/* Legend bar */}
      <div style={{
        display:'flex', alignItems:'center', gap:20,
        padding:'10px 24px', background:T.card, borderTop:`1px solid ${T.hairline}`,
        flexShrink:0, fontSize:12,
      }}>
        <span style={{ color:T.muted, fontSize:11, flexShrink:0, fontWeight:600 }}>图例</span>
        {([
          { l:'种植基地', c:T.baseColor },
          { l:'加工厂',   c:T.factoryColor },
          { l:'产地仓',   c:T.warehouseColor },
        ] as const).map(item=>(
          <div key={item.l} style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{
              width:11, height:11, borderRadius:'50%', background:item.c,
              boxShadow:`0 0 6px ${hexRgba(item.c,0.5)}`, flexShrink:0,
            }} />
            <span style={{ fontSize:11, color:T.body, fontWeight:600 }}>{item.l}</span>
          </div>
        ))}
        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ fontSize:11, color:T.muted }}>点击镇域查看详情</span>
        </div>
      </div>
    </div>
  );
};

export default ResourceMap;
