import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LandingTech.module.css';
import { kpiData } from '@/pages/dashboard/components/mockData';
import { TOWN_DATA, RESOURCE_DATA } from '@/pages/dashboard/components/mapData';
import LandingMap from './LandingMap';

// ─── System Module Icons (Tech-grade SVG) ───────────────────────────

const PlantingIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    {/* Outer ring */}
    <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="0.75" strokeDasharray="4 2" opacity="0.3"/>
    {/* Center plant */}
    <path d="M20 30V18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M20 22C20 22 14 18 14 13C14 9 17 7 20 7C23 7 26 9 26 13C26 18 20 22 20 22Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    {/* Side leaves */}
    <path d="M20 26C18 25 15 24 12 24C10 24 8 25 8 27" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M20 26C22 25 25 24 28 24C30 24 32 25 32 27" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    {/* Root base */}
    <path d="M15 30H25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M17 30V33M20 30V34M23 30V33" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
    {/* Data dots */}
    <circle cx="20" cy="12" r="1.5" fill="currentColor" opacity="0.6"/>
  </svg>
);

const WMSIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    {/* Warehouse outline */}
    <path d="M4 14L20 5L36 14V34H4V14Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    {/* Inner structure */}
    <path d="M4 14L20 5L36 14" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M12 34V22H28V34" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
    <path d="M20 5V22" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" opacity="0.4"/>
    {/* Shelves */}
    <path d="M8 19H16M24 19H32" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M8 24H16M24 24H32" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M8 29H16M24 29H32" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    {/* In/Out arrows */}
    <path d="M6 28L3 24V28H6" stroke="currentColor" strokeWidth="1" fill="none"/>
    <path d="M34 28L37 24V28H34" stroke="currentColor" strokeWidth="1" fill="none"/>
    {/* Glow dots */}
    <circle cx="20" cy="16" r="2" fill="currentColor" opacity="0.7"/>
    <circle cx="14" cy="27" r="1" fill="currentColor" opacity="0.5"/>
    <circle cx="26" cy="27" r="1" fill="currentColor" opacity="0.5"/>
  </svg>
);

const BlockchainIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    {/* Chain links */}
    <rect x="6" y="12" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="15" y="18" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="24" y="12" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    {/* Connection lines */}
    <path d="M16 17H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M25 23H24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M11 22V28H29V22" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 2" strokeLinecap="round"/>
    {/* Hash marks */}
    <path d="M8 15H14M8 19H12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
    <path d="M17 21H23M17 25H21" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
    <path d="M26 15H32M26 19H30" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
    {/* Nodes */}
    <circle cx="20" cy="8" r="3" stroke="currentColor" strokeWidth="1.2"/>
    <circle cx="20" cy="8" r="1.5" fill="currentColor" opacity="0.6"/>
    <path d="M20 11V12" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    <circle cx="20" cy="34" r="3" stroke="currentColor" strokeWidth="1.2"/>
    <circle cx="20" cy="34" r="1.5" fill="currentColor" opacity="0.6"/>
    <path d="M20 31V30" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
  </svg>
);

const FinanceIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    {/* Coin stack */}
    <ellipse cx="20" cy="28" rx="12" ry="4" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 28V24C8 21.7909 11.134 20 14.5 20H25.5C28.866 20 32 21.7909 32 24V28" stroke="currentColor" strokeWidth="1.5"/>
    <ellipse cx="20" cy="24" rx="12" ry="4" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>
    <ellipse cx="20" cy="20" rx="12" ry="4" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
    {/* Yuan symbol */}
    <path d="M20 17V23M17 19.5C17 18.4 18.3 17.5 20 17.5C21.7 17.5 23 18.4 23 19.5C23 20.5 22 21.2 20 21.5C18 21.8 17 22.5 17 23.5C17 24.6 18.3 25.5 20 25.5C21.7 25.5 23 24.6 23 23.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    {/* Growth arrow */}
    <path d="M32 12L28 8L28 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M28 12H32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    {/* Data lines */}
    <path d="M6 34H8M32 34H34" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
  </svg>
);

const IoTIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    {/* Central hub */}
    <circle cx="20" cy="20" r="5" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="20" cy="20" r="2.5" fill="currentColor" opacity="0.5"/>
    {/* Radiating waves */}
    <circle cx="20" cy="20" r="9" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.3"/>
    <circle cx="20" cy="20" r="13" stroke="currentColor" strokeWidth="1" strokeDasharray="3 4" opacity="0.2"/>
    <circle cx="20" cy="20" r="17" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 5" opacity="0.1"/>
    {/* Device nodes */}
    <circle cx="20" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M18 6.5H22" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    <circle cx="7" cy="15" r="3" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="6" y="14.5" width="2" height="1" rx="0.5" fill="currentColor" opacity="0.5"/>
    <circle cx="33" cy="15" r="3" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="32" y="14.5" width="2" height="1" rx="0.5" fill="currentColor" opacity="0.5"/>
    <circle cx="20" cy="33" r="3" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M18 32.5H22M19.5 32L19.5 33.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    {/* Connection lines */}
    <path d="M20 13V17" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.4"/>
    <path d="M13 17H17" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.4"/>
    <path d="M23 17H27" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.4"/>
    <path d="M20 23V27" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.4"/>
  </svg>
);

const QualityIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    {/* Shield outline */}
    <path d="M20 4L32 9V20C32 28 27 34 20 36C13 34 8 28 8 20V9L20 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    {/* Inner checkmark */}
    <path d="M14 20L18 24L26 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Quality bars */}
    <path d="M13 32H27" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.4"/>
    <path d="M15 34H25" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.2"/>
    {/* Scan line */}
    <path d="M12 16H28" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 2" opacity="0.3"/>
    {/* Corner accents */}
    <circle cx="20" cy="8" r="1.5" fill="currentColor" opacity="0.5"/>
    <circle cx="10" cy="18" r="1" fill="currentColor" opacity="0.3"/>
    <circle cx="30" cy="18" r="1" fill="currentColor" opacity="0.3"/>
  </svg>
);

// ─── Architecture Icons ──────────────────────────────────────────

const ArchLayersIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M4 8L14 4L24 8L14 12L4 8Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    <path d="M4 14L14 10L24 14L14 18L4 14Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    <path d="M4 20L14 16L24 20L14 24L4 20Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    <path d="M14 4V24" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.3"/>
  </svg>
);

const ArchChainIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect x="4" y="9" width="8" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
    <rect x="16" y="9" width="8" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
    <rect x="10" y="14" width="8" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M12 12H16M8 12V14M20 12V14" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
    <path d="M14 20V22M10 20V21M18 20V21" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.4"/>
  </svg>
);

const ArchNetworkIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="14" r="3" stroke="currentColor" strokeWidth="1.3"/>
    <circle cx="14" cy="14" r="1.5" fill="currentColor" opacity="0.5"/>
    <circle cx="5" cy="8" r="2" stroke="currentColor" strokeWidth="1.2"/>
    <circle cx="23" cy="8" r="2" stroke="currentColor" strokeWidth="1.2"/>
    <circle cx="5" cy="20" r="2" stroke="currentColor" strokeWidth="1.2"/>
    <circle cx="23" cy="20" r="2" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M7 9L12 12M16 12L21 9" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1.5"/>
    <path d="M7 19L12 16M16 16L21 19" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1.5"/>
  </svg>
);

const ArchCodeIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect x="4" y="5" width="20" height="18" rx="2" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M4 9H24" stroke="currentColor" strokeWidth="1"/>
    <circle cx="7" cy="7" r="1" fill="#c64545" opacity="0.8"/>
    <circle cx="10" cy="7" r="1" fill="#e8a55a" opacity="0.8"/>
    <circle cx="13" cy="7" r="1" fill="#5db872" opacity="0.8"/>
    <path d="M9 13L6 15L9 17M19 13L22 15L19 17" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 17H17" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const ArchAIIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="1.3"/>
    <circle cx="14" cy="14" r="5" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.4"/>
    <path d="M14 4V8M14 20V24M4 14H8M20 14H24" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M7 7L10 10M18 10L21 7M7 21L10 18M18 18L21 21" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
    <circle cx="14" cy="14" r="2" fill="currentColor" opacity="0.7"/>
  </svg>
);

const ArchCoinIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <ellipse cx="14" cy="20" rx="9" ry="3.5" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M5 20V16C5 13.2386 8.13401 11 12 11H16C19.866 11 23 13.2386 23 16V20" stroke="currentColor" strokeWidth="1.3"/>
    <ellipse cx="14" cy="16" rx="9" ry="3.5" stroke="currentColor" strokeWidth="1.3" opacity="0.4"/>
    <path d="M10 15.5C10 14.7 11.2 14 14 14C16.8 14 18 14.7 18 15.5C18 16.2 17 16.7 14 17C11 17.3 10 17.8 10 18.5C10 19.3 11.2 20 14 20C16.8 20 18 19.3 18 18.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const ArchChartIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect x="4" y="4" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M8 20L11 14L15 17L19 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="8" cy="20" r="1.5" fill="currentColor" opacity="0.6"/>
    <circle cx="11" cy="14" r="1.5" fill="currentColor" opacity="0.6"/>
    <circle cx="15" cy="17" r="1.5" fill="currentColor" opacity="0.6"/>
    <circle cx="19" cy="9" r="1.5" fill="currentColor" opacity="0.6"/>
    <path d="M19 9V12M16 9H19" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
  </svg>
);

// ─── 3D Hex Logo Component ───────────────────────────────────────

