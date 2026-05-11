// ============================================================
// 多码合一标识系统 - 共享类型定义
// ============================================================

/**
 * 编码规则配置
 */
export interface CodeRule {
  /** 品类前缀，如 GCH（管城黄芪） */
  categoryPrefix: string;
  /** 年份格式，YYYY 或 YY */
  yearFormat: 'YYYY' | 'YY';
  /** 产地编号长度（4-8 位） */
  originCodeLength: number;
  /** 批次号递增规则 */
  batchRule: 'daily' | 'monthly' | 'yearly';
  /** 校验位算法 */
  checkAlgorithm: 'luhn' | 'mod11' | 'none';
}

/**
 * 历史规则版本记录
 */
export interface RuleVersion {
  id: number;
  /** 版本号 */
  version: string;
  /** 规则预览（如 GCH-2025-001-0001-X） */
  rulePreview: string;
  /** 生效时间 */
  effectiveTime: string;
  /** 操作人 */
  operator: string;
  /** 状态 */
  status: 'active' | 'archived';
  /** 详细配置快照（JSON 字符串化后存储） */
  configSnapshot: string;
}

/**
 * 码生成批次记录
 */
export interface CodeBatch {
  id: number;
  /** 批次号 */
  batchNo: string;
  /** 产地基地 */
  baseName: string;
  /** 品种名称 */
  herbName: string;
  /** 规格 */
  specification: string;
  /** 生成数量 */
  quantity: number;
  /** 生成时间 */
  generatedAt: string;
  /** 操作人 */
  operator: string;
  /** 状态 */
  status: 'completed' | 'generating' | 'failed';
}

// ============================================================
// Mock 数据 - 历史规则版本
// ============================================================
export const mockRuleVersions: RuleVersion[] = [
  {
    id: 1,
    version: 'v2.1',
    rulePreview: 'GCH-2025-001-0001-X',
    effectiveTime: '2026-01-01 00:00:00',
    operator: '系统管理员',
    status: 'active',
    configSnapshot: JSON.stringify({
      categoryPrefix: 'GCH',
      yearFormat: 'YYYY',
      originCodeLength: 4,
      batchRule: 'daily',
      checkAlgorithm: 'luhn',
    }),
  },
  {
    id: 2,
    version: 'v2.0',
    rulePreview: 'GCH-24-01-001-X',
    effectiveTime: '2025-06-01 00:00:00',
    operator: '张明华',
    status: 'archived',
    configSnapshot: JSON.stringify({
      categoryPrefix: 'GCH',
      yearFormat: 'YY',
      originCodeLength: 4,
      batchRule: 'monthly',
      checkAlgorithm: 'mod11',
    }),
  },
  {
    id: 3,
    version: 'v1.5',
    rulePreview: 'GCH-001-0001',
    effectiveTime: '2025-01-01 00:00:00',
    operator: '李晓东',
    status: 'archived',
    configSnapshot: JSON.stringify({
      categoryPrefix: 'GCH',
      yearFormat: 'YYYY',
      originCodeLength: 3,
      batchRule: 'yearly',
      checkAlgorithm: 'none',
    }),
  },
  {
    id: 4,
    version: 'v1.0',
    rulePreview: 'GCH-0001-01',
    effectiveTime: '2024-07-01 00:00:00',
    operator: '王建国',
    status: 'archived',
    configSnapshot: JSON.stringify({
      categoryPrefix: 'GCH',
      yearFormat: 'YYYY',
      originCodeLength: 4,
      batchRule: 'monthly',
      checkAlgorithm: 'none',
    }),
  },
];

