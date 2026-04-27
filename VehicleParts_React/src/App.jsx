import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/login'
import AdminDashboard from './pages/admin/dashboard'
import VendorPage from './pages/admin/Vendors'
import StaffPage from './pages/admin/Staff'
import ProtectedRoute from './components/ProtectedRoute'
import Customers from './pages/staff/Customers'
import StaffDashboard from './pages/staff/dashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRole="Admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/vendors" element={
          <ProtectedRoute allowedRole="Admin">
            <VendorPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/staff" element={
          <ProtectedRoute allowedRole="Admin">
            <StaffPage />
          </ProtectedRoute>
        } />
        <Route path="/staff/dashboard" element={
          <ProtectedRoute allowedRole="Staff">
            <StaffDashboard />
          </ProtectedRoute>
        } />
        <Route path="/staff/customers" element={
          <ProtectedRoute allowedRole="Staff">
            <Customers />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App