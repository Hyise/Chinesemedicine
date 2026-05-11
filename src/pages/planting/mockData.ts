/**
 * 种植服务管理系统 - 统一 Mock 数据契约
 * 严格遵循贵州赤水金钗石斛产业特征
 */

// ============================================================
// 1. 行政区划 / 基地树形结构
// ============================================================

export interface Town {
  id: string;
  name: string;
  villages: Village[];
}

export interface Village {
  id: string;
  name: string;
  baseCount: number;
}

export const townTreeData: Town[] = [
  {
    id: 'guanduxiang',
    name: '官渡镇',
    villages: [
      { id: 'gd-yx', name: '渔湾村', baseCount: 2 },
      { id: 'gd-yk', name: '玉皇村', baseCount: 1 },
      { id: 'gd-hq', name: '红旗社区', baseCount: 1 },
    ],
  },
  {
    id: 'changqixiang',
    name: '长期镇',
    villages: [
      { id: 'cq-hn', name: '华阳村', baseCount: 3 },
      { id: 'cq-wd', name: '乌骨鸡场社区', baseCount: 2 },
      { id: 'cq-gy', name: '光明村', baseCount: 1 },
    ],
  },
  {
    id: 'datongxiang',
    name: '大同镇',
    villages: [
      { id: 'dt-mt', name: '庙沱村', baseCount: 1 },
      { id: 'dt-sh', name: '四洞沟社区', baseCount: 2 },
    ],
  },
  {
    id: 'wanglongxiang',
    name: '旺隆镇',
    villages: [
      { id: 'wl-db', name: '大碑村', baseCount: 2 },
      { id: 'wl-hs', name: '红花村', baseCount: 1 },
    ],
  },
  {
    id: 'binganxiang',
    name: '丙安镇',
    villages: [
      { id: 'ba-bh', name: '丙安社区', baseCount: 1 },
      { id: 'ba-gh', name: '古华村', baseCount: 1 },
    ],
  },
];

// ============================================================
// 2. 基地档案
// ============================================================

export type BaseStatus = 'growing' | 'harvested' | 'dormant';

export interface PlantingBase {
  id: string;
  name: string;
  town: string;
  village: string;
  herbName: string;
  plantingArea: number;
  plantDate: string;
  expectedHarvestDate: string;
  status: BaseStatus;
  manager: string;
  phone: string;
  description: string;
  iot: IoTData;
  createdAt: string;
  updatedAt: string;
}

export interface IoTData {
  soilTemp: number;       // 土壤温度 (℃)
  soilMoisture: number;   // 土壤湿度 (%)
  airTemp: number;        // 空气温度 (℃)
  airHumidity: number;     // 空气湿度 (%)
  lightIntensity: number;  // 光照强度 (lux)
  lastUpdate: string;
}

