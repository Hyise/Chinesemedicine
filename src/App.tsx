import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import Router from '@/router';
import '@/styles/global.css';

const App: React.FC = () => {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#cc785c',
          colorSuccess: '#5db872',
          colorWarning: '#d4a017',
          colorError: '#c64545',
          colorInfo: '#cc785c',
          borderRadius: 8,
          borderRadiusLG: 16,
          borderRadiusSM: 6,
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
          fontSize: 14,
          fontSizeHeading1: 28,
          fontSizeHeading2: 24,
          fontSizeHeading3: 18,
          fontSizeHeading4: 16,
          fontSizeHeading5: 14,
          boxShadow: '0 0 0 1px #e6dfd8',
          boxShadowSecondary: '0 4px 16px rgba(20,20,19,0.06)',
          lineHeight: 1.55,
          controlHeight: 36,
          controlHeightLG: 44,
          controlHeightSM: 28,
          motion: true,
          wireframe: false,
        },
        components: {
          Layout: {
            headerBg: '#ffffff',
            siderBg: '#faf9f5',
            bodyBg: '#faf9f5',
            headerHeight: 64,
            headerPadding: '0 24px',
            headerColor: '#141413',
          },
          Menu: {
            itemBg: 'transparent',
            itemHoverBg: '#f5f0e8',
            itemSelectedBg: '#efe9de',
            itemSelectedColor: '#cc785c',
            itemMarginInline: 8,
            itemBorderRadius: 8,
            itemPaddingInline: 12,
            itemHeight: 40,
            iconSize: 16,
            iconMarginInlineEnd: 8,
            subMenuItemBg: 'transparent',
            itemColor: '#3d3d3a',
            itemHoverColor: '#141413',
          },
          Card: {
            borderRadiusLG: 12,
            borderRadiusSM: 12,
            borderRadiusXS: 6,
            paddingLG: 20,
            paddingMD: 16,
            paddingSM: 12,
            headerBg: 'transparent',
          },
          Table: {
            headerBg: '#f5f0e8',
            headerColor: '#6c6a64',
            headerSortActiveBg: '#ebe6df',
            headerSortHoverBg: '#ebe6df',
            rowHoverBg: '#f5f0e8',
            borderColor: '#e6dfd8',
            headerBorderRadius: 0,
            cellPaddingBlock: 12,
            cellPaddingInline: 16,
          },
          Button: {
            primaryShadow: 'none',
            defaultShadow: 'none',
            dangerShadow: 'none',
            borderRadius: 8,
            paddingInline: 20,
            paddingInlineLG: 24,
            paddingInlineSM: 12,
            defaultBg: '#ffffff',
            defaultBorderColor: '#e6dfd8',
            defaultColor: '#141413',
          },
          Input: {
            activeBorderColor: '#cc785c',
            hoverBorderColor: '#cc785c',
            activeShadow: '0 0 0 3px rgba(204,120,92,0.12)',
            paddingBlock: 8,
            paddingInline: 12,
            borderRadius: 8,
            activeBg: '#ffffff',
          },
          Select: {
            optionSelectedBg: 'rgba(204,120,92,0.08)',
            optionActiveBg: '#f5f0e8',
            borderRadius: 8,
          },
          Tabs: {
            inkBarColor: '#cc785c',
            itemActiveColor: '#cc785c',
            itemHoverColor: '#141413',
            itemSelectedColor: '#cc785c',
            itemColor: '#6c6a64',
          },
          Modal: {
            borderRadiusLG: 16,
            paddingLG: 28,
            headerBg: 'transparent',
          },
          Drawer: {
            borderRadiusLG: 16,
          },
          Tag: {
            borderRadiusSM: 9999,
            borderRadiusLG: 9999,
            defaultBg: '#efe9de',
            defaultColor: '#6c6a64',
            lineHeight: 1.5,
          },
          Pagination: {
            itemActiveBg: '#cc785c',
            itemBg: '#ffffff',
            borderRadius: 8,
            itemSize: 34,
          },
          Tooltip: {
            colorBgSpotlight: '#181715',
            borderRadius: 6,
          },
          Popover: {
            borderRadiusLG: 12,
          },
          Dropdown: {
            borderRadiusLG: 12,
          },
          Message: {
            contentBg: '#181715',
          },
          Notification: {
            borderRadiusLG: 12,
          },
          Form: {
            labelColor: '#6c6a64',
          },
          Progress: {
            remainingColor: '#efe9de',
          },
          Steps: {},
          Avatar: {
            borderRadius: 8,
          },
          Badge: {
            borderRadiusSM: 9999,
            dotSize: 8,
          },
          Tree: {
            nodeSelectedBg: 'rgba(204,120,92,0.1)',
            nodeHoverBg: '#f5f0e8',
            borderRadius: 6,
          },
          Collapse: {
            borderRadiusLG: 12,
            borderRadiusSM: 8,
            headerBg: '#ffffff',
            contentBg: '#f5f0e8',
          },
          Statistic: {},
          Descriptions: {
            labelBg: '#f5f0e8',
          },
          Timeline: {
            dotBg: '#cc785c',
            tailColor: '#e6dfd8',
          },
          Breadcrumb: {
            linkColor: '#6c6a64',
            linkHoverColor: '#cc785c',
            separatorColor: '#8e8b82',
          },
        },
      }}
    >
      <Router />
    </ConfigProvider>
  );
};

export default App;
