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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * ✅ ADD COIN WITH VALIDATION
   */
  const handleAddCoin = async (e) => {
    e.preventDefault();

    const basePrice = Number(form.base_price);
    const discountValue = Number(form.discount_value || 0);

    // 🔒 VALIDATIONS (VERY IMPORTANT)
    if (basePrice <= 0) {
      alert("Base price must be greater than 0");
      return;
    }

    if (discountValue < 0) {
      alert("Discount cannot be negative");
      return;
    }

    if (
      form.discount_type === "PERCENT" &&
      discountValue > 100
    ) {
      alert("Percent discount cannot exceed 100%");
      return;
    }

    await addCoinApi({
      ...form,
      base_price: basePrice,
      weight_grams: Number(form.weight_grams),
      discount_value: discountValue,
    });

    // Reset form
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

  /**
   * ✅ ENABLE / DISABLE COIN
   */
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
    <div>
      <h2>Coins Management</h2>

      {/* ADD COIN FORM */}
      <form onSubmit={handleAddCoin} style={{ marginBottom: 30 }}>
        <input
          name="name"
          placeholder="Coin Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <select
          name="metal_type"
          value={form.metal_type}
          onChange={handleChange}
        >
          <option value="GOLD">Gold</option>
          <option value="SILVER">Silver</option>
        </select>

        <input
          name="weight_grams"
          placeholder="Weight (grams)"
          value={form.weight_grams}
          onChange={handleChange}
          required
        />

        <input
          name="base_price"
          placeholder="Base Price"
          value={form.base_price}
          onChange={handleChange}
          required
        />

        <select
          name="discount_type"
          value={form.discount_type}
          onChange={handleChange}
        >
          <option value="">No Discount</option>
          <option value="FLAT">Flat</option>
          <option value="PERCENT">Percent</option>
        </select>

        {/* 🔥 SHOW DISCOUNT INPUT ONLY IF SELECTED */}
        {form.discount_type && (
          <input
            name="discount_value"
            placeholder="Discount Value"
            value={form.discount_value}
            onChange={handleChange}
          />
        )}

        <button type="submit">Add Coin</button>
      </form>

      {/* COINS TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Name</th>
              <th>Metal</th>
              <th>Weight</th>
              <th>Base</th>
              <th>Discount</th>
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
                <td>
                  {coin.discount_type
                    ? `${coin.discount_type} (${coin.discount_value})`
                    : "--"}
                </td>
                <td>₹ {coin.final_price}</td>
                <td>{coin.is_available ? "Active" : "Disabled"}</td>
                <td>
                  <button onClick={() => toggleAvailability(coin)}>
                    {coin.is_available ? "Disable" : "Enable"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Coins;