export const plantingBases: PlantingBase[] = [
  {
    id: 'base-001',
    name: '官渡镇石斛林下经济示范园',
    town: '官渡镇',
    village: '渔湾村',
    herbName: '金钗石斛',
    plantingArea: 3200,
    plantDate: '2023-04-15',
    expectedHarvestDate: '2026-10-01',
    status: 'growing',
    manager: '张明远',
    phone: '13808524167',
    description: '林下仿野生种植，三年生金钗石斛，采用石壁附生技术，滴灌+微喷双系统覆盖',
    iot: { soilTemp: 18.5, soilMoisture: 68, airTemp: 22.3, airHumidity: 82, lightIntensity: 4200, lastUpdate: '2026-04-26 10:35' },
    createdAt: '2023-04-15 08:00:00',
    updatedAt: '2026-04-20 14:30:00',
  },
  {
    id: 'base-002',
    name: '长期镇石斛省级现代产业园',
    town: '长期镇',
    village: '华阳村',
    herbName: '金钗石斛',
    plantingArea: 4500,
    plantDate: '2022-03-20',
    expectedHarvestDate: '2026-08-15',
    status: 'growing',
    manager: '李正华',
    phone: '13908524189',
    description: '省级现代农业产业园，标准化种植，配套溯源体系，已接入省级中药材大数据平台',
    iot: { soilTemp: 19.2, soilMoisture: 72, airTemp: 21.8, airHumidity: 78, lightIntensity: 3800, lastUpdate: '2026-04-26 10:32' },
    createdAt: '2022-03-20 09:00:00',
    updatedAt: '2026-04-22 09:15:00',
  },
  {
    id: 'base-003',
    name: '长期镇石斛深加工配套种植基地',
    town: '长期镇',
    village: '乌骨鸡场社区',
    herbName: '金钗石斛',
    plantingArea: 1800,
    plantDate: '2024-04-10',
    expectedHarvestDate: '2027-04-10',
    status: 'growing',
    manager: '王建国',
    phone: '13708512456',
    description: '用于深加工原料直供，建有有机认证，年产鲜条约15吨，配套水肥一体化系统',
    iot: { soilTemp: 17.8, soilMoisture: 65, airTemp: 23.1, airHumidity: 75, lightIntensity: 4500, lastUpdate: '2026-04-26 10:38' },
    createdAt: '2024-04-10 08:30:00',
    updatedAt: '2026-04-21 16:00:00',
  },
  {
    id: 'base-004',
    name: '大同镇石斛合作社种植基地',
    town: '大同镇',
    village: '四洞沟社区',
    herbName: '金钗石斛',
    plantingArea: 2100,
    plantDate: '2023-03-28',
    expectedHarvestDate: '2026-09-20',
    status: 'growing',
    manager: '赵德友',
    phone: '13608513789',
    description: '合作社统一管理，标准化生产，建有GAP认证，亩产鲜条约300kg',
    iot: { soilTemp: 18.9, soilMoisture: 70, airTemp: 22.6, airHumidity: 80, lightIntensity: 3900, lastUpdate: '2026-04-26 10:29' },
    createdAt: '2023-03-28 09:00:00',
    updatedAt: '2026-04-19 11:20:00',
  },
  {
    id: 'base-005',
    name: '旺隆镇石斛标准化示范种植园',
    town: '旺隆镇',
    village: '大碑村',
    herbName: '金钗石斛',
    plantingArea: 980,
    plantDate: '2024-05-05',
    expectedHarvestDate: '2027-05-05',
    status: 'growing',
    manager: '陈光明',
    phone: '13508519876',
    description: '标准化示范园，棚架遮荫率达65%，配套物联网实时监控，数据每5分钟上报一次',
    iot: { soilTemp: 20.1, soilMoisture: 62, airTemp: 24.5, airHumidity: 70, lightIntensity: 5200, lastUpdate: '2026-04-26 10:41' },
    createdAt: '2024-05-05 08:00:00',
    updatedAt: '2026-04-23 10:00:00',
  },
  {
    id: 'base-006',
    name: '旺隆镇石斛种苗繁育中心',
    town: '旺隆镇',
    village: '红花村',
    herbName: '金钗石斛（组培苗）',
    plantingArea: 380,
    plantDate: '2025-03-15',
    expectedHarvestDate: '2026-07-01',
    status: 'dormant',
    manager: '刘小英',
    phone: '13808521123',
    description: '种苗繁育基地，年产优质组培苗50万株，除满足自有基地外对外供应20万株',
    iot: { soilTemp: 22.5, soilMoisture: 55, airTemp: 26.0, airHumidity: 65, lightIntensity: 6800, lastUpdate: '2026-04-26 10:25' },
    createdAt: '2025-03-15 09:30:00',
    updatedAt: '2026-04-18 14:00:00',
  },
  {
    id: 'base-007',
    name: '丙安镇林下仿野生石斛示范园',
    town: '丙安镇',
    village: '古华村',
    herbName: '金钗石斛',
    plantingArea: 650,
    plantDate: '2023-04-20',
    expectedHarvestDate: '2026-10-30',
    status: 'growing',
    manager: '周长发',
    phone: '13908523098',
    description: '林下仿野生种植，充分利用丹霞石壁资源，品质接近野生石斛，已获有机食品认证',
    iot: { soilTemp: 19.6, soilMoisture: 74, airTemp: 21.2, airHumidity: 85, lightIntensity: 3500, lastUpdate: '2026-04-26 10:33' },
    createdAt: '2023-04-20 08:00:00',
    updatedAt: '2026-04-22 15:30:00',
  },
  {
    id: 'base-008',
    name: '大同镇石斛文化体验园',
    town: '大同镇',
    village: '庙沱村',
    herbName: '金钗石斛',
    plantingArea: 280,
    plantDate: '2024-06-01',
    expectedHarvestDate: '2027-06-01',
    status: 'growing',
    manager: '孙桂香',
    phone: '13708525678',
    description: '石斛文化体验园，结合乡村旅游，可观赏石斛花海，已纳入赤水市旅游精品路线',
    iot: { soilTemp: 18.2, soilMoisture: 67, airTemp: 23.5, airHumidity: 77, lightIntensity: 4800, lastUpdate: '2026-04-26 10:40' },
    createdAt: '2024-06-01 09:00:00',
    updatedAt: '2026-04-20 16:00:00',
  },
  {
    id: 'base-009',
    name: '官渡镇渔湾石斛出口备案基地',
    town: '官渡镇',
    village: '渔湾村',
    herbName: '金钗石斛',
    plantingArea: 1500,
    plantDate: '2022-04-10',
    expectedHarvestDate: '2026-09-10',
    status: 'harvested',
    manager: '张明远',
    phone: '13808524167',
    description: '海关备案出口基地，已通过GACP认证，产品主要出口东南亚及港澳地区',
    iot: { soilTemp: 15.0, soilMoisture: 45, airTemp: 18.0, airHumidity: 60, lightIntensity: 3000, lastUpdate: '2026-04-26 10:20' },
    createdAt: '2022-04-10 08:00:00',
    updatedAt: '2026-04-10 16:00:00',
  },
];

