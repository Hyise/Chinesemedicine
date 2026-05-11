/**
 * 金融服务模块 — Mock 数据
 * 以赤水金钗石斛产业链为背景
 * 目标用户：运营方 / 加工企业
 */

// ============================================================
// 全局色彩主题 — Claude Design System
// ============================================================
export const CHART_COLORS = {
  primary: '#cc785c',
  secondary: '#5db872',
  accent: '#e8a55a',
  teal: '#5db8a6',
  success: '#5db872',
  warning: '#d4a017',
  error: '#c64545',
  muted: '#6c6a64',
  gradient: ['#cc785c', '#5db8a6', '#e8a55a', '#5db872', '#c64545'],
} as const;

// ============================================================
// 1. 助农贷款
// ============================================================
export type LoanStatus = 'pending' | 'approved' | 'rejected' | 'repaying' | 'paid' | 'overdue';

export interface LoanApplication {
  id: number;
  applicantName: string;
  applicantType: '农户' | '合作社' | '加工企业';
  loanType: '种植贷款' | '收购贷款' | '加工贷款' | '扩建贷款';
  amount: number;         // 万元
  term: number;          // 月
  annualRate: number;    // %
  purpose: string;
  bank: string;
  collateral: string;  // 抵押物
  status: LoanStatus;
  applyDate: string;
  approveDate?: string;
  repayDate?: string;
  contact: string;
  baseName?: string;
}

export const LOAN_STATUS_LABEL: Record<LoanStatus, string> = {
  pending: '审批中',
  approved: '已放款',
  rejected: '已拒绝',
  repaying: '还款中',
  paid: '已结清',
  overdue: '已逾期',
};

export const loanApplications: LoanApplication[] = [
  {
    id: 1, applicantName: '赤水市官渡镇石斛合作社', applicantType: '合作社',
    loanType: '种植贷款', amount: 80, term: 12, annualRate: 3.85,
    purpose: '购买有机肥、农膜，支付人工管护费用', bank: '赤水市农村信用合作社',
    collateral: '合作社成员联保+种植合同', status: 'repaying',
    applyDate: '2025-09-15', approveDate: '2025-09-28', repayDate: '2026-09-28',
    contact: '张社长 138xxxx1234', baseName: '官渡镇林下经济示范园',
  },
  {
    id: 2, applicantName: '李农户', applicantType: '农户',
    loanType: '种植贷款', amount: 15, term: 6, annualRate: 3.65,
    purpose: '购买石斛种苗、农资', bank: '赤水市农业银行',
    collateral: '农村宅基地+种植协议', status: 'paid',
    applyDate: '2025-06-10', approveDate: '2025-06-20', repayDate: '2025-12-20',
    contact: '李农户 139xxxx5678', baseName: '长期镇石斛产业园',
  },
  {
    id: 3, applicantName: '贵州石斛生物科技有限公司', applicantType: '加工企业',
    loanType: '加工贷款', amount: 300, term: 24, annualRate: 4.35,
    purpose: '枫斗生产线设备采购', bank: '贵州省农村信用合作社',
    collateral: '厂房抵押+设备抵押', status: 'repaying',
    applyDate: '2025-11-01', approveDate: '2025-11-20', repayDate: '2027-11-20',
    contact: '王经理 186xxxx9012',
  },
  {
    id: 4, applicantName: '大同镇中药材种植协会', applicantType: '合作社',
    loanType: '收购贷款', amount: 120, term: 9, annualRate: 3.95,
    purpose: '收购会员农户石斛鲜条', bank: '中国农业银行赤水支行',
    collateral: '产地仓存货质押', status: 'approved',
    applyDate: '2026-02-10', approveDate: '2026-02-25',
    contact: '陈会长 137xxxx3456', baseName: '大同镇石斛合作社',
  },
  {
    id: 5, applicantName: '王农户', applicantType: '农户',
    loanType: '扩建贷款', amount: 25, term: 18, annualRate: 3.85,
    purpose: '扩种林下石斛种植规模30亩', bank: '赤水市农村信用合作社',
    collateral: '林地承包权质押', status: 'pending',
    applyDate: '2026-04-20',
    contact: '王农户 135xxxx7890', baseName: '丙安镇石斛示范园',
  },
  {
    id: 6, applicantName: '旺隆镇石斛产业基地', applicantType: '合作社',
    loanType: '种植贷款', amount: 60, term: 12, annualRate: 3.75,
    purpose: '有机石斛种植基地运营费用', bank: '中国银行赤水支行',
    collateral: '农产品收益权质押', status: 'approved',
    applyDate: '2026-03-01', approveDate: '2026-03-15',
    contact: '刘社长 133xxxx2345',
  },
  {
    id: 7, applicantName: '贵州石斛生物科技有限公司', applicantType: '加工企业',
    loanType: '加工贷款', amount: 200, term: 18, annualRate: 4.2,
    purpose: '石斛原浆提取生产线改造', bank: '贵州省农村信用合作社',
    collateral: '专利权质押+厂房抵押', status: 'pending',
    applyDate: '2026-04-25',
    contact: '王经理 186xxxx9012',
  },
  {
    id: 8, applicantName: '张农户', applicantType: '农户',
    loanType: '种植贷款', amount: 10, term: 6, annualRate: 3.65,
    purpose: '购买石斛种苗', bank: '赤水市农业银行',
    collateral: '种植协议担保', status: 'overdue',
    applyDate: '2025-04-05', approveDate: '2025-04-15', repayDate: '2025-10-15',
    contact: '张农户 138xxxx3456', baseName: '官渡镇石斛林下经济示范园',
  },
];

