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
      <div style={styles.brand}>VehicleParts Admin</div>
      <div style={styles.links}>
        <Link to="/admin/dashboard" style={styles.link}>Dashboard</Link>
        <Link to="/admin/vendors" style={styles.link}>Vendors</Link>
        <Link to="/admin/staff" style={styles.link}>Staff</Link>
      </div>
      <div style={styles.right}>
        <span style={styles.name}>{fullName}</span>
        <button onClick={handleLogout} style={styles.logout}>Logout</button>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a2e',
    padding: '0 30px',
    height: '60px',
  },
  brand: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '18px'
  },
  links: {
    display: 'flex',
    gap: '20px'
  },
  link: {
    color: '#ccc',
    textDecoration: 'none',
    fontSize: '14px'
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  name: {
    color: '#ccc',
    fontSize: '14px'
  },
  logout: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '6px 14px',
    borderRadius: '5px',
    cursor: 'pointer'
  }
}

export default AdminNavbar