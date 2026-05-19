import React from 'react';

function DiscountProgress({ currentSpent = 0 }) {
  const target = 100000;
  const pct = Math.min((currentSpent / target) * 100, 100);

  const s = {
    box: { backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '1rem' },
    hdr: { display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '700', marginBottom: '0.5rem', color: '#9ca3af' },
    track: { width: '100%', height: '6px', backgroundColor: '#1f2937', borderRadius: '3px', overflow: 'hidden' },
    bar: { height: '100%', backgroundColor: '#3b82f6', width: `${pct}%`, transition: 'width 0.4s' }
  };

  return (
    <div style={s.box}>
      <div style={s.hdr}><span>NEXT AUTO-TIER TIER DISCOUNT DISPATCH</span><span style={{ color: '#3b82f6' }}>{Math.round(pct)}%</span></div>
      <div style={s.track}><div style={s.bar}/></div>
      <p style={{ color: '#6b7280', fontSize: '0.7rem', margin: '0.5rem 0 0 0', lineHeight: 1.4 }}>Accumulate Rs. {Math.max(target - currentSpent, 0)} to trigger a flat 10% dynamic invoice reduction tier adjustment override.</p>
    </div>
  );
}

export default DiscountProgress;