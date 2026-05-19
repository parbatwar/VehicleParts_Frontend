import React from 'react';

function MembershipBadge({ level = 'Bronze' }) {
  const normalized = level.toLowerCase();
  
  const badgeStyle = {
    fontSize: '0.65rem',
    fontWeight: '800',
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
    display: 'inline-block',
    border: '1px solid',
    backgroundColor: normalized === 'vip' ? 'rgba(168,85,247,0.15)' : normalized === 'gold' ? 'rgba(234,179,8,0.15)' : 'rgba(148,163,184,0.15)',
    color: normalized === 'vip' ? '#c084fc' : normalized === 'gold' ? '#eab308' : '#cbd5e1',
    borderColor: normalized === 'vip' ? '#a855f7' : normalized === 'gold' ? '#ca8a04' : '#94a3b8'
  };

  return <span style={badgeStyle}>{level.toUpperCase()} MEMBER</span>;
}

export default MembershipBadge;