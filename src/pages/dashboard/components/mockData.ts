/**
 * 产业大脑数据平台 - 共享 Mock 数据
 * 以赤水金钗石斛产业链为背景
 */

// ============================================================
// 全局色彩主题 — Claude Design System
// ============================================================
export const CHART_COLORS = {
  primary: '#cc785c',    // Coral — Claude signature
  secondary: '#5db872',  // Success green
  accent: '#e8a55a',     // Amber
  purple: '#8e8b82',     // Muted (warm gray)
  pink: '#c64545',       // Error red
  orange: '#d4a017',     // Warning amber
  red: '#c64545',        // Error red
  green: '#5db872',      // Success green
  blue: '#5db8a6',       // Teal
  teal: '#5db8a6',       // Teal
  indigo: '#5db8a6',     // Teal variant
  amber: '#e8a55a',      // Amber (alias)
  gradient: ['#cc785c', '#5db8a6', '#e8a55a', '#5db872', '#c64545'],
} as const;

// ============================================================
// 1. KPI 数据
// ============================================================
export interface KpiData {
  title: string;
  value: number;
  unit: string;
  icon: string;
  trend: number;
  trendUp: boolean;
  color: string;
  bgColor: string;
}

export const kpiData: KpiData[] = [
  {
    title: '累计入驻农户/企业',
    value: 3847,
    unit: '户',
    icon: 'team',
    trend: 12.5,
    trendUp: true,
    color: '#cc785c',
    bgColor: 'rgba(204, 120, 92, 0.08)',
  },
  {
    title: '总种植面积',
    value: 12860,
    unit: '亩',
    icon: 'cluster',
    trend: 8.3,
    trendUp: true,
    color: '#5db872',
    bgColor: 'rgba(93, 184, 114, 0.08)',
  },
  {
    title: '本年累计交易额',
    value: 2846.8,
    unit: '万元',
    icon: 'money',
    trend: 15.7,
    trendUp: true,
    color: '#e8a55a',
    bgColor: 'rgba(232, 165, 90, 0.08)',
  },
  {
    title: '产地仓总库存',
    value: 486.3,
    unit: '吨',
    icon: 'database',
    trend: -3.2,
    trendUp: false,
    color: '#5db8a6',
    bgColor: 'rgba(93, 184, 166, 0.08)',
  },
];

// ============================================================
// 2. 产业资源一张图 - 赤水市地理分布数据
// ============================================================
export interface ResourcePoint {
  name: string;        // 名称
  type: 'base' | 'factory' | 'warehouse'; // 类型：基地/加工厂/产地仓
  value: number;      // 规模/产能
  coord: [number, number]; // 经纬度 [lng, lat]
  description: string;
}

export const resourcePoints: ResourcePoint[] = [
  // 官渡镇
  { name: '官渡镇石斛林下经济示范园', type: 'base', value: 3200, coord: [105.72, 28.57], description: '核心种植区，三年生金钗石斛' },
  { name: '官渡镇石斛初加工厂', type: 'factory', value: 800, coord: [105.73, 28.56], description: '日处理鲜条 2 吨' },
  { name: '赤水金钗石斛7S产地仓', type: 'warehouse', value: 1200, coord: [105.74, 28.58], description: '库容 500 吨，冷链标准' },
  // 长期镇
  { name: '长期镇石斛产业园', type: 'base', value: 4500, coord: [105.68, 28.62], description: '省级现代农业产业园' },
  { name: '长期镇石斛深加工基地', type: 'factory', value: 1500, coord: [105.69, 28.63], description: '枫斗、石斛粉、原浆生产线' },
  { name: '赤水金钗石斛7S产地仓', type: 'warehouse', value: 2000, coord: [105.70, 28.61], description: '省级示范产地仓' },
  // 大同镇
  { name: '大同镇石斛合作社种植基地', type: 'base', value: 2100, coord: [105.65, 28.54], description: '合作社统一种植管理' },
  { name: '大同镇石斛烘干中心', type: 'factory', value: 600, coord: [105.66, 28.53], description: '热风循环烘干，日产干条 500kg' },
  // 旺隆镇
  { name: '旺隆镇石斛种植园', type: 'base', value: 1800, coord: [105.75, 28.60], description: '标准化示范种植基地' },
  { name: '旺隆镇石斛加工中心', type: 'factory', value: 450, coord: [105.76, 28.59], description: '初加工车间' },
  // 丙安镇
  { name: '丙安镇石斛示范园', type: 'base', value: 950, coord: [105.78, 28.52], description: '林下仿野生种植基地' },
  { name: '丙安镇石斛体验工坊', type: 'factory', value: 200, coord: [105.79, 28.51], description: 'DIY 枫斗制作体验' },
];

