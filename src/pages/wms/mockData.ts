/**
 * 仓储管理系统 (WMS) — 统一 Mock 数据契约
 * 严格遵循贵州赤水金钗石斛仓储特性
 */

// ============================================================
// 1. 库存台账（树形结构：产品 → 批次）
// ============================================================

export type InventoryStatus = 'normal' | 'locked' | 'expired';
export type StorageType = 'cold' | 'shade' | 'ambient';
export type FormType = '鲜条' | '干条' | '切片' | '微粉';

export interface InventoryBatch {
  id: string;
  parentId: string;           // 对应的产品 ID
  batchNo: string;
  storageType: StorageType;
  location: string;            // 库位，如 A-01-03
  quantity: number;
  unit: string;
  productionDate: string;
  validUntil: string;
  status: InventoryStatus;
  supplier: string;
  moisture: number;            // 含水率（%）
  appearance: string;          // 外观性状
  certNo?: string;             // 质检证书编号
  createdAt: string;
  updatedAt: string;
}

export interface InventoryProduct {
  id: string;
  name: string;               // 产品名称
  form: FormType;             // 形态
  spec: string;               // 规格
  totalStock: number;         // 总库存（kg）
  unit: string;
  storageType: StorageType;
  avgPrice: number;           // 平均单价（元/kg）
  children: InventoryBatch[];  // 子批次
}

export const storageTypeMap: Record<StorageType, { label: string; tempRange: string; temp: number; humidity: number; color: string }> = {
  cold:   { label: '冷藏库', tempRange: '2-8°C',  temp: 5,  humidity: 60, color: '#cc785c' },
  shade:  { label: '阴凉库', tempRange: '<20°C', temp: 18, humidity: 55, color: '#5db872' },
  ambient:{ label: '常温库', tempRange: '25-30°C', temp: 27, humidity: 50, color: '#e8a55a' },
};

