import { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import StaffNavbar from '../../components/StaffNavbar';
import './Sales.css';

// SVG Icon Components
const SearchIcon = () => (
  <svg className="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="10" cy="10" r="7" /><line x1="15" y1="15" x2="21" y2="21" />
  </svg>
);
const PlusIcon = () => (
  <svg className="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const UserIcon = () => (
  <svg className="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const ShoppingCartIcon = () => (
  <svg className="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);
const CashIcon = () => (
  <svg className="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" />
    <path d="M6 12h.01M18 12h.01" />
  </svg>
);
const CardIcon = () => (
  <svg className="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 8h20" />
  </svg>
);
const BankIcon = () => (
  <svg className="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="3 10 12 5 21 10" /><rect x="3" y="10" width="18" height="12" rx="2" />
    <line x1="7" y1="15" x2="7" y2="18" /><line x1="12" y1="15" x2="12" y2="18" /><line x1="17" y1="15" x2="17" y2="18" />
  </svg>
);
const CreditIcon = () => (
  <svg className="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12H3" /><path d="M12 3v18" /><path d="M18 6l3 3-3 3" /><path d="M6 18l-3-3 3-3" />
  </svg>
);
const CheckIcon = () => (
  <svg className="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const TrashIcon = () => (
  <svg className="icon-svg-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);
const MinusIcon = () => (
  <svg className="icon-svg-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const VendorIcon = () => (
  <svg className="icon-svg-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="8" width="16" height="14" rx="2" /><path d="M8 4v4" /><path d="M16 4v4" /><path d="M4 12h16" />
  </svg>
);
const HistoryIcon = () => (
  <svg className="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

function Sales() {
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [parts, setParts] = useState([]);
  const [filteredParts, setFilteredParts] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [items, setItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVendor, setSelectedVendor] = useState('all');
  const [vendors, setVendors] = useState([]);
  const customerSearchRef = useRef(null);

  useEffect(() => {
    fetchSales();
    fetchCustomers();
    fetchParts();
    fetchStaff();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (customerSearchRef.current && !customerSearchRef.current.contains(e.target)) {
        setShowCustomerDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const res = await api.get('/sale');
      setSales(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customer');
      setCustomers(res.data);
    } catch (err) {
      setError('Failed to load customers.');
    }
  };

  const fetchParts = async () => {
    try {
      const res = await api.get('/part');
      setParts(res.data);
      setFilteredParts(res.data);
      extractVendorsFromParts(res.data);
    } catch (err) {
      setError('Failed to load parts. Make sure backend is running.');
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await api.get('/staff');
      setStaffList(res.data);
    } catch (err) {
      console.error('Failed to load staff:', err);
    }
  };

  const extractVendorsFromParts = (partsData) => {
    const uniqueVendors = [];
    const vendorNames = new Set();
    partsData.forEach(part => {
      if (part.vendorName && !vendorNames.has(part.vendorName)) {
        vendorNames.add(part.vendorName);
        uniqueVendors.push({ id: part.vendorName, name: part.vendorName });
      }
    });
    setVendors(uniqueVendors);
  };

  useEffect(() => {
    if (customerSearchTerm.trim() === '') {
      setFilteredCustomers([]);
    } else {
      const filtered = customers.filter(c =>
        c.fullName?.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
        c.phone?.includes(customerSearchTerm)
      );
      setFilteredCustomers(filtered.slice(0, 10));
    }
  }, [customerSearchTerm, customers]);

  useEffect(() => {
    let filtered = parts;
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(p =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.vendorName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedVendor !== 'all') {
      filtered = filtered.filter(p => p.vendorName === selectedVendor);
    }
    filtered.sort((a, b) => {
      if (a.vendorName !== b.vendorName) return (a.vendorName || '').localeCompare(b.vendorName || '');
      return (a.name || '').localeCompare(b.name || '');
    });
    setFilteredParts(filtered);
  }, [searchTerm, selectedVendor, parts]);

  const selectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setCustomerSearchTerm(customer.fullName);
    setShowCustomerDropdown(false);
  };

  const addToCart = (part) => {
    const existingItem = items.find(i => i.partId === part.id);
    if (existingItem) {
      const newQuantity = parseInt(existingItem.quantity) + 1;
      if (newQuantity > part.stockQty) {
        setError(`Cannot add more ${part.name}. Only ${part.stockQty} in stock.`);
        setTimeout(() => setError(''), 3000);
        return;
      }
      setItems(items.map(i => i.partId === part.id ? { ...i, quantity: newQuantity.toString() } : i));
    } else {
      if (part.stockQty < 1) {
        setError(`${part.name} is out of stock.`);
        setTimeout(() => setError(''), 3000);
        return;
      }
      setItems([...items, {
        partId: part.id,
        partName: part.name,
        vendorName: part.vendorName || 'Unknown Vendor',
        quantity: '1',
        unitPrice: part.unitPrice,
        stockQty: part.stockQty,
        maxStock: part.stockQty
      }]);
    }
  };

  const updateQuantity = (index, newQuantity) => {
    const item = items[index];
    if (newQuantity < 1) { removeItem(index); return; }
    if (newQuantity > item.maxStock) {
      setError(`Only ${item.maxStock} units of ${item.partName} available.`);
      setTimeout(() => setError(''), 3000);
      return;
    }
    const updated = [...items];
    updated[index].quantity = newQuantity;
    setItems(updated);
  };

  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  const calculateSubtotal = () =>
    items.reduce((sum, item) => sum + (parseFloat(item.quantity || 0) * parseFloat(item.unitPrice || 0)), 0);

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 5000 ? subtotal * 0.10 : 0;
  };

  const calculateTotal = () => (calculateSubtotal() - calculateDiscount()).toFixed(2);

  const getPaymentStatus = (method) => {
    if (method === 'credit') return 'Credit';
    return 'Paid';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!selectedCustomer) { setError('Please select a customer.'); return; }
    if (items.length === 0) { setError('Please add at least one item to cart.'); return; }

    for (const item of items) {
      if (parseInt(item.quantity) > item.maxStock) {
        setError(`Insufficient stock for ${item.partName}. Available: ${item.maxStock}`);
        return;
      }
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const payloadToken = JSON.parse(atob(token.split('.')[1]));
      const userId = parseInt(payloadToken.Id);
      const staffMember = staffList.find(s => s.userId === userId);

      if (!staffMember) {
        setError('Staff record not found. Make sure you are logged in as staff.');
        setLoading(false);
        return;
      }

      const payload = {
        customerId: selectedCustomer.id,
        staffId: staffMember.id,
        paymentStatus: getPaymentStatus(paymentMethod),
        items: items.map(i => ({
          partId: i.partId,
          quantity: parseInt(i.quantity)
        }))
      };

      const response = await api.post('/sale', payload);

      const disc = response.data.discountApplied
        ? ` — 10% loyalty discount of Rs. ${response.data.discountAmount} applied!`
        : '';
      setSuccessMessage(`✅ Sale #${response.data.id} created! Total: Rs. ${response.data.totalAmount}${disc}`);
      setTimeout(() => setSuccessMessage(''), 6000);

      resetForm();
      await fetchSales();
      await fetchParts();

    } catch (err) {
      console.error('Submit error:', err);
      setError(err.response?.data?.message || 'Failed to create sale.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedCustomer(null);
    setCustomerSearchTerm('');
    setItems([]);
    setShowForm(false);
    setError('');
    setSearchTerm('');
    setSelectedVendor('all');
    setPaymentMethod('cash');
  };

  const getStockStatus = (stock) => {
    if (stock <= 0) return 'out';
    if (stock < 10) return 'low';
    return 'good';
  };

  const getStockStatusText = (stock) => {
    if (stock <= 0) return 'OUT OF STOCK';
    if (stock < 10) return `Low Stock: ${stock}`;
    return `In Stock: ${stock}`;
  };

  const partsByVendor = () => {
    const grouped = {};
    filteredParts.forEach(part => {
      const vendorKey = part.vendorName || 'Unknown Vendor';
      if (!grouped[vendorKey]) grouped[vendorKey] = [];
      grouped[vendorKey].push(part);
    });
    return grouped;
  };

  const subtotal = calculateSubtotal();
  const discount = calculateDiscount();
  const hasDiscount = discount > 0;

  return (
    <div className="sales-page">
      <StaffNavbar />
      <div className="sales-container">

        <div className="sales-header">
          <div className="header-left">
            <h1 className="header-title">Sales Counter</h1>
            <p className="header-subtitle">Process customer sales and create invoices</p>
          </div>
          {!showForm && (
            <button className="btn-primary" onClick={() => setShowForm(true)}>
              <PlusIcon /> New Sale
            </button>
          )}
        </div>

        {successMessage && (
          <div className="success-banner">
            <span>{successMessage}</span>
            <button className="error-close" onClick={() => setSuccessMessage('')}>×</button>
          </div>
        )}

        {error && (
          <div className="error-banner">
            <span className="error-message">{error}</span>
            <button className="error-close" onClick={() => setError('')}>×</button>
          </div>
        )}

        {showForm ? (
          <div className="pos-interface">

            {/* Products Panel */}
            <div className="products-panel">
              <div className="panel-header">
                <h3 className="panel-title"><SearchIcon /> Products</h3>
                <div className="search-wrapper">
                  <div className="search-input-wrapper">
                    <span className="search-icon"><SearchIcon /></span>
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Search by name, category, or vendor..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <select
                    value={selectedVendor}
                    onChange={(e) => setSelectedVendor(e.target.value)}
                    className="vendor-select"
                  >
                    <option value="all">All Vendors</option>
                    {vendors.map(v => (
                      <option key={v.id} value={v.name}>{v.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="products-grid">
                {loading && parts.length === 0 && (
                  <div className="empty-state">Loading products...</div>
                )}
                {Object.entries(partsByVendor()).map(([vendorName, vendorParts]) => (
                  <div key={vendorName} className="vendor-group">
                    <div className="vendor-group-header">
                      <VendorIcon />
                      <h4 className="vendor-name">{vendorName}</h4>
                    </div>
                    <div className="vendor-products">
                      {vendorParts.map(part => {
                        const stockStatus = getStockStatus(part.stockQty);
                        const inCart = items.find(i => i.partId === part.id);
                        return (
                          <div
                            key={part.id}
                            className={`product-card ${stockStatus === 'out' ? 'product-out' : ''} ${inCart ? 'product-in-cart' : ''}`}
                            onClick={() => stockStatus !== 'out' && addToCart(part)}
                          >
                            {inCart && <div className="cart-badge">×{inCart.quantity}</div>}
                            <div className="product-info">
                              <div className="product-name">{part.name}</div>
                              <div className="product-category">{part.category}</div>
                              <div className="product-price">Rs. {part.unitPrice.toLocaleString()}</div>
                            </div>
                            <div className={`product-stock stock-${stockStatus}`}>
                              {getStockStatusText(part.stockQty)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
                {filteredParts.length === 0 && !loading && (
                  <div className="empty-state">No products found</div>
                )}
              </div>
            </div>

            {/* Cart Panel */}
            <div className="cart-panel">

              {/* Customer Section */}
              <div className="cart-section">
                <h3 className="section-title"><UserIcon /> Customer</h3>
                <div className="customer-search-wrapper" ref={customerSearchRef}>
                  <span className="input-icon"><UserIcon /></span>
                  <input
                    type="text"
                    className="customer-search-input"
                    placeholder="Search by name or phone..."
                    value={customerSearchTerm}
                    onChange={(e) => {
                      setCustomerSearchTerm(e.target.value);
                      setSelectedCustomer(null);
                      setShowCustomerDropdown(true);
                    }}
                    onFocus={() => setShowCustomerDropdown(true)}
                  />
                  {showCustomerDropdown && filteredCustomers.length > 0 && (
                    <div className="customer-dropdown">
                      {filteredCustomers.map(c => (
                        <div key={c.id} className="customer-option" onClick={() => selectCustomer(c)}>
                          <div className="customer-name">{c.fullName}</div>
                          <div className="customer-phone">{c.phone || 'No phone'}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {selectedCustomer && (
                  <div className="selected-customer">
                    <CheckIcon /> {selectedCustomer.fullName}
                    {selectedCustomer.phone && <span style={{ color: '#888', fontSize: '10px' }}> • {selectedCustomer.phone}</span>}
                  </div>
                )}
              </div>

              {/* Cart Items Section */}
              <div className="cart-section cart-items-section">
                <h3 className="section-title">
                  <ShoppingCartIcon /> Cart <span className="item-count">({items.length})</span>
                </h3>
                <div className="cart-items-list">
                  {items.map((item, index) => (
                    <div key={index} className="cart-item">
                      <div className="cart-item-details">
                        <div className="cart-item-name">{item.partName}</div>
                        <div className="cart-item-vendor">{item.vendorName}</div>
                        <div className="cart-item-price">Rs. {item.unitPrice.toLocaleString()} each</div>
                      </div>
                      <div className="cart-item-actions">
                        <button className="qty-btn" onClick={() => updateQuantity(index, parseInt(item.quantity) - 1)}>
                          <MinusIcon />
                        </button>
                        <span className="item-qty">{item.quantity}</span>
                        <button className="qty-btn" onClick={() => updateQuantity(index, parseInt(item.quantity) + 1)}>
                          <PlusIcon />
                        </button>
                        <button className="remove-btn" onClick={() => removeItem(index)}>
                          <TrashIcon />
                        </button>
                      </div>
                      <div className="cart-item-total">
                        Rs. {(parseInt(item.quantity) * item.unitPrice).toLocaleString()}
                      </div>
                    </div>
                  ))}
                  {items.length === 0 && (
                    <div className="empty-cart">
                      <ShoppingCartIcon />
                      <p>No items in cart</p>
                      <small>Click on products to add them</small>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Method and Totals - Only show if items exist */}
              {items.length > 0 && (
                <>
                  <div className="cart-section payment-section">
                    <h3 className="section-title">Payment Method</h3>
                    <div className="payment-options">
                      {[
                        { key: 'cash', label: 'Cash', icon: <CashIcon /> },
                        { key: 'card', label: 'Card', icon: <CardIcon /> },
                        { key: 'bank', label: 'Bank Transfer', icon: <BankIcon /> },
                        { key: 'credit', label: 'Credit', icon: <CreditIcon /> },
                      ].map(opt => (
                        <button
                          key={opt.key}
                          className={`payment-option ${paymentMethod === opt.key ? 'active' : ''}`}
                          onClick={() => setPaymentMethod(opt.key)}
                        >
                          {opt.icon} {opt.label}
                        </button>
                      ))}
                    </div>
                    {paymentMethod === 'credit' && (
                      <div className="credit-notice">
                        ⚠️ This sale will be marked as Credit — payment pending
                      </div>
                    )}
                  </div>

                  <div className="cart-section total-section">
                    <div className="total-line">
                      <span>Subtotal</span>
                      <span>Rs. {subtotal.toLocaleString()}</span>
                    </div>

                    {hasDiscount && (
                      <div className="discount-line">
                        <div className="discount-info">
                          <span className="discount-badge">🎉 LOYALTY DISCOUNT</span>
                          <span className="discount-text">10% off — purchase above Rs. 5,000</span>
                        </div>
                        <span className="discount-amount">- Rs. {discount.toLocaleString()}</span>
                      </div>
                    )}

                    {!hasDiscount && subtotal > 0 && (
                      <div className="discount-progress">
                        <div className="discount-progress-text">
                          Rs. {(5000 - subtotal).toLocaleString()} more for loyalty discount
                        </div>
                        <div className="discount-progress-bar">
                          <div
                            className="discount-progress-fill"
                            style={{ width: `${Math.min((subtotal / 5000) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="grand-total">
                      <span>Total</span>
                      <span>Rs. {parseFloat(calculateTotal()).toLocaleString()}</span>
                    </div>

                    <button className="btn-checkout" onClick={handleSubmit} disabled={loading}>
                      <CheckIcon /> {loading ? 'Processing...' : 'Complete Sale'}
                    </button>
                    <button className="btn-cancel" onClick={resetForm}>
                      <TrashIcon /> Cancel Sale
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          /* Sales History */
          <div className="history-section">
            <div className="history-header">
              <h3 className="history-title"><HistoryIcon /> Sales History</h3>
              <span className="history-count">{sales.length} records</span>
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Invoice</th>
                    <th>Customer</th>
                    <th>Staff</th>
                    <th>Items</th>
                    <th>Subtotal</th>
                    <th>Discount</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((sale, index) => (
                    <tr key={sale.id}>
                      <td>{index + 1}</td>
                      <td className="invoice-id">#{sale.id}</td>
                      <td>{sale.customerName}</td>
                      <td style={{ color: '#888', fontSize: '11px' }}>{sale.staffName}</td>
                      <td>
                        {sale.items?.map((item, idx) => (
                          <div key={idx} className="history-item">
                            {item.partName} × {item.quantity}
                          </div>
                        ))}
                      </td>
                      <td style={{ color: '#bbb' }}>Rs. {sale.subTotal?.toLocaleString()}</td>
                      <td>
                        {sale.discountApplied
                          ? <span style={{ color: '#2ecc71', fontSize: '11px' }}>- Rs. {sale.discountAmount?.toLocaleString()}</span>
                          : <span style={{ color: '#444' }}>—</span>
                        }
                      </td>
                      <td className="total-amount">Rs. {sale.totalAmount?.toLocaleString()}</td>
                      <td>
                        <span className={`status-badge status-${sale.paymentStatus?.toLowerCase()}`}>
                          {sale.paymentStatus}
                        </span>
                      </td>
                      <td style={{ color: '#888', fontSize: '11px' }}>
                        {new Date(sale.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {sales.length === 0 && !loading && (
                    <tr>
                      <td colSpan="10" className="empty-table">No sales records found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sales;