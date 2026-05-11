// ============================================================
// API 通用响应结构 - 与 Python 后端标准 JSON 结构对应
// ============================================================
export interface ApiResponse<T = unknown> {
  code: number;
  data: T;
  message: string;
}

export interface PageParams {
  page: number;
  pageSize: number;
  [key: string]: unknown;
}

export interface PageResult<T = unknown> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ============================================================
// 用户与认证相关
// ============================================================
export interface UserInfo {
  id: number | string;
  username: string;
  nickname?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  roles?: string[];
  permissions?: string[];
  organization?: string;
}

export interface LoginParams {
  username: string;
  password: string;
  captcha?: string;
  captchaId?: string;
}

export interface LoginResult {
  token: string;
  refreshToken?: string;
  expiresIn?: number;
  userInfo: UserInfo;
}

// ============================================================
// 菜单相关
// ============================================================
export interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: MenuItem[];
  component?: React.ComponentType;
  redirect?: string;
  meta?: {
    title?: string;
    icon?: string;
    hidden?: boolean;
    orderNo?: number;
    keepAlive?: boolean;
    affix?: boolean;
  };
}

// ============================================================
// 种植管理相关
// ============================================================
export interface PlantingArchive {
  id: number | string;
  baseName: string;          // 基地名称
  herbName: string;         // 药材名称
  plantingArea: number;     // 种植面积（亩）
  plantDate: string;        // 种植日期
  expectedHarvestDate: string; // 预计采收期
  status: 'growing' | 'harvested' | 'abandoned';
  description?: string;
  photos?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FarmRecord {
  id: number | string;
  archiveId: number | string;
  baseName: string;
  herbName: string;
  recordType: 'fertilizing' | 'irrigating' | 'pesticide' | 'weeding' | 'inspection' | 'other';
  recordTypeName: string;
  operatorName: string;
  operateDate: string;
  description: string;
  attachments?: string[];
  createdAt: string;
}

// ============================================================
// 仓储管理相关
// ============================================================
export interface InventoryItem {
  id: number | string;
  batchNo: string;         // 批次号
  herbName: string;        // 药材名称
  specification: string;   // 规格
  quantity: number;        // 数量
  unit: string;            // 单位
  location: string;        // 库位
  warehouse: string;       // 仓库
  status: 'normal' | 'locked' | 'expired';
  productionDate: string;  // 生产日期
  validUntil: string;      // 有效期至
  supplier?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InboundOrder {
  id: number | string;
  inboundNo: string;       // 入库单号
  batchNo: string;          // 批次号
  herbName: string;
  quantity: number;
  unit: string;
  warehouse: string;
  location: string;
  supplier: string;
  inboundDate: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  inspector?: string;
  remark?: string;
  createdAt: string;
}

export interface OutboundOrder {
  id: number | string;
  outboundNo: string;      // 出库单号
  batchNo: string;
  herbName: string;
  quantity: number;
  unit: string;
  warehouse: string;
  location: string;
  customer: string;
  outboundDate: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'completed';
  handler?: string;
  remark?: string;
  createdAt: string;
}

// ============================================================
// 溯源相关
// ============================================================
export interface TraceRecord {
  id: number | string;
  traceCode: string;       // 溯源码
  herbName: string;
  batchNo: string;
  baseName: string;
  plantingDate: string;
  harvestDate: string;
  processingDate?: string;
  warehouseInDate?: string;
  currentLocation: string;
  status: 'traceable' | 'partial' | 'untraceable';
  chainCount: number;
  currentStatus: string;
  chainStatus: 'valid' | 'broken' | 'unknown';
  createdAt: string;
}

// ============================================================
// 物联网相关
// ============================================================
export interface IoTDevice {
  id: number | string;
  deviceCode: string;      // 设备编号
  deviceName: string;       // 设备名称
  deviceType: 'sensor' | 'camera' | 'gateway' | 'controller';
  location: string;
  baseName?: string;
  status: 'online' | 'offline' | 'warning';
  lastReportTime?: string;
  data?: Record<string, unknown>;
}

export interface SensorData {
  id: number | string;
  deviceId: number | string;
  deviceCode: string;
  temperature?: number;    // 温度(℃)
  humidity?: number;        // 湿度(%)
  soilTemp?: number;       // 土壤温度
  soilMoisture?: number;   // 土壤湿度
  lightIntensity?: number;  // 光照强度
  co2?: number;            // CO2浓度
  pm25?: number;
  recordTime: string;
}

// ============================================================
// 社会化服务相关
// ============================================================
export type TechGuideStatus = 'pending' | 'processing' | 'completed' | 'evaluated';
export type MachineryStatus = 'idle' | 'in_use' | 'maintenance';
export type PestControlStatus = 'planned' | 'executing' | 'completed';
export type FinanceServiceType = 'loan' | 'insurance' | 'subsidy';

export interface TechGuideRecord {
  id: number | string;
  farmerName: string;
  phone: string;
  baseName: string;
  herbName: string;
  issueType: string;
  description: string;
  appointmentDate: string;
  expertId: number | string;
  expertName: string;
  guideDate?: string;
  content?: string;
  evaluation?: number;
  status: TechGuideStatus;
  createdAt: string;
}

export interface MachineryItem {
  id: number | string;
  name: string;
  model: string;
  type: string;
  serviceArea: string;
  dailyRate: number;
  status: MachineryStatus;
  totalUses: number;
  thisMonthUses: number;
}

export interface MachineryBooking {
  id: number | string;
  machineryId: number | string;
  machineryName: string;
  farmerName: string;
  phone: string;
  baseName: string;
  bookingDate: string;
  duration: number;
  fee: number;
  status: 'booked' | 'in_use' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface PestControlTask {
  id: number | string;
  taskName: string;
  region: string;
  executeDate: string;
  drugScheme: string;
  coverageArea: number;
  farmerCount: number;
  executor: string;
  status: PestControlStatus;
  effectBefore?: number;
  effectAfter?: number;
  createdAt: string;
}

export interface FinanceService {
  id: number | string;
  applicantName: string;
  phone: string;
  baseName: string;
  serviceType: FinanceServiceType;
  amount: number;
  term: string;
  status: 'pending' | 'approved' | 'rejected' | 'disbursed';
  applyDate: string;
  reviewDate?: string;
  remark?: string;
  createdAt: string;
}

export interface Expert {
  id: number | string;
  name: string;
  title: string;
  specialty: string;
  phone: string;
  rating: number;
  totalGuides: number;
  avatar?: string;
}

// ============================================================
// 质量检测相关
// ============================================================
export type TestResult = 'pass' | 'fail' | 'pending';
export type InspectionStatus = 'submitted' | 'assigned' | 'testing' | 'reported' | 'archived';
export type WarningType = 'moisture' | 'heavyMetal' | 'pesticide' | 'expiry' | 'recall';
export type WarningLevel = 'info' | 'warning' | 'critical';

export interface QualityTestItem {
  item: string;
  itemLabel: string;
  result?: number;
  unit: string;
  limit: string;
  isPass?: boolean;
}

export interface QualityTest {
  id: number | string;
  batchNo: string;
  herbName: string;
  specification: string;
  sampleAmount: number;
  submitter: string;
  submitDate: string;
  tester?: string;
  testDate?: string;
  items: QualityTestItem[];
  overallResult: TestResult;
  status: InspectionStatus;
  reportNo?: string;
  remark?: string;
  createdAt: string;
}

export interface QualityStandard {
  id: number | string;
  name: string;
  source: 'chp2020' | 'enterprise';
  herbName: string;
  dendrobineMin: number;
  moistureMax: number;
  heavyMetalPbMax: number;
  heavyMetalCdMax: number;
  pesticideMax: number;
  microbialLimit: string;
  description?: string;
  updatedAt: string;
}

export interface QualityWarning {
  id: number | string;
  batchNo: string;
  herbName: string;
  warningType: WarningType;
  level: WarningLevel;
  description: string;
  createdAt: string;
  resolvedAt?: string;
  status: 'active' | 'resolved';
}

export interface TraceRecord {
  id: number | string;
  traceCode: string;
  batchNo: string;
  herbName: string;
  baseName: string;
  plantingDate: string;
  harvestDate: string;
  processingDate?: string;
  warehouseInDate?: string;
  currentLocation: string;
  status: 'traceable' | 'partial' | 'untraceable';
  chainCount: number;
}
// ============================================================
export type SalesOrderStatus = 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';
export type CustomerLevel = 'excellent' | 'normal' | 'new';

export interface SalesOrder {
  id: number | string;
  orderNo: string;
  customerId: number | string;
  customerName: string;
  herbName: string;
  specification: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalAmount: number;
  orderDate: string;
  status: SalesOrderStatus;
  paymentStatus: PaymentStatus;
  plannedPaymentDate?: string;
  actualPaymentDate?: string;
  logisticsNo?: string;
  remark?: string;
  createdAt: string;
}

export interface SalesCustomer {
  id: number | string;
  name: string;
  contact: string;
  phone: string;
  address: string;
  level: CustomerLevel;
  totalOrders: number;
  totalAmount: number;
  pendingAmount: number;
  creditLimit: number;
  status: 'active' | 'disabled';
  createdAt: string;
}

export interface PaymentRecord {
  id: number | string;
  orderId: number | string;
  orderNo: string;
  customerName: string;
  amount: number;
  paymentMethod: 'bank' | 'wechat' | 'alipay' | 'cash';
  paymentDate: string;
  operator: string;
  remark?: string;
  createdAt: string;
}

export interface MonthlySales {
  month: string;
  amount: number;
  orders: number;
}

export interface HerbSales {
  name: string;
  amount: number;
  quantity: number;
  proportion: number;
}

// ============================================================
// 字典 / 枚举映射
// ============================================================
export const PLANTING_STATUS_MAP: Record<PlantingArchive['status'], string> = {
  growing: '生长中',
  harvested: '已采收',
  abandoned: '已弃种',
};

export const RECORD_TYPE_MAP: Record<FarmRecord['recordType'], string> = {
  fertilizing: '施肥',
  irrigating: '灌溉',
  pesticide: '病虫害防治',
  weeding: '除草',
  inspection: '巡检',
  other: '其他',
};

export const INVENTORY_STATUS_MAP: Record<InventoryItem['status'], string> = {
  normal: '正常',
  locked: '锁定',
  expired: '过期',
};

export const INBOUND_STATUS_MAP: Record<InboundOrder['status'], string> = {
  pending: '待确认',
  confirmed: '已确认',
  completed: '已完成',
  cancelled: '已取消',
};

export const OUTBOUND_STATUS_MAP: Record<OutboundOrder['status'], string> = {
  pending: '待处理',
  confirmed: '已确认',
  shipped: '已发货',
  completed: '已完成',
};

export const DEVICE_STATUS_MAP: Record<IoTDevice['status'], string> = {
  online: '在线',
  offline: '离线',
  warning: '告警',
};

export const CHAIN_STATUS_MAP: Record<TraceRecord['chainStatus'], string> = {
  valid: '链上有效',
  broken: '链已断裂',
  unknown: '未知',
};

export const SALES_ORDER_STATUS_MAP: Record<SalesOrderStatus, string> = {
  pending: '待处理',
  paid: '已付款',
  shipped: '已发货',
  completed: '已完成',
  cancelled: '已取消',
};

export const PAYMENT_STATUS_MAP: Record<PaymentStatus, string> = {
  unpaid: '未付款',
  paid: '已付款',
  refunded: '已退款',
};

export const CUSTOMER_LEVEL_MAP: Record<CustomerLevel, string> = {
  excellent: '优质客户',
  normal: '普通客户',
  new: '新客户',
};

export const CUSTOMER_LEVEL_COLOR_MAP: Record<CustomerLevel, string> = {
  excellent: 'gold',
  normal: 'default',
  new: 'cyan',
};

export const TECH_GUIDE_STATUS_MAP: Record<TechGuideStatus, string> = {
  pending: '待处理',
  processing: '处理中',
  completed: '已完成',
  evaluated: '已评价',
};

export const TECH_GUIDE_STATUS_COLOR: Record<TechGuideStatus, string> = {
  pending: 'default',
  processing: 'processing',
  completed: 'green',
  evaluated: 'blue',
};

export const MACHINERY_STATUS_MAP: Record<MachineryStatus, string> = {
  idle: '空闲',
  in_use: '使用中',
  maintenance: '维护中',
};

export const MACHINERY_STATUS_COLOR: Record<MachineryStatus, string> = {
  idle: 'green',
  in_use: 'blue',
  maintenance: 'orange',
};

export const PEST_CONTROL_STATUS_MAP: Record<PestControlStatus, string> = {
  planned: '已计划',
  executing: '执行中',
  completed: '已完成',
};

export const PEST_CONTROL_STATUS_COLOR: Record<PestControlStatus, string> = {
  planned: 'default',
  executing: 'processing',
  completed: 'green',
};

export const FINANCE_STATUS_MAP: Record<string, string> = {
  pending: '待审核',
  approved: '已通过',
  rejected: '已驳回',
  disbursed: '已放款',
};

export const FINANCE_STATUS_COLOR: Record<string, string> = {
  pending: 'orange',
  approved: 'blue',
  rejected: 'red',
  disbursed: 'green',
};

export const FINANCE_TYPE_MAP: Record<FinanceServiceType, string> = {
  loan: '贷款申请',
  insurance: '保险投保',
  subsidy: '补贴申报',
};

export const BOOKING_STATUS_MAP: Record<string, string> = {
  booked: '已预约',
  in_use: '使用中',
  completed: '已完成',
  cancelled: '已取消',
};

export const BOOKING_STATUS_COLOR: Record<string, string> = {
  booked: 'processing',
  in_use: 'blue',
  completed: 'green',
  cancelled: 'default',
};

export const INSPECTION_STATUS_MAP: Record<InspectionStatus, string> = {
  submitted: '已提交',
  assigned: '已分配',
  testing: '检测中',
  reported: '已出报告',
  archived: '已归档',
};

export const INSPECTION_STATUS_COLOR: Record<InspectionStatus, string> = {
  submitted: 'orange',
  assigned: 'processing',
  testing: 'cyan',
  reported: 'green',
  archived: 'default',
};

export const TEST_RESULT_COLOR: Record<TestResult, string> = {
  pass: 'green',
  fail: 'red',
  pending: 'default',
};

export const WARNING_LEVEL_COLOR: Record<WarningLevel, string> = {
  info: 'blue',
  warning: 'orange',
  critical: 'red',
};

export const WARNING_TYPE_LABEL: Record<WarningType, string> = {
  moisture: '含水率异常',
  heavyMetal: '重金属超标',
  pesticide: '农药残留',
  expiry: '临近效期',
  recall: '产品召回',
};

export const TRACE_STATUS_MAP: Record<TraceRecord['status'], string> = {
  traceable: '全程可溯',
  partial: '部分可溯',
  untraceable: '链已断裂',
};

export const TRACE_STATUS_COLOR: Record<TraceRecord['status'], string> = {
  traceable: 'green',
  partial: 'orange',
  untraceable: 'red',
};

export const CHAIN_NODE_STATUS_MAP: Record<ChainNodeStatus, string> = {
  pending: '待上链',
  on_chain: '已上链',
  failed: '上链失败',
};

export const CHAIN_NODE_STATUS_COLOR: Record<ChainNodeStatus, string> = {
  pending: 'default',
  on_chain: 'green',
  failed: 'red',
};

export const CHAIN_TASK_STATUS_MAP: Record<ChainTaskStatus, string> = {
  pending: '待确认',
  confirming: '确认中',
  on_chain: '已上链',
  failed: '上链失败',
};

export const CHAIN_TASK_STATUS_COLOR: Record<ChainTaskStatus, string> = {
  pending: 'default',
  confirming: 'processing',
  on_chain: 'green',
  failed: 'red',
};

export const CHAIN_INTEGRITY_COLOR: Record<TraceIntegrity, string> = {
  intact: 'green',
  tampered: 'red',
  unknown: 'default',
};

export const CHAIN_INTEGRITY_LABEL: Record<TraceIntegrity, string> = {
  intact: '数据完整',
  tampered: '数据被篡改',
  unknown: '状态未知',
};

export const NODE_TYPE_LABEL: Record<ChainNode['nodeType'], string> = {
  planting: '田间种植',
  harvest: '采收登记',
  inspection: '质量检测',
  processing: '加工生产',
  storage: '仓储流通',
  sales: '终端销售',
};

export const NODE_TYPE_ICON: Record<ChainNode['nodeType'], string> = {
  planting: '🌱',
  harvest: '🌾',
  inspection: '🔬',
  processing: '🏭',
  storage: '🏬',
  sales: '🏪',
};

// ============================================================
// 区块链溯源相关
// ============================================================
export type ChainNodeStatus = 'pending' | 'on_chain' | 'failed';
export type ChainTaskStatus = 'pending' | 'confirming' | 'on_chain' | 'failed';
export type TraceIntegrity = 'intact' | 'tampered' | 'unknown';

export interface ChainNode {
  id: number | string;
  nodeNo: number;                    // 节点序号 1-6
  nodeName: string;                 // 节点名称
  nodeType: 'planting' | 'harvest' | 'inspection' | 'processing' | 'storage' | 'sales';
  batchNo: string;                  // 批次号
  traceCode: string;                 // 溯源码
  dataHash: string;                 // 数据哈希（SHA-256）
  prevHash: string;                  // 前一个节点的哈希
  blockHeight?: number;             // 区块高度
  txHash?: string;                  // 交易哈希
  operator: string;                  // 上链操作人
  onChainTime?: string;              // 上链时间
  status: ChainNodeStatus;
  data: Record<string, unknown>;    // 节点原始数据
  createdAt: string;
}

export interface ChainTrace {
  id: number | string;
  traceCode: string;                // 溯源码，如 7S-HERB-20260427-001
  batchNo: string;                  // 批次号
  herbName: string;
  specification: string;
  baseName: string;
  plantingDate: string;
  harvestDate: string;
  plantingNode?: ChainNode;
  harvestNode?: ChainNode;
  inspectionNode?: ChainNode;
  processingNode?: ChainNode;
  storageNode?: ChainNode;
  salesNode?: ChainNode;
  integrity: TraceIntegrity;
  integrityReport?: string;
  totalNodes: number;
  onChainNodes: number;
  createdAt: string;
}

export interface ChainTask {
  id: number | string;
  taskNo: string;                   // 任务编号
  traceCode: string;
  batchNo: string;
  herbName: string;
  nodeType: ChainNode['nodeType'];
  nodeName: string;
  status: ChainTaskStatus;
  operator: string;
  createdAt: string;
  confirmAt?: string;
  onChainAt?: string;
  failReason?: string;
}

export interface ChainStats {
  totalBatches: number;
  monthlyNew: number;
  coverageRate: number;
  integrityRate: number;
  blockHeight: number;
  totalQueries: number;
  dailyQueries: number[];
  nodeStats: { name: string; count: number; rate: number }[];
  herbStats: { name: string; count: number }[];
  townStats: { town: string; count: number }[];
  monthlyTrend: { month: string; onChain: number; queries: number }[];
}
