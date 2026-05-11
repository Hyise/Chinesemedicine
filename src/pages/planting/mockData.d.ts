/**
 * 种植服务管理系统 - 统一 Mock 数据契约
 * 严格遵循贵州赤水金钗石斛产业特征
 */
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
export declare const townTreeData: Town[];
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
    soilTemp: number;
    soilMoisture: number;
    airTemp: number;
    airHumidity: number;
    lightIntensity: number;
    lastUpdate: string;
}
export declare const plantingBases: PlantingBase[];
export type FarmTaskType = 'fertilizing' | 'pesticide' | 'irrigating' | 'weeding' | 'pruning' | 'shadeNet' | 'inspection' | 'harvest' | 'other';
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
export declare const farmTaskTypes: {
    value: FarmTaskType;
    label: string;
    color: string;
    needsMaterial: boolean;
}[];
export declare const farmTasks: FarmTask[];
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
export declare const materialCategories: {
    value: MaterialCategory;
    label: string;
}[];
export declare const agriculturalMaterials: AgriculturalMaterial[];
export type OrderStatus = 'pending' | 'signed' | 'inProgress' | 'completed' | 'cancelled';
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
export declare const orders: OrderPlanting[];
export declare const BASE_STATUS_MAP: Record<BaseStatus, string>;
export declare const BASE_STATUS_COLOR_MAP: Record<BaseStatus, string>;
export declare const TASK_STATUS_MAP: Record<FarmTaskStatus, string>;
export declare const TASK_STATUS_COLOR_MAP: Record<FarmTaskStatus, string>;
export declare const ORDER_STATUS_MAP: Record<OrderStatus, string>;
export declare const ORDER_STATUS_COLOR_MAP: Record<OrderStatus, string>;
