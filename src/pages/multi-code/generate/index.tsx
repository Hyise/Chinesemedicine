import React, { useState } from 'react';
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
  Button,
  message,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  QrcodeOutlined,
  DownloadOutlined,
  ReloadOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { CodeBatch } from '../types';
import { mockCodeBatches, baseOptions, herbOptions } from '../types';

const { Title, Text } = Typography;

// ============================================================
// 生成记录 Table 列定义
// ============================================================
const batchColumns: ColumnsType<CodeBatch> = [
  {
    title: '批次号',
    dataIndex: 'batchNo',
    key: 'batchNo',
    width: 180,
    fixed: 'left',
    render: (no: string) => (
      <Text code style={{ fontSize: 12 }}>
        {no}
      </Text>
    ),
  },
  {
    title: '产地',
    dataIndex: 'baseName',
    key: 'baseName',
    width: 200,
    ellipsis: true,
  },
  {
    title: '品种',
    dataIndex: 'herbName',
    key: 'herbName',
    width: 140,
  },
  {
    title: '规格',
    dataIndex: 'specification',
    key: 'specification',
    width: 160,
    ellipsis: true,
  },
  {
    title: '生成数量',
    dataIndex: 'quantity',
    key: 'quantity',
    width: 110,
    align: 'right',
    sorter: (a, b) => a.quantity - b.quantity,
    render: (qty: number) => (
      <Text strong style={{ color: '#1677ff' }}>
        {qty.toLocaleString()}
      </Text>
    ),
  },
  {
    title: '生成时间',
    dataIndex: 'generatedAt',
    key: 'generatedAt',
    width: 170,
  },
  {
    title: '操作人',
    dataIndex: 'operator',
    key: 'operator',
    width: 100,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 110,
    filters: [
      { text: '已完成', value: 'completed' },
      { text: '生成中', value: 'generating' },
      { text: '失败', value: 'failed' },
    ],
    onFilter: (value, record) => record.status === value,
    render: (status: CodeBatch['status']) => {
      const config = {
        completed: { color: 'green', icon: <CheckCircleOutlined />, label: '已完成' },
        generating: { color: 'orange', icon: <SyncOutlined spin />, label: '生成中' },
        failed: { color: 'red', icon: <CloseCircleOutlined />, label: '失败' },
      };
      const c = config[status];
      return (
        <Tag color={c.color} icon={c.icon}>
          {c.label}
        </Tag>
      );
    },
  },
  {
    title: '操作',
    key: 'action',
    width: 220,
    fixed: 'right',
    render: (_: unknown, record: CodeBatch) => {
      const isCompleted = record.status === 'completed';
      const isFailed = record.status === 'failed';
      return (
        <Space size={4}>
          <Button
            type="link"
            size="small"
            icon={<DownloadOutlined />}
            disabled={!isCompleted}
            title={isCompleted ? '下载二维码 ZIP' : undefined}
          >
            下载二维码
          </Button>
          <Button
            type="link"
            size="small"
            icon={<FileTextOutlined />}
            disabled={!isCompleted && !isFailed}
          >
            下载 CSV
          </Button>
        </Space>
      );
    },
  },
];

// ===============================================================
// 表单数据类型
// ============================================================
// 字段名与后端 Python API 保持一致
interface GenerateFormValues {
  baseId: string;
  herbId: string;
  specification: string;
  quantity: number;
}

/**
 * 码生成中心页面
 * 提供批量生成多码合一标识的申请入口，并展示生成批次的历史记录
 */
