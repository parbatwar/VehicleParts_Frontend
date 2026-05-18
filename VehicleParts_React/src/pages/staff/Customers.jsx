import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import StaffNavbar from '../../components/StaffNavbar'
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

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customer')
      setCustomers(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
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
      fetchCustomers()
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong!')
    }
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setIsSearching(false)
      return
    }
    setIsSearching(true)
    try {
      const res = await api.get(`/customer/search?searchTerm=${searchTerm}`)
      setSearchResults(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSearchClear = () => {
    setSearchTerm('')
    setIsSearching(false)
    setSearchResults([])
  }

  const displayedCustomers = isSearching ? searchResults : customers

  const CustomerCard = ({ c }) => (
    <div className="customer-card">
      <div className="card-header">
        <h4 className="card-name">{c.fullName}</h4>
        <span className="badge">{c.regType}</span>
      </div>
      <div className="card-details">
        <p className="card-text">
          <i className="fas fa-envelope"></i> {c.email}
        </p>
        <p className="card-text">
          <i className="fas fa-phone"></i> {c.phone || 'N/A'}
        </p>
        {c.vehicles && c.vehicles.length > 0 && (
          <div className="vehicle-info">
            <i className="fas fa-car"></i>
            <span>{c.vehicles[0].brand} {c.vehicles[0].model} ({c.vehicles[0].year})</span>
          </div>
        )}
        {c.vehicles && c.vehicles.length > 1 && (
          <div className="more-vehicles">+{c.vehicles.length - 1} more vehicle(s)</div>
        )}
      </div>
    </div>
  )

  return (
    <div className="customers-page">
      <StaffNavbar />

      <div className="customers-container">
        <div className="customers-header">
          <div>
            <h1 className="customers-title">CUSTOMER MANAGEMENT</h1>
            <p className="customers-subtitle">manage customer accounts & vehicles</p>
          </div>
          <button className="add-customer-btn" onClick={() => setShowModal(true)}>
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

        {/* Customer Grid */}
        <div className="customers-section">
          <h3 className="section-title">
            {isSearching ? `SEARCH RESULTS (${searchResults.length})` : `ALL CUSTOMERS (${customers.length})`}
          </h3>
          <div className="customers-grid">
            {displayedCustomers.length === 0
              ? <div className="empty-state">No customers found.</div>
              : displayedCustomers.map(c => <CustomerCard key={c.id} c={c} />)
            }
          </div>
        </div>
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
    </div>
  )
}

export default Customers