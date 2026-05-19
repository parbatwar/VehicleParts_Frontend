import React from 'react';

function InvoiceCard({ invoice, customer }) {
  if (!invoice) return null;

  const s = {
    sheet: { padding: '2.5rem', background: '#fff', color: '#000', fontFamily: 'sans-serif' },
    hdr: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
    meta: { textAlign: 'right', fontSize: '0.9rem' },
    divider: { border: 0, borderTop: '1px solid #e5e7eb', margin: '1.5rem 0' },
    table: { width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0' },
    th: { background: '#f3f4f6', padding: '0.6rem', borderBottom: '2px solid #e5e7eb', textTransform: 'uppercase', fontSize: '0.8rem', textAlign: 'left' },
    td: { padding: '0.75rem 0.6rem', borderBottom: '1px solid #e5e7eb', fontSize: '0.9rem' },
    totalWrapper: { display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', fontWeight: '800', fontSize: '1.1rem' },
    totalBox: { borderTop: '3px double #000', paddingTop: '0.5rem', width: '260px', display: 'flex', justifyBetween: 'space-between' }
  };

  return (
    <div style={s.sheet}>
      <div style={s.hdr}>
        <div>
          <h2 style={{ margin: '0 0 0.25rem 0' }}>GEARUP SYSTEMS LOGISTICS</h2>
          <p style={{ margin: 0, color: '#4b5563', fontSize: '0.85rem' }}>Premium Technical Configurations Hub</p>
        </div>
        <div style={s.meta}>
          <h3 style={{ margin: '0 0 0.5rem 0' }}>REVENUE STATEMENT RECEIPT</h3>
          <p style={{ margin: '0 0 0.2rem 0' }}><strong>Invoice Code Reference:</strong> #INV-{invoice.id}</p>
          <p style={{ margin: 0 }}><strong>Date Generated:</strong> {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <hr style={s.divider} />

      <div style={{ fontSize: '0.9rem' }}>
        <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', fontWeight: '700', color: '#4b5563' }}>BILLING ACCOUNT HOLDER</p>
        <h4 style={{ margin: '0 0 0.4rem 0', fontSize: '1.05rem' }}>{customer?.fullName || 'Standard Walk-In Profile Account'}</h4>
        <p style={{ margin: '0 0 0.2rem 0' }}>Contact Number Terminal: {customer?.phone || 'N/A'}</p>
        <p style={{ margin: 0 }}>Vehicle Identification: {customer?.licensePlate || 'N/A'}</p>
      </div>

      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>Line Allocation Item</th>
            <th style={{ ...s.th, textAlign: 'right' }}>Unit Rate</th>
            <th style={{ ...s.th, textAlign: 'center' }}>Qty</th>
            <th style={{ ...s.th, textAlign: 'right' }}>Net Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items?.map((item, index) => (
            <tr key={index}>
              <td style={s.td}>{item.partName || `Component Registry Code: ${item.partId}`}</td>
              <td style={{ ...s.td, textAlign: 'right' }}>Rs. {item.unitPrice || item.price}</td>
              <td style={{ ...s.td, textAlign: 'center' }}>{item.quantity}</td>
              <td style={{ ...s.td, textAlign: 'right' }}>Rs. {(item.unitPrice || item.price) * item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={s.totalWrapper}>
        <div style={s.totalBox}>
          <span>Grand Total Settled Value:</span>
          <span style={{ marginLeft: 'auto' }}>Rs. {invoice.totalAmount || invoice.grossTotal}</span>
        </div>
      </div>
    </div>
  );
}

export default InvoiceCard;