import { useEffect, useState } from "react";
import { getRevenueSummary } from "../../api/admin.api";

export default function Dashboard() {
  const [summary, setSummary] = useState({
    total_orders: 0,
    total_revenue: 0,
    coins_sold: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const data = await getRevenueSummary();
        setSummary({
          total_orders: data.total_orders || 0,
          total_revenue: data.total_revenue || 0,
          coins_sold: data.coins_sold || 0,
        });
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
      <h1 style={{ marginBottom: 30 }}>Admin Dashboard</h1>

      <div style={{ display: "flex", gap: 30 }}>
        <Card title="Total Orders" value={summary.total_orders} />
        <Card
          title="Total Revenue"
          value={`₹ ${Number(summary.total_revenue).toLocaleString()}`}
        />
        <Card title="Coins Sold" value={summary.coins_sold} />
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div
      style={{
        flex: 1,
        padding: 30,
        borderRadius: 16,
        color: "white",
        background: "linear-gradient(135deg, #4f46e5, #9333ea)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
      }}
    >
      <p style={{ opacity: 0.8 }}>{title}</p>
      <h2 style={{ marginTop: 10, fontSize: 28 }}>{value}</h2>
    </div>
  );
}
