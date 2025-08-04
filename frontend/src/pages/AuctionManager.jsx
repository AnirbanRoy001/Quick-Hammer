import React, { useEffect, useState } from "react";
import axios from "axios";

const AuctionManager = () => {
  const [auctions, setAuctions] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    imgUrl: "",
    description: "",
    starting_price: "",
    duration: "",
  });
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("token");

  const fetchAuctions = async () => {
    try {
      const res = await axios.get("http://localhost:1000/api/v1/auction/all-auctions");
      setAuctions(res.data);
    } catch (err) {
      console.error("Failed to fetch auctions", err);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddAuction = async () => {
    try {
      const token = localStorage.getItem("token"); 
  
      const response = await fetch("http://localhost:1000/api/v1/auction/create-auction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({
          title: formData.title,
          imgUrl: formData.imgUrl,
          description: formData.description,
          starting_price: parseFloat(formData.starting_price),
          duration: parseInt(formData.duration),
        }),
      });
  
      //const data = await response.json();
  
      if (!response.ok) {
        const errorData = await response.text(); 
        console.error("Server response:", errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Auction created:", data);
      setAuctions([...auctions, data.auction]);
      resetForm();
    } catch (err) {
      console.error("Error adding auction", err);
    }
  };
  

  const handleEdit = (auction) => {
    setFormData({
      title: auction.title,
      imgUrl: auction.imgUrl,
      description: auction.description,
      starting_price: auction.starting_price,
      duration: auction.duration,
    });
    setEditingId(auction._id);
  };

  const handleSaveEdit = async () => {
    try {
      const res = await axios.put(
        `http://localhost:1000/api/v1/auction/edit-auction/${editingId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAuctions(auctions.map(a => (a._id === editingId ? res.data.auction : a)));
      resetForm();
    } catch (err) {
      console.error("Error editing auction", err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:1000/api/v1/auction/delete-auction/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAuctions(auctions.filter((a) => a._id !== id));
      if (id === editingId) resetForm();
    } catch (err) {
      console.error("Error deleting auction", err.response?.data || err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      imgUrl: "",
      description: "",
      starting_price: "",
      duration: "",
    });
    setEditingId(null);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Auction Manager</h2>
      <div style={styles.form}>
        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} style={styles.input} />
        <input type="text" name="imgUrl" placeholder="Image URL" value={formData.imgUrl} onChange={handleChange} style={styles.input} />
        <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange} style={styles.input} />
        <input type="number" name="starting_price" placeholder="Starting Price" value={formData.starting_price} onChange={handleChange} style={styles.input} />
        <input type="text" name="duration" placeholder="Duration (in hours)" value={formData.duration} onChange={handleChange} style={styles.input} />
        {editingId ? (
          <button onClick={handleSaveEdit} style={styles.button}>Save Changes</button>
        ) : (
          <button onClick={handleAddAuction} style={styles.button}>Add Auction</button>
        )}
        {editingId && (
          <button onClick={resetForm} style={styles.cancelButton}>Cancel</button>
        )}
      </div>

      <div style={styles.list}>
        {auctions.map((auction) => (
          <div key={auction._id} style={styles.card}>
            <img src={auction.imgUrl} alt={auction.title} style={styles.image} />
            <h3>{auction.title}</h3>
            <p>{auction.description}</p>
            <p>Price: ${auction.starting_price}</p>
            <p>Duration: {auction.duration} hours</p>
            <button onClick={() => handleEdit(auction)} style={styles.editButton}>Edit</button>
            <button onClick={() => handleDelete(auction._id)} style={styles.deleteButton}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: "40px" },
  header: { fontSize: "28px", marginBottom: "20px" },
  form: { marginBottom: "30px" },
  input: {
    display: "block",
    margin: "10px 0",
    padding: "8px",
    width: "300px",
  },
  button: {
    padding: "10px 15px",
    marginRight: "10px",
    backgroundColor: "#800000",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  cancelButton: {
    padding: "10px 15px",
    backgroundColor: "#999",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  list: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
  },
  card: {
    border: "1px solid #ccc",
    padding: "20px",
    width: "250px",
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    marginBottom: "10px",
  },
  editButton: {
    backgroundColor: "#555",
    color: "#fff",
    padding: "6px 12px",
    marginRight: "10px",
    border: "none",
    cursor: "pointer",
  },
  deleteButton: {
    backgroundColor: "#c00",
    color: "#fff",
    padding: "6px 12px",
    border: "none",
    cursor: "pointer",
  },
};

export default AuctionManager;
