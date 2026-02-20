import { useEffect, useState } from "react";
import {
  getAllCoinsApi,
  addCoinApi,
  updateCoinApi,
} from "../../api/coin.api";

const Coins = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    metal_type: "GOLD",
    weight_grams: "",
    base_price: "",
    discount_type: "",
    discount_value: "",
  });

  const fetchCoins = async () => {
    setLoading(true);
    const data = await getAllCoinsApi();
    setCoins(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCoins();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddCoin = async (e) => {
    e.preventDefault();

    await addCoinApi({
      ...form,
      base_price: Number(form.base_price),
      weight_grams: Number(form.weight_grams),
      discount_value: Number(form.discount_value || 0),
    });

    setForm({
      name: "",
      metal_type: "GOLD",
      weight_grams: "",
      base_price: "",
      discount_type: "",
      discount_value: "",
    });

    fetchCoins();
  };

  const toggleAvailability = async (coin) => {
    await updateCoinApi(coin.id, {
      base_price: coin.base_price,
      discount_type: coin.discount_type,
      discount_value: coin.discount_value,
      is_available: !coin.is_available,
    });
    fetchCoins();
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Coins Management</h1>

      <form onSubmit={handleAddCoin} style={styles.form}>
        <input name="name" placeholder="Coin Name" value={form.name} onChange={handleChange} required />
        <select name="metal_type" value={form.metal_type} onChange={handleChange}>
          <option value="GOLD">Gold</option>
          <option value="SILVER">Silver</option>
        </select>
        <input name="weight_grams" placeholder="Weight (grams)" value={form.weight_grams} onChange={handleChange} required />
        <input name="base_price" placeholder="Base Price" value={form.base_price} onChange={handleChange} required />
        <button type="submit" style={styles.addButton}>Add Coin</button>
      </form>

      <div style={styles.tableContainer}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Metal</th>
                <th>Weight</th>
                <th>Base</th>
                <th>Final</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {coins.map((coin) => (
                <tr key={coin.id}>
                  <td>{coin.name}</td>
                  <td>{coin.metal_type}</td>
                  <td>{coin.weight_grams} g</td>
                  <td>₹ {coin.base_price}</td>
                  <td>₹ {coin.final_price}</td>
                  <td>{coin.is_available ? "Active" : "Disabled"}</td>
                  <td>
                    <button
                      onClick={() => toggleAvailability(coin)}
                      style={styles.actionButton}
                    >
                      {coin.is_available ? "Disable" : "Enable"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
  form: {
    display: "flex",
    gap: "10px",
    marginBottom: "25px",
  },
  addButton: {
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    color: "#fff",
    border: "none",
    padding: "8px 18px",
    borderRadius: "8px",
    cursor: "pointer",
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
  actionButton: {
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default Coins;