// ============================================================
// Mock 数据 - 生成批次记录
// ============================================================
export const mockCodeBatches: CodeBatch[] = [
  {
    id: 1,
    batchNo: 'GEN-20260423001',
    baseName: '赤水官渡镇石斛基地',
    herbName: '金钗石斛鲜条',
    specification: '5g/支，20支/盒',
    quantity: 5000,
    generatedAt: '2026-04-23 10:30:00',
    operator: '张明华',
    status: 'completed',
  },
  {
    id: 2,
    batchNo: 'GEN-20260422003',
    baseName: '赤水长期石斛产业园',
    herbName: '金钗石斛干条',
    specification: '50g/袋',
    quantity: 2000,
    generatedAt: '2026-04-22 14:20:00',
    operator: '李晓东',
    status: 'completed',
  },
  {
    id: 3,
    batchNo: 'GEN-20260423002',
    baseName: '赤水大同石斛合作社',
    herbName: '金钗石斛鲜条',
    specification: '10g/支，10支/盒',
    quantity: 8000,
    generatedAt: '2026-04-23 09:15:00',
    operator: '张明华',
    status: 'generating',
  },
  {
    id: 4,
    batchNo: 'GEN-20260421005',
    baseName: '赤水旺隆石斛种植园',
    herbName: '金钗石斛枫斗',
    specification: '3g/颗，10颗/盒',
    quantity: 3000,
    generatedAt: '2026-04-21 16:45:00',
    operator: '王建国',
    status: 'completed',
  },
  {
    id: 5,
    batchNo: 'GEN-20260420008',
    baseName: '赤水官渡镇石斛基地',
    herbName: '金钗石斛原浆',
    specification: '30ml/瓶，6瓶/盒',
    quantity: 10000,
    generatedAt: '2026-04-20 11:00:00',
    operator: '陈志强',
    status: 'completed',
  },
  {
    id: 6,
    batchNo: 'GEN-20260419011',
    baseName: '赤水长期石斛产业园',
    herbName: '金钗石斛粉',
    specification: '2g/袋，20袋/盒',
    quantity: 1500,
    generatedAt: '2026-04-19 08:30:00',
    operator: '张明华',
    status: 'failed',
  },
  {
    id: 7,
    batchNo: 'GEN-20260418009',
    baseName: '赤水丙安石斛示范园',
    herbName: '金钗石斛鲜条',
    specification: '8g/支，15支/盒',
    quantity: 4500,
    generatedAt: '2026-04-18 15:20:00',
    operator: '李晓东',
    status: 'completed',
  },
  {
    id: 8,
    batchNo: 'GEN-20260417004',
    baseName: '赤水大同石斛合作社',
    herbName: '金钗石斛干条',
    specification: '100g/袋',
    quantity: 2200,
    generatedAt: '2026-04-17 13:10:00',
    operator: '王建国',
    status: 'completed',
  },
];

// ============================================================
// Mock 数据 - 产地基地选项（用于 Select）
// ============================================================
export const baseOptions = [
  { value: 'chishui-guandu', label: '赤水官渡镇石斛基地' },
  { value: 'chishui-changqi', label: '赤水长期石斛产业园' },
  { value: 'chishui-datong', label: '赤水大同石斛合作社' },
  { value: 'chishui-wanglong', label: '赤水旺隆石斛种植园' },
  { value: 'chishui-bingan', label: '赤水丙安石斛示范园' },
  { value: 'chishui-tiantai', label: '赤水天台石斛林下经济园' },
];

// ============================================================
// Mock 数据 - 品种选项（用于 Select）
// ============================================================
export const herbOptions = [
  { value: 'jinchai-fresh', label: '金钗石斛鲜条' },
  { value: 'jinchai-dry', label: '金钗石斛干条' },
  { value: 'jinchai-fengdou', label: '金钗石斛枫斗' },
  { value: 'jinchai-jiang', label: '金钗石斛原浆' },
  { value: 'jinchai-powder', label: '金钗石斛粉' },
  { value: 'tiepi-fresh', label: '铁皮石斛鲜条' },
  { value: 'tiepi-dry', label: '铁皮石斛枫斗' },
];

// ============================================================
// 码状态追踪 - 嵌套数据结构
// ============================================================

/**
 * 码的当前生命周期状态
 */
export type CodeLifeStatus =
  | 'inactive'    // 未激活
  | 'activated'    // 已激活（种植建档后）
  | 'inbound'      // 已入库
  | 'outbound'     // 已出库
  | 'consumed';    // 已被扫码消费

/** 状态中文映射 */
export const CODE_STATUS_LABEL: Record<CodeLifeStatus, string> = {
  inactive: '未激活',
  activated: '已激活（种植建档）',
  inbound: '已入库',
  outbound: '已出库',
  consumed: '已被扫码消费',
};

/** 状态 Tag 颜色映射 */
export const CODE_STATUS_COLOR: Record<CodeLifeStatus, string> = {
  inactive: 'default',
  activated: 'blue',
  inbound: 'cyan',
  outbound: 'orange',
  consumed: 'green',
};

/**
 * 码生命周期的单个流转节点
 */
export interface LifeCycleNode {
  /** 环节名称 */
  name: string;
  /** 发生时间 */
  time: string;
  /** 操作人/执行主体 */
  operator: string;
  /** 附加信息（键值对数组，方便 Descriptions 展示） */
  details?: { label: string; value: string; url?: string }[];
  /** 环节类型，用于颜色和图标区分 */
  type: 'issue' | 'planting' | 'quality' | 'warehouse' | 'logistics' | 'consumer';
}

