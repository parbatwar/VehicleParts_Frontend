import { useNavigate, Link } from 'react-router-dom'
import AdminNavbar from '../../components/AdminNavbar'

function AdminDashboard() {
  const fullName = localStorage.getItem('fullName')

  return (
    <div>
      <AdminNavbar />
      <div style={styles.container}>
        <h2>Welcome, {fullName} 👋</h2>
        <p style={styles.subtitle}>What would you like to manage today?</p>

        <div style={styles.cards}>
          <Link to="/admin/vendors" style={styles.card}>
            <h3>🏭 Vendors</h3>
            <p>Manage your suppliers</p>
          </Link>
          <Link to="/admin/staff" style={styles.card}>
            <h3>👷 Staff</h3>
            <p>Manage staff accounts</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { padding: '30px' },
  subtitle: { color: '#888', marginBottom: '30px' },
  cards: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap'
  },
  card: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textDecoration: 'none',
    color: '#1a1a2e',
    width: '200px',
    transition: 'transform 0.2s',
  }
}

export default AdminDashboard