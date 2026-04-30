import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import './History.css';

const History = () => {
    const [history, setHistory] = useState({ serviceHistory: [], purchaseHistory: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // Feature 14 API Call
                const response = await api.get('/CustomerInteraction/history');
                setHistory(response.data);
            } catch (error) {
                console.error("Failed to fetch history", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    // Helper to format ISO dates to readable format
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Helper to assign CSS classes based on status string
    const getBadgeClass = (status) => {
        const s = status?.toLowerCase() || '';
        if (s === 'pending') return 'status-badge status-pending';
        if (s === 'completed') return 'status-badge status-completed';
        if (s === 'paid') return 'status-badge status-paid';
        if (s === 'cancelled' || s === 'unpaid') return 'status-badge status-cancelled';
        return 'status-badge status-default';
    };

    if (loading) return <div className="history-wrapper">Loading history...</div>;

    return (
        <div className="history-wrapper">
            <h2 className="history-title">My History Dashboard</h2>

            {/* --- Service History Section --- */}
            <div className="history-section">
                <h3 className="section-title">Service Appointments</h3>
                {history.serviceHistory.length > 0 ? (
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Date & Time</th>
                                <th>Vehicle ID</th>
                                <th>Notes</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.serviceHistory.map(service => (
                                <tr key={service.id}>
                                    <td>{formatDate(service.date)}</td>
                                    <td>{service.vehicleId}</td>
                                    <td>{service.notes || 'No notes provided'}</td>
                                    <td>
                                        <span className={getBadgeClass(service.status)}>
                                            {service.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="empty-state">You have no past service appointments.</div>
                )}
            </div>

            {/* --- Purchase History Section --- */}
            <div className="history-section">
                <h3 className="section-title">Purchases & Invoices</h3>
                {history.purchaseHistory.length > 0 ? (
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Invoice ID</th>
                                <th>Date</th>
                                <th>Total Amount</th>
                                <th>Payment Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.purchaseHistory.map(purchase => (
                                <tr key={purchase.id}>
                                    <td>#{purchase.id}</td>
                                    <td>{formatDate(purchase.date)}</td>
                                    <td><strong>${purchase.totalAmount.toFixed(2)}</strong></td>
                                    <td>
                                        <span className={getBadgeClass(purchase.paymentStatus)}>
                                            {purchase.paymentStatus}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="empty-state">You have no past purchases.</div>
                )}
            </div>
            
        </div>
    );
};

export default History;