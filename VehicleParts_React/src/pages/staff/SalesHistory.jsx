import { useState } from 'react';
import { HistoryIcon } from "./SalesIcons";
import api from '../../api/axios';
import './SalesHistory.css';

function SalesHistory({ sales, loading, onRefreshSales }) {
  const [selectedSale, setSelectedSale] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showModal, setShowModal] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(null);
  const [markingPaid, setMarkingPaid] = useState(false);

  const handleRowClick = (sale) => {
    setSelectedSale(sale);
    setShowModal(true);
  };

  const handleSendEmail = async (sale) => {
    if (!sale.customerEmail) {
      alert('No email address available for this customer.');
      return;
    }

    setSendingEmail(sale.id);

    try {
      await api.post(`/sale/${sale.id}/send-invoice`);
      alert(`✅ Invoice sent to ${sale.customerEmail}`);
      
      // Update local sale object
      sale.emailSent = true;
      setSelectedSale({ ...sale });
      
      // Refresh the sales list
      if (onRefreshSales) {
        await onRefreshSales();
      }
      
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Failed to send invoice email.');
    } finally {
      setSendingEmail(null);
    }
  };

  const handleMarkPaid = async (sale) => {
    if (!window.confirm('Mark this invoice as Paid?')) return;
    
    setMarkingPaid(true);
    try {
      await api.patch(`/sale/${sale.id}/mark-paid`);
      
      // Update local state
      setSelectedSale({ ...selectedSale, paymentStatus: 'Paid' });
      alert('✅ Invoice marked as paid.');
      
      // Refresh the sales list
      if (onRefreshSales) {
        await onRefreshSales();
      }
      
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update payment.');
    } finally {
      setMarkingPaid(false);
    }
  };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentSales = sales.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sales.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        document.querySelector('.history-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    const goToFirstPage = () => setCurrentPage(1);
    const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
    const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const goToLastPage = () => setCurrentPage(totalPages);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <div className="history-section">
        {/* <div className="history-header">
            <h3 className="history-title">Sales History</h3>
            <span className="history-count">Total: {sales.length} invoices</span>
        </div> */}
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Invoice</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Staff</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {currentSales.map((sale, index) => (
                <tr 
                  key={sale.id} 
                  className="history-row"
                  onClick={() => handleRowClick(sale)}
                >
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td className="invoice-id">#{sale.id}</td>
                  <td>{sale.customerName}</td>
                  <td>{sale.customerEmail || '—'}</td>
                  <td>{sale.customerPhone || '—'}</td>
                  <td>{sale.staffName || '—'}</td>
                  <td className="total-amount">Rs. {sale.totalAmount?.toLocaleString()}</td>
                  <td>
                    <span className={`sh-status-badge sh-status-${sale.paymentStatus?.toLowerCase()}`}>
                      {sale.paymentStatus}
                    </span>
                  </td>
                  <td className="date-cell">
                    {formatDate(sale.date)}
                  </td>
                </tr>
              ))}
              {sales.length === 0 && !loading && (
                <tr>
                  <td colSpan="9" className="empty-table">No sales records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

                {loading && (
            <div className="sales-loading-overlay">
                <div className="sales-loading-spinner"></div>
                <p>LOADING SALES DATA...</p>
            </div>
        )}

        {!loading && sales.length > 0 && (
            <div className="pagination-container">
                <div className="pagination-info">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sales.length)} of {sales.length} entries
                </div>
                <div className="pagination-controls">
                    <button 
                    onClick={goToFirstPage} 
                    disabled={currentPage === 1}
                    className="pagination-btn"
                    >
                    «
                    </button>
                    <button 
                    onClick={goToPrevPage} 
                    disabled={currentPage === 1}
                    className="pagination-btn"
                    >
                    ‹
                    </button>
                    <span className="pagination-current">
                    Page {currentPage} of {totalPages}
                    </span>
                    <button 
                    onClick={goToNextPage} 
                    disabled={currentPage === totalPages}
                    className="pagination-btn"
                    >
                    ›
                    </button>
                    <button 
                    onClick={goToLastPage} 
                    disabled={currentPage === totalPages}
                    className="pagination-btn"
                    >
                    »
                    </button>
                </div>
            </div>
        )}
      </div>


      {/* Invoice Modal */}
      {showModal && selectedSale && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="invoice-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>INVOICE</h2>
                <p className="invoice-id-large">#{selectedSale.id}</p>
                {/* <p className="invoice-status">
                  Status: <span className={selectedSale.paymentStatus?.toLowerCase()}>
                    {selectedSale.paymentStatus}
                  </span>
                </p> */}
              </div>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="invoice-body">
              {/* Customer Info */}
              <div className="invoice-info-section">
                <div className="info-row">
                  <div className="info-label">CUSTOMER</div>
                  <div className="info-value">{selectedSale.customerName}</div>
                </div>
                {selectedSale.customerEmail && (
                  <div className="info-row">
                    <div className="info-label">EMAIL</div>
                    <div className="info-value">{selectedSale.customerEmail}</div>
                  </div>
                )}
                {selectedSale.customerPhone && (
                  <div className="info-row">
                    <div className="info-label">PHONE</div>
                    <div className="info-value">{selectedSale.customerPhone}</div>
                  </div>
                )}
                <div className="info-row">
                  <div className="info-label">DATE</div>
                  <div className="info-value">{formatDate(selectedSale.date)}</div>
                </div>
              </div>

              {/* Items Table */}
              <table className="invoice-items-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSale.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td className="item-name">{item.partName}</td>
                      <td className="item-qty">{item.quantity}</td>
                      <td className="item-price">Rs. {item.unitPrice?.toLocaleString()}</td>
                      <td className="item-total">Rs. {(item.quantity * item.unitPrice).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals Section */}
              <div className="totals-container">
                <div className="totals-box">
                  <div className="totals-item">
                    <span>Subtotal</span>
                    <span>Rs. {selectedSale.subTotal?.toLocaleString()}</span>
                  </div>
                  {selectedSale.discountApplied && selectedSale.discountAmount > 0 && (
                    <div className="totals-item">
                      <span>Discount (10%)</span>
                      <span>- Rs. {selectedSale.discountAmount?.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="totals-divider"></div>
                  <div className="totals-item grand-total">
                    <span>GRAND TOTAL</span>
                    <span>Rs. {selectedSale.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="invoice-actions">
                {(selectedSale.paymentStatus === 'Credit' || selectedSale.paymentStatus === 'Overdue') && (
                  <button
                    className="mark-paid-btn"
                    onClick={() => handleMarkPaid(selectedSale)}
                    disabled={markingPaid}
                  >
                    {markingPaid ? 'UPDATING...' : '✓ MARK AS PAID'}
                  </button>
                )}
                
                <button
                  className="email-invoice-btn"
                  onClick={() => handleSendEmail(selectedSale)}
                  disabled={sendingEmail === selectedSale.id}
                >
                  {sendingEmail === selectedSale.id
                    ? 'SENDING...'
                    : selectedSale.emailSent
                      ? 'RESEND INVOICE'
                      : 'SEND INVOICE'
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SalesHistory;