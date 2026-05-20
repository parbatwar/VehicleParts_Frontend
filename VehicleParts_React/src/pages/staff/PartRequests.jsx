import { useState, useEffect } from 'react'
import { Package, Phone, User, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import api from '../../api/axios'
import StaffNavbar from '../../components/StaffNavbar'
import './PartRequests.css'

function PartRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [updatingId, setUpdatingId] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      setError(null)
      const response = await api.get('/partrequest')
      let requestsData = []
      if (Array.isArray(response.data)) {
        requestsData = response.data
      } else if (response.data && Array.isArray(response.data.$values)) {
        requestsData = response.data.$values
      } else if (response.data && response.data.data) {
        requestsData = response.data.data
      }
      setRequests(requestsData)
    } catch (error) {
      console.error('Error fetching part requests:', error)
      setError(error.response?.data?.message || 'Failed to load part requests')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, newStatus) => {
    setUpdatingId(id)
    try {
      await api.patch(`/partrequest/${id}/status`, { status: newStatus })
      await fetchRequests()
    } catch (error) {
      console.error('Error updating status:', error)
      setError(error.response?.data?.message || 'Failed to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusText = (status) => {
    if (typeof status === 'number') {
        const map = { 0: 'open', 1: 'fulfilled', 2: 'rejected' }
        return map[status] || 'open'
    }
    return status?.toLowerCase() || 'open'
  }

  const getStatusIcon = (status) => {
    const s = getStatusText(status)
    switch (s) {
      case 'approved': return <CheckCircle size={14} />
      case 'fulfilled': return <Package size={14} />
      case 'rejected': return <XCircle size={14} />
      default: return <AlertCircle size={14} />
    }
  }

    const getStatusClass = (status) => {
        const s = getStatusText(status)
        switch (s) {
            case 'fulfilled': return 'status-fulfilled'
            case 'rejected': return 'status-rejected'
            default: return 'status-open'
        }
    }

  const filteredRequests = requests.filter(request => {
    const s = getStatusText(request.status)
    const matchesFilter = filter === 'all' || s === filter.toLowerCase()
    return matchesFilter
  })

  if (loading) {
    return (
      <div className="requests-page">
        <StaffNavbar />
        <div className="requests-loading">
          <div className="loading-spinner"></div>
          <p>LOADING PART REQUESTS...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="requests-page">
        <StaffNavbar />
        <div className="requests-error">
          <p>{error}</p>
          <button onClick={fetchRequests}>Retry</button>
        </div>
      </div>
    )
  }

  return (
    <div className="requests-page">
      <StaffNavbar />
      <div className="requests-container">
        <div className="requests-header">
          <div className="header-title">
            <Package size={24} />
            <h1>Part Requests</h1>
          </div>
          <div className="stats-badge">
            <span className="stats-count">{requests.length}</span>
            <span className="stats-label">Total Requests</span>
          </div>
        </div>

        <div className="filter-tabs">
          {['all', 'open', 'fulfilled', 'rejected'].map(f => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {filteredRequests.length === 0 ? (
          <div className="empty-state">
            <Package size={48} strokeWidth={1} />
            <p>No part requests found</p>
          </div>
        ) : (
          <div className="requests-list">
            {filteredRequests.map(request => (
              <div key={request.id} className="request-card">
                <div className="request-card-header">
                  <div className="request-id">#{request.id}</div>
                  <div className={`status-badge ${getStatusClass(request.status)}`}>
                    {getStatusIcon(request.status)}
                    {getStatusText(request.status).toUpperCase()}
                  </div>
                </div>

                <div className="request-card-body">
                  <div className="customer-section">
                    <div className="section-label">CUSTOMER</div>
                    <div className="customer-name">
                      <User size={16} />
                      <span>{request.customerName || 'N/A'}</span>
                    </div>
                    <div className="customer-phone">
                      <Phone size={14} />
                      <span>{request.customerPhone || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="divider"></div>

                  <div className="details-section">
                    <div className="part-detail">
                      <div className="detail-header">
                        <Package size={16} />
                        <span className="detail-label">Part Name:</span>
                      </div>
                      <div className="part-name">{request.partName || 'N/A'}</div>
                    </div>

                    {request.description && (
                      <div className="description-section">
                        <span className="detail-label">Description:</span>
                        <p className="description-text">{request.description}</p>
                      </div>
                    )}

                    <div className="detail-row">
                      <Clock size={16} />
                      <span className="detail-label">Requested on:</span>
                      <span className="detail-value">
                        {request.createdAt ? new Date(request.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="request-card-footer">
                {getStatusText(request.status) === 'open' && (
                    <>
                    <button className="action-btn fulfill" onClick={() => updateStatus(request.id, 'Fulfilled')} disabled={updatingId === request.id}>
                        {updatingId === request.id ? '...' : 'Mark Fulfilled'}
                    </button>
                    <button className="action-btn reject" onClick={() => updateStatus(request.id, 'Rejected')} disabled={updatingId === request.id}>
                        {updatingId === request.id ? '...' : 'Reject'}
                    </button>
                    </>
                )}
                {getStatusText(request.status) === 'fulfilled' && (
                    <>
                    <span className="fulfilled-badge">✓ Fulfilled</span>
                    <button className="action-btn reject" onClick={() => updateStatus(request.id, 'Open')} disabled={updatingId === request.id}>
                        {updatingId === request.id ? '...' : 'Revert to Open'}
                    </button>
                    </>
                )}
                {getStatusText(request.status) === 'rejected' && (
                    <>
                    <span className="rejected-badge">✗ Rejected</span>
                    <button className="action-btn fulfill" onClick={() => updateStatus(request.id, 'Open')} disabled={updatingId === request.id}>
                        {updatingId === request.id ? '...' : 'Revert to Open'}
                    </button>
                    </>
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

export default PartRequests