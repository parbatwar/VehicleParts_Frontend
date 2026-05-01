import { useState, useEffect } from 'react';
import api from '../../api/axios';
import AdminNavbar from '../../components/AdminNavbar';
import ConfirmModal from '../../components/ConfirmModal';
import { styles } from '../../styles/Vendors.styles';

function Parts() {
  const [parts, setParts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    vendorId: '',
    name: '',
    partNumber: '',
    category: '',
    unitPrice: '',
    stockQty: '',
    reorderLevel: 10
  });
  const [partToDelete, setPartToDelete] = useState(null);

  useEffect(() => { 
    fetchParts(); 
    fetchVendors(); 
  }, []);

  const fetchParts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/part');
      setParts(res.data);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const payload = {
        vendorId: parseInt(form.vendorId),
        name: form.name,
        partNumber: form.partNumber,
        category: form.category,
        unitPrice: parseFloat(form.unitPrice),
        stockQty: parseInt(form.stockQty),
        reorderLevel: parseInt(form.reorderLevel)
      };
      
      if (editingId) {
        await api.put(`/part/${editingId}`, payload);
      } else {
        await api.post('/part', payload);
      }
      
      resetForm();
      await fetchParts();
      
    } catch (err) {
      console.error('Submit error:', err);
      let errorMessage = '';
      if (err.response?.status === 400) {
        errorMessage = 'VALIDATION ERROR: ' + (err.response.data?.message || 'Invalid input data');
      } else if (err.response?.status === 409) {
        errorMessage = 'Part number already exists';
      } else {
        errorMessage = err.response?.data?.message || err.message || 'Transaction failed';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/part/${partToDelete}`);
      setPartToDelete(null);
      await fetchParts();
    } catch (err) {
      console.error('Delete error:', err);
      setError('DELETE ERROR: ' + (err.response?.data?.message || err.message));
      setPartToDelete(null);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (part) => {
    setEditingId(part.id);
    setForm({
      vendorId: part.vendorId || '',
      name: part.name || '',
      partNumber: part.partNumber || '',
      category: part.category || '',
      unitPrice: part.unitPrice || '',
      stockQty: part.stockQty || '',
      reorderLevel: part.reorderLevel || 10
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setForm({
      vendorId: '',
      name: '',
      partNumber: '',
      category: '',
      unitPrice: '',
      stockQty: '',
      reorderLevel: 10
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getStockColor = (part) => {
    if (part.stockQty <= part.reorderLevel) return '#e74c3c';
    if (part.stockQty <= part.reorderLevel * 2) return '#f39c12';
    return '#27ae60';
  };

  return (
    <div style={styles.wrapper}>
      <AdminNavbar />
      <ConfirmModal
        isOpen={!!partToDelete}
        title="DELETE PART"
        message="Are you sure you want to permanently remove this part from inventory?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPartToDelete(null)}
      />

      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>PARTS INVENTORY</h2>
            <p style={styles.subtitle}>manage parts & stock levels</p>
          </div>
          <button
            style={{...styles.addBtn, ...(showForm && styles.cancelBtn)}}
            onClick={() => (showForm ? resetForm() : setShowForm(true))}
            className="main-action-btn"
            disabled={loading}
          >
            {showForm ? 'CLOSE' : '+ ADD PART'}
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
            <h3 style={styles.formTitle}>
              {editingId ? 'EDIT PART' : 'ADD NEW PART'}
            </h3>
            
            <div style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>VENDOR *</label>
                <select
                  style={styles.input}
                  value={form.vendorId}
                  onChange={(e) => setForm({...form, vendorId: e.target.value})}
                  required
                  disabled={loading}
                >
                  <option value="">Select Vendor</option>
                  {vendors.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>PART NAME *</label>
                <input
                  style={styles.input}
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  required
                  disabled={loading}
                  placeholder="e.g., Brake Pads"
                />
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>PART NUMBER *</label>
                <input
                  style={styles.input}
                  value={form.partNumber}
                  onChange={(e) => setForm({...form, partNumber: e.target.value})}
                  required
                  disabled={loading}
                  placeholder="e.g., BP-001"
                />
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>CATEGORY *</label>
                <input
                  style={styles.input}
                  value={form.category}
                  onChange={(e) => setForm({...form, category: e.target.value})}
                  required
                  disabled={loading}
                  placeholder="e.g., Brakes"
                />
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>UNIT PRICE (Rs.) *</label>
                <input
                  style={styles.input}
                  type="number"
                  step="0.01"
                  value={form.unitPrice}
                  onChange={(e) => setForm({...form, unitPrice: e.target.value})}
                  required
                  disabled={loading}
                  placeholder="0.00"
                />
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>STOCK QUANTITY *</label>
                <input
                  style={styles.input}
                  type="number"
                  value={form.stockQty}
                  onChange={(e) => setForm({...form, stockQty: e.target.value})}
                  required
                  disabled={loading}
                  placeholder="0"
                />
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>REORDER LEVEL</label>
                <input
                  style={styles.input}
                  type="number"
                  value={form.reorderLevel}
                  onChange={(e) => setForm({...form, reorderLevel: e.target.value})}
                  disabled={loading}
                  placeholder="10"
                />
              </div>
            </div>
            
            <div style={styles.formActions}>
              <button type="submit" style={styles.submitBtn} className="main-action-btn" disabled={loading}>
                {loading ? 'PROCESSING...' : (editingId ? 'UPDATE PART' : 'ADD PART')}
              </button>
            </div>
          </form>
        )}

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['ID', 'PART NAME', 'PART NO.', 'CATEGORY', 'VENDOR', 'PRICE', 'STOCK', 'REORDER', 'ACTIONS'].map(h =>
                  <th key={h} style={styles.th}>{h}</th>
                )}
              </tr>
            </thead>
            <tbody>
              {parts.map((p) => (
                <tr key={p.id} style={styles.tr} className="part-row">
                  <td style={styles.td}>{p.id}</td>
                  <td style={{...styles.td, color: '#f39c12'}}>{p.name}</td>
                  <td style={styles.td}>{p.partNumber}</td>
                  <td style={styles.td}>{p.category}</td>
                  <td style={styles.td}>{p.vendorName}</td>
                  <td style={styles.td}>Rs. {p.unitPrice}</td>
                  <td style={styles.td}>
                    <span style={{
                      backgroundColor: getStockColor(p),
                      color: '#fff',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 'bold'
                    }}>
                      {p.stockQty}
                    </span>
                  </td>
                  <td style={styles.td}>{p.reorderLevel}</td>
                  <td style={styles.tdRight}>
                    <div style={styles.actionGroup}>
                      <button 
                        onClick={() => startEdit(p)} 
                        style={styles.editBtn} 
                        className="edit-h" 
                        disabled={loading}
                      >
                        EDIT
                      </button>
                      <button 
                        onClick={() => setPartToDelete(p.id)} 
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
              {parts.length === 0 && !loading && (
                <tr>
                  <td colSpan="9" style={styles.emptyState}>NO PARTS FOUND</td>
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
        input:-webkit-autofill { -webkit-text-fill-color: #fff !important; -webkit-box-shadow: 0 0 0px 1000px #050505 inset !important; }
        input:focus, select:focus { border-color: #f39c12 !important; outline: none; background-color: #050505 !important; }
        select { cursor: pointer; }
        select option { background-color: #050505; color: #fff; }
      `}</style>
    </div>
  );
}

export default Parts;