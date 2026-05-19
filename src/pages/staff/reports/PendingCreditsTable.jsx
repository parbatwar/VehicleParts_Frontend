import React from 'react';

function PendingCreditsTable({ outstandingBalances = [] }) {
  const s = {
    card: { backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '1.5rem' },
    title: { fontSize: '0.8rem', fontWeight: '700', color: '#9ca3af', margin: '0 0 1.25rem 0', textTransform: 'uppercase' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    th: { color: '#9ca3af', fontSize: '0.7rem', padding: '0.4rem', borderBottom: '1px solid #374151' },
    td: { padding: '0.6rem 0.4rem', borderBottom: '1px solid #1f2937', fontSize: '0.85rem' },
    tag: over => ({ padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '700', backgroundColor: over >= 20 ? 'rgba(220,38,38,0.15)' : 'rgba(217,119,6,0.15)', color: over >= 20 ? '#dc2626' : '#d97706' })
  };

  return (
    <div style={s.card}>
      <h4 style={s.title}>Outstanding Accounts Monitoring</h4>
      {outstandingBalances.length === 0 ? (
        <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>No outstanding breach streams detected.</p>
      ) : (
        <table style={s.table}>
          <thead>
            <tr><th style={s.th}>Client Record</th><th style={{ ...s.th, textAlign: 'right' }}>Balance</th><th style={{ ...s.th, textAlign: 'center' }}>Aging</th></tr>
          </thead>
          <tbody>
            {outstandingBalances.map((b, i) => (
              <tr key={i}>
                <td style={s.td}><strong>{b.name}</strong></td>
                <td style={{ ...s.td, textAlign: 'right', color: '#ef4444', fontFamily: 'monospace' }}>Rs. {b.balance}</td>
                <td style={{ ...s.td, textAlign: 'center' }}><span style={s.tag(b.daysOverdue)}>{b.daysOverdue} Days Late</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PendingCreditsTable;