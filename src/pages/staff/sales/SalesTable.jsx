import React from 'react';
import CartItem from './CartItem';

function SalesTable({ cart = [], onUpdateQty, onRemove }) {
  if (cart.length === 0) {
    return <p style={{ color: '#6b7280', fontSize: '0.9rem', textAlign: 'center', padding: '2rem 0' }}>Operational register waiting for components...</p>;
  }

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '1rem' }}>Current Transaction Manifest</h4>
      {cart.map(item => (
        <CartItem key={item.partId} item={item} onUpdateQty={onUpdateQty} onRemove={onRemove} />
      ))}
    </div>
  );
}

export default SalesTable;