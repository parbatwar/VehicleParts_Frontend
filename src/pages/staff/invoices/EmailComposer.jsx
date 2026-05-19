import React, { useState } from 'react';

function EmailComposer({ invoiceId, customerEmail, onSend, onCancel }) {
  const [subject, setSubject] = useState(`Invoice Statement #INV-${invoiceId}`);
  const [body, setBody] = useState(`Dear Valued Customer,\n\nPlease find attached your structured transaction details.\n\nThank you for choosing GearUp.`);

  const s = {
    box: { background: '#1f2937', padding: '1rem', borderRadius: '8px', marginTop: '1rem' },
    title: { margin: '0 0 1rem 0', fontSize: '0.85rem', color: '#3b82f6', fontWeight: '700' },
    row: { marginBottom: '0.75rem' },
    label: { display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' },
    input: { width: '100%', padding: '0.5rem', backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '4px', color: '#fff', boxSizing: 'border-box' },
    area: { width: '100%', padding: '0.5rem', backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '4px', color: '#fff', boxSizing: 'border-box', resize: 'vertical' },
    actions: { display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' },
    btn: c => ({ padding: '0.4rem 0.8rem', border: 'none', borderRadius: '4px', color: '#fff', backgroundColor: c, fontWeight: '600', cursor: 'pointer' })
  };

  return (
    <div style={s.box}>
      <h5 style={s.title}>SMTP Pipeline Email Notification Dispatcher</h5>
      <div style={s.row}><label style={s.label}>Recipient</label><input style={s.input} type="text" value={customerEmail} disabled /></div>
      <div style={s.row}><label style={s.label}>Subject</label><input style={s.input} type="text" value={subject} onChange={e => setSubject(e.target.value)} /></div>
      <div style={s.row}><label style={s.label}>Message Body</label><textarea style={s.area} rows="4" value={body} onChange={e => setBody(e.target.value)} /></div>
      <div style={s.actions}>
        <button style={s.btn('#10b981')} onClick={() => onSend(subject, body)}>Dispatch Mail</button>
        <button style={s.btn('transparent')} onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

export default EmailComposer;