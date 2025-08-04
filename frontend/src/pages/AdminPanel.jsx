import React from "react";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const navigate = useNavigate();

  const goToAuctionManager = () => {
    navigate("/auction-manager");
  };

  const goToBiddersTable = () => {
    navigate("/bidders-table");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Admin Panel</h2>
      <button onClick={goToAuctionManager} style={styles.button}>
        Auction Manager
      </button>
      <button onClick={goToBiddersTable} style={{ ...styles.button, marginTop: "15px" }}>
        View Bidders Table
      </button>
    </div>
  );
};

const styles = {
  container: {
    padding: "40px",
    textAlign: "center",
  },
  header: {
    marginBottom: "20px",
    fontSize: "28px",
    color: "#333",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#800000",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    margin: "0 10px",
  },
};

export default AdminPanel;
