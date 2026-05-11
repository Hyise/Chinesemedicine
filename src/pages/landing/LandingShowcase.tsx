import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LandingShowcase.module.css';

// ─── Rich Mockup Components ───────────────────────────────────────

function BlockchainMockup() {
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    {
      name: '种植采收', actor: '农户 张三', time: '2025-03-15 09:23', type: '种植端',
      data: [
        { label: '种源信息', value: '金钗石斛 (GAP认证)' },
        { label: '产地坐标', value: '贵州赤水 · 旺隆镇基地' },
        { label: '采收批次', value: '#ZC-2025-0891' },
        { label: '采收数量', value: '50 kg' },
        { label: '农事记录', value: '17条完整记录' },
      ],
      hash: 'a3f8c2d1e9b4f7a6c8e2d5b9f1a4c7e8d2b5f8a1c4e7d0b3f6a9c2e5d8b1f4a7',
      status: 'confirmed',
    },
    {
      name: '加工炮制', actor: '车间 李四', time: '2025-03-16 14:30', type: '加工端',
      data: [
        { label: '加工工艺', value: '鲜条 → 净洗 → 烘软 → 缠绕' },
        { label: '干燥参数', value: '45°C, 持续12h' },
        { label: '操作人员', value: '李四 (持证上岗)' },
        { label: '质检报告', value: '合格' },
        { label: '工艺记录', value: '8道工序完成' },
      ],
      hash: '7c4e1d8f3b9a6c2e5d7f0b4a8c1e3d6f9b2a5c8e1d4f7b0a3c6e9d2f5b8a1c4',
      status: 'confirmed',
    },
    {
      name: '质检入库', actor: '质检员 王五', time: '2025-03-17 10:15', type: '质检端',
      data: [
        { label: '检测项目', value: '16项全检' },
        { label: '有效成分', value: '0.87% (≥0.4%) ✓' },
        { label: '农药残留', value: 'ND (未检出) ✓' },
        { label: '重金属', value: '合格 ✓' },
        { label: '质检证书', value: 'ZJ-2025-0317-089' },
      ],
      hash: '2b5d8e1f4a7c3d9f6b2e5a8c1f4d7b0e3a6c9f2d5b8e1a4c7f0d3b6e9a2f5c8',
      status: 'confirmed',
    },
    {
      name: '出库销售', actor: '系统自动', time: '2025-03-20 16:42', type: '流通端',
      data: [
        { label: '购买方', value: '成都某饮片厂' },
        { label: '出库数量', value: '30 kg' },
        { label: '物流方式', value: '冷链配送' },
        { label: '运单号', value: 'SF1234567890' },
        { label: '追溯码', value: 'TRC-2025-03-0891' },
      ],
      hash: '9e4a7c1d3f8b2e5d9a6c3f7b0e4d8a1f5c2b6e9d3a7c0f4b7e1a2d5c8f3b6e9d0a4',
      status: 'confirmed',
    },
  ];

  useEffect(() => {
    const t = setInterval(() => {
      setActiveStep(s => (s + 1) % steps.length);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const step = steps[activeStep];
  const stepColors = ['#5db8a6', '#5db872', '#e8a55a', '#cc785c'];

  return (
    <div className={styles.mockupBlock}>
      {/* Chain flow */}
      <div className={styles.chainFlow}>
        {steps.map((s, idx) => (
          <div key={s.name} className={`${styles.chainStep} ${idx === activeStep ? styles.chainStepActive : ''} ${idx < activeStep ? styles.chainStepDone : ''}`}>
            <div className={styles.chainNode} style={idx <= activeStep ? { borderColor: stepColors[idx], boxShadow: `0 0 12px ${stepColors[idx]}40` } : {}}>
              <span className={styles.chainIdx} style={idx <= activeStep ? { color: stepColors[idx] } : {}}>{idx + 1}</span>
            </div>
            <div className={styles.chainLabel} style={idx <= activeStep ? { color: stepColors[idx] } : {}}>{s.name}</div>
            {idx < steps.length - 1 && <div className={`${styles.chainLine} ${idx < activeStep ? styles.chainLineDone : ''}`} />}
          </div>
        ))}
      </div>

      {/* Data card */}
      <div className={styles.chainCard}>
        <div className={styles.chainCardHeader}>
          <div className={styles.chainCardBadge} style={{ color: stepColors[activeStep], background: `${stepColors[activeStep]}15`, border: `1px solid ${stepColors[activeStep]}30` }}>
            {step.type}
          </div>
          <span className={styles.chainCardTitle} style={{ color: stepColors[activeStep] }}>{step.name}</span>
          <span className={`${styles.chainCardStatus} ${step.status === 'confirmed' ? styles.chainCardConfirmed : ''}`}>
            {step.status === 'confirmed' ? '✓ 已确认' : 'pending'}
          </span>
        </div>
        <div className={styles.chainCardMeta}>
          <span>操作人：{step.actor}</span>
          <span>{step.time}</span>
        </div>
        <div className={styles.chainCardData}>
          {step.data.map((d, i) => (
            <div key={i} className={styles.chainCardRow}>
              <span className={styles.chainCardLabel}>{d.label}</span>
              <span className={styles.chainCardValue}>{d.value}</span>
            </div>
          ))}
        </div>
        <div className={styles.chainHash}>
          <span className={styles.chainHashLabel}>Hash:</span>
          <span className={styles.chainHashValue}>{step.hash.slice(0, 40)}...</span>
          <button className={styles.chainHashBtn}>验真</button>
        </div>
      </div>
    </div>
  );
}

function WMSMockup() {
  const [activeTab, setActiveTab] = useState(0);

  const zones = [
    { name: 'A区 · 鲜品暂存', items: 12, fill: 78, color: '#5db872', capacity: 200 },
    { name: 'B区 · 阴凉干燥', items: 24, fill: 65, color: '#5db8a6', capacity: 400 },
    { name: 'C区 · 冷链仓储', items: 8, fill: 42, color: '#cc785c', capacity: 180 },
    { name: 'D区 · 成品待发', items: 18, fill: 91, color: '#e8a55a', capacity: 300 },
  ];

  const recentOps = [
    { id: 'IN-2025-1234', type: '入库', herb: '金钗石斛 (鲜)', qty: '50kg', time: '09:23', user: '王管理员', status: 'complete' },
    { id: 'OUT-2025-567', type: '出库', herb: '太子参 (干品)', qty: '30kg', time: '10:15', user: '李仓管', status: 'complete' },
    { id: 'TSF-2025-089', type: '调拨', herb: '天麻 → C区', qty: '20kg', time: '11:30', user: '系统', status: 'pending' },
    { id: 'PROC-2025-031', type: '加工', herb: '石斛加工中', qty: '12kg', time: '11:45', user: '张师傅', status: 'running' },
  ];

  const opColors: Record<string, string> = { '入库': '#5db872', '出库': '#cc785c', '调拨': '#5db8a6', '加工': '#e8a55a' };
  const statusColors: Record<string, string> = { 'complete': '#5db872', 'pending': '#e8a55a', 'running': '#5db8a6' };

  return (
    <div className={styles.mockupBlock}>
      {/* Tab bar */}
      <div className={styles.wmsTabs}>
        {['库区概览', '入库记录', '出库记录'].map((t, i) => (
          <button key={t} className={`${styles.wmsTab} ${activeTab === i ? styles.wmsTabActive : ''}`} onClick={() => setActiveTab(i)}>
            {t}
          </button>
        ))}
      </div>

      {activeTab === 0 ? (
        <div className={styles.wmsBody}>
          <div className={styles.wmsZones}>
            {zones.map(zone => (
              <div key={zone.name} className={styles.wmsZone}>
                <div className={styles.wmsZoneHeader}>
                  <span className={styles.wmsZoneName}>{zone.name}</span>
                  <span className={styles.wmsZoneCount} style={{ color: zone.color }}>{zone.items}品 / {zone.capacity}kg</span>
                </div>
                <div className={styles.wmsZoneBar}>
                  <div className={styles.wmsZoneFill} style={{ width: `${zone.fill}%`, background: zone.color, boxShadow: `0 0 8px ${zone.color}60` }} />
                  <div className={styles.wmsZoneThreshold} style={{ left: '85%' }} />
                </div>
                <div className={styles.wmsZoneFooter}>
                  <span style={{ color: zone.color }}>{zone.fill}%</span>
                  <span className={styles.wmsZoneWarn} style={{ opacity: zone.fill > 85 ? 1 : 0 }}>库存预警</span>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.wmsOps}>
            <div className={styles.wmsOpsTitle}>最近操作</div>
            {recentOps.map(op => (
              <div key={op.id} className={styles.wmsOpRow}>
                <span className={styles.wmsOpType} style={{ color: opColors[op.type], background: `${opColors[op.type]}15` }}>{op.type}</span>
                <div className={styles.wmsOpInfo}>
                  <span className={styles.wmsOpHerb}>{op.herb}</span>
                  <span className={styles.wmsOpMeta}>{op.id} · {op.user}</span>
                </div>
                <div className={styles.wmsOpRight}>
                  <span className={styles.wmsOpQty}>{op.qty}</span>
                  <span className={styles.wmsOpTime}>{op.time}</span>
                  <span className={styles.wmsOpStatus} style={{ color: statusColors[op.status], background: `${statusColors[op.status]}15` }}>
                    {op.status === 'complete' ? '完成' : op.status === 'pending' ? '待处理' : '进行中'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.wmsTable}>
          <div className={styles.wmsTableHeader}>
            <span>单号</span><span>药材</span><span>数量</span><span>时间</span><span>状态</span>
          </div>
          {recentOps.filter((_, i) => (activeTab === 1 ? ['入库', '调拨'].includes(recentOps[i].type) : recentOps[i].type === '出库')).map(op => (
            <div key={op.id} className={styles.wmsTableRow}>
              <span className={styles.wmsTableMono}>{op.id}</span>
              <span>{op.herb}</span>
              <span className={styles.wmsTableMono}>{op.qty}</span>
              <span>{op.time}</span>
              <span className={styles.wmsTableStatus} style={{ color: statusColors[op.status] }}>{op.status === 'complete' ? '已完成' : op.status === 'running' ? '进行中' : '待处理'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PlantingMockup() {
  const [month, setMonth] = useState(5);
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

  const tasks = [
    { name: '施基肥', status: 'done', date: '03-01 ~ 03-10', worker: '张农户' },
    { name: '定植', status: 'done', date: '03-05 ~ 03-15', worker: '张农户' },
    { name: '浇水', status: 'active', date: '03-15 ~ 持续', worker: '系统自动' },
    { name: '除草', status: 'done', date: '04-01 ~ 04-10', worker: '李农户' },
    { name: '追肥', status: 'upcoming', date: '05-01 ~ 05-10', worker: '待安排' },
    { name: '病虫害防治', status: 'upcoming', date: '05-15 ~ 05-25', worker: '待安排' },
    { name: '采收', status: 'upcoming', date: '10-01 ~ 10-31', worker: '待安排' },
  ];

  const statusStyle: Record<string, { bg: string; color: string; label: string }> = {
    done: { bg: 'rgba(93,184,114,0.12)', color: '#5db872', label: '已完成' },
    active: { bg: 'rgba(93,184,166,0.12)', color: '#5db8a6', label: '进行中' },
    upcoming: { bg: 'rgba(142,139,130,0.1)', color: '#8e8b82', label: '待执行' },
  };

  const envData = [
    { label: '土壤温度', value: '18.5°C', color: '#5db8a6', icon: 'T' },
    { label: '土壤湿度', value: '42%', color: '#5db8a6', icon: 'H' },
    { label: '光照强度', value: '2800 lux', color: '#e8a55a', icon: 'L' },
    { label: '大气温湿度', value: '24°C / 65%', color: '#5db872', icon: 'A' },
  ];

  return (
    <div className={styles.mockupBlock}>
      <div className={styles.plantHeader}>
        <div className={styles.plantTitle}>农事排期 · 2025年度</div>
        <div className={styles.plantEnvs}>
          {envData.map(e => (
            <div key={e.label} className={styles.plantEnvItem} style={{ borderColor: `${e.color}30` }}>
              <span className={styles.plantEnvIcon} style={{ color: e.color, background: `${e.color}15` }}>{e.icon}</span>
              <span className={styles.plantEnvLabel}>{e.label}</span>
              <span className={styles.plantEnvValue} style={{ color: e.color }}>{e.value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.plantCalendar}>
        {months.map((m, i) => (
          <button key={m} className={`${styles.plantMonth} ${i + 1 === month ? styles.plantMonthActive : ''}`} onClick={() => setMonth(i + 1)}>
            {m}
          </button>
        ))}
      </div>
      <div className={styles.plantTasks}>
        {tasks.map(task => (
          <div key={task.name} className={styles.plantTaskRow}>
            <div className={styles.plantTaskCheck} style={{ background: statusStyle[task.status].bg, borderColor: statusStyle[task.status].color }}>
              {task.status === 'done' && <span style={{ color: statusStyle[task.status].color, fontSize: '10px' }}>✓</span>}
              {task.status === 'active' && <span className={styles.plantTaskPulse} />}
            </div>
            <div className={styles.plantTaskInfo}>
              <span className={styles.plantTaskName} style={{ color: task.status === 'upcoming' ? 'rgba(232,228,223,0.35)' : '#f0ece6' }}>{task.name}</span>
              <span className={styles.plantTaskWorker}>{task.worker}</span>
            </div>
            <span className={styles.plantTaskDate}>{task.date}</span>
            <span className={styles.plantTaskBadge} style={{ color: statusStyle[task.status].color, background: statusStyle[task.status].bg }}>
              {statusStyle[task.status].label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FinanceMockup() {
  const [tab, setTab] = useState(0);

  const loans = [
    { farmer: '旺隆镇种植户联盟', amount: '¥ 500,000', purpose: '购买种苗及农资', status: '审批中', progress: 60, date: '2025-03-10' },
    { farmer: '张三 (石斛种植户)', amount: '¥ 80,000', purpose: '扩建种植大棚', status: '已放款', progress: 100, date: '2025-02-28' },
    { farmer: '某饮片厂', amount: '¥ 2,000,000', purpose: '仓单质押融资', status: '还款中', progress: 45, date: '2025-03-01' },
    { farmer: '李四 (太子参)', amount: '¥ 120,000', purpose: '采购烘干设备', status: '审批中', progress: 25, date: '2025-03-12' },
  ];

  const statusCfg: Record<string, { color: string; bg: string; label: string }> = {
    '已放款': { color: '#5db872', bg: 'rgba(93,184,114,0.12)', label: '已放款' },
    '审批中': { color: '#e8a55a', bg: 'rgba(232,165,90,0.12)', label: '审批中' },
    '还款中': { color: '#5db8a6', bg: 'rgba(93,184,166,0.12)', label: '还款中' },
  };

  return (
    <div className={styles.mockupBlock}>
      <div className={styles.finTabs}>
        {['贷款申请', '保险服务', '资金托管'].map((t, i) => (
          <button key={t} className={`${styles.finTab} ${tab === i ? styles.finTabActive : ''}`} onClick={() => setTab(i)}>
            {t}
          </button>
        ))}
      </div>
      <div className={styles.finCards}>
        {loans.map(loan => (
          <div key={loan.farmer} className={styles.finCard}>
            <div className={styles.finCardTop}>
              <span className={styles.finCardFarmer}>{loan.farmer}</span>
              <span className={styles.finCardStatus} style={{ color: statusCfg[loan.status].color, background: statusCfg[loan.status].bg }}>
                {statusCfg[loan.status].label}
              </span>
            </div>
            <div className={styles.finCardAmount}>{loan.amount}</div>
            <div className={styles.finCardPurpose}>{loan.purpose}</div>
            <div className={styles.finCardMeta}>
              <span>申请日期: {loan.date}</span>
              <span>{loan.progress}%</span>
            </div>
            <div className={styles.finCardBar}>
              <div className={styles.finCardFill} style={{
                width: `${loan.progress}%`,
                background: loan.status === '已放款' ? '#5db872' : '#e8a55a',
                boxShadow: `0 0 8px ${loan.status === '已放款' ? '#5db872' : '#e8a55a'}60`
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MultiCodeMockup() {
  const [hovered, setHovered] = useState<string | null>(null);

  const codes = [
    { type: '一物一码', desc: '用于高端饮片独立包装', color: '#5db8a6', sub: '追溯粒度: 最小单位', count: '50,000+' },
    { type: '一批一码', desc: '用于批量药材物流箱', color: '#cc785c', sub: '追溯粒度: 批次', count: '12,680' },
    { type: '一域一码', desc: '用于产区地理标志认证', color: '#e8a55a', sub: '追溯粒度: 产地', count: '38' },
  ];

  return (
    <div className={styles.mockupBlock}>
      <div className={styles.codeGrid}>
        {codes.map(code => (
          <div
            key={code.type}
            className={styles.codeCard}
            onMouseEnter={() => setHovered(code.type)}
            onMouseLeave={() => setHovered(null)}
            style={{ borderColor: hovered === code.type ? `${code.color}40` : 'rgba(93,184,166,0.06)', transform: hovered === code.type ? 'translateY(-4px)' : 'none' }}
          >
            {/* QR pattern */}
            <div className={styles.codeQrWrap} style={{ borderColor: `${code.color}40`, background: `${code.color}06` }}>
              <svg width="80" height="80" viewBox="0 0 80 80">
                {/* Position patterns */}
                {[[5,5],[65,5],[5,65]].map(([px,py]) => (
                  <g key={`${px}-${py}`}>
                    <rect x={px} y={py} width="20" height="20" rx="2" fill="none" stroke={code.color} strokeWidth="2"/>
                    <rect x={px+3} y={py+3} width="14" height="14" rx="1" fill={code.color} opacity="0.3"/>
                  </g>
                ))}
                {/* Data modules */}
                {Array.from({ length: 6 }, (_, row) =>
                  Array.from({ length: 6 }, (_, col) => {
                    const x = 30 + col * 6;
                    const y = 30 + row * 6;
                    const filled = Math.random() > 0.35;
                    return filled ? (
                      <rect key={`${row}-${col}`} x={x} y={y} width="5" height="5" fill={code.color} opacity="0.6" rx="0.5"/>
                    ) : null;
                  })
                ).flat()}
                {/* Scan lines */}
                <line x1="30" y1="0" x2="30" y2="80" stroke={code.color} strokeWidth="0.5" strokeDasharray="3 3" opacity="0.2"/>
                <line x1="50" y1="0" x2="50" y2="80" stroke={code.color} strokeWidth="0.5" strokeDasharray="3 3" opacity="0.15"/>
              </svg>
            </div>
            <div className={styles.codeLabel} style={{ color: code.color }}>{code.type}</div>
            <div className={styles.codeDesc}>{code.desc}</div>
            <div className={styles.codeSub}>{code.sub}</div>
            <div className={styles.codeCount} style={{ color: code.color, background: `${code.color}12` }}>
              已生成 {code.count}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function IoTMockup() {
  const [sensors] = useState([
    { name: '土壤温度', value: 18.5, unit: '°C', icon: 'T', status: 'normal', color: '#5db8a6', min: 10, max: 35, history: [17,18,18.2,18.5,18.3,18.5] },
    { name: '土壤湿度', value: 42, unit: '%', icon: 'H', status: 'normal', color: '#5db8a6', min: 0, max: 100, history: [40,41,42,43,42,42] },
    { name: '光照强度', value: 2800, unit: 'lux', icon: 'L', status: 'warning', color: '#e8a55a', min: 0, max: 5000, history: [2600,2700,2800,2850,2800,2800] },
    { name: '空气质量', value: 98, unit: 'AQI', icon: 'A', status: 'normal', color: '#5db872', min: 0, max: 500, history: [95,97,98,99,98,98] },
    { name: '大气压', value: 965, unit: 'hPa', icon: 'P', status: 'normal', color: '#5db8a6', min: 900, max: 1050, history: [963,964,965,965,964,965] },
    { name: 'CO₂浓度', value: 412, unit: 'ppm', icon: 'C', status: 'normal', color: '#cc785c', min: 300, max: 2000, history: [400,405,410,412,410,412] },
  ]);

  const statusLabels: Record<string, string> = { normal: '正常', warning: '预警', danger: '告警' };

  return (
    <div className={styles.mockupBlock}>
      <div className={styles.iotGrid}>
        {sensors.map(sensor => {
          const pct = ((sensor.value - sensor.min) / (sensor.max - sensor.min)) * 100;
          return (
            <div key={sensor.name} className={styles.iotCard} style={{ borderColor: `${sensor.color}20` }}>
              <div className={styles.iotLeft}>
                <div className={styles.iotIcon} style={{ color: sensor.color, background: `${sensor.color}15`, border: `1px solid ${sensor.color}30` }}>
                  {sensor.icon}
                </div>
                <div className={styles.iotInfo}>
                  <div className={styles.iotName}>{sensor.name}</div>
                  <div className={styles.iotValue} style={{ color: sensor.status === 'warning' ? '#e8a55a' : '#f0ece6' }}>
                    {sensor.value}<span className={styles.iotUnit}>{sensor.unit}</span>
                  </div>
                </div>
              </div>
              <div className={styles.iotRight}>
                <div className={styles.iotStatus} style={{ color: sensor.color, background: `${sensor.color}15` }}>
                  {sensor.status === 'normal' ? '●' : sensor.status === 'warning' ? '◆' : '▲'} {statusLabels[sensor.status]}
                </div>
                <div className={styles.iotBar}>
                  <div className={styles.iotBarBg}>
                    <div className={styles.iotBarFill} style={{ width: `${pct}%`, background: sensor.color, boxShadow: `0 0 6px ${sensor.color}60` }} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Feature Data ─────────────────────────────────────────────────

const FEATURES = [
  {
    id: 'blockchain',
    tag: 'BLOCKCHAIN',
    title: '区块链溯源管理',
    subtitle: '让每一份药材都有"数字身份证"',
    desc: '基于 Hyperledger Fabric 联盟链架构，将金钗石斛从田间种植、采收加工、仓储物流到终端销售的每一个环节数据上链存证。通过一物一码技术，消费者扫码即可查验全链路溯源信息，实现"来源可查、去向可追、责任可究"。',
    highlights: [
      { label: '数据上链', value: '关键节点数据实时存证，hash 值上链，不可篡改' },
      { label: '扫码验真', value: '消费者扫码查询，3秒内获取全链路溯源信息' },
      { label: '多端协同', value: 'PC端管理后台 + 移动端小程序 + 扫码硬件' },
    ],
    mockup: <BlockchainMockup />,
    color: '#5db8a6',
    bgGrad: 'radial-gradient(ellipse at 80% 50%, rgba(93,184,166,0.07) 0%, transparent 60%)',
  },
  {
    id: 'wms',
    tag: 'WMS',
    title: '智能仓储加工管理',
    subtitle: '从原料入库到成品出库，全链路数字化管控',
    desc: '覆盖原料入库、加工转化、智能作业、库存台账、成品出库全流程。集成 AGV 调度、WMS 立体仓储、条码/RFID 识别技术，实现仓储作业自动化、库存可视化、流程可追溯。',
    highlights: [
      { label: '批次管理', value: '一物一档，批次全生命周期可追溯' },
      { label: '智能预警', value: '效期预警、库存预警、温湿度预警' },
      { label: '作业协同', value: '加工单、质检单、出库单自动流转' },
    ],
    mockup: <WMSMockup />,
    color: '#cc785c',
    bgGrad: 'radial-gradient(ellipse at 20% 50%, rgba(204,120,92,0.07) 0%, transparent 60%)',
  },
  {
    id: 'planting',
    tag: 'PLANTING',
    title: '种植服务管理',
    subtitle: '数字化种质资源到采收的全生命周期管理',
    desc: '为种植基地提供种质资源管理、农事排期、投入品管控、环境监测到采收记录的全流程数字化支撑。接入物联网设备实时采集土壤、气象、水质数据，AI 辅助病虫害诊断。',
    highlights: [
      { label: '档案管理', value: '一户一档、一地一档、一品一档' },
      { label: '农事记录', value: '施肥、灌溉、病虫害防治全程数字化' },
      { label: 'AI 辅助', value: '病虫害图像识别 + 种植建议智能推送' },
    ],
    mockup: <PlantingMockup />,
    color: '#5db872',
    bgGrad: 'radial-gradient(ellipse at 80% 50%, rgba(93,184,114,0.07) 0%, transparent 60%)',
  },
  {
    id: 'finance',
    tag: 'FINANCE',
    title: '供应链金融服务',
    subtitle: '破解金钗石斛产业链融资难题',
    desc: '基于可信贸易数据，为种植户、贸易商、饮片厂提供助农贷款、农业保险、供应链金融（SCF）、资金托管全链路服务。打通银行、保险、担保公司数据通道，降低融资门槛。',
    highlights: [
      { label: '仓单质押', value: '静态质押 + 动态质押两种模式灵活选择' },
      { label: '数据增信', value: '贸易数据、溯源数据多维度信用评估' },
      { label: '保险护航', value: '种植险 + 财产险 + 货运险一体化保障' },
    ],
    mockup: <FinanceMockup />,
    color: '#e8a55a',
    bgGrad: 'radial-gradient(ellipse at 20% 50%, rgba(232,165,90,0.07) 0%, transparent 60%)',
  },
  {
    id: 'multicode',
    tag: 'MULTI-CODE',
    title: '多码合一标识系统',
    subtitle: '三种码型适配全场景追溯需求',
    desc: '创新性地提出"一物一码、一批一码、一域一码"三码合一体系。一物一码用于高端饮片全程追溯；一批一码用于批量药材物流追溯；一域一码用于产地认证与品牌保护。',
    highlights: [
      { label: '一物一码', value: '最高粒度追溯，扫码查看种植、加工、质检全流程' },
      { label: '一批一码', value: '物流运输全程追踪，支持多级经销商流转' },
      { label: '一域一码', value: '地理标志认证，产区溯源，品牌防伪' },
    ],
    mockup: <MultiCodeMockup />,
    color: '#5db8a6',
    bgGrad: 'radial-gradient(ellipse at 80% 50%, rgba(93,184,166,0.07) 0%, transparent 60%)',
  },
  {
    id: 'iot',
    tag: 'IoT',
    title: '物联网数据采集',
    subtitle: '让田间地头的数据"活"起来',
    desc: '支持 Modbus、MQTT、HTTP 等多协议设备接入，统一汇聚土壤传感器、气象站、水质监测、无人机航拍等多源数据。边缘计算节点实现数据清洗与异常告警，云端 AI 模型提供种植决策支撑。',
    highlights: [
      { label: '多协议接入', value: 'Modbus / MQTT / HTTP / LoRaWAN 全覆盖' },
      { label: '边缘计算', value: '数据本地预处理，异常实时告警，减少带宽占用' },
      { label: '数字孪生', value: '3D 可视化基地实景 + 实时数据叠加' },
    ],
    mockup: <IoTMockup />,
    color: '#c64545',
    bgGrad: 'radial-gradient(ellipse at 20% 50%, rgba(198,69,69,0.07) 0%, transparent 60%)',
  },
];

// ─── Main Component ──────────────────────────────────────────────

const LandingShowcase: React.FC = () => {
  const navigate = useNavigate();
  const featureRefs = useRef<(HTMLElement | null)[]>([]);

  const handleScroll = useCallback(() => {
    featureRefs.current.forEach((el) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.75) {
        el.classList.add(styles.featureVisible);
      }
    });

    document.querySelectorAll('[data-stat]').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.8) {
        el.classList.add(styles.statVisible);
      }
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className={styles.page}>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroBgGrid} />
        <div className={styles.heroContent}>
          <div className={styles.heroEyebrow}>功能展示 · Feature Showcase</div>
          <h1 className={styles.heroTitle}>金钗石斛7s产业仓数据平台<br /><span className={styles.heroTitleAccent}>公共服务平台功能详解</span></h1>
          <p className={styles.heroDesc}>
            深入了解平台核心服务模块的能力与特色<br />
            从田间到终端，金钗石斛全产业链一站式公共服务
          </p>
          <div className={styles.heroActions}>
            <button className={styles.heroBtnPrimary} onClick={() => navigate('/app/dashboard')}>
              体验管理后台
            </button>
            <button className={styles.heroBtnSecondary} onClick={() => window.open('/', '_blank')}>
              返回科技首页
            </button>
          </div>
        </div>
        <div className={styles.heroScroll}>
          <div className={styles.heroScrollLine} />
          <span>SCROLL</span>
        </div>
      </section>

      {/* STATS BAND */}
      <section className={styles.statsBand}>
        {[
          { value: '12,680', label: '溯源批次', color: '#5db8a6' },
          { value: '3,420', label: '种植户', color: '#5db872' },
          { value: '¥ 4.2亿', label: '年交易额', color: '#cc785c' },
          { value: '98.7%', label: '质检合格率', color: '#e8a55a' },
          { value: '2,847', label: 'IoT设备', color: '#c64545' },
        ].map((s, i) => (
          <div key={s.label} className={styles.statItem} data-stat style={{ '--delay': `${i * 0.1}s` } as React.CSSProperties}>
            <span className={styles.statValue} style={{ color: s.color, textShadow: `0 0 20px ${s.color}60` }}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </section>

      {/* FEATURES */}
      {FEATURES.map((feature, idx) => (
        <section
          key={feature.id}
          id={`feature-${feature.id}`}
          ref={el => { featureRefs.current[idx] = el; }}
          className={`${styles.feature} ${idx % 2 === 1 ? styles.featureReverse : ''}`}
          style={{ background: feature.bgGrad }}
        >
          <div className={styles.featureInner}>
            <div className={styles.featureText}>
              <div className={styles.featureTag} style={{ color: feature.color, borderColor: `${feature.color}40`, background: `${feature.color}10` }}>
                {feature.tag}
              </div>
              <h2 className={styles.featureTitle}>{feature.title}</h2>
              <p className={styles.featureSubtitle}>{feature.subtitle}</p>
              <p className={styles.featureDesc}>{feature.desc}</p>
              <div className={styles.featureHighlights}>
                {feature.highlights.map(h => (
                  <div key={h.label} className={styles.featureHighlight}>
                    <span className={styles.featureHighlightDot} style={{ background: feature.color, boxShadow: `0 0 8px ${feature.color}80` }} />
                    <div>
                      <div className={styles.featureHighlightLabel} style={{ color: feature.color }}>{h.label}</div>
                      <div className={styles.featureHighlightValue}>{h.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.featureCta}>
                <button className={styles.featureBtn} style={{ background: feature.color, color: '#060912' }}>
                  查看详情
                </button>
                <button className={styles.featureBtnGhost} style={{ borderColor: `${feature.color}40`, color: feature.color }}>
                  视频介绍
                </button>
              </div>
            </div>
            <div className={styles.featureMockup}>
              {feature.mockup}
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>准备好体验完整系统了吗？</h2>
          <p className={styles.ctaDesc}>访问管理后台，体验所有功能的实际操作界面</p>
          <div className={styles.ctaBtns}>
            <button className={styles.ctaBtnPrimary} onClick={() => navigate('/app/dashboard')}>
              进入管理后台
            </button>
            <button className={styles.ctaBtnSecondary} onClick={() => window.open('/', '_blank')}>
              返回科技首页
            </button>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span>© 2025 金钗石斛7s产业仓数据平台公共服务平台 · 功能展示页</span>
          <span>贵州省赤水市</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingShowcase;
