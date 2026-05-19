import React from 'react';

function CustomerAnalytics({ metrics }) {
  const m = metrics || { activeReg: 0, recurringRate: '0%', newThisMonth: 0 };

  const s = {
    card: { backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '1.5rem' },
    title: { fontSize: '0.8rem', fontWeight: '700', letterSpacing: '0.05em', color: '#9ca3af', margin: '0 0 1.25rem 0', textTransform: 'uppercase' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' },
    box: { backgroundColor: '#1f2937', padding: '1rem', borderRadius: '8px', border: '1px solid #2d3748' },
    label: { fontSize: '0.65rem', fontWeight: '700', color: '#9ca3af', letterSpacing: '0.05em' },
    num: color => ({ fontSize: '1.5rem', fontWeight: '800', color: color || '#fff', margin: '0.35rem 0 0 0' })
  };

  return (
    <div style={s.card}>
      <h4 style={s.title}>Client Demographic Metric Segments</h4>
      <div style={s.grid}>
        <div style={s.box}><span style={s.label}>TOTAL ACCOUNT MATRIX</span><p style={s.num('#fff')}>{m.activeReg}</p></div>
        <div style={s.box}><span style={s.label}>RECURRING CUSTOMER RATE</span><p style={s.num('#3b82f6')}>{m.recurringRate}</p></div>
        <div style={s.box}><span style={s.label}>NEW ENROLLMENTS</span><p style={s.num('#10b981')}>+{m.newThisMonth}</p></div>
      </div>
    </div>
  );
}

export default CustomerAnalytics;