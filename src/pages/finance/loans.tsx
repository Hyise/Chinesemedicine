import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Input, Row, Col, Tabs, message, Descriptions, Timeline, Drawer } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  DollarOutlined, CheckCircleOutlined, ClockCircleOutlined,
  ExclamationCircleOutlined, CloseCircleOutlined, SearchOutlined,
  EyeOutlined, MoneyCollectOutlined, BankOutlined,
} from '@ant-design/icons';
import {
  loanApplications, loanStats,
  type LoanApplication, type LoanStatus, LOAN_STATUS_LABEL,
} from './mockData';

const STATUS_COLORS: Record<LoanStatus, { bg: string; text: string }> = {
  pending:    { bg: 'rgba(204,120,92,0.1)',  text: '#cc785c' },
  approved:   { bg: 'rgba(93,184,114,0.1)', text: '#5db872' },
  rejected:   { bg: 'rgba(198,69,69,0.1)',  text: '#c64545' },
  repaying:   { bg: 'rgba(93,184,166,0.1)', text: '#5db8a6' },
  paid:      { bg: 'rgba(142,139,130,0.1)', text: '#6c6a64' },
  overdue:    { bg: 'rgba(198,69,69,0.1)',  text: '#c64545' },
};

const LoanStatusTag: React.FC<{ status: LoanStatus }> = ({ status }) => {
  const c = STATUS_COLORS[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', fontSize: 11, fontWeight: 500,
      borderRadius: 9999, padding: '2px 10px',
      background: c.bg, color: c.text,
      fontFamily: '"Inter", sans-serif',
    }}>
      {STATUS_COLORS[status] && status === 'pending' && <ClockCircleOutlined style={{ fontSize: 10, marginRight: 4 }} />}
      {status === 'approved' && <CheckCircleOutlined style={{ fontSize: 10, marginRight: 4 }} />}
      {status === 'overdue' && <ExclamationCircleOutlined style={{ fontSize: 10, marginRight: 4 }} />}
      {status === 'rejected' && <CloseCircleOutlined style={{ fontSize: 10, marginRight: 4 }} />}
      {LOAN_STATUS_LABEL[status]}
    </span>
  );
};

const KpiCard: React.FC<{
  title: string; value: string | number; suffix?: string;
  icon: React.ReactNode; accentColor: string;
}> = ({ title, value, suffix, icon, accentColor }) => (
  <Card style={{ borderRadius: 12, border: '1px solid #e6dfd8' }} styles={{ body: { padding: '18px 20px' } }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{
        width: 40, height: 40, borderRadius: 8,
        background: `${accentColor}14`, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        color: accentColor, fontSize: 17,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#6c6a64', marginBottom: 4 }}>
          {title}
        </div>
        <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 22, fontWeight: 500, color: '#141413', display: 'flex', alignItems: 'baseline', gap: 2 }}>
          {value}{suffix && <span style={{ fontSize: 12, color: '#6c6a64' }}>{suffix}</span>}
        </div>
      </div>
    </div>
  </Card>
);

