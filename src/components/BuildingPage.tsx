import React from 'react';
import { BuildOutlined } from '@ant-design/icons';

interface BuildingPageProps {
  title?: string;
}

/**
 * 通用"建设中"占位页面组件
 * 用于暂未开发的模块，展示统一的提示信息
 */
const BuildingPage: React.FC<BuildingPageProps> = ({ title }) => {
  const styles: Record<string, React.CSSProperties> = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 150px)',
      padding: '40px 20px',
      textAlign: 'center',
    },
    icon: {
      fontSize: 64,
      color: '#1677ff',
      marginBottom: 24,
      opacity: 0.7,
    },
    title: {
      fontSize: 20,
      fontWeight: 600,
      color: '#262626',
      margin: '0 0 12px',
    },
    desc: {
      fontSize: 14,
      color: '#8c8c8c',
      margin: '0 0 32px',
    },
    progress: {
      width: 200,
      height: 4,
      background: '#f0f0f0',
      borderRadius: 2,
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      width: '40%',
      background: 'linear-gradient(90deg, #1677ff, #4096ff)',
      borderRadius: 2,
      animation: 'slide 1.8s ease-in-out infinite',
    },
  };

  return (
    <>
      <style>{`
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
      `}</style>
      <div style={styles.container}>
        <BuildOutlined style={styles.icon} />
        <h2 style={styles.title}>{title || '功能开发中'}</h2>
        <p style={styles.desc}>该模块正在紧张开发中，敬请期待...</p>
        <div style={styles.progress}>
          <div style={styles.progressBar} />
        </div>
      </div>
    </>
  );
};

export default BuildingPage;
