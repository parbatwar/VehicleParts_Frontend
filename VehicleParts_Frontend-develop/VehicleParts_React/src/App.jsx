import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/login'
import AdminDashboard from './pages/admin/dashboard'
import StaffDashboard from './pages/staff/dashboard'
import CustomerDashboard from './pages/customer/dashboard'

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