export const inventoryProducts: InventoryProduct[] = [
  // ---- 金钗石斛（干条） ----
  {
    id: 'prod-gc-dry',
    name: '金钗石斛',
    form: '干条',
    spec: '统货（长度≥8cm）',
    totalStock: 2850,
    unit: 'kg',
    storageType: 'shade',
    avgPrice: 680,
    children: [
      {
        id: 'batch-gc-dry-001',
        parentId: 'prod-gc-dry',
        batchNo: 'GCH-D-20260315',
        storageType: 'shade',
        location: 'A-01-01',
        quantity: 800,
        unit: 'kg',
        productionDate: '2026-03-15',
        validUntil: '2028-03-15',
        status: 'normal',
        supplier: '官渡镇石斛林下经济示范园',
        moisture: 8.5,
        appearance: '色泽金黄，条形饱满，断面有粉末',
        certNo: 'QC-2026-0315-001',
        createdAt: '2026-03-15 10:00:00',
        updatedAt: '2026-04-22 08:30:00',
      },
      {
        id: 'batch-gc-dry-002',
        parentId: 'prod-gc-dry',
        batchNo: 'GCH-D-20260328',
        storageType: 'shade',
        location: 'A-01-02',
        quantity: 1200,
        unit: 'kg',
        productionDate: '2026-03-28',
        validUntil: '2028-03-28',
        status: 'normal',
        supplier: '长期镇石斛省级现代产业园',
        moisture: 7.8,
        appearance: '品质优良，条形均匀',
        certNo: 'QC-2026-0328-002',
        createdAt: '2026-03-28 09:00:00',
        updatedAt: '2026-04-21 14:00:00',
      },
      {
        id: 'batch-gc-dry-003',
        parentId: 'prod-gc-dry',
        batchNo: 'GCH-D-20260405',
        storageType: 'cold',
        location: 'C-02-03',
        quantity: 550,
        unit: 'kg',
        productionDate: '2026-04-05',
        validUntil: '2028-04-05',
        status: 'normal',
        supplier: '大同镇石斛合作社种植基地',
        moisture: 9.2,
        appearance: '新货，水分略高，需加强通风',
        certNo: 'QC-2026-0405-003',
        createdAt: '2026-04-05 11:00:00',
        updatedAt: '2026-04-20 16:00:00',
      },
      {
        id: 'batch-gc-dry-004',
        parentId: 'prod-gc-dry',
        batchNo: 'GCH-D-20260201',
        storageType: 'shade',
        location: 'A-03-05',
        quantity: 300,
        unit: 'kg',
        productionDate: '2026-02-01',
        validUntil: '2026-08-01',
        status: 'normal',
        supplier: '长期镇石斛深加工配套种植基地',
        moisture: 7.2,
        appearance: '接近效期，需尽快出库',
        certNo: 'QC-2026-0201-004',
        createdAt: '2026-02-01 08:00:00',
        updatedAt: '2026-04-18 10:00:00',
      },
    ],
  },
  // ---- 金钗石斛（切片） ----
  {
    id: 'prod-gc-slice',
    name: '金钗石斛',
    form: '切片',
    spec: '厚片 3-5mm',
    totalStock: 620,
    unit: 'kg',
    storageType: 'shade',
    avgPrice: 760,
    children: [
      {
        id: 'batch-gc-slice-001',
        parentId: 'prod-gc-slice',
        batchNo: 'GCH-S-20260410',
        storageType: 'shade',
        location: 'A-02-01',
        quantity: 420,
        unit: 'kg',
        productionDate: '2026-04-10',
        validUntil: '2028-04-10',
        status: 'normal',
        supplier: '旺隆镇石斛标准化示范种植园',
        moisture: 8.0,
        appearance: '片形完整，切面平整',
        certNo: 'QC-2026-0410-005',
        createdAt: '2026-04-10 09:00:00',
        updatedAt: '2026-04-22 09:00:00',
      },
      {
        id: 'batch-gc-slice-002',
        parentId: 'prod-gc-slice',
        batchNo: 'GCH-S-20260418',
        storageType: 'cold',
        location: 'C-03-01',
        quantity: 200,
        unit: 'kg',
        productionDate: '2026-04-18',
        validUntil: '2028-04-18',
        status: 'normal',
        supplier: '丙安镇林下仿野生石斛示范园',
        moisture: 8.6,
        appearance: '色泽鲜亮，质量上乘',
        certNo: 'QC-2026-0418-006',
        createdAt: '2026-04-18 10:00:00',
        updatedAt: '2026-04-21 15:00:00',
      },
    ],
  },
  // ---- 金钗石斛（鲜条） ----
  {
    id: 'prod-gc-fresh',
    name: '金钗石斛',
    form: '鲜条',
    spec: '长度 15-30cm',
    totalStock: 380,
    unit: 'kg',
    storageType: 'cold',
    avgPrice: 120,
    children: [
      {
        id: 'batch-gc-fresh-001',
        parentId: 'prod-gc-fresh',
        batchNo: 'GCH-F-20260420',
        storageType: 'cold',
        location: 'C-01-01',
        quantity: 200,
        unit: 'kg',
        productionDate: '2026-04-20',
        validUntil: '2026-07-20',
        status: 'normal',
        supplier: '官渡镇渔湾村合作社',
        moisture: 85.0,
        appearance: '茎条粗壮，叶片翠绿',
        certNo: 'QC-2026-0420-007',
        createdAt: '2026-04-20 08:00:00',
        updatedAt: '2026-04-26 08:00:00',
      },
      {
        id: 'batch-gc-fresh-002',
        parentId: 'prod-gc-fresh',
        batchNo: 'GCH-F-20260422',
        storageType: 'cold',
        location: 'C-01-02',
        quantity: 180,
        unit: 'kg',
        productionDate: '2026-04-22',
        validUntil: '2026-07-22',
        status: 'normal',
        supplier: '长期镇华阳村',
        moisture: 88.5,
        appearance: '新采收，含水量高',
        certNo: 'QC-2026-0422-008',
        createdAt: '2026-04-22 09:00:00',
        updatedAt: '2026-04-26 07:00:00',
      },
    ],
  },
  // ---- 金钗石斛（微粉） ----
  {
    id: 'prod-gc-powder',
    name: '金钗石斛',
    form: '微粉',
    spec: '200目（内袋 10g×30袋）',
    totalStock: 150,
    unit: 'kg',
    storageType: 'ambient',
    avgPrice: 1200,
    children: [
      {
        id: 'batch-gc-powder-001',
        parentId: 'prod-gc-powder',
        batchNo: 'GCH-P-20260412',
        storageType: 'ambient',
        location: 'B-01-03',
        quantity: 150,
        unit: 'kg',
        productionDate: '2026-04-12',
        validUntil: '2027-04-12',
        status: 'normal',
        supplier: '赤水市石斛深加工中心',
        moisture: 5.0,
        appearance: '细腻均匀，无结块',
        certNo: 'QC-2026-0412-009',
        createdAt: '2026-04-12 14:00:00',
        updatedAt: '2026-04-20 11:00:00',
      },
    ],
  },
];

