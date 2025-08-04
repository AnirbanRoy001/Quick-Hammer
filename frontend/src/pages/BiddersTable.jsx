import React, { useEffect, useState } from "react";
import axios from "axios";

const BiddersTable = () => {
  const [biddersData, setBiddersData] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBiddersData = async () => {
      try {
        const res = await axios.get("http://localhost:1000/api/v1/auction/all-auctions", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const formattedData = res.data.map((auction) => ({
          title: auction.title,
          highestBid: auction.starting_price || "N/A",
          bidder: auction.username || "N/A",
        }));

        setBiddersData(formattedData);
      } catch (err) {
        console.error("Failed to fetch bidders data", err);
      }
    };

    fetchBiddersData();
  }, [token]);

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Bidders Table</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Auction Title</th>
            <th>Highest Bid</th>
            <th>Bidder Username</th>
          </tr>
        </thead>
        <tbody>
          {biddersData.map((auction, index) => (
            <tr key={index}>
              <td>{auction.title}</td>
              <td>${auction.highestBid}</td>
              <td>{auction.bidder}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: { padding: "40px" },
  header: { fontSize: "28px", marginBottom: "20px" },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    borderBottom: "2px solid #333",
    padding: "10px",
    textAlign: "left",
  },
  td: {
    borderBottom: "1px solid #ccc",
    padding: "10px",
  },
};

export default BiddersTable;
