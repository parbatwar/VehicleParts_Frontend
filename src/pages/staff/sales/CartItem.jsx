import React from 'react';

function CartItem({ item, onUpdateQty, onRemove }) {
  const s = {
    row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1f2937', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '0.5rem' },
    meta: { display: 'flex', flexDirection: 'column' },
    name: { fontWeight: '600', color: '#fff' },
    price: { fontSize: '0.8rem', color: '#9ca3af' },
    controls: { display: 'flex', alignItems: 'center', gap: '1rem' },
    qty: { width: '55px', background: '#111827', border: '1px solid #374151', color: '#fff', textAlign: 'center', borderRadius: '4px', padding: '0.25rem' },
    total: { fontFamily: 'monospace', color: '#10b981', fontWeight: '600' },
    del: { background: 'transparent', border: 'none', color: '#ef4444', fontSize: '1.2rem', cursor: 'pointer' }
  };

  return (
    <div style={s.row}>
      <div style={s.meta}>
        <span style={s.name}>{item.name}</span>
        <span style={s.price}>Rs. {item.price} each</span>
      </div>
      <div style={s.controls}>
        <input style={s.qty} type="number" value={item.quantity} min="1" onChange={e => onUpdateQty(item.partId, e.target.value)} />
        <span style={s.total}>Rs. {item.price * item.quantity}</span>
        <button style={s.del} onClick={() => onRemove(item.partId)}>&times;</button>
      </div>
    </div>
  );
}

export default CartItem;