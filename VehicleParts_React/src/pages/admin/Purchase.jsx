import { useState, useEffect } from 'react'
import api from '../../api/axios'
import AdminNavbar from '../../components/AdminNavbar'

function PurchaseInvoicesPage() {
  const [invoices, setInvoices] = useState([])
  const [vendors, setVendors] = useState([])
  const [parts, setParts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState('')
  const [items, setItems] = useState([
    { partId: '', quantity: '', unitPrice: '' }
  ])

  useEffect(() => {
    fetchInvoices()
    fetchVendors()
    fetchParts()
  }, [])

  const fetchInvoices = async () => {
    setLoading(true)
    try {
      const res = await api.get('/purchaseinvoice')
      setInvoices(res.data)
    } catch (err) {
      setError('Failed to load invoices.')
    } finally {
      setLoading(false)
    }
  }

  const fetchVendors = async () => {
    try {
      const res = await api.get('/vendor')
      setVendors(res.data)
    } catch (err) {}
  }

  const fetchParts = async () => {
    try {
      const res = await api.get('/part')
      setParts(res.data)
    } catch (err) {}
  }

  const handleItemChange = (index, field, value) => {
    const updated = [...items]
    updated[index][field] = value

    // Auto fill unit price from part catalogue
    if (field === 'partId') {
      const selectedPart = parts.find(p => p.id === parseInt(value))
      if (selectedPart) {
        updated[index].unitPrice = selectedPart.unitPrice
      }
    }

    setItems(updated)
  }

  const addItem = () => {
    setItems([...items, { partId: '', quantity: '', unitPrice: '' }])
  }

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      return sum + (parseFloat(item.quantity || 0) * parseFloat(item.unitPrice || 0))
    }, 0).toFixed(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        vendorId: parseInt(selectedVendor),
        items: items.map(i => ({
          partId: parseInt(i.partId),
          quantity: parseInt(i.quantity),
          unitPrice: parseFloat(i.unitPrice)
        }))
      }
      await api.post('/purchaseinvoice', payload)
      setShowForm(false)
      setSelectedVendor('')
      setItems([{ partId: '', quantity: '', unitPrice: '' }])
      fetchInvoices()
      fetchParts() // refresh parts stock
    } catch (err) {
      setError('Failed to create invoice.')
    }
  }

  const handleMarkPaid = async (id) => {
    try {
      await api.patch(`/purchaseinvoice/${id}/mark-paid`)
      fetchInvoices()
    } catch (err) {
      setError('Failed to mark as paid.')
    }
  }

  return (
    <div>
      <AdminNavbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h2>Purchase Invoices</h2>
          <button
            style={styles.addBtn}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : '+ New Purchase'}
          </button>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        {showForm && (
          <div style={styles.form}>
            <h3>Create Purchase Invoice</h3>

            <div style={styles.field}>
              <label>Select Vendor</label>
              <select
                value={selectedVendor}
                onChange={e => setSelectedVendor(e.target.value)}
                style={styles.input}
                required
              >
                <option value="">Choose vendor...</option>
                {vendors.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>

            <h4 style={{ marginTop: '15px' }}>Items</h4>

            {items.map((item, index) => (
              <div key={index} style={styles.itemRow}>
                <select
                  value={item.partId}
                  onChange={e => handleItemChange(index, 'partId', e.target.value)}
                  style={{ ...styles.input, flex: 2 }}
                  required
                >
                  <option value="">Select Part</option>
                  {parts.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.partNumber})
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={e => handleItemChange(index, 'quantity', e.target.value)}
                  style={{ ...styles.input, flex: 1 }}
                  required
                />

                <input
                  type="number"
                  placeholder="Unit Price"
                  value={item.unitPrice}
                  onChange={e => handleItemChange(index, 'unitPrice', e.target.value)}
                  style={{ ...styles.input, flex: 1 }}
                  required
                />

                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  style={styles.removeBtn}
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addItem}
              style={styles.addItemBtn}
            >
              + Add Item
            </button>

            <div style={styles.total}>
              <strong>Total: Rs. {calculateTotal()}</strong>
            </div>

            <button
              onClick={handleSubmit}
              style={styles.submitBtn}
            >
              Create Invoice
            </button>
          </div>
        )}

        {loading ? <p>Loading...</p> : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Vendor</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Items</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id} style={styles.row}>
                  <td style={styles.td}>{inv.id}</td>
                  <td style={styles.td}>{inv.vendorName}</td>
                  <td style={styles.td}>Rs. {inv.totalAmount}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: inv.status === 'Paid' ? '#27ae60' : '#f39c12'
                    }}>
                      {inv.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {new Date(inv.date).toLocaleDateString()}
                  </td>
                  <td style={styles.td}>
                    {inv.items.map(i => (
                      <div key={i.partId} style={{ fontSize: '12px' }}>
                        {i.partName} × {i.quantity}
                      </div>
                    ))}
                  </td>
                  <td style={styles.td}>
                    {inv.status === 'Pending' && (
                      <button
                        onClick={() => handleMarkPaid(inv.id)}
                        style={styles.paidBtn}
                      >
                        Mark Paid
                      </button>
                    )}
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
    padding: '25px',
    borderRadius: '8px',
    marginBottom: '25px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    maxWidth: '700px'
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    marginBottom: '10px'
  },
  input: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px'
  },
  itemRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    marginBottom: '10px'
  },
  removeBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  addItemBtn: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    marginTop: '5px'
  },
  total: {
    margin: '15px 0',
    fontSize: '18px',
    color: '#1a1a2e'
  },
  submitBtn: {
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '15px'
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
  th: { padding: '12px', textAlign: 'left' },
  row: { borderBottom: '1px solid #eee' },
  td: { padding: '12px' },
  badge: {
    color: 'white',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px'
  },
  paidBtn: {
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    padding: '5px 12px',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  error: { color: 'red' }
}

export default PurchaseInvoicesPage