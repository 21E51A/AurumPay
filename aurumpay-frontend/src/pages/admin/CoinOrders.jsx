import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

const CoinOrders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await axiosInstance.get("/coin-orders/all");
    setOrders(res.data.orders);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Orders Management</h1>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Coin</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.user_name}</td>
                <td>{order.coin_name}</td>
                <td>{order.quantity}</td>
                <td>₹ {order.total_amount}</td>
                <td>{order.order_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  page: {
    padding: "40px",
    background: "#f8fafc",
    minHeight: "100vh",
  },
  heading: {
    marginBottom: "25px",
  },
  tableContainer: {
    background: "#fff",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
};

export default CoinOrders;