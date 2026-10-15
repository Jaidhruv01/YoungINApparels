import React, { useState } from 'react';
import { Pause, Play } from 'lucide-react';

interface AnnouncementTickerProps {
  text?: string;
}

export const AnnouncementTicker: React.FC<AnnouncementTickerProps> = ({
  text = 'FREE PAN-INDIA EXPRESS SHIPPING ON ORDERS OVER ₹1,999 • USE CODE: FIRST10 FOR 10% OFF • 350GSM HEAVYWEIGHT LOWERS & MULTI-TIER COMPRESSIONS LIVE • HIGH-PERFORMANCE GYMWEAR CRAFTED IN INDIA • 7-DAY EASY SIZE SWAP',
}) => {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <aside
      aria-label="Store Announcements"
      style={{
        backgroundColor: '#0a0a0a',
        color: '#ffffff',
        borderBottom: '1px solid #1a1a1a',
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        maxWidth: '100%',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        userSelect: 'none',
      }}
    >
      {/* Left Gradient Mask for smooth entry */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '32px',
          background: 'linear-gradient(to right, #0a0a0a 20%, transparent)',
          pointerEvents: 'none',
          zIndex: 4,
        }}
      />

      {/* Marquee Track: Contains two identical halves for a 100% seamless, mathematically infinite loop */}
      <div
        className="marquee-track"
        style={{
          animationPlayState: isPaused ? 'paused' : 'running',
          display: 'inline-flex',
          whiteSpace: 'nowrap',
          willChange: 'transform',
        }}
      >
        <div
          className="marquee-group"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2.5rem',
            paddingRight: '2.5rem',
            fontSize: '0.6875rem',
            fontWeight: 800,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          <span>{text}</span>
          <span style={{ color: '#b51224', fontWeight: 900 }}>•</span>
        </div>

        <div
          className="marquee-group"
          aria-hidden="true"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2.5rem',
            paddingRight: '2.5rem',
            fontSize: '0.6875rem',
            fontWeight: 800,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          <span>{text}</span>
          <span style={{ color: '#b51224', fontWeight: 900 }}>•</span>
        </div>
      </div>

      {/* Right Gradient Mask */}
      <div
        style={{
          position: 'absolute',
          right: '34px',
          top: 0,
          bottom: 0,
          width: '32px',
          background: 'linear-gradient(to left, #0a0a0a 20%, transparent)',
          pointerEvents: 'none',
          zIndex: 4,
        }}
      />

      {/* Pause/Play Toggle */}
      <button
        onClick={() => setIsPaused(!isPaused)}
        style={{
          position: 'absolute',
          right: '6px',
          background: 'rgba(10, 10, 10, 0.92)',
          border: '1px solid #282828',
          color: '#888888',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4px',
          borderRadius: '2px',
          zIndex: 5,
          transition: 'color 0.15s ease, border-color 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#ffffff';
          e.currentTarget.style.borderColor = '#444444';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#888888';
          e.currentTarget.style.borderColor = '#282828';
        }}
        title={isPaused ? 'Resume ticker' : 'Pause ticker'}
        aria-label="Pause ticker animation"
      >
        {isPaused ? <Play size={11} /> : <Pause size={11} />}
      </button>
    </aside>
  );
};
