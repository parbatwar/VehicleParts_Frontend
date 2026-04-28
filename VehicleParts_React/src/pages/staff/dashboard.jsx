import { useNavigate } from 'react-router-dom'

function StaffDashboard() {
  const navigate = useNavigate()
  const fullName = localStorage.getItem('fullName')

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>⚙️ VEHICLE PARTS</h2>
        <nav>
          <button style={styles.navBtn} onClick={() => navigate('/staff/customers')}>
            👥 Customers
          </button>
        </nav>
        <button style={styles.logoutBtn} onClick={handleLogout}>LOGOUT</button>
      </div>
      <div style={styles.main}>
        <h1 style={styles.welcome}>Welcome, {fullName}</h1>
        <p style={{ color: '#999' }}>Select an option from the sidebar</p>
      </div>
    </div>
  )
}

const styles = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fff' },
  sidebar: { width: '240px', backgroundColor: '#141414', borderRight: '1px solid #222', padding: '30px 20px', display: 'flex', flexDirection: 'column' },
  logo: { color: '#f39c12', fontSize: '14px', letterSpacing: '2px', marginBottom: '40px' },
  navBtn: { width: '100%', padding: '12px', backgroundColor: 'transparent', color: '#fff', border: '1px solid #333', borderRadius: '4px', cursor: 'pointer', textAlign: 'left', marginBottom: '10px', fontSize: '14px' },
  logoutBtn: { marginTop: 'auto', padding: '12px', backgroundColor: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 700, letterSpacing: '2px' },
  main: { flex: 1, padding: '40px' },
  welcome: { color: '#f39c12', letterSpacing: '2px' }
}

export default StaffDashboard