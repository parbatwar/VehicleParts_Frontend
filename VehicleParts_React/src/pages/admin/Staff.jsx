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
    <div>
      <AdminNavbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h2>Staff</h2>
          <button
            style={styles.addBtn}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : '+ Add Staff'}
          </button>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        {showForm && (
          <form onSubmit={handleCreate} style={styles.form}>
            <h3>New Staff</h3>
            <input name="firstName" placeholder="First Name"
              value={form.firstName} onChange={handleChange}
              style={styles.input} required />
            <input name="lastName" placeholder="Last Name"
              value={form.lastName} onChange={handleChange}
              style={styles.input} required />
            <input name="email" placeholder="Email" type="email"
              value={form.email} onChange={handleChange}
              style={styles.input} required />
            <input name="password" placeholder="Password" type="password"
              value={form.password} onChange={handleChange}
              style={styles.input} required />
            <input name="phone" placeholder="Phone"
              value={form.phone} onChange={handleChange}
              style={styles.input} />
            <input name="position" placeholder="Position"
              value={form.position} onChange={handleChange}
              style={styles.input} />
            <button type="submit" style={styles.submitBtn}>Create Staff</button>
          </form>
        )}

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Position</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map(s => (
                <tr key={s.id} style={styles.row}>
                  <td>{s.id}</td>
                  <td>{s.firstName}</td>
                  <td>{s.lastName}</td>
                  <td>{s.email}</td>
                  <td>{s.phone}</td>
                  <td>{s.position}</td>
                  <td>{s.isActive ? '✅' : '❌'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: { padding: '30px' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  addBtn: {
    backgroundColor: '#1a1a2e',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  form: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxWidth: '400px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  input: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px'
  },
  submitBtn: {
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    padding: '10px',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  thead: {
    backgroundColor: '#1a1a2e',
    color: 'white'
  },
  row: {
    borderBottom: '1px solid #eee',
    textAlign: 'center'
  },
  error: { color: 'red' }
}

export default StaffPage