import React from 'react';

function InvoiceSummary({ cart = [], onCheckout, isSubmitting }) {
  const sum = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);
  
  const s = {
    container: { borderTop: '2px dashed #374151', paddingTop: '1rem', marginTop: '1.5rem' },
    row: { display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: '800', marginBottom: '1.5rem' },
    stack: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    btn: color => ({ width: '100%', padding: '0.8rem', borderRadius: '6px', border: 'none', color: '#fff', fontWeight: '700', cursor: isSubmitting || !sum ? 'not-allowed' : 'pointer', backgroundColor: color, opacity: isSubmitting || !sum ? 0.5 : 1 })
  };

  return (
    <div style={s.container}>
      <div style={s.row}>
        <span>NET PAYABLE DUE:</span>
        <span style={{ color: '#10b981' }}>Rs. {sum}</span>
      </div>
      <div style={s.stack}>
        <button style={s.btn('#10b981')} onClick={() => onCheckout('Cash')} disabled={isSubmitting || !sum}>LIQUID CASH</button>
        <button style={s.btn('#d97706')} onClick={() => onCheckout('Credit')} disabled={isSubmitting || !sum}>CREDIT LEDGER</button>
        <button style={s.btn('#5c2d91')} onClick={() => onCheckout('Khalti')} disabled={isSubmitting || !sum}>KHALTI API WALLET</button>
      </div>
    </div>
  );
}

export default InvoiceSummary;