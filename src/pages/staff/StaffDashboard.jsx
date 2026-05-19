import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import './StaffDashboard.css';

import RevenueChart from './reports/RevenueChart';
import TopSpendersCard from './reports/TopSpendersCard';
import PendingCreditsTable from './reports/PendingCreditsTable';
import CustomerAnalytics from './reports/CustomerAnalytics';

function StaffDashboard() {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState([]);
  const [topSpenders, setTopSpenders] = useState([]);
  const [overdueCredits, setOverdueCredits] = useState([]);
  const [generalMetrics, setGeneralMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [rev, spend, cred, met] = await Promise.all([
        api.get('/analytics/weekly-revenue').catch(() => ({ data: [] })),
        api.get('/analytics/top-spenders').catch(() => ({ data: [] })),
        api.get('/analytics/pending-credits').catch(() => ({ data: [] })),
        api.get('/analytics/customer-summary').catch(() => ({ data: null }))
      ]);
      setChartData(rev.data);
      setTopSpenders(spend.data);
      setOverdueCredits(cred.data);
      setGeneralMetrics(met.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="staff-dashboard-viewport">
      <header className="dashboard-header-bar">
        <h2 className="dashboard-title">STAFF WORKSPACE COMMAND</h2>
        <div className="dashboard-nav-group">
          <button className="dashboard-nav-btn" onClick={() => navigate('/staff/sales')}>Sales Registry</button>
          <button className="dashboard-sec-btn" onClick={() => navigate('/staff/customers')}>Enroll Customers</button>
          <button className="dashboard-sec-btn" onClick={fetchDashboardData}>Sync DB</button>
        </div>
      </header>

      {loading ? (
        <p style={{ color: '#9ca3af' }}>Querying system analytical ledgers...</p>
      ) : (
        <div className="dashboard-metrics-grid-layout">
          <div className="grid-span-full">
            <CustomerAnalytics metrics={generalMetrics} />
          </div>
          <div className="dashboard-column">
            <RevenueChart data={chartData} />
            <div style={{ marginTop: '1.5rem' }}>
              <PendingCreditsTable outstandingBalances={overdueCredits} />
            </div>
          </div>
          <div className="dashboard-column">
            <TopSpendersCard spenders={topSpenders} />
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffDashboard;