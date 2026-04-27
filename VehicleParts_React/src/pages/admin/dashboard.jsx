import { useNavigate } from 'react-router-dom'

function AdminDashboard() {
  const navigate = useNavigate()
  const fullName = localStorage.getItem('fullName')

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  return (
    <div style={{ padding: '30px' }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {fullName}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default AdminDashboard