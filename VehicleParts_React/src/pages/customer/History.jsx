import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import CustomerNavbar from '../../components/CustomerNavbar';
import { ShoppingBag, Calendar, Package, Star, X, Send } from 'lucide-react';
import './History.css';

const History = () => {
    const [history, setHistory] = useState({
        serviceHistory: [],
        purchaseHistory: [],
        partRequestHistory: [] 
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('purchases');
    
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [reviewSuccess, setReviewSuccess] = useState('');
    const [reviewError, setReviewError] = useState('');
    const [submittedReviews, setSubmittedReviews] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('submittedReviews') || '{}');
        } catch { return {}; }
    });

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

    const getStatusClass = (status) => {
        if (!status) return 'pending';
        switch(status?.toLowerCase()) {
            case 'paid': return 'paid';
            case 'credit': return 'credit';
            case 'overdue': return 'overdue';
            case 'completed': return 'completed';
            case 'done': return 'completed';
            case 'cancelled': return 'cancelled';
            case 'fulfilled': return 'completed';
            case 'rejected': return 'cancelled';
            case 'open': return 'pending';
            case 'confirmed': return 'confirmed';
            default: return 'pending';
        }
    };

    const getStatusText = (status) => {
        if (!status) return 'PENDING';
        return status.toUpperCase();
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    };

    const openReviewModal = (appointment) => {
        setSelectedAppointment(appointment);
        setRating(0);
        setComment('');
        setReviewError('');
        setShowReviewModal(true);
    };

    const closeReviewModal = () => {
        setShowReviewModal(false);
        setSelectedAppointment(null);
        setRating(0);
        setComment('');
    };

    const submitReview = async () => {
        if (rating === 0) {
            setReviewError('Please select a rating');
            return;
        }
        setSubmitting(true);
        setReviewError('');
        try {
            const payload = {
                rating: rating,
                comment: comment.trim() || 'No comment provided'
            };
            const response = await api.post('/CustomerInteraction/reviews', payload);
            if (response.status === 200) {
                setReviewSuccess('Review submitted successfully! Thank you for your feedback.');
                setSubmittedReviews(prev => {
                    const updated = { ...prev, [selectedAppointment.id]: true };
                    localStorage.setItem('submittedReviews', JSON.stringify(updated));
                    return updated;
                });
                setTimeout(() => {
                    closeReviewModal();
                    setReviewSuccess('');
                }, 2000);
            }
        } catch (err) {
            setReviewError(err.response?.data?.message || 'Failed to submit review. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="history-page">
            <CustomerNavbar />
            <div className="loader-container">
                <div className="loader"></div>
                <p>LOADING HISTORY...</p>
            </div>
        </div>
    );
        
    if (error) return (
        <div className="history-page">
            <CustomerNavbar />
            <div className="error">{error}</div>
        </div>
    );

    const { purchaseHistory, serviceHistory, partRequestHistory } = history;

    return (
        <div className="history-page">
            <CustomerNavbar />
            <div className="history-container">
                <div className="history-header">
                    <h2>My History</h2>
                    <p className="history-subtitle">Track your purchases, appointments, and part requests</p>
                </div>

                <div className="history-tabs">
                    <button className={`tab-btn ${activeTab === 'purchases' ? 'active' : ''}`} onClick={() => setActiveTab('purchases')}>
                        <ShoppingBag size={16} /> PURCHASES
                        <span className="tab-count">{purchaseHistory.length}</span>
                    </button>
                    <button className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>
                        <Calendar size={16} /> BOOKINGS
                        <span className="tab-count">{serviceHistory.length}</span>
                    </button>
                    <button className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => setActiveTab('requests')}>
                        <Package size={16} /> PART REQUESTS
                        <span className="tab-count">{partRequestHistory.length}</span>
                    </button>
                </div>

                {/* Purchases Tab */}
                {activeTab === 'purchases' && (
                    <div className="tab-content">
                        {purchaseHistory.length === 0 ? (
                            <div className="empty-state">
                                <ShoppingBag size={48} strokeWidth={1} />
                                <p>No purchases made yet</p>
                                <span>Your purchase history will appear here</span>
                            </div>
                        ) : (
                            <div className="cards-grid">
                                {purchaseHistory.map(item => (
                                    <div key={item.id} className="history-card purchase-card">
                                        <div className="card-header">
                                            <div className="card-icon"><ShoppingBag size={20} /></div>
                                            <span className={`status ${getStatusClass(item.paymentStatus)}`}>
                                                {getStatusText(item.paymentStatus)}
                                            </span>
                                        </div>
                                        <div className="card-body">
                                            <div className="card-row">
                                                <span className="row-label">INVOICE #</span>
                                                <span className="row-value">{item.id}</span>
                                            </div>
                                            <div className="card-row">
                                                <span className="row-label">DATE</span>
                                                <span className="row-value">{formatDate(item.date)}</span>
                                            </div>
                                            <div className="card-row">
                                                <span className="row-label">TOTAL AMOUNT</span>
                                                <span className="row-value amount">Rs. {item.totalAmount?.toLocaleString()}</span>
                                            </div>
                                            {item.items && item.items.length > 0 && (
                                                <div className="items-section">
                                                    <span className="row-label">ITEMS</span>
                                                    <div className="items-list">
                                                        {item.items.map((product, idx) => (
                                                            <div key={idx} className="item-row">
                                                                <span className="item-name">{product.partName}</span>
                                                                <span className="item-qty">x{product.quantity}</span>
                                                                <span className="item-price">Rs. {(product.quantity * product.unitPrice).toLocaleString()}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Bookings Tab */}
                {activeTab === 'bookings' && (
                    <div className="tab-content">
                        {serviceHistory.length === 0 ? (
                            <div className="empty-state">
                                <Calendar size={48} strokeWidth={1} />
                                <p>No service appointments booked yet</p>
                                <span>Schedule your first appointment</span>
                            </div>
                        ) : (
                            <div className="cards-grid">
                                {serviceHistory.map(item => {
                                    const isDone = item.status?.toLowerCase() === 'done';
                                    const hasReviewed = submittedReviews[item.id];
                                    return (
                                        <div key={item.id} className="history-card booking-card">
                                            <div className="card-header">
                                                <div className="card-icon"><Calendar size={20} /></div>
                                                <span className={`status ${getStatusClass(item.status)}`}>
                                                    {getStatusText(item.status)}
                                                </span>
                                            </div>
                                            <div className="card-body">
                                                <div className="card-row">
                                                    <span className="row-label">BOOKING ID</span>
                                                    <span className="row-value">#{item.id}</span>
                                                </div>
                                                <div className="card-row">
                                                    <span className="row-label">DATE & TIME</span>
                                                    <span className="row-value">{formatDateTime(item.date)}</span>
                                                </div>
                                                {item.notes && (
                                                    <div className="card-row">
                                                        <span className="row-label">NOTES</span>
                                                        <span className="row-value notes">{item.notes}</span>
                                                    </div>
                                                )}

                                                {/* Always show review action for equal card height */}
                                                <div className="review-action">
                                                    {isDone ? (
                                                        hasReviewed ? (
                                                            <div className="reviewed-badge">
                                                                <Star size={14} fill="#2ecc71" color="#2ecc71" />
                                                                <span>Thank you for your review</span>
                                                            </div>
                                                        ) : (
                                                            <button className="review-btn" onClick={() => openReviewModal(item)}>
                                                                <Star size={14} /> Write a Review
                                                            </button>
                                                        )
                                                    ) : (
                                                        <button className="review-btn review-btn-disabled" disabled>
                                                            <Star size={14} /> Write a Review
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Part Requests Tab */}
                {activeTab === 'requests' && (
                    <div className="tab-content">
                        {partRequestHistory.length === 0 ? (
                            <div className="empty-state">
                                <Package size={48} strokeWidth={1} />
                                <p>No part requests made yet</p>
                                <span>Request a part when you need one</span>
                            </div>
                        ) : (
                            <div className="cards-grid">
                                {partRequestHistory.map(item => (
                                    <div key={item.id} className="history-card request-card">
                                        <div className="card-header">
                                            <div className="card-icon"><Package size={20} /></div>
                                            <span className={`status ${getStatusClass(item.status)}`}>
                                                {getStatusText(item.status)}
                                            </span>
                                        </div>
                                        <div className="card-body">
                                            <div className="card-row">
                                                <span className="row-label">PART NAME</span>
                                                <span className="row-value part-name">{item.partName}</span>
                                            </div>
                                            <div className="card-row">
                                                <span className="row-label">QUANTITY</span>
                                                <span className="row-value">{item.quantity || 1}</span>
                                            </div>
                                            {item.description && (
                                                <div className="card-row">
                                                    <span className="row-label">DESCRIPTION</span>
                                                    <span className="row-value description">{item.description}</span>
                                                </div>
                                            )}
                                            <div className="card-row">
                                                <span className="row-label">REQUESTED ON</span>
                                                <span className="row-value">{formatDateTime(item.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Review Modal */}
            {showReviewModal && selectedAppointment && (
                <div className="modal-overlay" onClick={closeReviewModal}>
                    <div className="review-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Write a Review</h3>
                            <button className="modal-close" onClick={closeReviewModal}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="rating-section">
                                <label>Your Rating</label>
                                <div className="stars-container">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            size={28}
                                            className={`star ${star <= (hoverRating || rating) ? 'filled' : ''}`}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            onClick={() => setRating(star)}
                                        />
                                    ))}
                                </div>
                                <div className="rating-label">
                                    {rating === 1 && 'Poor'}
                                    {rating === 2 && 'Fair'}
                                    {rating === 3 && 'Good'}
                                    {rating === 4 && 'Very Good'}
                                    {rating === 5 && 'Excellent'}
                                </div>
                            </div>
                            <div className="comment-section">
                                <label>Your Comments (Optional)</label>
                                <textarea
                                    className="comment-input"
                                    rows="4"
                                    placeholder="Share your experience with our service..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                            </div>
                            {reviewError && <div className="review-error">{reviewError}</div>}
                            {reviewSuccess && <div className="review-success">{reviewSuccess}</div>}
                            <div className="modal-actions">
                                <button className="cancel-review-btn" onClick={closeReviewModal}>Cancel</button>
                                <button className="submit-review-btn" onClick={submitReview} disabled={submitting || rating === 0}>
                                    {submitting ? 'Submitting...' : <><Send size={14} /> Submit Review</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default History;