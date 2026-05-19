import React from 'react';

function LoyaltyCard({ customerName, pointsBalance = 0 }) {
  const s = {
    card: { background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', border: '1px solid #4a1d6d', borderRadius: '14px', padding: '1.25rem', height: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' },
    hdr: { display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', fontWeight: '700', color: '#c084fc', letterSpacing: '0.05em' },
    chip: { width: '28px', height: '20px', backgroundColor: '#94a3b8', borderRadius: '3px', opacity: 0.6 },
    name: { fontSize: '1rem', fontWeight: '700', color: '#fff', margin: 0 },
    pts: { fontSize: '1.4rem', fontWeight: '800', color: '#fff', margin: 0, fontFamily: 'monospace' }
  };

  return (
    <div style={s.card}>
      <div style={s.hdr}><span>GEARUP REWARDS ELITE</span><div style={s.chip}/></div>
      <div><p style={{ margin: 0, fontSize: '0.55rem', color: '#9ca3af' }}>MEMBER HOLDER</p><h5 style={s.name}>{customerName || 'Premium Account Profile'}</h5></div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}><div style={{ lineHeight: 1 }}><p style={{ margin: 0, fontSize: '0.55rem', color: '#9ca3af' }}>POINTS BALANCE</p><p style={s.pts}>{pointsBalance} PTS</p></div><div style={{ background: 'rgba(192,132,252,0.2)', color: '#c084fc', padding: '0.2rem 0.5rem', borderRadius: '10px', fontSize: '0.65rem', fontWeight: '800' }}>VIP TIER</div></div>
    </div>
  );
}

export default LoyaltyCard;