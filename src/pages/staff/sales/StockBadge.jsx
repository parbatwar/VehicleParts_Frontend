import React from 'react';

function StockBadge({ quantity }) {
  const styles = {
    badge: {
      padding: '0.2rem 0.5rem',
      borderRadius: '4px',
      fontSize: '0.75rem',
      fontWeight: '700',
      textTransform: 'uppercase',
      display: 'inline-block',
      backgroundColor: quantity <= 0 ? 'rgba(220, 38, 38, 0.15)' : quantity <= 5 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
      color: quantity <= 0 ? '#dc2626' : quantity <= 5 ? '#f59e0b' : '#10b981'
    }
  };

  const text = quantity <= 0 ? 'Out of Stock' : quantity <= 5 ? `Low: ${quantity} Left` : `${quantity} Available`;

  return <span style={styles.badge}>{text}</span>;
}

export default StockBadge;