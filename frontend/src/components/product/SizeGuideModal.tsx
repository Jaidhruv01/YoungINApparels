import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose, category }) => {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  if (!isOpen) return null;

  const topMeasurements = [
    { size: 'XS', chestIn: '36 - 38', chestCm: '91 - 96', lengthIn: '26.5', lengthCm: '67', shoulderIn: '18.5', shoulderCm: '47' },
    { size: 'S', chestIn: '38 - 40', chestCm: '96 - 101', lengthIn: '27.5', lengthCm: '70', shoulderIn: '19.5', shoulderCm: '49.5' },
    { size: 'M', chestIn: '40 - 42', chestCm: '101 - 106', lengthIn: '28.5', lengthCm: '72', shoulderIn: '20.5', shoulderCm: '52' },
    { size: 'L', chestIn: '42 - 44', chestCm: '106 - 112', lengthIn: '29.5', lengthCm: '75', shoulderIn: '21.5', shoulderCm: '54.5' },
    { size: 'XL', chestIn: '44 - 47', chestCm: '112 - 119', lengthIn: '30.5', lengthCm: '77', shoulderIn: '22.5', shoulderCm: '57' },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(10, 10, 10, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          color: '#0a0a0a',
          maxWidth: '680px',
          width: '100%',
          padding: '2.5rem',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b51224', marginBottom: '4px' }}>
              <Ruler size={18} />
              <span className="eyebrow">YOUNGIN APPARELS ATELIER</span>
            </div>
            <h3 style={{ fontSize: '1.5rem', textTransform: 'uppercase' }}>
              PROPORTIONAL SIZING MATRIX
            </h3>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#0a0a0a',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Unit Toggle */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', border: '1px solid #e7e5e3' }}>
            <button
              onClick={() => setUnit('in')}
              style={{
                background: unit === 'in' ? '#0a0a0a' : '#ffffff',
                color: unit === 'in' ? '#ffffff' : '#0a0a0a',
                border: 'none',
                padding: '4px 14px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              INCHES (IN)
            </button>
            <button
              onClick={() => setUnit('cm')}
              style={{
                background: unit === 'cm' ? '#0a0a0a' : '#ffffff',
                color: unit === 'cm' ? '#ffffff' : '#0a0a0a',
                border: 'none',
                padding: '4px 14px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              CENTIMETERS (CM)
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #0a0a0a' }}>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 800 }}>SIZE</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 800 }}>CHEST</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 800 }}>BODY LENGTH</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 800 }}>SHOULDER WIDTH</th>
              </tr>
            </thead>
            <tbody>
              {topMeasurements.map((m, idx) => (
                <tr
                  key={m.size}
                  style={{
                    borderBottom: '1px solid #e7e5e3',
                    backgroundColor: idx % 2 === 0 ? '#faf9f8' : '#ffffff',
                  }}
                >
                  <td style={{ padding: '0.75rem 0.5rem', fontWeight: 800 }}>{m.size}</td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    {unit === 'in' ? `${m.chestIn}"` : `${m.chestCm} cm`}
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    {unit === 'in' ? `${m.lengthIn}"` : `${m.lengthCm} cm`}
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    {unit === 'in' ? `${m.shoulderIn}"` : `${m.shoulderCm} cm`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Measuring Guide Notes */}
        <div style={{ backgroundColor: '#f7f6f4', padding: '1.25rem', borderLeft: '3px solid #b51224' }}>
          <h4 style={{ fontSize: '0.8125rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>
            ATELIER SILHOUETTE NOTE
          </h4>
          <p style={{ fontSize: '0.75rem', color: '#666666', lineHeight: 1.6 }}>
            Our garments are engineered with relaxed, architectural proportions and dropped shoulders. If you prefer a tailored, traditional fit rather than our intended runway drape, select one size smaller than your usual sizing.
          </p>
        </div>
      </div>
    </div>
  );
};
