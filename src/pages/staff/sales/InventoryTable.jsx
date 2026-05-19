import React, { useState } from 'react';
import StockBadge from './StockBadge';

function InventoryTable({ parts = [], onAddItem }) {
  const [query, setQuery] = useState('');
  const filtered = parts.filter(p => p.name?.toLowerCase().includes(query.toLowerCase()) || p.partNumber?.toLowerCase().includes(query.toLowerCase()));

  const s = {
    input: { width: '100%', background: '#1f2937', border: '1px solid #374151', color: '#fff', padding: '0.6rem 1rem', borderRadius: '6px', marginBottom: '1rem', boxSizing: 'border-box', outline: 'none' },
    container: { overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    th: { color: '#9ca3af', fontSize: '0.75rem', padding: '0.5rem', borderBottom: '1px solid #374151', textTransform: 'uppercase' },
    td: { padding: '0.75rem 0.5rem', borderBottom: '1px solid #1f2937', fontSize: '0.9rem' },
    btn: { background: '#2563eb', color: 'white', border: 'none', padding: '0.35rem 0.75rem', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }
  };

  return (
    <div>
      <input style={s.input} type="text" placeholder="Filter spare parts inventory..." value={query} onChange={e => setQuery(e.target.value)} />
      <div style={s.container}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Part Name</th>
              <th style={s.th}>Status Allocation</th>
              <th style={{ ...s.th, textAlign: 'right' }}>Rate</th>
              <th style={{ ...s.th, textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td style={{ ...s.td, fontWeight: '600' }}>{p.name}</td>
                <td style={s.td}><StockBadge quantity={p.stockQuantity} /></td>
                <td style={{ ...s.td, textAlign: 'right', fontFamily: 'monospace' }}>Rs. {p.price}</td>
                <td style={{ ...s.td, textAlign: 'center' }}>
                  <button style={s.btn} onClick={() => onAddItem(p)} disabled={p.stockQuantity <= 0}>+ Add</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InventoryTable;