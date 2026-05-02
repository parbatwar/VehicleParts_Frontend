import { useNavigate, Link } from 'react-router-dom';
import { Truck, Users, ArrowRight, LayoutDashboard, Package, ShoppingCart } from 'lucide-react';
import AdminNavbar from '../../components/AdminNavbar';

function AdminDashboard() {
  const fullName = localStorage.getItem('fullName') || 'Admin';

  return (
    <div style={styles.wrapper}>
      <AdminNavbar />
      
      <div style={styles.container}>
        {/* Page Header */}
        <div style={styles.header}>
          {/* <div style={styles.headerIconContainer}>
            <LayoutDashboard size={28} color="#f39c12" />
          </div> */}
          <div>
            <h2 style={styles.title}>Welcome back, {fullName}</h2>
            <p style={styles.subtitle}>Garage management system overview</p>
          </div>
        </div>

        {/* Navigation Cards */}
        <div style={styles.cards}>
            {/* Vendors Card */}
            <Link to="/admin/vendors" style={styles.card} className="dashboard-card">
                <div style={styles.cardIconBox}>
                <Truck size={30} strokeWidth={1.5} color="#f39c12" />
                </div>
                <h3 style={styles.cardTitle}>Vendors</h3>
                <p style={styles.cardText}>
                Manage your parts suppliers, contact details, and inventory logistics.
                </p>
                <div style={styles.cardFooter}>
                Manage Vendors <ArrowRight size={14} style={{ marginLeft: '8px' }} />
                </div>
            </Link>

            {/* Staff Card */}
            <Link to="/admin/staff" style={styles.card} className="dashboard-card">
                <div style={styles.cardIconBox}>
                <Users size={30} strokeWidth={1.5} color="#f39c12" />
                </div>
                <h3 style={styles.cardTitle}>Staff</h3>
                <p style={styles.cardText}>
                Control system access, manage team accounts, and update permissions.
                </p>
                <div style={styles.cardFooter}>
                Manage Team <ArrowRight size={14} style={{ marginLeft: '8px' }} />
                </div>
            </Link>

            {/* Parts Card */}
            <Link to="/admin/parts" style={styles.card} className="dashboard-card">
            <div style={styles.cardIconBox}>
                <Package size={30} strokeWidth={1.5} color="#f39c12" />
            </div>
            <h3 style={styles.cardTitle}>Parts</h3>
            <p style={styles.cardText}>
                Manage parts inventory, track stock levels, and set reorder alerts.
            </p>
            <div style={styles.cardFooter}>
                Manage Inventory <ArrowRight size={14} style={{ marginLeft: '8px' }} />
            </div>
            </Link>

            {/* Purchase Card */}
            <Link to="/admin/purchase-invoices" style={styles.card} className="dashboard-card">
            <div style={styles.cardIconBox}>
                <ShoppingCart size={30} strokeWidth={1.5} color="#f39c12" />
            </div>
            <h3 style={styles.cardTitle}>Purchase</h3>
            <p style={styles.cardText}>
                Create purchase orders and manage vendor invoices.
            </p>
            <div style={styles.cardFooter}>
                Manage Purchases <ArrowRight size={14} style={{ marginLeft: '8px' }} />
            </div>
            </Link>

        </div>
      </div>

      {/* Global CSS for Hover Effects */}
      <style>{`
        .dashboard-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .dashboard-card:hover {
          transform: translateY(-5px) !important;
          border-color: rgba(243, 156, 18, 0.5) !important;
          background-color: #1a1a1a !important;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4) !important;
        }
        .dashboard-card:hover .card-footer-icon {
          transform: translateX(4px);
        }
      `}</style>
    </div>
  );
}

const styles = {
    wrapper: {
        minHeight: '100vh',
        backgroundColor: '#0f0f0f',
        backgroundImage: 'radial-gradient(circle at 1px 1px, #1a1a1a 1px, transparent 1px)',
        backgroundSize: '30px 30px',
        color: '#fff',
        fontFamily: "'Inter', sans-serif",
    },
    container: {
        padding: '60px 60px', // Matches your AdminNavbar padding exactly
        maxWidth: '1400px',
        margin: '0 auto',
        boxSizing: 'border-box',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '50px',
        paddingBottom: '30px',
        borderBottom: '1px solid #222',
    },
    headerIconContainer: {
        backgroundColor: 'rgba(243, 156, 18, 0.1)',
        padding: '12px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        margin: 0,
        fontSize: '28px',
        fontWeight: 700,
        letterSpacing: '-0.5px',
        color: '#fff',
    },
    subtitle: {
        margin: '5px 0 0',
        fontSize: '14px',
        color: '#888',
        letterSpacing: '0px',
        textTransform: 'none',
    },
    cards: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '30px',
        flexWrap: 'wrap',
    },
    card: {
        backgroundColor: '#141414',
        padding: '35px',
        borderRadius: '16px',
        border: '1px solid #262626',
        textDecoration: 'none',
        width: 'auto',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
    },
    cardIconBox: {
        width: '54px',
        height: '54px',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '25px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
    },
    cardTitle: {
        margin: 0,
        fontSize: '19px',
        fontWeight: 600,
        color: '#fff',
        marginBottom: '12px',
    },
    cardText: {
        margin: 0,
        fontSize: '14px',
        color: '#999',
        lineHeight: '1.6',
        flexGrow: 1,
    },
    cardFooter: {
        marginTop: '30px',
        fontSize: '12px',
        fontWeight: 700,
        color: '#f39c12',
        display: 'flex',
        alignItems: 'center',
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
    }
};

export default AdminDashboard;