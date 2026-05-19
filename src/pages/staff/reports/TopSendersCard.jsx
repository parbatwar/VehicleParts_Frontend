import React from 'react';

function TopSpendersCard({ spenders = [] }) {
  const s = {
    card: { backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '1.5rem' },
    title: { fontSize: '0.8rem', fontWeight: '700', color: '#9ca3af', margin: '0 0 1.25rem 0', textTransform: 'uppercase' },
    row: { display: 'flex', justifyBetween: 'space-between', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1f2937', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '0.6rem', border: '1px solid #2d3748' },
    rank: { background: 'rgba(59,130,246,0.15)', color: '#3b82f6', width: '26px', height: '26px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.8rem', marginRight: '0.75rem' }
  };

  return (
    <div style={s.card}>
      <h4 style={s.title}>Top Spender Leaderboard</h4>
      {spenders.length === 0 ? (
        <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>No account transaction logs identified.</p>
      ) : (
        spenders.map((user, idx) => (
          <div key={idx} style={s.row}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={s.rank}>#{idx + 1}</div>
              <div><span style={{ color: '#fff', fontWeight: '600', fontSize: '0.9rem' }}>{user.name}</span><br/><span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{user.orders} orders processed</span></div>
            </div>
            <span style={{ color: '#10b981', fontFamily: 'monospace', fontWeight: '700' }}>Rs. {user.total}</span>
          </div>
        ))
      )}
    </div>
  );
}

export default TopSpendersCard;