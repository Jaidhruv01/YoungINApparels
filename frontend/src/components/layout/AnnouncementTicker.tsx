import React, { useState } from 'react';
import { Pause, Play } from 'lucide-react';

interface AnnouncementTickerProps {
  text?: string;
}

export const AnnouncementTicker: React.FC<AnnouncementTickerProps> = ({
  text = 'COMPLIMENTARY EXPRESS SHIPPING ON ORDERS OVER ₹5,000 • AUTUMN / WINTER 2026 ARCHIVE AVAILABLE • 10% OFF FIRST ORDER CODE: FIRST10 • HANDCRAFTED IN LIMITED RUNS',
}) => {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div
      style={{
        backgroundColor: '#0a0a0a',
        color: '#ffffff',
        borderBottom: '1px solid #1f1f1f',
        position: 'relative',
        overflow: 'hidden',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        className="marquee-track"
        style={{
          animationPlayState: isPaused ? 'paused' : 'running',
          display: 'flex',
          whiteSpace: 'nowrap',
          gap: '3rem',
          paddingLeft: '1rem',
          fontSize: '0.6875rem',
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
        }}
      >
        <span>{text}</span>
        <span>•</span>
        <span>{text}</span>
        <span>•</span>
        <span>{text}</span>
      </div>

      <button
        onClick={() => setIsPaused(!isPaused)}
        style={{
          position: 'absolute',
          right: '12px',
          background: 'none',
          border: 'none',
          color: '#888888',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          padding: '4px',
        }}
        title={isPaused ? 'Resume ticker' : 'Pause ticker'}
        aria-label="Pause ticker animation"
      >
        {isPaused ? <Play size={12} /> : <Pause size={12} />}
      </button>
    </div>
  );
};
