import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api/axios'

function CustomerProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const fullName = localStorage.getItem('fullName')

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

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
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#f39c12', fontSize: '18px', letterSpacing: '2px' }}>LOADING...</p>
    </div>
  )

  if (!customer) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#ff4d4d', fontSize: '18px' }}>Customer not found.</p>
    </div>
  )

  return (
    <div style={s.page}>
      <style>{`
        .stat-card:hover { border-color: rgba(243,156,18,0.5) !important; transform: translateY(-2px); }
        .vehicle-card:hover { border-color: rgba(243,156,18,0.5) !important; }
        .history-row:hover { background: rgba(255,255,255,0.03) !important; }
        .back-btn:hover { background: rgba(243,156,18,0.1) !important; }
        .logout-btn:hover { background: #ff4d4d !important; color: #fff !important; }
      `}</style>

      {/* Navbar */}
      <div style={s.navbar}>
        <div style={s.navLeft}>
          <button className="back-btn" style={s.backBtn} onClick={() => navigate('/staff/customers')}>
            ← Back
          </button>
          <span style={s.logo}>⚙️ VEHICLE PARTS</span>
        </div>
        <div style={s.navRight}>
          <span style={s.navUser}>👤 {fullName}</span>
          <button className="logout-btn" style={s.logoutBtn} onClick={handleLogout}>LOGOUT</button>
        </div>
      </div>

      <div style={s.content}>

        {/* Hero Section */}
        <div style={s.hero}>
          <div style={s.avatarWrap}>
            <div style={s.avatar}>{customer.fullName.charAt(0)}</div>
            <div style={s.avatarGlow} />
          </div>
          <div style={s.heroInfo}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <h1 style={s.name}>{customer.fullName}</h1>
              <span style={s.badge}>{customer.regType}</span>
            </div>
            <div style={s.contactRow}>
              <span style={s.contactItem}>📧 {customer.email}</span>
              <span style={s.contactDot}>•</span>
              <span style={s.contactItem}>📞 {customer.phone || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div style={s.statsRow}>
          <div className="stat-card" style={s.statCard}>
            <p style={s.statLabel}>CREDIT BALANCE</p>
            <p style={s.statValue}>NPR {customer.creditBalance.toFixed(2)}</p>
          </div>
          <div className="stat-card" style={s.statCard}>
            <p style={s.statLabel}>VEHICLES</p>
            <p style={s.statValue}>{customer.vehicles.length}</p>
          </div>
          <div className="stat-card" style={s.statCard}>
            <p style={s.statLabel}>TOTAL PURCHASES</p>
            <p style={s.statValue}>{customer.purchaseHistory.length}</p>
          </div>
          <div className="stat-card" style={s.statCard}>
            <p style={s.statLabel}>TOTAL SPENT</p>
            <p style={s.statValue}>
              NPR {customer.purchaseHistory.reduce((sum, h) => sum + h.totalAmount, 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Vehicles Section */}
        <div style={s.section}>
          <div style={s.sectionHeader}>
            <h2 style={s.sectionTitle}>🚗 Vehicles</h2>
            <span style={s.sectionCount}>{customer.vehicles.length} registered</span>
          </div>
          {customer.vehicles.length === 0 ? (
            <div style={s.emptyState}>No vehicles registered.</div>
          ) : (
            <div style={s.vehiclesGrid}>
              {customer.vehicles.map(v => (
                <div key={v.id} className="vehicle-card" style={s.vehicleCard}>
                  <div style={s.vehicleIcon}>🚙</div>
                  <h3 style={s.vehicleName}>{v.brand} {v.model}</h3>
                  <div style={s.vehicleDetails}>
                    <div style={s.vehicleDetail}>
                      <span style={s.detailLabel}>YEAR</span>
                      <span style={s.detailValue}>{v.year}</span>
                    </div>
                    <div style={s.vehicleDetail}>
                      <span style={s.detailLabel}>PLATE</span>
                      <span style={s.detailValue}>{v.plateNumber}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Purchase History Section */}
        <div style={s.section}>
          <div style={s.sectionHeader}>
            <h2 style={s.sectionTitle}>📋 Purchase History</h2>
            <span style={s.sectionCount}>{customer.purchaseHistory.length} transactions</span>
          </div>
          {customer.purchaseHistory.length === 0 ? (
            <div style={s.emptyState}>No purchase history found.</div>
          ) : (
            <div style={s.historyTable}>
              <div style={s.historyHead}>
                <span>INVOICE</span>
                <span>AMOUNT</span>
                <span>STATUS</span>
                <span>DATE</span>
              </div>
              {customer.purchaseHistory.map(h => (
                <div key={h.id} className="history-row" style={s.historyRow}>
                  <span style={{ color: '#f39c12', fontWeight: 600 }}>#INV-{h.id}</span>
                  <span style={{ color: '#fff' }}>NPR {h.totalAmount.toFixed(2)}</span>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 700,
                    background: h.paymentStatus === 'Paid' ? 'rgba(46,204,113,0.15)' : h.paymentStatus === 'Credit' ? 'rgba(243,156,18,0.15)' : 'rgba(255,77,77,0.15)',
                    color: h.paymentStatus === 'Paid' ? '#2ecc71' : h.paymentStatus === 'Credit' ? '#f39c12' : '#ff4d4d'
                  }}>
                    {h.paymentStatus.toUpperCase()}
                  </span>
                  <span style={{ color: '#888' }}>{new Date(h.date).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif', display: 'flex', flexDirection: 'column' },
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 40px', background: 'rgba(20,20,20,0.95)', borderBottom: '1px solid rgba(243,156,18,0.2)', position: 'sticky', top: 0, zIndex: 100 },
  navLeft: { display: 'flex', alignItems: 'center', gap: '20px' },
  navRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  logo: { color: '#f39c12', fontSize: '13px', letterSpacing: '3px' },
  navUser: { color: '#888', fontSize: '14px' },
  backBtn: { padding: '8px 16px', background: 'transparent', color: '#f39c12', border: '1px solid rgba(243,156,18,0.4)', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, transition: 'all 0.2s' },
  logoutBtn: { padding: '8px 16px', background: 'rgba(255,77,77,0.15)', color: '#ff4d4d', border: '1px solid rgba(255,77,77,0.3)', borderRadius: '4px', cursor: 'pointer', fontWeight: 700, letterSpacing: '1px', fontSize: '12px', transition: 'all 0.2s' },
  content: { padding: '40px', maxWidth: '1000px', width: '100%', margin: '0 auto' },
  hero: { display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '32px', padding: '36px', background: 'linear-gradient(135deg, #141414 0%, #1a1a1a 100%)', border: '1px solid rgba(243,156,18,0.15)', borderRadius: '16px', position: 'relative', overflow: 'hidden' },
  avatarWrap: { position: 'relative', flexShrink: 0 },
  avatar: { width: '90px', height: '90px', background: '#f39c12', color: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', fontWeight: 700, position: 'relative', zIndex: 1 },
  avatarGlow: { position: 'absolute', top: '-10px', left: '-10px', width: '110px', height: '110px', background: 'rgba(243,156,18,0.15)', borderRadius: '50%', zIndex: 0 },
  heroInfo: { flex: 1 },
  name: { color: '#fff', fontSize: '28px', fontWeight: 700, margin: 0, letterSpacing: '1px' },
  badge: { background: '#f39c12', color: '#000', padding: '4px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', flexShrink: 0 },
  contactRow: { display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px' },
  contactItem: { color: '#888', fontSize: '14px' },
  contactDot: { color: '#333' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' },
  statCard: { background: '#141414', border: '1px solid #222', borderRadius: '12px', padding: '20px', transition: 'all 0.2s', cursor: 'default' },
  statLabel: { color: '#555', fontSize: '11px', letterSpacing: '2px', margin: '0 0 8px 0' },
  statValue: { color: '#f39c12', fontSize: '20px', fontWeight: 700, margin: 0 },
  section: { marginBottom: '32px' },
  sectionHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #1a1a1a' },
  sectionTitle: { color: '#fff', fontSize: '18px', fontWeight: 600, margin: 0 },
  sectionCount: { color: '#555', fontSize: '13px' },
  emptyState: { color: '#444', fontSize: '14px', padding: '20px', textAlign: 'center', background: '#141414', borderRadius: '8px', border: '1px solid #1a1a1a' },
  vehiclesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' },
  vehicleCard: { background: '#141414', border: '1px solid #222', borderRadius: '12px', padding: '24px', transition: 'all 0.2s' },
  vehicleIcon: { fontSize: '32px', marginBottom: '12px' },
  vehicleName: { color: '#fff', fontSize: '16px', fontWeight: 600, margin: '0 0 16px 0' },
  vehicleDetails: { display: 'flex', flexDirection: 'column', gap: '8px' },
  vehicleDetail: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  detailLabel: { color: '#555', fontSize: '11px', letterSpacing: '1px' },
  detailValue: { color: '#ccc', fontSize: '13px', fontWeight: 500 },
  historyTable: { background: '#141414', border: '1px solid #222', borderRadius: '12px', overflow: 'hidden' },
  historyHead: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', padding: '14px 24px', background: '#1a1a1a', color: '#555', fontSize: '11px', letterSpacing: '2px', borderBottom: '1px solid #222' },
  historyRow: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', padding: '16px 24px', borderBottom: '1px solid #1a1a1a', fontSize: '13px', transition: 'background 0.2s', alignItems: 'center' },
}

export default CustomerProfile