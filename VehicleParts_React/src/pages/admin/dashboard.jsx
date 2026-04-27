import { useNavigate, Link } from 'react-router-dom'
import AdminNavbar from '../../components/AdminNavbar'

function AdminDashboard() {
  const fullName = localStorage.getItem('fullName')

  return (
    <div style={styles.wrapper}>
      <AdminNavbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.icon}>🔧</div>
          <div>
            <h2 style={styles.title}>Welcome, {fullName}</h2>
            <p style={styles.subtitle}>garage management system</p>
          </div>
        </div>

        <div style={styles.cards}>
          <Link to="/admin/vendors" style={styles.card}>
            <div style={styles.cardIcon}>🏭</div>
            <h3 style={styles.cardTitle}>Vendors</h3>
            <p style={styles.cardText}>Manage suppliers & parts</p>
            <div style={styles.cardFooter}>ACCESS →</div>
          </Link>
          <Link to="/admin/staff" style={styles.card}>
            <div style={styles.cardIcon}>👷</div>
            <h3 style={styles.cardTitle}>Staff</h3>
            <p style={styles.cardText}>Manage team accounts</p>
            <div style={styles.cardFooter}>ACCESS →</div>
          </Link>
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    backgroundColor: '#0f0f0f',
    backgroundImage: 'radial-gradient(circle at 1px 1px, #1a1a1a 1px, transparent 1px)',
    backgroundSize: '20px 20px',
  },
  container: {
    padding: '30px 40px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '40px',
    paddingBottom: '20px',
    borderBottom: '1px solid #2a2a2a',
  },
  icon: {
    fontSize: '36px',
  },
  title: {
    margin: 0,
    fontSize: '24px',
    fontWeight: 500,
    color: '#e0e0e0',
    letterSpacing: '1px',
  },
  subtitle: {
    margin: '5px 0 0',
    fontSize: '11px',
    color: '#f39c12',
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },
  cards: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
  },
  card: {
    backgroundColor: '#1a1a1a',
    padding: '30px',
    borderRadius: '2px',
    border: '1px solid #2a2a2a',
    textDecoration: 'none',
    width: '240px',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    ':hover': {
      transform: 'translateY(-2px)',
      borderColor: '#f39c12',
    }
  },
  cardIcon: {
    fontSize: '40px',
    marginBottom: '16px',
  },
  cardTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 500,
    color: '#e0e0e0',
    letterSpacing: '1px',
  },
  cardText: {
    margin: '8px 0 0',
    fontSize: '12px',
    color: '#888',
    lineHeight: 1.4,
  },
  cardFooter: {
    marginTop: '20px',
    fontSize: '10px',
    color: '#f39c12',
    letterSpacing: '2px',
    fontWeight: 500,
  }
}

export default AdminDashboard