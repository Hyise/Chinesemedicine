import React, { useState } from 'react';
import {
  Card, Table, Button, Space, Tag, Input, Select, Row, Col,
  Statistic, Modal, Form, InputNumber, message,
  Typography, Tooltip, Alert,
} from 'antd';
import {
  PlusOutlined, CheckCircleOutlined, WarningOutlined,
  ExperimentOutlined, ArrowRightOutlined, SwapOutlined, SearchOutlined,
  ExportOutlined, EyeOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  processRecords, processingRecipes,
  type ProcessRecord, type ProcessStatus,
  PROCESS_STATUS_MAP, PROCESS_STATUS_COLOR_MAP,
} from '../mockData';

const { Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// ============================================================
// 加工工艺选项
// ============================================================
const processOptions = processingRecipes.map(r => ({
  value: `${r.inputForm}-${r.outputForm}-${r.processType}`,
  label: `${r.inputForm} → ${r.outputForm}（${r.processType}）`,
  recipe: r,
}));

// ============================================================
// 投料表单弹窗
// ============================================================

interface ProcessingFormValues {
  inputBatchNo: string;
  inputQty: number;
  processKey: string;
  actualOutput: number;
  remark: string;
}

const ProcessingFormModal: React.FC<{
  open: boolean;
  record?: ProcessRecord | null;
  onSubmit: (values: ProcessingFormValues) => void;
  onCancel: () => void;
}> = ({ open, record, onSubmit, onCancel }) => {
  const [form] = Form.useForm<ProcessingFormValues>();
  const processKey = Form.useWatch('processKey', form);
  const inputQty = Form.useWatch('inputQty', form);

  const selectedRecipe = processOptions.find(p => p.value === processKey)?.recipe;
  const expectedOutput = selectedRecipe && inputQty
    ? (inputQty * selectedRecipe.dryRate / 100).toFixed(1)
    : null;

  return (
    <Modal
      title={
        <Space>
          <ExperimentOutlined style={{ color: '#4f46e5' }} />
          {record ? '编辑加工记录' : '新建加工投料单'}
        </Space>
      }
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="提交记录"
      width={520}
      destroyOnClose
      afterOpenChange={(visible) => {
        if (visible && !record) { form.resetFields(); }
      }}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              name="inputBatchNo"
              label="选择投料批次"
              rules={[{ required: true, message: '请选择批次' }]}
            >
              <Select placeholder="选择原料批次">
                <Option value="GCH-F-20260420">GCH-F-20260420（鲜条 200kg）</Option>
                <Option value="GCH-F-20260422">GCH-F-20260422（鲜条 180kg）</Option>
                <Option value="GCH-D-20260315">GCH-D-20260315（干条 800kg）</Option>
                <Option value="GCH-D-20260328">GCH-D-20260328（干条 1200kg）</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="inputQty"
              label="投料重量（kg）"
              rules={[{ required: true, message: '请输入投料量' }]}
            >
              <InputNumber min={1} style={{ width: '100%' }} placeholder="输入投料重量" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="processKey"
          label="选择工艺"
          rules={[{ required: true, message: '请选择加工工艺' }]}
        >
          <Select placeholder="选择工艺类型" size="large">
            {processOptions.map(opt => (
              <Option key={opt.value} value={opt.value}>
                <Space>
                  <Tag color="blue" style={{ margin: 0 }}>{opt.recipe.inputForm}</Tag>
                  <ArrowRightOutlined style={{ fontSize: 10, color: '#94a3b8' }} />
                  <Tag color="green" style={{ margin: 0 }}>{opt.recipe.outputForm}</Tag>
                  <Text type="secondary" style={{ fontSize: 11 }}>（{opt.recipe.processType}）</Text>
                </Space>
              </Option>
            ))}
          </Select>
        </Form.Item>

        {selectedRecipe && (
          <Alert
            type="info"
            showIcon
            icon={<SwapOutlined />}
            message={
              <div>
                折干率 <Text strong>{selectedRecipe.dryRate}%</Text>，
                投料 <Text strong>{inputQty || 0}kg</Text>，
                理论产出 <Text strong style={{ color: '#4f46e5' }}>{expectedOutput || 0}kg</Text>
              </div>
            }
            style={{ marginBottom: 12 }}
          />
        )}

        <Form.Item
          name="actualOutput"
          label="实际产出重量（kg）"
          rules={[{ required: true, message: '请输入实际产出' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} placeholder="输入实际产出重量" />
        </Form.Item>

        <Form.Item name="remark" label="备注">
          <TextArea rows={2} placeholder="记录损耗原因或特殊情况" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

// ============================================================
// 主组件
// ============================================================

const WmsProcessing: React.FC = () => {
  const [records, setRecords] = useState<ProcessRecord[]>(processRecords);
  const [searchText, setSearchText] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ProcessRecord | null>(null);

  const filtered = records.filter(r =>
    !searchText ||
    r.processNo.includes(searchText) ||
    r.inputBatchNo.includes(searchText) ||
    r.inputHerb.includes(searchText)
  );

  const columns: ColumnsType<ProcessRecord> = [
    {
      title: '工艺单号',
      dataIndex: 'processNo',
      key: 'processNo',
      width: 150,
      render: (no) => <Text code style={{ fontSize: 11 }}>{no}</Text>,
    },
    {
      title: '投料批次',
      dataIndex: 'inputBatchNo',
      key: 'inputBatchNo',
      width: 140,
      render: (no) => <Text code style={{ fontSize: 11 }}>{no}</Text>,
    },
    {
      title: '药材',
      dataIndex: 'inputHerb',
      key: 'inputHerb',
      width: 90,
      render: (name, record) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ fontSize: 12 }}>{name}</Text>
          <Text type="secondary" style={{ fontSize: 10 }}>{record.inputForm}</Text>
        </Space>
      ),
    },
    {
      title: '加工工艺',
      dataIndex: 'processType',
      key: 'processType',
      width: 110,
      render: (type) => <Tag color="blue" style={{ fontSize: 10 }}>{type}</Tag>,
    },
    {
      title: '投料量',
      dataIndex: 'inputQty',
      key: 'inputQty',
      width: 90,
      align: 'right',
      render: (qty, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{qty}</Text>
          <Text type="secondary" style={{ fontSize: 10 }}>kg · {record.outputForm}</Text>
        </Space>
      ),
    },
    {
      title: '折干率',
      dataIndex: 'dryRate',
      key: 'dryRate',
      width: 80,
      align: 'center',
      render: (v) => <Text style={{ fontSize: 12, color: '#4f46e5', fontWeight: 600 }}>{v}%</Text>,
    },
    {
      title: '理论产出',
      dataIndex: 'expectedOutput',
      key: 'expectedOutput',
      width: 90,
      align: 'right',
      render: (v) => <Text>{v} kg</Text>,
    },
    {
      title: '实际产出',
      dataIndex: 'actualOutput',
      key: 'actualOutput',
      width: 90,
      align: 'right',
      render: (v) => v === 0 ? <Text type="secondary">—</Text> : <Text strong>{v} kg</Text>,
    },
    {
      title: '实际折干率',
      dataIndex: 'actualDryRate',
      key: 'actualDryRate',
      width: 100,
      align: 'center',
      render: (v, record) => {
        if (v === 0) return <Text type="secondary">—</Text>;
        const diff = Math.abs(v - record.dryRate);
        const isAbnormal = diff > 5;
        return (
          <Tooltip title={`理论${record.dryRate}%，实际${v}%，偏差${diff.toFixed(1)}%`}>
            <Tag
              color={isAbnormal ? 'error' : 'success'}
              icon={isAbnormal ? <WarningOutlined /> : <CheckCircleOutlined />}
              style={{ fontSize: 10 }}
            >
              {v}%
              {isAbnormal && <span style={{ marginLeft: 4 }}>异常</span>}
            </Tag>
          </Tooltip>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: ProcessStatus) => (
        <Tag color={PROCESS_STATUS_COLOR_MAP[status]}>
          {PROCESS_STATUS_MAP[status]}
        </Tag>
      ),
    },
    {
      title: '加工日期',
      dataIndex: 'processDate',
      key: 'processDate',
      width: 100,
      render: (d) => <Text style={{ fontSize: 12 }}>{d}</Text>,
    },
    {
      title: '操作',
      key: 'action',
      width: 90,
      fixed: 'right',
      render: (_, record) => (
        <Space size={4}>
          <Button type="link" size="small" onClick={() => { setEditingRecord(record); setFormOpen(true); }}
            style={{ fontSize: 11, padding: 0 }}>编辑</Button>
          <Button type="link" size="small" icon={<EyeOutlined />} style={{ fontSize: 11, padding: 0 }}
            onClick={() => message.info(`工艺单 ${record.processNo}：投料批次 ${record.inputBatchNo}，${record.inputHerb} ${record.inputForm} → ${record.outputForm}，折干率 ${record.dryRate}%`)}>详情</Button>
        </Space>
      ),
    },
  ];

  const totalInput = records.reduce((s, r) => s + r.inputQty, 0);
  const totalOutput = records.reduce((s, r) => s + r.actualOutput, 0);
  const abnormalCount = records.filter(r => {
    if (r.actualDryRate === 0) return false;
    return Math.abs(r.actualDryRate - r.dryRate) > 5;
  }).length;

  const handleSubmit = (values: ProcessingFormValues) => {
    const recipe = processingRecipes.find(
      r => `${r.inputForm}-${r.outputForm}-${r.processType}` === values.processKey
    )!;
    const expected = values.inputQty * recipe.dryRate / 100;
    const actual = values.actualOutput;
    const lossRate = ((values.inputQty - actual) / values.inputQty * 100).toFixed(1);
    const newRecord: ProcessRecord = {
      id: `proc-${Date.now()}`,
      processNo: `PROC-2026-${String(records.length + 1).padStart(4, '0')}`,
      inputBatchNo: values.inputBatchNo,
      inputHerb: '金钗石斛',
      inputForm: recipe.inputForm,
      inputQty: values.inputQty,
      processType: recipe.processType,
      outputForm: recipe.outputForm,
      expectedOutput: expected,
      actualOutput: actual,
      dryRate: recipe.dryRate,
      actualDryRate: parseFloat((actual / values.inputQty * 100).toFixed(1)),
      lossRate: parseFloat(lossRate),
      operator: '当前用户',
      processDate: new Date().toLocaleDateString('zh-CN'),
      status: 'completed',
      remark: values.remark,
    };
    setRecords(prev => [newRecord, ...prev]);
    message.success('加工记录已创建');
    setFormOpen(false);
    setEditingRecord(null);
  };

  return (
    <div style={{ padding: 0 }} className="page-container page-enter">
      {/* 页面标题 */}
      <div style={{ marginBottom: 16 }}>
        <h3 className="page-title" style={{ margin: '0 0 4px' }}>加工转化与出材率管控</h3>
        <p className="page-desc">管理鲜条→干条、干条→切片等加工转化流程，监控折干率与损耗</p>
      </div>

      {/* 统计 */}
      <Row gutter={[12, 12]} style={{ marginBottom: 14 }}>
        <Col span={6}>
          <Card size="small" className="card-interactive" style={{ borderRadius: 12, textAlign: 'center' }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: 11 }}>累计投料</Text>}
              value={totalInput}
              suffix="kg"
              valueStyle={{ fontSize: 22, color: '#4f46e5' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" className="card-interactive" style={{ borderRadius: 12, textAlign: 'center' }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: 11 }}>累计产出</Text>}
              value={totalOutput}
              suffix="kg"
              valueStyle={{ fontSize: 22, color: '#10b981' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" className="card-interactive" style={{ borderRadius: 12, textAlign: 'center' }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: 11 }}>工艺记录</Text>}
              value={records.length}
              suffix="条"
              valueStyle={{ fontSize: 22, color: '#f59e0b' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" className="card-interactive" style={{ borderRadius: 12, textAlign: 'center' }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: 11 }}>异常损耗</Text>}
              value={abnormalCount}
              suffix="条"
              valueStyle={{ fontSize: 22, color: abnormalCount > 0 ? '#ef4444' : '#10b981' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 折干率参考 */}
      <Card
        size="small"
        style={{ borderRadius: 10, marginBottom: 14, background: '#f8fafc' }}
        styles={{ body: { padding: '10px 16px' } }}
      >
        <Space>
          <Text type="secondary" style={{ fontSize: 12 }}>折干率参考：</Text>
          {processingRecipes.map(r => (
            <Tag key={`${r.inputForm}-${r.outputForm}`} color="blue" style={{ fontSize: 11 }}>
              {r.inputForm} → {r.outputForm}：{r.dryRate}%
            </Tag>
          ))}
        </Space>
      </Card>

      {/* 工具栏 */}
      <Card size="small" style={{ borderRadius: 10, marginBottom: 12 }} styles={{ body: { padding: '10px 14px' } }}>
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} sm={12}>
            <Input
              prefix={<SearchOutlined />}
              placeholder="搜索工艺单号、批次号或药材"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              allowClear
              size="small"
            />
          </Col>
          <Col style={{ marginLeft: 'auto' }}>
            <Space>
              <Button icon={<ExportOutlined />} size="small" onClick={() => message.success('工艺记录导出中...')}>导出</Button>
              <Button type="primary" icon={<PlusOutlined />} size="small"
                onClick={() => { setEditingRecord(null); setFormOpen(true); }}>
                新建投料单
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 工艺记录表 */}
      <Card style={{ borderRadius: 10 }}>
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          pagination={{ pageSize: 8, showSizeChanger: true, showTotal: (t) => `共 ${t} 条记录` }}
          size="small"
          scroll={{ x: 1300 }}
        />
      </Card>

      {/* 投料表单 */}
      <ProcessingFormModal
        open={formOpen}
        record={editingRecord}
        onSubmit={handleSubmit}
        onCancel={() => { setFormOpen(false); setEditingRecord(null); }}
      />
    </div>
  );
};

export default WmsProcessing;
