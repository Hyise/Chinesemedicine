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
export declare const mockRuleVersions: RuleVersion[];
export declare const mockCodeBatches: CodeBatch[];
export declare const baseOptions: {
    value: string;
    label: string;
}[];
export declare const herbOptions: {
    value: string;
    label: string;
}[];
/**
 * 码的当前生命周期状态
 */
export type CodeLifeStatus = 'inactive' | 'activated' | 'inbound' | 'outbound' | 'consumed';
/** 状态中文映射 */
export declare const CODE_STATUS_LABEL: Record<CodeLifeStatus, string>;
/** 状态 Tag 颜色映射 */
export declare const CODE_STATUS_COLOR: Record<CodeLifeStatus, string>;
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
    details?: {
        label: string;
        value: string;
        url?: string;
    }[];
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
export declare const mockTrackingDetail: CodeTrackingDetail;