const HexLogo: React.FC<{ size?: number; className?: string }> = ({ size = 200, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = size * 2;
    canvas.height = size * 2;
    const cx = size;
    const cy = size;

    const hex = (cx: number, cy: number, r: number, rot = 0) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i + rot;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const t = Date.now() / 1000;
      const layers = 4;
      const baseR = size * 0.35;

      for (let layer = layers; layer >= 0; layer--) {
        const r = baseR + layer * size * 0.12;
        const alpha = 0.08 + layer * 0.04;
        const glowR = baseR + layer * size * 0.1;

        // Outer glow
        ctx.save();
        ctx.shadowColor = `rgba(93, 184, 166, ${alpha * 0.8})`;
        ctx.shadowBlur = 20 + layer * 10;
        ctx.strokeStyle = `rgba(93, 184, 166, ${alpha})`;
        ctx.lineWidth = 1.5;
        hex(cx, cy, glowR, t * 0.1 * (layer % 2 === 0 ? 1 : -1));
        ctx.stroke();
        ctx.restore();

        // Hexagon ring
        ctx.strokeStyle = `rgba(93, 184, 166, ${alpha + 0.05})`;
        ctx.lineWidth = 1;
        hex(cx, cy, r, t * 0.15 * (layer % 2 === 0 ? 1 : -1));
        ctx.stroke();

        // Dashed inner ring
        if (layer > 0) {
          ctx.setLineDash([4, 6]);
          ctx.strokeStyle = `rgba(204, 120, 92, ${alpha * 0.6})`;
          ctx.lineWidth = 0.75;
          hex(cx, cy, r * 0.7, -t * 0.2);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // Center "7S" text glow
      ctx.save();
      ctx.shadowColor = 'rgba(93, 184, 166, 0.6)';
      ctx.shadowBlur = 30;
      ctx.fillStyle = 'rgba(93, 184, 166, 0.15)';
      ctx.font = `bold ${size * 0.22}px "Arial Black", Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('7S', cx, cy);
      ctx.restore();

      // Orbital particles
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI / 4) * i + t * 0.5;
        const r = baseR * 1.5;
        const px = cx + r * Math.cos(angle);
        const py = cy + r * Math.sin(angle);
        const dotR = 2 + Math.sin(t + i) * 1;

        ctx.save();
        ctx.shadowColor = i % 2 === 0 ? '#5db8a6' : '#cc785c';
        ctx.shadowBlur = 10;
        ctx.fillStyle = i % 2 === 0 ? 'rgba(93,184,166,0.8)' : 'rgba(204,120,92,0.8)';
        ctx.beginPath();
        ctx.arc(px, py, dotR, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Connecting arcs
      ctx.strokeStyle = 'rgba(93, 184, 166, 0.1)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < 3; i++) {
        const angle1 = t * 0.3 + (Math.PI / 1.5) * i;
        const angle2 = angle1 + Math.PI * 0.5;
        const r1 = baseR * 1.8;
        const r2 = baseR * 2;
        ctx.beginPath();
        ctx.arc(cx, cy, (r1 + r2) / 2, angle1, angle2);
        ctx.stroke();
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(frameRef.current);
  }, [size]);

  return <canvas ref={canvasRef} width={size} height={size} className={className} style={{ width: size, height: size }} />;
};

// ─── Circuit Line Decoration ─────────────────────────────────────

const CircuitLines: React.FC = () => (
  <svg className={styles.circuitLines} viewBox="0 0 1200 300" preserveAspectRatio="none" fill="none">
    <path d="M0 150H200L240 100H400L440 150H600L640 80H800L840 150H1000L1040 120H1200" stroke="rgba(93,184,166,0.08)" strokeWidth="1"/>
    <path d="M0 250H150L200 200H350L400 250H550L600 180H750L800 250H950L1000 220H1200" stroke="rgba(93,184,166,0.05)" strokeWidth="0.75"/>
    <path d="M0 50H100L150 100H300L350 50H500L550 120H700L750 50H900L950 80H1200" stroke="rgba(204,120,92,0.04)" strokeWidth="0.75"/>
    {/* Nodes */}
    <circle cx="200" cy="150" r="3" fill="rgba(93,184,166,0.15)"/>
    <circle cx="400" cy="150" r="3" fill="rgba(93,184,166,0.15)"/>
    <circle cx="600" cy="150" r="3" fill="rgba(93,184,166,0.15)"/>
    <circle cx="800" cy="150" r="3" fill="rgba(93,184,166,0.15)"/>
    <circle cx="1000" cy="150" r="3" fill="rgba(93,184,166,0.15)"/>
    <circle cx="240" cy="100" r="2" fill="rgba(93,184,166,0.1)"/>
    <circle cx="640" cy="80" r="2" fill="rgba(93,184,166,0.1)"/>
    <circle cx="1040" cy="120" r="2" fill="rgba(93,184,166,0.1)"/>
  </svg>
);

// ─── Data Stream Animation ──────────────────────────────────────

const DataStream: React.FC<{ className?: string }> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const packets: { x: number; y: number; vy: number; text: string; alpha: number }[] = [];
    const textLabels = ['追溯数据', '质检报告', '物流信息', '仓储记录', '金融凭证', '种植档案', '加工工艺'];

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw horizontal guide lines
      ctx.strokeStyle = 'rgba(93, 184, 166, 0.04)';
      ctx.lineWidth = 1;
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Spawn packets
      if (Math.random() < 0.05 && packets.length < 12) {
        packets.push({
          x: Math.random() * canvas.width,
          y: -20,
          vy: 0.5 + Math.random() * 1.5,
          text: textLabels[Math.floor(Math.random() * textLabels.length)],
          alpha: 0.3 + Math.random() * 0.4,
        });
      }

      // Update and draw packets
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.y += p.vy;
        p.x += Math.sin(p.y / 50) * 0.5;

        if (p.y > canvas.height + 20) {
          packets.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;

        // Packet body
        ctx.fillStyle = 'rgba(93, 184, 166, 0.1)';
        const w = 60 + p.text.length * 7;
        const h = 18;
        ctx.beginPath();
        ctx.roundRect(p.x - w / 2, p.y - h / 2, w, h, 4);
        ctx.fill();

        ctx.strokeStyle = 'rgba(93, 184, 166, 0.3)';
        ctx.lineWidth = 0.75;
        ctx.stroke();

        // Text
        ctx.fillStyle = 'rgba(93, 184, 166, 0.7)';
        ctx.font = '9px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.text, p.x, p.y);

        // Trail
        ctx.globalAlpha = p.alpha * 0.3;
        ctx.strokeStyle = 'rgba(93, 184, 166, 0.4)';
        ctx.lineWidth = 0.5;
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y - h / 2);
        ctx.lineTo(p.x, p.y - h / 2 - 20);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.restore();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={className} />;
};

// ─── Constants ───────────────────────────────────────────────────

const DATA_UPDATE_INTERVAL = 3000;
const PARTICLE_COUNT = 60;
const MAX_NODES = 12;

interface Particle {
  x: number; y: number; vx: number; vy: number;
  size: number; opacity: number; pulse: number; pulseSpeed: number;
}

interface DataFlowNode {
  id: number; x: number; y: number; targetX: number; targetY: number;
  progress: number; speed: number; active: boolean; label: string;
}

const KPI_DATA = [
  { value: '12,680', label: '溯源批次', unit: '批', color: '#5db8a6' },
  { value: '98.7%', label: '质量合格率', unit: '', color: '#cc785c' },
  { value: '¥ 4.2亿', label: '年交易额', unit: '', color: '#e8a55a' },
  { value: '3,420', label: '种植户接入', unit: '户', color: '#5db872' },
];

const SYSTEM_MODULES = [
  { id: 'planting', title: '种植服务管理', subtitle: 'PLANTING SERVICE', desc: '覆盖种苗、施肥、灌溉、病虫害防治到采收的全生命周期数字化管理', tags: ['农事排期', '农资管理', '环境监测', '采收管理'], color: '#5db872', icon: <PlantingIcon /> },
  { id: 'wms', title: '加工仓储管理', subtitle: 'WAREHOUSE & PROCESSING', desc: '原料入库→加工转化→智能作业→成品出库全链路追溯与库存可视化', tags: ['智能入库', '加工追溯', '库存台账', '智能出库'], color: '#cc785c', icon: <WMSIcon /> },
  { id: 'traceability', title: '区块链溯源', subtitle: 'BLOCKCHAIN TRACEABILITY', desc: '基于区块链技术，实现金钗石斛从田间到终端全流程数据上链、不可篡改', tags: ['数据上链', '扫码溯源', '防伪验真', '全链追溯'], color: '#5db8a6', icon: <BlockchainIcon /> },
  { id: 'finance', title: '供应链金融', subtitle: 'SUPPLY CHAIN FINANCE', desc: '整合助农贷款、农业保险、供应链金融与资金托管服务，破解农户融资难题', tags: ['助农贷款', '农业保险', '供应链金融', '资金托管'], color: '#e8a55a', icon: <FinanceIcon /> },
  { id: 'iot', title: '物联网采集', subtitle: 'IoT DATA COLLECTION', desc: '接入土壤传感器、气象站、无人机等多源设备，实现环境数据实时采集与预警', tags: ['环境监测', '设备接入', '数据预警', '边缘计算'], color: '#5db8a6', icon: <IoTIcon /> },
  { id: 'quality', title: '质量管控', subtitle: 'QUALITY CONTROL', desc: '建立药材质量检测标准，对接权威检测机构，实现质量数据全程可查可追溯', tags: ['检测标准', '质量报告', '不合格预警', '合规管理'], color: '#c64545', icon: <QualityIcon /> },
];

const ARCH_ITEMS = [
  { icon: <ArchLayersIcon />, title: '三层微服务架构', desc: '接入层、业务层、数据层分离，支持弹性扩容与独立部署', color: '#5db8a6' },
  { icon: <ArchChainIcon />, title: '区块链数据存证', desc: '关键业务数据哈希上链，链上链下双重存储，防篡改可验真', color: '#cc785c' },
  { icon: <ArchNetworkIcon />, title: '物联网设备接入', desc: '支持多协议设备接入，实时采集土壤、气象、水质等环境数据', color: '#e8a55a' },
  { icon: <ArchCodeIcon />, title: '多码合一追溯', desc: '一物一码、一批一码、一域一码三码协同，全生命周期可追溯', color: '#5db872' },
  { icon: <ArchAIIcon />, title: 'AI智能分析', desc: '基于大模型能力，提供种植建议、病虫害识别、市场行情预测', color: '#c64545' },
  { icon: <ArchCoinIcon />, title: '金融科技赋能', desc: '供应链金融全链路数字化，为农户、贸易商、药企提供一站式金融服务', color: '#5db8a6' },
  { icon: <ArchChartIcon />, title: '产业数据大脑', desc: '多维度数据采集与可视化，支撑产业决策与风险预警', color: '#cc785c' },
];

const mockRealtimeData = [
  { id: 1, name: '金钗石斛批次#ZC-2025-0891', status: '已入库', loc: 'A区-03-12', time: '2分钟前', change: '+12.5kg' },
  { id: 2, name: '太子参批次#TZ-2025-0456', status: '加工中', loc: 'B区-01-07', time: '5分钟前', change: '完成清洗' },
  { id: 3, name: '天麻批次#TM-2025-0234', status: '待出库', loc: 'C区-02-18', time: '8分钟前', change: '-30kg' },
  { id: 4, name: '杜仲批次#DZ-2025-0789', status: '质检中', loc: 'D区-04-03', time: '12分钟前', change: '通过' },
  { id: 5, name: '金银花批次#JYH-2025-0123', status: '已出库', loc: '已发往成都', time: '15分钟前', change: '-50kg' },
];

// ─── Particle Canvas ──────────────────────────────────────────────

const ParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 0.5, opacity: Math.random() * 0.5 + 0.1,
      pulse: Math.random() * Math.PI * 2, pulseSpeed: Math.random() * 0.02 + 0.005,
    }));

    const nodes: DataFlowNode[] = Array.from({ length: MAX_NODES }, (_, i) => ({
      id: i, x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      targetX: Math.random() * canvas.width, targetY: Math.random() * canvas.height,
      progress: Math.random(), speed: 0.002 + Math.random() * 0.004,
      active: Math.random() > 0.3, label: '',
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Grid
      ctx.strokeStyle = 'rgba(93, 184, 166, 0.04)';
      ctx.lineWidth = 1;
      const cellSize = 60;
      for (let x = 0; x < canvas.width; x += cellSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += cellSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // Connection lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(93, 184, 166, ${(1 - dist / 150) * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Particles
      particles.forEach(p => {
        p.pulse += p.pulseSpeed;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;

        const pulseOpacity = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(93, 184, 166, ${pulseOpacity})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(93, 184, 166, ${pulseOpacity * 0.1})`;
        ctx.fill();
      });

      // Flowing nodes
      nodes.forEach(node => {
        node.progress += node.speed;
        if (node.progress >= 1) {
          node.progress = 0;
          node.x = node.targetX; node.y = node.targetY;
          node.targetX = Math.random() * canvas.width;
          node.targetY = Math.random() * canvas.height;
          node.active = Math.random() > 0.2;
        } else {
          node.x += (node.targetX - node.x) * 0.02;
          node.y += (node.targetY - node.y) * 0.02;
        }

        if (node.active) {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(93, 184, 166, 0.15)';
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 6]);
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(node.targetX, node.targetY);
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.beginPath();
          ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(93, 184, 166, 0.4)';
          ctx.fill();

          ctx.beginPath();
          ctx.arc(node.x, node.y, 6, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(93, 184, 166, 0.2)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      animFrame = requestAnimationFrame(draw);
    };

    draw();
    return () => { cancelAnimationFrame(animFrame); ro.disconnect(); };
  }, []);

  return <canvas ref={canvasRef} className={styles.particleCanvas} />;
};

