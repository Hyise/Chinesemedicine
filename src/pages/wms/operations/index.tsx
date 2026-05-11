import React, { useState, useCallback } from 'react';
import {
  Card, Table, Button, Space, Tag, Input, Row, Col,
  Statistic, Modal, Typography, Tooltip, Badge, message,
} from 'antd';
import {
  SearchOutlined, SwapOutlined,
  BarcodeOutlined, AimOutlined, CheckCircleOutlined,
  InboxOutlined, ClockCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  warehouseZones, warehouseLocations, outboundOrders, stockRecords,
  storageTypeMap, type WarehouseLocation,
  type OutboundOrder, type OutboundStatus,
  OUTBOUND_STATUS_MAP, OUTBOUND_STATUS_COLOR_MAP,
} from '../mockData';

const { Text } = Typography;

// ============================================================
// 库位可视化网格
// ============================================================

interface WarehouseGridProps {
  locations: WarehouseLocation[];
  pickingLocations: string[];
  onLocationClick: (loc: WarehouseLocation) => void;
}

const WarehouseGrid: React.FC<WarehouseGridProps> = ({ locations, pickingLocations, onLocationClick }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {warehouseZones.map(zone => {
        const zoneLocations = locations.filter(l => l.zone === zone.id);
        return (
          <Card
            key={zone.id}
            size="small"
            title={
              <Space>
                <Badge color={storageTypeMap[zone.storageType].color} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>{zone.label}</span>
                <Text type="secondary" style={{ fontSize: 11 }}>{zone.desc}</Text>
              </Space>
            }
            style={{ borderRadius: 10 }}
            styles={{ body: { padding: '12px' } }}
          >
            {/* 列标头 */}
            <div style={{ display: 'grid', gridTemplateColumns: '40px repeat(4, 1fr)', gap: 4, marginBottom: 4 }}>
              <div />
              {Array.from({ length: zone.cols }, (_, i) => (
                <div key={i} style={{ textAlign: 'center', fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>
                  第{i + 1}列
                </div>
              ))}
            </div>

            {/* 排 + 库位 */}
            {Array.from({ length: zone.rows }, (_, r) => (
              <div
                key={r}
                style={{ display: 'grid', gridTemplateColumns: '40px repeat(4, 1fr)', gap: 4, marginBottom: 4 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>
                  第{r + 1}排
                </div>
                {Array.from({ length: zone.cols }, (_, c) => {
                  const locId = `${zone.id}-${String(r + 1).padStart(2, '0')}-${String(c + 1).padStart(2, '0')}`;
                  const loc = zoneLocations.find(l => l.id === locId) ?? {
                    id: locId, zone: zone.id, zoneLabel: zone.label, storageType: zone.storageType,
                    row: r + 1, col: c + 1, capacity: 0, currentStock: 0, status: 'empty' as const,
                  };
                  const isPicking = pickingLocations.includes(loc.id);
                  const fillRate = loc.capacity > 0 ? loc.currentStock / loc.capacity : 0;

                  return (
                    <Tooltip
                      key={locId}
                      title={
                        <div>
                          <div style={{ fontWeight: 600 }}>库位 {loc.id}</div>
                          <div style={{ fontSize: 11 }}>
                            {loc.status === 'empty' ? '空闲' :
                              <>{loc.productName || '石斛'}<br />库存：{loc.currentStock}kg / {loc.capacity}kg</>}
                          </div>
                        </div>
                      }
                    >
                      <div
                        onClick={() => loc.status !== 'empty' && onLocationClick(loc)}
                        style={{
                          height: 44,
                          borderRadius: 6,
                          cursor: loc.status !== 'empty' ? 'pointer' : 'default',
                          position: 'relative',
                          overflow: 'hidden',
                          transition: 'all 0.2s ease',
                          border: isPicking
                            ? '2px solid #4f46e5'
                            : loc.status === 'empty'
                            ? '1px dashed #e2e8f0'
                            : `1px solid ${storageTypeMap[zone.storageType].color}40`,
                          background: isPicking
                            ? 'rgba(79,70,229,0.1)'
                            : loc.status === 'empty'
                            ? '#f8fafc'
                            : loc.status === 'full'
                            ? '#fef2f2'
                            : '#f0fdf4',
                          animation: isPicking ? 'pickingPulse 1.5s ease infinite' : undefined,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 2,
                        }}
                      >
                        {/* 填充指示条 */}
                        {loc.status !== 'empty' && (
                          <div
                            style={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              height: `${fillRate * 100}%`,
                              background: loc.status === 'full'
                                ? 'rgba(239,68,68,0.2)'
                                : 'rgba(16,185,129,0.15)',
                              transition: 'height 0.3s ease',
                            }}
                          />
                        )}
                        <Text style={{ fontSize: 10, fontWeight: 600, color: isPicking ? '#4f46e5' : '#374151', position: 'relative', zIndex: 1 }}>
                          {loc.id.split('-').slice(1).join('-')}
                        </Text>
                        {isPicking && (
                          <Tag color="processing" style={{ fontSize: 9, margin: 0, position: 'relative', zIndex: 1 }}>
                            拣货中
                          </Tag>
                        )}
                        {loc.status === 'full' && !isPicking && (
                          <Text style={{ fontSize: 8, color: '#c64545', position: 'relative', zIndex: 1 }}>满仓</Text>
                        )}
                      </div>
                    </Tooltip>
                  );
                })}
              </div>
            ))}
          </Card>
        );
      })}

      <style>{`
        @keyframes pickingPulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(204, 120, 92, 0.4);
            border-color: #cc785c;
          }
          50% {
            box-shadow: 0 0 0 8px rgba(204, 120, 92, 0);
            border-color: #e8a55a;
          }
        }
      `}</style>
    </div>
  );
};

// ============================================================
// PDA 扫码弹窗
// ============================================================

const PdaScanModal: React.FC<{
  barcode: string | null;
  open: boolean;
  onClose: () => void;
}> = ({ barcode, open, onClose }) => {
  const matchedRecord = stockRecords.find(r => r.orderNo === barcode || r.batchNo === barcode);

  return (
    <Modal
      title={
        <Space>
          <BarcodeOutlined style={{ color: '#cc785c' }} />
          PDA 扫码结果
        </Space>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={420}
    >
      {barcode ? (
        matchedRecord ? (
          <div>
            <div style={{ background: '#f8fafc', borderRadius: 8, padding: 12, marginBottom: 12 }}>
              <Row gutter={[12, 6]}>
                <Col span={12}><Text type="secondary" style={{ fontSize: 11 }}>单据号</Text><div><Text code>{matchedRecord.orderNo}</Text></div></Col>
                <Col span={12}><Text type="secondary" style={{ fontSize: 11 }}>类型</Text><div><Tag color={matchedRecord.type === 'inbound' ? 'green' : 'blue'} style={{ margin: 0 }}>{matchedRecord.type === 'inbound' ? '入库' : '出库'}</Tag></div></Col>
                <Col span={12}><Text type="secondary" style={{ fontSize: 11 }}>批次号</Text><div><Text code style={{ fontSize: 11 }}>{matchedRecord.batchNo}</Text></div></Col>
                <Col span={12}><Text type="secondary" style={{ fontSize: 11 }}>数量</Text><div><Text strong>{matchedRecord.qty} {matchedRecord.unit}</Text></div></Col>
                <Col span={24}><Text type="secondary" style={{ fontSize: 11 }}>库位</Text><div><Tag color="blue">{matchedRecord.location}</Tag></div></Col>
                <Col span={24}><Text type="secondary" style={{ fontSize: 11 }}>仓库/操作人</Text><div>{matchedRecord.warehouse} · {matchedRecord.operator}</div></Col>
              </Row>
            </div>
            <Button block onClick={onClose} icon={<CheckCircleOutlined />} style={{ background: '#10b981', color: '#fff', borderColor: '#10b981' }}>
              确认签收
            </Button>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <Text type="secondary">未找到条码对应的记录：</Text>
            <div style={{ marginTop: 8 }}><Text code style={{ fontSize: 14 }}>{barcode}</Text></div>
          </div>
        )
      ) : (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Text type="secondary">请输入条码后按回车搜索</Text>
        </div>
      )}
    </Modal>
  );
};

// ============================================================
// 主组件
// ============================================================

const WmsOperations: React.FC = () => {
  const [locations] = useState<WarehouseLocation[]>(warehouseLocations);
  const [orders, setOrders] = useState<OutboundOrder[]>(outboundOrders);
  const [pickingLocations, setPickingLocations] = useState<string[]>([]);
  const [pdaInput, setPdaInput] = useState('');
  const [pdaModalOpen, setPdaModalOpen] = useState(false);
  const [pdaBarcode, setPdaBarcode] = useState<string | null>(null);

  const handlePdaSearch = useCallback(() => {
    if (pdaInput.trim()) {
      setPdaBarcode(pdaInput.trim());
      setPdaModalOpen(true);
    }
  }, [pdaInput]);

  const handleAssignLocations = (order: OutboundOrder) => {
    // FIFO: 找到最早入库的含有该产品的库位
    const candidateLocations = locations
      .filter(l =>
        l.status === 'inStock' &&
        (l.productName?.includes(order.form) || l.productName?.includes('金钗石斛'))
      )
      .sort((a, b) => {
        // 按批号排序（假设批号中日期越早越排前面）
        const aDate = a.batchNo?.match(/\d{8}$/)?.[0] ?? '00000000';
        const bDate = b.batchNo?.match(/\d{8}$/)?.[0] ?? '00000000';
        return aDate.localeCompare(bDate);
      });

    let remaining = order.qty;
    const assigned: string[] = [];
    const picking: string[] = [];

    for (const loc of candidateLocations) {
      if (remaining <= 0) break;
      const take = Math.min(remaining, loc.currentStock);
      remaining -= take;
      assigned.push(loc.id);
      picking.push(loc.id);
    }

    setOrders(prev => prev.map(o =>
      o.id === order.id
        ? { ...o, status: 'assigned', assignedLocations: assigned, pickingSequence: assigned }
        : o
    ));
    setPickingLocations(picking);
    message.success(`已按 FIFO 原则分配 ${assigned.length} 个库位，拣货路径已高亮`);
  };

  const handleLocationClick = (loc: WarehouseLocation) => {
    setPdaBarcode(loc.batchNo ?? loc.id);
    setPdaModalOpen(true);
  };

  const orderColumns: ColumnsType<OutboundOrder> = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 140,
      render: (no) => <Text code style={{ fontSize: 11 }}>{no}</Text>,
    },
    {
      title: '客户',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 160,
      ellipsis: true,
      render: (name, record) => (
        <Space direction="vertical" size={0}>
          <Text style={{ fontSize: 12 }}>{name}</Text>
          {record.priority === 'urgent' && <Tag color="red" style={{ fontSize: 10, margin: 0 }}>紧急</Tag>}
        </Space>
      ),
    },
    {
      title: '产品',
      dataIndex: 'productName',
      key: 'productName',
      width: 120,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ fontSize: 12 }}>{record.productName}</Text>
          <Text type="secondary" style={{ fontSize: 10 }}>{record.form} · {record.spec}</Text>
        </Space>
      ),
    },
    {
      title: '数量',
      dataIndex: 'qty',
      key: 'qty',
      width: 80,
      align: 'right',
      render: (qty, record) => <Text strong>{qty} {record.unit}</Text>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (status: OutboundStatus) => (
        <Tag color={OUTBOUND_STATUS_COLOR_MAP[status]}>
          {OUTBOUND_STATUS_MAP[status]}
        </Tag>
      ),
    },
    {
      title: '分配库位',
      key: 'locations',
      width: 160,
      render: (_, record) =>
        record.assignedLocations.length > 0 ? (
          <Space wrap size={2}>
            {record.assignedLocations.map(loc => (
              <Tag key={loc} color="blue" style={{ fontSize: 10 }}>
                {loc}
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
      width: 100,
      render: (_, record) => (
        <Space size={4}>
          {record.status === 'pending' && (
            <Button
              type="primary" size="small"
              icon={<AimOutlined />}
              style={{ fontSize: 11 }}
              onClick={() => handleAssignLocations(record)}
            >
              分配库位
            </Button>
          )}
          {record.status === 'assigned' && (
            <Button
              type="primary" size="small"
              icon={<SwapOutlined />}
              style={{ fontSize: 11, background: '#f59e0b', borderColor: '#f59e0b' }}
              onClick={() => {
                setPickingLocations(record.assignedLocations);
                setOrders(prev => prev.map(o => o.id === record.id ? { ...o, status: 'picking' } : o));
                message.info('拣货路径已高亮，请按顺序拣货');
              }}
            >
              开始拣货
            </Button>
          )}
          {record.status === 'picking' && (
            <Button
              size="small"
              icon={<CheckCircleOutlined />}
              style={{ fontSize: 11, background: '#10b981', color: '#fff', borderColor: '#10b981' }}
              onClick={() => {
                setOrders(prev => prev.map(o => o.id === record.id ? { ...o, status: 'shipped' } : o));
                setPickingLocations([]);
                message.success('出库单已完成');
              }}
            >
              完成发货
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const totalStock = locations.filter(l => l.status !== 'empty').length;
  const fullCount = locations.filter(l => l.status === 'full').length;
  const emptyCount = locations.filter(l => l.status === 'empty').length;

  return (
    <div style={{ padding: 0 }} className="page-container page-enter">
      {/* 页面标题 */}
      <div style={{ marginBottom: 16 }}>
        <h3 className="page-title" style={{ margin: '0 0 4px' }}>可视化库位与智能作业</h3>
        <p className="page-desc">库位空间可视化、FIFO 智能分配、PDA 扫码追溯</p>
      </div>

      {/* 统计 */}
      <Row gutter={[12, 12]} style={{ marginBottom: 14 }}>
        <Col span={8}>
          <Card size="small" className="card-interactive" style={{ borderRadius: 12, textAlign: 'center' }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: 11 }}>已用库位</Text>}
              value={totalStock}
              suffix={`/ ${locations.length}`}
              valueStyle={{ fontSize: 22, color: '#4f46e5' }}
              prefix={<InboxOutlined style={{ fontSize: 16 }} />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small" className="card-interactive" style={{ borderRadius: 12, textAlign: 'center' }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: 11 }}>空闲库位</Text>}
              value={emptyCount}
              valueStyle={{ fontSize: 22, color: '#10b981' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small" className="card-interactive" style={{ borderRadius: 12, textAlign: 'center' }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: 11 }}>满仓库位</Text>}
              value={fullCount}
              valueStyle={{ fontSize: 22, color: fullCount > 0 ? '#ef4444' : '#94a3b8' }}
            />
          </Card>
        </Col>
      </Row>

      {/* PDA 扫码 + 可视化网格 */}
      <Row gutter={[14, 14]}>
        <Col span={24}>
          {/* PDA 扫码栏 */}
          <Card size="small" style={{ borderRadius: 10, marginBottom: 14, background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)' }}
            styles={{ body: { padding: '12px 16px' } }}>
            <Row gutter={12} align="middle">
              <Col>
                <BarcodeOutlined style={{ color: '#a5b4fc', fontSize: 20 }} />
              </Col>
              <Col>
                <Text style={{ color: '#a5b4fc', fontSize: 12, display: 'block' }}>PDA 扫码枪输入</Text>
                <Text style={{ color: '#818cf8', fontSize: 10 }}>输入批次号或单据号，回车搜索</Text>
              </Col>
              <Col style={{ flex: 1 }}>
                <Input
                  prefix={<SearchOutlined style={{ color: '#818cf8' }} />}
                  placeholder="扫描或输入条码..."
                  value={pdaInput}
                  onChange={e => setPdaInput(e.target.value)}
                  onPressEnter={handlePdaSearch}
                  allowClear
                  size="large"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(129,140,248,0.3)',
                    borderRadius: 8,
                    color: '#fff',
                  }}
                  styles={{ input: { color: '#fff', background: 'transparent' } }}
                />
              </Col>
              <Col>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={handlePdaSearch}
                  style={{ borderRadius: 8, background: '#4f46e5', borderColor: '#4f46e5', height: 38 }}
                >
                  查询
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* 主内容：左侧可视化 + 右侧出库单 */}
      <Row gutter={[14, 14]}>
        <Col xs={24} xl={14}>
          <Card
            size="small"
            title={
              <Space>
                <AimOutlined style={{ color: '#4f46e5' }} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>库位空间可视化</span>
                {pickingLocations.length > 0 && (
                  <Tag color="processing" icon={<SwapOutlined />}>
                    FIFO 拣货路径已高亮
                  </Tag>
                )}
              </Space>
            }
            style={{ borderRadius: 10 }}
            styles={{ body: { padding: '10px 12px' } }}
          >
            <WarehouseGrid
              locations={locations}
              pickingLocations={pickingLocations}
              onLocationClick={handleLocationClick}
            />
          </Card>
        </Col>

        <Col xs={24} xl={10}>
          {/* 出库作业单 */}
          <Card
            size="small"
            title={
              <Space>
                <Badge dot>
                  <ClockCircleOutlined style={{ color: '#4f46e5' }} />
                </Badge>
                <span style={{ fontSize: 13, fontWeight: 600 }}>出库作业单</span>
                <Badge count={orders.filter(o => o.status !== 'shipped').length} style={{ backgroundColor: '#f59e0b' }} />
              </Space>
            }
            style={{ borderRadius: 10, marginBottom: 12 }}
            styles={{ body: { padding: 0 } }}
          >
            <Table
              columns={orderColumns}
              dataSource={orders}
              rowKey="id"
              pagination={false}
              size="small"
              scroll={{ x: 800 }}
            />
          </Card>

          {/* 图例 */}
          <Card size="small" style={{ borderRadius: 10, background: '#f8fafc' }} styles={{ body: { padding: '8px 12px' } }}>
            <Space wrap size={16}>
              <Space size={4}>
                <div style={{ width: 16, height: 16, borderRadius: 4, background: '#f8fafc', border: '1px dashed #e2e8f0' }} />
                <Text type="secondary" style={{ fontSize: 11 }}>空闲</Text>
              </Space>
              <Space size={4}>
                <div style={{ width: 16, height: 16, borderRadius: 4, background: '#f0fdf4', border: '1px solid rgba(16,185,129,0.3)' }} />
                <Text type="secondary" style={{ fontSize: 11 }}>有货</Text>
              </Space>
              <Space size={4}>
                <div style={{ width: 16, height: 16, borderRadius: 4, background: '#fef2f2', border: '1px solid rgba(239,68,68,0.3)' }} />
                <Text type="secondary" style={{ fontSize: 11 }}>满仓</Text>
              </Space>
              <Space size={4}>
                <div style={{ width: 16, height: 16, borderRadius: 4, background: 'rgba(79,70,229,0.1)', border: '2px solid #4f46e5', animation: 'pickingPulse 1.5s ease infinite' }} />
                <Text type="secondary" style={{ fontSize: 11 }}>拣货中</Text>
              </Space>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* PDA 扫码弹窗 */}
      <PdaScanModal
        barcode={pdaBarcode}
        open={pdaModalOpen}
        onClose={() => { setPdaModalOpen(false); setPdaInput(''); }}
      />
    </div>
  );
};

export default WmsOperations;
