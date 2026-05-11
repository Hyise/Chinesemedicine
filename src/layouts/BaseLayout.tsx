import React, { useState, useCallback, useEffect } from 'react';
import { Layout, Menu, Breadcrumb, Avatar, Dropdown, Button, Space, Tag, Modal, message } from 'antd';
import {
  DashboardOutlined,
  SafetyCertificateOutlined,
  QrcodeOutlined,
  ClusterOutlined,
  DatabaseOutlined,
  ShopOutlined,
  TeamOutlined,
  AuditOutlined,
  ApiOutlined,
  DollarOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import type { MenuProps } from 'antd';
import styles from './BaseLayout.module.css';

const menuItems: MenuProps['items'] = [
  {
    key: '/app/dashboard',
    icon: <DashboardOutlined />,
    label: '产业大脑数据平台',
  },
  {
    key: '/app/traceability',
    icon: <SafetyCertificateOutlined />,
    label: '区块链溯源管理',
  },
  {
    key: '/app/multi-code',
    icon: <QrcodeOutlined />,
    label: '多码合一标识系统',
    children: [
      { key: '/app/multi-code/rules', label: '编码规则配置' },
      { key: '/app/multi-code/generate', label: '码生成中心' },
      { key: '/app/multi-code/tracking', label: '码状态追踪' },
    ],
  },
  {
    key: '/app/planting',
    icon: <ClusterOutlined />,
    label: '种植服务管理系统',
    children: [
      { key: '/app/planting/archives', label: '种植档案管理' },
      { key: '/app/planting/records', label: '农事记录' },
    ],
  },
  {
    key: '/app/wms',
    icon: <DatabaseOutlined />,
    label: '加工仓储管理系统(WMS)',
    children: [
      { key: '/app/wms/inventory', label: '库存管理' },
      { key: '/app/wms/inbound', label: '入库管理' },
      { key: '/app/wms/outbound', label: '出库管理' },
    ],
  },
  {
    key: '/app/sales',
    icon: <ShopOutlined />,
    label: '市场销售服务平台',
  },
  {
    key: '/app/social-service',
    icon: <TeamOutlined />,
    label: '社会化服务管理平台',
  },
  {
    key: '/app/quality-control',
    icon: <AuditOutlined />,
    label: '产业监管与质控系统',
  },
  {
    key: '/app/iot',
    icon: <ApiOutlined />,
    label: '物联网数据采集系统',
  },
  {
    key: '/app/finance',
    icon: <DollarOutlined />,
    label: '金融服务模块',
    children: [
      { key: '/app/finance/loans', label: '助农贷款服务' },
      { key: '/app/finance/insurance', label: '农业保险服务' },
      { key: '/app/finance/scf', label: '供应链金融' },
      { key: '/app/finance/escrow', label: '资金托管服务' },
    ],
  },
];

const pathLabelMap: Record<string, string> = {
  '/app/dashboard': '产业大脑数据平台',
  '/app/traceability': '区块链溯源管理',
  '/app/multi-code': '多码合一标识系统',
  '/app/multi-code/rules': '编码规则配置',
  '/app/multi-code/generate': '码生成中心',
  '/app/multi-code/tracking': '码状态追踪',
  '/app/planting': '种植服务管理系统',
  '/app/planting/archives': '种植档案管理',
  '/app/planting/records': '农事记录',
  '/app/wms': '加工仓储管理系统(WMS)',
  '/app/wms/inventory': '库存管理',
  '/app/wms/inbound': '入库管理',
  '/app/wms/outbound': '出库管理',
  '/app/sales': '市场销售服务平台',
  '/app/social-service': '社会化服务管理平台',
  '/app/quality-control': '产业监管与质控系统',
  '/app/iot': '物联网数据采集系统',
  '/app/finance': '金融服务模块',
  '/app/finance/loans': '助农贷款服务',
  '/app/finance/insurance': '农业保险服务',
  '/app/finance/scf': '供应链金融',
  '/app/finance/escrow': '资金托管服务',
};

const mockUser = {
  nickname: '系统管理员',
  username: 'admin',
  avatar: '',
  role: '超级管理员',
};

const { Header, Sider, Content } = Layout;

const BaseLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  useEffect(() => {
    const segments = location.pathname.split('/').filter((i) => i);
    if (segments.length >= 2) {
      const parent = `/${segments[1]}`;
      if (pathLabelMap[parent]) {
        setOpenKeys([parent]);
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const getBreadcrumbs = useCallback(() => {
    const pathSnippets = location.pathname.split('/').filter((i) => i);
    const crumbs: { title: React.ReactNode }[] = [
      { title: <a onClick={() => navigate('/app/dashboard')}>首页</a> },
    ];

    let currentPath = '';
    for (let i = 0; i < pathSnippets.length; i++) {
      currentPath += `/${pathSnippets[i]}`;
      const label = pathLabelMap[currentPath] || pathLabelMap[`/${pathSnippets[i]}`] || pathSnippets[i];
      const isLast = i === pathSnippets.length - 1;

      crumbs.push({
        title: isLast ? (
          <span className={styles.breadcrumbCurrent}>{label}</span>
        ) : (
          <a onClick={() => navigate(currentPath)}>{label}</a>
        ),
      });
    }
    return crumbs;
  }, [location.pathname, navigate]);

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleLogout = () => {
    Modal.confirm({
      title: '确认退出登录',
      content: '确定要退出当前账号吗？',
      okText: '确认退出',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
      },
    });
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
      onClick: () => messageApi.info('个人中心功能开发中...'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置',
      onClick: () => messageApi.info('系统设置功能开发中...'),
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
      onClick: handleLogout,
    },
  ];

  const getSelectedKeys = (): string[] => {
    const path = location.pathname;
    const keys: string[] = [];

    if (pathLabelMap[path]) {
      keys.push(path);
    }

    const segments = path.split('/');
    if (segments.length > 1) {
      const parent = `/${segments[1]}`;
      if (pathLabelMap[parent]) {
        keys.push(parent);
      }
    }

    if (keys.length === 0) {
      const matched = menuItems.find((item) => {
        if (!item || typeof item.key !== 'string') return false;
        return item.key === path || path.startsWith(item.key + '/');
      });
      if (matched) {
        keys.push(matched.key as string);
      }
    }

    return keys;
  };

  const selectedKeys = getSelectedKeys();

  return (
    <Layout className={styles.layout}>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={220}
        collapsedWidth={64}
        className={styles.sider}
        theme="light"
      >
        {/* Logo */}
        <div className={styles.logoArea}>
          {collapsed ? (
            <div className={styles.logoCollapsed}>
              <span className={styles.logoIcon}>7S</span>
            </div>
          ) : (
            <div className={styles.logoFull}>
              <span className={styles.logoIcon}>7S</span>
              <div className={styles.logoText}>
                <span className={styles.logoTitle}>中药材产地仓</span>
                <span className={styles.logoSubtitle}>管理平台</span>
              </div>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <div className={styles.collapseBtn} onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>

        {/* Navigation */}
        <Menu
          mode="inline"
          theme="light"
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          onOpenChange={setOpenKeys}
          items={menuItems}
          onClick={handleMenuClick}
          className={styles.menu}
          inlineCollapsed={collapsed}
        />
      </Sider>

      {/* Main Content Area */}
      <Layout className={styles.mainLayout}>
        {/* Header */}
        <Header className={styles.header}>
          <div className={styles.headerLeft}>
            <Breadcrumb
              separator={<RightOutlined style={{ fontSize: 10, color: '#d2d2d7' }} />}
              items={getBreadcrumbs()}
              className={styles.breadcrumb}
            />
          </div>

          <div className={styles.headerRight}>
            <Space size={12}>
              <Button
                type="text"
                icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                onClick={toggleFullscreen}
                title={isFullscreen ? '退出全屏' : '全屏'}
                className={styles.headerBtn}
              />

              <Tag className={styles.roleTag}>
                {mockUser.role}
              </Tag>

              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                trigger={['click']}
              >
                <div className={styles.userInfo}>
                  <Avatar
                    size={32}
                    icon={<UserOutlined />}
                    src={mockUser.avatar}
                    className={styles.avatar}
                  />
                  <span className={styles.username}>{mockUser.nickname}</span>
                </div>
              </Dropdown>
            </Space>
          </div>
        </Header>

        {/* Content */}
        <Content className={styles.content}>
          {contextHolder}
          <div className={styles.contentCard}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default BaseLayout;
