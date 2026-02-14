import { useEffect, useState } from "react";
import { getRevenueSummary } from "../../api/admin.api";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const data = await getRevenueSummary();
        setSummary(data);
      } catch (err) {
        console.error("Failed to load revenue summary", err);
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, []);

  if (loading) {
    return <h3>Loading dashboard...</h3>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <Card title="Total Orders" value={summary.total_orders} />
        <Card title="Total Revenue" value={`₹ ${summary.total_revenue}`} />
        <Card title="Coins Sold" value={summary.coins_sold} />
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div
      style={{
        width: "220px",
        padding: "20px",
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <p style={{ color: "#666" }}>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}
