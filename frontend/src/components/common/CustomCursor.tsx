import React, { useEffect, useState, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const [isFinePointer, setIsFinePointer] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const targetPos = useRef({ x: -100, y: -100 });
  const currentPos = useRef({ x: -100, y: -100 });
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    // Only mount on desktop with fine mouse pointer
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsFinePointer(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsFinePointer(e.matches);
    };
    mediaQuery.addEventListener('change', handleMediaChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  useEffect(() => {
    if (!isFinePointer) return;

    // Mouse movement handler
    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      // Fast sync for the center precision dot
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Smooth Lerp Animation Loop: currentX += (targetX - currentX) * 0.15
    const render = () => {
      const lerpFactor = 0.15;
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * lerpFactor;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * lerpFactor;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0)`;
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    // Hover inspection for actionable elements and drag zones
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Check if over horizontal drag carousels
      const isDragZone = !!target.closest(
        '.touch-snap-x, .bundle-scroll-track, .story-circles-track, [data-drag="true"]'
      );
      setIsDragging(isDragZone);

      if (isDragZone) {
        setIsHovering(false);
        return;
      }

      // Check if over actionable elements (images, hotspot pins, CTA buttons)
      const isActionable = !!target.closest(
        'button, a, input, select, textarea, .hotspot-pin, .product-card, .btn-primary, .btn-crimson, .btn-secondary, [role="button"]'
      );
      setIsHovering(isActionable);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [isFinePointer, isVisible]);

  if (!isFinePointer) return null;

  return (
    <div
      className="custom-cursor-container"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 999999,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 200ms ease',
      }}
    >
      {/* Precision Center Dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '5px',
          height: '5px',
          backgroundColor: '#ffffff',
          borderRadius: '50%',
          marginTop: '-2.5px',
          marginLeft: '-2.5px',
          pointerEvents: 'none',
          willChange: 'transform',
          transition: isDragging ? 'opacity 150ms ease' : 'none',
          opacity: isDragging ? 0 : 1,
        }}
      />

      {/* Trailing Circular Ring with Smooth Lerp Positioning */}
      <div
        ref={ringRef}
        className={`custom-cursor-ring ${isHovering ? 'is-hovering' : ''} ${isDragging ? 'is-dragging' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isDragging ? '54px' : isHovering ? '64px' : '32px',
          height: isDragging ? '54px' : isHovering ? '64px' : '32px',
          marginTop: isDragging ? '-27px' : isHovering ? '-32px' : '-16px',
          marginLeft: isDragging ? '-27px' : isHovering ? '-32px' : '-16px',
          borderRadius: '50%',
          border: isDragging
            ? 'none'
            : isHovering
            ? '1px solid rgba(255, 255, 255, 0.95)'
            : '1px solid rgba(255, 255, 255, 0.65)',
          backgroundColor: isDragging
            ? 'var(--color-campaign-red)'
            : isHovering
            ? 'rgba(255, 255, 255, 0.95)'
            : 'transparent',
          mixBlendMode: isDragging ? 'normal' : isHovering ? 'difference' : 'difference',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          willChange: 'transform, width, height, background-color',
          transition: 'width 250ms cubic-bezier(0.16, 1, 0.3, 1), height 250ms cubic-bezier(0.16, 1, 0.3, 1), margin 250ms cubic-bezier(0.16, 1, 0.3, 1), background-color 200ms ease, border-color 200ms ease, transform 0.05s linear',
          boxShadow: isDragging ? '0 0 20px rgba(181, 18, 36, 0.6)' : 'none',
        }}
      >
        {/* Drag Label: Morphs into solid dot containing text "DRAG" */}
        {isDragging && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.625rem',
              fontWeight: 900,
              letterSpacing: '0.12em',
              color: '#ffffff',
              textTransform: 'uppercase',
              animation: 'dragScaleBump 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
              userSelect: 'none',
            }}
          >
            DRAG
          </span>
        )}
      </div>

      <style>{`
        @keyframes dragScaleBump {
          0% {
            transform: scale(0.7);
            opacity: 0;
          }
          100% {
            transform: scale(1.0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