const CodeGenerate: React.FC = () => {
  const [form] = Form.useForm<GenerateFormValues>();
  const [submitLoading, setSubmitLoading] = useState(false);

  // ============================================================
  // 提交批量生成申请
  // ============================================================
  const handleGenerate = async () => {
    try {
      await form.validateFields();
      setSubmitLoading(true);

      // TODO: 调用 Python API 提交生成任务
      // const values = form.getFieldsValue();
      // const response = await request.post<{ batchNo: string }>('/api/multi-code/generate', values);
      // message.success(`生成任务已提交，批次号: ${response.batchNo}`);

      // 模拟接口调用
      await new Promise((resolve) => setTimeout(resolve, 1500));
      message.success('生成任务已提交，请稍后在批次记录中查看进度');
      form.resetFields();
      setSubmitLoading(false);
    } catch {
      // 表单校验失败，antd 自动处理
    }
  };

  // ============================================================
  // 重置表单
  // ============================================================
  const handleReset = () => {
    form.resetFields();
    message.info('表单已重置');
  };

  // 统计数据
  const completedCount = mockCodeBatches.filter((b) => b.status === 'completed').length;
  const generatingCount = mockCodeBatches.filter((b) => b.status === 'generating').length;
  const totalQty = mockCodeBatches
    .filter((b) => b.status === 'completed')
    .reduce((sum, b) => sum + b.quantity, 0);

  return (
    <div style={{ padding: 20 }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 20 }}>
        <Title level={4} style={{ margin: 0, marginBottom: 4 }}>
          码生成中心
        </Title>
        <Text type="secondary">
          批量生成多码合一标识，支持一品一码、全流程溯源
        </Text>
      </div>

      {/* ============================================================ */}
      {/* 统计概览 */}
      {/* ============================================================ */}
      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: 8 }}>
            <Statistic
              title="已生成批次"
              value={completedCount}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: 8 }}>
            <Statistic
              title="生成中任务"
              value={generatingCount}
              prefix={<SyncOutlined style={{ color: '#fa8c16' }} spin />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: 8 }}>
            <Statistic
              title="已生成标识总数"
              value={totalQty}
              prefix={<QrcodeOutlined style={{ color: '#1677ff' }} />}
              valueStyle={{ color: '#1677ff' }}
              suffix="枚"
            />
          </Card>
        </Col>
      </Row>

      {/* ============================================================ */}
      {/* 批量生成申请卡片 */}
      {/* ============================================================ */}
      <Card
        title={
          <Space>
            <QrcodeOutlined />
            <span>批量生成申请</span>
          </Space>
        }
        bordered={false}
        style={{ borderRadius: 8, marginBottom: 16 }}
        extra={
          <Text type="secondary" style={{ fontSize: 12 }}>
            单次最大生成 10,000 枚标识
          </Text>
        }
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ quantity: 1000 }}
        >
          {/* 第一行：产地 + 品种 */}
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="baseId"
                label="产地基地"
                rules={[{ required: true, message: '请选择产地基地' }]}
                tooltip="选择需要生成标识的种植基地"
              >
                <Select
                  placeholder="请选择产地基地"
                  showSearch
                  optionFilterProp="label"
                  options={baseOptions}
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="herbId"
                label="品种"
                rules={[{ required: true, message: '请选择品种' }]}
                tooltip="选择需要生成标识的中药材品种"
              >
                <Select
                  placeholder="请选择品种"
                  showSearch
                  optionFilterProp="label"
                  options={herbOptions}
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          {/* 第二行：规格 + 数量 */}
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="specification"
                label="重量规格"
                rules={[
                  { required: true, message: '请输入规格' },
                  { min: 2, message: '规格描述至少2个字符' },
                ]}
                tooltip="如 5g/支，20支/盒；将打印在标识上"
              >
                <Input
                  placeholder="例如 5g/支，20支/盒"
                  size="large"
                  maxLength={50}
                  showCount
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="quantity"
                label="生成数量"
                rules={[
                  { required: true, message: '请输入生成数量' },
                  {
                    type: 'number',
                    min: 1,
                    max: 10000,
                    message: '单次生成数量需在 1-10,000 之间',
                  },
                ]}
                tooltip="单次最多生成 10,000 枚标识，超出请分批提交"
              >
                <InputNumber
                  min={1}
                  max={10000}
                  precision={0}
                  size="large"
                  style={{ width: '100%' }}
                  addonAfter="枚"
                />
              </Form.Item>
            </Col>
          </Row>

          <Space style={{ marginTop: 8 }}>
            <Button
              type="primary"
              size="large"
              icon={<QrcodeOutlined />}
              loading={submitLoading}
              onClick={handleGenerate}
            >
              生成并打包下载
            </Button>
            <Button size="large" icon={<ReloadOutlined />} onClick={handleReset}>
              重置
            </Button>
          </Space>
        </Form>
      </Card>

      {/* ============================================================ */}
      {/* 生成批次记录卡片 */}
      {/* ============================================================ */}
      <Card
        title={
          <Space>
            <FileTextOutlined />
            <span>生成批次记录</span>
          </Space>
        }
        bordered={false}
        style={{ borderRadius: 8 }}
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} size="small">
              刷新
            </Button>
            <Button icon={<DownloadOutlined />} size="small">
              导出记录
            </Button>
          </Space>
        }
      >
        <Table
          columns={batchColumns}
          dataSource={mockCodeBatches}
          rowKey="id"
          size="middle"
          scroll={{ x: 1400 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
    </div>
  );
};

export default CodeGenerate;
