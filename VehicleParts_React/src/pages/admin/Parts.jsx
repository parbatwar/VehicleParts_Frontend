import { useState, useEffect } from 'react';
import api from '../../api/axios';
import AdminNavbar from '../../components/AdminNavbar';
import ConfirmModal from '../../components/ConfirmModal';
import { styles } from '../../styles/Vendors.styles';
import './Parts.css';

function Parts() {
  const [parts, setParts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [vendorParts, setVendorParts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingPart, setEditingPart] = useState(null);
  const [partToDelete, setPartToDelete] = useState(null);
  
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState('');
  const [items, setItems] = useState([]);

const [form, setForm] = useState({ 
  name: '', 
  category: '',
  sellingPrice: ''
});

  useEffect(() => {
    fetchParts();
    fetchVendors();
  }, []);

    const fetchParts = async () => {
        setLoading(true);
        try {
            const res = await api.get('/part', {
                params: { _t: new Date().getTime() }
            });
            console.log('Parts from API:', res.data); // ADD THIS
            setParts(res.data);
            setError('');
        } catch (err) {
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

  const handleVendorChange = async (vendorId) => {
    setSelectedVendor(vendorId);
    setItems([]);
    setVendorParts([]);
    if (!vendorId) return;
    try {
      const res = await api.get(`/part/vendor/${vendorId}`);
      setVendorParts(res.data);
    } catch (err) {
      console.error('Failed to load vendor parts:', err);
    }
  };

    const addExistingPart = (part) => {
        // Check if item already exists in cart
        const existingIndex = items.findIndex(i => i.partId === part.id);
        
        if (existingIndex !== -1) {
            // If exists, increase quantity by 1
            const updated = [...items];
            const currentQty = parseInt(updated[existingIndex].quantity) || 0;
            updated[existingIndex].quantity = (currentQty + 1).toString();
            setItems(updated);
        } else {
            // If not exists, add new item
            setItems([...items, {
            partId: part.id,
            partName: part.name,
            category: part.category,
            currentStock: part.stockQty,
            quantity: '1',
            unitPrice: part.unitPrice,
            sellingPrice: part.sellingPrice,
            isNew: false
            }]);
        }
    };

  const addNewPart = () => {
    setItems([...items, {
      partId: null,
      partName: '',
      category: '',
      currentStock: null,
      quantity: '',
      unitPrice: '',
      sellingPrice: '',
      isNew: true
    }]);
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      return sum + (parseFloat(item.quantity || 0) * parseFloat(item.unitPrice || 0));
    }, 0).toFixed(2);
  };

  const handlePurchaseSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVendor || items.length === 0) {
      setError('Please select a vendor and add at least one item.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        vendorId: parseInt(selectedVendor),
        items: items.map(i => ({
          partId: i.isNew ? null : i.partId,
          partName: i.isNew ? i.partName : null,
          category: i.isNew ? i.category : null,
          quantity: parseInt(i.quantity),
          unitPrice: parseFloat(i.unitPrice),
          sellingPrice: parseFloat(i.sellingPrice) || 0
        }))
      };
      await api.post('/purchaseinvoice', payload);
      resetPurchaseForm();
      await fetchParts();
    } catch (err) {
        setError(err.response?.data?.message || 'Failed to create invoice.');
    } finally {
      setLoading(false);
    }
  };

  const resetPurchaseForm = () => {
    setSelectedVendor('');
    setItems([]);
    setShowPurchaseForm(false);
    setError('');
  };

  const handleEdit = (part) => {
    setEditingPart(part);
    setForm({ 
        name: part.name, 
        category: part.category,
        sellingPrice: part.sellingPrice || part.unitPrice * 1.3  // ← ADD THIS
    });
    setShowPurchaseForm(true);
  };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put(`/part/${editingPart.id}`, {
            name: form.name,
            category: form.category,
            unitPrice: editingPart.unitPrice,
            sellingPrice: parseFloat(form.sellingPrice),
            stockQty: editingPart.stockQty,
            vendorId: editingPart.vendorId
            });
            
            // Update local state immediately
            setParts(prevParts => 
            prevParts.map(part => 
                part.id === editingPart.id 
                ? { ...part, sellingPrice: parseFloat(form.sellingPrice) }
                : part
            )
            );
            
            setEditingPart(null);
            setShowPurchaseForm(false);
            
        } catch (err) {
            console.error('Update error:', err);
            setError('Failed to update part.');
        } finally {
            setLoading(false);
        }
    };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/part/${partToDelete}`);
      setPartToDelete(null);
      await fetchParts();
    } catch (err) {
      setError('Failed to delete part.');
    }
  };

  const closeDrawer = () => {
    setEditingPart(null);
    resetPurchaseForm();
  };

  return (
    <div style={styles.wrapper}>
      <AdminNavbar />
      
      <ConfirmModal
        isOpen={!!partToDelete}
        title="DELETE PART"
        message="Permanently remove this part from inventory?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPartToDelete(null)}
      />

      {/* Drawer Overlay */}
      {(showPurchaseForm || editingPart) && (
        <div className="drawer-overlay" onClick={closeDrawer}>
          <div className="drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h2 className="drawer-title">
                {editingPart ? 'EDIT PART' : 'NEW PURCHASE ORDER'}
              </h2>
              <button onClick={closeDrawer} className="drawer-close">×</button>
            </div>

            {editingPart ? (
              <form onSubmit={handleUpdate}>
                <div className="input-group">
                  <label className="input-label">PART NAME</label>
                  <input 
                    className="form-input" 
                    value={form.name} 
                    onChange={e => setForm({...form, name: e.target.value})} 
                    required 
                  />
                </div>
                <div className="input-group" style={{ marginTop: '16px' }}>
                  <label className="input-label">CATEGORY</label>
                  <input 
                    className="form-input" 
                    value={form.category} 
                    onChange={e => setForm({...form, category: e.target.value})} 
                    required 
                  />
                </div>
                <div className="input-group" style={{ marginTop: '16px' }}>  {/* ← ADD THIS */}
                    <label className="input-label">SELLING PRICE</label>
                    <input 
                        type="number"
                        step="0.01"
                        className="form-input" 
                        value={form.sellingPrice} 
                        onChange={e => setForm({...form, sellingPrice: e.target.value})} 
                        required 
                    />
                </div>
                <button type="submit" className="submit-btn" style={{ marginTop: '24px' }}>
                  {loading ? 'SAVING...' : 'UPDATE PART'}
                </button>
              </form>
            ) : (
              <form onSubmit={handlePurchaseSubmit}>
                {/* Vendor Selection */}
                <div className="input-group">
                  <label className="input-label">SELECT VENDOR</label>
                  <select 
                    className="form-select" 
                    value={selectedVendor} 
                    onChange={e => handleVendorChange(e.target.value)} 
                    required
                  >
                    <option value="">Choose vendor...</option>
                    {vendors.map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>

                {selectedVendor && (
                  <>
                    {/* Available Parts */}
                    <div style={{ marginTop: '24px' }}>
                      <label className="input-label">AVAILABLE PARTS</label>
                      <div className="parts-list">
                        {vendorParts.map(p => {
                            const isAdded = items.find(i => i.partId === p.id);
                            return (
                                <div 
                                key={p.id} 
                                className={`part-chip ${isAdded ? 'part-chip-added' : ''}`}  // change class name
                                onClick={() => addExistingPart(p)}  // always clickable
                                >
                                {p.name}
                                {isAdded && <span className="added-quantity"> (×{isAdded.quantity})</span>}
                                </div>
                            );
                        })}
                        <button type="button" onClick={addNewPart} className="new-part-btn">
                          + NEW PART
                        </button>
                      </div>
                    </div>

                    {/* Invoice Items */}
                    {items.length > 0 && (
                      <div style={{ marginTop: '24px' }}>
                        <label className="input-label">INVOICE ITEMS</label>
                        
                        {items.map((item, index) => (
                          <div key={index} className="item-card">
                            <div className="item-header">
                              <span className={`item-badge ${item.isNew ? 'badge-new' : 'badge-existing'}`}>
                                {item.isNew ? 'NEW PART' : 'EXISTING PART'}
                              </span>
                              <button type="button" onClick={() => removeItem(index)} className="remove-item-btn">
                                REMOVE
                              </button>
                            </div>

                            {item.isNew ? (
                              <div className="grid-3"> 
                                <input 
                                  placeholder="Part Name" 
                                  className="form-input" 
                                  value={item.partName} 
                                  onChange={e => handleItemChange(index, 'partName', e.target.value)} 
                                  required 
                                />
                                <input 
                                  placeholder="Category" 
                                  className="form-input" 
                                  value={item.category} 
                                  onChange={e => handleItemChange(index, 'category', e.target.value)} 
                                  required 
                                />
                                <input 
                                    placeholder="Selling Price" 
                                    className="form-input" 
                                    value={item.sellingPrice} 
                                    onChange={e => handleItemChange(index, 'sellingPrice', e.target.value)} 
                                    required 
                                />
                              </div>
                            ) : (
                              <div className="item-name">
                                {item.partName}
                              </div>
                            )}

                            <div className="grid-3">
                              <div className="input-group">
                                <label className="input-label-small">QUANTITY</label>
                                <input 
                                  type="number" 
                                  className="form-input" 
                                  value={item.quantity} 
                                  onChange={e => handleItemChange(index, 'quantity', e.target.value)} 
                                  required 
                                />
                              </div>
                              <div className="input-group">
                                <label className="input-label-small">PURCHASE  PRICE</label>
                                <input 
                                  type="number" 
                                  className="form-input" 
                                  value={item.unitPrice} 
                                  onChange={e => handleItemChange(index, 'unitPrice', e.target.value)} 
                                  required 
                                />
                              </div>
                              <div className="input-group">
                                <label className="input-label-small">TOTAL</label>
                                <div className="line-total">
                                  Rs. {(parseFloat(item.quantity || 0) * parseFloat(item.unitPrice || 0)).toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Total Section */}
                        <div className="total-section">
                          <div className="total-row">
                            <span className="total-label">GRAND TOTAL</span>
                            <span className="total-value">Rs. {calculateTotal()}</span>
                          </div>
                          <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'PROCESSING...' : 'CREATE PURCHASE ORDER'}
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </form>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>PARTS INVENTORY</h2>
            <p style={styles.subtitle}>components & stock management</p>
          </div>
          <button
            style={styles.addBtn}
            onClick={() => setShowPurchaseForm(true)}
            className="main-action-btn"
          >
            + NEW PURCHASE
          </button>
        </div>

        {error && (
          <div style={styles.error}>
            {error}
            <button onClick={() => setError('')} style={styles.errorClose}>×</button>
          </div>
        )}

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>S.N.</th>
                <th style={styles.th}>PART NAME</th>
                <th style={styles.th}>CATEGORY</th>
                <th style={styles.th}>VENDOR</th>
                <th style={styles.th}>PURCHASE PRICE</th>
                <th style={styles.th}>SELLING PRICE</th>
                <th style={styles.th}>STOCK</th>
                <th style={styles.th}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {parts.map((p, index) => (
                <tr key={p.id} style={styles.tr} className="part-row">
                    <td style={styles.td}>{index + 1}</td>
                    <td style={{...styles.td, color: '#f39c12'}}>{p.name}</td>
                    <td style={styles.td}>{p.category}</td>
                    <td style={styles.td}>{p.vendorName}</td>
                    <td style={styles.td}>Rs. {p.unitPrice}</td>
                    <td style={{...styles.td, color: '#2ecc71'}}>
                        Rs. {(p.sellingPrice && p.sellingPrice > 0) ? p.sellingPrice.toLocaleString() : (p.unitPrice * 1.3).toLocaleString()}
                    </td>
                    <td style={styles.td}>
                        <span className="stock-badge" style={{
                        backgroundColor: p.stockQty <= 10 ? 'rgba(231, 76, 60, 0.2)' : 'rgba(46, 204, 113, 0.2)',
                        color: p.stockQty <= 10 ? '#e74c3c' : '#2ecc71'
                        }}>
                        {p.stockQty}
                        </span>
                    </td>
                    <td style={styles.tdRight}>
                        <div style={styles.actionGroup}>
                            <button onClick={() => handleEdit(p)} style={styles.editBtn} className="edit-h">EDIT</button>
                            <button onClick={() => setPartToDelete(p.id)} style={styles.deleteBtn} className="del-h">DELETE</button>
                        </div>
                    </td>
                </tr>
              ))}
              {parts.length === 0 && !loading && (
                <tr>
                  <td colSpan="7" style={styles.emptyState}>NO PARTS FOUND. CLICK "NEW PURCHASE" TO ADD PARTS.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {loading && <div style={styles.loaderLine} />}
      </div>
      <style>{`
        .part-row:hover { background-color: #161616 !important; }
        .edit-h:hover { color: #fff !important; }
        .del-h:hover { color: #ff6b6b !important; }
        .main-action-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        input:focus, select:focus { border-color: #f39c12 !important; outline: none; background-color: #050505 !important; }
        input:-webkit-autofill { -webkit-text-fill-color: #fff !important; -webkit-box-shadow: 0 0 0px 1000px #050505 inset !important; }
        input[type="number"] {
          -moz-appearance: textfield;
          appearance: textfield;
        }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          appearance: none;
          margin: 0;
        }
        select { cursor: pointer; }
        select option { background-color: #050505; color: #fff; }
      `}</style>
    </div>
  );
}

export default Parts;