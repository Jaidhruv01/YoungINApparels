import React, { useState, useEffect } from 'react';
import { X, Ruler, CheckCircle, Info } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose, category }) => {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');
  
  // Determine initial active category tab
  const getInitialTab = (): 'compressions' | 'joggers' | 'tanks' => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('bottom') || cat.includes('jogger') || cat.includes('lower') || cat.includes('pant')) {
      return 'joggers';
    }
    if (cat.includes('tank') || cat.includes('vest') || cat.includes('ribbed')) {
      return 'tanks';
    }
    return 'compressions';
  };

  const [activeTab, setActiveTab] = useState<'compressions' | 'joggers' | 'tanks'>('compressions');

  useEffect(() => {
    if (isOpen) {
      setActiveTab(getInitialTab());
    }
  }, [isOpen, category]);

  if (!isOpen) return null;

  // 1. Compression Series Measurements
  const compressionData = [
    { size: 'S', chestIn: '36 - 38', chestCm: '91 - 97', lengthIn: '27.0', lengthCm: '68.5', shoulderIn: '17.5', shoulderCm: '44.5', weightKg: '60 - 72 kg' },
    { size: 'M', chestIn: '38 - 41', chestCm: '97 - 104', lengthIn: '28.0', lengthCm: '71.0', shoulderIn: '18.5', shoulderCm: '47.0', weightKg: '72 - 84 kg' },
    { size: 'L', chestIn: '41 - 44', chestCm: '104 - 112', lengthIn: '29.0', lengthCm: '73.5', shoulderIn: '19.5', shoulderCm: '49.5', weightKg: '84 - 95 kg' },
    { size: 'XL', chestIn: '44 - 47', chestCm: '112 - 120', lengthIn: '30.0', lengthCm: '76.0', shoulderIn: '20.5', shoulderCm: '52.0', weightKg: '95 - 110 kg' },
  ];

  // 2. Heavyweight & Training Joggers Measurements (350GSM / 250GSM)
  const joggerData = [
    { size: 'S', waistIn: '28 - 31', waistCm: '71 - 79', hipIn: '38 - 40', hipCm: '96 - 102', inseamIn: '29.0', inseamCm: '73.5', outseamIn: '39.0', outseamCm: '99.0' },
    { size: 'M', waistIn: '31 - 34', waistCm: '79 - 86', hipIn: '40 - 43', hipCm: '102 - 109', inseamIn: '29.5', inseamCm: '75.0', outseamIn: '40.0', outseamCm: '101.5' },
    { size: 'L', waistIn: '34 - 37', waistCm: '86 - 94', hipIn: '43 - 46', hipCm: '109 - 117', inseamIn: '30.0', inseamCm: '76.0', outseamIn: '41.0', outseamCm: '104.0' },
    { size: 'XL', waistIn: '37 - 41', waistCm: '94 - 104', hipIn: '46 - 50', hipCm: '117 - 127', inseamIn: '30.5', inseamCm: '77.5', outseamIn: '42.0', outseamCm: '106.5' },
  ];

  // 3. Tanks & Ribbed Vests Measurements
  const tankData = [
    { size: 'S', chestIn: '36 - 39', chestCm: '91 - 99', armholeIn: '11.5', armholeCm: '29.0', lengthIn: '27.5', lengthCm: '70.0' },
    { size: 'M', chestIn: '39 - 42', chestCm: '99 - 107', armholeIn: '12.0', armholeCm: '30.5', lengthIn: '28.5', lengthCm: '72.5' },
    { size: 'L', chestIn: '42 - 45', chestCm: '107 - 114', armholeIn: '12.5', armholeCm: '32.0', lengthIn: '29.5', lengthCm: '75.0' },
    { size: 'XL', chestIn: '45 - 48', chestCm: '114 - 122', armholeIn: '13.0', armholeCm: '33.0', lengthIn: '30.5', lengthCm: '77.5' },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(10, 10, 10, 0.82)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          color: '#0a0a0a',
          maxWidth: '740px',
          width: '100%',
          padding: 'clamp(1.25rem, 4vw, 2.25rem)',
          boxShadow: '0 30px 60px rgba(0, 0, 0, 0.4)',
          maxHeight: '92vh',
          overflowY: 'auto',
          position: 'relative',
          border: '1px solid #1a1a1a',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b51224', marginBottom: '4px' }}>
              <Ruler size={17} />
              <span className="eyebrow" style={{ fontSize: '0.6875rem', letterSpacing: '0.14em' }}>
                YOUNGIN ATHLETE FIT SYSTEM
              </span>
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              PHYSIQUE-ENGINEERED SIZING GUIDE
            </h3>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#0a0a0a',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '2px',
              transition: 'background-color 0.15s ease',
            }}
            aria-label="Close size guide"
          >
            <X size={22} />
          </button>
        </div>

        {/* Category Tabs & Unit Switcher */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '0.75rem',
            borderBottom: '1px solid #e7e5e3',
            paddingBottom: '0.75rem',
            marginBottom: '1.25rem',
          }}
        >
          {/* Silhouettes */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { id: 'compressions', label: 'COMPRESSIONS' },
              { id: 'joggers', label: 'JOGGERS (350/250GSM)' },
              { id: 'tanks', label: 'TANKS & VESTS' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  background: activeTab === tab.id ? '#0a0a0a' : '#f4f3f0',
                  color: activeTab === tab.id ? '#ffffff' : '#444444',
                  border: 'none',
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  cursor: 'pointer',
                  borderRadius: '2px',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Inches / CM Toggle */}
          <div style={{ display: 'flex', border: '1px solid #d4d2cf', borderRadius: '2px', overflow: 'hidden' }}>
            <button
              onClick={() => setUnit('in')}
              style={{
                background: unit === 'in' ? '#b51224' : '#ffffff',
                color: unit === 'in' ? '#ffffff' : '#0a0a0a',
                border: 'none',
                padding: '5px 12px',
                fontSize: '0.6875rem',
                fontWeight: 800,
                cursor: 'pointer',
                letterSpacing: '0.04em',
              }}
            >
              INCHES (IN)
            </button>
            <button
              onClick={() => setUnit('cm')}
              style={{
                background: unit === 'cm' ? '#b51224' : '#ffffff',
                color: unit === 'cm' ? '#ffffff' : '#0a0a0a',
                border: 'none',
                padding: '5px 12px',
                fontSize: '0.6875rem',
                fontWeight: 800,
                cursor: 'pointer',
                letterSpacing: '0.04em',
              }}
            >
              METRIC (CM)
            </button>
          </div>
        </div>

        {/* 1. COMPRESSION MATRIX */}
        {activeTab === 'compressions' && (
          <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #0a0a0a', backgroundColor: '#faf9f8' }}>
                  <th style={{ padding: '8px 10px', fontWeight: 800 }}>SIZE</th>
                  <th style={{ padding: '8px 10px', fontWeight: 800 }}>CHEST (CIRCUMFERENCE)</th>
                  <th style={{ padding: '8px 10px', fontWeight: 800 }}>TORSO LENGTH</th>
                  <th style={{ padding: '8px 10px', fontWeight: 800 }}>SHOULDER WIDTH</th>
                  <th style={{ padding: '8px 10px', fontWeight: 800, color: '#b51224' }}>RECOMMENDED WEIGHT</th>
                </tr>
              </thead>
              <tbody>
                {compressionData.map((m, idx) => (
                  <tr
                    key={m.size}
                    style={{
                      borderBottom: '1px solid #e7e5e3',
                      backgroundColor: idx % 2 === 0 ? '#ffffff' : '#faf9f8',
                    }}
                  >
                    <td style={{ padding: '10px 10px', fontWeight: 900, color: '#0a0a0a' }}>{m.size}</td>
                    <td style={{ padding: '10px 10px' }}>
                      {unit === 'in' ? `${m.chestIn}"` : `${m.chestCm} cm`}
                    </td>
                    <td style={{ padding: '10px 10px' }}>
                      {unit === 'in' ? `${m.lengthIn}"` : `${m.lengthCm} cm`}
                    </td>
                    <td style={{ padding: '10px 10px' }}>
                      {unit === 'in' ? `${m.shoulderIn}"` : `${m.shoulderCm} cm`}
                    </td>
                    <td style={{ padding: '10px 10px', fontWeight: 700, color: '#b51224' }}>
                      {m.weightKg}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 2. JOGGERS MATRIX */}
        {activeTab === 'joggers' && (
          <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #0a0a0a', backgroundColor: '#faf9f8' }}>
                  <th style={{ padding: '8px 10px', fontWeight: 800 }}>SIZE</th>
                  <th style={{ padding: '8px 10px', fontWeight: 800 }}>WAIST (ELASTIC STRETCH)</th>
                  <th style={{ padding: '8px 10px', fontWeight: 800 }}>HIP / GLUTES</th>
                  <th style={{ padding: '8px 10px', fontWeight: 800 }}>INSEAM LENGTH</th>
                  <th style={{ padding: '8px 10px', fontWeight: 800 }}>OUTSEAM (TOTAL LENGTH)</th>
                </tr>
              </thead>
              <tbody>
                {joggerData.map((m, idx) => (
                  <tr
                    key={m.size}
                    style={{
                      borderBottom: '1px solid #e7e5e3',
                      backgroundColor: idx % 2 === 0 ? '#ffffff' : '#faf9f8',
                    }}
                  >
                    <td style={{ padding: '10px 10px', fontWeight: 900, color: '#0a0a0a' }}>{m.size}</td>
                    <td style={{ padding: '10px 10px' }}>
                      {unit === 'in' ? `${m.waistIn}"` : `${m.waistCm} cm`}
                    </td>
                    <td style={{ padding: '10px 10px' }}>
                      {unit === 'in' ? `${m.hipIn}"` : `${m.hipCm} cm`}
                    </td>
                    <td style={{ padding: '10px 10px' }}>
                      {unit === 'in' ? `${m.inseamIn}"` : `${m.inseamCm} cm`}
                    </td>
                    <td style={{ padding: '10px 10px' }}>
                      {unit === 'in' ? `${m.outseamIn}"` : `${m.outseamCm} cm`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. TANKS & VESTS MATRIX */}
        {activeTab === 'tanks' && (
          <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #0a0a0a', backgroundColor: '#faf9f8' }}>
                  <th style={{ padding: '8px 10px', fontWeight: 800 }}>SIZE</th>
                  <th style={{ padding: '8px 10px', fontWeight: 800 }}>CHEST (FULL CIRCUMFERENCE)</th>
                  <th style={{ padding: '8px 10px', fontWeight: 800 }}>ARMHOLE DROP DEPTH</th>
                  <th style={{ padding: '8px 10px', fontWeight: 800 }}>CENTER BACK LENGTH</th>
                </tr>
              </thead>
              <tbody>
                {tankData.map((m, idx) => (
                  <tr
                    key={m.size}
                    style={{
                      borderBottom: '1px solid #e7e5e3',
                      backgroundColor: idx % 2 === 0 ? '#ffffff' : '#faf9f8',
                    }}
                  >
                    <td style={{ padding: '10px 10px', fontWeight: 900, color: '#0a0a0a' }}>{m.size}</td>
                    <td style={{ padding: '10px 10px' }}>
                      {unit === 'in' ? `${m.chestIn}"` : `${m.chestCm} cm`}
                    </td>
                    <td style={{ padding: '10px 10px' }}>
                      {unit === 'in' ? `${m.armholeIn}"` : `${m.armholeCm} cm`}
                    </td>
                    <td style={{ padding: '10px 10px' }}>
                      {unit === 'in' ? `${m.lengthIn}"` : `${m.lengthCm} cm`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Athletic Fit Advisory Callout */}
        <div style={{ backgroundColor: '#f9f9f8', border: '1px solid #e5e4e0', borderLeft: '4px solid #b51224', padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <Info size={15} color="#b51224" />
            <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#0a0a0a' }}>
              HOW TO CHOOSE YOUR EXACT TRAINING FIT
            </h4>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#555555', lineHeight: 1.6, margin: 0 }}>
            {activeTab === 'compressions' &&
              'YoungIN Compression gear is designed with high-tensile 4-way stretch poly-nylon. For a skin-tight muscle pump feel with locked-in recovery, order your true size. For a more relaxed athletic fit during heavy barbell lifting, choose one size up.'}
            {activeTab === 'joggers' &&
              'Our 350GSM and 250GSM joggers are cut with extra room through the quads and glutes to avoid restriction on deep squats and deadlifts, tapering into a ribbed ankle cuff. The elastic waist provides 3–4 inches of comfortable expansion.'}
            {activeTab === 'tanks' &&
              'Tanks and Ribbed Vests feature raw-cut deep armholes down to mid-rib, eliminating lat friction during heavy pull days. 100% breathable combed compact cotton holds its structural form through high-volume training.'}
          </p>
        </div>

        {/* Indian Doorstep Exchange Guarantee */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', fontSize: '0.6875rem', color: '#666666', borderTop: '1px solid #f0efed', paddingTop: '1rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle size={14} color="#10b981" />
            <span><strong>7-Day Doorstep Size Swap Guarantee:</strong> Free reverse pickup across Pan-India pin codes.</span>
          </span>
          <span style={{ color: '#b51224', fontWeight: 800 }}>
            WhatsApp Sizing Support: +91 98201 54821
          </span>
        </div>
      </div>
    </div>
  );
};
