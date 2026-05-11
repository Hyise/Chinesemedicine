import type { MenuItem } from '@/types/global';

/**
 * 菜单路由配置 - 与侧边栏菜单和路由表一一对应
 * 此处定义的顺序即为侧边栏菜单的展示顺序
 */
export const menus: MenuItem[] = [
  {
    key: 'dashboard',
    label: '产业大脑数据平台',
    path: '/dashboard',
    meta: { title: '产业大脑数据平台', icon: 'DashboardOutlined', orderNo: 1 },
  },
  {
    key: 'traceability',
    label: '区块链溯源管理',
    path: '/traceability',
    meta: { title: '区块链溯源管理', icon: 'SafetyCertificateOutlined', orderNo: 2 },
  },
  {
    key: 'multi-code',
    label: '多码合一标识系统',
    path: '/multi-code',
    meta: { title: '多码合一标识系统', icon: 'QrcodeOutlined', orderNo: 3 },
  },
  {
    key: 'planting',
    label: '种植服务管理系统',
    meta: { title: '种植服务管理系统', icon: 'ClusterOutlined', orderNo: 4 },
    children: [
      {
        key: 'planting-archives',
        label: '种植档案管理',
        path: '/planting/archives',
        meta: { title: '种植档案管理', orderNo: 41 },
      },
      {
        key: 'planting-records',
        label: '农事排期',
        path: '/planting/records',
        meta: { title: '农事排期', orderNo: 42 },
      },
      {
        key: 'planting-materials',
        label: '农资与种苗',
        path: '/planting/materials',
        meta: { title: '农资与种苗', orderNo: 43 },
      },
      {
        key: 'planting-orders',
        label: '订单与托管',
        path: '/planting/orders',
        meta: { title: '订单与托管', orderNo: 44 },
      },
    ],
  },
  {
    key: 'wms',
    label: '加工仓储管理系统(WMS)',
    meta: { title: '加工仓储管理系统(WMS)', icon: 'DatabaseOutlined', orderNo: 5 },
    children: [
      {
        key: 'wms-inventory',
        label: '库存台账',
        path: '/wms/inventory',
        meta: { title: '库存台账', orderNo: 51 },
      },
      {
        key: 'wms-processing',
        label: '加工转化',
        path: '/wms/processing',
        meta: { title: '加工转化', orderNo: 52 },
      },
      {
        key: 'wms-operations',
        label: '智能作业',
        path: '/wms/operations',
        meta: { title: '智能作业', orderNo: 53 },
      },
      {
        key: 'wms-inbound',
        label: '入库管理',
        path: '/wms/inbound',
        meta: { title: '入库管理', orderNo: 54 },
      },
      {
        key: 'wms-outbound',
        label: '出库管理',
        path: '/wms/outbound',
        meta: { title: '出库管理', orderNo: 55 },
      },
    ],
  },
  {
    key: 'sales',
    label: '市场销售服务平台',
    path: '/sales',
    meta: { title: '市场销售服务平台', icon: 'ShopOutlined', orderNo: 6 },
  },
  {
    key: 'social-service',
    label: '社会化服务管理平台',
    path: '/social-service',
    meta: { title: '社会化服务管理平台', icon: 'TeamOutlined', orderNo: 7 },
  },
  {
    key: 'quality-control',
    label: '产业监管与质控系统',
    path: '/quality-control',
    meta: { title: '产业监管与质控系统', icon: 'AuditOutlined', orderNo: 8 },
  },
  {
    key: 'iot',
    label: '物联网数据采集系统',
    path: '/iot',
    meta: { title: '物联网数据采集系统', icon: 'ApiOutlined', orderNo: 9 },
  },
];
