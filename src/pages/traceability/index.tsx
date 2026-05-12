import React, { useState, useEffect } from 'react';
import {
  Row, Col, Table, Button, Space, Input, Modal,
  Timeline, Divider, Tabs, Progress, Tooltip, Drawer, Descriptions,
  message, Popconfirm, QRCode, Alert,
} from 'antd';
import {
  SearchOutlined, QrcodeOutlined, ReloadOutlined, CheckCircleOutlined,
  CloseCircleOutlined, ClockCircleOutlined, LinkOutlined, SafetyOutlined,
  BarChartOutlined, DatabaseOutlined, NodeIndexOutlined,
  WarningOutlined, SyncOutlined, RiseOutlined, SafetyCertificateOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { useSearchParams } from 'react-router-dom';
import type {
  ChainNode, ChainTrace, ChainTask, ChainStats,
  ChainNodeStatus, ChainTaskStatus, TraceIntegrity,
} from '@/types/global';
import {
  CHAIN_TASK_STATUS_MAP, CHAIN_INTEGRITY_LABEL, NODE_TYPE_LABEL,
} from '@/types/global';
import { CHART_COLORS } from '../dashboard/components/mockData';

function mockHash(data: string, seed = 0): string {
  let h = seed;
  for (let i = 0; i < data.length; i++) {
    h = ((h << 5) - h + data.charCodeAt(i)) >>> 0;
  }
  let hex = '';
  for (let i = 0; i < 32; i++) {
    h = ((h ^ (h >>> 16)) * 0x45d9f3b) >>> 0;
    h = ((h ^ (h >>> 16)) * 0x45d9f3b) >>> 0;
    h = (h ^ (h >>> 16)) >>> 0;
    hex += ((h >>> 0) & 0xffffffff).toString(16).padStart(8, '0');
  }
  return hex;
}

const genNode = (
  id: number, nodeNo: number, type: ChainNode['nodeType'], batchNo: string,
  traceCode: string, data: Record<string, unknown>, status: ChainNodeStatus,
  blockHeight: number, operator: string, time: string, prevHash = '0000000000000000000000000000000000000000000000000000000000000000'
): ChainNode => ({
  id, nodeNo, nodeType: type, nodeName: NODE_TYPE_LABEL[type],
  batchNo, traceCode, status,
  dataHash: mockHash(JSON.stringify(data), id * 31),
  prevHash, blockHeight, txHash: mockHash(`tx-${id}-${time}`, id),
  operator, onChainTime: time, data, createdAt: time,
});

const genTrace = (
  id: number, traceCode: string, batchNo: string, herb: string, spec: string,
  base: string, plantDate: string, harvestDate: string,
  nodes: ChainNode[], integrity: TraceIntegrity
): ChainTrace => ({
  id, traceCode, batchNo, herbName: herb, specification: spec, baseName: base,
  plantingDate: plantDate, harvestDate,
  plantingNode: nodes.find((n) => n.nodeType === 'planting'),
  harvestNode: nodes.find((n) => n.nodeType === 'harvest'),
  inspectionNode: nodes.find((n) => n.nodeType === 'inspection'),
  processingNode: nodes.find((n) => n.nodeType === 'processing'),
  storageNode: nodes.find((n) => n.nodeType === 'storage'),
  salesNode: nodes.find((n) => n.nodeType === 'sales'),
  integrity,
  totalNodes: 6,
  onChainNodes: nodes.filter((n) => n.status === 'on_chain').length,
  createdAt: plantDate,
});

const batchA = 'GZ-CHI-20260401-A';
const batchATraceCode = '7S-HERB-20260401-001';
const nodesA1 = genNode(1, 1, 'planting', batchA, batchATraceCode,
  { baseName: '官渡镇石斛林下经济示范园', herbName: '金钗石斛', area: 3200, farmer: '张农户', plantDate: '2023-04-15', farmRecords: 18 },
  'on_chain', 1024, '李管理员', '2026-04-01 09:30:00');
const nodesA2 = genNode(2, 2, 'harvest', batchA, batchATraceCode,
  { harvestDate: '2026-03-20', harvestQty: 1200, harvester: '张农户', method: '人工采收', initialProcess: '鲜条' },
  'on_chain', 1025, '李管理员', '2026-04-01 10:00:00', nodesA1.dataHash);
const nodesA3 = genNode(3, 3, 'inspection', batchA, batchATraceCode,
  { reportNo: 'QR-202604-001', dendrobine: 42.5, moisture: 8.2, heavyMetalPb: 0.3, pesticide: '未检出', result: 'pass' },
  'on_chain', 1026, '赵检测员', '2026-04-01 14:00:00', nodesA2.dataHash);
const nodesA4 = genNode(4, 4, 'processing', batchA, batchATraceCode,
  { processDate: '2026-03-25', processType: '枫斗', factory: '官渡镇石斛初加工厂', output: 380, specification: '统货/枫斗' },
  'on_chain', 1027, '王加工师', '2026-04-02 08:00:00', nodesA3.dataHash);
const nodesA5 = genNode(5, 5, 'storage', batchA, batchATraceCode,
  { warehouse: '赤水金钗石斛7S产地仓', location: 'A区-03', tempRange: '2-8℃', humidity: '45-60%', inDate: '2026-04-05' },
  'on_chain', 1028, '陈仓管', '2026-04-05 10:00:00', nodesA4.dataHash);
const nodesA6 = genNode(6, 6, 'sales', batchA, batchATraceCode,
  { orderNo: 'XS-2026042201', customer: '华润三九医药股份有限公司', shippedDate: '2026-04-10', logisticsNo: 'SF1089234567890' },
  'on_chain', 1029, '刘发货员', '2026-04-10 09:00:00', nodesA5.dataHash);

const batchB = 'GZ-CHI-20260402-B';
const batchBTraceCode = '7S-HERB-20260402-002';
const nodesB1 = genNode(7, 1, 'planting', batchB, batchBTraceCode,
  { baseName: '长期镇石斛产业园', herbName: '金钗石斛', area: 4500, farmer: '李农户', plantDate: '2023-05-10', farmRecords: 22 },
  'on_chain', 1050, '李管理员', '2026-04-02 09:30:00');
const nodesB2 = genNode(8, 2, 'harvest', batchB, batchBTraceCode,
  { harvestDate: '2026-03-25', harvestQty: 1800, harvester: '李农户', method: '人工采收', initialProcess: '鲜条' },
  'on_chain', 1051, '李管理员', '2026-04-02 10:30:00', nodesB1.dataHash);
const nodesB3 = genNode(9, 3, 'inspection', batchB, batchBTraceCode,
  { reportNo: 'QR-202604-002', dendrobine: 38.7, moisture: 11.5, heavyMetalPb: 0.5, pesticide: '未检出', result: 'pass' },
  'on_chain', 1052, '赵检测员', '2026-04-02 15:00:00', nodesB2.dataHash);
const nodesB4 = genNode(10, 4, 'processing', batchB, batchBTraceCode,
  { processDate: '2026-04-01', processType: '枫斗', factory: '长期镇石斛深加工基地', output: 560, specification: '特级/枫斗' },
  'pending', 0, '王加工师', '');
const nodesB5 = genNode(11, 5, 'storage', batchB, batchBTraceCode,
  { warehouse: '赤水金钗石斛7S产地仓', location: 'B区-07', tempRange: '2-8℃', humidity: '45-60%', inDate: '2026-04-08' },
  'on_chain', 1060, '陈仓管', '2026-04-08 10:00:00', nodesB3.dataHash);
const nodesB6 = genNode(12, 6, 'sales', batchB, batchBTraceCode,
  { orderNo: 'XS-2026042203', customer: '安徽亳州药材市场', shippedDate: '2026-04-18', logisticsNo: 'JD20260418123' },
  'on_chain', 1065, '刘发货员', '2026-04-18 14:00:00', nodesB5.dataHash);

const batchC = 'GZ-CHI-20260403-C';
const batchCTraceCode = '7S-HERB-20260403-003';
const nodesC1 = genNode(13, 1, 'planting', batchC, batchCTraceCode,
  { baseName: '大同镇种植基地', herbName: '金钗石斛', area: 2800, farmer: '王农户', plantDate: '2023-06-01', farmRecords: 15 },
  'on_chain', 1080, '李管理员', '2026-04-03 09:00:00');
const nodesC2 = genNode(14, 2, 'harvest', batchC, batchCTraceCode,
  { harvestDate: '2026-04-02', harvestQty: 900, harvester: '王农户', method: '人工采收', initialProcess: '鲜条' },
  'on_chain', 1081, '李管理员', '2026-04-03 10:00:00', nodesC1.dataHash);
const nodesC3 = genNode(15, 3, 'inspection', batchC, batchCTraceCode,
  { reportNo: 'QR-202604-003', dendrobine: 36.2, moisture: 13.5, heavyMetalPb: 0.4, pesticide: '未检出', result: 'fail' },
  'on_chain', 1082, '赵检测员', '2026-04-03 14:00:00', nodesC2.dataHash);
const nodesC4 = genNode(16, 4, 'processing', batchC, batchCTraceCode,
  { processDate: '2026-04-06', processType: '切片', factory: '大同镇初加工厂', output: 280, specification: '优等/切片' },
  'on_chain', 1083, '王加工师', '2026-04-06 08:00:00', mockHash('TAMPERED_DATA', 99));
const nodesC5 = genNode(17, 5, 'storage', batchC, batchCTraceCode,
  { warehouse: '赤水金钗石斛7S产地仓', location: 'C区-02', tempRange: '2-8℃', humidity: '45-60%', inDate: '2026-04-12' },
  'on_chain', 1084, '陈仓管', '2026-04-12 10:00:00', nodesC4.dataHash);
const nodesC6 = genNode(18, 6, 'sales', batchC, batchCTraceCode,
  { orderNo: 'XS-2026042205', customer: '赤水源中药材合作社', shippedDate: '2026-04-23', logisticsNo: 'YT20260423123' },
  'pending', 0, '刘发货员', '');

const allTraces: ChainTrace[] = [
  genTrace(1, batchATraceCode, batchA, '金钗石斛', '统货/枫斗', '官渡镇石斛林下经济示范园', '2023-04-15', '2026-03-20', [nodesA1, nodesA2, nodesA3, nodesA4, nodesA5, nodesA6], 'intact'),
  genTrace(2, batchBTraceCode, batchB, '金钗石斛', '特级/枫斗', '长期镇石斛产业园', '2023-05-10', '2026-03-25', [nodesB1, nodesB2, nodesB3, nodesB4, nodesB5, nodesB6], 'unknown'),
  genTrace(3, batchCTraceCode, batchC, '金钗石斛', '优等/切片', '大同镇种植基地', '2023-06-01', '2026-04-02', [nodesC1, nodesC2, nodesC3, nodesC4, nodesC5, nodesC6], 'tampered'),
  genTrace(4, '7S-HERB-20260410-004', 'GZ-CHI-20260410-D', '金钗石斛', '普通/鲜条', '丙安镇种植合作社', '2023-07-15', '2026-04-08',
    [genNode(19, 1, 'planting', 'GZ-CHI-20260410-D', '7S-HERB-20260410-004', { baseName: '丙安镇种植合作社', herbName: '金钗石斛', area: 1500, farmer: '赵农户', plantDate: '2023-07-15' }, 'on_chain', 1090, '李管理员', '2026-04-10 09:00:00'),
     genNode(20, 2, 'harvest', 'GZ-CHI-20260410-D', '7S-HERB-20260410-004', { harvestDate: '2026-04-08', harvestQty: 600, harvester: '赵农户' }, 'on_chain', 1091, '李管理员', '2026-04-10 10:00:00')],
    'unknown'),
];

const mockTasks: ChainTask[] = [
  { id: 1, taskNo: 'CT-2026042701', traceCode: batchATraceCode, batchNo: batchA, herbName: '金钗石斛', nodeType: 'processing', nodeName: '加工生产', status: 'on_chain', operator: '李管理员', createdAt: '2026-04-10 09:00:00', confirmAt: '2026-04-10 09:01:00', onChainAt: '2026-04-10 09:01:05' },
  { id: 2, taskNo: 'CT-2026042702', traceCode: batchATraceCode, batchNo: batchA, herbName: '金钗石斛', nodeType: 'storage', nodeName: '仓储流通', status: 'on_chain', operator: '陈仓管', createdAt: '2026-04-05 10:00:00', confirmAt: '2026-04-05 10:00:30', onChainAt: '2026-04-05 10:00:35' },
  { id: 3, taskNo: 'CT-2026042703', traceCode: batchBTraceCode, batchNo: batchB, herbName: '金钗石斛', nodeType: 'processing', nodeName: '加工生产', status: 'pending', operator: '王加工师', createdAt: '2026-04-26 08:00:00' },
  { id: 4, taskNo: 'CT-2026042704', traceCode: batchCTraceCode, batchNo: batchC, herbName: '金钗石斛', nodeType: 'sales', nodeName: '终端销售', status: 'pending', operator: '刘发货员', createdAt: '2026-04-23 15:00:00' },
  { id: 5, taskNo: 'CT-2026042705', traceCode: batchBTraceCode, batchNo: batchB, herbName: '金钗石斛', nodeType: 'sales', nodeName: '终端销售', status: 'confirming', operator: '刘发货员', createdAt: '2026-04-26 14:00:00', confirmAt: '2026-04-26 14:01:00' },
  { id: 6, taskNo: 'CT-2026042706', traceCode: '7S-HERB-20260410-004', batchNo: 'GZ-CHI-20260410-D', herbName: '金钗石斛', nodeType: 'inspection', nodeName: '质量检测', status: 'failed', operator: '赵检测员', createdAt: '2026-04-10 15:00:00', failReason: '检测报告数据校验失败，请检查报告编号格式' },
];

const chainStats: ChainStats = {
  totalBatches: 156,
  monthlyNew: 12,
  coverageRate: 82,
  integrityRate: 89,
  blockHeight: 1086,
  totalQueries: 4820,
  dailyQueries: [320, 410, 380, 450, 520, 490, 560, 480, 530, 610, 580, 640],
  nodeStats: [
    { name: '田间种植', count: 156, rate: 100 },
    { name: '采收登记', count: 155, rate: 99 },
    { name: '质量检测', count: 148, rate: 95 },
    { name: '加工生产', count: 142, rate: 91 },
    { name: '仓储流通', count: 138, rate: 88 },
    { name: '终端销售', count: 132, rate: 85 },
  ],
  herbStats: [
    { name: '金钗石斛（枫斗）', count: 89 },
    { name: '金钗石斛（鲜条）', count: 38 },
    { name: '金钗石斛（切片）', count: 22 },
    { name: '金钗石斛（石斛粉）', count: 7 },
  ],
  townStats: [
    { town: '官渡镇', count: 58 },
    { town: '长期镇', count: 46 },
    { town: '大同镇', count: 28 },
    { town: '丙安镇', count: 15 },
    { town: '元厚镇', count: 9 },
  ],
  monthlyTrend: [
    { month: '2025-07', onChain: 18, queries: 320 },
    { month: '2025-08', onChain: 22, queries: 410 },
    { month: '2025-09', onChain: 28, queries: 380 },
    { month: '2025-10', onChain: 35, queries: 450 },
    { month: '2025-11', onChain: 30, queries: 520 },
    { month: '2025-12', onChain: 42, queries: 490 },
    { month: '2026-01', onChain: 38, queries: 560 },
    { month: '2026-02', onChain: 45, queries: 480 },
    { month: '2026-03', onChain: 52, queries: 530 },
    { month: '2026-04', onChain: 62, queries: 640 },
  ],
};

// ============================================================
// Claude Design — CSS Styles
// ============================================================
const css = `
  /* Unified page header */
  .trace-header { background: #faf9f5; border-bottom: 1px solid #ebe6df; }
  .trace-header-inner { max-width: 1200px; margin: 0 auto; padding: 28px 0 24px; display: flex; align-items: center; gap: 24px; }
  .trace-header-left { flex-shrink: 0; }
  .trace-header-eyebrow { font-size: 11px; font-weight: 500; letter-spacing: 1px; text-transform: uppercase; color: #cc785c; margin-bottom: 6px; }
  .trace-header-title { font-family: "Tiempos Headline", "Cormorant Garamond", Garamond, "Times New Roman", serif; font-size: 28px; font-weight: 400; color: #141413; line-height: 1.2; margin: 0; }
  .trace-header-desc { font-size: 14px; color: #6c6a64; line-height: 1.6; flex: 1; }

  .trace-body { background: #faf9f5; }
  .trace-body-inner { max-width: 1200px; margin: 0 auto; padding: 0; }

  /* KPI Inline (inside tabs) */
  .trace-kpi-inline { display: flex; align-items: stretch; gap: 0; margin-bottom: 12px; border: 1px solid #e6dfd8; border-radius: 10px; overflow: hidden; }
  .trace-kpi-inline .trace-kpi-card { flex: 1; display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-right: 1px solid #ebe6df; background: #ffffff; transition: background 0.15s ease; }
  .trace-kpi-inline .trace-kpi-card:last-child { border-right: none; }
  .trace-kpi-inline .trace-kpi-card:hover { background: #fdfcf9; }
  .trace-kpi-inline .trace-kpi-accent { width: 3px; height: 32px; border-radius: 3px; flex-shrink: 0; }
  .trace-kpi-inline .trace-kpi-icon { width: 30px; height: 30px; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
  .trace-kpi-inline .trace-kpi-text { flex: 1; }
  .trace-kpi-inline .trace-kpi-label { font-size: 12px; color: #8e8b82; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px; }
  .trace-kpi-inline .trace-kpi-value { font-size: 17px; font-weight: 600; color: #141413; line-height: 1.2; }
  .trace-kpi-inline .trace-kpi-value span { font-size: 12px; font-weight: 400; color: #8e8b82; margin-left: 2px; }
  .trace-kpi-inline .trace-kpi-sub { font-size: 11px; color: #8e8b82; margin-top: 1px; }

  /* Tab nav */
  .trace-tabs { border-bottom: 1px solid #e6dfd8; margin-bottom: 20px; }
  .trace-tabs .ant-tabs-nav { margin: 0; }
  .trace-tabs .ant-tabs-tab { font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 14px; font-weight: 400; color: #6c6a64; padding: 10px 16px 12px; transition: color 0.15s ease; }
  .trace-tabs .ant-tabs-tab:hover { color: #141413; }
  .trace-tabs .ant-tabs-tab-active .ant-tabs-tab-btn { color: #cc785c !important; font-weight: 500 !important; }
  .trace-tabs .ant-tabs-ink-bar { background: #cc785c; height: 2px; border-radius: 2px 2px 0 0; }

  /* Cards */
  .trace-card { background: #ffffff; border: 1px solid #e6dfd8; border-radius: 12px; overflow: hidden; margin-bottom: 12px; transition: border-color 0.15s ease; }
  .trace-card:hover { border-color: #d4cfc4; }
  .trace-card-header { padding: 14px 20px 12px; border-bottom: 1px solid #ebe6df; display: flex; align-items: center; justify-content: space-between; }
  .trace-card-title { font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 14px; font-weight: 500; color: #141413; display: flex; align-items: center; gap: 8px; }
  .trace-card-title-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
  .trace-card-body { padding: 16px 20px; }

  /* Pill tags */
  .trace-tag-onchain { display: inline-flex; align-items: center; font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 10px; font-weight: 500; border-radius: 9999px; padding: 2px 8px; background: rgba(93,184,114,0.1); color: #5db872; border: none; }
  .trace-tag-pending { display: inline-flex; align-items: center; font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 10px; font-weight: 500; border-radius: 9999px; padding: 2px 8px; background: #efe9de; color: #6c6a64; border: none; }
  .trace-tag-failed { display: inline-flex; align-items: center; font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 10px; font-weight: 500; border-radius: 9999px; padding: 2px 8px; background: rgba(198,69,69,0.1); color: #c64545; border: none; }
  .trace-tag-hash { display: inline-flex; align-items: center; font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 10px; font-weight: 400; border-radius: 6px; padding: 1px 6px; background: #efe9de; color: #6c6a64; border: none; }

  /* Table */
  .trace-table .ant-table { background: transparent; }
  .trace-table .ant-table-thead > tr > th { background: #f5f0e8 !important; font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 11px; font-weight: 500; color: #6c6a64; letter-spacing: 0.5px; border-bottom: 1px solid #e6dfd8 !important; padding: 10px 16px; }
  .trace-table .ant-table-tbody > tr > td { font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 13px; color: #3d3d3a; border-bottom: 1px solid #ebe6df !important; padding: 12px 16px; transition: background 0.1s ease; }
  .trace-table .ant-table-tbody > tr:hover > td { background: #f5f0e8 !important; }
  .trace-table .ant-table-wrapper .ant-table-pagination { margin: 12px 0 0; }

  /* Buttons */
  .trace-btn-primary { font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 13px; font-weight: 500; background: #cc785c; color: #ffffff; border: none; border-radius: 8px; height: 32px; padding: 0 14px; transition: background 0.12s ease, transform 0.1s ease; }
  .trace-btn-primary:hover { background: #a9583e; transform: scale(0.97); }
  .trace-btn-ghost { font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 13px; font-weight: 400; color: #cc785c; background: transparent; border: none; border-radius: 8px; height: 32px; padding: 0 10px; transition: background 0.12s ease, transform 0.1s ease; }
  .trace-btn-ghost:hover { background: rgba(204,120,92,0.06); transform: scale(0.97); }
  .trace-btn-link { font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 13px; font-weight: 400; color: #cc785c; background: transparent; border: none; padding: 0 4px; height: auto; line-height: 1; }
  .trace-btn-link:hover { color: #a9583e; }

  /* Input */
  .trace-search-input .ant-input-affix-wrapper { font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 14px; border-radius: 8px; border: 1.5px solid #e6dfd8; background: #faf9f5; padding: 8px 12px; }
  .trace-search-input .ant-input-affix-wrapper:hover, .trace-search-input .ant-input-affix-wrapper:focus-within { border-color: #cc785c; background: #ffffff; box-shadow: 0 0 0 3px rgba(204,120,92,0.1); }
  .trace-search-input .ant-input { background: transparent; font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 14px; }
  .trace-search-input .ant-input::placeholder { color: #8e8b82; }

  /* Timeline */
  .trace-timeline .ant-timeline-item-content { margin-inline-start: 22px !important; }
  .trace-timeline .ant-timeline-item-tail { border-inline-start: 2px solid #e6dfd8 !important; }
  .trace-timeline-node-label { font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 13px; font-weight: 500; color: #141413; display: flex; align-items: center; gap: 8px; margin-bottom: 2px; }
  .trace-timeline-node-data { font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 11px; color: #6c6a64; display: flex; flex-direction: column; gap: 2px; }
  .trace-timeline-node-data span { line-height: 1.5; }

  /* Drawer */
  .trace-drawer .ant-drawer-header { border-bottom: 1px solid #ebe6df; padding: 18px 24px 14px; }
  .trace-drawer .ant-drawer-title { font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 15px; font-weight: 500; color: #141413; display: flex; align-items: center; gap: 10px; }
  .trace-drawer .ant-drawer-close { color: #6c6a64; }
  .trace-drawer .ant-drawer-body { padding: 20px 24px; font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  .trace-drawer .ant-descriptions-item-label { font-size: 12px; color: #6c6a64; font-weight: 400; padding: 6px 0; }
  .trace-drawer .ant-descriptions-item-content { font-size: 13px; color: #3d3d3a; padding: 6px 0; }

  /* Modal */
  .trace-modal .ant-modal-header { border-bottom: 1px solid #ebe6df; padding: 16px 24px 14px; margin: 0; }
  .trace-modal .ant-modal-title { font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 15px; font-weight: 500; color: #141413; }
  .trace-modal .ant-modal-body { padding: 20px 24px; font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  .trace-modal .ant-modal-footer { padding: 12px 24px 16px; border-top: 1px solid #ebe6df; }

  /* Descriptions */
  .trace-descriptions .ant-descriptions-view { border: 1px solid #e6dfd8; border-radius: 12px; overflow: hidden; }
  .trace-descriptions .ant-descriptions-item-label { background: #f5f0e8 !important; font-size: 12px; color: #6c6a64; padding: 8px 14px; }
  .trace-descriptions .ant-descriptions-item-content { font-size: 13px; color: #3d3d3a; padding: 8px 14px; }

  /* QR Card */
  .trace-qr-card { background: #f5f0e8; border-radius: 12px; padding: 16px; display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
  .trace-qr-card-title { font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 14px; font-weight: 500; color: #141413; margin-bottom: 4px; }
  .trace-qr-card-desc { font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 12px; color: #6c6a64; line-height: 1.5; }

  /* Hash display */
  .trace-hash-section { margin-bottom: 12px; }
  .trace-hash-label { font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; color: #6c6a64; margin-bottom: 8px; }
  .trace-hash-genesis { font-family: "JetBrains Mono", "JetBrains Mono", Menlo, Consolas, monospace; font-size: 9px; color: #5db872; background: rgba(93,184,114,0.1); padding: 6px 10px; border-radius: 8px; margin-bottom: 4px; word-break: break-all; line-height: 1.6; }
  .trace-hash-ref { font-family: "JetBrains Mono", "JetBrains Mono", Menlo, Consolas, monospace; font-size: 9px; color: #cc785c; background: rgba(204,120,92,0.1); padding: 6px 10px; border-radius: 8px; margin-bottom: 4px; word-break: break-all; line-height: 1.6; }
  .trace-hash-tamper { font-family: "JetBrains Mono", "JetBrains Mono", Menlo, Consolas, monospace; font-size: 9px; color: #c64545; background: rgba(198,69,69,0.1); padding: 6px 10px; border-radius: 8px; margin-bottom: 4px; word-break: break-all; line-height: 1.6; }

  /* Integrity status */
  .trace-status-intact { display: inline-flex; align-items: center; font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 11px; font-weight: 500; border-radius: 9999px; padding: 2px 10px; background: rgba(93,184,114,0.1); color: #5db872; }
  .trace-status-tampered { display: inline-flex; align-items: center; font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 11px; font-weight: 500; border-radius: 9999px; padding: 2px 10px; background: rgba(198,69,69,0.1); color: #c64545; }
  .trace-status-unknown { display: inline-flex; align-items: center; font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 11px; font-weight: 500; border-radius: 9999px; padding: 2px 10px; background: rgba(232,165,90,0.1); color: #d4a017; }

  /* Verify result */
  .trace-verify-alert { border-radius: 12px !important; }
  .trace-verify-detail { font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 13px; color: #3d3d3a; padding: 10px 14px; border-radius: 8px; margin-bottom: 6px; }
  .trace-verify-detail-ok { background: rgba(93,184,114,0.08); border-left: 3px solid #5db872; }
  .trace-verify-detail-err { background: rgba(198,69,69,0.08); border-left: 3px solid #c64545; }
  .trace-verify-meta { font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 11px; color: #8e8b82; margin-top: 4px; }

  /* Algo card */
  .trace-algo-card { background: #f5f0e8; border-radius: 12px; padding: 16px; }
  .trace-algo-item { font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 12px; color: #6c6a64; line-height: 1.9; }
  .trace-algo-item strong { color: #141413; font-weight: 500; }
  .trace-algo-demo { margin-top: 10px; background: #ffffff; border-radius: 8px; padding: 12px; }
  .trace-algo-demo-label { font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 10px; color: #8e8b82; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
  .trace-algo-demo-value { font-family: "JetBrains Mono", "JetBrains Mono", Menlo, Consolas, monospace; font-size: 10px; color: #6c6a64; word-break: break-all; line-height: 1.6; }

  /* Inline code */
  .trace-code { font-family: "JetBrains Mono", "JetBrains Mono", Menlo, Consolas, monospace; font-size: 12px; color: #cc785c; font-weight: 500; letter-spacing: 0; cursor: pointer; }
  .trace-code:hover { color: #a9583e; }

  /* Responsive */
  @media (max-width: 768px) {
    .trace-header-inner { padding: 20px 0 16px; flex-direction: column; align-items: flex-start; gap: 8px; }
    .trace-header-title { font-size: 22px; }
    .trace-kpi-inline { flex-wrap: wrap; }
    .trace-kpi-inline .trace-kpi-card { min-width: 50%; border-bottom: 1px solid #ebe6df; }
    .trace-kpi-inline .trace-kpi-card:nth-child(2n) { border-right: none; }
  }
`;

// ============================================================
// Chart Card Component
// ============================================================
interface ChartCardProps {
  title: string;
  dotColor?: string;
  children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, dotColor = '#cc785c', children }) => (
  <div className="trace-card">
    <div className="trace-card-header">
      <div className="trace-card-title">
        {dotColor && <div className="trace-card-title-dot" style={{ background: dotColor }} />}
        {title}
      </div>
    </div>
    <div className="trace-card-body">{children}</div>
  </div>
);

