import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import AdminDashboard from './pages/admin/Dashboard'
import StaffDashboard from './pages/staff/Dashboard'
import CustomerDashboard from './pages/customer/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App