// ============================================================
// 3. 生产服务一张图 - 近12个月双轴趋势
// ============================================================
export interface ProductionMonth {
  month: string;
  plannedArea: number;   // 计划种植面积（亩）
  actualOutput: number;  // 实际产出鲜条量（吨）
}

export const productionData: ProductionMonth[] = [
  { month: '2025-05', plannedArea: 1800, actualOutput: 0 },
  { month: '2025-06', plannedArea: 2200, actualOutput: 320 },
  { month: '2025-07', plannedArea: 2600, actualOutput: 480 },
  { month: '2025-08', plannedArea: 2800, actualOutput: 620 },
  { month: '2025-09', plannedArea: 3000, actualOutput: 850 },
  { month: '2025-10', plannedArea: 2800, actualOutput: 780 },
  { month: '2025-11', plannedArea: 2400, actualOutput: 560 },
  { month: '2025-12', plannedArea: 2000, actualOutput: 380 },
  { month: '2026-01', plannedArea: 1600, actualOutput: 180 },
  { month: '2026-02', plannedArea: 2000, actualOutput: 240 },
  { month: '2026-03', plannedArea: 2600, actualOutput: 420 },
  { month: '2026-04', plannedArea: 3000, actualOutput: 580 },
];

// ============================================================
// 4. 质量控制一张图 - 多批次雷达指标
// ============================================================
export interface QualityBatch {
  batchNo: string;
  batchName: string;
  dendrobine: number;   // 石斛碱含量 (%)
  moisture: number;     // 水分 (%)
  heavyMetalPb: number; // 重金属-铅 (mg/kg)
  heavyMetalCd: number; // 重金属-镉 (mg/kg)
  pesticide: number;   // 农残达标率 (%)
  totalScore: number;  // 综合评分
}

export const qualityData: QualityBatch[] = [
  {
    batchNo: 'GZ-QC-202603-001',
    batchName: '官渡镇 2026 年第三批次',
    dendrobine: 92,
    moisture: 88,
    heavyMetalPb: 95,
    heavyMetalCd: 93,
    pesticide: 90,
    totalScore: 91.6,
  },
  {
    batchNo: 'GZ-QC-202603-002',
    batchName: '长期镇 2026 年第三批次',
    dendrobine: 96,
    moisture: 91,
    heavyMetalPb: 98,
    heavyMetalCd: 96,
    pesticide: 94,
    totalScore: 95.0,
  },
  {
    batchNo: 'GZ-QC-202603-003',
    batchName: '大同镇 2026 年第三批次',
    dendrobine: 89,
    moisture: 85,
    heavyMetalPb: 92,
    heavyMetalCd: 90,
    pesticide: 88,
    totalScore: 88.8,
  },
  {
    batchNo: 'GZ-QC-202604-001',
    batchName: '官渡镇 2026 年第四批次',
    dendrobine: 94,
    moisture: 89,
    heavyMetalPb: 96,
    heavyMetalCd: 94,
    pesticide: 92,
    totalScore: 93.0,
  },
];

export const radarIndicators = [
  { name: '石斛碱含量', max: 100 },
  { name: '水分控制', max: 100 },
  { name: '重金属-铅', max: 100 },
  { name: '重金属-镉', max: 100 },
  { name: '农残达标率', max: 100 },
];

// ============================================================
// 5. 交易中心一张图 - 交易排行
// ============================================================
export interface TradeItem {
  rank: number;
  product: string;       // 产品名称
  category: string;     // 品类
  volume: number;       // 成交量（吨）
  amount: number;       // 成交额（万元）
  trend: number;        // 环比涨跌（%）
  trendUp: boolean;
}