// ============================================================
// 2. 养护任务
// ============================================================

export type CareTaskType = 'turnover' | 'fumigation' | 'dehumidify' | 'check' | 'clean';
export type CareTaskStatus = 'pending' | 'inProgress' | 'completed' | 'overdue';

export interface CareTask {
  id: string;
  type: CareTaskType;
  typeName: string;
  location: string;
  storageType: StorageType;
  targetBatch: string;
  reason: string;
  scheduledDate: string;
  executor: string;
  status: CareTaskStatus;
  remark?: string;
  createdAt: string;
}

export const careTaskTypes: Record<CareTaskType, { label: string; icon: string; color: string; desc: string }> = {
  turnover:   { label: '翻垛',   icon: 'SwapOutlined',      color: '#e8a55a', desc: '防止底层石斛受潮变质，需翻转垛位通风' },
  fumigation: { label: '熏蒸',   icon: 'FireOutlined',       color: '#c64545', desc: '使用苦参碱熏蒸，杀灭虫卵，预防霉变' },
  dehumidify: { label: '除湿',   icon: 'ExperimentOutlined', color: '#cc785c', desc: '启动除湿机控制库房湿度，防止石斛回潮' },
  check:      { label: '巡检',   icon: 'SearchOutlined',     color: '#5db8a6', desc: '定期检查温湿度、效期及外观性状' },
  clean:      { label: '清洁',   icon: 'DeleteOutlined',     color: '#5db872', desc: '清理库房杂物，保持存储环境整洁' },
};

