import { NavLink } from "react-router-dom";

const linkStyle = ({ isActive }) => ({
  display: "block",
  padding: "12px 16px",
  color: isActive ? "#1e90ff" : "#333",
  textDecoration: "none",
  fontWeight: isActive ? "600" : "400",
});

export default function Sidebar() {
  return (
    <aside
      style={{
        width: "220px",
        background: "#f8f9fa",
        borderRight: "1px solid #ddd",
      }}
    >
      <h3 style={{ padding: "16px" }}>AurumPay Admin</h3>

      <NavLink to="/admin/dashboard" style={linkStyle}>Dashboard</NavLink>
      <NavLink to="/admin/coins" style={linkStyle}>Coins</NavLink>
      <NavLink to="/admin/orders" style={linkStyle}>Orders</NavLink>
      <NavLink to="/admin/revenue" style={linkStyle}>Revenue</NavLink>
    </aside>
  );
}
