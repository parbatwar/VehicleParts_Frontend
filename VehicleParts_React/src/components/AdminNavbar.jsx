import { useNavigate, Link } from 'react-router-dom'

function AdminNavbar() {
  const navigate = useNavigate()
  const fullName = localStorage.getItem('fullName')

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>
        <span style={styles.brandIcon}>⚙️</span>
        <span>VEHICLE PARTS</span>
      </div>
      <div style={styles.links}>
        <Link to="/admin/dashboard" style={styles.link}>DASHBOARD</Link>
        <Link to="/admin/vendors" style={styles.link}>VENDORS</Link>
        <Link to="/admin/staff" style={styles.link}>STAFF</Link>
      </div>
      <div style={styles.right}>
        <span style={styles.name}>{fullName}</span>
        <button onClick={handleLogout} style={styles.logout}>EXIT</button>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0f0f0f',
    borderBottom: '1px solid #2a2a2a',
    padding: '0 30px',
    height: '64px',
  },
  brand: {
    color: '#e0e0e0',
    fontWeight: 500,
    fontSize: '14px',
    letterSpacing: '2px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  brandIcon: {
    fontSize: '20px',
  },
  links: {
    display: 'flex',
    gap: '32px',
  },
  link: {
    color: '#888',
    textDecoration: 'none',
    fontSize: '11px',
    letterSpacing: '1.5px',
    fontWeight: 500,
    transition: 'color 0.2s',
    padding: '8px 0',
    borderBottom: '2px solid transparent',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  name: {
    color: '#f39c12',
    fontSize: '12px',
    letterSpacing: '0.5px',
  },
  logout: {
    backgroundColor: 'transparent',
    color: '#e74c3c',
    border: '1px solid #e74c3c',
    padding: '6px 16px',
    borderRadius: '2px',
    cursor: 'pointer',
    fontSize: '10px',
    letterSpacing: '1.5px',
    fontWeight: 500,
    transition: 'all 0.2s',
  }
}

export default AdminNavbar