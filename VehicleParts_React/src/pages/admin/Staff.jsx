import { useState, useEffect } from 'react';
import api from '../../api/axios';
import AdminNavbar from '../../components/AdminNavbar';
import ConfirmModal from '../../components/ConfirmModal';
import { styles } from '../../styles/Vendors.styles';

function StaffPage() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    password: '', phone: '', position: ''
  });
  const [staffToDelete, setStaffToDelete] = useState(null);

  useEffect(() => { fetchStaff(); }, []);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await api.get('/staff');
      console.log('Fetched staff data:', res.data);
      setStaffList(res.data);
      setError('');
    } catch (err) {
      console.error('Fetch error:', err);
      setError('CONNECTION ERROR: DATABASE OFFLINE');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (editingId) {
        // UPDATE - Match UpdateStaffDto exactly (NO password field)
        const updateData = {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone || '',
          position: form.position || ''
        };
        
        console.log('Updating staff ID:', editingId);
        console.log('Update data:', updateData);
        
        await api.put(`/staff/${editingId}`, updateData);
        
      } else {
        // CREATE - Match CreateStaffDto exactly (WITH password)
        const createData = {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
          phone: form.phone || '',
          position: form.position || ''
        };
        
        console.log('Creating new staff:', createData);
        
        // Password validation check
        if (createData.password.length < 8) {
          throw new Error('Password must be at least 8 characters long');
        }
        
        await api.post('/staff', createData);
      }
      
      resetForm();
      await fetchStaff();
      
    } catch (err) {
      console.error('Submit error:', err);
      
      let errorMessage = '';
      if (err.response?.status === 400) {
        errorMessage = 'VALIDATION ERROR: ';
        if (err.response.data?.errors) {
          const errors = err.response.data.errors;
          errorMessage += Object.values(errors).flat().join(', ');
        } else {
          errorMessage += err.response.data?.title || 'Invalid input data';
        }
      } else if (err.response?.status === 409) {
        errorMessage = 'Email already exists in the system';
      } else if (err.message.includes('8 characters')) {
        errorMessage = 'Password must be at least 8 characters long';
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
      await api.delete(`/staff/${staffToDelete}`);
      setStaffToDelete(null);
      await fetchStaff();
    } catch (err) {
      console.error('Delete error:', err);
      setError('DELETE ERROR: ' + (err.response?.data?.message || err.message));
      setStaffToDelete(null);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (staff) => {
    console.log('Editing staff:', staff);
    setEditingId(staff.id);
    setForm({
      firstName: staff.firstName || '',
      lastName: staff.lastName || '',
      email: staff.email || '',
      password: '',
      phone: staff.phone || '',
      position: staff.position || ''
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setForm({
      firstName: '', lastName: '', email: '',
      password: '', phone: '', position: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div style={styles.wrapper}>
      <AdminNavbar />
      <ConfirmModal
        isOpen={!!staffToDelete}
        title="TERMINATE STAFF RECORD"
        message="Are you sure you want to permanently remove this staff member from the database?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setStaffToDelete(null)}
      />

      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>STAFF MANAGEMENT</h2>
            <p style={styles.subtitle}>garage personnel database</p>
          </div>
          <button
            style={{...styles.addBtn, ...(showForm && styles.cancelBtn)}}
            onClick={() => (showForm ? resetForm() : setShowForm(true))}
            className="main-action-btn"
            disabled={loading}
          >
            {showForm ? 'CLOSE' : '+ NEW STAFF'}
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
              {editingId ? 'EDIT STAFF' : 'REGISTER NEW STAFF'}
            </h3>
            
            <div style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>FIRST NAME *</label>
                <input
                  style={styles.input}
                  value={form.firstName}
                  onChange={(e) => setForm({...form, firstName: e.target.value})}
                  required
                  disabled={loading}
                  placeholder="John"
                />
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>LAST NAME *</label>
                <input
                  style={styles.input}
                  value={form.lastName}
                  onChange={(e) => setForm({...form, lastName: e.target.value})}
                  required
                  disabled={loading}
                  placeholder="Doe"
                />
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>EMAIL *</label>
                <input
                  style={styles.input}
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  required
                  disabled={loading}
                  placeholder="john.doe@example.com"
                />
              </div>
              
              {!editingId && (
                <div style={styles.inputGroup}>
                  <label style={styles.label}>PASSWORD * (min. 8 characters)</label>
                  <input
                    style={styles.input}
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({...form, password: e.target.value})}
                    required
                    disabled={loading}
                    placeholder="Minimum 8 characters"
                  />
                </div>
              )}
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>PHONE</label>
                <input
                  style={styles.input}
                  value={form.phone}
                  onChange={(e) => setForm({...form, phone: e.target.value})}
                  disabled={loading}
                  placeholder="+1234567890"
                />
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>POSITION</label>
                <input
                  style={styles.input}
                  value={form.position}
                  onChange={(e) => setForm({...form, position: e.target.value})}
                  disabled={loading}
                  placeholder="Mechanic, Manager, etc."
                />
              </div>
            </div>
            
            <div style={styles.formActions}>
              <button type="submit" style={styles.submitBtn} className="main-action-btn" disabled={loading}>
                {loading ? 'PROCESSING...' : (editingId ? 'UPDATE STAFF' : 'CREATE STAFF')}
              </button>
            </div>
          </form>
        )}

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['S.N.', 'FIRST NAME', 'LAST NAME', 'EMAIL', 'PHONE', 'POSITION', 'ACTIONS'].map(h =>
                  <th key={h} style={styles.th}>{h}</th>
                )}
              </tr>
            </thead>
            <tbody>
              {staffList.map((s, index) => (
                <tr key={s.id} style={styles.tr} className="staff-row">
                  <td style={styles.td}>{index + 1}</td>
                  <td style={styles.td}>{s.firstName || '—'}</td>
                  <td style={styles.td}>{s.lastName || '—'}</td>
                  <td style={styles.td}>{s.email}</td>
                  <td style={styles.td}>{s.phone || '—'}</td>
                  <td style={styles.td}>{s.position || '—'}</td>
                  <td style={styles.tdRight}>
                    <div style={styles.actionGroup}>
                      <button 
                        onClick={() => startEdit(s)} 
                        style={styles.editBtn} 
                        className="edit-h" 
                        disabled={loading}
                      >
                        EDIT
                      </button>
                      <button 
                        onClick={() => setStaffToDelete(s.id)} 
                        style={styles.deleteBtn} 
                        className="del-h" 
                        disabled={loading}
                      >
                        REMOVE
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {staffList.length === 0 && !loading && (
                <tr>
                  <td colSpan="7" style={styles.emptyState}>NO STAFF RECORDS FOUND</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {loading && <div style={styles.loaderLine} />}
      </div>
      <style>{`
        .staff-row:hover { background-color: #161616 !important; }
        .edit-h:hover { color: #fff !important; }
        .del-h:hover { color: #ff6b6b !important; }
        .main-action-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        input:-webkit-autofill { -webkit-text-fill-color: #fff !important; -webkit-box-shadow: 0 0 0px 1000px #050505 inset !important; }
        input:focus { border-color: #f39c12 !important; outline: none; background-color: #050505 !important; }
      `}</style>
    </div>
  );
}

export default StaffPage;