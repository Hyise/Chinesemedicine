import React, { useState, useCallback, useMemo } from 'react';
import {
  Card, Table, Button, Space, Tag, Input, Drawer, Descriptions,
  Progress, Row, Col, Tree, Typography, Divider, Statistic,
  message, Modal,
} from 'antd';
import {
  SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined,
  ExportOutlined, EnvironmentOutlined, MonitorOutlined,
  DashboardOutlined, ThunderboltOutlined, ExperimentOutlined,
  WifiOutlined, ClockCircleOutlined, AppstoreOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { DataNode } from 'antd/es/tree';
import {
  plantingBases, townTreeData, type PlantingBase,
  BASE_STATUS_MAP, BASE_STATUS_COLOR_MAP,
} from '../mockData';

const { Text } = Typography;

const buildTreeData = (): DataNode[] =>
  townTreeData.map((town) => ({
    key: town.id,
    title: (
      <span style={{ fontSize: 14, lineHeight: 1.6 }}>
        <EnvironmentOutlined style={{ color: '#cc785c', marginRight: 8 }} />
        {town.name}
        <Tag style={{ marginLeft: 8, fontSize: 11, borderRadius: 9999, border: 'none', background: '#f5f0e8', color: '#cc785c', padding: '1px 10px' }}>
          {town.villages.reduce((s, v) => s + v.baseCount, 0)} 个基地
        </Tag>
      </span>
    ),
    children: town.villages.map((v) => ({
      key: v.id,
      title: (
        <span style={{ fontSize: 13, color: '#6c6a64', lineHeight: 1.6 }}>
          {v.name}
          <Tag style={{ marginLeft: 8, fontSize: 11, borderRadius: 9999, border: 'none', background: '#faf9f5', color: '#6c6a64', padding: '1px 10px' }}>
            {v.baseCount}
          </Tag>
        </span>
      ),
      isLeaf: true,
    })),
  }));

interface IoTCardProps {
  iot: PlantingBase['iot'];
}

const IoTMonitorCard: React.FC<IoTCardProps> = ({ iot }) => {
  const items = [
    { label: '土壤温度', value: iot.soilTemp, unit: '℃', icon: <ExperimentOutlined />, color: '#e8a55a', min: 10, max: 30 },
    { label: '土壤湿度', value: iot.soilMoisture, unit: '%', icon: <ThunderboltOutlined />, color: '#cc785c', min: 30, max: 90 },
    { label: '空气温度', value: iot.airTemp, unit: '℃', icon: <DashboardOutlined />, color: '#c64545', min: 10, max: 35 },
    { label: '空气湿度', value: iot.airHumidity, unit: '%', icon: <WifiOutlined />, color: '#5db8a6', min: 40, max: 95 },
    { label: '光照强度', value: iot.lightIntensity, unit: 'lux', icon: <MonitorOutlined />, color: '#e8a55a', min: 0, max: 10000 },
  ];

  return (
    <Card
      size="small"
      title={
        <Space>
          <WifiOutlined style={{ color: '#cc785c' }} />
          <span style={{ fontSize: 13, fontWeight: 600 }}>实时物联网数据</span>
        </Space>
      }
      extra={<Text type="secondary" style={{ fontSize: 11 }}><ClockCircleOutlined /> {iot.lastUpdate}</Text>}
      style={{ background: '#faf9f5', border: '1px solid rgba(20,20,19,0.06)', borderRadius: 16 }}
      styles={{ body: { padding: '16px 18px' } }}
    >
      <Row gutter={[12, 12]}>
        {items.map((item) => {
          const percent = Math.min(100, Math.max(0, ((item.value - item.min) / (item.max - item.min)) * 100));
          return (
            <Col span={8} key={item.label}>
              <div style={{ background: '#ffffff', borderRadius: 12, padding: '14px 16px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 0 0 1px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{ color: item.color, fontSize: 15 }}>{item.icon}</span>
                  <Text type="secondary" style={{ fontSize: 12 }}>{item.label}</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                  <Text style={{ fontSize: 22, fontWeight: 700, color: item.color }}>{item.value.toFixed(1)}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>{item.unit}</Text>
                </div>
                <Progress
                  percent={percent}
                  showInfo={false}
                  strokeColor={item.color}
                  trailColor="#efe9de"
                  size="small"
                  style={{ marginTop: 8 }}
                />
              </div>
            </Col>
          );
        })}
      </Row>
    </Card>
  );
};

interface BaseDetailDrawerProps {
  base: PlantingBase | null;
  open: boolean;
  onClose: () => void;
}

const BaseDetailDrawer: React.FC<BaseDetailDrawerProps> = ({ base, open, onClose }) => {
  if (!base) return null;
  const plantYears = Math.floor(
    (new Date().getTime() - new Date(base.plantDate).getTime()) / (1000 * 60 * 60 * 24 * 365)
  );

  return (
    <Drawer
      title={
        <Space>
          <EnvironmentOutlined style={{ color: '#cc785c' }} />
          基地详情
        </Space>
      }
      placement="right"
      width={580}
      open={open}
      onClose={onClose}
      styles={{ body: { padding: '20px 24px' } }}
    >
      <Descriptions column={2} size="small" bordered style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
        <Descriptions.Item label="基地名称" span={2}>{base.name}</Descriptions.Item>
        <Descriptions.Item label="所属乡镇">{base.town}</Descriptions.Item>
        <Descriptions.Item label="所属村落">{base.village}</Descriptions.Item>
        <Descriptions.Item label="药材品种">
          <Tag style={{ borderRadius: 9999, border: 'none', background: 'rgba(93,184,114,0.1)', color: '#5db872', padding: '1px 10px' }}>{base.herbName}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="种植面积">{base.plantingArea.toLocaleString()} 亩</Descriptions.Item>
        <Descriptions.Item label="种植日期">{base.plantDate}</Descriptions.Item>
        <Descriptions.Item label="预计采收">{base.expectedHarvestDate}</Descriptions.Item>
        <Descriptions.Item label="生长周期">
          <Text type="secondary">{plantYears > 0 ? `${plantYears} 年生` : '新植'}（已种 {plantYears > 0 ? plantYears : '< 1'} 年）</Text>
        </Descriptions.Item>
        <Descriptions.Item label="责任人">{base.manager}</Descriptions.Item>
        <Descriptions.Item label="联系电话">{base.phone}</Descriptions.Item>
        <Descriptions.Item label="当前状态" span={2}>
          <Tag style={{
            borderRadius: 9999, border: 'none', padding: '2px 10px', fontSize: 11, fontWeight: 500,
            background: BASE_STATUS_COLOR_MAP[base.status] === 'green' ? 'rgba(93,184,114,0.1)' : BASE_STATUS_COLOR_MAP[base.status] === 'orange' ? 'rgba(232,165,90,0.1)' : '#faf9f5',
            color: BASE_STATUS_COLOR_MAP[base.status] === 'green' ? '#5db872' : BASE_STATUS_COLOR_MAP[base.status] === 'orange' ? '#e8a55a' : '#6c6a64'
          }}>
            {BASE_STATUS_MAP[base.status]}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="基地简介" span={2}>{base.description}</Descriptions.Item>
      </Descriptions>
      <Divider />
      <IoTMonitorCard iot={base.iot} />
    </Drawer>
  );
};

const PlantingArchives: React.FC = () => {
  const [bases, setBases] = useState<PlantingBase[]>(plantingBases);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [selectedTown, setSelectedTown] = useState<string | undefined>();
  const [selectedBase, setSelectedBase] = useState<PlantingBase | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const treeData = useMemo(() => buildTreeData(), []);

  const getFilteredBases = useCallback(() => {
    let filtered = bases;
    if (selectedTown) {
      const isTown = townTreeData.some((t) => t.id === selectedTown);
      if (isTown) {
        const town = townTreeData.find((t) => t.id === selectedTown)!;
        filtered = filtered.filter((b) => town.villages.some((v) => v.name === b.village));
      } else {
        const town = townTreeData.find((t) => t.villages.some((v) => v.id === selectedTown));
        if (town) {
          filtered = filtered.filter((b) => b.village === town.villages.find((v) => v.id === selectedTown)?.name);
        }
      }
    }
    if (searchText) {
      const kw = searchText.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.name.toLowerCase().includes(kw) ||
          b.herbName.toLowerCase().includes(kw) ||
          b.manager.toLowerCase().includes(kw)
      );
    }
    if (statusFilter) {
      filtered = filtered.filter((b) => b.status === statusFilter);
    }
    return filtered;
  }, [bases, selectedTown, searchText, statusFilter]);

  const filteredBases = getFilteredBases();
  const pagedBases = filteredBases.slice((page - 1) * pageSize, page * pageSize);

  const columns: ColumnsType<PlantingBase> = [
    {
      title: '基地名称',
      dataIndex: 'name',
      key: 'name',
      width: 220,
      ellipsis: true,
      render: (name, record) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: 13 }}>{name}</div>
          <Text type="secondary" style={{ fontSize: 11 }}>{record.town} · {record.village}</Text>
        </div>
      ),
    },
    {
      title: '药材品种',
      dataIndex: 'herbName',
      key: 'herbName',
      width: 130,
      render: (herb) => (
        <Tag style={{ borderRadius: 9999, border: 'none', background: 'rgba(93,184,114,0.1)', color: '#5db872', padding: '2px 10px' }}>
          {herb}
        </Tag>
      ),
    },
    {
      title: '面积（亩）',
      dataIndex: 'plantingArea',
      key: 'plantingArea',
      width: 100,
      align: 'right',
      render: (v) => v.toLocaleString(),
    },
    { title: '种植日期', dataIndex: 'plantDate', key: 'plantDate', width: 110 },
    { title: '预计采收', dataIndex: 'expectedHarvestDate', key: 'expectedHarvestDate', width: 110 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (status: PlantingBase['status']) => {
        const bg = BASE_STATUS_COLOR_MAP[status] === 'green' ? 'rgba(93,184,114,0.1)' : BASE_STATUS_COLOR_MAP[status] === 'orange' ? 'rgba(232,165,90,0.1)' : '#faf9f5';
        const color = BASE_STATUS_COLOR_MAP[status] === 'green' ? '#5db872' : BASE_STATUS_COLOR_MAP[status] === 'orange' ? '#e8a55a' : '#6c6a64';
        return (
          <Tag style={{ borderRadius: 9999, border: 'none', background: bg, color, padding: '2px 10px', fontSize: 11, fontWeight: 500 }}>
            {BASE_STATUS_MAP[status]}
          </Tag>
        );
      },
    },
    { title: '责任人', dataIndex: 'manager', key: 'manager', width: 90 },
    {
      title: '操作',
      key: 'action',
      width: 130,
      render: (_, record) => (
        <Space size={4}>
          <Button type="link" size="small" onClick={() => { setSelectedBase(record); setDrawerOpen(true); }}>详情</Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => message.info(`编辑基地「${record.name}」功能开发中`)}>编辑</Button>
          <Button type="link" size="small" icon={<DeleteOutlined />} danger onClick={() => handleDelete(record)}>删除</Button>
        </Space>
      ),
    },
  ];

  const handleDelete = (base: PlantingBase) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除基地「${base.name}」吗？删除后不可恢复。`,
      okText: '确认删除',
      okButtonProps: { danger: true },
      onOk: () => {
        setBases(prev => prev.filter(b => b.id !== base.id));
        message.success(`基地「${base.name}」已删除`);
      },
    });
  };

  return (
    <div style={{ background: '#faf9f5', minHeight: '100%' }}>
      <div style={{ background: '#ffffff', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '36px 36px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontSize: 12, color: '#cc785c', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 6 }}>种植管理</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#1d1d1f', letterSpacing: '-0.3px', marginBottom: 6 }}>基地与档案管理</div>
          <div style={{ fontSize: 13, color: '#6c6a64' }}>管理赤水市各乡镇石斛种植基地档案与物联网数据接入</div>
        </div>
      </div>

      <div style={{ maxWidth: 1680, margin: '0 auto', padding: '28px 36px 48px' }}>
        <Row gutter={[20, 20]} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={24} md={5}>
          <Card
            size="small"
            title={
              <Space>
                <AppstoreOutlined style={{ color: '#cc785c' }} />
                <span style={{ fontSize: 14, fontWeight: 600 }}>行政区划</span>
              </Space>
            }
            style={{ borderRadius: 16, border: '1px solid rgba(20,20,19,0.06)' }}
            styles={{ body: { padding: '16px 14px', maxHeight: 520, overflowY: 'auto' } }}
          >
            <Tree
              showIcon
              defaultExpandAll
              treeData={treeData}
              selectedKeys={selectedTown ? [selectedTown] : []}
              onSelect={(keys) => setSelectedTown(keys[0] as string | undefined)}
            />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={19}>
            <Card size="small" style={{ borderRadius: 16, border: '1px solid rgba(20,20,19,0.06)', marginBottom: 16 }} styles={{ body: { padding: '14px 18px' } }}>
              <Row gutter={[16, 12]} align="middle">
                <Col xs={24} sm={12} md={8}>
                  <Input
                    prefix={<SearchOutlined />}
                    placeholder="搜索基地名称、药材或负责人"
                    value={searchText}
                    onChange={(e) => { setSearchText(e.target.value); setPage(1); }}
                    allowClear
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Space.Compact>
                    <Button type={statusFilter === undefined ? 'primary' : 'default'} size="small" onClick={() => { setStatusFilter(undefined); setPage(1); }}>全部</Button>
                    <Button size="small" type={statusFilter === 'growing' ? 'primary' : 'default'} onClick={() => { setStatusFilter('growing'); setPage(1); }}>生长中</Button>
                    <Button size="small" type={statusFilter === 'harvested' ? 'primary' : 'default'} onClick={() => { setStatusFilter('harvested'); setPage(1); }}>已采收</Button>
                    <Button size="small" type={statusFilter === 'dormant' ? 'primary' : 'default'} onClick={() => { setStatusFilter('dormant'); setPage(1); }}>休眠期</Button>
                  </Space.Compact>
                </Col>
                <Col style={{ marginLeft: 'auto' }}>
                  <Space>
                    <Button icon={<ExportOutlined />}>导出</Button>
                    <Button type="primary" icon={<PlusOutlined />}>新增基地</Button>
                  </Space>
                </Col>
              </Row>
            </Card>

            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
              <Col xs={12} sm={6}>
                <Card size="small" style={{ borderRadius: 16, border: '1px solid rgba(20,20,19,0.06)', textAlign: 'center' }} styles={{ body: { padding: '16px 14px' } }}>
                  <Statistic title={<Text type="secondary" style={{ fontSize: 12 }}>基地总数</Text>} value={bases.length} prefix={<EnvironmentOutlined style={{ color: '#cc785c' }} />} valueStyle={{ fontSize: 22, color: '#cc785c', fontWeight: 700 }} />
                </Card>
              </Col>
              <Col xs={12} sm={6}>
                <Card size="small" style={{ borderRadius: 16, border: '1px solid rgba(20,20,19,0.06)', textAlign: 'center' }} styles={{ body: { padding: '16px 14px' } }}>
                  <Statistic title={<Text type="secondary" style={{ fontSize: 12 }}>总面积（亩）</Text>} value={bases.reduce((s, b) => s + b.plantingArea, 0)} suffix="亩" valueStyle={{ fontSize: 22, color: '#5db872', fontWeight: 700 }} />
                </Card>
              </Col>
              <Col xs={12} sm={6}>
                <Card size="small" style={{ borderRadius: 16, border: '1px solid rgba(20,20,19,0.06)', textAlign: 'center' }} styles={{ body: { padding: '16px 14px' } }}>
                  <Statistic title={<Text type="secondary" style={{ fontSize: 12 }}>生长中</Text>} value={bases.filter(b => b.status === 'growing').length} valueStyle={{ fontSize: 22, color: '#cc785c', fontWeight: 700 }} />
                </Card>
              </Col>
              <Col xs={12} sm={6}>
                <Card size="small" style={{ borderRadius: 16, border: '1px solid rgba(20,20,19,0.06)', textAlign: 'center' }} styles={{ body: { padding: '16px 14px' } }}>
                  <Statistic title={<Text type="secondary" style={{ fontSize: 12 }}>已采收</Text>} value={bases.filter(b => b.status === 'harvested').length} valueStyle={{ fontSize: 22, color: '#5db872', fontWeight: 700 }} />
                </Card>
              </Col>
            </Row>

            <Card style={{ borderRadius: 16, border: '1px solid rgba(20,20,19,0.06)' }} styles={{ body: { padding: '4px 8px' } }}>
              <Table
                columns={columns}
                dataSource={pagedBases}
                rowKey="id"
                pagination={{
                  current: page, pageSize, total: filteredBases.length,
                  onChange: setPage, showSizeChanger: false, showTotal: (total) => `共 ${total} 个基地`,
                }}
                size="small"
                style={{ fontSize: 13 }}
                scroll={{ x: 'max-content' }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      <BaseDetailDrawer base={selectedBase} open={drawerOpen} onClose={() => { setDrawerOpen(false); setSelectedBase(null); }} />
    </div>
  );
};

export default PlantingArchives;
