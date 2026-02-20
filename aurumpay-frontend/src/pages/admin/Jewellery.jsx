import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

const BASE_URL = "http://localhost:5000";

export default function Jewellery() {
  const [jewellery, setJewellery] = useState([]);
  const [prices, setPrices] = useState({});
  const [previewMedia, setPreviewMedia] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const [formData, setFormData] = useState({
    name: "",
    category: "GOLD",
    weight_grams: "",
    making_charge: "",
    description: "",
  });

  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchJewellery();
  }, []);

  const fetchJewellery = async () => {
    const res = await axiosInstance.get("/jewellery");
    const items = res.data.jewellery;
    setJewellery(items);

    const priceMap = {};
    for (let item of items) {
      try {
        const p = await axiosInstance.get(`/jewellery/${item.id}/price`);
        priceMap[item.id] = p.data.price;
      } catch {
        priceMap[item.id] = null;
      }
    }
    setPrices(priceMap);
  };

  /* ================= UPLOAD ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Select image");

    const data = new FormData();
    Object.keys(formData).forEach((key) =>
      data.append(key, formData[key])
    );
    data.append("image", file);

    await axiosInstance.post("/jewellery", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setFormData({
      name: "",
      category: "GOLD",
      weight_grams: "",
      making_charge: "",
      description: "",
    });

    setFile(null);
    fetchJewellery();
  };

  /* ================= EDIT SAVE ================= */

  const handleEditSave = async () => {
    await axiosInstance.put(`/jewellery/${editItem.id}`, editItem);
    setEditItem(null);
    fetchJewellery();
  };

  /* ================= DELETE ================= */

  const confirmDelete = async () => {
    await axiosInstance.delete(`/jewellery/${deleteItem.id}`);
    setDeleteItem(null);
    fetchJewellery();
  };

  /* ================= FILTER ================= */

  const filteredJewellery = jewellery.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "ALL" ||
      item.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  /* ================= TOGGLE ================= */

  const toggleStatus = async (id, current) => {
    await axiosInstance.put(`/jewellery/${id}/status`, {
      is_available: !current,
    });

    setJewellery((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, is_available: !current }
          : item
      )
    );
  };

  const isVideo = (url) =>
    url?.endsWith(".mp4") ||
    url?.endsWith(".mov") ||
    url?.endsWith(".webm");

  return (
    <div style={{ padding: 30 }}>
      <h2>💎 Jewellery Management</h2>

      {/* SEARCH + FILTER */}
      <div style={{ display: "flex", gap: 15, marginBottom: 20 }}>
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={input}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={input}
        >
          <option value="ALL">All</option>
          <option value="GOLD">Gold</option>
          <option value="SILVER">Silver</option>
        </select>
      </div>

      {/* UPLOAD FORM */}
      <div style={formCard}>
        <h3>Add Jewellery</h3>
        <form onSubmit={handleSubmit}>
          <div style={grid}>
            <input
              placeholder="Name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              style={input}
            />

            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              style={input}
            >
              <option value="GOLD">GOLD</option>
              <option value="SILVER">SILVER</option>
            </select>

            <input
              type="number"
              placeholder="Weight"
              required
              value={formData.weight_grams}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  weight_grams: e.target.value,
                })
              }
              style={input}
            />

            <input
              type="number"
              placeholder="Making Charge"
              value={formData.making_charge}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  making_charge: e.target.value,
                })
              }
              style={input}
            />
          </div>

          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }
            style={{ ...input, marginTop: 10 }}
          />

          <input
            type="file"
            required
            onChange={(e) => setFile(e.target.files[0])}
            style={{ marginTop: 10 }}
          />

          <button type="submit" style={primaryBtn}>
            Upload Jewellery
          </button>
        </form>
      </div>

      {/* CARDS */}
      <div style={cardGrid}>
        {filteredJewellery.map((item) => {
          const mediaUrl = item.image_url
            ? BASE_URL + item.image_url
            : null;

          return (
            <div key={item.id} style={card}>
              {mediaUrl && (
                <img src={mediaUrl} alt="" style={media} />
              )}

              <div style={{ padding: 15 }}>
                <h3>{item.name}</h3>
                <p>{item.category}</p>

                {prices[item.id] && (
                  <>
                    <p>Price/g: ₹{prices[item.id].price_per_gram}</p>
                    <p>Total: ₹{prices[item.id].total_price}</p>
                  </>
                )}

                <p>
                  Status:{" "}
                  <b
                    style={{
                      color: item.is_available ? "green" : "red",
                    }}
                  >
                    {item.is_available ? "Available" : "Unavailable"}
                  </b>
                </p>

                <div style={buttonRow}>
                  <button
                    style={{
                      background: item.is_available ? "green" : "gray",
                      color: "#fff",
                      border: "none",
                      padding: 8,
                      borderRadius: 8,
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      toggleStatus(item.id, item.is_available)
                    }
                  >
                    {item.is_available
                      ? "Mark Unavailable"
                      : "Mark Available"}
                  </button>

                  <button style={viewBtn} onClick={() => setPreviewMedia(mediaUrl)}>
                    View
                  </button>

                  <button style={editBtn} onClick={() => setEditItem(item)}>
                    Edit
                  </button>

                  <button style={deleteBtn} onClick={() => setDeleteItem(item)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* VIEW MODAL */}
      {previewMedia && (
        <div style={overlay}>
          <div style={modal}>
            <img src={previewMedia} alt="" style={{ width: 400 }} />
            <button style={closeBtn} onClick={() => setPreviewMedia(null)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editItem && (
        <div style={overlay}>
          <div style={modal}>
            <h3>Edit Jewellery</h3>

            <input
              style={input}
              value={editItem.name}
              onChange={(e) =>
                setEditItem({ ...editItem, name: e.target.value })
              }
            />

            <input
              style={input}
              type="number"
              value={editItem.weight_grams}
              onChange={(e) =>
                setEditItem({
                  ...editItem,
                  weight_grams: e.target.value,
                })
              }
            />

            <input
              style={input}
              type="number"
              value={editItem.making_charge}
              onChange={(e) =>
                setEditItem({
                  ...editItem,
                  making_charge: e.target.value,
                })
              }
            />

            <button style={primaryBtn} onClick={handleEditSave}>
              Save
            </button>

            <button style={closeBtn} onClick={() => setEditItem(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteItem && (
        <div style={overlay}>
          <div style={modal}>
            <h3>Are you sure?</h3>
            <button style={deleteBtn} onClick={confirmDelete}>
              Delete
            </button>
            <button style={closeBtn} onClick={() => setDeleteItem(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* STYLES */

const formCard = {
  background: "linear-gradient(135deg,#4f46e5,#9333ea)",
  padding: 25,
  borderRadius: 20,
  marginBottom: 30,
  color: "#fff",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
  gap: 10,
};

const input = {
  padding: 10,
  borderRadius: 8,
  border: "1px solid #ccc",
};

const primaryBtn = {
  marginTop: 15,
  padding: 10,
  borderRadius: 8,
  border: "none",
  background: "#fff",
  color: "#4f46e5",
  fontWeight: "bold",
  cursor: "pointer",
};

const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
  gap: 25,
};

const card = {
  background: "#fff",
  borderRadius: 20,
  overflow: "hidden",
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
};

const media = {
  width: "100%",
  height: 220,
  objectFit: "cover",
};

const buttonRow = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
  marginTop: 10,
};

const viewBtn = {
  background: "#4f46e5",
  color: "#fff",
  border: "none",
  padding: 8,
  borderRadius: 8,
  cursor: "pointer",
};

const editBtn = {
  background: "#9333ea",
  color: "#fff",
  border: "none",
  padding: 8,
  borderRadius: 8,
  cursor: "pointer",
};

const deleteBtn = {
  background: "red",
  color: "#fff",
  border: "none",
  padding: 8,
  borderRadius: 8,
  cursor: "pointer",
};

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modal = {
  background: "#fff",
  padding: 20,
  borderRadius: 15,
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const closeBtn = {
  background: "gray",
  color: "#fff",
  border: "none",
  padding: 8,
  borderRadius: 8,
  cursor: "pointer",
};