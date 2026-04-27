import { useState, useEffect } from 'react'
import api from '../../api/axios'
import AdminNavbar from '../../components/AdminNavbar'

function VendorPage() {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', phone: '', email: '', address: ''
  })
  const [showForm, setShowForm] = useState(false)

  // Load vendors on page load
  useEffect(() => {
    fetchVendors()
  }, [])

  const fetchVendors = async () => {
    setLoading(true)
    try {
      const res = await api.get('/vendor')
      setVendors(res.data)
    } catch (err) {
      setError('Failed to load vendors.')
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
      await api.post('/vendor', form)
      setForm({ name: '', phone: '', email: '', address: '' })
      setShowForm(false)
      fetchVendors() // refresh list
    } catch (err) {
      setError('Failed to create vendor.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vendor?')) return
    try {
      await api.delete(`/vendor/${id}`)
      fetchVendors()
    } catch (err) {
      setError('Failed to delete vendor.')
    }
  }

  return (
    <div>
      <AdminNavbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h2>Vendors</h2>
          <button
            style={styles.addBtn}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : '+ Add Vendor'}
          </button>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        {showForm && (
          <form onSubmit={handleCreate} style={styles.form}>
            <h3>New Vendor</h3>
            <input name="name" placeholder="Name" value={form.name}
              onChange={handleChange} style={styles.input} required />
            <input name="phone" placeholder="Phone" value={form.phone}
              onChange={handleChange} style={styles.input} />
            <input name="email" placeholder="Email" value={form.email}
              onChange={handleChange} style={styles.input} />
            <input name="address" placeholder="Address" value={form.address}
              onChange={handleChange} style={styles.input} />
            <button type="submit" style={styles.submitBtn}>Create Vendor</button>
          </form>
        )}

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th>ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map(v => (
                <tr key={v.id} style={styles.row}>
                  <td>{v.id}</td>
                  <td>{v.name}</td>
                  <td>{v.phone}</td>
                  <td>{v.email}</td>
                  <td>{v.address}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(v.id)}
                      style={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </td>
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
  deleteBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  error: { color: 'red' }
}

export default VendorPage