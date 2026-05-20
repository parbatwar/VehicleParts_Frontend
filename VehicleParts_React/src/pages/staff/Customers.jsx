import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import StaffNavbar from '../../components/StaffNavbar'
import { styles } from '../../styles/Vendors.styles'
import './Customers.css'

function Customers() {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    password: '', phone: '',
    brand: '', model: '', year: '', plateNumber: ''
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [customers, setCustomers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    setLoading(true)
    try {
      const res = await api.get('/customer')
      setCustomers(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/customer/register', {
        ...form, year: parseInt(form.year)
      })
      setMessage(`Customer ${res.data.fullName} registered successfully!`)
      setForm({
        firstName: '', lastName: '', email: '',
        password: '', phone: '',
        brand: '', model: '', year: '', plateNumber: ''
      })
      setTimeout(() => {
        setShowModal(false)
        setMessage('')
      }, 1500)
      await fetchCustomers()
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setIsSearching(false)
      return
    }
    setIsSearching(true)
    setLoading(true)
    try {
      const res = await api.get(`/customer/search?searchTerm=${searchTerm}`)
      setSearchResults(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchClear = () => {
    setSearchTerm('')
    setIsSearching(false)
    setSearchResults([])
  }

  const handleRowClick = (customerId) => {
    navigate(`/staff/customers/${customerId}`)
  }

  const displayedCustomers = isSearching ? searchResults : customers

  return (
    <div style={styles.wrapper}>
      <StaffNavbar />

      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>CUSTOMER MANAGEMENT</h2>
            <p style={styles.subtitle}>manage customer accounts & vehicles</p>
          </div>
          <button
            style={styles.addBtn}
            onClick={() => setShowModal(true)}
            className="main-action-btn"
          >
            + ADD CUSTOMER
          </button>
        </div>

        {/* Search Bar */}
        <div className="search-section">
          <div className="search-box">
            <input
              className="search-input"
              placeholder="Search by name, phone, email, or plate number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="search-btn" onClick={handleSearch}>SEARCH</button>
            {isSearching && (
              <button className="clear-btn" onClick={handleSearchClear}>CLEAR</button>
            )}
          </div>
        </div>

        {message && (
          <div className="success-message">
            {message}
            <button onClick={() => setMessage('')}>×</button>
          </div>
        )}

        {error && (
          <div style={styles.error}>
            {error}
            <button onClick={() => setError('')} style={styles.errorClose}>×</button>
          </div>
        )}

        {/* Customers Table */}
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>S.N.</th>
                <th style={styles.th}>CUSTOMER NAME</th>
                <th style={styles.th}>EMAIL</th>
                <th style={styles.th}>PHONE</th>
                <th style={styles.th}>VEHICLES</th>
                <th style={styles.th}>REGISTERED</th>
              </tr>
            </thead>
            <tbody>
              {displayedCustomers.map((c, index) => {
                const vehicleCount = c.vehicles?.length || 0
                const isSelfRegistered = c.regType === 'Self' || c.regType === 'SelfRegistered'
                
                return (
                  <tr 
                    key={c.id} 
                    style={styles.tr} 
                    className="customer-row"
                    onClick={() => handleRowClick(c.id)}
                  >
                    <td style={styles.td}>{index + 1}</td>
                    <td style={{...styles.td, color: '#f39c12'}}>{c.fullName}</td>
                    <td style={styles.td}>{c.email}</td>
                    <td style={styles.td}>{c.phone || '—'}</td>
                    <td style={styles.td}>
                      <span className={`vehicle-count ${vehicleCount === 0 ? 'no-vehicle' : ''}`}>
                        {vehicleCount}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span className={`reg-badge ${isSelfRegistered ? 'reg-self' : 'reg-staff'}`}>
                        {isSelfRegistered ? 'SELF' : 'STAFF'}
                      </span>
                    </td>
                  </tr>
                )
              })}
              {displayedCustomers.length === 0 && !loading && (
                <tr>
                  <td colSpan="6" style={styles.emptyState}>
                    NO CUSTOMERS FOUND. {isSearching ? 'TRY A DIFFERENT SEARCH TERM.' : 'CLICK "ADD CUSTOMER" TO GET STARTED.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {loading && <div style={styles.loaderLine} />}
      </div>

      {/* Modal Popup for Add Customer */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>ADD NEW CUSTOMER</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {message && <div className="success-message">{message}</div>}
              {error && <div className="error-message">{error}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="form-section">
                  <h4 className="form-section-title">CUSTOMER INFORMATION</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">FIRST NAME *</label>
                      <input className="form-input" name="firstName" value={form.firstName} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">LAST NAME *</label>
                      <input className="form-input" name="lastName" value={form.lastName} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">EMAIL *</label>
                      <input className="form-input" name="email" type="email" value={form.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">PASSWORD *</label>
                      <input className="form-input" name="password" type="password" value={form.password} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">PHONE NUMBER</label>
                      <input className="form-input" name="phone" value={form.phone} onChange={handleChange} />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h4 className="form-section-title">VEHICLE INFORMATION</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">BRAND *</label>
                      <input className="form-input" name="brand" value={form.brand} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">MODEL *</label>
                      <input className="form-input" name="model" value={form.model} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">YEAR *</label>
                      <input className="form-input" name="year" type="number" value={form.year} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">PLATE NUMBER *</label>
                      <input className="form-input" name="plateNumber" value={form.plateNumber} onChange={handleChange} required />
                    </div>
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>CANCEL</button>
                  <button type="submit" className="submit-btn">REGISTER CUSTOMER</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .customer-row { 
          cursor: pointer; 
          transition: background 0.2s ease;
        }
        .customer-row:hover { 
          background-color: #161616 !important; 
        }
        .main-action-btn:hover { 
          opacity: 0.9; 
          transform: translateY(-1px); 
        }
        
        .vehicle-count {
          display: inline-block;
          padding: 2px 10px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          background-color: rgba(243, 156, 18, 0.15);
          color: #f39c12;
        }
        .vehicle-count.no-vehicle {
          background-color: rgba(102, 102, 102, 0.15);
          color: #666;
        }
        
        .reg-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        .reg-self {
          background-color: rgba(46, 204, 113, 0.15);
          color: #2ecc71;
        }
        .reg-staff {
          background-color: rgba(243, 156, 18, 0.15);
          color: #f39c12;
        }
        
        .search-section {
          margin-bottom: 20px;
        }
        .search-box {
          display: flex;
          gap: 12px;
        }
        .search-input {
          flex: 1;
          padding: 10px 12px;
          background-color: #0a0a0a;
          border: 1px solid #333;
          border-radius: 4px;
          color: #fff;
          font-size: 13px;
          font-family: monospace;
        }
        .search-input:focus {
          border-color: #f39c12;
          outline: none;
        }
        .search-btn {
          padding: 10px 20px;
          background-color: #f39c12;
          color: #000;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
        }
        .search-btn:hover {
          background-color: #e68a00;
        }
        .clear-btn {
          padding: 10px 20px;
          background-color: transparent;
          color: #e74c3c;
          border: 1px solid rgba(231, 76, 60, 0.3);
          border-radius: 4px;
          cursor: pointer;
          font-size: 11px;
          font-weight: 600;
        }
        .clear-btn:hover {
          background-color: rgba(231, 76, 60, 0.1);
        }
        
        .success-message {
          background-color: rgba(46, 204, 113, 0.1);
          border: 1px solid rgba(46, 204, 113, 0.3);
          border-radius: 4px;
          color: #2ecc71;
          font-size: 12px;
          padding: 12px 16px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .success-message button {
          background: none;
          border: none;
          color: inherit;
          font-size: 18px;
          cursor: pointer;
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.92);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 20px;
        }
        .modal-container {
          background: #111;
          border: 1px solid #2a2a2a;
          border-radius: 12px;
          width: 100%;
          max-width: 650px;
          max-height: 85vh;
          overflow-y: auto;
          animation: modalFadeIn 0.2s ease;
        }
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #222;
          background: #0a0a0a;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .modal-header h2 {
          margin: 0;
          color: #f39c12;
          font-size: 18px;
          letter-spacing: 1px;
        }
        .modal-close {
          background: none;
          border: none;
          color: #666;
          font-size: 24px;
          cursor: pointer;
          padding: 0 8px;
        }
        .modal-close:hover {
          color: #e74c3c;
        }
        .modal-body {
          padding: 24px;
        }
        
        .form-section {
          margin-bottom: 24px;
        }
        .form-section-title {
          margin: 0 0 16px 0;
          font-size: 11px;
          color: #888;
          letter-spacing: 1px;
          font-weight: 600;
          text-transform: uppercase;
        }
        .form-row {
          display: flex;
          gap: 16px;
          margin-bottom: 14px;
        }
        .form-group {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-label {
          font-size: 9px;
          color: #666;
          letter-spacing: 1px;
          font-weight: 600;
          text-transform: uppercase;
        }
        .form-input {
          padding: 10px 12px;
          background-color: #0a0a0a;
          border: 1px solid #333;
          border-radius: 4px;
          color: #fff;
          font-size: 13px;
          font-family: monospace;
        }
        .form-input:focus {
          border-color: #f39c12;
          outline: none;
        }
        .error-message {
          background-color: rgba(231, 76, 60, 0.1);
          border: 1px solid rgba(231, 76, 60, 0.3);
          border-radius: 4px;
          padding: 10px 14px;
          margin-bottom: 20px;
          color: #e74c3c;
          font-size: 12px;
        }
        .modal-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid #222;
        }
        .cancel-btn {
          flex: 1;
          padding: 10px;
          background-color: transparent;
          border: 1px solid #e74c3c;
          border-radius: 4px;
          color: #e74c3c;
          cursor: pointer;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1px;
        }
        .cancel-btn:hover {
          background-color: rgba(231, 76, 60, 0.1);
        }
        .submit-btn {
          flex: 1;
          padding: 10px;
          background-color: #f39c12;
          color: #000;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
        }
        .submit-btn:hover {
          background-color: #e68a00;
          transform: translateY(-1px);
        }
        
        @media (max-width: 768px) {
          .form-row {
            flex-direction: column;
            gap: 12px;
          }
          .search-box {
            flex-wrap: wrap;
          }
          .search-input {
            width: 100%;
          }
          .modal-container {
            max-width: 95%;
          }
        }
      `}</style>
    </div>
  )
}

export default Customers