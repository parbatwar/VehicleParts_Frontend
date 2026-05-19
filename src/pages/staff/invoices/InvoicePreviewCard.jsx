import React from 'react';

function InvoicePreviewCard({ cart = [], customerName }) {
  const total = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);
  
  const s = {
    card: { background: '#1f2937', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #3b82f6', marginBottom: '1.5rem' },
    title: { margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#9ca3af', fontWeight: '700', letterSpacing: '0.05em' },
    target: { margin: '0 0 0.5rem 0', fontSize: '0.9rem' },
    footer: { display: 'flex', justifyContent: 'space-between', fontWeight: '700', borderTop: '1px solid #374151', paddingTop: '0.5rem', fontSize: '0.9rem' }
  };

  return (
    <div style={s.card}>
      <p style={s.title}>DRAFT LEDGER MANIFEST</p>
      <p style={s.target}>Target Context: <strong>{customerName || 'No Target Configured'}</strong></p>
      <div style={s.footer}>
        <span>Estimated Summary:</span>
        <span>Rs. {total}</span>
      </div>
    </div>
  );
}

export default InvoicePreviewCard;