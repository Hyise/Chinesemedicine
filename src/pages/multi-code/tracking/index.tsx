import React, { useState } from 'react';
import {
  Card, Form, Input, Select, Button, Space, Descriptions,
  Timeline, Tag, Empty, Row, Col, Spin, message,
} from 'antd';
import {
  SearchOutlined, ReloadOutlined, QrcodeOutlined,
  EnvironmentOutlined, SafetyCertificateOutlined, BankOutlined,
  RocketOutlined, MobileOutlined, FileTextOutlined,
  CheckCircleOutlined, ClockCircleOutlined,
} from '@ant-design/icons';
import type { SelectProps } from 'antd';
import type { CodeTrackingDetail } from '../types';

type NodeType = 'issue' | 'planting' | 'quality' | 'warehouse' | 'logistics' | 'consumer';

const NODE_CONFIG: Record<NodeType, { color: string; icon: React.ReactNode }> = {
  issue: { color: 'gray', icon: <QrcodeOutlined /> },
  planting: { color: 'green', icon: <EnvironmentOutlined /> },
  quality: { color: 'purple', icon: <SafetyCertificateOutlined /> },
  warehouse: { color: 'blue', icon: <BankOutlined /> },
  logistics: { color: 'orange', icon: <RocketOutlined /> },
  consumer: { color: 'green', icon: <MobileOutlined /> },
};

const getNodeType = (name: string): NodeType => {
  const map: Record<string, NodeType> = {
    '系统赋码': 'issue', '种植建档': 'planting', '质检合格': 'quality',
    '产地仓入库': 'warehouse', '物流发货': 'logistics', '终端扫码': 'consumer',
  };
  return map[name] ?? 'issue';
};

const STATUS_OPTIONS: SelectProps['options'] = [
  { label: '全部', value: '' },
  { label: '未激活', value: 'inactive' },
  { label: '已激活（种植建档）', value: 'activated' },
  { label: '已入库', value: 'inbound' },
  { label: '已出库', value: 'outbound' },
  { label: '已被扫码消费', value: 'consumed' },
];

const buildTimelineItems = (data: CodeTrackingDetail) => {
  return [...data.lifeCycle].reverse().map((node, index) => {
    const nodeType = getNodeType(node.name);
    const cfg = NODE_CONFIG[nodeType];
    const isLatest = index === 0;
    const details = node.details ?? [];

    return {
      color: cfg.color,
      dot: isLatest ? (
        <span style={{ fontSize: 14, display: 'flex', alignItems: 'center' }}>
          {cfg.icon}
        </span>
      ) : undefined,
      children: (
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            {isLatest && <Tag color="green" style={{ fontSize: 10, margin: 0 }}>最新</Tag>}
            <span style={{ fontWeight: 600, fontSize: 13, color: '#374151' }}>{node.name}</span>
            <Tag color={cfg.color} style={{ fontSize: 10, margin: 0 }}>环节 {data.lifeCycle.length - index}</Tag>
          </div>
          <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 8 }}>
            <ClockCircleOutlined style={{ marginRight: 4 }} />
            {node.time} &nbsp;|&nbsp; {node.operator}
          </div>
          {details.length > 0 && (
            <div style={{ background: '#f9fafb', borderRadius: 6, padding: 12, border: '1px solid #f3f4f6' }}>
              {details.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, fontSize: 12, marginBottom: i < details.length - 1 ? 4 : 0 }}>
                  <span style={{ color: '#9ca3af', minWidth: 80, flexShrink: 0, textAlign: 'right' }}>
                    {item.label}：
                  </span>
                  {item.url ? (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}>
                      {item.value}
                    </a>
                  ) : (
                    <span style={{ color: '#374151' }}>{item.value}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ),
    };
  });
};

interface SearchFormValues { code: string; batchNo: string; status: string; }

