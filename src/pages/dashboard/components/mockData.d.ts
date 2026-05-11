/**
 * 产业大脑数据平台 - 共享 Mock 数据
 * 以赤水金钗石斛产业链为背景
 */
export declare const CHART_COLORS: {
    readonly primary: "#cc785c";
    readonly secondary: "#5db872";
    readonly accent: "#e8a55a";
    readonly purple: "#8e8b82";
    readonly pink: "#c64545";
    readonly orange: "#d4a017";
    readonly red: "#c64545";
    readonly green: "#5db872";
    readonly blue: "#5db8a6";
    readonly teal: "#5db8a6";
    readonly indigo: "#5db8a6";
    readonly amber: "#e8a55a";
    readonly gradient: readonly ["#cc785c", "#5db8a6", "#e8a55a", "#5db872", "#c64545"];
};
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
export declare const kpiData: KpiData[];
export interface ResourcePoint {
    name: string;
    type: 'base' | 'factory' | 'warehouse';
    value: number;
    coord: [number, number];
    description: string;
}
export declare const resourcePoints: ResourcePoint[];
export interface ProductionMonth {
    month: string;
    plannedArea: number;
    actualOutput: number;
}
export declare const productionData: ProductionMonth[];
export interface QualityBatch {
    batchNo: string;
    batchName: string;
    dendrobine: number;
    moisture: number;
    heavyMetalPb: number;
    heavyMetalCd: number;
    pesticide: number;
    totalScore: number;
}
export declare const qualityData: QualityBatch[];
export declare const radarIndicators: {
    name: string;
    max: number;
}[];
export interface TradeItem {
    rank: number;
    product: string;
    category: string;
    volume: number;
    amount: number;
    trend: number;
    trendUp: boolean;
}
export declare const tradeData: TradeItem[];
export interface MarketRegion {
    region: string;
    proportion: number;
    amount: number;
    buyerCount: number;
}
export declare const marketRegionData: MarketRegion[];
export interface SocialServiceMonth {
    month: string;
    techGuide: number;
    machineryRent: number;
    unifiedControl: number;
}
export declare const socialServiceData: SocialServiceMonth[];
export interface FinanceMonth {
    month: string;
    loanAmount: number;
    insuranceCoverage: number;
}
export declare const financeData: FinanceMonth[];
