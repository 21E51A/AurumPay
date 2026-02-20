import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

export default function Home() {
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    const fetchPrices = async () => {
      const res = await axiosInstance.get(
        "/jewellery/metal-prices/final"
      );
      setPrices(res.data.prices);
    };

    fetchPrices();
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <h2>Live Metal Prices</h2>

      <div style={{ display: "flex", gap: 20 }}>
        {prices.map((p) => (
          <div
            key={p.metal_type}
            style={{
              padding: 20,
              background:
                "linear-gradient(135deg,#4f46e5,#9333ea)",
              borderRadius: 12,
              color: "#fff",
              minWidth: 220,
            }}
          >
            <h3>{p.metal_type}</h3>
            <h2>₹ {p.price_per_gram} / gram</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