export const loanStats = {
  totalApproved: loanApplications.filter(l => ['approved', 'repaying', 'paid', 'overdue'].includes(l.status)).reduce((s, l) => s + l.amount, 0),
  totalPending: loanApplications.filter(l => l.status === 'pending').reduce((s, l) => s + l.amount, 0),
  activeLoans: loanApplications.filter(l => l.status === 'repaying').length,
  overdueCount: loanApplications.filter(l => l.status === 'overdue').length,
  repaidAmount: loanApplications.filter(l => l.status === 'paid').reduce((s, l) => s + l.amount, 0),
  monthlyData: [
    { month: '2025-07', approved: 2, pending: 1, repaid: 1 },
    { month: '2025-08', approved: 3, pending: 2, repaid: 2 },
    { month: '2025-09', approved: 4, pending: 1, repaid: 1 },
    { month: '2025-10', approved: 2, pending: 2, repaid: 3 },
    { month: '2025-11', approved: 5, pending: 3, repaid: 1 },
    { month: '2025-12', approved: 3, pending: 1, repaid: 4 },
    { month: '2026-01', approved: 4, pending: 2, repaid: 2 },
    { month: '2026-02', approved: 6, pending: 3, repaid: 2 },
    { month: '2026-03', approved: 5, pending: 2, repaid: 3 },
    { month: '2026-04', approved: 3, pending: 4, repaid: 2 },
  ],
};

// ============================================================
// 2. 农业保险
// ============================================================
export type InsuranceStatus = 'active' | 'expired' | 'claiming' | 'claimed' | 'rejected';
export type ClaimStatus = 'pending' | 'approved' | 'rejected' | 'paid';

export interface InsurancePolicy {
  id: number;
  policyNo: string;
  batchNo: string;
  herbName: string;
  baseName: string;
  insuranceType: '气象灾害险' | '质量保障险' | '综合收入险';
  insuredArea: number;  // 亩
  premium: number;         // 元
  coverage: number;      // 元
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

export const insurancePolicies: InsurancePolicy[] = [
  {
    id: 1, policyNo: 'INS-CHI-2026-001', batchNo: 'GZ-CHI-20260401-A',
    herbName: '金钗石斛', baseName: '官渡镇林下经济示范园',
    insuranceType: '气象灾害险', insuredArea: 100, premium: 8000, coverage: 200000,
    startDate: '2026-01-01', endDate: '2026-12-31',
    status: 'active', insuranceCompany: '太平洋农业保险贵州分公司',
    contact: '张社长 138xxxx1234',
  },
  {
    id: 2, policyNo: 'INS-CHI-2026-002', batchNo: 'GZ-CHI-20260402-B',
    herbName: '金钗石斛', baseName: '长期镇石斛产业园',
    insuranceType: '综合收入险', insuredArea: 200, premium: 22000, coverage: 600000,
    startDate: '2026-01-01', endDate: '2026-12-31',
    status: 'active', insuranceCompany: '中国人保财险赤水支公司',
    contact: '李社长 139xxxx5678',
  },
  {
    id: 3, policyNo: 'INS-CHI-2025-008', batchNo: 'GZ-CHI-20250401-C',
    herbName: '金钗石斛', baseName: '大同镇石斛合作社',
    insuranceType: '质量保障险', insuredArea: 80, premium: 12000, coverage: 300000,
    startDate: '2025-01-01', endDate: '2025-12-31',
    status: 'expired', insuranceCompany: '太平洋农业保险贵州分公司',
    contact: '陈会长 137xxxx3456',
  },
  {
    id: 4, policyNo: 'INS-CHI-2026-003', batchNo: 'GZ-CHI-20260403-D',
    herbName: '金钗石斛', baseName: '旺隆镇石斛产业基地',
    insuranceType: '气象灾害险', insuredArea: 120, premium: 9600, coverage: 240000,
    startDate: '2026-03-01', endDate: '2027-02-28',
    status: 'active', insuranceCompany: '中国人保财险赤水支公司',
    contact: '刘社长 133xxxx2345',
  },
  {
    id: 5, policyNo: 'INS-CHI-2026-004', batchNo: 'GZ-CHI-20260404-E',
    herbName: '金钗石斛', baseName: '丙安镇石斛示范园',
    insuranceType: '综合收入险', insuredArea: 60, premium: 9000, coverage: 180000,
    startDate: '2026-04-01', endDate: '2027-03-31',
    status: 'claiming', insuranceCompany: '中华联合农业保险',
    contact: '赵农户 135xxxx7890',
  },
];

export const insuranceClaims: InsuranceClaim[] = [
  {
    id: 1, policyNo: 'INS-CHI-2026-004', claimNo: 'CLM-CHI-2026-001',
    claimAmount: 45000, reason: '2026年4月暴雨导致石斛种植区积水，植株受损约15亩',
    incidentDate: '2026-04-15', status: 'pending',
    applyDate: '2026-04-18',
  },
  {
    id: 2, policyNo: 'INS-CHI-2025-008', claimNo: 'CLM-CHI-2025-003',
    claimAmount: 28000, reason: '8月持续高温干旱，造成石斛植株叶片枯黄，品质下降',
    incidentDate: '2025-08-12', status: 'paid',
    applyDate: '2025-08-15', approveDate: '2025-08-28', payDate: '2025-09-05',
  },
  {
    id: 3, policyNo: 'INS-CHI-2025-008', claimNo: 'CLM-CHI-2025-004',
    claimAmount: 60000, reason: '病虫害爆发，粉蚧大量繁殖导致石斛减产严重',
    incidentDate: '2025-10-05', status: 'rejected',
    applyDate: '2025-10-08', approveDate: '2025-10-20',
    rejectReason: '该病虫害属于管理不当造成，不在综合收入险保障范围内',
  },
];

export const insuranceStats = {
  totalPolicies: 5,
  activePolicies: insurancePolicies.filter(p => p.status === 'active').length,
  totalInsuredArea: insurancePolicies.reduce((s, p) => s + p.insuredArea, 0),
  totalPremium: insurancePolicies.reduce((s, p) => s + p.premium, 0),
  totalCoverage: insurancePolicies.reduce((s, p) => s + p.coverage, 0),
  pendingClaims: insuranceClaims.filter(c => c.status === 'pending').length,
  paidClaims: insuranceClaims.filter(c => c.status === 'paid').length,
};

// ============================================================
// 3. 供应链金融（应收账款融资）
// ============================================================
export type ReceivableStatus = 'pending' | 'confirmed' | 'financed' | 'repaid';
export type FinancingStatus = 'pending' | 'approved' | 'rejected' | 'financed' | 'repaid';

export interface Receivable {
  id: number;
  receivableNo: string;
  orderNo: string;
  amount: number;       // 万元
  buyer: string;       // 核心企业（采购商）
  seller: string;       // 供应商（合作社/农户）
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
  amount: number;     // 融资额
  financingRate: number;  // 年化利率 %
  bank: string;
  status: FinancingStatus;
  applyDate: string;
  approveDate?: string;
  financeDate?: string;
  repayDate?: string;
}

export const receivables: Receivable[] = [
  {
    id: 1, receivableNo: 'RCV-2026-001', orderNo: 'XS-2026042201',
    amount: 58.6, buyer: '华润三九医药股份有限公司',
    seller: '贵州石斛生物科技有限公司', herbName: '金钗石斛枫斗',
    dueDate: '2026-07-22', status: 'confirmed',
    createDate: '2026-04-22', confirmedDate: '2026-04-22',
  },
  {
    id: 2, receivableNo: 'RCV-2026-002', orderNo: 'XS-2026042203',
    amount: 36.2, buyer: '安徽亳州药材市场A区23号商铺',
    seller: '赤水市官渡镇石斛合作社', herbName: '金钗石斛枫斗',
    dueDate: '2026-07-18', status: 'financed',
    createDate: '2026-04-18', confirmedDate: '2026-04-18',
  },
  {
    id: 3, receivableNo: 'RCV-2026-003', orderNo: 'XS-2026042501',
    amount: 24.8, buyer: '赤水源中药材合作社',
    seller: '大同镇中药材种植协会', herbName: '金钗石斛切片',
    dueDate: '2026-07-25', status: 'confirmed',
    createDate: '2026-04-25', confirmedDate: '2026-04-25',
  },
  {
    id: 4, receivableNo: 'RCV-2026-004', orderNo: 'XS-2026042701',
    amount: 82.0, buyer: '华润三九医药股份有限公司',
    seller: '贵州石斛生物科技有限公司', herbName: '金钗石斛原浆',
    dueDate: '2026-07-27', status: 'pending',
    createDate: '2026-04-27',
  },
  {
    id: 5, receivableNo: 'RCV-2026-005', orderNo: 'XS-2026031502',
    amount: 15.6, buyer: '广州清平药材市场B区7号商铺',
    seller: '长期镇石斛合作社', herbName: '金钗石斛鲜条',
    dueDate: '2026-06-15', status: 'repaid',
    createDate: '2026-03-15', confirmedDate: '2026-03-15',
  },
];

export const financingApplications: FinancingApplication[] = [
  {
    id: 1, financingNo: 'FIN-2026-001', receivableNo: 'RCV-2026-002',
    orderNo: 'XS-2026042203', amount: 30.0, financingRate: 4.8,
    bank: '贵州省农村信用合作社', status: 'financed',
    applyDate: '2026-04-19', approveDate: '2026-04-20',
    financeDate: '2026-04-21', repayDate: '2026-07-18',
  },
  {
    id: 2, financingNo: 'FIN-2026-002', receivableNo: 'RCV-2026-001',
    orderNo: 'XS-2026042201', amount: 50.0, financingRate: 4.5,
    bank: '中国农业银行赤水支行', status: 'approved',
    applyDate: '2026-04-23',
  },
  {
    id: 3, financingNo: 'FIN-2026-003', receivableNo: 'RCV-2026-003',
    orderNo: 'XS-2026042501', amount: 20.0, financingRate: 5.0,
    bank: '中国银行赤水支行', status: 'pending',
    applyDate: '2026-04-26',
  },
];

export const scfStats = {
  totalReceivables: receivables.reduce((s, r) => s + r.amount, 0),
  totalFinanced: financingApplications.filter(f => ['financed', 'repaid'].includes(f.status)).reduce((s, f) => s + f.amount, 0),
  outstandingAmount: financingApplications.filter(f => f.status === 'financed').reduce((s, f) => s + f.amount, 0),
  pendingCount: financingApplications.filter(f => f.status === 'pending').length,
  confirmedReceivables: receivables.filter(r => r.status === 'confirmed').length,
};

// ============================================================
// 4. 资金托管
// ============================================================
export type EscrowStatus = 'in_escrow' | 'verifying' | 'released' | 'refunded' | 'partial';

export interface EscrowAccount {
  id: number;
  escrowNo: string;
  orderNo: string;
  productName: string;
  totalAmount: number;    // 总托管金额 万元
  buyer: string;
  seller: string;
  status: EscrowStatus;
  stage: '定金' | '验货中' | '尾款';
  depositAmount: number;  // 定金
  verifyAmount: number;    // 验货款
  finalAmount: number;     // 尾款
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

export const escrowAccounts: EscrowAccount[] = [
  {
    id: 1, escrowNo: 'ESC-2026-001', orderNo: 'XS-2026042201',
    productName: '金钗石斛枫斗（统货）', totalAmount: 58.6,
    buyer: '华润三九医药股份有限公司',
    seller: '贵州石斛生物科技有限公司',
    status: 'in_escrow', stage: '定金',
    depositAmount: 11.72, verifyAmount: 29.3, finalAmount: 17.58,
    createDate: '2026-04-22', depositDate: '2026-04-22',
  },
  {
    id: 2, escrowNo: 'ESC-2026-002', orderNo: 'XS-2026042203',
    productName: '金钗石斛枫斗（特级）', totalAmount: 36.2,
    buyer: '安徽亳州药材市场A区23号商铺',
    seller: '赤水市官渡镇石斛合作社',
    status: 'verifying', stage: '验货中',
    depositAmount: 7.24, verifyAmount: 18.1, finalAmount: 10.86,
    createDate: '2026-04-18', depositDate: '2026-04-18',
    verifyDate: '2026-04-25',
  },
  {
    id: 3, escrowNo: 'ESC-2026-003', orderNo: 'XS-2026042501',
    productName: '金钗石斛切片（优等）', totalAmount: 24.8,
    buyer: '赤水源中药材合作社',
    seller: '大同镇中药材种植协会',
    status: 'released', stage: '尾款',
    depositAmount: 4.96, verifyAmount: 12.4, finalAmount: 7.44,
    createDate: '2026-04-25', depositDate: '2026-04-25',
    verifyDate: '2026-04-28', releaseDate: '2026-04-28',
  },
  {
    id: 4, escrowNo: 'ESC-2026-004', orderNo: 'XS-2026042701',
    productName: '金钗石斛原浆', totalAmount: 82.0,
    buyer: '华润三九医药股份有限公司',
    seller: '贵州石斛生物科技有限公司',
    status: 'in_escrow', stage: '定金',
    depositAmount: 16.4, verifyAmount: 41.0, finalAmount: 24.6,
    createDate: '2026-04-27', depositDate: '2026-04-27',
  },
  {
    id: 5, escrowNo: 'ESC-2026-005', orderNo: 'XS-2026031502',
    productName: '金钗石斛鲜条', totalAmount: 15.6,
    buyer: '广州清平药材市场B区7号商铺',
    seller: '长期镇石斛合作社',
    status: 'released', stage: '尾款',
    depositAmount: 3.12, verifyAmount: 7.8, finalAmount: 4.68,
    createDate: '2026-03-15', depositDate: '2026-03-15',
    verifyDate: '2026-03-20', releaseDate: '2026-03-21',
  },
];

export const disbursementRecords: DisbursementRecord[] = [
  { id: 1, escrowNo: 'ESC-2026-001', orderNo: 'XS-2026042201', stage: '定金', amount: 11.72, payer: '华润三九医药股份有限公司', payee: '贵州石斛生物科技有限公司', date: '2026-04-22', status: '已支付' },
  { id: 2, escrowNo: 'ESC-2026-002', orderNo: 'XS-2026042203', stage: '定金', amount: 7.24, payer: '安徽亳州药材市场A区23号商铺', payee: '赤水市官渡镇石斛合作社', date: '2026-04-18', status: '已支付' },
  { id: 3, escrowNo: 'ESC-2026-002', orderNo: 'XS-2026042203', stage: '验货款', amount: 18.1, payer: '安徽亳州药材市场A区23号商铺', payee: '赤水市官渡镇石斛合作社', date: '2026-04-25', status: '已支付' },
  { id: 4, escrowNo: 'ESC-2026-003', orderNo: 'XS-2026042501', stage: '定金', amount: 4.96, payer: '赤水源中药材合作社', payee: '大同镇中药材种植协会', date: '2026-04-25', status: '已支付' },
  { id: 5, escrowNo: 'ESC-2026-003', orderNo: 'XS-2026042501', stage: '验货款', amount: 12.4, payer: '赤水源中药材合作社', payee: '大同镇中药材种植协会', date: '2026-04-28', status: '已支付' },
  { id: 6, escrowNo: 'ESC-2026-003', orderNo: 'XS-2026042501', stage: '尾款', amount: 7.44, payer: '赤水源中药材合作社', payee: '大同镇中药材种植协会', date: '2026-04-28', status: '已支付' },
  { id: 7, escrowNo: 'ESC-2026-004', orderNo: 'XS-2026042701', stage: '定金', amount: 16.4, payer: '华润三九医药股份有限公司', payee: '贵州石斛生物科技有限公司', date: '2026-04-27', status: '已支付' },
  { id: 8, escrowNo: 'ESC-2026-005', orderNo: 'XS-2026031502', stage: '定金', amount: 3.12, payer: '广州清平药材市场B区7号商铺', payee: '长期镇石斛合作社', date: '2026-03-15', status: '已支付' },
];

export const escrowStats = {
  totalInEscrow: escrowAccounts.filter(e => ['in_escrow', 'verifying'].includes(e.status)).reduce((s, e) => s + e.totalAmount, 0),
  totalReleased: escrowAccounts.filter(e => e.status === 'released').reduce((s, e) => s + e.totalAmount, 0),
  activeEscrow: escrowAccounts.filter(e => ['in_escrow', 'verifying'].includes(e.status)).length,
  pendingVerify: escrowAccounts.filter(e => e.status === 'verifying').length,
  totalTransactions: escrowAccounts.length,
};
