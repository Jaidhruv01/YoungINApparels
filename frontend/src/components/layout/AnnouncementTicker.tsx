import React, { useState } from 'react';

interface AnnouncementTickerProps {
  text?: string;
}

export const AnnouncementTicker: React.FC<AnnouncementTickerProps> = ({
  text = 'MEMBERS SAVE 20% ON THEIR FIRST ORDER • FREE PAN-INDIA EXPRESS SHIPPING OVER ₹1,999 • ELEVATED ARCHITECTURAL ACTIVEWEAR • USE CODE: FIRST10 • 7-DAY EASY SIZE SWAP',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <aside
      aria-label="Store Announcements"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: '#121212',
        color: '#e5e5e5',
        borderBottom: '1px solid #222222',
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        userSelect: 'none',
        zIndex: 50,
      }}
    >
      {/* Left Gradient Mask */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '32px',
          background: 'linear-gradient(to right, #121212 10%, transparent)',
          pointerEvents: 'none',
          zIndex: 4,
        }}
      />

      {/* Marquee Track: Infinite linear marquee moving right to left */}
      <div
        className="marquee-track"
        style={{
          display: 'inline-flex',
          whiteSpace: 'nowrap',
          willChange: 'transform',
          animation: 'marqueeLinear 26s linear infinite',
          animationPlayState: isHovered ? 'paused' : 'running',
        }}
      >
        {[0, 1, 2, 3].map((idx) => (
          <div
            key={idx}
            className="marquee-group"
            aria-hidden={idx > 0}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2.5rem',
              paddingRight: '2.5rem',
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#d4d4d4',
            }}
          >
            <span>{text}</span>
            <span style={{ color: '#666666' }}>•</span>
          </div>
        ))}
      </div>

      {/* Right Gradient Mask */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '32px',
          background: 'linear-gradient(to left, #121212 10%, transparent)',
          pointerEvents: 'none',
          zIndex: 4,
        }}
      />

      <style>{`
        @keyframes marqueeLinear {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </aside>
  );
};
