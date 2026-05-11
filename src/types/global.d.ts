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
export interface PlantingArchive {
    id: number | string;
    baseName: string;
    herbName: string;
    plantingArea: number;
    plantDate: string;
    expectedHarvestDate: string;
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
export interface InventoryItem {
    id: number | string;
    batchNo: string;
    herbName: string;
    specification: string;
    quantity: number;
    unit: string;
    location: string;
    warehouse: string;
    status: 'normal' | 'locked' | 'expired';
    productionDate: string;
    validUntil: string;
    supplier?: string;
    createdAt: string;
    updatedAt: string;
}
export interface InboundOrder {
    id: number | string;
    inboundNo: string;
    batchNo: string;
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
    outboundNo: string;
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
export interface TraceRecord {
    id: number | string;
    traceCode: string;
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
export interface IoTDevice {
    id: number | string;
    deviceCode: string;
    deviceName: string;
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
    temperature?: number;
    humidity?: number;
    soilTemp?: number;
    soilMoisture?: number;
    lightIntensity?: number;
    co2?: number;
    pm25?: number;
    recordTime: string;
}
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
export declare const PLANTING_STATUS_MAP: Record<PlantingArchive['status'], string>;
export declare const RECORD_TYPE_MAP: Record<FarmRecord['recordType'], string>;
export declare const INVENTORY_STATUS_MAP: Record<InventoryItem['status'], string>;
export declare const INBOUND_STATUS_MAP: Record<InboundOrder['status'], string>;
export declare const OUTBOUND_STATUS_MAP: Record<OutboundOrder['status'], string>;
export declare const DEVICE_STATUS_MAP: Record<IoTDevice['status'], string>;
export declare const CHAIN_STATUS_MAP: Record<TraceRecord['chainStatus'], string>;
export declare const SALES_ORDER_STATUS_MAP: Record<SalesOrderStatus, string>;
export declare const PAYMENT_STATUS_MAP: Record<PaymentStatus, string>;
export declare const CUSTOMER_LEVEL_MAP: Record<CustomerLevel, string>;
export declare const CUSTOMER_LEVEL_COLOR_MAP: Record<CustomerLevel, string>;
export declare const TECH_GUIDE_STATUS_MAP: Record<TechGuideStatus, string>;
export declare const TECH_GUIDE_STATUS_COLOR: Record<TechGuideStatus, string>;
export declare const MACHINERY_STATUS_MAP: Record<MachineryStatus, string>;
export declare const MACHINERY_STATUS_COLOR: Record<MachineryStatus, string>;
export declare const PEST_CONTROL_STATUS_MAP: Record<PestControlStatus, string>;
export declare const PEST_CONTROL_STATUS_COLOR: Record<PestControlStatus, string>;
export declare const FINANCE_STATUS_MAP: Record<string, string>;
export declare const FINANCE_STATUS_COLOR: Record<string, string>;
export declare const FINANCE_TYPE_MAP: Record<FinanceServiceType, string>;
export declare const BOOKING_STATUS_MAP: Record<string, string>;
export declare const BOOKING_STATUS_COLOR: Record<string, string>;
export declare const INSPECTION_STATUS_MAP: Record<InspectionStatus, string>;
export declare const INSPECTION_STATUS_COLOR: Record<InspectionStatus, string>;
export declare const TEST_RESULT_COLOR: Record<TestResult, string>;
export declare const WARNING_LEVEL_COLOR: Record<WarningLevel, string>;
export declare const WARNING_TYPE_LABEL: Record<WarningType, string>;
export declare const TRACE_STATUS_MAP: Record<TraceRecord['status'], string>;
export declare const TRACE_STATUS_COLOR: Record<TraceRecord['status'], string>;
export declare const CHAIN_NODE_STATUS_MAP: Record<ChainNodeStatus, string>;
export declare const CHAIN_NODE_STATUS_COLOR: Record<ChainNodeStatus, string>;
export declare const CHAIN_TASK_STATUS_MAP: Record<ChainTaskStatus, string>;
export declare const CHAIN_TASK_STATUS_COLOR: Record<ChainTaskStatus, string>;
export declare const CHAIN_INTEGRITY_COLOR: Record<TraceIntegrity, string>;
export declare const CHAIN_INTEGRITY_LABEL: Record<TraceIntegrity, string>;
export declare const NODE_TYPE_LABEL: Record<ChainNode['nodeType'], string>;
export declare const NODE_TYPE_ICON: Record<ChainNode['nodeType'], string>;
export type ChainNodeStatus = 'pending' | 'on_chain' | 'failed';
export type ChainTaskStatus = 'pending' | 'confirming' | 'on_chain' | 'failed';
export type TraceIntegrity = 'intact' | 'tampered' | 'unknown';
export interface ChainNode {
    id: number | string;
    nodeNo: number;
    nodeName: string;
    nodeType: 'planting' | 'harvest' | 'inspection' | 'processing' | 'storage' | 'sales';
    batchNo: string;
    traceCode: string;
    dataHash: string;
    prevHash: string;
    blockHeight?: number;
    txHash?: string;
    operator: string;
    onChainTime?: string;
    status: ChainNodeStatus;
    data: Record<string, unknown>;
    createdAt: string;
}
export interface ChainTrace {
    id: number | string;
    traceCode: string;
    batchNo: string;
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
    taskNo: string;
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
    nodeStats: {
        name: string;
        count: number;
        rate: number;
    }[];
    herbStats: {
        name: string;
        count: number;
    }[];
    townStats: {
        town: string;
        count: number;
    }[];
    monthlyTrend: {
        month: string;
        onChain: number;
        queries: number;
    }[];
}
