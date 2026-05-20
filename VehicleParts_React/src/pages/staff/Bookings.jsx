import { useState, useEffect } from 'react'
import { Calendar, Clock, Car, Phone, User, CheckCircle, XCircle, Clock as PendingIcon } from 'lucide-react'
import api from '../../api/axios'
import StaffNavbar from '../../components/StaffNavbar'
import './Bookings.css'

function Bookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [updatingId, setUpdatingId] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setError(null)
      const response = await api.get('/appointment')
      let bookingsData = []
      if (Array.isArray(response.data)) {
        bookingsData = response.data
      } else if (response.data?.$values) {
        bookingsData = response.data.$values
      }
      setBookings(bookingsData)
    } catch (error) {
      console.error('Error fetching bookings:', error)
      setError(error.response?.data?.message || 'Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, newStatus) => {
    setUpdatingId(id)
    try {
      await api.patch(`/appointment/${id}/status`, { status: newStatus })
      await fetchBookings()
    } catch (error) {
      console.error('Error updating status:', error)
      setError('Failed to update status.')
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusText = (status) => {
    if (typeof status === 'number') {
      const map = { 0: 'pending', 1: 'confirmed', 2: 'done', 3: 'cancelled' }
      return map[status] || 'pending'
    }
    return status?.toLowerCase() || 'pending'
  }

  const getStatusIcon = (status) => {
    const s = getStatusText(status)
    switch (s) {
      case 'confirmed': return <CheckCircle size={14} />
      case 'done': return <CheckCircle size={14} />
      case 'cancelled': return <XCircle size={14} />
      default: return <PendingIcon size={14} />
    }
  }

  const getStatusClass = (status) => {
    const s = getStatusText(status)
    switch (s) {
      case 'confirmed': return 'status-confirmed'
      case 'done': return 'status-completed'
      case 'cancelled': return 'status-cancelled'
      default: return 'status-pending'
    }
  }

  const filteredBookings = bookings.filter(booking => {
    const s = getStatusText(booking.status)
    if (filter === 'all') return true
    if (filter === 'completed') return s === 'done'
    return s === filter.toLowerCase()
  })

  return (
    <div className="bookings-page">
      <StaffNavbar />
      <div className="bookings-container">

        <div className="bookings-header">
        <div>
            <h1 className="bookings-title">BOOKINGS</h1>
            <p className="bookings-subtitle">manage customer appointments</p>
        </div>
        <div className="stats-badge">
            <span className="stats-count">{bookings.length}</span>
            <span className="stats-label">Total Bookings</span>
        </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(231,76,60,0.1)',
            border: '1px solid rgba(231,76,60,0.3)',
            borderRadius: '8px',
            padding: '12px 16px',
            color: '#e74c3c',
            marginBottom: '16px',
            fontSize: '13px',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer' }}
            >×</button>
          </div>
        )}

        <div className="filter-tabs">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(f => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="bookings-loading">
            <div className="loading-spinner"></div>
            <p>LOADING BOOKINGS...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="empty-state">
            <Calendar size={48} strokeWidth={1} />
            <p>No bookings found</p>
          </div>
        ) : (
          <div className="bookings-list">
            {filteredBookings.map(booking => (
              <div key={booking.id} className="booking-card">
                <div className="booking-card-header">
                  <div className="booking-id">#{booking.id}</div>
                  <div className={`status-badge ${getStatusClass(booking.status)}`}>
                    {getStatusIcon(booking.status)}
                    {getStatusText(booking.status).toUpperCase()}
                  </div>
                </div>

                <div className="booking-card-body">
                  <div className="customer-section">
                    <div className="section-label">CUSTOMER</div>
                    <div className="customer-name">
                      <User size={16} />
                      <span>{booking.customerName || 'N/A'}</span>
                    </div>
                    <div className="customer-phone">
                      <Phone size={14} />
                      <span>{booking.customerPhone || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="divider"></div>

                  <div className="details-section">
                    <div className="detail-row">
                      <Car size={16} />
                      <span className="detail-label">Vehicle:</span>
                      <span className="detail-value">{booking.vehicle || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                      <Calendar size={16} />
                      <span className="detail-label">Date:</span>
                      <span className="detail-value">
                        {booking.date ? new Date(booking.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : 'N/A'}
                      </span>
                    </div>
                    <div className="detail-row">
                      <Clock size={16} />
                      <span className="detail-label">Booked:</span>
                      <span className="detail-value">
                        {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    {booking.notes && (
                      <div className="notes-section">
                        <span className="detail-label">Notes:</span>
                        <p className="notes-text">{booking.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="booking-card-footer">
                  {getStatusText(booking.status) === 'pending' && (
                    <>
                      <button
                        className="action-btn confirm"
                        onClick={() => updateStatus(booking.id, 'Confirmed')}
                        disabled={updatingId === booking.id}
                      >
                        {updatingId === booking.id ? '...' : 'Confirm'}
                      </button>
                      <button
                        className="action-btn cancel"
                        onClick={() => updateStatus(booking.id, 'Cancelled')}
                        disabled={updatingId === booking.id}
                      >
                        {updatingId === booking.id ? '...' : 'Cancel'}
                      </button>
                    </>
                  )}
                  {getStatusText(booking.status) === 'confirmed' && (
                    <>
                      <button
                        className="action-btn complete"
                        onClick={() => updateStatus(booking.id, 'Done')}
                        disabled={updatingId === booking.id}
                      >
                        {updatingId === booking.id ? '...' : 'Mark Done'}
                      </button>
                      <button
                        className="action-btn cancel"
                        onClick={() => updateStatus(booking.id, 'Cancelled')}
                        disabled={updatingId === booking.id}
                      >
                        {updatingId === booking.id ? '...' : 'Cancel'}
                      </button>
                    </>
                  )}
                  {getStatusText(booking.status) === 'done' && (
                    <div className="completed-badge">✓ Done</div>
                  )}
                  {getStatusText(booking.status) === 'cancelled' && (
                    <div className="cancelled-badge">✗ Cancelled</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Bookings