export const careTasks: CareTask[] = [
  {
    id: 'care-001',
    type: 'fumigation',
    typeName: '熏蒸',
    location: 'A-01-01',
    storageType: 'shade',
    targetBatch: 'GCH-D-20260315',
    reason: '常规月度养护，预防虫蛀',
    scheduledDate: '2026-04-27',
    executor: '李建国',
    status: 'pending',
    remark: '使用0.3%苦参碱水剂，按说明书1.5倍浓度配制',
    createdAt: '2026-04-25 09:00:00',
  },
  {
    id: 'care-002',
    type: 'turnover',
    typeName: '翻垛',
    location: 'C-02-03',
    storageType: 'cold',
    targetBatch: 'GCH-D-20260405',
    reason: '新货水分略高，需翻垛通风',
    scheduledDate: '2026-04-26',
    executor: '张明远',
    status: 'inProgress',
    createdAt: '2026-04-24 10:00:00',
  },
  {
    id: 'care-003',
    type: 'dehumidify',
    typeName: '除湿',
    location: 'A-03-05',
    storageType: 'shade',
    targetBatch: 'GCH-D-20260201',
    reason: '效期临近，加强除湿延缓变质',
    scheduledDate: '2026-04-26',
    executor: '王芳',
    status: 'pending',
    remark: '当前湿度65%，需降至55%以下',
    createdAt: '2026-04-25 11:00:00',
  },
  {
    id: 'care-004',
    type: 'check',
    typeName: '巡检',
    location: 'A-02-01',
    storageType: 'shade',
    targetBatch: 'GCH-S-20260410',
    reason: '月度例行巡检',
    scheduledDate: '2026-04-28',
    executor: '李建国',
    status: 'pending',
    createdAt: '2026-04-26 08:00:00',
  },
  {
    id: 'care-005',
    type: 'clean',
    typeName: '清洁',
    location: 'C-01-01',
    storageType: 'cold',
    targetBatch: 'GCH-F-20260420',
    reason: '鲜条入库后清洁库房',
    scheduledDate: '2026-04-25',
    executor: '张明远',
    status: 'completed',
    createdAt: '2026-04-23 09:00:00',
  },
  {
    id: 'care-006',
    type: 'fumigation',
    typeName: '熏蒸',
    location: 'B-01-03',
    storageType: 'ambient',
    targetBatch: 'GCH-P-20260412',
    reason: '微粉密封存放，定期检查并更换干燥剂',
    scheduledDate: '2026-04-20',
    executor: '王芳',
    status: 'completed',
    createdAt: '2026-04-18 10:00:00',
  },
];

// ============================================================
// 3. 加工转化（投料 → 产出）
// ============================================================

export type ProcessStatus = 'pending' | 'processing' | 'completed' | 'abnormal';

export interface ProcessRecord {
  id: string;
  processNo: string;              // 工艺单号
  inputBatchNo: string;            // 投料批次
  inputHerb: string;
  inputForm: FormType;
  inputQty: number;               // 投料量（kg）
  processType: string;             // 加工工艺
  outputForm: FormType;            // 产出形态
  expectedOutput: number;          // 理论产出（kg）
  actualOutput: number;            // 实际产出（kg）
  dryRate: number;                 // 折干率（%）
  actualDryRate: number;           // 实际折干率（%）
  lossRate: number;                // 损耗率（%）
  operator: string;
  processDate: string;
  status: ProcessStatus;
  remark?: string;
}

export interface ProcessingRecipe {
  inputForm: FormType;
  outputForm: FormType;
  processType: string;
  dryRate: number;       // 折干率（%）
  description: string;
}

export const processingRecipes: ProcessingRecipe[] = [
  { inputForm: '鲜条', outputForm: '干条',   processType: '杀青+烘干',     dryRate: 20, description: '鲜条经杀青定型后热风循环烘干' },
  { inputForm: '干条', outputForm: '切片',   processType: '切片+烘干',     dryRate: 92, description: '干条切片后烘干至含水率8%以下' },
  { inputForm: '干条', outputForm: '微粉',   processType: '超微粉碎',      dryRate: 85, description: '干条经低温超微粉碎，过200目筛' },
  { inputForm: '切片', outputForm: '微粉',   processType: '直接粉碎',      dryRate: 88, description: '石斛切片直接粉碎，过200目筛' },
];

export const processRecords: ProcessRecord[] = [
  {
    id: 'proc-001',
    processNo: 'PROC-2026-0012',
    inputBatchNo: 'GCH-F-20260418',
    inputHerb: '金钗石斛',
    inputForm: '鲜条',
    inputQty: 500,
    processType: '杀青+烘干',
    outputForm: '干条',
    expectedOutput: 100,
    actualOutput: 97.5,
    dryRate: 20,
    actualDryRate: 19.5,
    lossRate: 0.5,
    operator: '李建国',
    processDate: '2026-04-18',
    status: 'completed',
    remark: '实际出材率偏低0.5%，可能与鲜条含水率偏高有关',
  },
  {
    id: 'proc-002',
    processNo: 'PROC-2026-0013',
    inputBatchNo: 'GCH-D-20260315',
    inputHerb: '金钗石斛',
    inputForm: '干条',
    inputQty: 200,
    processType: '切片+烘干',
    outputForm: '切片',
    expectedOutput: 184,
    actualOutput: 180,
    dryRate: 92,
    actualDryRate: 90.0,
    lossRate: 2.0,
    operator: '王芳',
    processDate: '2026-04-20',
    status: 'abnormal',
    remark: '切片过程损耗偏高，主要为碎屑，需调整刀片间距',
  },
  {
    id: 'proc-003',
    processNo: 'PROC-2026-0014',
    inputBatchNo: 'GCH-D-20260328',
    inputHerb: '金钗石斛',
    inputForm: '干条',
    inputQty: 100,
    processType: '超微粉碎',
    outputForm: '微粉',
    expectedOutput: 85,
    actualOutput: 84.2,
    dryRate: 85,
    actualDryRate: 84.2,
    lossRate: 0.8,
    operator: '李建国',
    processDate: '2026-04-22',
    status: 'completed',
  },
  {
    id: 'proc-004',
    processNo: 'PROC-2026-0015',
    inputBatchNo: 'GCH-F-20260420',
    inputHerb: '金钗石斛',
    inputForm: '鲜条',
    inputQty: 800,
    processType: '杀青+烘干',
    outputForm: '干条',
    expectedOutput: 160,
    actualOutput: 158,
    dryRate: 20,
    actualDryRate: 19.75,
    lossRate: 0.25,
    operator: '张明远',
    processDate: '2026-04-24',
    status: 'completed',
  },
  {
    id: 'proc-005',
    processNo: 'PROC-2026-0016',
    inputBatchNo: 'GCH-D-20260405',
    inputHerb: '金钗石斛',
    inputForm: '干条',
    inputQty: 150,
    processType: '切片+烘干',
    outputForm: '切片',
    expectedOutput: 138,
    actualOutput: 0,
    dryRate: 92,
    actualDryRate: 0,
    lossRate: 0,
    operator: '待定',
    processDate: '2026-04-26',
    status: 'processing',
  },
];

// ============================================================
// 4. 库位可视化
// ============================================================

export type OutboundStatus = 'pending' | 'assigned' | 'picking' | 'shipped';

export interface OutboundOrder {
  id: string;
  orderNo: string;
  customerName: string;
  productName: string;
  form: FormType;
  spec: string;
  qty: number;
  unit: string;
  priority: 'normal' | 'urgent';
  status: OutboundStatus;
  assignedLocations: string[];   // 分配的库位
  pickingSequence: string[];     // 拣货路径（FIFO顺序）
  createdAt: string;
}

export interface WarehouseLocation {
  id: string;          // 如 "A-01-01"
  zone: string;        // 区域: A/B/C
  zoneLabel: string;   // 如 "A区 - 阴凉库"
  storageType: StorageType;
  row: number;         // 排
  col: number;         // 列
  capacity: number;    // 容量（kg）
  currentStock: number; // 当前库存（kg）
  status: 'empty' | 'inStock' | 'full' | 'picking'; // 空/有货/满仓/拣货中
  batchNo?: string;
  productName?: string;
}

export const warehouseZones = [
  { id: 'A', label: 'A区 - 阴凉库', storageType: 'shade' as StorageType, rows: 4, cols: 5, desc: '<20°C，适合干条/切片' },
  { id: 'B', label: 'B区 - 常温库', storageType: 'ambient' as StorageType, rows: 3, cols: 4, desc: '25-30°C，适合微粉/包装品' },
  { id: 'C', label: 'C区 - 冷藏库', storageType: 'cold' as StorageType, rows: 3, cols: 4, desc: '2-8°C，适合鲜条' },
];

