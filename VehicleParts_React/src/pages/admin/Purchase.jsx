import { useState, useEffect } from 'react';
import api from '../../api/axios';
import AdminNavbar from '../../components/AdminNavbar';
import ConfirmModal from '../../components/ConfirmModal';
import { styles } from '../../styles/Vendors.styles';

function Purchase() {
  const [invoices, setInvoices] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState('');
  const [items, setItems] = useState([
    { partId: '', quantity: '', unitPrice: '' }
  ]);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);

  useEffect(() => {
    fetchInvoices();
    fetchVendors();
    fetchParts();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/purchaseinvoice');
      setInvoices(res.data);
      setError('');
    } catch (err) {
      console.error('Fetch error:', err);
      setError('CONNECTION ERROR: DATABASE OFFLINE');
    } finally {
      setLoading(false);
    }
  };

  const fetchVendors = async () => {
    try {
      const res = await api.get('/vendor');
      setVendors(res.data);
    } catch (err) {
      console.error('Failed to load vendors:', err);
    }
  };

  const fetchParts = async () => {
    try {
      const res = await api.get('/part');
      setParts(res.data);
    } catch (err) {
      console.error('Failed to load parts:', err);
    }
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;

    if (field === 'partId') {
      const selectedPart = parts.find(p => p.id === parseInt(value));
      if (selectedPart) {
        updated[index].unitPrice = selectedPart.unitPrice;
      }
    }

    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { partId: '', quantity: '', unitPrice: '' }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      return sum + (parseFloat(item.quantity || 0) * parseFloat(item.unitPrice || 0));
    }, 0).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        vendorId: parseInt(selectedVendor),
        items: items.map(i => ({
          partId: parseInt(i.partId),
          quantity: parseInt(i.quantity),
          unitPrice: parseFloat(i.unitPrice)
        }))
      };

      await api.post('/purchaseinvoice', payload);
      
      resetForm();
      await fetchInvoices();
      await fetchParts();
      
    } catch (err) {
      console.error('Submit error:', err);
      let errorMessage = '';
      if (err.response?.status === 400) {
        errorMessage = 'VALIDATION ERROR: ' + (err.response.data?.message || 'Invalid input data');
      } else {
        errorMessage = err.response?.data?.message || err.message || 'Transaction failed';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPaid = async (id) => {
    setLoading(true);
    try {
      await api.patch(`/purchaseinvoice/${id}/mark-paid`);
      await fetchInvoices();
    } catch (err) {
      console.error('Error marking paid:', err);
      setError('Failed to mark as paid.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/purchaseinvoice/${invoiceToDelete}`);
      setInvoiceToDelete(null);
      await fetchInvoices();
    } catch (err) {
      console.error('Delete error:', err);
      setError('DELETE ERROR: ' + (err.response?.data?.message || err.message));
      setInvoiceToDelete(null);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedVendor('');
    setItems([{ partId: '', quantity: '', unitPrice: '' }]);
    setShowForm(false);
    setError('');
  };

  return (
    <div style={styles.wrapper}>
      <AdminNavbar />
      <ConfirmModal
        isOpen={!!invoiceToDelete}
        title="DELETE INVOICE"
        message="Are you sure you want to permanently delete this invoice?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setInvoiceToDelete(null)}
      />

      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>PURCHASE INVOICES</h2>
            <p style={styles.subtitle}>manage vendor purchase records</p>
          </div>
          <button
            style={{...styles.addBtn, ...(showForm && styles.cancelBtn)}}
            onClick={() => (showForm ? resetForm() : setShowForm(true))}
            className="main-action-btn"
            disabled={loading}
          >
            {showForm ? 'CLOSE' : '+ NEW PURCHASE'}
          </button>
        </div>

        {error && (
          <div style={styles.error}>
            {error}
            <button onClick={() => setError('')} style={styles.errorClose}>✕</button>
          </div>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} style={styles.form}>
            <h3 style={styles.formTitle}>CREATE PURCHASE INVOICE</h3>
            
            <div style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>SELECT VENDOR *</label>
                <select
                  style={styles.input}
                  value={selectedVendor}
                  onChange={e => setSelectedVendor(e.target.value)}
                  required
                  disabled={loading}
                >
                  <option value="">Choose vendor...</option>
                  {vendors.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <h4 style={styles.formSubtitle}>INVOICE ITEMS</h4>

            {items.map((item, index) => (
              <div key={index} style={styles.itemRow}>
                <div style={styles.itemSelect}>
                  <select
                    value={item.partId}
                    onChange={e => handleItemChange(index, 'partId', e.target.value)}
                    style={styles.input}
                    required
                  >
                    <option value="">Select Part</option>
                    {parts.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.partNumber}) - Rs. {p.unitPrice}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={styles.itemQty}>
                  <input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={e => handleItemChange(index, 'quantity', e.target.value)}
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.itemPrice}>
                  <input
                    type="number"
                    placeholder="Unit Price"
                    value={item.unitPrice}
                    onChange={e => handleItemChange(index, 'unitPrice', e.target.value)}
                    style={styles.input}
                    required
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  style={styles.removeBtn}
                  className="remove-item-btn"
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addItem}
              style={styles.addItemBtn}
              className="add-item-btn"
            >
              + ADD ITEM
            </button>

            <div style={styles.totalContainer}>
              <span style={styles.totalLabel}>TOTAL AMOUNT:</span>
              <span style={styles.totalValue}>Rs. {calculateTotal()}</span>
            </div>

            <div style={styles.formActions}>
              <button type="submit" style={styles.submitBtn} className="main-action-btn" disabled={loading}>
                {loading ? 'PROCESSING...' : 'CREATE INVOICE'}
              </button>
            </div>
          </form>
        )}

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['ID', 'VENDOR', 'TOTAL', 'STATUS', 'DATE', 'ITEMS', 'ACTIONS'].map(h =>
                  <th key={h} style={styles.th}>{h}</th>
                )}
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} style={styles.tr} className="invoice-row">
                  <td style={styles.td}>#{inv.id}</td>
                  <td style={styles.td}>{inv.vendorName}</td>
                  <td style={{...styles.td, color: '#27ae60', fontWeight: 'bold'}}>
                    Rs. {inv.totalAmount}
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: inv.status === 'Paid' ? 'rgba(46, 204, 113, 0.2)' : 'rgba(243, 156, 18, 0.2)',
                      color: inv.status === 'Paid' ? '#2ecc71' : '#f39c12'
                    }}>
                      {inv.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {new Date(inv.date).toLocaleDateString()}
                  </td>
                  <td style={styles.td}>
                    <div style={styles.itemsList}>
                      {inv.items.map((i, idx) => (
                        <div key={idx} style={styles.itemTag}>
                          {i.partName} × {i.quantity}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td style={styles.tdRight}>
                    <div style={styles.actionGroup}>
                      {inv.status === 'Pending' && (
                        <button
                          onClick={() => handleMarkPaid(inv.id)}
                          style={styles.paidBtn}
                          className="paid-btn"
                          disabled={loading}
                        >
                          MARK PAID
                        </button>
                      )}
                      <button
                        onClick={() => setInvoiceToDelete(inv.id)}
                        style={styles.deleteBtn}
                        className="del-h"
                        disabled={loading}
                      >
                        DELETE
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && !loading && (
                <tr>
                  <td colSpan="7" style={styles.emptyState}>NO PURCHASE INVOICES FOUND</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {loading && <div style={styles.loaderLine} />}
      </div>
      <style>{`
        .invoice-row:hover { background-color: #161616 !important; }
        .del-h:hover { color: #ff6b6b !important; }
        .paid-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .remove-item-btn:hover { background-color: #c0392b !important; transform: translateY(-1px); }
        .add-item-btn:hover { background-color: #2980b9 !important; transform: translateY(-1px); }
        .main-action-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        input:focus, select:focus { border-color: #f39c12 !important; outline: none; background-color: #050505 !important; }
        select { cursor: pointer; }
        select option { background-color: #050505; color: #fff; }
      `}</style>
    </div>
  );
}

// Additional styles not in Vendors.styles
const additionalStyles = {
  statusBadge: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: 'bold',
    letterSpacing: '0.5px',
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  itemTag: {
    fontSize: '11px',
    color: '#bbb',
    backgroundColor: '#1a1a1a',
    padding: '2px 6px',
    borderRadius: '3px',
    display: 'inline-block',
    width: 'fit-content',
  },
  paidBtn: {
    backgroundColor: '#2ecc71',
    color: '#000',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '10px',
    fontWeight: 'bold',
    letterSpacing: '0.5px',
    transition: 'all 0.2s ease',
  },
  formSubtitle: {
    margin: '20px 0 15px 0',
    fontSize: '12px',
    color: '#f39c12',
    letterSpacing: '1px',
    fontWeight: 600,
  },
  itemRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '12px',
    alignItems: 'center',
  },
  itemSelect: {
    flex: 2,
  },
  itemQty: {
    flex: 0.5,
  },
  itemPrice: {
    flex: 0.5,
  },
  removeBtn: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    padding: '10px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'all 0.2s ease',
  },
  addItemBtn: {
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: 'bold',
    letterSpacing: '1px',
    marginTop: '10px',
    transition: 'all 0.2s ease',
  },
  totalContainer: {
    margin: '20px 0',
    padding: '15px',
    backgroundColor: '#0a0a0a',
    borderRadius: '4px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid #222',
  },
  totalLabel: {
    fontSize: '12px',
    color: '#888',
    letterSpacing: '1px',
    fontWeight: 600,
  },
  totalValue: {
    fontSize: '20px',
    color: '#f39c12',
    fontWeight: 'bold',
  },
};

// Merge styles
Object.assign(styles, additionalStyles);

export default Purchase;