// ============================================================
// Timeline Node Renderer
// ============================================================
const renderChainTimeline = (trace: ChainTrace) => {
  const nodeMap: Record<string, ChainNode | undefined> = {
    planting: trace.plantingNode,
    harvest: trace.harvestNode,
    inspection: trace.inspectionNode,
    processing: trace.processingNode,
    storage: trace.storageNode,
    sales: trace.salesNode,
  };
  const nodeOrder: ChainNode['nodeType'][] = ['planting', 'harvest', 'inspection', 'processing', 'storage', 'sales'];

  return (
    <Timeline
      className="trace-timeline"
      items={nodeOrder.map((type) => {
        const node = nodeMap[type];
        const isDone = node?.status === 'on_chain';
        const isFailed = node?.status === 'failed';
        const dotColor = isDone ? '#5db872' : isFailed ? '#c64545' : '#e6dfd8';

        return {
          color: dotColor,
          dot: (
            <div style={{
              width: 10, height: 10, borderRadius: '50%',
              background: dotColor,
              border: isDone || isFailed ? '2px solid rgba(250,249,245,0.8)' : 'none',
              boxShadow: isDone ? '0 0 0 3px rgba(93,184,114,0.2)' : isFailed ? '0 0 0 3px rgba(198,69,69,0.2)' : 'none',
            }} />
          ),
          children: (
            <div style={{ paddingBottom: 4 }}>
              <div className="trace-timeline-node-label">
                {NODE_TYPE_LABEL[type]}
                {isDone && <span className="trace-tag-onchain">已上链</span>}
                {!isDone && !isFailed && <span className="trace-tag-pending">待上链</span>}
                {isFailed && <span className="trace-tag-failed">失败</span>}
              </div>
              {node && isDone && (
                <div className="trace-timeline-node-data">
                  {type === 'planting' && <>
                    <span>基地：{(node.data as { baseName?: string }).baseName}</span>
                    <span>面积：{(node.data as { area?: number }).area} 亩</span>
                    <span>农户：{(node.data as { farmer?: string }).farmer}</span>
                  </>}
                  {type === 'harvest' && <>
                    <span>采收日期：{(node.data as { harvestDate?: string }).harvestDate}</span>
                    <span>采收量：{(node.data as { harvestQty?: number }).harvestQty} kg</span>
                    <span>方式：{(node.data as { method?: string }).method}</span>
                  </>}
                  {type === 'inspection' && <>
                    <span>报告号：{(node.data as { reportNo?: string }).reportNo}</span>
                    <span>石斛碱：{(node.data as { dendrobine?: number }).dendrobine}%</span>
                    <span>含水率：{(node.data as { moisture?: number }).moisture}%</span>
                    <span>判定：{(node.data as { result?: string }).result === 'pass' ? '合格' : '不合格'}</span>
                  </>}
                  {type === 'processing' && <>
                    <span>加工日期：{(node.data as { processDate?: string }).processDate}</span>
                    <span>工艺：{(node.data as { processType?: string }).processType}</span>
                    <span>工厂：{(node.data as { factory?: string }).factory}</span>
                    <span>产量：{(node.data as { output?: number }).output} kg</span>
                  </>}
                  {type === 'storage' && <>
                    <span>仓库：{(node.data as { warehouse?: string }).warehouse}</span>
                    <span>库位：{(node.data as { location?: string }).location}</span>
                    <span>温度：{(node.data as { tempRange?: string }).tempRange}</span>
                  </>}
                  {type === 'sales' && <>
                    <span>订单：{(node.data as { orderNo?: string }).orderNo}</span>
                    <span>客户：{(node.data as { customer?: string }).customer}</span>
                    <span>物流：{(node.data as { logisticsNo?: string }).logisticsNo}</span>
                  </>}
                  <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                    <Tooltip title={`区块高度：${node.blockHeight}`}><span className="trace-tag-hash">块高 {node.blockHeight}</span></Tooltip>
                    <Tooltip title={`交易哈希：${node.txHash?.slice(0, 16)}...`}><span className="trace-tag-hash">TX {node.txHash?.slice(0, 8)}...</span></Tooltip>
                    <Tooltip title={`数据哈希：${node.dataHash.slice(0, 16)}...`}><span className="trace-tag-hash">Hash {node.dataHash.slice(0, 8)}...</span></Tooltip>
                  </div>
                  <span style={{ fontSize: 10, color: '#8e8b82', marginTop: 2, display: 'block' }}>上链时间：{node.onChainTime}</span>
                </div>
              )}
              {!node && <span style={{ fontSize: 11, color: '#d4cfc4' }}>暂无数据</span>}
            </div>
          ),
        };
      })}
    />
  );
};