// 生成全部库位网格
const generateLocations = (): WarehouseLocation[] => {
  const locations: WarehouseLocation[] = [];
  const stockMap: Record<string, { batch: string; product: string; qty: number }> = {
    'A-01-01': { batch: 'GCH-D-20260315', product: '金钗石斛 干条', qty: 800 },
    'A-01-02': { batch: 'GCH-D-20260328', product: '金钗石斛 干条', qty: 1200 },
    'A-01-03': { batch: 'GCH-D-20260315', product: '金钗石斛 干条', qty: 350 },
    'A-02-01': { batch: 'GCH-S-20260410', product: '金钗石斛 切片', qty: 420 },
    'A-02-02': { batch: 'GCH-D-20260201', product: '金钗石斛 干条', qty: 300 },
    'A-03-01': { batch: 'GCH-D-20260328', product: '金钗石斛 干条', qty: 500 },
    'A-03-03': { batch: 'GCH-D-20260328', product: '金钗石斛 干条', qty: 250 },
    'B-01-03': { batch: 'GCH-P-20260412', product: '金钗石斛 微粉', qty: 150 },
    'C-01-01': { batch: 'GCH-F-20260420', product: '金钗石斛 鲜条', qty: 200 },
    'C-01-02': { batch: 'GCH-F-20260422', product: '金钗石斛 鲜条', qty: 180 },
    'C-02-03': { batch: 'GCH-D-20260405', product: '金钗石斛 干条', qty: 550 },
    'C-03-01': { batch: 'GCH-S-20260418', product: '金钗石斛 切片', qty: 200 },
  };

  warehouseZones.forEach(zone => {
    for (let r = 1; r <= zone.rows; r++) {
      for (let c = 1; c <= zone.cols; c++) {
        const locId = `${zone.id}-${String(r).padStart(2, '0')}-${String(c).padStart(2, '0')}`;
        const stock = stockMap[locId];
        const capacity = zone.storageType === 'cold' ? 500 : zone.storageType === 'shade' ? 1500 : 800;
        locations.push({
          id: locId,
          zone: zone.id,
          zoneLabel: zone.label,
          storageType: zone.storageType,
          row: r,
          col: c,
          capacity,
          currentStock: stock?.qty ?? 0,
          status: stock ? (stock.qty >= capacity ? 'full' : 'inStock') : 'empty',
          batchNo: stock?.batch,
          productName: stock?.product,
        });
      }
    }
  });
  return locations;
};

export const warehouseLocations = generateLocations();

export const outboundOrders: OutboundOrder[] = [
  {
    id: 'out-001',
    orderNo: 'OUT-2026-0025',
    customerName: '华润三九医药股份有限公司',
    productName: '金钗石斛',
    form: '干条',
    spec: '统货（长度≥8cm）',
    qty: 50,
    unit: 'kg',
    priority: 'normal',
    status: 'pending',
    assignedLocations: [],
    pickingSequence: [],
    createdAt: '2026-04-26 09:00:00',
  },
  {
    id: 'out-002',
    orderNo: 'OUT-2026-0024',
    customerName: '华润三九医药股份有限公司',
    productName: '金钗石斛',
    form: '切片',
    spec: '厚片 3-5mm',
    qty: 100,
    unit: 'kg',
    priority: 'urgent',
    status: 'picking',
    assignedLocations: ['A-02-01'],
    pickingSequence: ['A-02-01'],
    createdAt: '2026-04-25 14:00:00',
  },
  {
    id: 'out-003',
    orderNo: 'OUT-2026-0023',
    customerName: '深圳康恩贝股份有限公司',
    productName: '金钗石斛',
    form: '干条',
    spec: '统货',
    qty: 200,
    unit: 'kg',
    priority: 'normal',
    status: 'shipped',
    assignedLocations: ['A-01-02', 'A-03-01'],
    pickingSequence: ['A-01-02', 'A-03-01'],
    createdAt: '2026-04-24 10:00:00',
  },
];

