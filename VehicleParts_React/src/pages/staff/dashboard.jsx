import { useNavigate } from 'react-router-dom'
import './StaffDashboard.css'

function StaffDashboard() {
  const navigate = useNavigate()
  const fullName = localStorage.getItem('fullName')

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  const features = [
    {
      icon: '👥',
      title: 'Customer Management',
      desc: 'Register new customers with vehicle details, view customer profiles, and manage customer information.',
      btn: 'Manage Customers',
      path: '/staff/customers'
    },
    {
      icon: '🔍',
      title: 'Search Customers',
      desc: 'Search customers by name, phone number, vehicle plate number, or customer ID instantly.',
      btn: 'Search Now',
      path: '/staff/customers'
    },
    {
      icon: '📋',
      title: 'Customer History',
      desc: 'View complete customer purchase history, vehicle information, and service records.',
      btn: 'View History',
      path: '/staff/customers'
    }
  ]

  return (
    <div className="dashboard-container">

      {/* Video Background */}
      <div className="video-background">
        <video autoPlay muted loop playsInline>
          <source src="/background.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="video-overlay" />

      {/* Top Navbar */}
      <div className="dashboard-navbar">
        <img 
            src="/GearUpCropped.png" 
            alt="Vehicle Parts Logo" 
            className="dashboard-logo-img" 
        />
        <div className="navbar-right">
          <span className="navbar-user">👤 {fullName}</span>
          <button className="dashboard-logout-btn" onClick={handleLogout}>LOGOUT</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        <div className="dashboard-header">
          <h1 className="dashboard-welcome">
            Welcome, <span>{fullName}</span>
          </h1>
          <p className="dashboard-subtitle">
            What would you like to manage today?
          </p>
        </div>

        {/* Feature Cards */}
        <div className="dashboard-cards">
          {features.map((f, i) => (
            <div key={i} className="dashboard-card" onClick={() => navigate(f.path)}>
              <div className="card-icon">{f.icon}</div>
              <h3 className="card-title">{f.title}</h3>
              <p className="card-desc">{f.desc}</p>
              <button className="card-btn">{f.btn} →</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StaffDashboard