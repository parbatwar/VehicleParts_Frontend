import { useState, useEffect } from 'react';
import api from '../../api/axios';
import AdminNavbar from '../../components/AdminNavbar';
import ConfirmModal from '../../components/ConfirmModal';
import { styles } from '../../styles/Vendors.styles';

function VendorPage() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '' });
  const [vendorToDelete, setVendorToDelete] = useState(null);

  useEffect(() => { fetchVendors(); }, []);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await api.get('/vendor');
      setVendors(res.data);
    } catch (err) { setError('CONNECTION ERROR: DATABASE OFFLINE'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await api.put(`/vendor/${editingId}`, form);
      else await api.post('/vendor', form);
      resetForm();
      fetchVendors();
    } catch (err) { setError('TRANSACTION ERROR: VERIFY INPUTS'); }
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/vendor/${vendorToDelete}`);
      setVendorToDelete(null);
      fetchVendors();
    } catch (err) { setError('DELETE ERROR'); setVendorToDelete(null); }
  };

  const startEdit = (vendor) => {
    setEditingId(vendor.id);
    setForm({ name: vendor.name, phone: vendor.phone || '', email: vendor.email || '', address: vendor.address || '' });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setForm({ name: '', phone: '', email: '', address: '' });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div style={styles.wrapper}>
      <AdminNavbar />
      <ConfirmModal 
        isOpen={!!vendorToDelete} 
        title="TERMINATE SUPPLIER RECORD"
        message="Are you sure you want to permanently purge this vendor from the database?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setVendorToDelete(null)}
      />

      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>SUPPLIER NETWORK</h2>
            <p style={styles.subtitle}>parts & materials vendors</p>
          </div>
          <button
            style={{...styles.addBtn, ...(showForm && styles.cancelBtn)}}
            onClick={() => (showForm ? resetForm() : setShowForm(true))}
            className="main-action-btn"
          >
            {showForm ? 'CLOSE' : '+ NEW VENDOR'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={styles.form}>
            <h3 style={styles.formTitle}>{editingId ? 'EDIT SUPPLIER' : 'REGISTER SUPPLIER'}</h3>
            <div style={styles.formGrid}>
              {['name', 'phone', 'email', 'address'].map((field) => (
                <div key={field} style={styles.inputGroup}>
                  <label style={styles.label}>{field.toUpperCase()}</label>
                  <input 
                    style={styles.input} 
                    value={form[field]} 
                    onChange={(e) => setForm({...form, [field]: e.target.value})} 
                    required={field === 'name'}
                  />
                </div>
              ))}
            </div>
            <div style={styles.formActions}>
              <button type="submit" style={styles.submitBtn} className="main-action-btn">
                {editingId ? 'SAVE CHANGES' : 'CREATE RECORD'}
              </button>
            </div>
          </form>
        )}

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['S.N.', 'Vendor', 'Contact', 'Email', 'Location', 'Actions'].map(h => 
                  <th key={h} style={styles.th}>{h}</th>
                )}
              </tr>
            </thead>
            <tbody>
              {vendors.map((v, index) => (
                <tr key={v.id} style={styles.tr} className="v-row">
                  <td style={styles.td}>{index + 1}</td>
                  <td style={{...styles.td, color: '#f39c12'}}>{v.name}</td>
                  <td style={styles.td}>{v.phone || '—'}</td>
                  <td style={styles.td}>{v.email || '—'}</td>
                  <td style={styles.td}>{v.address || '—'}</td>
                  <td style={styles.tdRight}>
                    <div style={styles.actionGroup}>
                      <button onClick={() => startEdit(v)} style={styles.editBtn} className="edit-h">EDIT</button>
                      <button onClick={() => setVendorToDelete(v.id)} style={styles.deleteBtn} className="del-h">DELETE</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`
        .v-row:hover { background-color: #161616 !important; }
        .edit-h:hover { color: #fff !important; }
        .del-h:hover { color: #ff6b6b !important; }
        .main-action-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        input:-webkit-autofill { -webkit-text-fill-color: #fff !important; -webkit-box-shadow: 0 0 0px 1000px #050505 inset !important; }
        input:focus { border-color: #f39c12 !important; outline: none; background-color: #050505 !important; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

export default VendorPage;