// ============================================================
// 3. 农事任务
// ============================================================

export type FarmTaskType =
  | 'fertilizing'
  | 'pesticide'
  | 'irrigating'
  | 'weeding'
  | 'pruning'
  | 'shadeNet'
  | 'inspection'
  | 'harvest'
  | 'other';

export type FarmTaskStatus = 'pending' | 'inProgress' | 'completed' | 'cancelled';

export interface FarmTask {
  id: string;
  baseId: string;
  baseName: string;
  herbName: string;
  taskType: FarmTaskType;
  taskName: string;
  description: string;
  scheduledDate: string;
  executor: string;
  status: FarmTaskStatus;
  linkedMaterials?: MaterialLink[];
  createdAt: string;
}

export interface MaterialLink {
  materialId: string;
  materialName: string;
  unit: string;
  quantity: number;
  stockBefore: number;
  stockAfter: number;
}

export const farmTaskTypes: { value: FarmTaskType; label: string; color: string; needsMaterial: boolean }[] = [
  { value: 'fertilizing', label: '施肥', color: 'green', needsMaterial: true },
  { value: 'pesticide', label: '打药', color: 'orange', needsMaterial: true },
  { value: 'irrigating', label: '灌溉', color: 'cyan', needsMaterial: false },
  { value: 'weeding', label: '除草', color: 'lime', needsMaterial: false },
  { value: 'pruning', label: '修剪去枯', color: 'purple', needsMaterial: false },
  { value: 'shadeNet', label: '搭棚遮荫', color: 'geekblue', needsMaterial: false },
  { value: 'inspection', label: '巡检', color: 'blue', needsMaterial: false },
  { value: 'harvest', label: '采收', color: 'gold', needsMaterial: false },
  { value: 'other', label: '其他', color: 'default', needsMaterial: false },
];

