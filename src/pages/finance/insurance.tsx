import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Input, Row, Col, Tabs, Descriptions, Timeline, Drawer, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  SafetyOutlined, ClockCircleOutlined,
  EyeOutlined, DollarOutlined, SearchOutlined,
} from '@ant-design/icons';
import PageHeading from '../../components/PageHeading';
import {
  insurancePolicies, insuranceClaims, insuranceStats,
  type InsurancePolicy, type InsuranceClaim, type InsuranceStatus, type ClaimStatus,
} from './mockData';

const STATUS_COLORS: Record<InsuranceStatus, string> = {
  active: '#5db872', expired: '#8e8b82', claiming: '#e8a55a', claimed: '#5db8a6', rejected: '#c64545',
};
const CLAIM_STATUS_COLORS: Record<ClaimStatus, string> = {
  pending: '#cc785c', approved: '#5db872', rejected: '#c64545', paid: '#5db8a6',
};

const InsurancePage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('policies');
  const [detailPolicy, setDetailPolicy] = useState<InsurancePolicy | null>(null);
  const [detailClaim, setDetailClaim] = useState<InsuranceClaim | null>(null);
  const [policyDrawer, setPolicyDrawer] = useState(false);
  const [claimDrawer, setClaimDrawer] = useState(false);

  const policyColumns: ColumnsType<InsurancePolicy> = [
    {
      title: '保单号', dataIndex: 'policyNo', key: 'policyNo', width: 160,
      render: (p) => <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: '#6c6a64' }}>{p}</span>,
    },
    {
      title: '批次号', dataIndex: 'batchNo', key: 'batchNo', width: 180,
      render: (b) => <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: '#6c6a64' }}>{b}</span>,
    },
    {
      title: '品名', dataIndex: 'herbName', key: 'herbName', width: 90,
      render: (h) => <Tag style={{ borderRadius: 9999, border: 'none', background: '#efe9de', color: '#6c6a64', fontSize: 11 }}>{h}</Tag>,
    },
    {
      title: '基地', dataIndex: 'baseName', key: 'baseName', width: 140,
      render: (b) => <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: '#141413' }}>{b}</span>,
    },
    {
      title: '险种', dataIndex: 'insuranceType', key: 'insuranceType', width: 110,
      render: (t) => <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: '#6c6a64' }}>{t}</span>,
    },
    {
      title: '参保面积', dataIndex: 'insuredArea', key: 'insuredArea', width: 90,
      render: (a) => <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: '#141413' }}>{a}亩</span>,
    },
    {
      title: '保费/保额', key: 'amount', width: 130,
      render: (_, r) => (
        <div>
          <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: '#cc785c', fontWeight: 500 }}>
            {r.premium.toLocaleString()}元
          </div>
          <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: '#8e8b82' }}>
            / {(r.coverage / 10000).toFixed(0)}万
          </div>
        </div>
      ),
    },
    {
      title: '有效期', key: 'date', width: 160,
      render: (_, r) => (
        <div>
          <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: '#6c6a64' }}>{r.startDate}</div>
          <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: '#8e8b82' }}>至 {r.endDate}</div>
        </div>
      ),
    },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 90,
      render: (s: InsuranceStatus) => (
        <Tag style={{ borderRadius: 9999, border: 'none', background: `${STATUS_COLORS[s]}14`, color: STATUS_COLORS[s], fontSize: 11 }}>
          {s === 'active' ? '生效中' : s === 'expired' ? '已过期' : s === 'claiming' ? '理赔中' : s}
        </Tag>
      ),
    },
    {
      title: '操作', key: 'action', width: 80,
      render: (_, r) => (
        <Button type="link" size="small" icon={<EyeOutlined />} style={{ color: '#cc785c', fontSize: 12, padding: '0 4px' }}
          onClick={() => { setDetailPolicy(r); setPolicyDrawer(true); }}>
          详情
        </Button>
      ),
    },
  ];

  const claimColumns: ColumnsType<InsuranceClaim> = [
    {
      title: '理赔号', dataIndex: 'claimNo', key: 'claimNo', width: 170,
      render: (c) => <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: '#6c6a64' }}>{c}</span>,
    },
    {
      title: '关联保单', dataIndex: 'policyNo', key: 'policyNo', width: 160,
      render: (p) => <Tag style={{ borderRadius: 4, border: '1px solid #e6dfd8', background: 'transparent', color: '#6c6a64', fontSize: 11 }}>{p}</Tag>,
    },
    {
      title: '理赔金额', dataIndex: 'claimAmount', key: 'claimAmount', width: 100,
      render: (a) => <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 500, color: '#cc785c' }}>{a.toLocaleString()}元</span>,
    },
    {
      title: '事故原因', dataIndex: 'reason', key: 'reason',
      render: (r) => (
        <Tooltip title={r}>
          <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: '#6c6a64', maxWidth: 200, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r}</span>
        </Tooltip>
      ),
    },
    {
      title: '出险日期', dataIndex: 'incidentDate', key: 'incidentDate', width: 100,
      render: (d) => <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: '#6c6a64' }}>{d}</span>,
    },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 90,
      render: (s: ClaimStatus) => (
        <Tag style={{ borderRadius: 9999, border: 'none', background: `${CLAIM_STATUS_COLORS[s]}14`, color: CLAIM_STATUS_COLORS[s], fontSize: 11 }}>
          {s === 'pending' ? '待审核' : s === 'approved' ? '已通过' : s === 'paid' ? '已赔付' : '已拒绝'}
        </Tag>
      ),
    },
    {
      title: '申请日期', dataIndex: 'applyDate', key: 'applyDate', width: 100,
      render: (d) => <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: '#6c6a64' }}>{d}</span>,
    },
    {
      title: '操作', key: 'action', width: 80,
      render: (_, r) => (
        <Button type="link" size="small" icon={<EyeOutlined />} style={{ color: '#cc785c', fontSize: 12, padding: '0 4px' }}
          onClick={() => { setDetailClaim(r); setClaimDrawer(true); }}>
          详情
        </Button>
      ),
    },
  ];

  const KpiCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; accentColor: string }> =
    ({ title, value, icon, accentColor }) => (
      <Card style={{ borderRadius: 12, border: '1px solid #e6dfd8' }} styles={{ body: { padding: '16px 20px' } }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: `${accentColor}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accentColor, fontSize: 16 }}>
            {icon}
          </div>
          <div>
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#6c6a64', marginBottom: 2 }}>{title}</div>
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 20, fontWeight: 500, color: '#141413' }}>{value}</div>
          </div>
        </div>
      </Card>
    );

  return (
    <div style={{ background: '#faf9f5', minHeight: '100%' }}>
      <PageHeading
        eyebrow="金融服务"
        title="农业保险服务"
        description="气象灾害险 · 质量保障险 · 综合收入险，全生长周期保障"
        accentColor="#5db8a6"
        gradientFrom="#1a3d3d"
        gradientMid="#1d5252"
        gradientTo="#2a6767"
        padding="32px 32px 28px"
      />

      <div style={{ maxWidth: 1360, margin: '0 auto', padding: '20px 32px 32px' }}>
        {/* KPI */}
        <Row gutter={[12, 12]} style={{ marginBottom: 24 }}>
        <Col xs={12} xl={6}><KpiCard title="生效保单" value={`${insuranceStats.activePolicies}份`} icon={<SafetyOutlined />} accentColor="#5db8a6" /></Col>
        <Col xs={12} xl={6}><KpiCard title="参保面积" value={`${insuranceStats.totalInsuredArea}亩`} icon={<SafetyOutlined />} accentColor="#cc785c" /></Col>
        <Col xs={12} xl={6}><KpiCard title="累计保费" value={`${(insuranceStats.totalPremium / 10000).toFixed(1)}万元`} icon={<DollarOutlined />} accentColor="#e8a55a" /></Col>
        <Col xs={12} xl={6}><KpiCard title="待处理理赔" value={`${insuranceStats.pendingClaims}件`} icon={<ClockCircleOutlined />} accentColor="#c64545" /></Col>
      </Row>

      {/* Tabs */}
      <Card style={{ borderRadius: 12, border: '1px solid #e6dfd8' }} styles={{ body: { padding: 0 } }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #ebe6df', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              { key: 'policies', label: `保单管理 (${insurancePolicies.length})` },
              { key: 'claims', label: `理赔记录 (${insuranceClaims.length})` },
            ]}
          />
          <Space>
            {activeTab === 'policies' && (
              <Input prefix={<SearchOutlined style={{ color: '#8e8b82' }} />} placeholder="搜索保单 / 基地"
                value={searchText} onChange={e => setSearchText(e.target.value)} style={{ width: 220, borderRadius: 8 }} allowClear />
            )}
          </Space>
        </div>

        {activeTab === 'policies' ? (
          <Table columns={policyColumns} dataSource={insurancePolicies.filter(p => !searchText || p.baseName.includes(searchText) || p.policyNo.includes(searchText))} rowKey="id" pagination={{ pageSize: 8, showTotal: t => `共 ${t} 条` }} size="middle" />
        ) : (
          <Table columns={claimColumns} dataSource={insuranceClaims} rowKey="id" pagination={{ pageSize: 8, showTotal: t => `共 ${t} 条` }} size="middle" />
        )}
      </Card>

      {/* Policy Detail Drawer */}
      <Drawer title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <SafetyOutlined style={{ color: '#5db8a6' }} />
          <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 15, fontWeight: 500, color: '#141413' }}>保单详情</span>
        </div>
      } placement="right" width={520} open={policyDrawer} onClose={() => setPolicyDrawer(false)}>
        {detailPolicy && (
          <Descriptions column={2} bordered size="small" style={{ marginBottom: 20 }}>
            <Descriptions.Item label="保单号" span={2}>{detailPolicy.policyNo}</Descriptions.Item>
            <Descriptions.Item label="批次号" span={2}>{detailPolicy.batchNo}</Descriptions.Item>
            <Descriptions.Item label="药材名称">{detailPolicy.herbName}</Descriptions.Item>
            <Descriptions.Item label="险种">{detailPolicy.insuranceType}</Descriptions.Item>
            <Descriptions.Item label="种植基地" span={2}>{detailPolicy.baseName}</Descriptions.Item>
            <Descriptions.Item label="参保面积">{detailPolicy.insuredArea}亩</Descriptions.Item>
            <Descriptions.Item label="保费">{detailPolicy.premium.toLocaleString()}元</Descriptions.Item>
            <Descriptions.Item label="保险金额" span={2}>
              <span style={{ color: '#cc785c', fontWeight: 500 }}>{detailPolicy.coverage.toLocaleString()}元</span>
            </Descriptions.Item>
            <Descriptions.Item label="生效日期">{detailPolicy.startDate}</Descriptions.Item>
            <Descriptions.Item label="到期日期">{detailPolicy.endDate}</Descriptions.Item>
            <Descriptions.Item label="承保公司" span={2}>{detailPolicy.insuranceCompany}</Descriptions.Item>
            <Descriptions.Item label="联系人">{detailPolicy.contact}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag style={{ borderRadius: 9999, border: 'none', background: `${STATUS_COLORS[detailPolicy.status]}14`, color: STATUS_COLORS[detailPolicy.status], fontSize: 11 }}>
                {detailPolicy.status === 'active' ? '生效中' : detailPolicy.status === 'expired' ? '已过期' : '理赔中'}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>

      {/* Claim Detail Drawer */}
      <Drawer title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <SafetyOutlined style={{ color: '#e8a55a' }} />
          <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 15, fontWeight: 500, color: '#141413' }}>理赔详情</span>
        </div>
      } placement="right" width={520} open={claimDrawer} onClose={() => setClaimDrawer(false)}>
        {detailClaim && (
          <div>
            <Descriptions column={2} bordered size="small" style={{ marginBottom: 20 }}>
              <Descriptions.Item label="理赔号" span={2}>{detailClaim.claimNo}</Descriptions.Item>
              <Descriptions.Item label="关联保单" span={2}>
                <Tag style={{ borderRadius: 4, border: '1px solid #e6dfd8', background: 'transparent', color: '#6c6a64', fontSize: 11 }}>{detailClaim.policyNo}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="理赔金额" span={2}>
                <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 16, fontWeight: 500, color: '#cc785c' }}>{detailClaim.claimAmount.toLocaleString()}元</span>
              </Descriptions.Item>
              <Descriptions.Item label="出险日期">{detailClaim.incidentDate}</Descriptions.Item>
              <Descriptions.Item label="申请日期">{detailClaim.applyDate}</Descriptions.Item>
              <Descriptions.Item label="事故原因" span={2}>{detailClaim.reason}</Descriptions.Item>
              {detailClaim.approveDate && <Descriptions.Item label="审核日期">{detailClaim.approveDate}</Descriptions.Item>}
              {detailClaim.payDate && <Descriptions.Item label="赔付日期">{detailClaim.payDate}</Descriptions.Item>}
              {detailClaim.rejectReason && (
                <Descriptions.Item label="拒绝原因" span={2}>
                  <Tag style={{ borderRadius: 4, background: 'rgba(198,69,69,0.1)', color: '#c64545', border: 'none', fontSize: 11 }}>{detailClaim.rejectReason}</Tag>
                </Descriptions.Item>
              )}
              <Descriptions.Item label="状态" span={2}>
                <Tag style={{ borderRadius: 9999, border: 'none', background: `${CLAIM_STATUS_COLORS[detailClaim.status]}14`, color: CLAIM_STATUS_COLORS[detailClaim.status], fontSize: 11 }}>
                  {detailClaim.status === 'pending' ? '待审核' : detailClaim.status === 'approved' ? '已通过' : detailClaim.status === 'paid' ? '已赔付' : '已拒绝'}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <Timeline
              items={[
                { color: '#5db872', children: <div><div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, fontWeight: 500, color: '#141413' }}>理赔申请提交</div><div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: '#6c6a64' }}>{detailClaim.applyDate}</div></div> },
                { color: detailClaim.status === 'approved' || detailClaim.status === 'paid' ? '#5db872' : '#e8a55a', children: <div><div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, fontWeight: 500, color: '#141413' }}>理赔审核</div><div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: '#6c6a64' }}>{detailClaim.approveDate || '待审核'}</div></div> },
                { color: detailClaim.status === 'paid' ? '#5db8a6' : '#8e8b82', children: <div><div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, fontWeight: 500, color: '#141413' }}>理赔支付</div><div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: '#6c6a64' }}>{detailClaim.payDate || '待支付'}</div></div> },
              ]}
            />
          </div>
        )}
      </Drawer>
    </div>
    </div>
  );
};

export default InsurancePage;
