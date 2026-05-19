import React from 'react';

function RewardPopup({ milestoneName, bonusPoints, onDismiss }) {
  const s = {
    overlay: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 },
    card: { background: '#111827', border: '2px solid #8b5cf6', padding: '2rem', borderRadius: '16px', textCenter: 'center', width: '360px', textAlign: 'center' },
    badge: { background: 'rgba(16,185,129,0.12)', border: '1px solid #10b981', color: '#10b981', fontWeight: '800', padding: '0.5rem', borderRadius: '6px', fontSize: '0.8rem', margin: '1rem 0 1.5rem 0' },
    btn: { background: '#8b5cf6', color: '#fff', border: 'none', padding: '0.6rem', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', width: '100%' }
  };

  return (
    <div style={s.overlay}>
      <div style={s.card}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎉</div>
        <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff' }}>MILESTONE REACHED</h3>
        <p style={{ color: '#9ca3af', fontSize: '0.9rem', margin: 0 }}>Account bracket updated to <strong>{milestoneName}</strong>.</p>
        <div style={s.badge}>+{bonusPoints} BONUS SYSTEM POINTS CLAIMED</div>
        <button style={s.btn} onClick={onDismiss}>Apply Benefits</button>
      </div>
    </div>
  );
}

export default RewardPopup;