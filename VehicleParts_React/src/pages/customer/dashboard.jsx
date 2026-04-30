import CustomerNavbar from '../../components/CustomerNavbar';
import './dashboard.css';

function CustomerDashboard() {
  return (
    <>
      <CustomerNavbar />
      <div className="dashboard-wrapper">
        <div className="dashboard-container">
        </div>
      </div>
    </>
  );
}

export default CustomerDashboard;