const CodeTracking: React.FC = () => {
  const [form] = Form.useForm<SearchFormValues>();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CodeTrackingDetail | null>(null);
  const [searched, setSearched] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleSearch = async () => {
    try {
      const values = await form.validateFields();
      if (!values.code.trim() && !values.batchNo.trim()) {
        messageApi.warning('请输入精确码值或批次号');
        return;
      }
      setLoading(true);
      setResult(null);
      await new Promise((r) => setTimeout(r, 800));
      setResult({
        code: values.code.trim() || 'GCH-2026-001-0001-7',
        batchNo: values.batchNo.trim() || 'GEN-20260423001',
        herbName: '金钗石斛鲜条',
        specification: '5g/支，20支/盒',
        baseName: '赤水官渡镇石斛基地',
        status: 'consumed',
        scanCount: 12,
        firstScanTime: '2026-04-22 14:32:18',
        firstScanLocation: '贵州遵义',
        generatedAt: '2026-04-23 10:30:00',
        lifeCycle: [
          { name: '系统赋码', time: '2026-04-23 10:30:00', operator: '张明华', type: 'issue', details: [{ label: '批次号', value: 'GEN-20260423001' }, { label: '生成数量', value: '5000 枚' }, { label: '编码规则', value: 'GCH-YYYY-NNNN-NNNN-C' }] },
          { name: '种植建档', time: '2026-04-23 11:15:00', operator: '赵技术员', type: 'planting', details: [{ label: '基地名称', value: '赤水官渡镇石斛基地' }, { label: '地块编号', value: 'GD-001' }, { label: '种植时间', value: '2026-04-10' }, { label: '预计采收', value: '2026-09-01' }] },
          { name: '质检合格', time: '2026-04-23 14:00:00', operator: '贵州中药检验中心', type: 'quality', details: [{ label: '检测机构', value: '贵州省中药材质量检验中心' }, { label: '报告编号', value: 'GZ-QC-20260423-0001' }, { label: '检测结论', value: '符合《中国药典》2025 版一部要求' }] },
          { name: '产地仓入库', time: '2026-04-23 15:30:00', operator: '李仓管', type: 'warehouse', details: [{ label: '仓库', value: '赤水农产品产地仓' }, { label: '库区/库位', value: 'A区-03-12' }, { label: '入库单号', value: 'RK-20260423-001' }, { label: '存储温湿度', value: '温度 18.5℃，湿度 55%（冷链冷藏）' }] },
          { name: '物流发货', time: '2026-04-24 08:00:00', operator: '顺丰速运', type: 'logistics', details: [{ label: '承运商', value: '顺丰速运' }, { label: '运单号', value: 'SF1234567890123' }, { label: '发货地址', value: '贵州省遵义市赤水市三十里河畔大道 88 号' }, { label: '收货地址', value: '贵州省遵义市红花岗区解放路 123 号' }] },
          { name: '终端扫码', time: '2026-04-22 14:32:18', operator: '消费者（手机尾号 3721）', type: 'consumer', details: [{ label: '扫码时间', value: '2026-04-22 14:32:18' }, { label: '扫码 IP 属地', value: '贵州遵义' }, { label: '扫码设备', value: 'iPhone 15 Pro / iOS 17.4' }, { label: '验证结果', value: '防伪验证成功 · 首次扫码 · 来自正规渠道' }] },
        ],
      });
      setLoading(false);
      setSearched(true);
    } catch {
      // 校验失败时忽略
    }
  };

  const handleReset = () => { form.resetFields(); setResult(null); setSearched(false); };
  const timelineItems = result ? buildTimelineItems(result) : [];

  return (
    <div style={{ padding: 20 }}>
      {contextHolder}
      <div style={{ marginBottom: 20 }}>
        <h3 className="page-title" style={{ margin: '0 0 4px' }}>码状态追踪</h3>
        <p className="page-desc">输入精确码值或批次号，追踪单一码从赋码到消费的完整生命周期</p>
      </div>

      <Card
        title={<Space><SearchOutlined />多维检索</Space>}
        bordered={false}
        style={{ marginBottom: 16, borderRadius: 10 }}
        styles={{ body: { paddingBottom: 12 } }}
      >
        <Form form={form} layout="inline">
          <Form.Item name="code" label="精确码值" style={{ marginBottom: 8 }}>
            <Input placeholder="请输入完整一码通标识，如 GCH-2026-001-0001-7" style={{ width: 300 }} allowClear />
          </Form.Item>
          <Form.Item name="batchNo" label="关联批次号" style={{ marginBottom: 8 }}>
            <Input placeholder="请输入批次号，如 GEN-20260423001" style={{ width: 260 }} allowClear />
          </Form.Item>
          <Form.Item name="status" label="当前状态" initialValue="" style={{ marginBottom: 8 }}>
            <Select options={STATUS_OPTIONS} style={{ width: 176 }} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 8 }}>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} loading={loading}>查询</Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {loading && (
        <Card bordered={false} style={{ marginBottom: 16, borderRadius: 10 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 0', gap: 12 }}>
            <Spin size="large" />
            <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>正在查询码状态，请稍候...</p>
          </div>
        </Card>
      )}

      {!loading && !result && !searched && (
        <Card bordered={false} style={{ borderRadius: 10 }}>
          <Empty
            image={<FileTextOutlined style={{ fontSize: 64, color: '#1677ff', opacity: 0.4 }} />}
            description={
              <div>
                <p style={{ color: '#6b7280', fontSize: 13, margin: '0 0 4px' }}>请输入搜索条件查询码状态</p>
                <p style={{ color: '#d1d5db', fontSize: 11, margin: 0 }}>支持精确码值查询或批次号批量查询</p>
              </div>
            }
          />
        </Card>
      )}

      {!loading && !result && searched && (
        <Card bordered={false} style={{ borderRadius: 10 }}>
          <Empty
            image={<QrcodeOutlined style={{ fontSize: 64, color: '#bfbfbf' }} />}
            description={
              <div>
                <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>未找到匹配的码记录</p>
                <p style={{ color: '#d1d5db', fontSize: 11, margin: '4px 0 0' }}>请检查输入的码值或批次号是否正确</p>
              </div>
            }
          />
        </Card>
      )}

      {!loading && result && (
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={24}>
            <Card
              title={<Space><CheckCircleOutlined style={{ color: '#22c55e' }} />基础信息</Space>}
              bordered={false}
              style={{ borderRadius: 10 }}
              extra={
                <Space>
                  <span style={{ fontSize: 11, color: '#9ca3af' }}>当前码值：</span>
                  <code style={{ fontSize: 11, background: '#f3f4f6', padding: '2px 8px', borderRadius: 4 }}>{result.code}</code>
                </Space>
              }
            >
              <Descriptions bordered column={{ xs: 1, sm: 2, md: 3, lg: 4 }} size="small"
                labelStyle={{ fontWeight: 500, background: '#fafafa', width: 130 }}>
                <Descriptions.Item label="唯一码值"><code style={{ fontSize: 11 }}>{result.code}</code></Descriptions.Item>
                <Descriptions.Item label="关联批次号"><code style={{ fontSize: 11 }}>{result.batchNo}</code></Descriptions.Item>
                <Descriptions.Item label="药材品名"><span style={{ fontWeight: 600 }}>{result.herbName}</span></Descriptions.Item>
                <Descriptions.Item label="规格">{result.specification}</Descriptions.Item>
                <Descriptions.Item label="产地基地">
                  <Space><EnvironmentOutlined style={{ color: '#22c55e', fontSize: 11 }} />{result.baseName}</Space>
                </Descriptions.Item>
                <Descriptions.Item label="生成时间">{result.generatedAt}</Descriptions.Item>
                <Descriptions.Item label="当前状态">
                  <Tag color={result.status === 'consumed' ? 'green' : result.status === 'inbound' ? 'cyan' : 'blue'}>
                    {result.status === 'inactive' ? '未激活' : result.status === 'activated' ? '已激活（种植建档）' : result.status === 'inbound' ? '已入库' : result.status === 'outbound' ? '已出库' : '已被扫码消费'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="累计扫码次数">
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#3b82f6' }}>{result.scanCount}</span>
                  <span style={{ fontSize: 11, color: '#9ca3af', marginLeft: 4 }}>次</span>
                </Descriptions.Item>
                {result.firstScanTime && <Descriptions.Item label="首次扫码时间">{result.firstScanTime}</Descriptions.Item>}
                {result.firstScanLocation && (
                  <Descriptions.Item label="首次扫码地点">
                    <Space size={4}><EnvironmentOutlined style={{ color: '#f472b6', fontSize: 11 }} />{result.firstScanLocation}</Space>
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Card>
          </Col>
          <Col span={24}>
            <Card
              title={
                <Space>
                  <FileTextOutlined />
                  <span>全链路流转时间轴</span>
                  <Tag color="blue" style={{ fontSize: 10, margin: 0 }}>{result.lifeCycle.length} 个环节</Tag>
                  <Tag color="green" style={{ fontSize: 10, margin: 0 }}>倒序（最新在上）</Tag>
                </Space>
              }
              bordered={false}
              style={{ borderRadius: 10 }}
            >
              <Timeline items={timelineItems} style={{ marginTop: 8 }} />
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default CodeTracking;