/**
 * 码状态追踪的完整详情（嵌套结构）
 */
export interface CodeTrackingDetail {
  /** 码值 */
  code: string;
  /** 关联批次号 */
  batchNo: string;
  /** 药材品名 */
  herbName: string;
  /** 规格 */
  specification: string;
  /** 产地基地 */
  baseName: string;
  /** 当前状态 */
  status: CodeLifeStatus;
  /** 累计被扫码次数 */
  scanCount: number;
  /** 首次扫码时间 */
  firstScanTime?: string;
  /** 首次扫码地点 */
  firstScanLocation?: string;
  /** 生成时间 */
  generatedAt: string;
  /** 生命周期流转节点列表 */
  lifeCycle: LifeCycleNode[];
}

// ============================================================
// Mock 数据 - 码状态追踪（金钗石斛全链路示例）
// ============================================================
export const mockTrackingDetail: CodeTrackingDetail = {
  code: 'GCH-2026-001-0001-7',
  batchNo: 'GEN-20260423001',
  herbName: '金钗石斛鲜条',
  specification: '5g/支，20支/盒',
  baseName: '赤水官渡镇石斛基地',
  status: 'consumed',
  scanCount: 12,
  firstScanTime: '2026-04-22 14:32:18',
  firstScanLocation: '贵州遵义',
  generatedAt: '2026-04-23 10:30:00',
  lifeCycle: [
    {
      name: '系统赋码',
      time: '2026-04-23 10:30:00',
      operator: '张明华',
      type: 'issue',
      details: [
        { label: '批次号', value: 'GEN-20260423001' },
        { label: '生成数量', value: '5000 枚' },
        { label: '编码规则', value: 'GCH-YYYY-NNNN-NNNN-C' },
      ],
    },
    {
      name: '种植建档',
      time: '2026-04-23 11:15:00',
      operator: '赵技术员',
      type: 'planting',
      details: [
        { label: '基地名称', value: '赤水官渡镇石斛基地' },
        { label: '地块编号', value: 'GD-001' },
        { label: '种植时间', value: '2026-04-10' },
        { label: '预计采收', value: '2026-09-01' },
      ],
    },
    {
      name: '质检合格',
      time: '2026-04-23 14:00:00',
      operator: '贵州中药检验中心',
      type: 'quality',
      details: [
        { label: '检测机构', value: '贵州省中药材质量检验中心' },
        { label: '报告编号', value: 'GZ-QC-20260423-0001' },
        { label: '检测结论', value: '符合《中国药典》2025 版一部要求' },
        { label: '质检报告', value: '查看PDF', url: '#/quality-control/report/GZ-QC-20260423-0001' },
      ],
    },
    {
      name: '产地仓入库',
      time: '2026-04-23 15:30:00',
      operator: '李仓管',
      type: 'warehouse',
      details: [
        { label: '仓库', value: '赤水农产品产地仓' },
        { label: '库区/库位', value: 'A区-03-12' },
        { label: '入库单号', value: 'RK-20260423-001' },
        { label: '入库温湿度', value: '温度 18.5℃，湿度 55%' },
        { label: '存储方式', value: '冷链冷藏 2-8℃' },
      ],
    },
    {
      name: '物流发货',
      time: '2026-04-24 08:00:00',
      operator: '顺丰速运',
      type: 'logistics',
      details: [
        { label: '承运商', value: '顺丰速运' },
        { label: '运单号', value: 'SF1234567890123' },
        { label: '发货地址', value: '贵州省遵义市赤水市三十里河畔大道 88 号' },
        { label: '收货地址', value: '贵州省遵义市红花岗区解放路 123 号' },
        { label: '运输温湿度', value: '温度 16.2℃，湿度 52%（冷链车）' },
      ],
    },
    {
      name: '终端扫码',
      time: '2026-04-22 14:32:18',
      operator: '消费者（手机尾号 3721）',
      type: 'consumer',
      details: [
        { label: '扫码时间', value: '2026-04-22 14:32:18' },
        { label: '扫码 IP 属地', value: '贵州遵义' },
        { label: '扫码设备', value: 'iPhone 15 Pro / iOS 17.4' },
        { label: '本次扫码内容', value: '防伪验证成功 · 查看溯源报告' },
      ],
    },
  ],
};
