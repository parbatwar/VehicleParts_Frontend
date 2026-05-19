import React, { useState } from 'react';
import EmailComposer from './EmailComposer';
import api from '../../../api/axios';

function InvoiceModal({ invoice, customer, onClose, onPrint }) {
  if (!invoice) return null;
  const [showComposer, setShowComposer] = useState(false);

  const s = {
    overlay: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    card: { backgroundColor: '#111827', border: '1px solid #1f2937', padding: '2rem', borderRadius: '12px', width: '460px', color: '#fff', boxSizing: 'border-box' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1f2937', paddingBottom: '0.5rem', marginBottom: '1rem' },
    title: { margin: 0, fontSize: '1.2rem', color: '#10b981' },
    details: { background: '#1f2937', padding: '1rem', borderRadius: '6px', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem' },
    footer: { display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' },
    btn: c => ({ padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: '600', backgroundColor: c, color: '#fff' })
  };

  const handleSendEmail = async (subject, body) => {
    try {
      await api.post(`/sales/${invoice.id}/send-invoice`, { subject, body });
      alert('Email statement dispatched successfully.');
      setShowComposer(false);
    } catch {
      alert('Failed to route network email.');
    }
  };

  return (
    <div style={s.overlay}>
      <div style={s.card}>
        <div style={s.header}>
          <h3 style={s.title}>TRANSACTION REGISTERED</h3>
          <button style={{ background: 'transparent', border: 'none', color: '#9ca3af', fontSize: '1.2rem', cursor: 'pointer' }} onClick={onClose}>&times;</button>
        </div>
        <div style={s.details}>
          <p style={{ margin: '0 0 0.5rem 0' }}><strong>Invoice Reference:</strong> #INV-{invoice.id}</p>
          <p style={{ margin: '0 0 0.5rem 0' }}><strong>Account Target:</strong> {customer?.fullName || 'Walk-In Customer'}</p>
          <p style={{ margin: '0 0 0.5rem 0' }}><strong>Settled Value:</strong> Rs. {invoice.totalAmount || invoice.grossTotal}</p>
          <p style={{ margin: 0 }}><strong>Method:</strong> {invoice.paymentMethod}</p>
        </div>

        <div style={s.footer}>
          {invoice.paymentMethod === 'Khalti' && !invoice.isPaid ? (
            <button style={s.btn('#5c2d91')} onClick={() => { if (invoice.paymentUrl) window.location.href = invoice.paymentUrl; }}>Proceed to Khalti Payment</button>
          ) : (
            <>
              <button style={s.btn('#2563eb')} onClick={onPrint}>Print Document</button>
              <button style={s.btn('#4b5563')} onClick={() => setShowComposer(!showComposer)}>Email Statement</button>
            </>
          )}
          <button style={s.btn('transparent')} onClick={onClose}>Dismiss</button>
        </div>

        {showComposer && (
          <EmailComposer invoiceId={invoice.id} customerEmail={customer?.email || ''} onSend={handleSendEmail} onCancel={() => setShowComposer(false)} />
        )}
      </div>
    </div>
  );
}

export default InvoiceModal;