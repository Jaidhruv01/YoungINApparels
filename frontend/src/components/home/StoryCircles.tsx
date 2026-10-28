import React from 'react';
import { Collection } from '../../types';

interface StoryCirclesProps {
  collections: Collection[];
  onNavigate: (path: string) => void;
}

export const StoryCircles: React.FC<StoryCirclesProps> = ({ collections, onNavigate }) => {
  return (
    <section
      style={{
        paddingTop: '2.5rem',
        paddingBottom: '2.5rem',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #f0efed',
      }}
    >
      <div className="container-custom">
        <div
          style={{
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: 'clamp(1.25rem, 3.5vw, 2.75rem)',
              overflowX: 'auto',
              paddingBottom: '0.75rem',
              paddingLeft: '4px',
              paddingRight: '1rem',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
            className="story-circles-track touch-snap-x"
          >
            {collections.map((coll) => (
              <div
                key={coll.id}
                onClick={() => onNavigate(`/collections/${coll.slug}`)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.65rem',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'transform 0.15s ease',
                }}
                className="story-item"
              >
                <div
                  style={{
                    width: 'clamp(70px, 8.5vw, 92px)',
                    height: 'clamp(70px, 8.5vw, 92px)',
                    borderRadius: '50%',
                    padding: '3px',
                    border: '1.5px solid #0a0a0a',
                    transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease, box-shadow 0.25s ease',
                    backgroundColor: '#ffffff',
                  }}
                  className="story-circle-wrapper"
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      backgroundColor: '#f7f6f4',
                    }}
                  >
                    <img
                      src={coll.image || '/images/product-hoodie.jpg'}
                      alt={coll.title}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease',
                      }}
                    />
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '0.6875rem',
                      fontWeight: 800,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: '#0a0a0a',
                      maxWidth: '105px',
                      lineHeight: 1.25,
                      whiteSpace: 'normal',
                      textAlign: 'center',
                    }}
                  >
                    {coll.title}
                  </span>
                  {coll.badge && (
                    <span
                      style={{
                        display: 'inline-block',
                        fontSize: '0.5625rem',
                        fontWeight: 800,
                        letterSpacing: '0.06em',
                        color: '#b51224',
                        textTransform: 'uppercase',
                      }}
                    >
                      {coll.badge}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .story-circles-track::-webkit-scrollbar {
          display: none;
        }
        .story-item:active .story-circle-wrapper {
          transform: scale(0.94);
        }
        .story-circle-wrapper:hover {
          transform: scale(1.06);
          border-color: #b51224 !important;
          box-shadow: 0 4px 16px rgba(181, 18, 36, 0.25);
        }
      `}</style>
    </section>
  );
};
