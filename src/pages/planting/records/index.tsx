import React, { useState, useMemo } from 'react';
import {
  Card, Table, Button, Space, Tag, Input, Modal, Form, Select,
  DatePicker, message, Row, Col, Badge, Divider, Typography,
  Popconfirm, Alert,
} from 'antd';
import {
  SearchOutlined, PlusOutlined, ExportOutlined, CheckCircleOutlined,
  ClockCircleOutlined, SyncOutlined, CloseCircleOutlined,
  CalendarOutlined, BarsOutlined, AlertOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import {
  farmTasks, farmTaskTypes, agriculturalMaterials,
  type FarmTask, type FarmTaskType, type FarmTaskStatus,
  TASK_STATUS_MAP, TASK_STATUS_COLOR_MAP,
} from '../mockData';
import PageHeading from '../../../components/PageHeading';

const { Text, Title } = Typography;
const { Option } = Select;

// ============================================================
// 耗材联动 Form
// ============================================================

interface MaterialLinkField {
  materialId: string;
  quantity: number;
}

interface TaskFormValues {
  baseId: string;
  taskType: FarmTaskType;
  taskName: string;
  description: string;
  scheduledDate: dayjs.Dayjs;
  executor: string;
  materialLinks: MaterialLinkField[];
}

const TaskFormModal: React.FC<{
  open: boolean;
  task?: FarmTask | null;
  onSubmit: (values: TaskFormValues) => void;
  onCancel: () => void;
}> = ({ open, task, onSubmit, onCancel }) => {
  const [form] = Form.useForm<TaskFormValues>();
  const taskType = Form.useWatch('taskType', form);
  const selectedMaterials = Form.useWatch('materialLinks', form) ?? [];
  const needsMaterial = farmTaskTypes.find(t => t.value === taskType)?.needsMaterial ?? false;

  // 化肥/农药的库存列表
  const consumableMaterials = agriculturalMaterials.filter(
    m => m.category === 'fertilizer' || m.category === 'organic' || m.category === 'pesticide'
  );

  const handleFinish = (values: TaskFormValues) => {
    onSubmit({ ...values, scheduledDate: values.scheduledDate });
  };

  return (
    <Modal
      title={
        <Space>
          <PlusOutlined style={{ color: '#1677ff' }} />
          {task ? '编辑农事任务' : '新建农事任务'}
        </Space>
      }
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="确认提交"
      width={620}
      destroyOnClose
      afterOpenChange={(visible) => {
        if (visible) {
          form.resetFields();
          const linked = task?.linkedMaterials?.map(m => ({
            materialId: m.materialId,
            quantity: m.quantity,
          })) ?? [];
          form.setFieldsValue({
            baseId: task?.baseId ?? '',
            taskType: task?.taskType ?? undefined,
            taskName: task?.taskName ?? '',
            description: task?.description ?? '',
            executor: task?.executor ?? '',
            scheduledDate: task?.scheduledDate ? dayjs(task.scheduledDate) : undefined,
            materialLinks: linked,
          });
        }
      }}
    >
      {needsMaterial && (
        <Alert
          type="warning"
          showIcon
          icon={<AlertOutlined />}
          message="该类型任务需关联农资"
          description="请在下方选择本次任务所需的化肥或农药，系统将自动从农资库存中扣减相应数量。"
          style={{ marginBottom: 16 }}
        />
      )}

      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              name="baseId"
              label="执行基地"
              rules={[{ required: true, message: '请选择执行基地' }]}
            >
              <Select placeholder="请选择基地" size="large">
                {farmTasks.map(t => (
                  <Option key={t.baseId} value={t.baseId}>{t.baseName}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="taskType"
              label="任务类型"
              rules={[{ required: true, message: '请选择任务类型' }]}
            >
              <Select placeholder="请选择任务类型" size="large">
                {farmTaskTypes.map(t => (
                  <Option key={t.value} value={t.value}>
                    <Space>
                      <Tag color={t.color} style={{ margin: 0 }}>{t.label}</Tag>
                      {t.needsMaterial && <Text type="warning" style={{ fontSize: 10 }}>(需关联农资)</Text>}
                    </Space>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              name="taskName"
              label="任务名称"
              rules={[{ required: true, message: '请输入任务名称' }]}
            >
              <Input placeholder="如：叶面追肥 - 石斛专用营养液" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="scheduledDate"
              label="计划执行日期"
              rules={[{ required: true, message: '请选择日期' }]}
            >
              <DatePicker style={{ width: '100%' }} size="large" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label="任务描述"
          rules={[{ required: true, message: '请输入任务描述' }]}
        >
          <Input.TextArea rows={2} placeholder="详细描述本次农事的操作步骤、用量标准等" />
        </Form.Item>

        <Form.Item name="executor" label="执行人" rules={[{ required: true, message: '请输入执行人' }]}>
          <Input placeholder="输入执行人姓名" />
        </Form.Item>

        {/* 耗材联动区域 */}
        {needsMaterial && (
          <>
            <Divider orientation="left" plain>
              <Text type="secondary" style={{ fontSize: 12 }}>
                <AlertOutlined style={{ marginRight: 4 }} />
                农资关联（自动扣减库存）
              </Text>
            </Divider>

            <Form.List name="materialLinks">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }, index) => {
                    const mat = consumableMaterials.find(
                      m => m.id === selectedMaterials[index]?.materialId
                    );
                    return (
                      <Row gutter={12} key={key} align="middle" style={{ marginBottom: 8 }}>
                        <Col span={14}>
                          <Form.Item
                            {...restField}
                            name={[name, 'materialId']}
                            rules={[{ required: true, message: ' ' }]}
                            style={{ marginBottom: 0 }}
                          >
                            <Select placeholder="选择农资（化肥/农药）" showSearch
                              filterOption={(input, option) =>
                                (option?.label?.toString() ?? '').includes(input)
                              }
                            >
                              {consumableMaterials.map(m => (
                                <Option key={m.id} value={m.id} label={m.name}>
                                  <div>
                                    <div>{m.name}</div>
                                    <Text type="secondary" style={{ fontSize: 10 }}>
                                      库存：{m.stock} {m.unit} &nbsp;|&nbsp; 供应商：{m.supplier}
                                    </Text>
                                  </div>
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            {...restField}
                            name={[name, 'quantity']}
                            rules={[{ required: true, message: ' ' }]}
                            style={{ marginBottom: 0 }}
                          >
                            <Input type="number" placeholder={`用量（${mat?.unit ?? '单位'}`} min={1} />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Button type="link" danger onClick={() => remove(name)} size="small">
                            移除
                          </Button>
                        </Col>
                      </Row>
                    );
                  })}
                  <Button type="dashed" onClick={() => add()} block style={{ marginBottom: 8 }}>
                    + 添加农资
                  </Button>
                </>
              )}
            </Form.List>

            {selectedMaterials.length > 0 && (
              <Alert
                type="info"
                message={
                  <div>
                    本次任务将从农资库存扣减：
                    {selectedMaterials.map((link, i) => {
                      const mat = consumableMaterials.find(m => m.id === link.materialId);
                      if (!mat) return null;
                      return (
                        <span key={i} style={{ marginRight: 8 }}>
                          <Tag color="blue">{mat.name}</Tag>
                          <Text strong>{link.quantity}</Text>
                          {mat.unit}，
                          扣减后库存：<Text type="danger">{mat.stock - (link.quantity ?? 0)}</Text>
                          {mat.unit}
                        </span>
                      );
                    })}
                  </div>
                }
              />
            )}
          </>
        )}
      </Form>
    </Modal>
  );
};

// ============================================================
// 主页面
// ============================================================

const PlantingRecords: React.FC = () => {
  const [tasks, setTasks] = useState<FarmTask[]>(farmTasks);
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<FarmTask | null>(null);

  const filtered = useMemo(() =>
    tasks.filter(t => {
      const kw = searchText.toLowerCase();
      const matchKw = !kw || t.baseName.toLowerCase().includes(kw) || t.taskName.toLowerCase().includes(kw) || t.executor.includes(searchText);
      const matchType = !typeFilter || t.taskType === typeFilter;
      const matchStatus = !statusFilter || t.status === statusFilter;
      return matchKw && matchType && matchStatus;
    }), [tasks, searchText, typeFilter, statusFilter]);

  const getTaskTypeColor = (type: FarmTaskType) =>
    farmTaskTypes.find(t => t.value === type)?.color ?? 'default';

  const getTaskTypeName = (type: FarmTaskType) =>
    farmTaskTypes.find(t => t.value === type)?.label ?? type;

  const columns: ColumnsType<FarmTask> = [
    {
      title: '任务名称',
      dataIndex: 'taskName',
      key: 'taskName',
      width: 220,
      ellipsis: true,
      render: (name, record) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: 13 }}>{name}</div>
          <Text type="secondary" style={{ fontSize: 11 }}>{record.baseName}</Text>
        </div>
      ),
    },
    {
      title: '任务类型',
      dataIndex: 'taskType',
      key: 'taskType',
      width: 110,
      render: (type: FarmTaskType) => (
        <Tag color={getTaskTypeColor(type)}>{getTaskTypeName(type)}</Tag>
      ),
    },
    {
      title: '执行基地',
      dataIndex: 'baseName',
      key: 'baseName',
      width: 180,
      ellipsis: true,
    },
    {
      title: '计划日期',
      dataIndex: 'scheduledDate',
      key: 'scheduledDate',
      width: 110,
      render: (date) => <Text style={{ fontSize: 12 }}>{date}</Text>,
      sorter: (a, b) => a.scheduledDate.localeCompare(b.scheduledDate),
    },
    {
      title: '执行人',
      dataIndex: 'executor',
      key: 'executor',
      width: 90,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: FarmTaskStatus) => (
        <Tag color={TASK_STATUS_COLOR_MAP[status]} icon={
          status === 'completed' ? <CheckCircleOutlined /> :
          status === 'inProgress' ? <SyncOutlined spin /> :
          status === 'pending' ? <ClockCircleOutlined /> :
          <CloseCircleOutlined />
        }>
          {TASK_STATUS_MAP[status]}
        </Tag>
      ),
      filters: [
        { text: '待执行', value: 'pending' },
        { text: '执行中', value: 'inProgress' },
        { text: '已完成', value: 'completed' },
        { text: '已取消', value: 'cancelled' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '农资关联',
      key: 'materials',
      width: 120,
      render: (_, record) =>
        record.linkedMaterials && record.linkedMaterials.length > 0 ? (
          <Space direction="vertical" size={0}>
            {record.linkedMaterials.map(m => (
              <Tag key={m.materialId} color="purple" style={{ fontSize: 10 }}>
                {m.materialName} ×{m.quantity}{m.unit}
              </Tag>
            ))}
          </Space>
        ) : (
          <Text type="secondary" style={{ fontSize: 11 }}>—</Text>
        ),
    },
    {
      title: '操作',
      key: 'action',
      width: 130,
      fixed: 'right',
      render: (_, record) => (
        <Space size={4}>
          {record.status === 'pending' && (
            <Button type="link" size="small" onClick={() => {
              setTasks(prev => prev.map(t => t.id === record.id ? { ...t, status: 'inProgress' } : t));
              message.success('任务已开始执行');
            }}>
              开始
            </Button>
          )}
          {record.status === 'inProgress' && (
            <Button type="primary" size="small"
              onClick={() => {
                setTasks(prev => prev.map(t => t.id === record.id ? { ...t, status: 'completed' } : t));
                message.success('任务已完成');
              }}>
              完成
            </Button>
          )}
          <Button type="link" size="small" onClick={() => { setEditingTask(record); setFormOpen(true); }}>
            编辑
          </Button>
          <Popconfirm
            title="确认取消该任务？"
            onConfirm={() => {
              setTasks(prev => prev.map(t => t.id === record.id ? { ...t, status: 'cancelled' } : t));
              message.success('任务已取消');
            }}
          >
            <Button type="link" size="small" danger>取消</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 日历视图：按月分组展示任务
  const calendarTasks = filtered.reduce<Record<string, FarmTask[]>>((acc, task) => {
    const month = task.scheduledDate.substring(0, 7);
    if (!acc[month]) acc[month] = [];
    acc[month].push(task);
    return acc;
  }, {});

  const handleFormSubmit = (values: TaskFormValues) => {
    if (editingTask) {
      setTasks(prev => prev.map(t => t.id === editingTask.id ? {
        ...t,
        baseId: values.baseId,
        taskType: values.taskType,
        taskName: values.taskName,
        description: values.description,
        scheduledDate: values.scheduledDate.format('YYYY-MM-DD'),
        executor: values.executor,
        linkedMaterials: values.materialLinks?.length
          ? values.materialLinks.map(l => {
              const mat = agriculturalMaterials.find(m => m.id === l.materialId)!;
              return {
                materialId: l.materialId,
                materialName: mat?.name ?? '',
                unit: mat?.unit ?? '',
                quantity: l.quantity,
                stockBefore: mat?.stock ?? 0,
                stockAfter: (mat?.stock ?? 0) - l.quantity,
              };
            })
          : t.linkedMaterials,
      } : t));
      message.success('任务已更新');
    } else {
      const base = farmTasks.find(t => t.baseId === values.baseId);
      const newTask: FarmTask = {
        id: `task-${Date.now()}`,
        baseId: values.baseId,
        baseName: base?.baseName ?? '',
        herbName: base?.herbName ?? '',
        taskType: values.taskType,
        taskName: values.taskName,
        description: values.description,
        scheduledDate: values.scheduledDate.format('YYYY-MM-DD'),
        executor: values.executor,
        status: 'pending',
        linkedMaterials: values.materialLinks?.map(l => {
          const mat = agriculturalMaterials.find(m => m.id === l.materialId)!;
          return {
            materialId: l.materialId,
            materialName: mat.name,
            unit: mat.unit,
            quantity: l.quantity,
            stockBefore: mat.stock,
            stockAfter: mat.stock - l.quantity,
          };
        }),
        createdAt: new Date().toLocaleString('zh-CN'),
      };
      setTasks(prev => [...prev, newTask]);
      message.success('任务已创建');
    }
    setFormOpen(false);
    setEditingTask(null);
  };

  return (
    <div style={{ padding: 0 }} className="page-container page-enter">
      {/* 页面标题 */}
      <PageHeading
        eyebrow="种植服务管理系统"
        title="农事排期与执行"
        description="管理赤水石斛基地的农事任务排期，支持日历视图与列表视图"
        accentColor="#52c41a"
        gradientFrom="#1d3a1a"
        gradientMid="#2d4a1a"
        gradientTo="#3d5a2a"
        padding="32px 32px 28px"
      />

      {/* 视图切换 + 工具栏 */}
      <Card size="small" style={{ borderRadius: 8, marginBottom: 12 }} styles={{ body: { padding: '12px 16px' } }}>
        <Row gutter={[12, 12]} align="middle">
          <Col>
            <Space>
              <Button
                icon={<BarsOutlined />}
                type={viewMode === 'table' ? 'primary' : 'default'}
                size="small"
                onClick={() => setViewMode('table')}
              >列表视图</Button>
              <Button
                icon={<CalendarOutlined />}
                type={viewMode === 'calendar' ? 'primary' : 'default'}
                size="small"
                onClick={() => setViewMode('calendar')}
              >日历视图</Button>
            </Space>
          </Col>
          <Col>
            <Input
              prefix={<SearchOutlined />}
              placeholder="搜索任务、基地或执行人"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              allowClear
              style={{ width: 200 }}
              size="small"
            />
          </Col>
          <Col>
            <Select
              placeholder="任务类型"
              allowClear
              style={{ width: 120 }}
              size="small"
              value={typeFilter}
              onChange={setTypeFilter}
            >
              {farmTaskTypes.map(t => <Option key={t.value} value={t.value}>{t.label}</Option>)}
            </Select>
          </Col>
          <Col>
            <Select
              placeholder="执行状态"
              allowClear
              style={{ width: 100 }}
              size="small"
              value={statusFilter}
              onChange={setStatusFilter}
            >
              <Option value="pending">待执行</Option>
              <Option value="inProgress">执行中</Option>
              <Option value="completed">已完成</Option>
              <Option value="cancelled">已取消</Option>
            </Select>
          </Col>
          <Col style={{ marginLeft: 'auto' }}>
            <Space>
              <Button icon={<ExportOutlined />} size="small">导出</Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="small"
                onClick={() => { setEditingTask(null); setFormOpen(true); }}
              >
                新建任务
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 任务统计 */}
      <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
        {(['pending', 'inProgress', 'completed', 'cancelled'] as FarmTaskStatus[]).map(s => (
          <Col span={6} key={s}>
            <Card size="small" style={{ borderRadius: 8, cursor: 'pointer', border: statusFilter === s ? '2px solid #1677ff' : undefined }}
              onClick={() => setStatusFilter(statusFilter === s ? undefined : s)}>
              <Space>
                <Badge status={
                  s === 'pending' ? 'default' :
                  s === 'inProgress' ? 'processing' :
                  s === 'completed' ? 'success' : 'error'
                } />
                <Text type="secondary" style={{ fontSize: 12 }}>{TASK_STATUS_MAP[s]}</Text>
                <Text strong style={{ marginLeft: 'auto' }}>{tasks.filter(t => t.status === s).length}</Text>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 表格视图 */}
      {viewMode === 'table' ? (
        <Card style={{ borderRadius: 8 }}>
          <Table
            columns={columns}
            dataSource={filtered}
            rowKey="id"
            pagination={{ pageSize: 8, showSizeChanger: true, showTotal: (t) => `共 ${t} 条任务` }}
            size="small"
            rowClassName={(record) =>
              record.status === 'completed' ? 'ant-table-row-completed' :
              record.status === 'inProgress' ? 'ant-table-row-inprogress' : ''
            }
          />
        </Card>
      ) : (
        /* 日历视图 */
        <Card style={{ borderRadius: 8 }}>
          {Object.entries(calendarTasks)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([month, monthTasks]) => (
              <div key={month} style={{ marginBottom: 24 }}>
                <Title level={5} style={{ marginBottom: 12, fontSize: 14 }}>
                  {month.replace('-', '年')}月
                  <Badge
                    count={monthTasks.length}
                    style={{ marginLeft: 8, backgroundColor: '#1677ff' }}
                  />
                </Title>
                <Row gutter={[12, 12]}>
                  {monthTasks.sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate)).map(task => (
                    <Col span={12} key={task.id}>
                      <Card
                        size="small"
                        style={{
                          borderRadius: 8,
                          borderLeft: `3px solid ${
                            task.status === 'completed' ? '#52c41a' :
                            task.status === 'inProgress' ? '#1677ff' :
                            task.status === 'cancelled' ? '#d9d9d9' : '#faad14'
                          }`,
                        }}
                        bodyStyle={{ padding: '10px 12px' }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{task.taskName}</div>
                            <Text type="secondary" style={{ fontSize: 11 }}>
                              {task.baseName} · {task.executor}
                            </Text>
                            <div style={{ marginTop: 4 }}>
                              <Tag color={getTaskTypeColor(task.taskType)} style={{ fontSize: 10, marginRight: 4 }}>
                                {getTaskTypeName(task.taskType)}
                              </Tag>
                              <Tag color={TASK_STATUS_COLOR_MAP[task.status]} style={{ fontSize: 10 }}>
                                {TASK_STATUS_MAP[task.status]}
                              </Tag>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 8 }}>
                            <div style={{ fontSize: 20, fontWeight: 700, color: '#1677ff', lineHeight: 1 }}>
                              {task.scheduledDate.split('-')[2]}
                            </div>
                            <div style={{ fontSize: 10, color: '#8c8c8c' }}>
                              {task.scheduledDate.split('-')[1]}月
                            </div>
                          </div>
                        </div>
                        {task.linkedMaterials && task.linkedMaterials.length > 0 && (
                          <div style={{ marginTop: 6, paddingTop: 6, borderTop: '1px dashed #f0f0f0' }}>
                            <Text type="secondary" style={{ fontSize: 10 }}>
                              农资：{task.linkedMaterials.map(m => `${m.materialName}×${m.quantity}${m.unit}`).join('、')}
                            </Text>
                          </div>
                        )}
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            ))}
        </Card>
      )}

      {/* 新建/编辑表单 */}
      <TaskFormModal
        open={formOpen}
        task={editingTask}
        onSubmit={handleFormSubmit}
        onCancel={() => { setFormOpen(false); setEditingTask(null); }}
      />
    </div>
  );
};

export default PlantingRecords;
