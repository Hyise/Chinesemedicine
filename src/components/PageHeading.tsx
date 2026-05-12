import React from 'react';

interface PageHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
  accentColor?: string;
  gradientFrom?: string;
  gradientMid?: string;
  gradientTo?: string;
  padding?: string;
}

const PageHeading: React.FC<PageHeadingProps> = ({
  eyebrow,
  title,
  description,
  accentColor = '#5db872',
  gradientFrom = '#1d1d1f',
  gradientMid = '#3d2c1e',
  gradientTo = '#5c3d2a',
  padding = '32px 32px 28px',
}) => {
  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientMid} 50%, ${gradientTo} 100%)`,
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding,
      }}
    >
      <div style={{ maxWidth: 1360, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: accentColor,
              boxShadow: `0 0 8px ${accentColor}80`,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 11,
              color: 'rgba(255,255,255,0.4)',
              letterSpacing: '1px',
              fontWeight: 500,
              textTransform: 'uppercase',
            }}
          >
            {eyebrow}
          </span>
        </div>
        <div
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '-0.3px',
            marginBottom: 6,
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
          {description}
        </div>
      </div>
    </div>
  );
};

export default PageHeading;
