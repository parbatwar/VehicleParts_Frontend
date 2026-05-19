import React from 'react';

function RevenueChart({ data = [] }) {
  const s = {
    card: { backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '1.5rem' },
    title: { fontSize: '0.8rem', fontWeight: '700', color: '#9ca3af', margin: '0 0 1.25rem 0', textTransform: 'uppercase' },
    grid: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '140px', paddingTop: '1rem' },
    col: { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 },
    axis: { width: '28px', height: '110px', backgroundColor: '#1f2937', borderRadius: '4px', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' },
    label: { fontSize: '0.7rem', color: '#6b7280', marginTop: '0.5rem', fontWeight: '600' }
  };

  if (data.length === 0) {
    return (
      <div style={s.card}>
        <h4 style={s.title}>Daily Financial Performance</h4>
        <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>No dynamic revenue tracked in this loop profile cycle.</p>
      </div>
    );
  }

  const max = Math.max(...data.map(d => d.amount), 1);

  return (
    <div style={s.card}>
      <h4 style={s.title}>Daily Financial Performance</h4>
      <div style={s.grid}>
        {data.map((item, index) => {
          const pct = (item.amount / max) * 100;
          return (
            <div key={index} style={s.col}>
              <div style={s.axis}>
                <div style={{ width: '100%', height: `${pct}%`, background: 'linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)', borderRadius: '2px' }} title={`Rs. ${item.amount}`} />
              </div>
              <span style={s.label}>{item.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RevenueChart;