import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Car, ShoppingBag, Wrench, ArrowLeft, Phone, Mail, Package } from 'lucide-react'
import api from '../../api/axios'
import StaffNavbar from '../../components/StaffNavbar'
import './CustomerProfile.css'

function CustomerProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('vehicles')

  useEffect(() => {
    fetchCustomer()
  }, [id])

  const fetchCustomer = async () => {
    try {
      const res = await api.get(`/customer/${id}/history`)
      setCustomer(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="profile-loading">
      <StaffNavbar />
      <div className="profile-loader-container">
        <div className="profile-loader"></div>
        <p>LOADING CUSTOMER DETAILS...</p>
      </div>
    </div>
  )

  if (!customer) return (
    <div className="profile-loading">
      <StaffNavbar />
      <div className="profile-error-container">
        <p>Customer not found.</p>
        <button className="profile-back-btn" onClick={() => navigate('/staff/customers')}>BACK TO CUSTOMERS</button>
      </div>
    </div>
  )

  const totalSpent = customer.purchaseHistory?.reduce((sum, h) => sum + (h.totalAmount || 0), 0) || 0

  return (
    <div className="customer-profile">
      <StaffNavbar />

      <div className="profile-container">
        {/* Back Button */}
        <button className="back-button" onClick={() => navigate('/staff/customers')}>
          <ArrowLeft size={16} /> BACK TO CUSTOMERS
        </button>

        {/* Header Section */}
        <div className="profile-header">
          <div className="profile-avatar">
            <span className="avatar-initial">{customer.fullName?.charAt(0)}</span>
          </div>
          <div className="profile-info">
            <div className="name-row">
              <h1 className="profile-name">{customer.fullName}</h1>
              <span className={`reg-badge ${customer.regType === 'Self' ? 'reg-self' : 'reg-staff'}`}>
                {customer.regType === 'Self' ? 'SELF' : 'STAFF'}
              </span>
            </div>
            <div className="contact-row">
              <span className="contact-item"><Mail size={14} /> {customer.email}</span>
              <span className="contact-dot">•</span>
              <span className="contact-item"><Phone size={14} /> {customer.phone || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Tabs */} 
        <div className="profile-tabs">
          <button className={`tab-btn ${activeTab === 'vehicles' ? 'active' : ''}`} onClick={() => setActiveTab('vehicles')}>
            <Car size={16} /> VEHICLES
          </button>
          <button className={`tab-btn ${activeTab === 'purchases' ? 'active' : ''}`} onClick={() => setActiveTab('purchases')}>
            <ShoppingBag size={16} /> PURCHASES
          </button>
          <button className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`} onClick={() => setActiveTab('services')}>
            <Wrench size={16} /> SERVICES
          </button>
          <button className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => setActiveTab('requests')}>
            <Package size={16} /> PART REQUESTS
          </button>
        </div>

    {/* Vehicles Tab */}
    {activeTab === 'vehicles' && (
    <div className="tab-content">
        {customer.vehicles?.length === 0 ? (
        <div className="empty-state">No vehicles registered.</div>
        ) : (
        <div className="vehicles-card-grid">
            {customer.vehicles?.map(vehicle => (
            <div key={vehicle.id} className="vehicle-card-proper">
                <div className="vehicle-card-header">
                <div className="vehicle-icon-badge">
                    <Car size={20} />
                </div>
                <div className="vehicle-year-badge">{vehicle.year}</div>
                </div>
                <div className="vehicle-card-body">
                <div className="vehicle-brand-name">{vehicle.brand}</div>
                <div className="vehicle-model-name">{vehicle.model}</div>
                </div>
                <div className="vehicle-card-footer">
                <div className="plate-number-proper">{vehicle.plateNumber}</div>
                </div>
            </div>
            ))}
        </div>
        )}
    </div>
    )}
        {/* Purchases Tab */}
        {activeTab === 'purchases' && (
        <div className="tab-content">
            {customer.purchaseHistory?.length === 0 ? (
            <div className="empty-state">No purchase history found.</div>
            ) : (
            <div className="table-wrapper">
                <table className="data-table">
                <thead>
                    <tr>
                    <th>INVOICE</th>
                    <th>ITEM</th>
                    <th>QTY</th>
                    <th>AMOUNT</th>
                    <th>STATUS</th>
                    <th>DATE</th>
                    </tr>
                </thead>
                <tbody>
                    {customer.purchaseHistory?.flatMap(purchase => 
                    purchase.items?.map((item, idx) => (
                        <tr key={`${purchase.id}-${idx}`}>
                        <td className="invoice-id">#{purchase.id}</td>
                        <td className="item-name">{item.partName}</td>
                        <td className="qty-cell">{item.quantity}</td>
                        <td className="amount">
                            Rs. {(item.price * item.quantity)?.toLocaleString() || '—'}
                        </td>
                        <td>
                            <span className={`status-badge ${purchase.paymentStatus?.toLowerCase() || 'paid'}`}>
                            {purchase.paymentStatus?.toUpperCase() || 'PAID'}
                            </span>
                        </td>
                        <td className="date">{new Date(purchase.date).toLocaleDateString()}</td>
                        </tr>
                    ))
                    )}
                </tbody>
                </table>
            </div>
            )}
        </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="tab-content">
            {customer.serviceHistory?.length === 0 ? (
              <div className="empty-state">No service history found.</div>
            ) : (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>DATE</th>
                      <th>SERVICE</th>
                      <th>VEHICLE</th>
                      <th>NOTES</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customer.serviceHistory?.map(service => (
                      <tr key={service.id}>
                        <td className="date">{new Date(service.date).toLocaleDateString()}</td>
                        <td>{service.serviceType || 'General Service'}</td>
                        <td>{service.vehicleName || '—'}</td>
                        <td className="notes-cell">{service.notes || '—'}</td>
                        <td>
                          <span className={`status-badge ${service.status?.toLowerCase() || 'completed'}`}>
                            {service.status?.toUpperCase() || 'COMPLETED'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Part Requests Tab */}
        {activeTab === 'requests' && (
          <div className="tab-content">
            {customer.partRequests?.length === 0 ? (
              <div className="empty-state">No part requests found.</div>
            ) : (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>PART NAME</th>
                      <th>DESCRIPTION</th>
                      <th>QTY</th>
                      <th>STATUS</th>
                      <th>REQUESTED ON</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customer.partRequests?.map(request => (
                      <tr key={request.id}>
                        <td className="request-part">{request.partName}</td>
                        <td className="notes-cell">{request.description || '—'}</td>
                        <td className="qty-cell">{request.quantity || 1}</td>
                        <td>
                          <span className={`status-badge ${request.status?.toLowerCase() || 'pending'}`}>
                            {request.status?.toUpperCase() || 'PENDING'}
                          </span>
                        </td>
                        <td className="date">{new Date(request.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerProfile