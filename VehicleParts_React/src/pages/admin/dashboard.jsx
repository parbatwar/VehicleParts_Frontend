import { useState, useEffect } from 'react';
import { 
  Package, TrendingUp, DollarSign, AlertCircle, 
  Calendar, ShoppingCart, Users, Truck, 
  BarChart3, Receipt, PieChart
} from 'lucide-react';
import AdminNavbar from '../../components/AdminNavbar';
import api from '../../api/axios';
import './Dashboard.css';

function AdminDashboard() {
  const fullName = localStorage.getItem('fullName') || 'Admin';
  
  const [reportType, setReportType] = useState('daily');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [report, setReport] = useState(null);
  const [parts, setParts] = useState([]);
  const [reportLoading, setReportLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchParts();
  }, []);

  const fetchParts = async () => {
    try {
      const res = await api.get('/part');
      setParts(res.data);
    } catch (err) {
      console.error('Failed to fetch parts:', err);
    }
  };

  const generateReport = async () => {
    setReportLoading(true);
    setReport(null);
    setError('');

    try {
      let res;
      if (reportType === 'daily') {
        res = await api.get(`/report/daily?date=${date}`);
      } else if (reportType === 'monthly') {
        res = await api.get(`/report/monthly?year=${year}&month=${month}`);
      } else {
        res = await api.get(`/report/yearly?year=${year}`);
      }
      setReport(res.data);
    } catch (err) {
      console.error('Failed to generate report:', err);
      setError('Failed to generate report. Please try again.');
    } finally {
      setReportLoading(false);
    }
  };

  const lowStockParts = parts.filter(p => p.stockQty <= 10 && p.stockQty > 0);
  const criticalStock = parts.filter(p => p.stockQty <= 0);
  const healthyStock = parts.filter(p => p.stockQty > 10);
  const totalStockValue = parts.reduce((sum, p) => sum + (p.unitPrice * p.stockQty), 0);
  const totalPotentialProfit = parts.reduce((sum, p) => sum + ((p.sellingPrice - p.unitPrice) * p.stockQty), 0);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="dashboard">
      <AdminNavbar />

      <div className="dashboard-main">
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-welcome">
            Welcome, <span>{fullName}</span>
          </h1>
          <p className="dashboard-subtitle">
            Monitor your business performance and inventory
          </p>
        </div>

        {/* Stats Overview */}
        <div className="stats-overview">
          <div className="stat-overview-card">
            <div className="stat-icon purple">
              <Package size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{parts.length}</span>
              <span className="stat-label">Total Parts</span>
            </div>
          </div>
          <div className="stat-overview-card">
            <div className="stat-icon green">
              <DollarSign size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-value">Rs. {totalStockValue.toLocaleString()}</span>
              <span className="stat-label">Inventory Value</span>
            </div>
          </div>
          <div className="stat-overview-card">
            <div className="stat-icon orange">
              <TrendingUp size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-value">Rs. {totalPotentialProfit.toLocaleString()}</span>
              <span className="stat-label">Potential Profit</span>
            </div>
          </div>
        </div>

        {/* Financial Reports Section */}
        <div className="section">
          <div className="section-header">
            <h2 className="section-title">Financial Reports</h2>
            <div className="section-divider"></div>
          </div>

          <div className="report-card">
            <div className="period-selector">
              {['daily', 'monthly', 'yearly'].map(type => (
                <button
                  key={type}
                  className={`period-btn ${reportType === type ? 'active' : ''}`}
                  onClick={() => { setReportType(type); setReport(null); }}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            <div className="date-input-group">
              {reportType === 'daily' && (
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="date-input"
                />
              )}

              {reportType === 'monthly' && (
                <>
                  <input
                    type="number"
                    value={year}
                    onChange={e => setYear(e.target.value)}
                    className="date-input"
                    placeholder="Year"
                  />
                  <select
                    value={month}
                    onChange={e => setMonth(e.target.value)}
                    className="date-input"
                  >
                    {months.map((m, i) => (
                      <option key={i+1} value={i+1}>{m}</option>
                    ))}
                  </select>
                </>
              )}

              {reportType === 'yearly' && (
                <input
                  type="number"
                  value={year}
                  onChange={e => setYear(e.target.value)}
                  className="date-input"
                  placeholder="Year"
                />
              )}

              <button
                onClick={generateReport}
                className="generate-btn"
                disabled={reportLoading}
              >
                {reportLoading ? 'Generating...' : 'Generate Report'}
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          {report && (
            <div className="report-results">
              <div className="report-period">
                <Calendar size={14} />
                <span>{report.reportType} Report — {new Date(report.periodStart).toLocaleDateString()} to {new Date(report.periodEnd).toLocaleDateString()}</span>
              </div>

              <div className="stats-grid">
                <div className="stat-card revenue">
                  <div className="stat-card-info">
                    <div className="stat-card-label">Revenue</div>
                    <div className="stat-card-value">Rs. {report.totalRevenue?.toLocaleString()}</div>
                    <div className="stat-card-sub">{report.sales?.length || 0} transactions</div>
                  </div>
                </div>
                <div className="stat-card expense">
                  <div className="stat-card-info">
                    <div className="stat-card-label">Expenses</div>
                    <div className="stat-card-value">Rs. {report.totalExpense?.toLocaleString()}</div>
                    <div className="stat-card-sub">{report.purchases?.length || 0} transactions</div>
                  </div>
                </div>
                <div className="stat-card profit">
                  <div className="stat-card-info">
                    <div className="stat-card-label">Net Profit</div>
                    <div className="stat-card-value" style={{ color: report.netProfit >= 0 ? '#2ecc71' : '#e74c3c' }}>
                      Rs. {report.netProfit?.toLocaleString()}
                    </div>
                    <div className="stat-card-sub">{report.netProfit >= 0 ? 'Profitable' : 'Loss'}</div>
                  </div>
                </div>
              </div>

              <div className="transactions-grid">
                <div className="transaction-card">
                  <h4>Recent Sales</h4>
                  {report.sales?.length === 0 ? (
                    <p className="empty-message">No sales recorded</p>
                  ) : (
                    <div className="transaction-list">
                      {report.sales?.slice(0, 5).map(s => (
                        <div key={s.invoiceId} className="transaction-item">
                          <div>
                            <div className="transaction-id">#{s.invoiceId}</div>
                            <div className="transaction-name">{s.customerName}</div>
                          </div>
                          <div className="transaction-amount positive">+Rs. {s.amount?.toLocaleString()}</div>
                          <div className="transaction-date">{new Date(s.date).toLocaleDateString()}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="transaction-card">
                  <h4>Recent Purchases</h4>
                  {report.purchases?.length === 0 ? (
                    <p className="empty-message">No purchases recorded</p>
                  ) : (
                    <div className="transaction-list">
                      {report.purchases?.slice(0, 5).map(p => (
                        <div key={p.invoiceId} className="transaction-item">
                          <div>
                            <div className="transaction-id">#{p.invoiceId}</div>
                            <div className="transaction-name">{p.vendorName}</div>
                          </div>
                          <div className="transaction-amount negative">-Rs. {p.amount?.toLocaleString()}</div>
                          <div className="transaction-date">{new Date(p.date).toLocaleDateString()}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Inventory Status Section */}
        <div className="section">
          <div className="section-header">
            <h2 className="section-title">Inventory Status</h2>
            <div className="section-divider"></div>
          </div>

          {criticalStock.length > 0 && (
            <div className="critical-alert">
              <AlertCircle size={18} />
              <span>{criticalStock.length} part(s) are out of stock! Please reorder immediately.</span>
            </div>
          )}

          <div className="inventory-stats">
            <div className="inventory-stat">
              <span className="inventory-stat-value">{healthyStock.length}</span>
              <span className="inventory-stat-label">In Stock</span>
            </div>
            <div className="inventory-stat warning">
              <span className="inventory-stat-value">{lowStockParts.length}</span>
              <span className="inventory-stat-label">Low Stock</span>
            </div>
            <div className="inventory-stat critical">
              <span className="inventory-stat-value">{criticalStock.length}</span>
              <span className="inventory-stat-label">Out of Stock</span>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Part Name</th>
                  <th>Category</th>
                  <th>Vendor</th>
                  <th>Cost Price</th>
                  <th>Selling Price</th>
                  <th>Profit</th>
                  <th>Stock</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {parts.map(p => {
                  const isCritical = p.stockQty <= 0;
                  const isLow = p.stockQty <= 10;
                  const profit = p.sellingPrice - p.unitPrice;
                  const profitPercent = p.unitPrice > 0 ? Math.round((profit / p.unitPrice) * 100) : 0;
                  return (
                    <tr key={p.id} className={isCritical ? 'critical-row' : isLow ? 'low-row' : ''}>
                        <td className="part-name">{p.name}</td>
                        <td>{p.category}</td>
                        <td>{p.vendorName}</td>
                        <td className="cost-price">Rs. {p.unitPrice?.toLocaleString()}</td>
                        <td className="selling-price">Rs. {p.sellingPrice?.toLocaleString()}</td>
                        <td className={`profit-cell ${profit >= 0 ? 'profit-positive' : 'profit-negative'}`}>
                            {profit >= 0 ? '+' : ''}Rs. {profit.toLocaleString()}
                            <span className="profit-percent">({profitPercent}%)</span>
                        </td>
                        <td className={`stock-cell stock-${isCritical ? 'critical' : isLow ? 'low' : 'good'}`}>
                            {p.stockQty}
                        </td>
                        <td>
                            <span className={`status-badge ${isCritical ? 'critical' : isLow ? 'low' : 'good'}`}>
                            {isCritical ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                            </span>
                        </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;