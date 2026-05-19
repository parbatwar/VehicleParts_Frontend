import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import './SalesRegistry.css';

import InventoryTable from './sales/InventoryTable';
import SalesTable from './sales/SalesTable';
import InvoiceSummary from './sales/InvoiceSummary';
import InvoicePreviewCard from './invoices/InvoicePreviewCard';
import InvoiceModal from './invoices/InvoiceModal';
import InvoiceCard from './invoices/InvoiceCard';

function SalesRegistry() {
  const navigate = useNavigate();
  const [parts, setParts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [cart, setCart] = useState([]);
  const [activeInvoice, setActiveInvoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const currentSelectedCustomer = customers.find(c => c.id === parseInt(selectedCustomerId, 10));

  useEffect(() => { syncRegistryCatalogs(); }, []);

  const syncRegistryCatalogs = async () => {
    try {
      const [pRes, cRes] = await Promise.all([api.get('/part'), api.get('/customer')]);
      setParts(pRes.data);
      setCustomers(cRes.data);
    } catch (err) {
      setErrorMessage('Failed to connect to backend endpoints.');
    }
  };

  const handleAddToCart = (part) => {
    setErrorMessage('');
    const idx = cart.findIndex(i => i.partId === part.id);
    if (idx > -1) {
      const working = [...cart];
      if (working[idx].quantity >= part.stockQuantity) {
        setErrorMessage(`Warehouse safety boundary reached: ${part.stockQuantity} items max.`);
        return;
      }
      working[idx].quantity += 1;
      setCart(working);
    } else {
      setCart([...cart, { partId: part.id, name: part.name, price: part.price, quantity: 1, maxAvailable: part.stockQuantity }]);
    }
  };

  const handleUpdateQuantity = (partId, val) => {
    const qty = parseInt(val, 10) || 0;
    const item = cart.find(i => i.partId === partId);
    if (qty > item.maxAvailable) {
      setErrorMessage(`Volume requests exceed available warehouse stock allocation of ${item.maxAvailable}.`);
      return;
    }
    if (qty <= 0) {
      setCart(cart.filter(i => i.partId !== partId));
    } else {
      setCart(cart.map(i => i.partId === partId ? { ...i, quantity: qty } : i));
      setErrorMessage('');
    }
  };

  const handleCheckoutProcess = async (method) => {
    if (!selectedCustomerId || cart.length === 0) {
      setErrorMessage('Please bind a client profile and verify checkout products.');
      return;
    }
    setIsSubmitting(true);
    const payload = {
      customerId: parseInt(selectedCustomerId, 10),
      paymentMethod: method,
      items: cart.map(i => ({ partId: i.partId, quantity: i.quantity }))
    };

    try {
      const response = await api.post('/sales', payload);
      let invoiceData = response.data;

      if (method === 'Khalti') {
        const kRes = await api.post('/sales/payments/khalti/initiate', {
          invoiceId: invoiceData.id,
          returnUrl: window.location.origin + "/staff/dashboard"
        });
        if (kRes.data?.payment_url) invoiceData.paymentUrl = kRes.data.payment_url;
      }

      setActiveInvoice(invoiceData);
      setCart([]);
      setShowModal(true);
    } catch (err) {
      setErrorMessage('Transaction processing pipeline aborted.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="sales-registry-view">
      <div className="no-print">
        <button style={{ padding: '0.5rem 1rem', background: '#1f2937', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '1.5rem' }} onClick={() => navigate('/staff/dashboard')}>&larr; Menu</button>
        {errorMessage && <div className="registry-error-banner">{errorMessage}</div>}
        
        <div className="registry-split-grid">
          <div>
            <div className="registry-card">
              <h4 className="registry-panel-title">1. Map Active Client Context</h4>
              <select className="registry-dropdown-element" value={selectedCustomerId} onChange={e => setSelectedCustomerId(e.target.value)}>
                <option value="">-- Choose Profile Target --</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.fullName} [{c.phone}]</option>)}
              </select>
            </div>
            <div className="registry-card">
              <h4 className="registry-panel-title">2. Spare Parts Catalog Matrix</h4>
              <InventoryTable parts={parts} onAddItem={handleAddToCart} />
            </div>
          </div>

          <div>
            <div className="registry-card">
              <SalesTable cart={cart} onUpdateQty={handleUpdateQuantity} onRemove={id => setCart(cart.filter(i => i.partId !== id))} />
              <InvoicePreviewCard cart={cart} customerName={currentSelectedCustomer?.fullName} />
              <InvoiceSummary cart={cart} onCheckout={handleCheckoutProcess} isSubmitting={isSubmitting} />
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <InvoiceModal invoice={activeInvoice} customer={currentSelectedCustomer} onClose={() => setShowModal(false)} onPrint={() => window.print()} />
      )}

      <div className="print-view" style={{ display: 'none' }}>
        <InvoiceCard invoice={activeInvoice} customer={currentSelectedCustomer} />
      </div>
    </div>
  );
}

export default SalesRegistry;