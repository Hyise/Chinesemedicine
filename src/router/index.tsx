import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import BaseLayout from '@/layouts/BaseLayout';

// ============================================================
// 页面组件懒加载（按需引入，减小首屏包体积）
// ============================================================
const Dashboard = lazy(() => import('@/pages/dashboard'));
const Traceability = lazy(() => import('@/pages/traceability'));
const MultiCode = lazy(() => import('@/pages/multi-code'));
const MultiCodeRules = lazy(() => import('@/pages/multi-code/rules'));
const MultiCodeGenerate = lazy(() => import('@/pages/multi-code/generate'));
const MultiCodeTracking = lazy(() => import('@/pages/multi-code/tracking'));
const PlantingArchives = lazy(() => import('@/pages/planting/archives'));
const PlantingRecords = lazy(() => import('@/pages/planting/records'));
const PlantingMaterials = lazy(() => import('@/pages/planting/materials'));
const PlantingOrders = lazy(() => import('@/pages/planting/orders'));
const WmsInventory = lazy(() => import('@/pages/wms/inventory'));
const WmsInbound = lazy(() => import('@/pages/wms/inbound'));
const WmsOutbound = lazy(() => import('@/pages/wms/outbound'));
const WmsProcessing = lazy(() => import('@/pages/wms/processing'));
const WmsOperations = lazy(() => import('@/pages/wms/operations'));
const Sales = lazy(() => import('@/pages/sales'));
const SocialService = lazy(() => import('@/pages/social-service'));
const QualityControl = lazy(() => import('@/pages/quality-control'));
const IoT = lazy(() => import('@/pages/iot'));
const Finance = lazy(() => import('@/pages/finance'));
const FinanceLoans = lazy(() => import('@/pages/finance/loans'));
const FinanceInsurance = lazy(() => import('@/pages/finance/insurance'));
const FinanceScf = lazy(() => import('@/pages/finance/scf'));
const FinanceEscrow = lazy(() => import('@/pages/finance/escrow'));
const LandingTech = lazy(() => import('@/pages/landing/LandingTech'));
const LandingShowcase = lazy(() => import('@/pages/landing/LandingShowcase'));

// ============================================================
// 统一的懒加载 Loading 组件
// ============================================================
const PageLoader: React.FC = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      minHeight: 400,
    }}
  >
    <div
      style={{
        width: 32,
        height: 32,
        border: '3px solid #e6dfd8',
        borderTopColor: '#cc785c',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }}
    />
    <style>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// ============================================================
