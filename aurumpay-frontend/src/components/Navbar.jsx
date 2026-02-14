export default function Navbar() {
  return (
    <header
      style={{
        height: "60px",
        background: "#ffffff",
        borderBottom: "1px solid #e0e0e0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
      }}
    >
      <h3 style={{ margin: 0 }}>AurumPay</h3>

      <button
        style={{
          padding: "6px 12px",
          background: "#e74c3c",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
        onClick={() => {
          localStorage.clear();
          window.location.href = "/login";
        }}
      >
        Logout
      </button>
    </header>
  );
}
