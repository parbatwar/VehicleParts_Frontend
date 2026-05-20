import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Car, ShoppingBag, Wrench, ArrowLeft, Phone, Mail, Package, Calendar } from 'lucide-react'
import api from '../../api/axios'
import StaffNavbar from '../../components/StaffNavbar'
import './CustomerProfile.css'

function CustomerProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('vehicles')
  const [partRequests, setPartRequests] = useState([])

  useEffect(() => {
    fetchCustomer()
  }, [id])

    const fetchCustomer = async () => {
        try {
            const res = await api.get(`/customer/${id}/history`)
            setCustomer(res.data)
            // After customer is loaded, fetch appointments and part requests
            await Promise.all([
            fetchAppointments(res.data),
            fetchPartRequests(res.data)
            ])
        } catch (err) {
            console.error(err)
            setLoading(false)
        }
    }

  const fetchAppointments = async (customerData) => {
    try {
      const res = await api.get('/appointment')
      console.log('All appointments:', res.data) // Debug: see what's coming
      console.log('Current customer:', customerData) // Debug: see customer data
      
      // Filter appointments for this customer by name or phone
      const customerAppointments = res.data.filter(
        appointment => 
          appointment.customerName === customerData.fullName ||
          appointment.customerPhone === customerData.phone
      )
      
      console.log('Filtered appointments:', customerAppointments) // Debug
      setAppointments(customerAppointments)
    } catch (err) {
      console.error('Error fetching appointments:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchPartRequests = async (customerData) => {
    try {
        const res = await api.get('/partrequest')
        console.log('All part requests:', res.data)
        console.log('Current customer:', customerData)
        
        // Filter part requests for this customer by name or phone
        const customerPartRequests = res.data.filter(
        request => 
            request.customerName === customerData.fullName ||
            request.customerPhone === customerData.phone
        )
        
        console.log('Filtered part requests:', customerPartRequests)
        setPartRequests(customerPartRequests)
    } catch (err) {
        console.error('Error fetching part requests:', err)
    }
  }

  if (loading) return (
    <div className="customer-profile">
      <StaffNavbar />
      <div className="profile-loader-container">
        <div className="profile-loader"></div>
        <p>LOADING CUSTOMER DETAILS...</p>
      </div>
    </div>
  )

  if (!customer) return (
    <div className="customer-profile">
      <StaffNavbar />
      <div className="profile-error-container">
        <p>Customer not found.</p>
        <button className="profile-back-btn" onClick={() => navigate('/staff/customers')}>BACK TO CUSTOMERS</button>
      </div>
    </div>
  )

    // Helper function to get appointment status text from enum
    const getAppointmentStatusText = (status) => {
        switch(status) {
        case 0: return 'PENDING';
        case 1: return 'CONFIRMED';
        case 2: return 'COMPLETED';
        case 3: return 'CANCELLED';
        default: return 'PENDING';
        }
    }

    // Helper function to get appointment status CSS class
    const getAppointmentStatusClass = (status) => {
        switch(status) {
        case 0: return 'status-pending';
        case 1: return 'status-confirmed';
        case 2: return 'status-completed';
        case 3: return 'status-cancelled';
        default: return 'status-pending';
        }
    }

    // Helper function to get part request status text from enum
    const getPartRequestStatusText = (status) => {
    switch(status) {
        case 0: return 'PENDING';
        case 1: return 'APPROVED';
        case 2: return 'FULFILLED';
        case 3: return 'REJECTED';
        default: return 'PENDING';
    }
    }

    // Helper function to get part request status CSS class
    const getPartRequestStatusClass = (status) => {
    switch(status) {
        case 0: return 'status-pending';
        case 1: return 'status-approved';
        case 2: return 'status-fulfilled';
        case 3: return 'status-rejected';
        default: return 'status-pending';
    }
    }

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
          <button className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>
            <Calendar size={16} /> BOOKINGS
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
                    <th style={{ width: '50px', textAlign: 'center' }}>S.N.</th>
                    <th style={{ width: '80px' }}>INVOICE</th>
                    <th>ITEM</th>
                    <th style={{ width: '60px', textAlign: 'center' }}>QTY</th>
                    <th style={{ width: '120px' }}>AMOUNT</th>
                    <th style={{ width: '90px' }}>STATUS</th>
                    <th style={{ width: '100px', textAlign: 'center' }}>DATE</th>
                    </tr>
                </thead>
                <tbody>
                    {(() => {
                    let serialNumber = 0;
                    return customer.purchaseHistory?.flatMap((purchase) =>
                        purchase.items?.map((item, idx) => {
                        serialNumber++;
                        return (
                            <tr key={`${purchase.id}-${idx}`}>
                            <td style={{ textAlign: 'center', color: '#666' }}>{serialNumber}</td>
                            <td className="invoice-id">#{purchase.id}</td>
                            <td className="item-name">{item.partName}</td>
                            <td className="qty-cell" style={{ textAlign: 'center' }}>{item.quantity}</td>
                            <td className="amount">Rs. {(item.price * item.quantity)?.toLocaleString() || '—'}</td>
                            <td>
                                <span className={`status-badge ${purchase.paymentStatus?.toLowerCase() || 'paid'}`}>
                                {purchase.paymentStatus?.toUpperCase() || 'PAID'}
                                </span>
                            </td>
                            <td className="date" style={{ textAlign: 'center' }}>{new Date(purchase.date).toLocaleDateString()}</td>
                            </tr>
                        );
                        })
                    );
                    })()}
                </tbody>
                </table>
            </div>
            )}
        </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
        <div className="tab-content">
            {appointments.length === 0 ? (
            <div className="empty-state">No bookings found.</div>
            ) : (
            <div className="table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th style={{ width: '56px', textAlign: 'center' }}>S.N.</th>
                            <th style={{ width: '180px' }}>DATE & TIME</th>
                            <th style={{ width: '150px' }}>VEHICLE</th>
                            <th>NOTES</th>
                            <th style={{ width: '100px' }}>STATUS</th>
                            <th style={{ width: '110px' }}>BOOKED ON</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((appointment, index) => (
                        <tr key={appointment.id}>
                            <td style={{ textAlign: 'center', color: '#666', width: '50px' }}>{index + 1}</td>
                            <td className="date">
                            <div>{new Date(appointment.date).toLocaleDateString()}</div>
                            <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>
                                {new Date(appointment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            </td>
                            <td>{appointment.vehicle || '—'}</td>
                            <td className="notes-cell">{appointment.notes || '—'}</td>
                            <td>
                            <span className={`status-badge ${getAppointmentStatusClass(appointment.status)}`}>
                                {getAppointmentStatusText(appointment.status)}
                            </span>
                            </td>
                            <td className="date">{new Date(appointment.createdAt).toLocaleDateString()}</td>
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
            {partRequests.length === 0 ? (
            <div className="empty-state">No part requests found.</div>
            ) : (
            <div className="table-wrapper">
                <table className="data-table">
                <thead>
                    <tr>
                    <th style={{ width: '50px', textAlign: 'center' }}>S.N.</th>
                    <th style={{ width: '200px' }}>PART NAME</th>
                    <th>DESCRIPTION</th>
                    <th style={{ width: '70px', textAlign: 'center' }}>QTY</th>
                    <th style={{ width: '100px' }}>STATUS</th>
                    <th style={{ width: '110px' }}>REQUESTED ON</th>
                    </tr>
                </thead>
                <tbody>
                    {partRequests.map((request, index) => (
                    <tr key={request.id}>
                        <td style={{ textAlign: 'center', color: '#666' }}>{index + 1}</td>
                        <td className="request-part">{request.partName}</td>
                        <td className="notes-cell">{request.description || '—'}</td>
                        <td className="qty-cell" style={{ textAlign: 'center' }}>{request.quantity || 1}</td>
                        <td>
                        <span className={`status-badge ${getPartRequestStatusClass(request.status)}`}>
                            {getPartRequestStatusText(request.status)}
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