export const farmTasks: FarmTask[] = [
  {
    id: 'task-001',
    baseId: 'base-001',
    baseName: '官渡镇石斛林下经济示范园',
    herbName: '金钗石斛',
    taskType: 'fertilizing',
    taskName: '叶面追肥 - 石斛专用营养液',
    description: '施用石斛专用叶面肥（稀释1000倍），配合氨基酸水溶肥，傍晚喷雾，避开高温时段',
    scheduledDate: '2026-04-26',
    executor: '张明远',
    status: 'inProgress',
    linkedMaterials: [
      { materialId: 'mat-001', materialName: '石斛专用叶面肥', unit: '瓶', quantity: 5, stockBefore: 45, stockAfter: 40 },
      { materialId: 'mat-005', materialName: '氨基酸水溶肥', unit: 'kg', quantity: 10, stockBefore: 120, stockAfter: 110 },
    ],
    createdAt: '2026-04-24 08:00:00',
  },
  {
    id: 'task-002',
    baseId: 'base-002',
    baseName: '长期镇石斛省级现代产业园',
    herbName: '金钗石斛',
    taskType: 'pesticide',
    taskName: '预防性生物农药喷洒',
    description: '使用苦参碱生物农药预防介壳虫，浓度按说明书1.2倍施用，重点喷施叶背',
    scheduledDate: '2026-04-27',
    executor: '李正华',
    status: 'pending',
    linkedMaterials: [
      { materialId: 'mat-003', materialName: '0.3% 苦参碱水剂', unit: '瓶', quantity: 8, stockBefore: 60, stockAfter: 52 },
    ],
    createdAt: '2026-04-25 09:00:00',
  },
  {
    id: 'task-003',
    baseId: 'base-004',
    baseName: '大同镇石斛合作社种植基地',
    herbName: '金钗石斛',
    taskType: 'weeding',
    taskName: '人工除草 + 杂草清理',
    description: '清理石斛栽培床周围杂草，移除已枯死的匍匐茎，清理排水沟',
    scheduledDate: '2026-04-28',
    executor: '赵德友',
    status: 'pending',
    createdAt: '2026-04-25 10:30:00',
  },
  {
    id: 'task-004',
    baseId: 'base-005',
    baseName: '旺隆镇石斛标准化示范种植园',
    herbName: '金钗石斛',
    taskType: 'shadeNet',
    taskName: '遮阳网维护与更换',
    description: '检查并更换老化遮阳网，4月进入高温期，需将遮光率从60%提升至75%',
    scheduledDate: '2026-04-29',
    executor: '陈光明',
    status: 'pending',
    createdAt: '2026-04-25 11:00:00',
  },
  {
    id: 'task-005',
    baseId: 'base-003',
    baseName: '长期镇石斛深加工配套种植基地',
    herbName: '金钗石斛',
    taskType: 'inspection',
    taskName: '月度生长巡检',
    description: '测量株高、茎粗、叶片数，记录病虫害发生情况，评估是否达到采收标准',
    scheduledDate: '2026-04-26',
    executor: '王建国',
    status: 'completed',
    createdAt: '2026-04-24 08:30:00',
  },
  {
    id: 'task-006',
    baseId: 'base-007',
    baseName: '丙安镇林下仿野生石斛示范园',
    herbName: '金钗石斛',
    taskType: 'pruning',
    taskName: '枯茎修剪与石壁清理',
    description: '修剪枯死茎秆，清理附生于石壁的苔藓，检查石斛根系是否松动',
    scheduledDate: '2026-04-30',
    executor: '周长发',
    status: 'pending',
    createdAt: '2026-04-25 14:00:00',
  },
  {
    id: 'task-007',
    baseId: 'base-001',
    baseName: '官渡镇石斛林下经济示范园',
    herbName: '金钗石斛',
    taskType: 'irrigating',
    taskName: '滴灌系统维护检查',
    description: '检查滴灌管道是否堵塞，清洗过滤器，测量土壤湿度确认灌溉量是否充足',
    scheduledDate: '2026-04-25',
    executor: '张明远',
    status: 'completed',
    createdAt: '2026-04-23 09:00:00',
  },
  {
    id: 'task-008',
    baseId: 'base-002',
    baseName: '长期镇石斛省级现代产业园',
    herbName: '金钗石斛',
    taskType: 'harvest',
    taskName: '早熟批次采收',
    description: '采收已达到采收标准的三年生植株（共约200kg鲜条），分类存放于冷链仓',
    scheduledDate: '2026-05-05',
    executor: '李正华',
    status: 'pending',
    createdAt: '2026-04-26 08:00:00',
  },
];

// ============================================================
// 4. 农资与种苗中心
// ============================================================

export type MaterialCategory = 'seedling' | 'fertilizer' | 'organic' | 'pesticide' | 'tool';

export type MaterialUnit = '株' | 'kg' | '瓶' | '袋' | '台' | '套' | '桶' | 'L' | 'ml' | '卷' | '把';

export interface AgriculturalMaterial {
  id: string;
  name: string;
  category: MaterialCategory;
  specification: string;
  unit: MaterialUnit;
  stock: number;
  safetyStock: number;
  unitPrice: number;
  supplier: string;
  supplierContact: string;
  description?: string;
  lastPurchaseDate: string;
  remark?: string;
}

export interface MaterialApplication {
  id: string;
  materialId: string;
  materialName: string;
  category: MaterialCategory;
  quantity: number;
  unit: MaterialUnit;
  applicant: string;
  applyDate: string;
  status: 'pending' | 'approved' | 'rejected';
  remark?: string;
}

export const materialCategories: { value: MaterialCategory; label: string }[] = [
  { value: 'seedling', label: '种苗' },
  { value: 'fertilizer', label: '化肥' },
  { value: 'organic', label: '有机肥' },
  { value: 'pesticide', label: '生物农药' },
  { value: 'tool', label: '农具' },
];

export const agriculturalMaterials: AgriculturalMaterial[] = [
  // 种苗
  {
    id: 'mat-seed-001',
    name: '金钗石斛一代组培苗',
    category: 'seedling',
    specification: '苗高≥8cm，3-4片叶，根系完整',
    unit: '株',
    stock: 280000,
    safetyStock: 50000,
    unitPrice: 0.8,
    supplier: '赤水市石斛种苗繁育中心',
    supplierContact: '0852-22881234',
    lastPurchaseDate: '2026-03-15',
    remark: '已通过贵州省林木种苗质量检验',
  },
  {
    id: 'mat-seed-002',
    name: '金钗石斛驯化苗（炼苗）',
    category: 'seedling',
    specification: '苗高≥12cm，叶片5片以上，根系发达',
    unit: '株',
    stock: 85000,
    safetyStock: 20000,
    unitPrice: 2.5,
    supplier: '赤水市石斛种苗繁育中心',
    supplierContact: '0852-22881234',
    lastPurchaseDate: '2026-02-20',
  },
  {
    id: 'mat-seed-003',
    name: '铁皮石斛组培苗',
    category: 'seedling',
    specification: '苗高≥6cm，2-3片叶，洗净培养基',
    unit: '株',
    stock: 42000,
    safetyStock: 10000,
    unitPrice: 1.2,
    supplier: '贵州航天生物科技有限公司',
    supplierContact: '0851-86891234',
    lastPurchaseDate: '2026-03-01',
  },
  // 化肥
  {
    id: 'mat-fer-001',
    name: '复合肥（NPK 15-15-15）',
    category: 'fertilizer',
    specification: '50kg/袋，总养分≥45%',
    unit: '袋',
    stock: 180,
    safetyStock: 50,
    unitPrice: 185,
    supplier: '贵州瓮福化工集团',
    supplierContact: '0851-84761234',
    lastPurchaseDate: '2026-03-10',
  },
  {
    id: 'mat-fer-002',
    name: '尿素（含氮46%）',
    category: 'fertilizer',
    specification: '40kg/袋，农业级',
    unit: '袋',
    stock: 95,
    safetyStock: 30,
    unitPrice: 92,
    supplier: '贵州赤天化集团',
    supplierContact: '0852-28761234',
    lastPurchaseDate: '2026-03-12',
  },
  {
    id: 'mat-fer-003',
    name: '磷酸二氢钾（水溶肥）',
    category: 'fertilizer',
    specification: '1kg/袋，AR级，全水溶',
    unit: '袋',
    stock: 220,
    safetyStock: 50,
    unitPrice: 28,
    supplier: '四川什邡华蓉化工',
    supplierContact: '0838-8201234',
    lastPurchaseDate: '2026-04-01',
  },
  // 有机肥
  {
    id: 'mat-org-001',
    name: '发酵羊粪有机肥',
    category: 'organic',
    specification: '40kg/袋，充分腐熟，有机质≥45%',
    unit: '袋',
    stock: 320,
    safetyStock: 80,
    unitPrice: 45,
    supplier: '赤水市旺隆镇畜禽粪污处理中心',
    supplierContact: '13808524567',
    lastPurchaseDate: '2026-02-28',
  },
  {
    id: 'mat-org-002',
    name: '松树皮基质（石斛专用）',
    category: 'organic',
    specification: '20L/袋，粒径0.5-2cm，pH 5.5-6.5',
    unit: '袋',
    stock: 560,
    safetyStock: 100,
    unitPrice: 38,
    supplier: '贵州云台山林业公司',
    supplierContact: '13908527890',
    lastPurchaseDate: '2026-03-20',
  },
  {
    id: 'mat-org-003',
    name: '氨基酸水溶肥',
    category: 'organic',
    specification: '5L/桶，氨基酸≥100g/L',
    unit: '桶',
    stock: 85,
    safetyStock: 20,
    unitPrice: 120,
    supplier: '以色列海法化学工业有限公司',
    supplierContact: '代理：贵阳绿农公司 0851-86781234',
    lastPurchaseDate: '2026-04-05',
  },
  // 生物农药
  {
    id: 'mat-pest-001',
    name: '0.3% 苦参碱水剂',
    category: 'pesticide',
    specification: '500mL/瓶，植物源农药',
    unit: '瓶',
    stock: 52,
    safetyStock: 15,
    unitPrice: 35,
    supplier: '山东鲁抗生物农药',
    supplierContact: '0538-6281234',
    lastPurchaseDate: '2026-03-25',
  },
  {
    id: 'mat-pest-002',
    name: '苏云金杆菌（Bt）悬浮剂',
    category: 'pesticide',
    specification: '100mL/瓶，16000IU/mg',
    unit: '瓶',
    stock: 38,
    safetyStock: 10,
    unitPrice: 22,
    supplier: '湖北康欣农用药业',
    supplierContact: '027-83791234',
    lastPurchaseDate: '2026-03-28',
  },
  {
    id: 'mat-pest-003',
    name: '石硫合剂（自制）',
    category: 'pesticide',
    specification: '波美度3-5，用于早春清园',
    unit: 'L',
    stock: 200,
    safetyStock: 50,
    unitPrice: 8,
    supplier: '自制',
    supplierContact: '-',
    lastPurchaseDate: '2026-01-10',
  },
  // 农具
  {
    id: 'mat-tool-001',
    name: '背负式电动喷雾器',
    category: 'tool',
    specification: '16L，锂电池，雾化效果好',
    unit: '台',
    stock: 12,
    safetyStock: 3,
    unitPrice: 320,
    supplier: '浙江台州路桥喷雾器厂',
    supplierContact: '0576-82451234',
    lastPurchaseDate: '2025-12-15',
  },
  {
    id: 'mat-tool-002',
    name: '遮阳网（黑色）',
    category: 'tool',
    specification: '幅宽4m，遮光率75%，聚乙烯材质',
    unit: '卷',
    stock: 28,
    safetyStock: 5,
    unitPrice: 180,
    supplier: '成都农用物资批发市场',
    supplierContact: '13808001234',
    lastPurchaseDate: '2026-02-10',
  },
  {
    id: 'mat-tool-003',
    name: '石斛专用采收剪刀',
    category: 'tool',
    specification: '不锈钢，刃口锋利，长度22cm',
    unit: '把',
    stock: 45,
    safetyStock: 10,
    unitPrice: 28,
    supplier: '云南昆明五金工具批发市场',
    supplierContact: '0871-63121234',
    lastPurchaseDate: '2025-11-20',
  },
];

