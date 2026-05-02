import { useState, useEffect } from 'react';
import api from '../../api/axios';
import AdminNavbar from '../../components/AdminNavbar';
import { styles } from '../../styles/Vendors.styles';
import './Purchase.css';

function Purchase() {
  const [invoices, setInvoices] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/purchaseinvoice');
      setInvoices(res.data);
      setError('');
    } catch (err) {
      console.error('Fetch error:', err);
      setError('CONNECTION ERROR: DATABASE OFFLINE');
    } finally {
      setLoading(false);
    }
  };

  const fetchVendors = async () => {
    try {
      const res = await api.get('/vendor');
      setVendors(res.data);
    } catch (err) {
      setError('Failed to load vendors.');
    }
  };

  // Flatten all items from all invoices for display
  const getAllPurchaseItems = () => {
    const allItems = [];
    invoices.forEach((inv) => {
      inv.items.forEach((item) => {
        allItems.push({
          ...item,
          date: inv.date,
          invoiceId: inv.id,
          vendorName: inv.vendorName,
          sortDate: new Date(inv.date)
        });
      });
    });
    
    allItems.sort((a, b) => b.sortDate - a.sortDate);

    return allItems;
  };

  const allPurchaseItems = getAllPurchaseItems();

  return (
    <div style={styles.wrapper}>
      <AdminNavbar />

      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>PURCHASE INVOICES</h2>
            <p style={styles.subtitle}>vendor purchase records</p>
          </div>
        </div>

        {error && (
          <div style={styles.error}>
            {error}
            <button onClick={() => setError('')} style={styles.errorClose}>✕</button>
          </div>
        )}

        {/* Table View for Purchase Items */}
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>INVOICE ID</th>
                <th style={styles.th}>PART NAME</th>
                <th style={styles.th}>VENDOR</th>
                <th style={styles.th}>QUANTITY</th>
                <th style={styles.th}>UNIT PRICE</th>
                <th style={styles.th}>TOTAL</th>
                <th style={styles.th}>DATE</th>
              </tr>
            </thead>
            <tbody>
              {allPurchaseItems.map((item, index) => (
                <tr key={index} style={styles.tr} className="invoice-row">
                    <td style={styles.td}>#{item.invoiceId}</td>
                    <td style={{...styles.td, color: '#f39c12'}}>{item.partName}</td>
                    <td style={styles.td}>{item.vendorName}</td>
                    <td style={styles.td}>{item.quantity}</td>
                    <td style={styles.td}>Rs. {item.unitPrice}</td>
                    <td style={{...styles.td, color: '#2ecc71', fontWeight: 'bold'}}>
                        Rs. {item.quantity * item.unitPrice}
                    </td>
                    <td style={styles.td}>
                        {new Date(item.date).toLocaleDateString()}
                    </td>
                </tr>
              ))}
              {allPurchaseItems.length === 0 && !loading && (
                <tr>
                  <td colSpan="7" style={styles.emptyState}>NO PURCHASE RECORDS FOUND</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {loading && <div style={styles.loaderLine} />}
      </div>
    </div>
  );
}

export default Purchase;