export const tradeData: TradeItem[] = [
  { rank: 1, product: '金钗石斛干条', category: '干品', volume: 186.5, amount: 1865.0, trend: 23.4, trendUp: true },
  { rank: 2, product: '金钗石斛枫斗', category: '加工品', volume: 128.3, amount: 2566.0, trend: 15.8, trendUp: true },
  { rank: 3, product: '金钗石斛鲜条', category: '鲜品', volume: 245.8, amount: 1229.0, trend: -5.2, trendUp: false },
  { rank: 4, product: '金钗石斛粉', category: '加工品', volume: 86.4, amount: 1296.0, trend: 38.6, trendUp: true },
  { rank: 5, product: '金钗石斛原浆', category: '深加工', volume: 42.1, amount: 2105.0, trend: 52.1, trendUp: true },
  { rank: 6, product: '铁皮石斛鲜条', category: '鲜品', volume: 68.2, amount: 409.2, trend: -12.3, trendUp: false },
  { rank: 7, product: '金钗石斛花茶', category: '衍生品', volume: 18.5, amount: 370.0, trend: 8.4, trendUp: true },
];

// ============================================================
// 6. 市场服务一张图 - 采购商地域分布
// ============================================================
export interface MarketRegion {
  region: string;
  proportion: number;    // 占比（%）
  amount: number;       // 成交额（万元）
  buyerCount: number;   // 采购商数量
}

export const marketRegionData: MarketRegion[] = [
  { region: '川渝地区', proportion: 32.8, amount: 933.7, buyerCount: 86 },
  { region: '珠三角', proportion: 24.5, amount: 697.3, buyerCount: 62 },
  { region: '长三角', proportion: 18.3, amount: 521.0, buyerCount: 54 },
  { region: '京津冀', proportion: 12.6, amount: 358.8, buyerCount: 38 },
  { region: '华中地区', proportion: 7.2, amount: 205.0, buyerCount: 29 },
  { region: '海外出口', proportion: 4.6, amount: 131.0, buyerCount: 12 },
];

// ============================================================
// 7. 社会化服务一张图 - 月度服务统计
// ============================================================
export interface SocialServiceMonth {
  month: string;
  techGuide: number;    // 农技指导（次）
  machineryRent: number; // 农机租赁（台次）
  unifiedControl: number; // 统防统治（亩次）
}

export const socialServiceData: SocialServiceMonth[] = [
  { month: '2025-05', techGuide: 28, machineryRent: 15, unifiedControl: 1200 },
  { month: '2025-06', techGuide: 42, machineryRent: 28, unifiedControl: 2800 },
  { month: '2025-07', techGuide: 65, machineryRent: 45, unifiedControl: 4200 },
  { month: '2025-08', techGuide: 78, machineryRent: 52, unifiedControl: 5600 },
  { month: '2025-09', techGuide: 86, machineryRent: 60, unifiedControl: 6800 },
  { month: '2025-10', techGuide: 72, machineryRent: 48, unifiedControl: 5200 },
  { month: '2025-11', techGuide: 55, machineryRent: 32, unifiedControl: 3600 },
  { month: '2025-12', techGuide: 38, machineryRent: 20, unifiedControl: 2100 },
  { month: '2026-01', techGuide: 22, machineryRent: 12, unifiedControl: 800 },
  { month: '2026-02', techGuide: 30, machineryRent: 18, unifiedControl: 1400 },
  { month: '2026-03', techGuide: 48, machineryRent: 35, unifiedControl: 3200 },
  { month: '2026-04', techGuide: 62, machineryRent: 46, unifiedControl: 4800 },
];

// ============================================================
// 8. 金融服务一张图 - 贷款与保险
// ============================================================
export interface FinanceMonth {
  month: string;
  loanAmount: number;     // 助农贷款发放总额（万元）
  insuranceCoverage: number; // 农业保险覆盖率（%）
}

export const financeData: FinanceMonth[] = [
  { month: '2025-05', loanAmount: 320, insuranceCoverage: 42 },
  { month: '2025-06', loanAmount: 480, insuranceCoverage: 48 },
  { month: '2025-07', loanAmount: 620, insuranceCoverage: 55 },
  { month: '2025-08', loanAmount: 780, insuranceCoverage: 61 },
  { month: '2025-09', loanAmount: 950, insuranceCoverage: 68 },
  { month: '2025-10', loanAmount: 1100, insuranceCoverage: 72 },
  { month: '2025-11', loanAmount: 1280, insuranceCoverage: 75 },
  { month: '2025-12', loanAmount: 1420, insuranceCoverage: 78 },
  { month: '2026-01', loanAmount: 1580, insuranceCoverage: 80 },
  { month: '2026-02', loanAmount: 1720, insuranceCoverage: 82 },
  { month: '2026-03', loanAmount: 1890, insuranceCoverage: 85 },
  { month: '2026-04', loanAmount: 2050, insuranceCoverage: 87 },
];
