import { useNavigate } from 'react-router-dom'

function CustomerDashboard() {
  const navigate = useNavigate()
  const fullName = localStorage.getItem('fullName')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('fullName')
    navigate('/')
  }

  return (
    <div style={{ padding: '30px' }}>
      <h1>Customer Dashboard</h1>
      <p>Welcome, {fullName}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default CustomerDashboard
