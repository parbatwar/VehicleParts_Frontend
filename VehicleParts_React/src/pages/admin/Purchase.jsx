import { useState, useEffect } from 'react';
import api from '../../api/axios';
import AdminNavbar from '../../components/AdminNavbar';
import { styles } from '../../styles/Vendors.styles';
import './Purchase.css';

function Purchase() {
  const [invoices, setInvoices] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState('');
  const [items, setItems] = useState([
    {
      partNumber: '',
      partName: '',
      category: '',
      quantity: '',
      unitPrice: '',
      searched: false,
      isNew: false,
      currentStock: null
    }
  ]);

  useEffect(() => {
    fetchInvoices();
    fetchVendors();
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
      setError('Failed to load vendors.');
    }
  };

  const handleSearch = async (index) => {
    const partNumber = items[index].partNumber.trim();
    if (!partNumber) return;

    setLoading(true);
    try {
      const res = await api.get(`/part/search/${partNumber}`);
      const updated = [...items];

      if (res.data.exists) {
        updated[index] = {
          ...updated[index],
          partName: res.data.part.name,
          category: res.data.part.category,
          unitPrice: res.data.part.unitPrice,
          currentStock: res.data.part.stockQty,
          searched: true,
          isNew: false
        };
      } else {
        updated[index] = {
          ...updated[index],
          partName: '',
          category: '',
          unitPrice: '',
          currentStock: null,
          searched: true,
          isNew: true
        };
      }
      setItems(updated);
    } catch (err) {
      const updated = [...items];
      updated[index] = {
        ...updated[index],
        searched: true,
        isNew: true,
        currentStock: null
      };
      setItems(updated);
    } finally {
      setLoading(false);
    }
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const handlePartNumberKeyPress = (e, index) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(index);
    }
  };

  const addItem = () => {
    setItems([...items, {
      partNumber: '',
      partName: '',
      category: '',
      quantity: '',
      unitPrice: '',
      searched: false,
      isNew: false,
      currentStock: null
    }]);
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
          partNumber: i.partNumber,
          partName: i.partName,
          category: i.category,
          quantity: parseInt(i.quantity),
          unitPrice: parseFloat(i.unitPrice)
        }))
      };
      await api.post('/purchaseinvoice', payload);
      
      resetForm();
      await fetchInvoices();
      
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.response?.data?.message || 'Failed to create invoice.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedVendor('');
    setItems([{
      partNumber: '',
      partName: '',
      category: '',
      quantity: '',
      unitPrice: '',
      searched: false,
      isNew: false,
      currentStock: null
    }]);
    setShowForm(false);
    setError('');
  };

  return (
    <div style={styles.wrapper}>
      <AdminNavbar />

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
              <div key={index} style={styles.itemContainer}>
                <div style={styles.searchRow}>
                  <input
                    placeholder="Enter Part Number (e.g. BP-001)"
                    value={item.partNumber}
                    onChange={e => handleItemChange(index, 'partNumber', e.target.value)}
                    onKeyPress={e => handlePartNumberKeyPress(e, index)}
                    style={{...styles.input, flex: 3}}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => handleSearch(index)}
                    style={styles.searchBtn}
                    disabled={loading}
                  >
                    SEARCH
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    style={styles.removeBtn}
                    disabled={loading}
                  >
                    ✕
                  </button>
                </div>

                {item.searched && (
                  <div style={styles.searchResult}>
                    {item.isNew ? (
                      <div style={styles.newPartBadge}>
                        🆕 NEW PART — FILL IN DETAILS BELOW
                      </div>
                    ) : (
                      <div style={styles.foundPartBadge}>
                        ✅ FOUND: {item.partName} | {item.category} | CURRENT STOCK: {item.currentStock}
                      </div>
                    )}
                  </div>
                )}

                {item.searched && item.isNew && (
                  <div style={styles.itemRow}>
                    <input
                      placeholder="Part Name"
                      value={item.partName}
                      onChange={e => handleItemChange(index, 'partName', e.target.value)}
                      style={{...styles.input, flex: 2}}
                      required
                      disabled={loading}
                    />
                    <input
                      placeholder="Category"
                      value={item.category}
                      onChange={e => handleItemChange(index, 'category', e.target.value)}
                      style={{...styles.input, flex: 1}}
                      required
                      disabled={loading}
                    />
                  </div>
                )}

                {item.searched && (
                  <div style={styles.itemRow}>
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={item.quantity}
                      onChange={e => handleItemChange(index, 'quantity', e.target.value)}
                      style={{...styles.input, flex: 1}}
                      required
                      disabled={loading}
                    />
                    <input
                      type="number"
                      placeholder="Unit Price"
                      value={item.unitPrice}
                      onChange={e => handleItemChange(index, 'unitPrice', e.target.value)}
                      style={{...styles.input, flex: 1}}
                      required
                      disabled={loading}
                    />
                    <div style={styles.lineTotal}>
                      Rs. {(parseFloat(item.quantity || 0) * parseFloat(item.unitPrice || 0)).toFixed(2)}
                    </div>
                  </div>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addItem}
              style={styles.addItemBtn}
              disabled={loading}
            >
              + ADD ANOTHER ITEM
            </button>

            <div style={styles.totalContainer}>
              <span style={styles.totalLabel}>TOTAL AMOUNT:</span>
              <span style={styles.totalValue}>Rs. {calculateTotal()}</span>
            </div>

            <div style={styles.formActions}>
              <button type="submit" style={styles.submitBtn} disabled={loading}>
                {loading ? 'PROCESSING...' : 'CREATE INVOICE'}
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div style={styles.loaderLine} />
        ) : (
          <div className="invoice-grid">
            {invoices.length === 0 ? (
              <div style={styles.emptyState}>NO PURCHASE INVOICES FOUND</div>
            ) : (
              invoices.map((inv) => (
                <div key={inv.id} className="invoice-card">
                  <div className="card-header">
                    <div>
                      <span className="invoice-id">#{inv.id}</span>
                      <span className="invoice-date">{new Date(inv.date).toLocaleDateString()}</span>
                    </div>
                    <span className={`status ${inv.status === 'Paid' ? 'status-paid' : 'status-pending'}`}>
                      {inv.status}
                    </span>
                  </div>

                  <div className="card-body">
                    <div className="vendor-info">
                      <span className="vendor-name">{inv.vendorName}</span>
                    </div>

                    <div className="items-list">
                      {inv.items.map((i, idx) => (
                        <div key={idx} className="item-row">
                          <span className="item-name">{i.partName}</span>
                          <span className="item-detail">{i.quantity} × Rs. {i.unitPrice}</span>
                          <span className="item-total">Rs. {i.quantity * i.unitPrice}</span>
                        </div>
                      ))}
                    </div>

                    <div className="total-row">
                      <span>TOTAL</span>
                      <span>Rs. {inv.totalAmount}</span>
                    </div>
                  </div>

                  <div className="card-footer">
                    {inv.status === 'Pending' && (
                      <button
                        onClick={() => handleMarkPaid(inv.id)}
                        className="mark-paid-btn"
                        disabled={loading}
                      >
                        MARK PAID
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Additional styles
Object.assign(styles, {
  hint: {
    margin: '8px 0 0',
    fontSize: '10px',
    color: '#f39c12',
    letterSpacing: '1px',
    opacity: 0.7,
  },
  formSubtitle: {
    margin: '20px 0 15px 0',
    fontSize: '12px',
    color: '#f39c12',
    letterSpacing: '1px',
    fontWeight: 600,
  },
  itemContainer: {
    backgroundColor: '#0a0a0a',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '15px',
    border: '1px solid #222',
  },
  searchRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    marginBottom: '10px',
  },
  searchBtn: {
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '10px',
    fontWeight: 'bold',
    letterSpacing: '1px',
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
  },
  searchResult: {
    marginBottom: '10px',
  },
  foundPartBadge: {
    backgroundColor: 'rgba(46, 204, 113, 0.2)',
    color: '#2ecc71',
    padding: '8px 12px',
    borderRadius: '4px',
    fontSize: '11px',
  },
  newPartBadge: {
    backgroundColor: 'rgba(243, 156, 18, 0.2)',
    color: '#f39c12',
    padding: '8px 12px',
    borderRadius: '4px',
    fontSize: '11px',
  },
  itemRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    marginTop: '10px',
  },
  lineTotal: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#151515',
    borderRadius: '4px',
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#f39c12',
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
    width: '100%',
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
  emptyState: {
    textAlign: 'center',
    padding: '60px',
    color: '#666',
    fontSize: '11px',
    letterSpacing: '2px',
    backgroundColor: '#111',
    borderRadius: '8px',
    border: '1px solid #222',
  },
});

export default Purchase;