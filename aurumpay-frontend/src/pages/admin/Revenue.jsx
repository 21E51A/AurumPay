import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";

const COLORS = ["#f59e0b", "#9ca3af"];

const Revenue = () => {
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState([]);
  const [metalRevenue, setMetalRevenue] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [loading, setLoading] = useState(true);

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const formatCurrency = (value = 0) =>
    `₹ ${Number(value).toLocaleString("en-IN")}`;

  const fetchRevenue = async () => {
    try {
      setLoading(true);

      const query = `?start=${start || ""}&end=${end || ""}`;

      const [summaryRes, trendRes, metalRes, monthlyRes] =
        await Promise.all([
          axiosInstance.get(`/coin-orders/summary${query}`),
          axiosInstance.get(`/coin-orders/daily-trend${query}`),
          axiosInstance.get(`/coin-orders/revenue-by-metal${query}`),
          axiosInstance.get(`/coin-orders/monthly-revenue${query}`),
        ]);

      const formattedTrend =
        trendRes?.data?.trend?.map((item) => ({
          revenue: Number(item.revenue || 0),
          formattedDate: new Date(item.date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
          }),
        })) || [];

      setSummary(summaryRes?.data?.summary || null);
      setTrend(formattedTrend);
      setMetalRevenue(metalRes?.data?.data || []);
      setMonthlyRevenue(monthlyRes?.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch revenue data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, []);

  if (loading)
    return <p style={{ padding: "40px" }}>Loading revenue...</p>;

  if (!summary)
    return <p style={{ padding: "40px" }}>No revenue data available</p>;

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Revenue Dashboard</h2>

      {/* FILTER */}
      <div style={styles.filterContainer}>
        <input
          type="date"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />

        <input
          type="date"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />

        <button onClick={fetchRevenue} style={styles.filterButton}>
          Apply Filter
        </button>
      </div>

      {/* DOWNLOADS */}
      <div style={styles.downloadContainer}>
        <a
          href={`${import.meta.env.VITE_API_URL}/coin-orders/revenue-report-csv?start=${start}&end=${end}`}
          target="_blank"
          rel="noreferrer"
          style={styles.downloadButton}
        >
          Download CSV
        </a>

        <a
          href={`${import.meta.env.VITE_API_URL}/coin-orders/revenue-report-pdf?start=${start}&end=${end}`}
          target="_blank"
          rel="noreferrer"
          style={styles.downloadButton}
        >
          Download PDF
        </a>
      </div>

      {/* KPI CARDS */}
      <div style={styles.grid}>
        <Card title="Total Orders" value={summary.total_orders || 0} />
        <Card title="Paid Orders" value={summary.paid_orders || 0} />
        <Card
          title="Total Revenue"
          value={formatCurrency(summary.total_revenue)}
        />
        <Card
          title="Revenue Today"
          value={formatCurrency(summary.today_revenue)}
        />
        <Card
          title="Revenue This Month"
          value={formatCurrency(summary.month_revenue)}
        />
        <Card title="Coins Sold" value={summary.coins_sold || 0} />
      </div>

      {/* DAILY TREND */}
      <Section title="Daily Revenue">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="formattedDate" />
            <YAxis tickFormatter={(v) => formatCurrency(v)} />
            <Tooltip formatter={(v) => formatCurrency(v)} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#4f46e5"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </Section>

      {/* MONTHLY */}
      <Section title="Monthly Revenue">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(v) => formatCurrency(v)} />
            <Tooltip formatter={(v) => formatCurrency(v)} />
            <Bar dataKey="revenue" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </Section>

      {/* METAL SPLIT */}
      <Section title="Revenue Split (Gold vs Silver)">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={metalRevenue}
              dataKey="revenue"
              nameKey="metal_type"
              outerRadius={120}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {metalRevenue.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => formatCurrency(v)} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Section>
    </div>
  );
};

const Card = ({ title, value }) => (
  <div style={styles.card}>
    <p style={styles.cardTitle}>{title}</p>
    <h2 style={styles.cardValue}>{value}</h2>
  </div>
);

const Section = ({ title, children }) => (
  <div style={styles.section}>
    <h3 style={styles.sectionTitle}>{title}</h3>
    {children}
  </div>
);

const styles = {
  page: {
    padding: "40px",
    background: "#f8fafc",
    minHeight: "100vh",
  },
  heading: {
    marginBottom: "30px",
  },
  filterContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  filterButton: {
    padding: "8px 16px",
    backgroundColor: "#f59e0b",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    color: "#fff",
    fontWeight: "bold",
  },
  downloadContainer: {
    marginBottom: "30px",
    display: "flex",
    gap: "15px",
  },
  downloadButton: {
    padding: "10px 20px",
    backgroundColor: "#4f46e5",
    color: "#fff",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },
  card: {
    padding: "28px",
    borderRadius: "16px",
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    color: "#ffffff",
    boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
  },
  cardTitle: {
    fontSize: "14px",
    opacity: 0.85,
    marginBottom: "10px",
  },
  cardValue: {
    fontSize: "28px",
    fontWeight: "bold",
  },
  section: {
    marginTop: "40px",
    padding: "30px",
    borderRadius: "18px",
    background: "#ffffff",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
  },
  sectionTitle: {
    marginBottom: "20px",
  },
};

export default Revenue;
