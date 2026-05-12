import React, { useState } from 'react';
import {
  Card, Row, Col, Button, Space, Input, Select, Tag, Typography,
  Badge, Modal, Form, InputNumber, message, Statistic, Divider,
  Descriptions, Tooltip, Alert, Table, Drawer,
} from 'antd';
import {
  PlusOutlined, SearchOutlined, ShoppingCartOutlined,
  AppstoreOutlined, ExperimentOutlined, ToolOutlined,
  UnorderedListOutlined, ExclamationCircleOutlined, WarningOutlined,
} from '@ant-design/icons';
import {
  agriculturalMaterials, materialCategories,
  type AgriculturalMaterial, type MaterialCategory,
  type MaterialApplication,
} from '../mockData';
import PageHeading from '../../../components/PageHeading';

const { Text, Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// ============================================================
// 类型映射
// ============================================================

const categoryColorMap: Record<MaterialCategory, string> = {
  seedling: 'green',
  fertilizer: 'blue',
  organic: 'cyan',
  pesticide: 'orange',
  tool: 'purple',
};

const categoryIconMap: Record<MaterialCategory, React.ReactNode> = {
  seedling: <ExperimentOutlined />,
  fertilizer: <AppstoreOutlined />,
  organic: <ExperimentOutlined />,
  pesticide: <ExperimentOutlined />,
  tool: <ToolOutlined />,
};

// ============================================================
// 采购申请表单
// ============================================================

interface ApplyFormValues {
  materialId: string;
  quantity: number;
  remark: string;
}

const ApplyModal: React.FC<{
  material: AgriculturalMaterial | null;
  open: boolean;
  onSubmit: (app: MaterialApplication) => void;
  onCancel: () => void;
}> = ({ material, open, onSubmit, onCancel }) => {
  const [form] = Form.useForm<ApplyFormValues>();
  const [loading, setLoading] = useState(false);

  const handleFinish = (values: ApplyFormValues) => {
    setLoading(true);
    setTimeout(() => {
      const mat = agriculturalMaterials.find(m => m.id === values.materialId)!;
      const app: MaterialApplication = {
        id: `app-${Date.now()}`,
        materialId: values.materialId,
        materialName: mat.name,
        category: mat.category,
        quantity: values.quantity,
        unit: mat.unit,
        applicant: '当前用户',
        applyDate: new Date().toLocaleDateString('zh-CN'),
        status: 'pending',
        remark: values.remark,
      };
      onSubmit(app);
      setLoading(false);
      form.resetFields();
    }, 600);
  };

  return (
    <Modal
      title={
        <Space><ShoppingCartOutlined style={{ color: '#1677ff' }} />申请采购农资</Space>
      }
      open={open}
      onCancel={() => { onCancel(); form.resetFields(); }}
      onOk={() => form.submit()}
      okText="提交申请"
      confirmLoading={loading}
      destroyOnClose
      afterOpenChange={(visible) => {
        if (visible && material) {
          form.setFieldsValue({ materialId: material.id, quantity: 1 });
        }
      }}
    >
      {material && (
        <Alert
          type="info"
          message={
            <div>
              正在申请采购：<Text strong>{material.name}</Text>
              &nbsp;（当前库存 <Text type="warning">{material.stock}</Text> {material.unit}，
              安全库存 <Text>{material.safetyStock}</Text> {material.unit}）
            </div>
          }
          style={{ marginBottom: 16 }}
        />
      )}
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="materialId"
          label="农资物资"
          rules={[{ required: true, message: '请选择农资' }]}
        >
          <Select placeholder="选择农资物资">
            {agriculturalMaterials.map(m => (
              <Option key={m.id} value={m.id}>
                <Space>
                  <Tag color={categoryColorMap[m.category]} style={{ margin: 0 }}>{materialCategories.find(c => c.value === m.category)?.label}</Tag>
                  <span>{m.name}</span>
                  <Text type="secondary">（库存：{m.stock}{m.unit}）</Text>
                </Space>
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="quantity"
          label="申请数量"
          rules={[{ required: true, message: '请输入数量' }]}
        >
          <InputNumber
            min={1}
            style={{ width: '100%' }}
            addonAfter={material?.unit ?? ''}
            placeholder="请输入申请数量"
          />
        </Form.Item>
        <Form.Item name="remark" label="备注说明">
          <TextArea rows={2} placeholder="说明采购原因、用途等" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

// ============================================================
// 入库登记表单
// ============================================================

interface StockInFormValues {
  materialId: string;
  quantity: number;
  remark: string;
}

const StockInModal: React.FC<{
  material: AgriculturalMaterial | null;
  open: boolean;
  onSubmit: (values: StockInFormValues) => void;
  onCancel: () => void;
}> = ({ material, open, onSubmit, onCancel }) => {
  const [form] = Form.useForm<StockInFormValues>();
  const [loading, setLoading] = useState(false);

  const handleFinish = (values: StockInFormValues) => {
    setLoading(true);
    setTimeout(() => {
      onSubmit(values);
      setLoading(false);
      form.resetFields();
    }, 600);
  };

  return (
    <Modal
      title={
        <Space><PlusOutlined style={{ color: '#10b981' }} />农资入库登记</Space>
      }
      open={open}
      onCancel={() => { onCancel(); form.resetFields(); }}
      onOk={() => form.submit()}
      okText="确认入库"
      okButtonProps={{ style: { background: '#10b981' } }}
      confirmLoading={loading}
      destroyOnClose
      afterOpenChange={(visible) => {
        if (visible && material) {
          form.setFieldsValue({ materialId: material.id, quantity: 1 });
        }
      }}
    >
      {material && (
        <Alert
          type="success"
          message={
            <div>
              正在入库登记：<Text strong>{material.name}</Text>
              &nbsp;（当前库存 <Text type="secondary">{material.stock}</Text> {material.unit}）
            </div>
          }
          style={{ marginBottom: 16 }}
        />
      )}
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item name="materialId" label="农资物资" rules={[{ required: true }]}>
          <Select placeholder="选择农资物资">
            {agriculturalMaterials.map(m => (
              <Option key={m.id} value={m.id}>{m.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="quantity" label="入库数量" rules={[{ required: true }]}>
          <InputNumber
            min={1}
            style={{ width: '100%' }}
            addonAfter={material?.unit ?? ''}
            placeholder="请输入入库数量"
          />
        </Form.Item>
        <Form.Item name="remark" label="备注说明">
          <TextArea rows={2} placeholder="入库批次、有效期等信息" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

// ============================================================
// 主页面
// ============================================================

const PlantingMaterials: React.FC = () => {
  const [category, setCategory] = useState<MaterialCategory | undefined>();
  const [searchText, setSearchText] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [stockInModalOpen, setStockInModalOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<AgriculturalMaterial | null>(null);
  const [materialStock, setMaterialStock] = useState<Record<string, number>>(
    Object.fromEntries(agriculturalMaterials.map(m => [m.id, m.stock]))
  );
  const [applications, setApplications] = useState<MaterialApplication[]>([]);

  const filtered = agriculturalMaterials.filter(m => {
    const matchCat = !category || m.category === category;
    const kw = searchText.toLowerCase();
    const matchSearch = !kw || m.name.toLowerCase().includes(kw) || m.supplier.toLowerCase().includes(kw);
    return matchCat && matchSearch;
  });

  // 库存告警
  const lowStockMaterials = agriculturalMaterials.filter(
    m => materialStock[m.id] <= m.safetyStock
  );

  const handleApply = (app: MaterialApplication) => {
    setApplications(prev => [app, ...prev]);
    message.success(`采购申请已提交：「${app.materialName}」×${app.quantity}${app.unit}`);
    setApplyModalOpen(false);
    setSelectedMaterial(null);
  };

  const handleStockIn = (values: StockInFormValues) => {
    const mat = agriculturalMaterials.find(m => m.id === values.materialId)!;
    setMaterialStock(prev => ({
      ...prev,
      [values.materialId]: (prev[values.materialId] ?? 0) + values.quantity,
    }));
    message.success(`入库成功：「${mat.name}」+${values.quantity}${mat.unit}，当前库存 ${(materialStock[values.materialId] ?? 0) + values.quantity} ${mat.unit}`);
    setStockInModalOpen(false);
    setSelectedMaterial(null);
  };

  return (
    <div style={{ padding: 0 }} className="page-container page-enter">
      {/* 页面标题 */}
      <PageHeading
        eyebrow="种植服务管理系统"
        title="农资与种苗中心"
        description="统一管理石斛种植所需的种苗、肥料、农药及农具物资"
        accentColor="#52c41a"
        gradientFrom="#1d3a1a"
        gradientMid="#2d4a1a"
        gradientTo="#3d5a2a"
        padding="32px 32px 28px"
      />

      {/* 统计卡片 */}
      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        <Col span={4}>
          <Card size="small" style={{ borderRadius: 8, textAlign: 'center' }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: 11 }}>物资种类</Text>}
              value={agriculturalMaterials.length}
              valueStyle={{ fontSize: 22, color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small" style={{ borderRadius: 8, textAlign: 'center' }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: 11 }}>种苗类</Text>}
              value={agriculturalMaterials.filter(m => m.category === 'seedling').length}
              valueStyle={{ fontSize: 22, color: '#10b981' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small" style={{ borderRadius: 8, textAlign: 'center' }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: 11 }}>化肥农药</Text>}
              value={agriculturalMaterials.filter(m => ['fertilizer', 'organic', 'pesticide'].includes(m.category)).length}
              valueStyle={{ fontSize: 22, color: '#f59e0b' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small" style={{ borderRadius: 8, textAlign: 'center' }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: 11 }}>农具类</Text>}
              value={agriculturalMaterials.filter(m => m.category === 'tool').length}
              valueStyle={{ fontSize: 22, color: '#8b5cf6' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small" style={{ borderRadius: 8, textAlign: 'center' }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: 11 }}>待审批申请</Text>}
              value={applications.filter(a => a.status === 'pending').length}
              valueStyle={{ fontSize: 22, color: '#ec4899' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card
            size="small"
            style={{ borderRadius: 8, textAlign: 'center', border: lowStockMaterials.length > 0 ? '1px solid #ff4d4f' : undefined }}
          >
            <Statistic
              title={<Text type="secondary" style={{ fontSize: 11 }}>库存告警</Text>}
              value={lowStockMaterials.length}
              valueStyle={{ fontSize: 22, color: lowStockMaterials.length > 0 ? '#ff4d4f' : '#52c41a' }}
              prefix={lowStockMaterials.length > 0 ? <WarningOutlined /> : undefined}
            />
          </Card>
        </Col>
      </Row>

      {/* 库存告警 */}
      {lowStockMaterials.length > 0 && (
        <Alert
          type="warning"
          showIcon
          icon={<ExclamationCircleOutlined />}
          message={`库存低于安全线：${lowStockMaterials.map(m => m.name).join('、')}`}
          style={{ marginBottom: 12 }}
          action={
            <Button size="small" onClick={() => {
              const mat = lowStockMaterials[0];
              setSelectedMaterial(mat);
              setApplyModalOpen(true);
            }}>立即采购</Button>
          }
        />
      )}

      {/* 工具栏 */}
      <Card size="small" style={{ borderRadius: 8, marginBottom: 12 }} styles={{ body: { padding: '12px 16px' } }}>
        <Row gutter={[12, 12]} align="middle">
          <Col>
            <Input
              prefix={<SearchOutlined />}
              placeholder="搜索物资名称或供应商"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              allowClear
              style={{ width: 220 }}
              size="small"
            />
          </Col>
          <Col>
            <Select
              placeholder="分类筛选"
              allowClear
              style={{ width: 120 }}
              size="small"
              value={category}
              onChange={v => setCategory(v as MaterialCategory | undefined)}
            >
              {materialCategories.map(c => (
                <Option key={c.value} value={c.value}>{c.label}</Option>
              ))}
            </Select>
          </Col>
          <Col>
            <Space>
              <Button
                icon={<AppstoreOutlined />}
                type={viewMode === 'grid' ? 'primary' : 'default'}
                size="small"
                onClick={() => setViewMode('grid')}
              >卡片</Button>
              <Button
                icon={<UnorderedListOutlined />}
                type={viewMode === 'list' ? 'primary' : 'default'}
                size="small"
                onClick={() => setViewMode('list')}
              >列表</Button>
            </Space>
          </Col>
          <Col style={{ marginLeft: 'auto' }}>
            <Space>
              <Button
                icon={<PlusOutlined />}
                size="small"
                onClick={() => { setSelectedMaterial(null); setStockInModalOpen(true); }}
              >入库登记</Button>
              <Button
                type="primary"
                icon={<ShoppingCartOutlined />}
                size="small"
                onClick={() => { setSelectedMaterial(null); setApplyModalOpen(true); }}
              >申请采购</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 分类标签栏 */}
      <div style={{ marginBottom: 12 }}>
        <Space wrap>
          <Tag
            color={category === undefined ? 'blue' : 'default'}
            style={{ cursor: 'pointer' }}
            onClick={() => setCategory(undefined)}
          >
            全部 ({agriculturalMaterials.length})
          </Tag>
          {materialCategories.map(c => (
            <Tag
              key={c.value}
              color={category === c.value ? categoryColorMap[c.value] : 'default'}
              style={{ cursor: 'pointer' }}
              onClick={() => setCategory(c.value)}
            >
              {categoryIconMap[c.value]} {c.label}（{agriculturalMaterials.filter(m => m.category === c.value).length}）
            </Tag>
          ))}
        </Space>
      </div>

      {/* 卡片视图 */}
      {viewMode === 'grid' ? (
        <Row gutter={[12, 12]}>
          {filtered.map(mat => {
            const stock = materialStock[mat.id] ?? mat.stock;
            const isLow = stock <= mat.safetyStock;
            return (
              <Col span={8} key={mat.id}>
                <Card
                  hoverable
                  style={{ borderRadius: 10, border: isLow ? '1px solid #ff4d4f' : '1px solid #f0f0f0' }}
                  bodyStyle={{ padding: 16 }}
                >
                  {/* 头部：分类标签 + 告警 */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <Tag color={categoryColorMap[mat.category]} icon={categoryIconMap[mat.category]}>
                      {materialCategories.find(c => c.value === mat.category)?.label}
                    </Tag>
                    {isLow && (
                      <Tooltip title={`当前库存 ${stock}${mat.unit}，低于安全库存 ${mat.safetyStock}${mat.unit}`}>
                        <Badge count={<WarningOutlined style={{ color: '#ff4d4f', fontSize: 14 }} />} />
                      </Tooltip>
                    )}
                  </div>

                  {/* 名称 */}
                  <Title level={5} style={{ margin: '0 0 8px', fontSize: 15 }}>{mat.name}</Title>

                  {/* 规格 */}
                  <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>
                    规格：{mat.specification}
                  </Text>

                  {/* 库存 */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>库存</Text>
                    <Text strong style={{ fontSize: 18, color: isLow ? '#ff4d4f' : '#10b981' }}>
                      {stock.toLocaleString()}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>{mat.unit}</Text>
                    <Text type="secondary" style={{ fontSize: 10 }}>/ 安全 {mat.safetyStock}</Text>
                  </div>

                  {/* 单价 + 供应商 */}
                  <div style={{ fontSize: 11, color: '#8c8c8c', marginBottom: 12 }}>
                    单价：<Text type="secondary">{mat.unitPrice} 元/{mat.unit}</Text>
                    &nbsp;|&nbsp; 供应商：<Text type="secondary">{mat.supplier}</Text>
                  </div>

                  {/* 操作 */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Button
                      size="small"
                      icon={<PlusOutlined />}
                      onClick={() => { setSelectedMaterial(mat); setStockInModalOpen(true); }}
                    >入库</Button>
                    <Button
                      size="small"
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                      onClick={() => { setSelectedMaterial(mat); setApplyModalOpen(true); }}
                    >采购</Button>
                    <Button
                      size="small"
                      onClick={() => { setSelectedMaterial(mat); setDetailDrawerOpen(true); }}
                    >详情</Button>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      ) : (
        /* 列表视图 */
        <Card style={{ borderRadius: 8 }} styles={{ body: { padding: 0 } }}>
          <Table<AgriculturalMaterial>
            columns={[
              { title: '物资名称', dataIndex: 'name', key: 'name', width: 160, render: (n: string) => <Text strong style={{ fontSize: 13 }}>{n}</Text> },
              { title: '分类', dataIndex: 'category', key: 'category', width: 90, render: (c: MaterialCategory) => <Tag color={categoryColorMap[c]}>{materialCategories.find(x => x.value === c)?.label}</Tag> },
              { title: '规格', dataIndex: 'specification', key: 'specification', ellipsis: true, width: 150 },
              { title: '库存', dataIndex: 'id', key: 'stock', width: 110, align: 'right' as const, render: (_, record) => { const s = materialStock[record.id] ?? record.stock; const low = s <= record.safetyStock; return <Text strong style={{ color: low ? '#ff4d4f' : '#10b981', fontSize: 13 }}>{s.toLocaleString()}</Text>; } },
              { title: '单价', dataIndex: 'unitPrice', key: 'unitPrice', width: 110, align: 'right' as const, render: (p: number, record: AgriculturalMaterial) => <Text>{p} 元/{record.unit}</Text> },
              { title: '供应商', dataIndex: 'supplier', key: 'supplier', ellipsis: true, width: 140 },
              { title: '最近采购', dataIndex: 'lastPurchaseDate', key: 'lastPurchaseDate', width: 110 },
              {
                title: '操作', key: 'action', width: 180, render: (_, r) => (
                  <Space size={4}>
                    <Button size="small" onClick={() => { setSelectedMaterial(r); setStockInModalOpen(true); }}>入库</Button>
                    <Button size="small" type="primary" onClick={() => { setSelectedMaterial(r); setApplyModalOpen(true); }}>采购</Button>
                    <Button size="small" onClick={() => { setSelectedMaterial(r); setDetailDrawerOpen(true); }}>详情</Button>
                  </Space>
                ),
              },
            ]}
            dataSource={filtered}
            rowKey="id"
            pagination={{ pageSize: 10, showSizeChanger: true, showTotal: t => `共 ${t} 条` }}
            size="small"
          />
        </Card>
      )}

      {/* 待审批采购申请 */}
      {applications.filter(a => a.status === 'pending').length > 0 && (
        <Card size="small" style={{ borderRadius: 8, marginTop: 12 }} title={<Text style={{ fontSize: 13 }}>待审批采购申请</Text>}>
          <Row gutter={[12, 8]}>
            {applications.filter(a => a.status === 'pending').map(app => (
              <Col span={8} key={app.id}>
                <Card size="small" style={{ borderRadius: 8, border: '1px solid #e6f4ff', background: '#f0f5ff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Tag color="blue">{materialCategories.find(c => c.value === app.category)?.label}</Tag>
                    <Tag color="orange">待审批</Tag>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{app.materialName}</div>
                  <div style={{ fontSize: 11, color: '#8c8c8c' }}>
                    数量：{app.quantity}{app.unit} &nbsp;|&nbsp; 申请人：{app.applicant} &nbsp;|&nbsp; {app.applyDate}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      )}

      {/* 申请采购弹窗 */}
      <ApplyModal
        material={selectedMaterial}
        open={applyModalOpen}
        onSubmit={handleApply}
        onCancel={() => { setApplyModalOpen(false); setSelectedMaterial(null); }}
      />

      {/* 入库登记弹窗 */}
      <StockInModal
        material={selectedMaterial}
        open={stockInModalOpen}
        onSubmit={handleStockIn}
        onCancel={() => { setStockInModalOpen(false); setSelectedMaterial(null); }}
      />

      {/* 详情抽屉 */}
      <Drawer
        title={<Space><AppstoreOutlined style={{ color: '#1677ff' }} />农资详情</Space>}
        placement="right" width={500}
        open={detailDrawerOpen}
        onClose={() => { setDetailDrawerOpen(false); setSelectedMaterial(null); }}
      >
        {selectedMaterial && (
          <>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="物资名称" span={2}><Text strong>{selectedMaterial.name}</Text></Descriptions.Item>
              <Descriptions.Item label="分类"><Tag color={categoryColorMap[selectedMaterial.category]}>{materialCategories.find(c => c.value === selectedMaterial.category)?.label}</Tag></Descriptions.Item>
              <Descriptions.Item label="规格">{selectedMaterial.specification}</Descriptions.Item>
              <Descriptions.Item label="当前库存" span={2}><Text strong style={{ color: '#10b981', fontSize: 16 }}>{(materialStock[selectedMaterial.id] ?? selectedMaterial.stock).toLocaleString()} {selectedMaterial.unit}</Text></Descriptions.Item>
              <Descriptions.Item label="安全库存">{selectedMaterial.safetyStock} {selectedMaterial.unit}</Descriptions.Item>
              <Descriptions.Item label="单价">{selectedMaterial.unitPrice} 元/{selectedMaterial.unit}</Descriptions.Item>
              <Descriptions.Item label="供应商" span={2}>{selectedMaterial.supplier}</Descriptions.Item>
              <Descriptions.Item label="最近采购">{selectedMaterial.lastPurchaseDate}</Descriptions.Item>
              <Descriptions.Item label="物资描述" span={2}>{selectedMaterial.description ?? '暂无描述'}</Descriptions.Item>
            </Descriptions>
            <Divider />
            <Space>
              <Button type="primary" icon={<ShoppingCartOutlined />}
                onClick={() => { setDetailDrawerOpen(false); setApplyModalOpen(true); }}>申请采购</Button>
              <Button icon={<PlusOutlined />}
                onClick={() => { setDetailDrawerOpen(false); setStockInModalOpen(true); }}>入库登记</Button>
              <Button onClick={() => message.info(`编辑「${selectedMaterial.name}」功能开发中`)}>编辑物资</Button>
            </Space>
          </>
        )}
      </Drawer>
    </div>
  );
};

export default PlantingMaterials;
