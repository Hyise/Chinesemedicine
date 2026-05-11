/**
 * 金融服务模块 — Mock 数据
 * 以赤水金钗石斛产业链为背景
 * 目标用户：运营方 / 加工企业
 */
export declare const CHART_COLORS: {
    readonly primary: "#cc785c";
    readonly secondary: "#5db872";
    readonly accent: "#e8a55a";
    readonly teal: "#5db8a6";
    readonly success: "#5db872";
    readonly warning: "#d4a017";
    readonly error: "#c64545";
    readonly muted: "#6c6a64";
    readonly gradient: readonly ["#cc785c", "#5db8a6", "#e8a55a", "#5db872", "#c64545"];
};
export type LoanStatus = 'pending' | 'approved' | 'rejected' | 'repaying' | 'paid' | 'overdue';
export interface LoanApplication {
    id: number;
    applicantName: string;
    applicantType: '农户' | '合作社' | '加工企业';
    loanType: '种植贷款' | '收购贷款' | '加工贷款' | '扩建贷款';
    amount: number;
    term: number;
    annualRate: number;
    purpose: string;
    bank: string;
    collateral: string;
    status: LoanStatus;
    applyDate: string;
    approveDate?: string;
    repayDate?: string;
    contact: string;
    baseName?: string;
}
export declare const LOAN_STATUS_LABEL: Record<LoanStatus, string>;
export declare const loanApplications: LoanApplication[];
export declare const loanStats: {
    totalApproved: number;
    totalPending: number;
    activeLoans: number;
    overdueCount: number;
    repaidAmount: number;
    monthlyData: {
        month: string;
        approved: number;
        pending: number;
        repaid: number;
    }[];
};
export type InsuranceStatus = 'active' | 'expired' | 'claiming' | 'claimed' | 'rejected';
export type ClaimStatus = 'pending' | 'approved' | 'rejected' | 'paid';
export interface InsurancePolicy {
    id: number;
    policyNo: string;
    batchNo: string;
    herbName: string;
    baseName: string;
    insuranceType: '气象灾害险' | '质量保障险' | '综合收入险';
    insuredArea: number;
    premium: number;
    coverage: number;
    startDate: string;
    endDate: string;
    status: InsuranceStatus;
    insuranceCompany: string;
    contact: string;
}
export interface InsuranceClaim {
    id: number;
    policyNo: string;
    claimNo: string;
    claimAmount: number;
    reason: string;
    incidentDate: string;
    status: ClaimStatus;
    applyDate: string;
    approveDate?: string;
    payDate?: string;
    rejectReason?: string;
}
export declare const insurancePolicies: InsurancePolicy[];
export declare const insuranceClaims: InsuranceClaim[];
export declare const insuranceStats: {
    totalPolicies: number;
    activePolicies: number;
    totalInsuredArea: number;
    totalPremium: number;
    totalCoverage: number;
    pendingClaims: number;
    paidClaims: number;
};
export type ReceivableStatus = 'pending' | 'confirmed' | 'financed' | 'repaid';
export type FinancingStatus = 'pending' | 'approved' | 'rejected' | 'financed' | 'repaid';
export interface Receivable {
    id: number;
    receivableNo: string;
    orderNo: string;
    amount: number;
    buyer: string;
    seller: string;
    herbName: string;
    dueDate: string;
    status: ReceivableStatus;
    createDate: string;
    confirmedDate?: string;
}
export interface FinancingApplication {
    id: number;
    financingNo: string;
    receivableNo: string;
    orderNo: string;
    amount: number;
    financingRate: number;
    bank: string;
    status: FinancingStatus;
    applyDate: string;
    approveDate?: string;
    financeDate?: string;
    repayDate?: string;
}
export declare const receivables: Receivable[];
export declare const financingApplications: FinancingApplication[];
export declare const scfStats: {
    totalReceivables: number;
    totalFinanced: number;
    outstandingAmount: number;
    pendingCount: number;
    confirmedReceivables: number;
};
export type EscrowStatus = 'in_escrow' | 'verifying' | 'released' | 'refunded' | 'partial';
export interface EscrowAccount {
    id: number;
    escrowNo: string;
    orderNo: string;
    productName: string;
    totalAmount: number;
    buyer: string;
    seller: string;
    status: EscrowStatus;
    stage: '定金' | '验货中' | '尾款';
    depositAmount: number;
    verifyAmount: number;
    finalAmount: number;
    createDate: string;
    depositDate?: string;
    verifyDate?: string;
    releaseDate?: string;
}
export interface DisbursementRecord {
    id: number;
    escrowNo: string;
    orderNo: string;
    stage: '定金' | '验货款' | '尾款';
    amount: number;
    payer: string;
    payee: string;
    date: string;
    status: '已支付' | '待支付' | '已退款';
}
export declare const escrowAccounts: EscrowAccount[];
export declare const disbursementRecords: DisbursementRecord[];
export declare const escrowStats: {
    totalInEscrow: number;
    totalReleased: number;
    activeEscrow: number;
    pendingVerify: number;
    totalTransactions: number;
};