// 路由表配置
// ============================================================
const router = createBrowserRouter([
  // ============================================================
  // 落地页（独立展示，不带 BaseLayout）
  // ============================================================
  {
    path: '/',
    element: (
      <Suspense fallback={<PageLoader />}>
        <LandingTech />
      </Suspense>
    ),
  },
  {
    path: '/showcase',
    element: (
      <Suspense fallback={<PageLoader />}>
        <LandingShowcase />
      </Suspense>
    ),
  },
  // ============================================================
  // 业务管理后台（统一 /app 前缀，带 BaseLayout）
  // ============================================================
  {
    path: '/app',
    element: (
      <Suspense fallback={<PageLoader />}>
        <BaseLayout />
      </Suspense>
    ),
    children: [
      // ---- 产业大脑 ----
      {
        index: true,
        element: <Navigate to="/app/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      // ---- 区块链溯源 ----
      {
        path: 'traceability',
        element: <Traceability />,
      },
      // ---- 多码合一 ----
      {
        path: 'multi-code',
        element: <MultiCode />,
      },
      {
        path: 'multi-code/rules',
        element: <MultiCodeRules />,
      },
      {
        path: 'multi-code/generate',
        element: <MultiCodeGenerate />,
      },
      {
        path: 'multi-code/tracking',
        element: <MultiCodeTracking />,
      },
      // ---- 种植服务管理系统 ----
      {
        path: 'planting/archives',
        element: <PlantingArchives />,
      },
      {
        path: 'planting/records',
        element: <PlantingRecords />,
      },
      {
        path: 'planting/materials',
        element: <PlantingMaterials />,
      },
      {
        path: 'planting/orders',
        element: <PlantingOrders />,
      },
      // ---- 加工仓储管理系统(WMS) ----
      {
        path: 'wms/inventory',
        element: <WmsInventory />,
      },
      {
        path: 'wms/inbound',
        element: <WmsInbound />,
      },
      {
        path: 'wms/outbound',
        element: <WmsOutbound />,
      },
      {
        path: 'wms/processing',
        element: <WmsProcessing />,
      },
      {
        path: 'wms/operations',
        element: <WmsOperations />,
      },
      // ---- 市场销售服务 ----
      {
        path: 'sales',
        element: <Sales />,
      },
      // ---- 社会化服务 ----
      {
        path: 'social-service',
        element: <SocialService />,
      },
      // ---- 产业监管与质控 ----
      {
        path: 'quality-control',
        element: <QualityControl />,
      },
      // ---- 物联网 ----
      {
        path: 'iot',
        element: <IoT />,
      },
      // ---- 金融服务 ----
      {
        path: 'finance',
        element: <Finance />,
      },
      {
        path: 'finance/loans',
        element: <FinanceLoans />,
      },
      {
        path: 'finance/insurance',
        element: <FinanceInsurance />,
      },
      {
        path: 'finance/scf',
        element: <FinanceScf />,
      },
      {
        path: 'finance/escrow',
        element: <FinanceEscrow />,
      },
    ],
  },
  // ============================================================
  // 兼容旧路径重定向到新路径
  // ============================================================
  {
    path: '/dashboard',
    element: <Navigate to="/app/dashboard" replace />,
  },
  {
    path: '/traceability',
    element: <Navigate to="/app/traceability" replace />,
  },
  {
    path: '/multi-code',
    element: <Navigate to="/app/multi-code" replace />,
  },
  {
    path: '/multi-code/rules',
    element: <Navigate to="/app/multi-code/rules" replace />,
  },
  {
    path: '/multi-code/generate',
    element: <Navigate to="/app/multi-code/generate" replace />,
  },
  {
    path: '/multi-code/tracking',
    element: <Navigate to="/app/multi-code/tracking" replace />,
  },
  {
    path: '/planting',
    element: <Navigate to="/app/planting/archives" replace />,
  },
  {
    path: '/planting/archives',
    element: <Navigate to="/app/planting/archives" replace />,
  },
  {
    path: '/planting/records',
    element: <Navigate to="/app/planting/records" replace />,
  },
  {
    path: '/planting/materials',
    element: <Navigate to="/app/planting/materials" replace />,
  },
  {
    path: '/planting/orders',
    element: <Navigate to="/app/planting/orders" replace />,
  },
  {
    path: '/wms',
    element: <Navigate to="/app/wms/inventory" replace />,
  },
  {
    path: '/wms/inventory',
    element: <Navigate to="/app/wms/inventory" replace />,
  },
  {
    path: '/wms/inbound',
    element: <Navigate to="/app/wms/inbound" replace />,
  },
  {
    path: '/wms/outbound',
    element: <Navigate to="/app/wms/outbound" replace />,
  },
  {
    path: '/wms/processing',
    element: <Navigate to="/app/wms/processing" replace />,
  },
  {
    path: '/wms/operations',
    element: <Navigate to="/app/wms/operations" replace />,
  },
  {
    path: '/sales',
    element: <Navigate to="/app/sales" replace />,
  },
  {
    path: '/social-service',
    element: <Navigate to="/app/social-service" replace />,
  },
  {
    path: '/quality-control',
    element: <Navigate to="/app/quality-control" replace />,
  },
  {
    path: '/iot',
    element: <Navigate to="/app/iot" replace />,
  },
  {
    path: '/finance',
    element: <Navigate to="/app/finance" replace />,
  },
  {
    path: '/finance/loans',
    element: <Navigate to="/app/finance/loans" replace />,
  },
  {
    path: '/finance/insurance',
    element: <Navigate to="/app/finance/insurance" replace />,
  },
  {
    path: '/finance/scf',
    element: <Navigate to="/app/finance/scf" replace />,
  },
  {
    path: '/finance/escrow',
    element: <Navigate to="/app/finance/escrow" replace />,
  },
  {
    path: '/login',
    element: <Navigate to="/app/dashboard" replace />,
  },
  // ============================================================
  // 404 兜底路由
  // ============================================================
  {
    path: '*',
    element: (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          gap: 16,
          background: '#faf9f5',
        }}
      >
        <h1 style={{ fontSize: 72, margin: 0, color: '#e6dfd8' }}>404</h1>
        <p style={{ color: '#8e8b82', fontSize: 16 }}>页面不存在</p>
        <a href="/" style={{ color: '#cc785c' }}>返回首页</a>
      </div>
    ),
  },
]);

// ============================================================
// 导出路由 Provider
// ============================================================
const Router: React.FC = () => <RouterProvider router={router} />;

export default Router;