// ============================================================
// Integrity Tag
// ============================================================
const IntegrityTag: React.FC<{ integrity: TraceIntegrity }> = ({ integrity }) => {
  if (integrity === 'intact') return <span className="trace-status-intact">{CHAIN_INTEGRITY_LABEL[integrity]}</span>;
  if (integrity === 'tampered') return <span className="trace-status-tampered">{CHAIN_INTEGRITY_LABEL[integrity]}</span>;
  return <span className="trace-status-unknown">{CHAIN_INTEGRITY_LABEL[integrity]}</span>;
};

// ============================================================
// Main Component
// ============================================================
const Traceability: React.FC = () => {
  const [tasks, setTasks] = useState<ChainTask[]>(mockTasks);
  const [activeTab, setActiveTab] = useState('query');
  const [searchText, setSearchText] = useState('');
  const [selectedTrace, setSelectedTrace] = useState<ChainTrace | null>(null);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [verifyResult, setVerifyResult] = useState<{ intact: boolean; details: string[] } | null>(null);
  const [searchParams] = useSearchParams();

  // 扫描二维码入口：从 URL 参数自动展示对应溯源码详情
  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      const found = allTraces.find((t) => t.traceCode === code);
      if (found) {
        setSelectedTrace(found);
        setDetailDrawerOpen(true);
        setActiveTab('query');
      }
    }
  }, [searchParams]);

  const intactTraces = allTraces.filter((t) => t.integrity === 'intact').length;
  const tamperedTraces = allTraces.filter((t) => t.integrity === 'tampered').length;
  const pendingTasks = tasks.filter((t) => t.status === 'pending').length;

  // ---- Table Columns ----
  const traceColumns: ColumnsType<ChainTrace> = [
    {
      title: '溯源码', dataIndex: 'traceCode', key: 'traceCode', width: 200,
      render: (c: string) => (
        <span
          className="trace-code"
          onClick={() => { setSelectedTrace(allTraces.find((t) => t.traceCode === c) || null); setDetailDrawerOpen(true); }}
        >
          {c}
        </span>
      ),
    },
    {
      title: '批次号', dataIndex: 'batchNo', key: 'batchNo', width: 170,
      render: (n: string) => (
        <span style={{ fontFamily: '"JetBrains Mono", "JetBrains Mono", Menlo, Consolas, monospace', fontSize: 11, color: '#6c6a64' }}>
          {n}
        </span>
      ),
    },
    { title: '药材', dataIndex: 'herbName', key: 'herbName', width: 90 },
    { title: '规格', dataIndex: 'specification', key: 'specification', width: 90, ellipsis: true },
    { title: '种植基地', dataIndex: 'baseName', key: 'baseName', ellipsis: true },
    {
      title: '节点', key: 'progress', width: 120,
      render: (_: unknown, record: ChainTrace) => (
        <div>
          <div style={{ fontSize: 11, color: '#6c6a64', marginBottom: 4 }}>
            {record.onChainNodes} / {record.totalNodes} 节点
          </div>
          <Progress
            percent={Math.round((record.onChainNodes / record.totalNodes) * 100)}
            size="small"
            showInfo={false}
            strokeColor={record.onChainNodes === record.totalNodes ? CHART_COLORS.primary : CHART_COLORS.accent}
            trailColor="#efe9de"
          />
        </div>
      ),
    },
    {
      title: '完整度', dataIndex: 'integrity', key: 'integrity', width: 100,
      render: (i: TraceIntegrity) => <IntegrityTag integrity={i} />,
    },
    {
      title: '操作', key: 'action', width: 180,
      render: (_: unknown, record: ChainTrace) => (
        <Space size={4}>
          <Button type="link" size="small" icon={<NodeIndexOutlined />} className="trace-btn-link" onClick={() => { setSelectedTrace(record); setDetailDrawerOpen(true); }}>链路</Button>
          <Button type="link" size="small" icon={<SafetyOutlined />} className="trace-btn-link" onClick={() => { setSelectedTrace(record); setVerifyModalOpen(true); }}>校验</Button>
          <Button type="link" size="small" icon={<QrcodeOutlined />} className="trace-btn-link" onClick={() => message.success('二维码已生成，可下载打印')}>二维码</Button>
        </Space>
      ),
    },
  ];

  const taskColumns: ColumnsType<ChainTask> = [
    {
      title: '任务编号', dataIndex: 'taskNo', key: 'taskNo', width: 150,
      render: (n: string) => (
        <span style={{ fontFamily: '"JetBrains Mono", "Menlo", "Consolas", monospace', fontSize: 12, color: '#cc785c' }}>{n}</span>
      ),
    },
    { title: '溯源码', dataIndex: 'traceCode', key: 'traceCode', width: 180, render: (c: string) => (
      <span style={{ fontFamily: '"JetBrains Mono", "Menlo", "Consolas", monospace', fontSize: 11 }}>{c}</span>
    ) },
    { title: '药材', dataIndex: 'herbName', key: 'herbName', width: 90 },
    { title: '节点', dataIndex: 'nodeName', key: 'nodeName', width: 90 },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 100,
      render: (s: ChainTaskStatus) => {
        const colorMap: Record<ChainTaskStatus, { bg: string; text: string }> = {
          on_chain: { bg: 'rgba(93,184,114,0.1)', text: '#5db872' },
          pending: { bg: '#faf9f5', text: '#6c6a64' },
          confirming: { bg: 'rgba(204,120,92,0.1)', text: '#cc785c' },
          failed: { bg: 'rgba(198,69,69,0.1)', text: '#c64545' },
        };
        const c = colorMap[s] ?? { bg: '#faf9f5', text: '#6c6a64' };
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: 11, fontWeight: 600, borderRadius: 9999, padding: '2px 10px', background: c.bg, color: c.text }}>
            {CHAIN_TASK_STATUS_MAP[s]}
          </span>
        );
      },
    },
    { title: '操作人', dataIndex: 'operator', key: 'operator', width: 80 },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 140 },
    {
      title: '操作', key: 'action', width: 120,
      render: (_: unknown, record: ChainTask) => (
        <Space size={4}>
          {record.status === 'pending' && (
            <Popconfirm title="确认执行上链？" onConfirm={() => {
              setTasks((prev) => prev.map((t) => t.id === record.id ? { ...t, status: 'confirming' as const } : t));
              setTimeout(() => {
                setTasks((prev) => prev.map((t) => t.id === record.id ? { ...t, status: 'on_chain' as const, onChainAt: dayjs().format('YYYY-MM-DD HH:mm:ss') } : t));
                message.success('上链成功');
              }, 1500);
            }}>
              <Button type="link" size="small" icon={<SyncOutlined spin />} className="trace-btn-link" style={{ color: '#5db872' }}>上链</Button>
            </Popconfirm>
          )}
          {record.status === 'failed' && (
            <Button type="link" size="small" icon={<SyncOutlined />} className="trace-btn-link" style={{ color: '#e8a55a' }} onClick={() => message.info('请检查数据后重试')}>重试</Button>
          )}
          {record.status === 'on_chain' && <span style={{ fontSize: 11, color: '#5db872' }}>已完成</span>}
          {record.status === 'confirming' && <span style={{ fontSize: 11, color: '#cc785c' }}>确认中...</span>}
        </Space>
      ),
    },
  ];

  // ---- ECharts Options ----
  const chainTrendOption: EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross' }, backgroundColor: '#ffffff', borderColor: '#e6dfd8', borderWidth: 1, textStyle: { color: '#141413', fontSize: 12, fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' } },
    legend: { data: ['上链批次', '查询次数'], bottom: 0, textStyle: { fontSize: 11, color: '#6c6a64', fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' }, icon: 'circle', itemWidth: 7, itemHeight: 7 },
    grid: { left: 48, right: 24, top: 8, bottom: 40 },
    xAxis: { type: 'category', data: chainStats.monthlyTrend.map((d) => d.month.slice(5) + '月'), axisLine: { lineStyle: { color: '#e6dfd8' } }, axisLabel: { fontSize: 10, color: '#6c6a64', fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' }, axisTick: { show: false } },
    yAxis: [
      { type: 'value', name: '批次', axisLine: { show: false }, axisTick: { show: false }, splitLine: { lineStyle: { color: '#ebe6df' } }, axisLabel: { fontSize: 10, color: '#8e8b82', fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' } },
      { type: 'value', name: '查询', axisLine: { show: false }, axisTick: { show: false }, splitLine: { show: false }, axisLabel: { fontSize: 10, color: '#8e8b82', fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' } },
    ],
    series: [
      { name: '上链批次', type: 'bar', data: chainStats.monthlyTrend.map((d) => d.onChain), itemStyle: { color: CHART_COLORS.primary, borderRadius: [4, 4, 0, 0] }, barWidth: '40%' },
      { name: '查询次数', type: 'line', yAxisIndex: 1, data: chainStats.monthlyTrend.map((d) => d.queries), smooth: true, symbol: 'circle', symbolSize: 5, lineStyle: { color: CHART_COLORS.teal, width: 2 }, itemStyle: { color: CHART_COLORS.teal }, areaStyle: { color: 'rgba(93,184,166,0.06)' } },
    ],
  };

  const nodeRateOption: EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' as const, axisPointer: { type: 'shadow' as const }, backgroundColor: '#ffffff', borderColor: '#e6dfd8', borderWidth: 1, textStyle: { color: '#141413', fontSize: 11, fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' } },
    grid: { left: 90, right: 60, top: 8, bottom: 8 },
    xAxis: { type: 'value' as const, max: 100, axisLine: { show: false }, axisTick: { show: false }, splitLine: { lineStyle: { color: '#ebe6df' } }, axisLabel: { fontSize: 10, color: '#6c6a64', fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif', formatter: (v: number) => `${v}%` } },
    yAxis: { type: 'category' as const, data: chainStats.nodeStats.map((n) => n.name).reverse(), axisLine: { show: false }, axisTick: { show: false }, axisLabel: { fontSize: 11, color: '#6c6a64', fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' } },
    series: [{
      type: 'bar' as const,
      data: chainStats.nodeStats.map((n, i) => ({
        value: n.rate,
        itemStyle: { color: CHART_COLORS.gradient[i % CHART_COLORS.gradient.length], borderRadius: [0, 4, 4, 0] },
      })).reverse(),
      barWidth: '50%',
      label: { show: true, position: 'right', formatter: '{c}%', fontSize: 10, color: '#8e8b82', fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' },
    }],
  };

  const herbPieOption: EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item', backgroundColor: '#ffffff', borderColor: '#e6dfd8', borderWidth: 1, textStyle: { color: '#141413', fontSize: 12, fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' } },
    legend: { orient: 'vertical', right: 4, top: 'center', textStyle: { fontSize: 10, color: '#6c6a64', fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' }, icon: 'circle', itemWidth: 6, itemHeight: 6, itemGap: 6 },
    series: [{
      type: 'pie', radius: ['36%', '66%'], center: ['34%', '50%'],
      itemStyle: { borderRadius: 6, borderColor: '#faf9f5', borderWidth: 2 },
      label: { show: false },
      emphasis: { label: { show: true, fontSize: 11, formatter: (p: unknown) => { const pp = p as { name: string; percent: number }; return `${pp.name}\n${pp.percent.toFixed(0)}%`; }, color: '#141413', fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' } },
      data: chainStats.herbStats.map((h, i) => ({ value: h.count, name: h.name, itemStyle: { color: CHART_COLORS.gradient[i % CHART_COLORS.gradient.length] } })),
    }],
  };

  const townBarOption: EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' as const, axisPointer: { type: 'shadow' as const }, backgroundColor: '#ffffff', borderColor: '#e6dfd8', borderWidth: 1, textStyle: { color: '#141413', fontSize: 11, fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' } },
    grid: { left: 56, right: 16, top: 8, bottom: 28 },
    xAxis: { type: 'category' as const, data: chainStats.townStats.map((t) => t.town), axisLine: { lineStyle: { color: '#e6dfd8' } }, axisLabel: { fontSize: 10, color: '#6c6a64', fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif', rotate: 0 }, axisTick: { show: false } },
    yAxis: { type: 'value' as const, axisLine: { show: false }, axisTick: { show: false }, splitLine: { lineStyle: { color: '#ebe6df' } }, axisLabel: { fontSize: 10, color: '#8e8b82', fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' } },
    series: [{ type: 'bar' as const, data: chainStats.townStats.map((t, i) => ({ value: t.count, itemStyle: { color: CHART_COLORS.gradient[i % CHART_COLORS.gradient.length], borderRadius: [4, 4, 0, 0] } })), barWidth: '55%' }],
  };

  const blockGrowthOption: EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#ffffff', borderColor: '#e6dfd8', borderWidth: 1, textStyle: { color: '#141413', fontSize: 11, fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' } },
    grid: { left: 48, right: 16, top: 8, bottom: 28 },
    xAxis: { type: 'category', data: chainStats.monthlyTrend.map(m => m.month.slice(5) + '月'), axisLine: { lineStyle: { color: '#e6dfd8' } }, axisLabel: { fontSize: 10, color: '#6c6a64', fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' }, axisTick: { show: false } },
    yAxis: { type: 'value', axisLine: { show: false }, axisTick: { show: false }, splitLine: { lineStyle: { color: '#ebe6df' } }, axisLabel: { fontSize: 10, color: '#8e8b82', fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' } },
    series: [{ type: 'line', data: chainStats.monthlyTrend.map((_, i) => 1000 + chainStats.monthlyTrend.slice(0, i + 1).reduce((s, m) => s + m.onChain * 5, 0)), smooth: true, symbol: 'circle', symbolSize: 4, lineStyle: { color: CHART_COLORS.teal, width: 2 }, itemStyle: { color: CHART_COLORS.teal }, areaStyle: { color: 'rgba(93,184,166,0.06)' } }],
  };

  // ---- Verify Handler ----
  const handleVerify = () => {
    if (!selectedTrace) return;
    const details: string[] = [];
    const nodes = [selectedTrace.plantingNode, selectedTrace.harvestNode, selectedTrace.inspectionNode, selectedTrace.processingNode, selectedTrace.storageNode, selectedTrace.salesNode].filter(Boolean) as ChainNode[];
    nodes.forEach((node) => {
      const recomputed = mockHash(JSON.stringify(node.data), Number(node.id) * 31);
      const match = recomputed === node.dataHash;
      details.push(`${NODE_TYPE_LABEL[node.nodeType]}节点：${match ? '哈希匹配，数据完整' : '哈希不匹配，数据可能已被篡改'}`);
    });
    const intact = details.every((d) => d.includes('哈希匹配'));
    setVerifyResult({ intact, details });
    message[intact ? 'success' : 'error'](intact ? '校验通过：数据完整，未被篡改' : '校验失败：发现数据篡改行为，请立即处理');
  };

  const filteredTraces = allTraces.filter((t) =>
    !searchText || t.traceCode.includes(searchText) || t.batchNo.includes(searchText) || t.baseName.includes(searchText)
  );

  // ============================================================
  // Tab Content Renderers
  // ============================================================
  const renderQueryTab = () => (
    <>
      <div className="trace-card">
        <div className="trace-card-body">
          <Row gutter={[12, 12]} align="middle">
            <Col xs={24} md={14}>
              <Input
                className="trace-search-input"
                prefix={<SearchOutlined style={{ color: '#8e8b82' }} />}
                placeholder="输入溯源码 / 批次号 / 基地名称搜索"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                size="large"
              />
            </Col>
            <Col xs={24} md={10}>
              <Space>
                <Button icon={<QrcodeOutlined />} className="trace-btn-ghost" onClick={() => message.info('请使用移动端扫码查询')}>扫码查询</Button>
                <Button icon={<ReloadOutlined />} className="trace-btn-ghost">刷新数据</Button>
              </Space>
            </Col>
          </Row>
        </div>
      </div>
      <div className="trace-card">
        <Table
          className="trace-table"
          columns={traceColumns}
          dataSource={filteredTraces}
          rowKey="id"
          pagination={{ pageSize: 8, showTotal: (t) => `共 ${t} 条`, showSizeChanger: false }}
          size="middle"
          scroll={{ x: 'max-content' }}
        />
      </div>
    </>
  );

  const renderChainTab = () => (
    <>
      <div className="trace-kpi-inline">
        <div className="trace-kpi-card">
          <div className="trace-kpi-accent" style={{ background: '#5db8a6' }} />
          <div className="trace-kpi-icon" style={{ background: 'rgba(93,184,166,0.1)', color: '#5db8a6' }}>
            <NodeIndexOutlined />
          </div>
          <div className="trace-kpi-text">
            <div className="trace-kpi-label">区块高度</div>
            <div className="trace-kpi-value">{chainStats.blockHeight}</div>
          </div>
        </div>
        <div className="trace-kpi-card">
          <div className="trace-kpi-accent" style={{ background: '#5db872' }} />
          <div className="trace-kpi-icon" style={{ background: 'rgba(93,184,114,0.1)', color: '#5db872' }}>
            <DatabaseOutlined />
          </div>
          <div className="trace-kpi-text">
            <div className="trace-kpi-label">上链总批次</div>
            <div className="trace-kpi-value">{chainStats.totalBatches}<span>批次</span></div>
          </div>
        </div>
        <div className="trace-kpi-card">
          <div className="trace-kpi-accent" style={{ background: '#5db872' }} />
          <div className="trace-kpi-icon" style={{ background: 'rgba(93,184,114,0.1)', color: '#5db872' }}>
            <SafetyOutlined />
          </div>
          <div className="trace-kpi-text">
            <div className="trace-kpi-label">数据完整率</div>
            <div className="trace-kpi-value">{chainStats.integrityRate}<span>%</span></div>
          </div>
        </div>
        <div className="trace-kpi-card">
          <div className="trace-kpi-accent" style={{ background: '#e8a55a' }} />
          <div className="trace-kpi-icon" style={{ background: 'rgba(232,165,90,0.1)', color: '#e8a55a' }}>
            <BarChartOutlined />
          </div>
          <div className="trace-kpi-text">
            <div className="trace-kpi-label">今日查询</div>
            <div className="trace-kpi-value">{chainStats.dailyQueries[chainStats.dailyQueries.length - 1]}<span>次</span></div>
          </div>
        </div>
      </div>
      <Row gutter={[12, 12]}>
        <Col xs={24} xl={14}>
          <ChartCard title="区块增长趋势" dotColor="#5db8a6">
            <ReactECharts option={blockGrowthOption} style={{ height: 220 }} />
          </ChartCard>
        </Col>
        <Col xs={24} xl={10}>
          <ChartCard title="各节点上链率" dotColor="#5db8a6">
            <ReactECharts option={nodeRateOption} style={{ height: 220 }} />
          </ChartCard>
        </Col>
      </Row>
    </>
  );

  const renderManagementTab = () => {
    const failedCount = tasks.filter((t) => t.status === 'failed').length;
    const onChainCount = tasks.filter((t) => t.status === 'on_chain').length;
    const confirmingCount = tasks.filter((t) => t.status === 'confirming').length;
    return (
    <>
      <div className="trace-kpi-inline">
        <div className="trace-kpi-card">
          <div className="trace-kpi-accent" style={{ background: '#e8a55a' }} />
          <div className="trace-kpi-icon" style={{ background: 'rgba(232,165,90,0.1)', color: '#e8a55a' }}>
            <ClockCircleOutlined />
          </div>
          <div className="trace-kpi-text">
            <div className="trace-kpi-label">待上链</div>
            <div className="trace-kpi-value" style={{ color: '#e8a55a' }}>{pendingTasks}<span>条</span></div>
          </div>
        </div>
        <div className="trace-kpi-card">
          <div className="trace-kpi-accent" style={{ background: '#cc785c' }} />
          <div className="trace-kpi-icon" style={{ background: 'rgba(204,120,92,0.1)', color: '#cc785c' }}>
            <SyncOutlined />
          </div>
          <div className="trace-kpi-text">
            <div className="trace-kpi-label">确认中</div>
            <div className="trace-kpi-value">{confirmingCount}<span>条</span></div>
          </div>
        </div>
        <div className="trace-kpi-card">
          <div className="trace-kpi-accent" style={{ background: '#5db872' }} />
          <div className="trace-kpi-icon" style={{ background: 'rgba(93,184,114,0.1)', color: '#5db872' }}>
            <CheckCircleOutlined />
          </div>
          <div className="trace-kpi-text">
            <div className="trace-kpi-label">已上链</div>
            <div className="trace-kpi-value" style={{ color: '#5db872' }}>{onChainCount}<span>条</span></div>
          </div>
        </div>
        <div className="trace-kpi-card">
          <div className="trace-kpi-accent" style={{ background: failedCount > 0 ? '#c64545' : '#8e8b82' }} />
          <div className="trace-kpi-icon" style={{ background: failedCount > 0 ? 'rgba(198,69,69,0.1)' : 'rgba(142,139,130,0.08)', color: failedCount > 0 ? '#c64545' : '#8e8b82' }}>
            <CloseCircleOutlined />
          </div>
          <div className="trace-kpi-text">
            <div className="trace-kpi-label">失败</div>
            <div className="trace-kpi-value" style={{ color: failedCount > 0 ? '#c64545' : '#141413' }}>{failedCount}<span>条</span></div>
          </div>
        </div>
      </div>
      <div className="trace-card">
        <Table className="trace-table" columns={taskColumns} dataSource={tasks} rowKey="id" pagination={{ pageSize: 8, showTotal: (t) => `共 ${t} 条`, showSizeChanger: false }} size="middle" scroll={{ x: 'max-content' }} />
      </div>
    </>
  );
  };

  const renderVerifyTab = () => (
    <>
      <div className="trace-kpi-inline">
        <div className="trace-kpi-card">
          <div className="trace-kpi-accent" style={{ background: '#5db872' }} />
          <div className="trace-kpi-icon" style={{ background: 'rgba(93,184,114,0.1)', color: '#5db872' }}>
            <CheckCircleOutlined />
          </div>
          <div className="trace-kpi-text">
            <div className="trace-kpi-label">可信批次</div>
            <div className="trace-kpi-value" style={{ color: '#5db872' }}>{intactTraces}<span>批次</span></div>
          </div>
        </div>
        <div className="trace-kpi-card">
          <div className="trace-kpi-accent" style={{ background: tamperedTraces > 0 ? '#c64545' : '#8e8b82' }} />
          <div className="trace-kpi-icon" style={{ background: tamperedTraces > 0 ? 'rgba(198,69,69,0.1)' : 'rgba(142,139,130,0.08)', color: tamperedTraces > 0 ? '#c64545' : '#8e8b82' }}>
            <WarningOutlined />
          </div>
          <div className="trace-kpi-text">
            <div className="trace-kpi-label">异常批次</div>
            <div className="trace-kpi-value" style={{ color: tamperedTraces > 0 ? '#c64545' : '#141413' }}>{tamperedTraces}<span>批次</span></div>
          </div>
        </div>
        <div className="trace-kpi-card">
          <div className="trace-kpi-accent" style={{ background: '#5db8a6' }} />
          <div className="trace-kpi-icon" style={{ background: 'rgba(93,184,166,0.1)', color: '#5db8a6' }}>
            <DatabaseOutlined />
          </div>
          <div className="trace-kpi-text">
            <div className="trace-kpi-label">哈希总数</div>
            <div className="trace-kpi-value">{allTraces.reduce((s, t) => s + t.onChainNodes, 0)}<span>个</span></div>
          </div>
        </div>
        <div className="trace-kpi-card">
          <div className="trace-kpi-accent" style={{ background: '#cc785c' }} />
          <div className="trace-kpi-icon" style={{ background: 'rgba(204,120,92,0.1)', color: '#cc785c' }}>
            <SafetyOutlined />
          </div>
          <div className="trace-kpi-text">
            <div className="trace-kpi-label">累计校验</div>
            <div className="trace-kpi-value">2,840<span>次</span></div>
          </div>
        </div>
      </div>
      <Row gutter={[12, 12]}>
        <Col xs={24} xl={16}>
          <ChartCard title="选择批次进行哈希校验" dotColor="#5db872">
            <Table
              dataSource={allTraces}
              rowKey="id"
              pagination={false}
              size="small"
              className="trace-table"
              columns={[
                { title: '溯源码', dataIndex: 'traceCode', key: 'traceCode', render: (c: string) => <span style={{ fontFamily: '"JetBrains Mono", "Menlo", "Consolas", monospace', fontSize: 11, color: '#cc785c' }}>{c}</span> },
                { title: '批次', dataIndex: 'batchNo', key: 'batchNo' },
                { title: '完整度', dataIndex: 'onChainNodes', key: 'onChainNodes', render: (n: number, r: ChainTrace) => `${n}/${r.totalNodes} 节点` },
                { title: '状态', dataIndex: 'integrity', key: 'integrity', render: (i: TraceIntegrity) => <IntegrityTag integrity={i} /> },
                { title: '操作', key: 'action', width: 80, render: (_: unknown, record: ChainTrace) => (
                  <Button type="primary" size="small" icon={<SafetyOutlined />} className="trace-btn-primary" onClick={() => { setSelectedTrace(record); setVerifyModalOpen(true); }}>校验</Button>
                ) },
              ]}
              scroll={{ x: 'max-content' }}
            />
          </ChartCard>
        </Col>
        <Col xs={24} xl={8}>
          <ChartCard title="哈希算法说明" dotColor="#5db8a6">
            <div className="trace-algo-card">
              <div className="trace-algo-item"><strong>哈希算法：</strong>SHA-256</div>
              <div className="trace-algo-item"><strong>链式结构：</strong>每个节点存储前一节点的哈希值，形成不可篡改的链式结构</div>
              <div className="trace-algo-item"><strong>完整性校验：</strong>重新计算数据哈希，与链上存储的哈希比对</div>
              <div className="trace-algo-item"><strong>篡改检测：</strong>哈希不匹配时立即告警</div>
              <div className="trace-algo-demo">
                <div className="trace-algo-demo-label">示例哈希值</div>
                <div className="trace-algo-demo-value">{mockHash('demo-data', 1).slice(0, 32)}...</div>
              </div>
            </div>
          </ChartCard>
        </Col>
      </Row>
    </>
  );

  const renderStatsTab = () => (
    <>
      <div className="trace-kpi-inline">
        <div className="trace-kpi-card">
          <div className="trace-kpi-accent" style={{ background: '#5db872' }} />
          <div className="trace-kpi-icon" style={{ background: 'rgba(93,184,114,0.1)', color: '#5db872' }}>
            <DatabaseOutlined />
          </div>
          <div className="trace-kpi-text">
            <div className="trace-kpi-label">累计上链批次</div>
            <div className="trace-kpi-value">{chainStats.totalBatches}<span>批次</span></div>
          </div>
        </div>
        <div className="trace-kpi-card">
          <div className="trace-kpi-accent" style={{ background: '#cc785c' }} />
          <div className="trace-kpi-icon" style={{ background: 'rgba(204,120,92,0.1)', color: '#cc785c' }}>
            <RiseOutlined />
          </div>
          <div className="trace-kpi-text">
            <div className="trace-kpi-label">本月新增</div>
            <div className="trace-kpi-value">{chainStats.monthlyNew}<span>批次</span></div>
          </div>
        </div>
        <div className="trace-kpi-card">
          <div className="trace-kpi-accent" style={{ background: '#5db8a6' }} />
          <div className="trace-kpi-icon" style={{ background: 'rgba(93,184,166,0.1)', color: '#5db8a6' }}>
            <NodeIndexOutlined />
          </div>
          <div className="trace-kpi-text">
            <div className="trace-kpi-label">溯源覆盖率</div>
            <div className="trace-kpi-value">{chainStats.coverageRate}<span>%</span></div>
          </div>
        </div>
        <div className="trace-kpi-card">
          <div className="trace-kpi-accent" style={{ background: '#e8a55a' }} />
          <div className="trace-kpi-icon" style={{ background: 'rgba(232,165,90,0.1)', color: '#e8a55a' }}>
            <BarChartOutlined />
          </div>
          <div className="trace-kpi-text">
            <div className="trace-kpi-label">累计查询</div>
            <div className="trace-kpi-value">{chainStats.totalQueries}<span>次</span></div>
          </div>
        </div>
      </div>
      <Row gutter={[12, 12]}>
        <Col xs={24} xl={12}>
          <ChartCard title="月度上链与查询趋势" dotColor="#cc785c">
            <ReactECharts option={chainTrendOption} style={{ height: 240 }} />
          </ChartCard>
        </Col>
        <Col xs={24} xl={12}>
          <ChartCard title="品种分布" dotColor="#5db8a6">
            <ReactECharts option={herbPieOption} style={{ height: 240 }} />
          </ChartCard>
        </Col>
        <Col xs={24} xl={12}>
          <ChartCard title="各乡镇上链批次" dotColor="#e8a55a">
            <ReactECharts option={townBarOption} style={{ height: 220 }} />
          </ChartCard>
        </Col>
        <Col xs={24} xl={12}>
          <ChartCard title="各节点上链率" dotColor="#5db872">
            <ReactECharts option={nodeRateOption} style={{ height: 220 }} />
          </ChartCard>
        </Col>
      </Row>
    </>
  );

  const tabItems = [
    { key: 'query', label: <span><SearchOutlined /> 溯源查询</span>, children: renderQueryTab() },
    { key: 'chain', label: <span><NodeIndexOutlined /> 区块态势</span>, children: renderChainTab() },
    {
      key: 'management',
      label: (
        <span>
          <LinkOutlined /> 上链管理
          {pendingTasks > 0 && (
            <span style={{ marginLeft: 6, display: 'inline-flex', alignItems: 'center', fontSize: 10, fontWeight: 600, borderRadius: 9999, padding: '2px 8px', background: 'rgba(232,165,90,0.1)', color: '#e8a55a' }}>
              {pendingTasks} 待处理
            </span>
          )}
        </span>
      ),
      children: renderManagementTab(),
    },
    { key: 'verify', label: <span><SafetyOutlined /> 数据校验</span>, children: renderVerifyTab() },
    { key: 'stats', label: <span><BarChartOutlined /> 统计分析</span>, children: renderStatsTab() },
  ];

  // ============================================================
  // Render
  // ============================================================
  return (
    <div className="trace-page">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* ── Page Header ── */}
      <div className="trace-header">
        <div className="trace-header-inner">
          <div className="trace-header-left">
            <div className="trace-header-eyebrow">7S 产地仓</div>
            <h1 className="trace-header-title">区块链溯源管理</h1>
          </div>
          <div className="trace-header-desc">基于区块链技术的中药材全流程溯源追踪，数据不可篡改，来源真实可信</div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="trace-body">
        <div className="trace-body-inner">
          <div className="trace-tabs">
            <Tabs activeKey={activeTab} onChange={(k) => setActiveTab(k)} items={tabItems} />
          </div>
        </div>
      </div>

      {/* ── Detail Drawer ── */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>溯源链路详情</span>
            {selectedTrace && <IntegrityTag integrity={selectedTrace.integrity} />}
          </div>
        }
        placement="right" width={580}
        open={detailDrawerOpen}
        onClose={() => setDetailDrawerOpen(false)}
        className="trace-drawer"
        styles={{ body: { padding: '20px 24px' } }}
      >
        {selectedTrace && (
          <>
            <Descriptions className="trace-descriptions" column={2} bordered size="small" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="溯源码" span={2}>
                <span style={{ fontFamily: '"JetBrains Mono", "Menlo", "Consolas", monospace', color: '#cc785c', fontWeight: 700, fontSize: 13 }}>
                  {selectedTrace.traceCode}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="批次号">{selectedTrace.batchNo}</Descriptions.Item>
              <Descriptions.Item label="药材">{selectedTrace.herbName}</Descriptions.Item>
              <Descriptions.Item label="规格">{selectedTrace.specification}</Descriptions.Item>
              <Descriptions.Item label="种植基地" span={2}>{selectedTrace.baseName}</Descriptions.Item>
              <Descriptions.Item label="种植日期">{selectedTrace.plantingDate}</Descriptions.Item>
              <Descriptions.Item label="采收日期">{selectedTrace.harvestDate}</Descriptions.Item>
              <Descriptions.Item label="链路完整度">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Progress percent={Math.round((selectedTrace.onChainNodes / selectedTrace.totalNodes) * 100)} size="small" strokeColor={selectedTrace.onChainNodes === selectedTrace.totalNodes ? CHART_COLORS.primary : CHART_COLORS.accent} trailColor="#efe9de" style={{ width: 100 }} />
                  <span style={{ fontSize: 11, color: '#8e8b82' }}>{selectedTrace.onChainNodes}/{selectedTrace.totalNodes}</span>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="完整性"><IntegrityTag integrity={selectedTrace.integrity} /></Descriptions.Item>
            </Descriptions>

            <div className="trace-qr-card">
              <QRCode value={`${import.meta.env.VITE_PUBLIC_URL || ''}/app/traceability?code=${selectedTrace.traceCode}`} size={80} />
              <div>
                <div className="trace-qr-card-title">扫码查询</div>
                <div className="trace-qr-card-desc">扫描上方二维码，即可查看此批次药材的完整溯源信息</div>
                <Button type="link" size="small" icon={<QrcodeOutlined />} style={{ padding: 0, marginTop: 6, color: '#cc785c', fontSize: 13 }} onClick={() => message.success('二维码已下载')}>下载二维码</Button>
              </div>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            <div className="trace-hash-section">
              <div className="trace-hash-label">哈希链（Chain Hash）</div>
              {selectedTrace.plantingNode && (
                <div className="trace-hash-genesis">创世哈希：{selectedTrace.plantingNode.dataHash}</div>
              )}
              {selectedTrace.plantingNode && selectedTrace.harvestNode && (
                <div className="trace-hash-ref">节点2引用：← {selectedTrace.harvestNode.prevHash.slice(0, 16)}...</div>
              )}
            </div>

            {renderChainTimeline(selectedTrace)}
          </>
        )}
      </Drawer>

      {/* ── Verify Modal ── */}
      <Modal
        title={<span><SafetyOutlined style={{ color: '#cc785c' }} /> 哈希完整性校验 — {selectedTrace?.traceCode}</span>}
        open={verifyModalOpen}
        onOk={handleVerify}
        onCancel={() => { setVerifyModalOpen(false); setVerifyResult(null); }}
        width={600}
        okText="开始校验"
        cancelText="关闭"
        okButtonProps={{ icon: <SafetyOutlined />, className: 'trace-btn-primary' }}
        className="trace-modal"
      >
        {verifyResult ? (
          <div>
            <Alert
              type={verifyResult.intact ? 'success' : 'error'}
              icon={verifyResult.intact ? <CheckCircleOutlined /> : <WarningOutlined />}
              message={verifyResult.intact ? '校验通过：数据完整，未被篡改' : '校验失败：发现数据篡改行为，请立即处理！'}
              className="trace-verify-alert"
              style={{ marginBottom: 16, borderRadius: 12 }}
            />
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, color: '#141413' }}>节点哈希校验详情：</div>
            {verifyResult.details.map((detail, i) => (
              <div key={i} className={`trace-verify-detail ${detail.includes('哈希匹配') ? 'trace-verify-detail-ok' : 'trace-verify-detail-err'}`}>
                {detail}
              </div>
            ))}
            <Divider style={{ margin: '16px 0' }} />
            <div className="trace-verify-meta">
              <p style={{ margin: '4px 0' }}>校验时间：{dayjs().format('YYYY-MM-DD HH:mm:ss')}</p>
              <p style={{ margin: '4px 0' }}>校验算法：SHA-256</p>
              <p style={{ margin: '4px 0' }}>校验依据：链式哈希结构 + 数据指纹</p>
            </div>
          </div>
        ) : (
          <div>
            <p style={{ fontSize: 14, color: '#374151', marginBottom: 16 }}>
              将对 <strong style={{ color: '#cc785c' }}>{selectedTrace?.traceCode}</strong> 的所有上链节点进行 SHA-256 哈希完整性校验。
            </p>
            <Descriptions className="trace-descriptions" column={1} bordered size="small">
              <Descriptions.Item label="校验内容">{selectedTrace?.onChainNodes || 0} 个已上链节点的哈希值与原始数据比对</Descriptions.Item>
              <Descriptions.Item label="校验范围">节点1（田间种植）→ 节点{selectedTrace?.onChainNodes || 0}（终端销售）</Descriptions.Item>
              <Descriptions.Item label="预期结果">
                {selectedTrace?.integrity === 'intact' ? '预期：通过' : selectedTrace?.integrity === 'tampered' ? '预期：失败（检测到篡改）' : '预期：部分通过'}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Traceability;
