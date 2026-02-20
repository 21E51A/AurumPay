import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const menuItemStyle = (path) => ({
    display: "block",
    padding: "12px 20px",
    textDecoration: "none",
    color: location.pathname === path ? "#fff" : "#333",
    background:
      location.pathname === path
        ? "linear-gradient(135deg,#4f46e5,#9333ea)"
        : "transparent",
    borderRadius: "10px",
    marginBottom: "10px",
    fontWeight: "500",
    transition: "0.3s ease",
  });

  return (
    <div
      style={{
        width: "220px",
        background: "#f8f9fa",
        padding: "20px",
        borderRight: "1px solid #eee",
        minHeight: "100vh",
      }}
    >
      <h3 style={{ marginBottom: "30px" }}>AurumPay Admin</h3>

      <Link style={menuItemStyle("/admin/dashboard")} to="/admin/dashboard">
        Dashboard
      </Link>

      <Link style={menuItemStyle("/admin/coins")} to="/admin/coins">
        Coins
      </Link>

      <Link style={menuItemStyle("/admin/orders")} to="/admin/orders">
        Orders
      </Link>

      <Link style={menuItemStyle("/admin/revenue")} to="/admin/revenue">
        Revenue
      </Link>

      <Link style={menuItemStyle("/admin/pricing")} to="/admin/pricing">
        Pricing
      </Link>

      {/* ✅ FIXED JEWELLERY MENU */}
      <Link style={menuItemStyle("/admin/jewellery")} to="/admin/jewellery">
        Jewellery
      </Link>
    </div>
  );
}
