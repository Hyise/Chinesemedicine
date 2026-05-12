import React from 'react';
import { Card, Row, Col, Typography, Space } from 'antd';
import {
  SettingOutlined,
  BuildOutlined,
  SearchOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PageHeading from '../../components/PageHeading';

const { Text } = Typography;

/**
 * 多码合一标识系统 - 模块首页
 * 提供编码规则配置、码生成中心、码状态追踪三个子模块的入口
 */
const MultiCodeIndex: React.FC = () => {
  const navigate = useNavigate();

  const modules = [
    {
      key: 'rules',
      title: '编码规则配置',
      description: '配置多码合一系统的编码生成规则，包括品类前缀、年份格式、校验算法等参数',
      icon: <SettingOutlined style={{ fontSize: 32, color: '#1677ff' }} />,
      path: '/multi-code/rules',
      color: '#e6f4ff',
      tag: '配置',
    },
    {
      key: 'generate',
      title: '码生成中心',
      description: '批量生成多码合一标识，一品一码，支持全流程溯源追踪',
      icon: <BuildOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
      path: '/multi-code/generate',
      color: '#f6ffed',
      tag: '生产',
    },
    {
      key: 'tracking',
      title: '码状态追踪',
      description: '通过精确码值或批次号查询，追踪单一码从赋码到消费的完整生命周期',
      icon: <SearchOutlined style={{ fontSize: 32, color: '#722ed1' }} />,
      path: '/multi-code/tracking',
      color: '#f9f0ff',
      tag: '查询',
    },
  ];

  return (
    <div style={{ background: '#faf9f5', minHeight: '100%' }}>
      <PageHeading
        eyebrow="多码合一"
        title="多码合一标识系统"
        description="一物一码 · 全程追溯 · 品牌保护"
        accentColor="#5db8a6"
        gradientFrom="#1a2d3d"
        gradientMid="#1d4252"
        gradientTo="#2a5670"
        padding="32px 32px 28px"
      />

      <div style={{ maxWidth: 1360, margin: '0 auto', padding: '28px 32px 48px' }}>
        <Row gutter={[16, 16]}>
          {modules.map((mod) => (
            <Col xs={24} sm={12} lg={8} key={mod.key}>
              <Card
                hoverable
                bordered={false}
                style={{ borderRadius: 8, cursor: 'pointer' }}
                onClick={() => navigate(mod.path)}
                styles={{ body: { padding: 24 } }}
              >
                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 12,
                        background: mod.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {mod.icon}
                    </div>
                    <Text
                      type="secondary"
                      style={{ fontSize: 12 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(mod.path);
                      }}
                    >
                      进入 <RightOutlined style={{ fontSize: 10 }} />
                    </Text>
                  </div>
                  <div>
                    <Text strong style={{ fontSize: 16, display: 'block', marginBottom: 4 }}>
                      {mod.title}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 13, lineHeight: 1.6 }}>
                      {mod.description}
                    </Text>
                  </div>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default MultiCodeIndex;