// ============================================================
// 5. 出入库历史
// ============================================================

export interface StockRecord {
  id: string;
  type: 'inbound' | 'outbound';
  orderNo: string;
  batchNo: string;
  productName: string;
  form: FormType;
  qty: number;
  unit: string;
  warehouse: string;
  location: string;
  operator: string;
  date: string;
  status: 'completed' | 'pending';
}

export const stockRecords: StockRecord[] = [
  { id: 'sr-001', type: 'inbound', orderNo: 'IN-2026-0088', batchNo: 'GCH-F-20260422', productName: '金钗石斛', form: '鲜条', qty: 180, unit: 'kg', warehouse: '赤水中心仓', location: 'C-01-02', operator: '张明远', date: '2026-04-22', status: 'completed' },
  { id: 'sr-002', type: 'inbound', orderNo: 'IN-2026-0087', batchNo: 'GCH-D-20260405', productName: '金钗石斛', form: '干条', qty: 550, unit: 'kg', warehouse: '赤水中心仓', location: 'C-02-03', operator: '李建国', date: '2026-04-05', status: 'completed' },
  { id: 'sr-003', type: 'inbound', orderNo: 'IN-2026-0086', batchNo: 'GCH-S-20260418', productName: '金钗石斛', form: '切片', qty: 200, unit: 'kg', warehouse: '赤水中心仓', location: 'C-03-01', operator: '王芳', date: '2026-04-18', status: 'completed' },
  { id: 'sr-004', type: 'outbound', orderNo: 'OUT-2026-0024', batchNo: 'GCH-S-20260410', productName: '金钗石斛', form: '切片', qty: 100, unit: 'kg', warehouse: '赤水中心仓', location: 'A-02-01', operator: '李建国', date: '2026-04-25', status: 'completed' },
  { id: 'sr-005', type: 'outbound', orderNo: 'OUT-2026-0023', batchNo: 'GCH-D-20260328', productName: '金钗石斛', form: '干条', qty: 200, unit: 'kg', warehouse: '赤水中心仓', location: 'A-01-02', operator: '张明远', date: '2026-04-24', status: 'completed' },
];

// ============================================================
// 状态映射
// ============================================================

export const INVENTORY_STATUS_MAP: Record<InventoryStatus, string> = {
  normal: '正常',
  locked: '锁定',
  expired: '过期',
};

export const INVENTORY_STATUS_COLOR_MAP: Record<InventoryStatus, string> = {
  normal: '#5db872',
  locked: '#e8a55a',
  expired: '#c64545',
};

export const CARE_STATUS_MAP: Record<CareTaskStatus, string> = {
  pending: '待执行',
  inProgress: '执行中',
  completed: '已完成',
  overdue: '已逾期',
};

export const CARE_STATUS_COLOR_MAP: Record<CareTaskStatus, string> = {
  pending: '#6c6a64',
  inProgress: '#cc785c',
  completed: '#5db872',
  overdue: '#c64545',
};

export const PROCESS_STATUS_MAP: Record<ProcessStatus, string> = {
  pending: '待加工',
  processing: '加工中',
  completed: '已完成',
  abnormal: '异常',
};

export const PROCESS_STATUS_COLOR_MAP: Record<ProcessStatus, string> = {
  pending: 'default',
  processing: 'processing',
  completed: 'success',
  abnormal: 'error',
};

export const OUTBOUND_STATUS_MAP: Record<OutboundStatus, string> = {
  pending: '待分配',
  assigned: '已分配',
  picking: '拣货中',
  shipped: '已发货',
};

export const OUTBOUND_STATUS_COLOR_MAP: Record<OutboundStatus, string> = {
  pending: 'default',
  assigned: 'cyan',
  picking: 'processing',
  shipped: 'success',
};
