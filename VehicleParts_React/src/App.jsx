import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import AdminDashboard from './pages/admin/Dashboard'
import VendorPage from './pages/admin/Vendors'
import StaffPage from './pages/admin/Staff'
import ProtectedRoute from './components/ProtectedRoute'

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
      </Routes>
    </BrowserRouter>
  )
}

export default App