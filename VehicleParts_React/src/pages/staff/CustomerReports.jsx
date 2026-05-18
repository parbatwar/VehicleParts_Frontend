import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';

const CustomerReports = () => {
  const [reportType, setReportType] = useState('regulars');
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line
  }, [reportType]);

  const fetchReport = async () => {
    try {
      const res = await axios.get(`/staff/customer-reports?type=${reportType}`);
      setData(res.data);
    } catch (err) {
      alert('Failed to fetch report');
    }
  };

  return (
    <div>
      <h2>Customer Reports</h2>
      <select value={reportType} onChange={e => setReportType(e.target.value)}>
        <option value="regulars">Regulars</option>
        <option value="high-spenders">High Spenders</option>
        <option value="pending-credits">Pending Credits</option>
      </select>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Vehicle</th>
            <th>Amount Spent / Pending</th>
          </tr>
        </thead>
        <tbody>
          {data.map((c, i) => (
            <tr key={i}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
              <td>{c.vehicle}</td>
              <td>{reportType === 'pending-credits' ? c.pending : c.spent}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerReports;
