import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StaffNavbar from '../../components/StaffNavbar';
import api from '../../api/axios';
import { Users, Calendar, TrendingUp, Star, CreditCard, Package } from 'lucide-react';
import './StaffDashboard.css';

function StaffDashboard() {
  const navigate = useNavigate();
  const fullName = localStorage.getItem('fullName');
  const [loading, setLoading] = useState(true);
  const [activeReport, setActiveReport] = useState('regulars');
  const [dashboardData, setDashboardData] = useState({
    totalCustomers: 0,
    pendingBookings: 0,
    openPartRequests: 0,
    todaySales: 0,
    regularCustomers: [],
    highSpenders: [],
    pendingCreditCustomers: [],
    recentAppointments: [],
    recentPartRequests: [],
  });

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const customersRes     = await api.get('/customer');
      const customers        = customersRes.data;
      const appointmentsRes  = await api.get('/appointment');
      const appointments     = appointmentsRes.data;
      const partRequestsRes  = await api.get('/partrequest');
      const partRequests     = partRequestsRes.data;

      const pendingBookings   = appointments.filter(a => a.status === 0).length;
      const openPartRequests  = partRequests.filter(r => r.status === 0).length;
      const today             = new Date().toISOString().split('T')[0];
      let todaySales          = 0;

      const recentAppointments = [...appointments]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      const recentPartRequests = [...partRequests]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      const customersWithActivity = await Promise.all(customers.map(async (customer) => {
        try {
          const historyRes   = await api.get(`/customer/${customer.id}/history`);
          const fullCustomer = historyRes.data;
          const purchases    = fullCustomer.purchaseHistory || [];

          let totalSpentPaid = 0, totalCredit = 0, totalOverdue = 0, purchaseCount = 0;

          purchases.forEach(p => {
            const amount = p.totalAmount || 0;
            if (p.paymentStatus === 'Paid') {
              totalSpentPaid += amount;
              purchaseCount++;
              if (new Date(p.date).toISOString().split('T')[0] === today) todaySales += amount;
            } else if (p.paymentStatus === 'Credit')  { totalCredit  += amount; }
              else if (p.paymentStatus === 'Overdue') { totalOverdue += amount; }
          });

          const appointmentCount  = appointments.filter(a =>
            a.customerName === customer.fullName || a.customerPhone === customer.phone).length;
          const partRequestCount  = partRequests.filter(r =>
            r.customerName === customer.fullName || r.customerPhone === customer.phone).length;
          const totalActivity     = purchaseCount + appointmentCount + partRequestCount;

          return { ...customer, totalSpent: totalSpentPaid, creditAmount: totalCredit,
            overdueAmount: totalOverdue, totalPendingAmount: totalCredit + totalOverdue,
            purchaseCount, appointmentCount, partRequestCount, totalActivity };
        } catch {
          return { ...customer, totalSpent: 0, creditAmount: 0, overdueAmount: 0,
            totalPendingAmount: 0, purchaseCount: 0, appointmentCount: 0,
            partRequestCount: 0, totalActivity: 0 };
        }
      }));

      const activeCustomers      = customersWithActivity.filter(c => c.totalActivity > 0);
      const regularCustomers     = [...activeCustomers].sort((a,b) => b.totalActivity - a.totalActivity).slice(0,10);
      const highSpenders         = [...customersWithActivity].filter(c => c.totalSpent > 0).sort((a,b) => b.totalSpent - a.totalSpent).slice(0,10);
      const pendingCreditCustomers = customersWithActivity
        .filter(c => c.creditAmount > 0 || c.overdueAmount > 0)
        .sort((a,b) => b.totalPendingAmount - a.totalPendingAmount);

      setDashboardData({ totalCustomers: customers.length, pendingBookings, openPartRequests,
        todaySales, recentAppointments, recentPartRequests, regularCustomers,
        highSpenders, pendingCreditCustomers });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const statusText  = s => ['Pending','Confirmed','Done','Cancelled'][s] ?? 'Pending';
  const statusClass = s => ['status-pending','status-confirmed','status-completed','status-cancelled'][s] ?? 'status-pending';
  const prStatusText  = s => ['Open','Fulfilled','Rejected'][s] ?? 'Open';
  const prStatusClass = s => ['status-pending','status-fulfilled','status-rejected'][s] ?? 'status-pending';

  if (loading) {
    return (
      <div className="staff-dashboard-wrapper">
        <StaffNavbar />
        <div className="dashboard-loading">
          <div className="loading-spinner" />
          <p>Loading dashboard</p>
        </div>
      </div>
    );
  }

  const { totalCustomers, pendingBookings, openPartRequests, todaySales,
          recentAppointments, recentPartRequests,
          regularCustomers, highSpenders, pendingCreditCustomers } = dashboardData;

  /* which list is currently active */
  const activeList = activeReport === 'regulars' ? regularCustomers
                   : activeReport === 'highSpenders' ? highSpenders
                   : pendingCreditCustomers;

  return (
    <div className="staff-dashboard-wrapper">
      <StaffNavbar />

      <div className="video-background">
        <video autoPlay muted loop playsInline>
          <source src="/background.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="video-overlay" />

      <div className="dashboard-main">

        {/* ── Header ── */}
        <div className="dashboard-header">
          <h1 className="dashboard-welcome">
            Welcome, <span>{fullName}</span>
          </h1>
          <p className="dashboard-subtitle">
            Customer Analytics & Reports Dashboard
          </p>
        </div>

        {/* ── Stats ── */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon"><Users size={22} /></div>
            <div className="stat-info">
              <h3>Total Customers</h3>
              <p className="stat-value">{totalCustomers}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><Calendar size={22} /></div>
            <div className="stat-info">
              <h3>Pending Bookings</h3>
              <p className="stat-value pending">{pendingBookings}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><Package size={22} /></div>
            <div className="stat-info">
              <h3>Open Part Requests</h3>
              <p className="stat-value open">{openPartRequests}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><TrendingUp size={22} /></div>
            <div className="stat-info">
              <h3>Today's Sales</h3>
              <p className="stat-value">Rs. {todaySales.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* ── Recent Activity ── */}
        <div className="recent-activity-grid">
          <div className="recent-card">
            <h3><Calendar size={14} /> Recent Appointments</h3>
            <div className="recent-list">
              {recentAppointments?.length === 0
                ? <p className="empty-message">No recent appointments</p>
                : recentAppointments?.map((apt, idx) => (
                  <div key={idx} className="recent-item">
                    <div className="recent-info">
                      <span className="recent-name">{apt.customerName}</span>
                      <span className="recent-detail">{apt.vehicle}</span>
                    </div>
                    <span className={`status-badge-small ${statusClass(apt.status)}`}>
                      {statusText(apt.status)}
                    </span>
                  </div>
                ))
              }
            </div>
          </div>

          <div className="recent-card">
            <h3><Package size={14} /> Recent Part Requests</h3>
            <div className="recent-list">
              {recentPartRequests?.length === 0
                ? <p className="empty-message">No recent part requests</p>
                : recentPartRequests?.map((req, idx) => (
                  <div key={idx} className="recent-item">
                    <div className="recent-info">
                      <span className="recent-name">{req.customerName}</span>
                      <span className="recent-detail">{req.partName}</span>
                    </div>
                    <span className={`status-badge-small ${prStatusClass(req.status)}`}>
                      {prStatusText(req.status)}
                    </span>
                  </div>
                ))
              }
            </div>
          </div>
        </div>

        {/* ── Reports ── */}
        <div className="reports-section">
          <div className="reports-header">
            <h2>Customer Insights</h2>
            <div className="report-tabs">
              <button
                className={`report-tab ${activeReport === 'regulars' ? 'active' : ''}`}
                onClick={() => setActiveReport('regulars')}
              >
                <Star size={13} /> Regular Customers ({regularCustomers.length})
              </button>
              <button
                className={`report-tab ${activeReport === 'highSpenders' ? 'active' : ''}`}
                onClick={() => setActiveReport('highSpenders')}
              >
                <TrendingUp size={13} /> High Spenders ({highSpenders.length})
              </button>
              <button
                className={`report-tab ${activeReport === 'pendingCredits' ? 'active' : ''}`}
                onClick={() => setActiveReport('pendingCredits')}
              >
                <CreditCard size={13} /> Pending Credits ({pendingCreditCustomers.length})
              </button>
            </div>
          </div>

          <div className="reports-table-wrapper">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>
                    {activeReport === 'regulars'      && 'Activity'}
                    {activeReport === 'highSpenders'  && 'Total Spent'}
                    {activeReport === 'pendingCredits'&& 'Pending Amount'}
                  </th>
                  {activeReport === 'pendingCredits' && <th>Status</th>}
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {activeList.length === 0 ? (
                  <tr>
                    <td colSpan={activeReport === 'pendingCredits' ? 6 : 5} className="empty-reports">
                      No customers found in this category
                    </td>
                  </tr>
                ) : activeList.map((customer, idx) => (
                  <tr key={customer.id}>
                    <td>{idx + 1}</td>

                    <td>
                      <div className="customer-name">{customer.fullName}</div>
                      <div className="customer-email-sub">{customer.email}</div>
                    </td>

                    <td>{customer.phone || '—'}</td>

                    {activeReport === 'regulars' && (
                      <td>
                        <div className="activity-bars">
                          <span className="activity-badge purchases">{customer.purchaseCount} purchases</span>
                          <span className="activity-badge appointments">{customer.appointmentCount} bookings</span>
                          <span className="activity-badge requests">{customer.partRequestCount} requests</span>
                        </div>
                      </td>
                    )}

                    {activeReport === 'highSpenders' && (
                      <td className="amount-cell">Rs. {customer.totalSpent.toLocaleString()}</td>
                    )}

                    {activeReport === 'pendingCredits' && (
                      <>
                        <td className="credit-cell">Rs. {customer.totalPendingAmount.toLocaleString()}</td>
                        <td className="status-cell">
                          <div className="pending-status-badges">
                            {customer.creditAmount  > 0 && <span className="status-badge-credit">Credit</span>}
                            {customer.overdueAmount > 0 && <span className="status-badge-overdue">Overdue</span>}
                          </div>
                        </td>
                      </>
                    )}

                    <td>
                      <button
                        className="view-customer-btn"
                        onClick={() => navigate(`/staff/customers/${customer.id}`)}
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default StaffDashboard;