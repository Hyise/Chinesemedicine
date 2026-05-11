import React, { useState, useMemo } from 'react';
import { Card, Row, Col, Tag, Progress, Input, Select, Space, Button, Table, message } from 'antd';
import {
  SearchOutlined, ReloadOutlined, WifiOutlined,
  ThunderboltOutlined, ExperimentOutlined, DashboardOutlined,
  CameraOutlined, GatewayOutlined, ControlOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import ReactECharts from 'echarts-for-react';
import type { IoTDevice } from '@/types/global';
import { DEVICE_STATUS_MAP } from '@/types/global';

const { Option } = Select;

const statusColorMap: Record<string, string> = {
  online: 'green',
  offline: 'default',
  warning: 'orange',
};

const statusIconMap: Record<string, React.ReactNode> = {
  online: <WifiOutlined style={{ color: '#52c41a' }} />,
  warning: <ThunderboltOutlined style={{ color: '#fa8c16' }} />,
  offline: <ControlOutlined style={{ color: '#d9d9d9' }} />,
};

const deviceTypeIconMap: Record<string, React.ReactNode> = {
  sensor: <ExperimentOutlined style={{ color: '#1677ff' }} />,
  camera: <CameraOutlined style={{ color: '#722ed1' }} />,
  gateway: <GatewayOutlined style={{ color: '#13c2c2' }} />,
  controller: <ControlOutlined style={{ color: '#fa8c16' }} />,
};

const deviceTypeMap: Record<string, string> = {
  sensor: '传感器',
  camera: '摄像头',
  gateway: '网关',
  controller: '控制器',
};

const mockDevices: IoTDevice[] = [
  { id: 1, deviceCode: 'IOT-GS-001', deviceName: '官渡基地气象站', deviceType: 'sensor', location: '贵州省赤水市官渡镇', baseName: '官渡镇石斛林下经济示范园', status: 'online', lastReportTime: '2026-04-23 10:30:00' },
  { id: 2, deviceCode: 'IOT-GS-002', deviceName: '长期土壤监测点', deviceType: 'sensor', location: '贵州省赤水市长期镇', baseName: '长期镇石斛产业园', status: 'online', lastReportTime: '2026-04-23 10:29:00' },
  { id: 3, deviceCode: 'IOT-GS-003', deviceName: '大同视频监控', deviceType: 'camera', location: '贵州省赤水市大同镇', baseName: '大同镇石斛示范园', status: 'warning', lastReportTime: '2026-04-23 09:15:00' },
  { id: 4, deviceCode: 'IOT-GS-004', deviceName: '旺隆网关', deviceType: 'gateway', location: '贵州省赤水市旺隆镇', baseName: '旺隆镇石斛种植基地', status: 'offline', lastReportTime: '2026-04-23 08:00:00' },
  { id: 5, deviceCode: 'IOT-GS-005', deviceName: '丙安灌溉控制器', deviceType: 'controller', location: '贵州省赤水市丙安镇', baseName: '丙安镇石斛种植园', status: 'online', lastReportTime: '2026-04-23 10:28:00' },
  { id: 6, deviceCode: 'IOT-GS-006', deviceName: '两河口土壤传感器', deviceType: 'sensor', location: '贵州省赤水市两河口镇', baseName: '两河口镇石斛种植基地', status: 'online', lastReportTime: '2026-04-23 10:27:00' },
];

// 模拟实时传感器数据
const generateSensorData = () => {
  const now = new Date();
  return Array.from({ length: 12 }, (_, i) => {
    const t = new Date(now.getTime() - (11 - i) * 5 * 60000);
    return {
      time: t.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      soilTemp: +(18 + Math.random() * 6).toFixed(1),
      soilMoisture: +(45 + Math.random() * 20).toFixed(1),
      airTemp: +(15 + Math.random() * 10).toFixed(1),
      airHumidity: +(60 + Math.random() * 25).toFixed(1),
      light: +(3000 + Math.random() * 5000).toFixed(0),
    };
  });
};

const IoT: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [sensorData, setSensorData] = useState(generateSensorData);

  const filteredDevices = useMemo(() =>
    mockDevices.filter(d => {
      const kw = searchText.toLowerCase();
      const matchSearch = !kw || d.deviceName.toLowerCase().includes(kw) || d.deviceCode.toLowerCase().includes(kw) || (d.baseName ?? '').toLowerCase().includes(kw);
      const matchType = !typeFilter || d.deviceType === typeFilter;
      const matchStatus = !statusFilter || d.status === statusFilter;
      return matchSearch && matchType && matchStatus;
    }), [searchText, typeFilter, statusFilter]);

  const onlineCount = filteredDevices.filter(d => d.status === 'online').length;
  const warningCount = filteredDevices.filter(d => d.status === 'warning').length;
  const offlineCount = filteredDevices.filter(d => d.status === 'offline').length;

  const columns: ColumnsType<IoTDevice> = [
    { title: '设备编码', dataIndex: 'deviceCode', key: 'deviceCode', width: 130, render: (c: string) => <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#1677ff' }}>{c}</span> },
    { title: '设备名称', dataIndex: 'deviceName', key: 'deviceName', render: (n: string, r) => <Space>{deviceTypeIconMap[r.deviceType]}<span style={{ fontWeight: 600 }}>{n}</span></Space> },
    { title: '类型', dataIndex: 'deviceType', key: 'deviceType', width: 90, render: (t: string) => <Tag>{deviceTypeMap[t]}</Tag> },
    { title: '基地', dataIndex: 'baseName', key: 'baseName', width: 150, ellipsis: true },
    { title: '位置', dataIndex: 'location', key: 'location', width: 140, ellipsis: true },
    { title: '状态', dataIndex: 'status', key: 'status', width: 90, render: (s: string) => <Tag color={statusColorMap[s as keyof typeof statusColorMap] ?? 'default'}>{statusIconMap[s as keyof typeof statusIconMap]}{DEVICE_STATUS_MAP[s as keyof typeof DEVICE_STATUS_MAP]}</Tag> },
    { title: '最后上报', dataIndex: 'lastReportTime', key: 'lastReportTime', width: 160 },
    {
      title: '操作', key: 'action', width: 80,
      render: (_, r) => <Button type="link" size="small" onClick={() => message.info(`查看设备 ${r.deviceName} 详细数据`)}>详情</Button>,
    },
  ];

  // 温度趋势图
  const tempOption = {
    tooltip: { trigger: 'axis', formatter: (p: any[]) => `${p[0].name}<br/>土壤温度: ${p[0]?.value}℃<br/>空气温度: ${p[1]?.value}℃` },
    legend: { data: ['土壤温度', '空气温度'], bottom: 0, textStyle: { fontSize: 11 } },
    grid: { top: 10, right: 10, bottom: 30, left: 40 },
    xAxis: { type: 'category', data: sensorData.map(d => d.time), axisLabel: { fontSize: 10 } },
    yAxis: { type: 'value', axisLabel: { fontSize: 10, formatter: '{value}℃' } },
    series: [
      { name: '土壤温度', type: 'line', data: sensorData.map(d => d.soilTemp), smooth: true, color: '#f59e0b', areaStyle: { color: 'rgba(245,158,11,0.1)' } },
      { name: '空气温度', type: 'line', data: sensorData.map(d => d.airTemp), smooth: true, color: '#ec4899', areaStyle: { color: 'rgba(236,72,153,0.1)' } },
    ],
  };

  // 湿度趋势图
  const moistureOption = {
    tooltip: { trigger: 'axis', formatter: (p: any[]) => `${p[0].name}<br/>土壤湿度: ${p[0]?.value}%<br/>空气湿度: ${p[1]?.value}%` },
    legend: { data: ['土壤湿度', '空气湿度'], bottom: 0, textStyle: { fontSize: 11 } },
    grid: { top: 10, right: 10, bottom: 30, left: 40 },
    xAxis: { type: 'category', data: sensorData.map(d => d.time), axisLabel: { fontSize: 10 } },
    yAxis: { type: 'value', axisLabel: { fontSize: 10, formatter: '{value}%' } },
    series: [
      { name: '土壤湿度', type: 'line', data: sensorData.map(d => d.soilMoisture), smooth: true, color: '#06b6d4', areaStyle: { color: 'rgba(6,182,212,0.1)' } },
      { name: '空气湿度', type: 'line', data: sensorData.map(d => d.airHumidity), smooth: true, color: '#3b82f6', areaStyle: { color: 'rgba(59,130,246,0.1)' } },
    ],
  };

  // 光照强度柱状图
  const lightOption = {
    tooltip: { trigger: 'axis', formatter: (p: any[]) => `${p[0].name}<br/>光照强度: ${p[0]?.value} lux` },
    grid: { top: 10, right: 10, bottom: 30, left: 50 },
    xAxis: { type: 'category', data: sensorData.map(d => d.time), axisLabel: { fontSize: 10 } },
    yAxis: { type: 'value', axisLabel: { fontSize: 10, formatter: (v: number) => `${(v / 1000).toFixed(0)}k` } },
    series: [{ name: '光照强度', type: 'bar', data: sensorData.map(d => d.light), color: '#8b5cf6', barWidth: '50%' }],
  };

  const latestData = sensorData[sensorData.length - 1];

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 16 }}>
        <h3 className="page-title" style={{ margin: '0 0 4px' }}>物联网数据采集系统</h3>
        <p className="page-desc">实时监控各基地传感器、视频、网关等物联网设备运行状态与数据</p>
      </div>

      {/* 设备状态 KPI */}
      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="card-interactive" style={{ borderRadius: 10 }} styles={{ body: { padding: '12px 16px' } }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 8, background: '#f6ffed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#52c41a', fontWeight: 700 }}>{onlineCount}</div>
              <div>
                <div style={{ fontSize: 13, color: '#8c8c8c' }}>在线设备</div>
                <Progress percent={Math.round((onlineCount / filteredDevices.length) * 100)} size="small" strokeColor="#52c41a" showInfo={false} style={{ width: 100, marginTop: 4 }} />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="card-interactive" style={{ borderRadius: 10 }} styles={{ body: { padding: '12px 16px' } }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 8, background: '#fff7e6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#fa8c16', fontWeight: 700 }}>{warningCount}</div>
              <div>
                <div style={{ fontSize: 13, color: '#8c8c8c' }}>告警设备</div>
                <Progress percent={Math.round((warningCount / filteredDevices.length) * 100)} size="small" strokeColor="#fa8c16" showInfo={false} style={{ width: 100, marginTop: 4 }} />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="card-interactive" style={{ borderRadius: 10 }} styles={{ body: { padding: '12px 16px' } }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 8, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#8c8c8c', fontWeight: 700 }}>{offlineCount}</div>
              <div>
                <div style={{ fontSize: 13, color: '#8c8c8c' }}>离线设备</div>
                <Progress percent={Math.round((offlineCount / filteredDevices.length) * 100)} size="small" strokeColor="#d9d9d9" showInfo={false} style={{ width: 100, marginTop: 4 }} />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 设备搜索 + 筛选 */}
      <Card bordered={false} style={{ borderRadius: 10, marginBottom: 14 }} styles={{ body: { padding: '10px 14px' } }}>
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Input prefix={<SearchOutlined />} placeholder="搜索设备名称/编码/基地" value={searchText} onChange={e => setSearchText(e.target.value)} allowClear />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select placeholder="设备类型" style={{ width: '100%' }} allowClear value={typeFilter} onChange={setTypeFilter}>
              <Option value="sensor">传感器</Option><Option value="camera">摄像头</Option><Option value="gateway">网关</Option><Option value="controller">控制器</Option>
            </Select>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select placeholder="状态筛选" style={{ width: '100%' }} allowClear value={statusFilter} onChange={setStatusFilter}>
              <Option value="online">在线</Option><Option value="warning">告警</Option><Option value="offline">离线</Option>
            </Select>
          </Col>
          <Col style={{ marginLeft: 'auto' }}>
            <Button icon={<ReloadOutlined />} onClick={() => { setSensorData(generateSensorData()); message.success('数据已刷新'); }}>刷新数据</Button>
          </Col>
        </Row>
      </Card>

      {/* 设备列表表格 */}
      <Card bordered={false} style={{ borderRadius: 8, marginBottom: 14 }} styles={{ body: { padding: '12px 16px' } }}>
        <div style={{ marginBottom: 10, fontWeight: 600, fontSize: 13 }}>设备列表（共 {filteredDevices.length} 台）</div>
        <Table columns={columns} dataSource={filteredDevices} rowKey="id" pagination={{ pageSize: 5, showTotal: t => `共 ${t} 台` }} size="small" />
      </Card>

      {/* 传感器实时数据 */}
      <Card
        bordered={false} style={{ borderRadius: 8 }}
        title={<Space><DashboardOutlined style={{ color: '#1677ff' }} /><span style={{ fontWeight: 600, fontSize: 14 }}>传感器实时数据</span></Space>}
        extra={<Space><WifiOutlined style={{ color: '#52c41a' }} /><span style={{ fontSize: 11, color: '#52c41a' }}>实时上报中</span></Space>}
      >
        {/* 最新读数 KPI */}
        <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
          {[
            { label: '土壤温度', value: latestData.soilTemp, unit: '℃', color: '#f59e0b', icon: <ExperimentOutlined /> },
            { label: '土壤湿度', value: latestData.soilMoisture, unit: '%', color: '#06b6d4', icon: <ThunderboltOutlined /> },
            { label: '空气温度', value: latestData.airTemp, unit: '℃', color: '#ec4899', icon: <DashboardOutlined /> },
            { label: '空气湿度', value: latestData.airHumidity, unit: '%', color: '#3b82f6', icon: <WifiOutlined /> },
            { label: '光照强度', value: latestData.light, unit: ' lux', color: '#8b5cf6', icon: <DashboardOutlined /> },
          ].map(item => (
            <Col xs={12} sm={8} md={4} key={item.label}>
              <Card size="small" bordered={false} style={{ borderRadius: 8, textAlign: 'center', background: `${item.color}11` }} styles={{ body: { padding: '10px 8px' } }}>
                <div style={{ color: item.color, fontSize: 18, marginBottom: 2 }}>{item.icon}</div>
                <div style={{ fontSize: 11, color: '#8c8c8c' }}>{item.label}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: item.color }}>{item.value}{item.unit}</div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* 趋势图表 */}
        <Row gutter={[12, 12]}>
          <Col xs={24} lg={12}>
            <Card size="small" title={<span style={{ fontSize: 12 }}>温度趋势（近1小时）</span>} style={{ borderRadius: 8 }} styles={{ body: { padding: '12px 12px 4px' } }}>
              <ReactECharts option={tempOption} style={{ height: 200 }} />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card size="small" title={<span style={{ fontSize: 12 }}>湿度趋势（近1小时）</span>} style={{ borderRadius: 8 }} styles={{ body: { padding: '12px 12px 4px' } }}>
              <ReactECharts option={moistureOption} style={{ height: 200 }} />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card size="small" title={<span style={{ fontSize: 12 }}>光照强度（近1小时）</span>} style={{ borderRadius: 8 }} styles={{ body: { padding: '12px 12px 4px' } }}>
              <ReactECharts option={lightOption} style={{ height: 200 }} />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card size="small" title={<span style={{ fontSize: 12 }}>传感器数据分布</span>} style={{ borderRadius: 8 }} styles={{ body: { padding: '12px 12px 4px' } }}>
              <ReactECharts
                option={{
                  tooltip: { trigger: 'item', formatter: (p: any) => `${p.name}: ${p.value}%` },
                  legend: { bottom: 0, textStyle: { fontSize: 11 } },
                  series: [{
                    type: 'pie',
                    radius: ['40%', '70%'],
                    data: [
                      { value: 35, name: '土壤温度', itemStyle: { color: '#f59e0b' } },
                      { value: 25, name: '土壤湿度', itemStyle: { color: '#06b6d4' } },
                      { value: 20, name: '空气温度', itemStyle: { color: '#ec4899' } },
                      { value: 12, name: '空气湿度', itemStyle: { color: '#3b82f6' } },
                      { value: 8, name: '光照强度', itemStyle: { color: '#8b5cf6' } },
                    ],
                  }],
                }}
                style={{ height: 200 }}
              />
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default IoT;
