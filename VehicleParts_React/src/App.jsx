import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/login'
import AdminDashboard from './pages/admin/dashboard'
import VendorPage from './pages/admin/Vendors'
import StaffPage from './pages/admin/Staff'
import ProtectedRoute from './components/ProtectedRoute'
import Customers from './pages/staff/Customers'
import StaffDashboard from './pages/staff/dashboard'
import Profile from './pages/customer/Profile';
import Vehicles from './pages/customer/Vehicles';
import Interactions from './pages/customer/Interactions';
import History from './pages/customer/History';
import Register from './pages/customer/Register'
import CustomerDashboard from './pages/customer/dashboard'; 
import About from './pages/customer/About';
import Services from './pages/customer/Services';
import PartsPage from './pages/admin/Parts'
// import PurchaseInvoicesPage from './pages/admin/PurchaseInvoices'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/customer/register" element={<Register />} />
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
        <Route path="/admin/parts" element={
        <ProtectedRoute allowedRole="Admin">
            <PartsPage />
        </ProtectedRoute>
        } />
{/* 
        <Route path="/admin/purchase-invoices" element={
        <ProtectedRoute allowedRole="Admin">
            <PurchaseInvoicesPage />
        </ProtectedRoute>
        } /> */}

        {/* Staff Protected Routes */}
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


        {/* Customer Protected Routes */}
        <Route path="/customer/dashboard" element={
          <ProtectedRoute allowedRole="Customer">
            <CustomerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/customer/services" element={
        <ProtectedRoute allowedRole="Customer">
            <Services />
        </ProtectedRoute>
        } />
        <Route path="/customer/about" element={
        <ProtectedRoute allowedRole="Customer">
            <About />
        </ProtectedRoute>
        } />
        <Route path="/customer/profile" element={
          <ProtectedRoute allowedRole="Customer">
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/customer/vehicles" element={
          <ProtectedRoute allowedRole="Customer">
            <Vehicles />
          </ProtectedRoute>
        } />
        <Route path="/customer/interactions" element={
          <ProtectedRoute allowedRole="Customer">
            <Interactions />
          </ProtectedRoute>
        } />
        <Route path="/customer/history" element={
          <ProtectedRoute allowedRole="Customer">
            <History />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App