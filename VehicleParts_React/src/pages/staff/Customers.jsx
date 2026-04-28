import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import './Customers.css'

function Customers() {
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
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
  const fullName = localStorage.getItem('fullName')

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

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
      setShowForm(false)
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
      <p className="card-text">📧 {c.email}</p>
      <p className="card-text">📞 {c.phone || 'N/A'}</p>
      {c.vehicles.map(v => (
        <p key={v.id} className="card-text">
          🚗 {v.brand} {v.model} ({v.year}) — {v.plateNumber}
        </p>
      ))}
    </div>
  )

  return (
    <div className="customers-container">

      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="sidebar-logo">⚙️ VEHICLE PARTS</h2>
        <nav>
          <button className="nav-btn" onClick={() => navigate('/staff/dashboard')}>
            🏠 Dashboard
          </button>
          <button className="nav-btn active">
            👥 Customers
          </button>
        </nav>
        <div className="user-info">
          <p className="user-label">LOGGED IN AS</p>
          <p className="user-name">{fullName}</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>LOGOUT</button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="top-bar">
          <h1 className="page-title">CUSTOMER MANAGEMENT</h1>
          <button className="add-btn" onClick={() => { setShowForm(!showForm); setMessage(''); setError('') }}>
            {showForm ? '✕ Cancel' : '+ Add Customer'}
          </button>
        </div>

        {/* Search Bar - Always Visible */}
        <div className="search-box">
          <input
            className="search-input"
            placeholder="Search by name, phone, email, plate number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="search-btn" onClick={handleSearch}>SEARCH</button>
          {isSearching && (
            <button className="clear-btn" onClick={handleSearchClear}>CLEAR</button>
          )}
        </div>

        {/* Register Form - Toggle */}
        {showForm && (
          <div className="form-container">
            <h3 className="section-title">NEW CUSTOMER REGISTRATION</h3>
            {message && <div className="success-msg">{message}</div>}
            {error && <div className="error-msg">{error}</div>}
            <form onSubmit={handleSubmit}>
              <p className="form-section-title">CUSTOMER INFO</p>
              <div className="form-row">
                <input className="form-input" name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} required />
                <input className="form-input" name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} required />
              </div>
              <div className="form-row">
                <input className="form-input" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                <input className="form-input" name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
              </div>
              <div className="form-row">
                <input className="form-input" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
              </div>

              <p className="form-section-title">VEHICLE INFO</p>
              <div className="form-row">
                <input className="form-input" name="brand" placeholder="Brand (e.g. Toyota)" value={form.brand} onChange={handleChange} required />
                <input className="form-input" name="model" placeholder="Model (e.g. Corolla)" value={form.model} onChange={handleChange} required />
              </div>
              <div className="form-row">
                <input className="form-input" name="year" type="number" placeholder="Year (e.g. 2020)" value={form.year} onChange={handleChange} required />
                <input className="form-input" name="plateNumber" placeholder="Plate Number" value={form.plateNumber} onChange={handleChange} required />
              </div>
              <button type="submit" className="submit-btn">REGISTER CUSTOMER</button>
            </form>
          </div>
        )}

        {/* Customer List */}
        <h3 className="section-title">
          {isSearching ? `Search Results (${searchResults.length})` : `All Customers (${customers.length})`}
        </h3>
        {displayedCustomers.length === 0
          ? <p className="card-text">No customers found.</p>
          : displayedCustomers.map(c => <CustomerCard key={c.id} c={c} />)
        }
      </div>
    </div>
  )
}

export default Customers