// ─── Hex Pattern ──────────────────────────────────────────────────

const HexPattern: React.FC<{ className?: string; opacity?: number }> = ({ className, opacity = 0.05 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const size = 30;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = `rgba(93, 184, 166, ${opacity})`;
      ctx.lineWidth = 0.5;

      for (let row = -1; row < canvas.height / (size * 1.732) + 2; row++) {
        for (let col = -1; col < canvas.width / (size * 3) + 2; col++) {
          const x = col * size * 3;
          const y = row * size * 1.732;
          const offsetX = (row % 2) * size * 1.5;

          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 6;
            const hx = x + offsetX + size * Math.cos(angle);
            const hy = y + size * Math.sin(angle);
            if (i === 0) ctx.moveTo(hx, hy); else ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.stroke();
        }
      }
    };

    draw();
    return () => { ro.disconnect(); };
  }, [opacity]);

  return <canvas ref={canvasRef} className={className} />;
};

// ─── Live Feed ───────────────────────────────────────────────────

const LiveFeed: React.FC = () => {
  const [data, setData] = useState(mockRealtimeData);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => prev.map(item => ({
        ...item,
        time: `${Math.floor(Math.random() * 30) + 1}分钟前`,
        change: item.status === '已入库' ? `+${(Math.random() * 20 + 5).toFixed(1)}kg` :
                item.status === '已出库' ? `-${(Math.random() * 60 + 20).toFixed(1)}kg` :
                item.status === '加工中' ? ['完成清洗', '完成烘干', '切片中'][Math.floor(Math.random() * 3)] :
                item.status === '质检中' ? ['通过', '待复检'][Math.floor(Math.random() * 2)] :
                item.change,
      })));
    }, DATA_UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const statusColor: Record<string, string> = {
    '已入库': '#5db872', '加工中': '#e8a55a', '待出库': '#5db8a6', '质检中': '#cc785c', '已出库': '#8e8b82',
  };

  return (
    <div className={styles.liveFeed}>
      <div className={styles.liveFeedHeader}>
        <div className={styles.liveDot} />
        <span>实时数据流</span>
        <span className={styles.liveCount}>{data.length} 条活跃记录</span>
      </div>
      <div className={styles.liveFeedList}>
        {data.map((item, idx) => (
          <div key={item.id} className={styles.liveFeedItem} style={{ animationDelay: `${idx * 0.1}s` }}>
            <div className={styles.liveFeedLeft}>
              <span className={styles.liveFeedName}>{item.name}</span>
              <span className={styles.liveFeedLoc}>{item.loc}</span>
            </div>
            <div className={styles.liveFeedRight}>
              <span className={styles.liveFeedStatus} style={{ color: statusColor[item.status], background: `${statusColor[item.status]}14` }}>
                {item.status}
              </span>
              <span className={styles.liveFeedChange}>{item.change}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────

const LandingTech: React.FC = () => {
  const navigate = useNavigate();
  const [kpiIdx, setKpiIdx] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setKpiIdx(prev => (prev + 1) % KPI_DATA.length), 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      document.querySelectorAll('[data-reveal]').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) el.classList.add(styles.revealed);
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`${styles.page} ${mounted ? styles.pageMounted : ''}`}>
      {/* NAV */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.navLogo}>
            <div className={styles.navLogoMark}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <polygon points="16,2 29,9 29,23 16,30 3,23 3,9" stroke="url(#logoGrad)" strokeWidth="1.5" fill="none"/>
                <text x="16" y="20" textAnchor="middle" fontSize="11" fontWeight="900" fill="url(#logoGrad)" fontFamily="Arial Black, sans-serif">7S</text>
                <defs>
                  <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#5db8a6"/>
                    <stop offset="100%" stopColor="#cc785c"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className={styles.navLogoText}>
              <span>7s产地仓</span>
              <span className={styles.navLogoSub}>7s赤水金钗石斛产地仓公共服务平台</span>
            </div>
          </div>
          <div className={styles.navLinks}>
            <a href="#modules" className={styles.navLink}>系统模块</a>
            <a href="#arch" className={styles.navLink}>架构优势</a>
            <a href="#brain" className={styles.navLink}>产业大脑</a>
            <a href="#realtime" className={styles.navLink}>实时监控</a>
            <a href="#showcase" className={styles.navLink}>功能展示</a>
          </div>
          <div className={styles.navActions}>
            <button className={styles.navBtnSecondary} onClick={() => navigate('/app/dashboard')}>管理后台</button>
            <button className={styles.navBtnPrimary} onClick={() => window.open('/showcase', '_blank')}>功能展示</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <ParticleCanvas />
        <HexPattern className={styles.hexBg} opacity={0.025} />
        <DataStream className={styles.dataStream} />
        <CircuitLines />
        <div className={styles.heroGlow} />
        <div className={styles.heroGlow2} />

        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            <span className={styles.heroBadgeDot2} />
            系统运行中 · 贵州省赤水市
          </div>

          {/* 3D Hex Logo */}
          <div className={styles.heroLogo}>
            <HexLogo size={160} className={styles.hexLogoCanvas} />
          </div>

          <h1 className={styles.heroTitle}>
            <span className={styles.heroTitleLine1}>7s赤水金钗石斛产地仓公共服务平台</span>
          </h1>

          <p className={styles.heroDesc}>
            基于区块链、物联网、大数据与人工智能技术，构建覆盖种植、加工、仓储、<br />
            溯源、质检、金融全产业链的一站式公共服务平台
          </p>

          <div className={styles.heroCta}>
            <button className={styles.ctaPrimary} onClick={() => navigate('/app/dashboard')}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2V14M2 8H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              进入管理后台
            </button>
            <button className={styles.ctaSecondary} onClick={() => window.open('/showcase', '_blank')}>
              查看功能展示
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7H11M8 4L11 7L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* KPI ticker */}
          <div className={styles.heroKpi}>
            {KPI_DATA.map((kpi, idx) => (
              <div key={kpi.label} className={`${styles.heroKpiItem} ${idx === kpiIdx ? styles.heroKpiActive : ''}`}>
                <span className={styles.heroKpiValue} style={{ color: kpi.color }}>{kpi.value}</span>
                <span className={styles.heroKpiLabel}>{kpi.label}</span>
                {kpi.unit && <span className={styles.heroKpiUnit}>{kpi.unit}</span>}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.scrollHint}>
          <div className={styles.scrollLine} />
          <span>向下滚动</span>
        </div>
      </section>

      {/* MODULES */}
      <section className={styles.modules} id="modules">
        <div className={styles.sectionHeader} data-reveal>
          <div className={styles.sectionTag}>CORE MODULES</div>
          <h2 className={styles.sectionTitle}>金钗石斛7S核心服务模块</h2>
          <p className={styles.sectionDesc}>覆盖金钗石斛全产业链的一站式公共服务能力</p>
        </div>

        <div className={styles.modulesGrid}>
          {SYSTEM_MODULES.map((mod, idx) => (
            <div key={mod.id} className={styles.moduleCard} data-reveal style={{ '--delay': `${idx * 0.08}s` } as React.CSSProperties}>
              <div className={styles.moduleCardGlow} style={{ background: `radial-gradient(circle at 50% 0%, ${mod.color}18, transparent 60%)` }} />
              <div className={styles.moduleCardTop}>
                <div className={styles.moduleIcon} style={{ color: mod.color, background: `${mod.color}12`, border: `1px solid ${mod.color}30` }}>
                  {mod.icon}
                </div>
                <div className={styles.moduleMeta}>
                  <div className={styles.moduleSubtitle}>{mod.subtitle}</div>
                  <h3 className={styles.moduleTitle}>{mod.title}</h3>
                </div>
                <div className={styles.moduleIndex} style={{ color: mod.color, opacity: 0.15 }}>0{idx + 1}</div>
              </div>
              <p className={styles.moduleDesc}>{mod.desc}</p>
              <div className={styles.moduleTags}>
                {mod.tags.map(tag => (
                  <span key={tag} className={styles.moduleTag} style={{ borderColor: `${mod.color}40`, color: mod.color, background: `${mod.color}08` }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ARCHITECTURE */}
      <section className={styles.arch} id="arch">
        <HexPattern className={styles.archHex} opacity={0.035} />
        <div className={styles.sectionHeader} data-reveal>
          <div className={styles.sectionTag}>TECHNOLOGY STACK</div>
          <h2 className={styles.sectionTitle}>技术架构优势</h2>
          <p className={styles.sectionDesc}>现代化的技术选型，确保系统稳定、安全、可扩展</p>
        </div>

        <div className={styles.archGrid} data-reveal>
          {ARCH_ITEMS.map((item, idx) => (
            <div key={item.title} className={styles.archCard} data-reveal style={{ '--delay': `${idx * 0.07}s` } as React.CSSProperties}>
              <div className={styles.archIcon} style={{ color: item.color, background: `${item.color}12`, border: `1px solid ${item.color}25` }}>
                {item.icon}
              </div>
              <h3 className={styles.archTitle}>{item.title}</h3>
              <p className={styles.archDesc}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* REALTIME */}
      <section className={styles.realtime} id="realtime">
        <div className={styles.sectionHeader} data-reveal>
          <div className={styles.sectionTag}>LIVE MONITORING</div>
          <h2 className={styles.sectionTitle}>实时数据监控</h2>
          <p className={styles.sectionDesc}>全链路数据实时同步，业务状态一览无余</p>
        </div>

        <div className={styles.realtimeGrid} data-reveal>
          <LiveFeed />
          <div className={styles.realtimeStats}>
            {[
              { label: '在线设备', value: '2,847', unit: '台', color: '#5db8a6', bar: 78 },
              { label: '今日交易', value: '¥ 128.6万', unit: '', color: '#cc785c', bar: 62 },
              { label: '待质检', value: '43', unit: '批次', color: '#e8a55a', bar: 35 },
              { label: '库存预警', value: '7', unit: '项', color: '#c64545', bar: 18 },
            ].map(stat => (
              <div key={stat.label} className={styles.statItem}>
                <div className={styles.statHeader}>
                  <span className={styles.statLabel}>{stat.label}</span>
                  <span className={styles.statValue} style={{ color: stat.color }}>
                    {stat.value}<span className={styles.statUnit}>{stat.unit}</span>
                  </span>
                </div>
                <div className={styles.statBar}>
                  <div className={styles.statBarFill} style={{ width: `${stat.bar}%`, background: `linear-gradient(90deg, ${stat.color}cc, ${stat.color})` }} />
                  <div className={styles.statBarGlow} style={{ width: `${stat.bar}%`, background: stat.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section className={styles.dashboard} id="brain">
        <div className={styles.dashboardHeader} data-reveal>
          <div className={styles.sectionTag}>INDUSTRY BRAIN</div>
          <h2 className={styles.sectionTitle}>金钗石斛产业大脑数据平台</h2>
          <p className={styles.sectionDesc}>贵州省赤水市 · 金钗石斛全产业链公共服务驾驶舱</p>
        </div>

        {/* KPI strip */}
        <div className={styles.dashboardKpi} data-reveal>
          {kpiData.slice(0, 4).map((kpi, i) => (
            <div key={kpi.title} className={styles.dashboardKpiItem}>
              <div className={styles.dashboardKpiIcon} style={{ color: kpi.color, background: `${kpi.color}12`, border: `1px solid ${kpi.color}30` }}>
                <span style={{ fontSize: 18 }}>{['⊕', '◉', '◎', '◈'][i]}</span>
              </div>
              <div>
                <div className={styles.dashboardKpiLabel}>{kpi.title}</div>
                <div className={styles.dashboardKpiValue} style={{ color: kpi.color }}>
                  {kpi.value.toLocaleString()}
                  <span className={styles.dashboardKpiUnit}>{kpi.unit}</span>
                </div>
              </div>
              <div className={styles.dashboardKpiTrend} style={{ color: kpi.trendUp ? '#5db872' : '#c64545' }}>
                {kpi.trendUp ? '▲' : '▼'} {kpi.trend}%
              </div>
            </div>
          ))}
        </div>

        {/* Dashboard mock cards */}
        <div className={styles.dashboardGrid} data-reveal>
          {/* Map card */}
          <div className={`${styles.dashboardCard} ${styles.dashboardCardMap}`}>
            <div className={styles.dashboardCardHeader}>
              <div className={styles.dashboardCardTitle}>
                <span className={styles.dashboardCardDot} style={{ background: '#e8a55a' }} />
                产业资源分布
              </div>
              <span className={styles.dashboardCardBadge}>17镇域</span>
            </div>
            <div className={styles.dashboardCardBody} style={{ padding: 0, flex: 1, height: '100%' }}>
              <LandingMap towns={TOWN_DATA} resources={RESOURCE_DATA} />
            </div>
          </div>

          {/* Right column: 2 stacked mini cards */}
          <div className={`${styles.dashboardRight} ${styles.dashboardRightCards}`}>
            {/* Production card */}
            <div className={styles.dashboardCard} style={{ '--card-accent': '#cc785c' } as React.CSSProperties}>
              <div className={styles.dashboardCardHeader}>
                <div className={styles.dashboardCardTitle}>
                  <span className={styles.dashboardCardDot} style={{ background: '#cc785c' }} />
                  生产服务
                </div>
                <span className={styles.dashboardCardBadge}>实时</span>
              </div>
              <div className={styles.dashboardCardBody} style={{ padding: '12px 16px' }}>
                <div className={styles.miniChartBars}>
                  {['官渡镇','长期镇','大同镇','旺隆镇','丙安镇','两河口镇'].map((name, i) => (
                    <div key={name} className={styles.miniBar}>
                      <span className={styles.miniBarLabel}>{name}</span>
                      <div className={styles.miniBarTrack}>
                        <div className={styles.miniBarFill} style={{ width:`${[85,72,58,45,38,28][i]}%`, background:`hsl(${160+i*12},50%,50%)` }} />
                      </div>
                      <span className={styles.miniBarVal}>{[3200,2400,1800,1200,850,620][i]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quality card */}
            <div className={styles.dashboardCard} style={{ '--card-accent': '#5db8a6' } as React.CSSProperties}>
              <div className={styles.dashboardCardHeader}>
                <div className={styles.dashboardCardTitle}>
                  <span className={styles.dashboardCardDot} style={{ background: '#5db8a6' }} />
                  质量控制
                </div>
                <span className={styles.dashboardCardBadge}>合格率 98.7%</span>
              </div>
              <div className={styles.dashboardCardBody} style={{ padding: '12px 16px' }}>
                <div className={styles.qualityRings}>
                  <div className={styles.qualityRing}>
                    <svg width="80" height="80" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(93,184,166,0.08)" strokeWidth="6"/>
                      <circle cx="40" cy="40" r="32" fill="none" stroke="#5db872" strokeWidth="6"
                        strokeDasharray={`${2*Math.PI*32*0.95} ${2*Math.PI*32*0.05}`}
                        strokeLinecap="round" transform="rotate(-90 40 40)"/>
                      <text x="40" y="44" textAnchor="middle" fill="#5db872" fontSize="13" fontWeight="700">95%</text>
                    </svg>
                    <span className={styles.qualityRingLabel}>农药残留</span>
                  </div>
                  <div className={styles.qualityRing}>
                    <svg width="80" height="80" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(93,184,166,0.08)" strokeWidth="6"/>
                      <circle cx="40" cy="40" r="32" fill="none" stroke="#5db8a6" strokeWidth="6"
                        strokeDasharray={`${2*Math.PI*32*0.99} ${2*Math.PI*32*0.01}`}
                        strokeLinecap="round" transform="rotate(-90 40 40)"/>
                      <text x="40" y="44" textAnchor="middle" fill="#5db8a6" fontSize="13" fontWeight="700">99%</text>
                    </svg>
                    <span className={styles.qualityRingLabel}>有效成分</span>
                  </div>
                  <div className={styles.qualityRing}>
                    <svg width="80" height="80" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(93,184,166,0.08)" strokeWidth="6"/>
                      <circle cx="40" cy="40" r="32" fill="none" stroke="#cc785c" strokeWidth="6"
                        strokeDasharray={`${2*Math.PI*32*0.92} ${2*Math.PI*32*0.08}`}
                        strokeLinecap="round" transform="rotate(-90 40 40)"/>
                      <text x="40" y="44" textAnchor="middle" fill="#cc785c" fontSize="13" fontWeight="700">92%</text>
                    </svg>
                    <span className={styles.qualityRingLabel}>重金属</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom row: trade + market + social */}
          <div className={styles.dashboardBottomRow}>
            {([
              { title: '交易中心', color: '#c64545', badge: '¥ 128.6万/日', data: [
                { name: '金钗石斛(鲜条)', price: '¥ 680', change: '+2.3%' },
                { name: '金钗石斛(枫斗)', price: '¥ 2,800', change: '-0.8%' },
                { name: '石斛粉', price: '¥ 420', change: '+1.5%' },
              ]},
              { title: '市场服务', color: '#5db8a6', badge: '1,280 户', data: [
                { name: '农资供应', price: '156 项', change: '' },
                { name: '技术指导', price: '89 次/月', change: '' },
                { name: '金融支持', price: '¥ 420万', change: '+12%' },
              ]},
              { title: '社会化服务', color: '#5db872', badge: '98.7% 满意', data: [
                { name: '农事服务', price: '2,340 次', change: '' },
                { name: '烘干服务', price: '860 吨', change: '' },
                { name: '冷链仓储', price: '1,280 吨', change: '' },
              ]},
            ] as const).map(item => (
              <div key={item.title} className={styles.dashboardCard} style={{ '--card-accent': item.color } as React.CSSProperties}>
                <div className={styles.dashboardCardHeader}>
                  <div className={styles.dashboardCardTitle}>
                    <span className={styles.dashboardCardDot} style={{ background: item.color }} />
                    {item.title}
                  </div>
                  <span className={styles.dashboardCardBadge}>{item.badge}</span>
                </div>
                <div className={styles.dashboardCardBody} style={{ padding: '10px 16px' }}>
                  {item.data.map(row => (
                    <div key={row.name} className={styles.dashboardRow}>
                      <span className={styles.dashboardRowName}>{row.name}</span>
                      <span className={styles.dashboardRowVal} style={{ color: item.color }}>{row.price}</span>
                      {row.change && <span className={styles.dashboardRowChange}>{row.change}</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA link */}
        <div className={styles.dashboardCta} data-reveal>
          <button className={styles.dashboardCtaBtn} onClick={() => navigate('/app/dashboard')}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            进入完整数据驾驶舱
          </button>
          <span className={styles.dashboardCtaSub}>完整产业大脑 · 实时数据 · 交互地图</span>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta} data-reveal>
        <HexPattern className={styles.ctaHex} opacity={0.05} />
        <div className={styles.ctaInner}>
          <div className={styles.ctaGlow} />
          <div className={styles.ctaDecor1} />
          <div className={styles.ctaDecor2} />
          <h2 className={styles.ctaTitle}>开启金钗石斛产地仓公共服务新篇</h2>
          <p className={styles.ctaDesc}>7s赤水金钗石斛产地仓公共服务平台已准备好为您的企业提供全产业链一站式服务</p>
          <div className={styles.ctaBtns}>
            <button className={styles.ctaPrimary} onClick={() => navigate('/app/dashboard')}>立即体验</button>
            <button className={styles.ctaSecondary} onClick={() => window.open('/showcase', '_blank')}>功能展示页</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className={styles.footerLogoMark}>
              <polygon points="16,2 29,9 29,23 16,30 3,23 3,9" stroke="url(#fLogoGrad)" strokeWidth="1.5" fill="none"/>
              <text x="16" y="20" textAnchor="middle" fontSize="11" fontWeight="900" fill="url(#fLogoGrad)" fontFamily="Arial Black, sans-serif">7S</text>
              <defs>
                <linearGradient id="fLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#5db8a6"/>
                  <stop offset="100%" stopColor="#cc785c"/>
                </linearGradient>
              </defs>
            </svg>
            <div>
              <div className={styles.footerBrandName}>7s赤水金钗石斛产地仓公共服务平台</div>
              <div className={styles.footerBrandDesc}>贵州省赤水市 · 金钗石斛全产业链公共服务</div>
            </div>
          </div>
          <div className={styles.footerLinks}>
            <a onClick={() => navigate('/app/dashboard')}>管理后台</a>
            <a onClick={() => window.open('/showcase', '_blank')}>功能展示</a>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span>© 2025 7s赤水金钗石斛产地仓公共服务平台</span>
          <span>贵州省赤水市</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingTech;
