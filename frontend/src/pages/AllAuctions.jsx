import React, { useEffect, useState } from "react";
import axios from "axios";

const AllAuctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidAmounts, setBidAmounts] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [highestBids, setHighestBids] = useState({}); // Store highest bids keyed by auctionId

  const fetchAuctions = async () => {
    try {
      const res = await axios.get("http://localhost:1000/api/v1/auction/all-auctions");
      const now = new Date();
      const activeAuctions = res.data.filter(
        (auction) => !auction.endTime || new Date(auction.endTime) > now
      );
      setAuctions(activeAuctions);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load auctions", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchHighestBids = async () => {
    try {
      const res = await axios.get("http://localhost:1000/api/v1/auction/highest-bids");
      // Convert array to object keyed by auctionId for easy lookup
      const bidsMap = {};
      res.data.forEach((bid) => {
        bidsMap[bid.auctionId] = bid;
      });
      setHighestBids(bidsMap);
    } catch (err) {
      console.error("Failed to load highest bids", err);
    }
  };

  useEffect(() => {
    fetchAuctions();
    fetchHighestBids();
    const interval = setInterval(() => {
      fetchAuctions();
      fetchHighestBids();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleBidChange = (auctionId, value) => {
    setBidAmounts((prev) => ({ ...prev, [auctionId]: value }));
  };

  const handlePlaceBid = async (auctionId) => {
    const bidAmount = bidAmounts[auctionId];
    if (!bidAmount || isNaN(bidAmount)) return alert("Please enter a valid bid amount");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:1000/api/v1/auction/place-bid/${auctionId}`,
        { bidAmount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Bid placed successfully");
      setError(null);
      setBidAmounts((prev) => ({ ...prev, [auctionId]: "" }));
      fetchAuctions(); // Refresh auction prices and last bidder
      fetchHighestBids(); // Refresh highest bids
    } catch (err) {
      console.error("Error placing bid:", err);
      setSuccess("");
      setError(err.response?.data?.message || "Failed to place bid");
    }
  };

  if (loading) return <div>Loading auctions...</div>;
  if (error && !success) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Auctions</h2>
      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {auctions.length > 0 ? (
          auctions.map((auction) => {
            const highestBid = highestBids[auction._id];
            return (
              <div
                key={auction._id}
                style={{
                  border: "1px solid #ccc",
                  padding: "15px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <h3>{auction.title}</h3>
                <img
                  src={auction.imgUrl}
                  alt={auction.title}
                  style={{ width: "100%", height: "200px", objectFit: "cover" }}
                />
                <p>{auction.description}</p>
                <p>
                  <strong>Price:</strong> ${auction.starting_price}
                </p>
                {auction.endTime && (
                  <p>
                    <strong>End Time:</strong>{" "}
                    {new Date(auction.endTime).toLocaleString()}
                  </p>
                )}
                {highestBid && (
                  <div style={{ marginTop: "10px" }}>
                    <p><strong>Current Price:</strong> ${highestBid.highestBidAmount}</p>
                  </div>
                )}
                <div style={{ marginTop: "10px" }}>
                  <input
                    type="number"
                    placeholder="Your bid amount"
                    value={bidAmounts[auction._id] || ""}
                    onChange={(e) => handleBidChange(auction._id, e.target.value)}
                    style={{ padding: "5px", width: "70%" }}
                  />
                  <button
                    onClick={() => handlePlaceBid(auction._id)}
                    style={{
                      marginLeft: "10px",
                      padding: "6px 12px",
                      cursor: "pointer",
                    }}
                  >
                    Place Bid
                  </button>
                </div>
                {highestBid && (
                  <div style={{ marginTop: "10px" }}>
                    <p><strong>Last Bid By:</strong> {highestBid.username || "Unknown"} <strong>Bid Amount:</strong> ${highestBid.highestBidAmount}</p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p>No active auctions available</p>
        )}
      </div>
    </div>
  );
};

export default AllAuctions;
