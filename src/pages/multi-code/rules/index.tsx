import React, { useState, useMemo } from 'react';
import {
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Table,
  Tag,
  Space,
  Typography,
  Divider,
  Button,
  Alert,
  message,
} from 'antd';
import {
  SaveOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { CodeRule, RuleVersion } from '../types';
import { mockRuleVersions } from '../types';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// ============================================================
// Luhn 算法实现（计算校验位）
// ============================================================
const calculateLuhnCheckDigit = (digits: string): string => {
  const arr = digits.split('').reverse().map(Number);
  const sum = arr.reduce((acc, d, i) => {
    if (i % 2 === 0) {
      const doubled = d * 2;
      return acc + (doubled > 9 ? doubled - 9 : doubled);
    }
    return acc + d;
  }, 0);
  const checkDigit = (10 - (sum % 10)) % 10;
  return String(checkDigit);
};

// ============================================================
// 根据规则配置生成示例编码
// ============================================================
const generatePreviewCode = (rule: CodeRule): string => {
  const prefix = rule.categoryPrefix || 'GCH';
  const year = rule.yearFormat === 'YYYY' ? '2025' : '25';
  const originCode = '001'.padStart(rule.originCodeLength || 4, '0');
  const batchNo = '0001';
  const baseCode = `${prefix}-${year}-${originCode}-${batchNo}`;

  if (rule.checkAlgorithm === 'none') {
    return baseCode;
  }

  const digitsOnly = baseCode.replace(/-/g, '');
  const checkDigit = calculateLuhnCheckDigit(digitsOnly);

  if (rule.checkAlgorithm === 'luhn') {
    return `${baseCode}-${checkDigit}`;
  }
  if (rule.checkAlgorithm === 'mod11') {
    const weights = [2, 3, 4, 5, 6, 7];
    let sum = 0;
    const reversed = digitsOnly.split('').reverse();
    reversed.forEach((d, i) => {
      sum += parseInt(d) * weights[i % weights.length];
    });
    const mod11Check = (11 - (sum % 11)) % 11;
    const mod11Char = mod11Check === 10 ? 'X' : String(mod11Check);
    return `${baseCode}-${mod11Char}`;
  }

  return baseCode;
};

// ============================================================
// 历史规则版本 Table 列定义
// ============================================================
const ruleVersionColumns: ColumnsType<RuleVersion> = [
  {
    title: '版本号',
    dataIndex: 'version',
    key: 'version',
    width: 100,
    render: (v: string) => <Text strong>{v}</Text>,
  },
  {
    title: '编码规则预览',
    dataIndex: 'rulePreview',
    key: 'rulePreview',
    width: 200,
    render: (code: string) => (
      <Text code style={{ fontSize: 13 }}>
        {code}
      </Text>
    ),
  },
  {
    title: '生效时间',
    dataIndex: 'effectiveTime',
    key: 'effectiveTime',
    width: 180,
  },
  {
    title: '操作人',
    dataIndex: 'operator',
    key: 'operator',
    width: 120,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    render: (status: RuleVersion['status']) => (
      <Tag color={status === 'active' ? 'green' : 'default'}>
        {status === 'active' ? '当前生效' : '已归档'}
      </Tag>
    ),
  },
];

/**
 * 编码规则配置页面
 * 用于配置多码合一系统中编码的分段规则、校验算法等
 */
const CodeRules: React.FC = () => {
  const [form] = Form.useForm<CodeRule>();
  const [saveLoading, setSaveLoading] = useState(false);

  // 监听表单字段变化，实时更新预览
  const ruleValues = Form.useWatch<CodeRule>('', form);

  // 实时生成的编码预览
  const previewCode = useMemo(() => {
    return generatePreviewCode(ruleValues || {});
  }, [ruleValues]);

  // 当前年份（用于默认值）
  const currentYear = new Date().getFullYear();

  // ============================================================
  // 保存规则配置
  // ============================================================
  const handleSave = async () => {
    try {
      await form.validateFields();
      setSaveLoading(true);

      // TODO: 调用 Python API 保存规则配置
      // const values = form.getFieldsValue();
      // await request.post('/api/multi-code/rules', values);

      // 模拟接口调用
      await new Promise((resolve) => setTimeout(resolve, 800));
      message.success('规则配置已保存并发布成功');
      setSaveLoading(false);
    } catch {
      // 表单校验失败，antd 自动处理
    }
  };

  return (
    <div style={{ padding: 20 }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 20 }}>
        <Title level={4} style={{ margin: 0, marginBottom: 4 }}>
          编码规则配置
        </Title>
        <Text type="secondary">
          配置多码合一标识系统的编码生成规则，包括分段结构、校验算法等
        </Text>
      </div>

      {/* ============================================================ */}
      {/* 分段式编码规则配置卡片 */}
      {/* ============================================================ */}
      <Card
        title={
          <Space>
            <SaveOutlined />
            <span>分段式编码规则</span>
          </Space>
        }
        bordered={false}
        style={{ borderRadius: 8, marginBottom: 16 }}
      >
        <Alert
          message="规则说明"
          description={
            <Paragraph style={{ margin: 0, fontSize: 13 }}>
              编码由【品类前缀】-【年份】-【产地编号】-【批次号】-【校验位】五段组成，各段之间以
              <Text code>-</Text> 分隔。配置完成后需保存并发布方可生效。
            </Paragraph>
          }
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 360px',
            gap: 24,
            alignItems: 'start',
          }}
        >
          {/* 左侧表单 */}
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              categoryPrefix: 'GCH',
              yearFormat: 'YYYY',
              originCodeLength: 4,
              batchRule: 'daily',
              checkAlgorithm: 'luhn',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0 20px',
              }}
            >
              <Form.Item
                name="categoryPrefix"
                label="品类前缀"
                rules={[{ required: true, message: '请输入品类前缀' }]}
                tooltip="代表中药材品类的唯一标识，如 GCH（管城黄芪）、DGDQ（当归道地）"
              >
                <Input
                  placeholder="例如 GCH"
                  maxLength={6}
                  showCount
                  style={{ textTransform: 'uppercase' }}
                />
              </Form.Item>

              <Form.Item
                name="yearFormat"
                label="年份格式"
                rules={[{ required: true, message: '请选择年份格式' }]}
              >
                <Select placeholder="选择年份格式">
                  <Option value="YYYY">YYYY 全年（如 2025）</Option>
                  <Option value="YY">YY 两位（如 25）</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="originCodeLength"
                label="产地编号长度"
                rules={[
                  { required: true, message: '请输入产地编号长度' },
                  {
                    type: 'number',
                    min: 4,
                    max: 8,
                    message: '产地编号长度需在 4-8 位之间',
                  },
                ]}
                tooltip="产地唯一标识的数字位数，建议 4-6 位"
              >
                <InputNumber
                  min={4}
                  max={8}
                  precision={0}
                  style={{ width: '100%' }}
                  addonAfter="位"
                />
              </Form.Item>

              <Form.Item
                name="batchRule"
                label="批次号递增规则"
                rules={[{ required: true, message: '请选择批次号递增规则' }]}
                tooltip="批次号每日/每月/每年从 1 开始递增"
              >
                <Select placeholder="选择递增规则">
                  <Option value="daily">按日递增（每日从 0001 开始）</Option>
                  <Option value="monthly">按月递增（每月从 0001 开始）</Option>
                  <Option value="yearly">按年递增（每年从 0001 开始）</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="checkAlgorithm"
                label="校验位算法"
                rules={[{ required: true, message: '请选择校验位算法' }]}
                tooltip="校验位用于检测编码录入/扫描时的错误"
                style={{ gridColumn: '1 / -1' }}
              >
                <Select placeholder="选择校验算法">
                  <Option value="luhn">
                    Luhn 算法（推荐）- 广泛用于身份证、银行卡校验
                  </Option>
                  <Option value="mod11">
                    MOD 11 算法（ISO 7064）- 国标常用校验算法，校验位可为 X
                  </Option>
                  <Option value="none">无校验位（不推荐）</Option>
                </Select>
              </Form.Item>
            </div>

            <Divider />

            <Space>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                loading={saveLoading}
                onClick={handleSave}
              >
                保存并发布
              </Button>
              <Button onClick={() => form.resetFields()}>重置</Button>
            </Space>
          </Form>

          {/* 右侧规则效果预览 */}
          <Card
            title="规则效果预览"
            bordered={false}
            style={{
              background: '#f0f2f5',
              borderRadius: 8,
            }}
            headStyle={{ fontSize: 14, fontWeight: 600 }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <Text type="secondary" style={{ fontSize: 12 }}>
                基于当前配置，编码示例如下：
              </Text>

              {/* 编码预览 - 分段高亮 */}
              <div
                style={{
                  background: '#fff',
                  border: '1px solid #d9d9d9',
                  borderRadius: 6,
                  padding: '16px 12px',
                  fontFamily: 'Monaco, "Courier New", monospace',
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  textAlign: 'center',
                }}
              >
                {previewCode.split('-').map((part, i, arr) => (
                  <span key={i}>
                    <span
                      style={{
                        color:
                          i === 0
                            ? '#1677ff'
                            : i === 1
                            ? '#52c41a'
                            : i === 2
                            ? '#fa8c16'
                            : i === 3
                            ? '#eb2f96'
                            : '#722ed1',
                      }}
                    >
                      {part}
                    </span>
                    {i < arr.length - 1 && (
                      <span style={{ color: '#d9d9d9', margin: '0 2px' }}>-</span>
                    )}
                  </span>
                ))}
              </div>

              {/* 分段说明 */}
              <div
                style={{
                  background: '#fff',
                  borderRadius: 6,
                  padding: 12,
                  fontSize: 12,
                }}
              >
                <div style={{ marginBottom: 6 }}>
                  <Text type="secondary">编码结构：</Text>
                </div>
                {[
                  { label: '品类', value: ruleValues?.categoryPrefix || 'GCH', color: '#1677ff' },
                  { label: '年份', value: ruleValues?.yearFormat === 'YYYY' ? currentYear : String(currentYear).slice(-2), color: '#52c41a' },
                  { label: '产地', value: `'${(ruleValues?.originCodeLength || 4)}位编号'`, color: '#fa8c16' },
                  { label: '批次', value: ruleValues?.batchRule === 'daily' ? '日批次' : ruleValues?.batchRule === 'monthly' ? '月批次' : '年批次', color: '#eb2f96' },
                  { label: '校验', value: ruleValues?.checkAlgorithm === 'luhn' ? 'Luhn' : ruleValues?.checkAlgorithm === 'mod11' ? 'MOD11' : '无', color: '#722ed1' },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}
                  >
                    <span style={{ color: item.color, fontWeight: 600 }}>{item.label}</span>
                    <Text type="secondary">{item.value}</Text>
                  </div>
                ))}
              </div>

              {ruleValues?.checkAlgorithm === 'luhn' && (
                <Alert
                  message="Luhn 算法说明"
                  description="校验位由前四段数字通过 Luhn 算法计算得出，可检测任意一位数字错误及大多数换位错误。"
                  type="info"
                  showIcon
                  style={{ fontSize: 11 }}
                />
              )}
              {ruleValues?.checkAlgorithm === 'mod11' && (
                <Alert
                  message="MOD 11 算法说明"
                  description="校验位范围为 0-10，其中 10 用 X 表示。常用于 ISBN、GB/T 标准编码。"
                  type="info"
                  showIcon
                  style={{ fontSize: 11 }}
                />
              )}
            </div>
          </Card>
        </div>
      </Card>

      {/* ============================================================ */}
      {/* 历史规则版本卡片 */}
      {/* ============================================================ */}
      <Card
        title={
          <Space>
            <HistoryOutlined />
            <span>历史规则版本</span>
          </Space>
        }
        bordered={false}
        style={{ borderRadius: 8 }}
      >
        <Table
          columns={ruleVersionColumns}
          dataSource={mockRuleVersions}
          rowKey="id"
          pagination={false}
          size="middle"
          footer={() => (
            <Text type="secondary" style={{ fontSize: 12 }}>
              共 {mockRuleVersions.length} 条规则记录，当前生效版本为{' '}
              <Text strong>{mockRuleVersions.find((r) => r.status === 'active')?.version}</Text>
            </Text>
          )}
        />
      </Card>
    </div>
  );
};

export default CodeRules;
