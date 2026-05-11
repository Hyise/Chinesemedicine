/**
 * 仓储管理系统 (WMS) — 统一 Mock 数据契约
 * 严格遵循贵州赤水金钗石斛仓储特性
 */
export type InventoryStatus = 'normal' | 'locked' | 'expired';
export type StorageType = 'cold' | 'shade' | 'ambient';
export type FormType = '鲜条' | '干条' | '切片' | '微粉';
export interface InventoryBatch {
    id: string;
    parentId: string;
    batchNo: string;
    storageType: StorageType;
    location: string;
    quantity: number;
    unit: string;
    productionDate: string;
    validUntil: string;
    status: InventoryStatus;
    supplier: string;
    moisture: number;
    appearance: string;
    certNo?: string;
    createdAt: string;
    updatedAt: string;
}
export interface InventoryProduct {
    id: string;
    name: string;
    form: FormType;
    spec: string;
    totalStock: number;
    unit: string;
    storageType: StorageType;
    avgPrice: number;
    children: InventoryBatch[];
}
export declare const storageTypeMap: Record<StorageType, {
    label: string;
    tempRange: string;
    temp: number;
    humidity: number;
    color: string;
}>;
export declare const inventoryProducts: InventoryProduct[];
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
export declare const careTaskTypes: Record<CareTaskType, {
    label: string;
    icon: string;
    color: string;
    desc: string;
}>;
export declare const careTasks: CareTask[];
export type ProcessStatus = 'pending' | 'processing' | 'completed' | 'abnormal';
export interface ProcessRecord {
    id: string;
    processNo: string;
    inputBatchNo: string;
    inputHerb: string;
    inputForm: FormType;
    inputQty: number;
    processType: string;
    outputForm: FormType;
    expectedOutput: number;
    actualOutput: number;
    dryRate: number;
    actualDryRate: number;
    lossRate: number;
    operator: string;
    processDate: string;
    status: ProcessStatus;
    remark?: string;
}
export interface ProcessingRecipe {
    inputForm: FormType;
    outputForm: FormType;
    processType: string;
    dryRate: number;
    description: string;
}
export declare const processingRecipes: ProcessingRecipe[];
export declare const processRecords: ProcessRecord[];
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
    assignedLocations: string[];
    pickingSequence: string[];
    createdAt: string;
}
export interface WarehouseLocation {
    id: string;
    zone: string;
    zoneLabel: string;
    storageType: StorageType;
    row: number;
    col: number;
    capacity: number;
    currentStock: number;
    status: 'empty' | 'inStock' | 'full' | 'picking';
    batchNo?: string;
    productName?: string;
}
export declare const warehouseZones: {
    id: string;
    label: string;
    storageType: StorageType;
    rows: number;
    cols: number;
    desc: string;
}[];
export declare const warehouseLocations: WarehouseLocation[];
export declare const outboundOrders: OutboundOrder[];
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
export declare const stockRecords: StockRecord[];
export declare const INVENTORY_STATUS_MAP: Record<InventoryStatus, string>;
export declare const INVENTORY_STATUS_COLOR_MAP: Record<InventoryStatus, string>;
export declare const CARE_STATUS_MAP: Record<CareTaskStatus, string>;
export declare const CARE_STATUS_COLOR_MAP: Record<CareTaskStatus, string>;
export declare const PROCESS_STATUS_MAP: Record<ProcessStatus, string>;
export declare const PROCESS_STATUS_COLOR_MAP: Record<ProcessStatus, string>;
export declare const OUTBOUND_STATUS_MAP: Record<OutboundStatus, string>;
export declare const OUTBOUND_STATUS_COLOR_MAP: Record<OutboundStatus, string>;
