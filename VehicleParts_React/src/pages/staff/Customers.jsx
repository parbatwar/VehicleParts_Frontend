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
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
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
        setCurrentPage(1)
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
        setCurrentPage(1)
    }
    
    const handleRowClick = (customerId) => {
        navigate(`/staff/customers/${customerId}`)
    }
    
    const displayedCustomers = isSearching ? searchResults : customers
    
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCustomers = displayedCustomers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(displayedCustomers.length / itemsPerPage);

    const goToFirstPage = () => setCurrentPage(1);
    const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
    const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const goToLastPage = () => setCurrentPage(totalPages);

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

                {loading ? (
                    <div className="customers-loading-overlay">
                        <div className="customers-loading-spinner"></div>
                        <p>LOADING CUSTOMERS...</p>
                    </div>
                ) : (
                    <>
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
                                    {currentCustomers.map((c, index) => {
                                        const vehicleCount = c.vehicles?.length || 0
                                        const isSelfRegistered = c.regType === 'Self' || c.regType === 'SelfRegistered'
                                        
                                        return (
                                            <tr 
                                                key={c.id} 
                                                style={styles.tr} 
                                                className="customer-row"
                                                onClick={() => handleRowClick(c.id)}
                                            >
                                                <td style={styles.td}>{indexOfFirstItem + index + 1}</td>
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

                        {!loading && displayedCustomers.length > 0 && (
                            <div className="customers-pagination-container">
                                <div className="customers-pagination-info">
                                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, displayedCustomers.length)} of {displayedCustomers.length} entries
                                </div>
                                <div className="customers-pagination-controls">
                                    <button 
                                        onClick={goToFirstPage} 
                                        disabled={currentPage === 1}
                                        className="customers-pagination-btn"
                                    >
                                        «
                                    </button>
                                    <button 
                                        onClick={goToPrevPage} 
                                        disabled={currentPage === 1}
                                        className="customers-pagination-btn"
                                    >
                                        ‹
                                    </button>
                                    <span className="customers-pagination-current">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button 
                                        onClick={goToNextPage} 
                                        disabled={currentPage === totalPages}
                                        className="customers-pagination-btn"
                                    >
                                        ›
                                    </button>
                                    <button 
                                        onClick={goToLastPage} 
                                        disabled={currentPage === totalPages}
                                        className="customers-pagination-btn"
                                    >
                                        »
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

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