import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import CustomerNavbar from '../../components/CustomerNavbar';
import './History.css';

const History = () => {
    const [history, setHistory] = useState({
        serviceHistory: [],
        purchaseHistory: [],
        partRequestHistory: [] 
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get('/CustomerInteraction/history');
                const actualData = response.data.data ? response.data.data : response.data;
                
                setHistory({
                    serviceHistory: actualData.serviceHistory || [],
                    purchaseHistory: actualData.purchaseHistory || [],
                    partRequestHistory: actualData.partRequestHistory || []
                });
            } catch (err) {
                console.error("Fetch history error:", err);
                setError('Failed to load history.');
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (loading) return <div className="loader-container"><div className="loader"></div></div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="history-page">
            <CustomerNavbar />
            <div className="history-container">
                <h2>My History</h2>

                {/* Service History */}
                <section>
                    <h3>Service Appointments</h3>
                    {!history?.serviceHistory || history.serviceHistory.length === 0 ? (
                        <p className="empty-state">No service appointments booked yet.</p>
                    ) : (
                        <div className="cards-grid">
                            {history.serviceHistory.map(item => (
                                <div key={item.id} className="history-card">
                                    <p><strong>Date</strong> {new Date(item.date).toLocaleDateString()}</p>
                                    <p><strong>Details</strong> {item.notes || 'No details provided'}</p>
                                    <p><strong>Status</strong> <span className={`status ${item.status?.toLowerCase()}`}>{item.status}</span></p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Purchase History */}
                <section>
                    <h3>Purchases</h3>
                    {!history?.purchaseHistory || history.purchaseHistory.length === 0 ? (
                         <p className="empty-state">No purchases made yet.</p>
                    ) : (
                        <div className="cards-grid">
                            {history.purchaseHistory.map(item => (
                                <div key={item.id} className="history-card">
                                    <p><strong>Total Amount</strong> ${item.totalAmount}</p>
                                    <p><strong>Date</strong> {new Date(item.date).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Part Request History Section */}
                <section>
                    <h3>Requested Parts</h3>
                    {!history?.partRequestHistory || history.partRequestHistory.length === 0 ? (
                        <p className="empty-state">No part requests made yet.</p>
                    ) : (
                        <div className="cards-grid">
                            {history.partRequestHistory.map(item => (
                                <div key={item.id} className="history-card">
                                    <p><strong>Part</strong> {item.partName}</p>
                                    <p><strong>Description</strong> {item.description}</p>
                                    <p><strong>Status</strong> <span className={`status ${item.status?.toLowerCase()}`}>{item.status}</span></p>
                                    <p><strong>Requested On</strong> {new Date(item.createdAt).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default History;