const LoansPage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedLoan, setSelectedLoan] = useState<LoanApplication | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const filtered = loanApplications.filter(l => {
    const matchSearch = !searchText ||
      l.applicantName.includes(searchText) ||
      l.loanType.includes(searchText) ||
      l.bank.includes(searchText);
    const matchTab = activeTab === 'all' || l.status === activeTab;
    return matchSearch && matchTab;
  });

  const columns: ColumnsType<LoanApplication> = [
    {
      title: '申请人', key: 'applicant',
      render: (_, r) => (
        <div>
          <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 500, color: '#141413' }}>{r.applicantName}</div>
          <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: '#6c6a64' }}>{r.applicantType} · {r.contact}</div>
        </div>
      ),
    },
    {
      title: '贷款类型', dataIndex: 'loanType', key: 'loanType', width: 100,
      render: (t) => <Tag style={{ borderRadius: 9999, border: 'none', background: '#efe9de', color: '#6c6a64', fontSize: 11 }}>{t}</Tag>,
    },
    {
      title: '金额', dataIndex: 'amount', key: 'amount', width: 90,
      render: (a) => (
        <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 500, color: '#141413' }}>
          {a}万元
        </span>
      ),
    },
    {
      title: '年利率', dataIndex: 'annualRate', key: 'annualRate', width: 80,
      render: (r) => <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: '#6c6a64' }}>{r}%</span>,
    },
    {
      title: '期限', dataIndex: 'term', key: 'term', width: 70,
      render: (t) => <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: '#6c6a64' }}>{t}个月</span>,
    },
    {
      title: '金融机构', dataIndex: 'bank', key: 'bank', width: 150,
      render: (b) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <BankOutlined style={{ color: '#8e8b82', fontSize: 12 }} />
          <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: '#6c6a64' }}>{b}</span>
        </div>
      ),
    },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 100,
      render: (s: LoanStatus) => <LoanStatusTag status={s} />,
    },
    {
      title: '申请日期', dataIndex: 'applyDate', key: 'applyDate', width: 100,
      render: (d) => <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: '#6c6a64' }}>{d}</span>,
    },
    {
      title: '操作', key: 'action', width: 100,
      render: (_, r) => (
        <Space size={4}>
          <Button type="link" size="small" icon={<EyeOutlined />} style={{ color: '#cc785c', fontSize: 12, padding: '0 4px' }}
            onClick={() => { setSelectedLoan(r); setDetailOpen(true); }}>
            查看
          </Button>
          {r.status === 'pending' && (
            <Button type="link" size="small" icon={<CheckCircleOutlined />} style={{ color: '#5db872', fontSize: 12, padding: '0 4px' }}
              onClick={() => message.success('审批功能开发中')}>
              审批
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const tabItems = [
    { key: 'all', label: `全部 (${loanApplications.length})` },
    { key: 'pending', label: `待审批 (${loanApplications.filter(l => l.status === 'pending').length})` },
    { key: 'repaying', label: `还款中 (${loanApplications.filter(l => l.status === 'repaying').length})` },
    { key: 'overdue', label: `已逾期 (${loanApplications.filter(l => l.status === 'overdue').length})` },
    { key: 'paid', label: `已结清 (${loanApplications.filter(l => l.status === 'paid').length})` },
  ];

  return (
    <div style={{ background: '#faf9f5', minHeight: '100vh', padding: '40px 64px' }}>
      {/* Hero */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{
          fontFamily: '"Tiempos Headline", "Cormorant Garamond", Garamond, serif',
          fontSize: 32, fontWeight: 400, letterSpacing: '-0.3px', color: '#141413', margin: '0 0 6px', lineHeight: 1.1,
        }}>
          助农贷款服务
        </h1>
        <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, color: '#6c6a64', margin: 0 }}>
          种植、收购、加工全链条信贷支持，审批流程管理
        </p>
      </div>

      {/* KPI Strip */}
      <Row gutter={[12, 12]} style={{ marginBottom: 24 }}>
        <Col xs={12} xl={6}>
          <KpiCard title="累计放款" value={loanStats.totalApproved} suffix="万元" icon={<MoneyCollectOutlined />} accentColor="#cc785c" />
        </Col>
        <Col xs={12} xl={6}>
          <KpiCard title="待审批" value={loanApplications.filter(l => l.status === 'pending').length} suffix="笔"
            icon={<ClockCircleOutlined />} accentColor="#e8a55a" />
        </Col>
        <Col xs={12} xl={6}>
          <KpiCard title="还款中" value={loanStats.activeLoans} suffix="笔"
            icon={<DollarOutlined />} accentColor="#5db8a6" />
        </Col>
        <Col xs={12} xl={6}>
          <KpiCard
            title="已逾期"
            value={loanStats.overdueCount}
            suffix="笔"
            icon={<ExclamationCircleOutlined />}
            accentColor="#c64545"
          />
        </Col>
      </Row>

      {/* Table Card */}
      <Card style={{ borderRadius: 12, border: '1px solid #e6dfd8' }} styles={{ body: { padding: 0 } }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #ebe6df', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            style={{ marginBottom: 0 }}
          />
          <Space>
            <Input
              prefix={<SearchOutlined style={{ color: '#8e8b82' }} />}
              placeholder="搜索申请人 / 贷款类型 / 金融机构"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 260, borderRadius: 8 }}
              allowClear
            />
          </Space>
        </div>
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          pagination={{ pageSize: 8, showTotal: t => `共 ${t} 条`, showSizeChanger: false }}
          size="middle"
        />
      </Card>

      {/* Detail Drawer */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <DollarOutlined style={{ color: '#cc785c' }} />
            <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 15, fontWeight: 500, color: '#141413' }}>贷款详情</span>
            {selectedLoan && <LoanStatusTag status={selectedLoan.status} />}
          </div>
        }
        placement="right" width={540}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      >
        {selectedLoan && (
          <div>
            <Descriptions column={2} bordered size="small" style={{ marginBottom: 20 }}>
              <Descriptions.Item label="申请人" span={2}>{selectedLoan.applicantName}</Descriptions.Item>
              <Descriptions.Item label="申请类型">{selectedLoan.applicantType}</Descriptions.Item>
              <Descriptions.Item label="贷款类型">{selectedLoan.loanType}</Descriptions.Item>
              <Descriptions.Item label="申请金额">
                <span style={{ fontFamily: '"Inter", sans-serif', fontWeight: 500, color: '#cc785c' }}>{selectedLoan.amount}万元</span>
              </Descriptions.Item>
              <Descriptions.Item label="年利率">{selectedLoan.annualRate}%</Descriptions.Item>
              <Descriptions.Item label="贷款期限">{selectedLoan.term}个月</Descriptions.Item>
              <Descriptions.Item label="金融机构" span={2}>{selectedLoan.bank}</Descriptions.Item>
              <Descriptions.Item label="贷款用途" span={2}>{selectedLoan.purpose}</Descriptions.Item>
              <Descriptions.Item label="抵押担保" span={2}>{selectedLoan.collateral}</Descriptions.Item>
              {selectedLoan.baseName && <Descriptions.Item label="种植基地" span={2}>{selectedLoan.baseName}</Descriptions.Item>}
              <Descriptions.Item label="联系人">{selectedLoan.contact}</Descriptions.Item>
              <Descriptions.Item label="申请日期">{selectedLoan.applyDate}</Descriptions.Item>
              {selectedLoan.approveDate && <Descriptions.Item label="审批日期">{selectedLoan.approveDate}</Descriptions.Item>}
              {selectedLoan.repayDate && <Descriptions.Item label="应还款日">{selectedLoan.repayDate}</Descriptions.Item>}
            </Descriptions>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, fontWeight: 500, color: '#141413', marginBottom: 8 }}>
                还款进度
              </div>
              <Timeline
                items={
                  [
                    { color: '#5db872', children: (
                      <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12 }}>
                        <div style={{ fontWeight: 500, color: '#141413' }}>贷款已发放</div>
                        <div style={{ color: '#6c6a64' }}>{selectedLoan.approveDate}</div>
                      </div>
                    )},
                    { color: '#5db8a6', children: (
                      <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12 }}>
                        <div style={{ fontWeight: 500, color: '#141413' }}>还款中</div>
                        <div style={{ color: '#6c6a64' }}>每月等额本息还款</div>
                      </div>
                    )},
                    ...(selectedLoan.repayDate ? [{ color: '#8e8b82', children: (
                      <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12 }}>
                        <div style={{ fontWeight: 500, color: '#141413' }}>应还款日</div>
                        <div style={{ color: '#6c6a64' }}>{selectedLoan.repayDate}</div>
                      </div>
                    )}] : []),
                  ]
                }
              />
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default LoansPage;