// ============================================================
// 5. 订单种植与托管服务
// ============================================================

export type OrderStatus =
  | 'pending'
  | 'signed'
  | 'inProgress'
  | 'completed'
  | 'cancelled';

export interface OrderPlanting {
  id: string;
  orderNo: string;
  orderNoDisplay?: string;
  type: 'customGarden' | 'trustManagement' | 'unifiedControl';
  customerName: string;
  customerType: 'enterprise' | 'individual';
  contactPerson: string;
  contactPhone: string;
  baseId: string;
  baseName: string;
  plantingArea: number;
  contractAmount: number;
  growthStage: string;
  estimatedHarvest: string;
  signDate: string;
  status: OrderStatus;
  remark?: string;
}

export const orders: OrderPlanting[] = [
  // 定制药园订单
  {
    id: 'ord-001',
    orderNo: 'DZ-2026-0001',
    type: 'customGarden',
    customerName: '贵州茅台酒股份有限公司',
    customerType: 'enterprise',
    contactPerson: '陈经理',
    contactPhone: '0851-22345678',
    baseId: 'base-001',
    baseName: '官渡镇石斛林下经济示范园',
    plantingArea: 500,
    contractAmount: 2800000,
    growthStage: '生长期（第三年）',
    estimatedHarvest: '2026年10月',
    signDate: '2025-04-10',
    status: 'inProgress',
    remark: '企业定制药园，用于员工健康福利及礼品定制',
  },
  {
    id: 'ord-002',
    orderNo: 'DZ-2026-0002',
    type: 'customGarden',
    customerName: '华润三九医药股份有限公司',
    customerType: 'enterprise',
    contactPerson: '林总',
    contactPhone: '0755-86891234',
    baseId: 'base-002',
    baseName: '长期镇石斛省级现代产业园',
    plantingArea: 1200,
    contractAmount: 6500000,
    growthStage: '生长期（第四年）',
    estimatedHarvest: '2026年8月',
    signDate: '2024-05-20',
    status: 'inProgress',
    remark: '中药饮片原料直供，已签订3年框架协议',
  },
  {
    id: 'ord-003',
    orderNo: 'DZ-2026-0003',
    type: 'customGarden',
    customerName: '贵州百灵企业集团制药股份有限公司',
    customerType: 'enterprise',
    contactPerson: '王主任',
    contactPhone: '0851-88112345',
    baseId: 'base-003',
    baseName: '长期镇石斛深加工配套种植基地',
    plantingArea: 800,
    contractAmount: 4200000,
    growthStage: '生长期（第三年）',
    estimatedHarvest: '2027年4月',
    signDate: '2025-03-15',
    status: 'inProgress',
    remark: '含糖浆原料直供合同',
  },
  {
    id: 'ord-004',
    orderNo: 'DZ-2026-0004',
    type: 'customGarden',
    customerName: '深圳市康恩贝股份有限公司',
    customerType: 'enterprise',
    contactPerson: '张经理',
    contactPhone: '0755-26891234',
    baseId: 'base-004',
    baseName: '大同镇石斛合作社种植基地',
    plantingArea: 300,
    contractAmount: 1500000,
    growthStage: '即将进入采收期',
    estimatedHarvest: '2026年9月',
    signDate: '2025-04-28',
    status: 'inProgress',
  },
  {
    id: 'ord-005',
    orderNo: 'DZ-2026-0005',
    type: 'customGarden',
    customerName: '个人客户（张先生）',
    customerType: 'individual',
    contactPerson: '张先生',
    contactPhone: '13808529999',
    baseId: 'base-008',
    baseName: '大同镇石斛文化体验园',
    plantingArea: 20,
    contractAmount: 120000,
    growthStage: '认养中（第一年）',
    estimatedHarvest: '2027年6月',
    signDate: '2026-03-10',
    status: 'inProgress',
    remark: '石斛花茶认购，含每年12次石斛花茶礼盒配送',
  },
  {
    id: 'ord-006',
    orderNo: 'DZ-2025-0012',
    orderNoDisplay: 'DZ-2025-0012（历史）',
    type: 'customGarden',
    customerName: '九州通医药集团股份有限公司',
    customerType: 'enterprise',
    contactPerson: '李经理',
    contactPhone: '027-83445678',
    baseId: 'base-009',
    baseName: '官渡镇渔湾石斛出口备案基地',
    plantingArea: 1500,
    contractAmount: 8200000,
    growthStage: '已采收交付',
    estimatedHarvest: '2026年4月',
    signDate: '2024-04-15',
    status: 'completed',
    remark: '已全部交付，港澳地区热销，续约洽谈中',
  },
  // 种植托管协议
  {
    id: 'ord-007',
    orderNo: 'TG-2026-0001',
    type: 'trustManagement',
    customerName: '赤水市农业农村局',
    customerType: 'enterprise',
    contactPerson: '赵局长',
    contactPhone: '0852-28611234',
    baseId: 'base-005',
    baseName: '旺隆镇石斛标准化示范种植园',
    plantingArea: 980,
    contractAmount: 980000,
    growthStage: '标准化管理中',
    estimatedHarvest: '2027年5月',
    signDate: '2026-01-15',
    status: 'inProgress',
    remark: '政府产业扶贫托管项目，惠及农户186户',
  },
  {
    id: 'ord-008',
    orderNo: 'TG-2026-0002',
    type: 'trustManagement',
    customerName: '贵州省中药材产业发展协会',
    customerType: 'enterprise',
    contactPerson: '刘秘书长',
    contactPhone: '0851-86871234',
    baseId: 'base-007',
    baseName: '丙安镇林下仿野生石斛示范园',
    plantingArea: 650,
    contractAmount: 650000,
    growthStage: '有机认证管理',
    estimatedHarvest: '2026年10月',
    signDate: '2026-02-20',
    status: 'inProgress',
    remark: 'GAP托管，纳入贵州省中药材溯源体系',
  },
  // 统防统治服务
  {
    id: 'ord-009',
    orderNo: 'TB-2026-0001',
    type: 'unifiedControl',
    customerName: '赤水市旺隆镇人民政府',
    customerType: 'enterprise',
    contactPerson: '周镇长',
    contactPhone: '0852-22991234',
    baseId: '-',
    baseName: '旺隆镇全域统防统治',
    plantingArea: 5600,
    contractAmount: 336000,
    growthStage: '春季统防进行中',
    estimatedHarvest: '2026年10月',
    signDate: '2026-03-01',
    status: 'inProgress',
    remark: '覆盖旺隆镇7个村，石斛及其他中药材种植面积5600亩',
  },
  {
    id: 'ord-010',
    orderNo: 'TB-2026-0002',
    type: 'unifiedControl',
    customerName: '赤水市官渡镇农技站',
    customerType: 'enterprise',
    contactPerson: '刘站长',
    contactPhone: '0852-22981234',
    baseId: '-',
    baseName: '官渡镇产业带统防统治',
    plantingArea: 8200,
    contractAmount: 492000,
    growthStage: '生物农药喷洒完成',
    estimatedHarvest: '2026年9月',
    signDate: '2026-03-05',
    status: 'inProgress',
    remark: '官渡镇石斛产业带全覆盖，统防面积8200亩',
  },
  {
    id: 'ord-011',
    orderNo: 'TB-2025-0003',
    orderNoDisplay: 'TB-2025-0003（历史）',
    type: 'unifiedControl',
    customerName: '贵州省农产品质量安全管理站',
    customerType: 'enterprise',
    contactPerson: '杨处长',
    contactPhone: '0851-85231234',
    baseId: '-',
    baseName: '赤水市大同镇GAP认证统防',
    plantingArea: 2100,
    contractAmount: 210000,
    growthStage: '已完成',
    estimatedHarvest: '2025年9月',
    signDate: '2025-03-15',
    status: 'completed',
    remark: 'GAP认证统防统治服务，已通过认证审核',
  },
];

// ============================================================
// 状态映射常量
// ============================================================

export const BASE_STATUS_MAP: Record<BaseStatus, string> = {
  growing: '生长中',
  harvested: '已采收',
  dormant: '休眠期',
};

export const BASE_STATUS_COLOR_MAP: Record<BaseStatus, string> = {
  growing: 'blue',
  harvested: 'green',
  dormant: 'orange',
};

export const TASK_STATUS_MAP: Record<FarmTaskStatus, string> = {
  pending: '待执行',
  inProgress: '执行中',
  completed: '已完成',
  cancelled: '已取消',
};

export const TASK_STATUS_COLOR_MAP: Record<FarmTaskStatus, string> = {
  pending: 'default',
  inProgress: 'processing',
  completed: 'success',
  cancelled: 'default',
};

export const ORDER_STATUS_MAP: Record<OrderStatus, string> = {
  pending: '待签约',
  signed: '已签约',
  inProgress: '履约中',
  completed: '已交付',
  cancelled: '已取消',
};

export const ORDER_STATUS_COLOR_MAP: Record<OrderStatus, string> = {
  pending: 'default',
  signed: 'cyan',
  inProgress: 'processing',
  completed: 'success',
  cancelled: 'default',
};
