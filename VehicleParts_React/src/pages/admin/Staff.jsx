import { useState, useEffect } from 'react'
import api from '../../api/axios'
import AdminNavbar from '../../components/AdminNavbar'

function StaffPage() {
  const [staffList, setStaffList] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    password: '', phone: '', position: ''
  })

  useEffect(() => {
    fetchStaff()
  }, [])

  const fetchStaff = async () => {
    setLoading(true)
    try {
      const res = await api.get('/staff')
      setStaffList(res.data)
    } catch (err) {
      setError('Failed to load staff.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await api.post('/staff', form)
      setForm({
        firstName: '', lastName: '', email: '',
        password: '', phone: '', position: ''
      })
      setShowForm(false)
      fetchStaff()
    } catch (err) {
      setError('Failed to create staff.')
    }
  }

  return (
    <div style={styles.wrapper}>
      <AdminNavbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>STAFF MANAGEMENT</h2>
            <p style={styles.subtitle}>garage personnel database</p>
          </div>
          <button
            style={{...styles.addBtn, ...(showForm && styles.cancelBtn)}}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? '✕ CANCEL' : '+ ADD MECHANIC'}
          </button>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        {showForm && (
          <form onSubmit={handleCreate} style={styles.form}>
            <div style={styles.formHeader}>
              <span style={styles.formIcon}>🔧</span>
              <h3 style={styles.formTitle}>NEW STAFF RECORD</h3>
            </div>
            <div style={styles.formGrid}>
              <input name="firstName" placeholder="FIRST NAME"
                value={form.firstName} onChange={handleChange}
                style={styles.input} required />
              <input name="lastName" placeholder="LAST NAME"
                value={form.lastName} onChange={handleChange}
                style={styles.input} required />
              <input name="email" placeholder="EMAIL" type="email"
                value={form.email} onChange={handleChange}
                style={styles.input} required />
              <input name="password" placeholder="PASSWORD" type="password"
                value={form.password} onChange={handleChange}
                style={styles.input} required />
              <input name="phone" placeholder="PHONE"
                value={form.phone} onChange={handleChange}
                style={styles.input} />
              <input name="position" placeholder="POSITION"
                value={form.position} onChange={handleChange}
                style={styles.input} />
            </div>
            <button type="submit" style={styles.submitBtn}>REGISTER STAFF</button>
          </form>
        )}

        {loading ? (
          <div style={styles.loading}>LOADING STAFF DATA...</div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>FIRST NAME</th>
                  <th style={styles.th}>LAST NAME</th>
                  <th style={styles.th}>EMAIL</th>
                  <th style={styles.th}>PHONE</th>
                  <th style={styles.th}>POSITION</th>
                  <th style={styles.th}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map(s => (
                  <tr key={s.id} style={styles.tr}>
                    <td style={styles.td}>{s.id}</td>
                    <td style={styles.td}>{s.firstName}</td>
                    <td style={styles.td}>{s.lastName}</td>
                    <td style={styles.td}>{s.email}</td>
                    <td style={styles.td}>{s.phone}</td>
                    <td style={styles.td}>{s.position}</td>
                    <td style={styles.td}>
                      <span style={s.isActive ? styles.activeBadge : styles.inactiveBadge}>
                        {s.isActive ? 'ACTIVE' : 'OFFLINE'}
                      </span>
                    </td>
                   </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    backgroundColor: '#0f0f0f',
    backgroundImage: 'radial-gradient(circle at 1px 1px, #1a1a1a 1px, transparent 1px)',
    backgroundSize: '20px 20px',
  },
  container: {
    padding: '30px 40px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '1px solid #2a2a2a',
  },
  title: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 500,
    color: '#e0e0e0',
    letterSpacing: '2px',
  },
  subtitle: {
    margin: '5px 0 0',
    fontSize: '10px',
    color: '#f39c12',
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },
  addBtn: {
    backgroundColor: '#f39c12',
    color: '#0f0f0f',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '2px',
    cursor: 'pointer',
    fontSize: '11px',
    letterSpacing: '1.5px',
    fontWeight: 500,
    transition: 'all 0.2s',
  },
  cancelBtn: {
    backgroundColor: '#2a2a2a',
    color: '#e0e0e0',
  },
  error: {
    color: '#e74c3c',
    fontSize: '11px',
    padding: '10px',
    marginBottom: '20px',
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    borderLeft: '2px solid #e74c3c',
    letterSpacing: '0.5px',
  },
  form: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #2a2a2a',
    padding: '24px',
    marginBottom: '30px',
  },
  formHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
    paddingBottom: '12px',
    borderBottom: '1px solid #2a2a2a',
  },
  formIcon: {
    fontSize: '20px',
  },
  formTitle: {
    margin: 0,
    fontSize: '12px',
    color: '#f39c12',
    letterSpacing: '2px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
    marginBottom: '20px',
  },
  input: {
    padding: '10px',
    backgroundColor: '#0f0f0f',
    border: '1px solid #2a2a2a',
    borderRadius: '2px',
    color: '#e0e0e0',
    fontSize: '12px',
    letterSpacing: '0.5px',
    outline: 'none',
  },
  submitBtn: {
    backgroundColor: '#f39c12',
    color: '#0f0f0f',
    border: 'none',
    padding: '10px',
    borderRadius: '2px',
    cursor: 'pointer',
    fontSize: '11px',
    letterSpacing: '2px',
    fontWeight: 500,
    width: '100%',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#888',
    fontSize: '11px',
    letterSpacing: '2px',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#1a1a1a',
    border: '1px solid #2a2a2a',
  },
  th: {
    padding: '14px 12px',
    textAlign: 'left',
    backgroundColor: '#0f0f0f',
    color: '#f39c12',
    fontSize: '10px',
    letterSpacing: '1.5px',
    fontWeight: 500,
    borderBottom: '1px solid #2a2a2a',
  },
  tr: {
    borderBottom: '1px solid #2a2a2a',
    transition: 'background 0.2s',
  },
  td: {
    padding: '12px',
    color: '#ccc',
    fontSize: '12px',
    borderBottom: '1px solid #2a2a2a',
  },
  activeBadge: {
    backgroundColor: 'rgba(46, 204, 113, 0.2)',
    color: '#2ecc71',
    padding: '4px 8px',
    fontSize: '9px',
    letterSpacing: '1px',
  },
  inactiveBadge: {
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
    color: '#e74c3c',
    padding: '4px 8px',
    fontSize: '9px',
    letterSpacing: '1px',
  }
}

export default StaffPage