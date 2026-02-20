import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

export default function Pricing() {
  const [adminPrices, setAdminPrices] = useState([]);
  const [finalPrices, setFinalPrices] = useState([]);

  /* ================= FETCH ADMIN DATA ================= */
  const fetchAdminPrices = async () => {
    const res = await axiosInstance.get("/admin/prices");
    setAdminPrices(res.data.data);
  };

  /* ================= FETCH FINAL USER PRICES ================= */
  const fetchFinalPrices = async () => {
    const res = await axiosInstance.get(
      "/jewellery/metal-prices/final"
    );
    setFinalPrices(res.data.prices);
  };

  useEffect(() => {
    fetchAdminPrices();
    fetchFinalPrices();
  }, []);

  const handleChange = (index, field, value) => {
    const updated = [...adminPrices];
    updated[index][field] = value;
    setAdminPrices(updated);
  };

  const handleUpdate = async (price) => {
    await axiosInstance.put("/admin/prices", price);
    alert("Pricing Updated Successfully ✅");
    fetchAdminPrices();
    fetchFinalPrices();
  };

const getFinalPrice = (metal) => {
  const found = finalPrices.find(
    (f) => f.metal_type === metal
  );

  if (!found) return "-";

  return found.final_price;
};


  return (
    <div style={{ padding: 30 }}>
      <h1 style={{ marginBottom: 30 }}>
        💰 Metal Pricing Management
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: 30,
        }}
      >
        {adminPrices.map((price, index) => (
          <div
            key={price.metal_type}
            style={{
              background:
                "linear-gradient(135deg,#4f46e5,#9333ea)",
              padding: 30,
              borderRadius: 20,
              color: "#fff",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            }}
          >
            <h2 style={{ marginBottom: 20 }}>
              {price.metal_type}
            </h2>

            {/* FIXED PRICE */}
            <div style={{ marginBottom: 15 }}>
              <label>Fixed Price (₹ / gram)</label>
              <input
                type="number"
                value={price.price_per_gram || ""}
                onChange={(e) =>
                  handleChange(
                    index,
                    "price_per_gram",
                    e.target.value
                  )
                }
                style={inputStyle}
              />
            </div>

            {/* MARKET PRICE */}
            <div style={{ marginBottom: 15 }}>
              <label>Market Price</label>
              <input
                type="number"
                value={price.market_price || ""}
                onChange={(e) =>
                  handleChange(
                    index,
                    "market_price",
                    e.target.value
                  )
                }
                style={inputStyle}
              />
            </div>

            {/* MARGIN */}
            <div style={{ marginBottom: 20 }}>
              <label>Margin %</label>
              <input
                type="number"
                value={price.margin || ""}
                onChange={(e) =>
                  handleChange(index, "margin", e.target.value)
                }
                style={inputStyle}
              />
            </div>

            <button
              onClick={() => handleUpdate(price)}
              style={buttonStyle}
            >
              Update Pricing
            </button>

            <hr
              style={{
                margin: "25px 0",
                borderColor: "rgba(255,255,255,0.3)",
              }}
            />

            <div>
              <p style={{ opacity: 0.9 }}>
                Final User Price:
              </p>
              <h2>
                     ₹ {getFinalPrice(price.metal_type)} / gram
              </h2>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const inputStyle = {
  width: "100%",
  padding: 10,
  borderRadius: 8,
  border: "none",
  marginTop: 5,
};

const buttonStyle = {
  width: "100%",
  padding: 12,
  borderRadius: 10,
  border: "none",
  background: "#fff",
  color: "#4f46e5",
  fontWeight: "bold",
  cursor: "pointer",
};
