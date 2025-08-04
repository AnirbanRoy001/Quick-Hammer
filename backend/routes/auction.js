const router = require("express").Router();
const Auction = require("../models/auction");
const Bid = require("../models/bid");
const { authenticateToken } = require("./userAuth");

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    const { role } = req.user;
    if (role !== "admin") return res.status(403).json({ message: "Access denied" });
    next();
};

// Auto-update auction status every 1 minute
const autoUpdateAuctionStatus = async () => {
    try {
        const now = new Date();
        await Auction.updateMany(
            { currentStatus: "active", endTime: { $lte: now } },
            { $set: { currentStatus: "ended" } }
        );
    } catch (error) {
        console.error("Error updating auction statuses:", error);
    }
};
setInterval(autoUpdateAuctionStatus, 60 * 1000); // every 1 minute

// Create Auction
router.post("/create-auction", authenticateToken, isAdmin, async (req, res) => {
    try {
        const { title, imgUrl, description, starting_price, duration } = req.body;
        const createdBy = req.user.id;

        const now = new Date();
        const endTime = new Date(now.getTime() + duration * 60 * 60 * 1000); // duration in hours

        const newAuction = new Auction({
            title,
            imgUrl,
            description,
            starting_price,
            duration,
            endTime,
            currentStatus: "active",
            createdBy,
        });

        await newAuction.save();
        return res.status(201).json({ message: "Auction created", auction: newAuction });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// Edit Auction
router.put("/edit-auction/:id", authenticateToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // If duration is being updated, recalculate endTime
        if (updates.duration) {
            const auction = await Auction.findById(id);
            if (!auction) return res.status(404).json({ message: "Auction not found" });

            const createdAt = auction.createdAt || new Date();
            updates.endTime = new Date(new Date(createdAt).getTime() + updates.duration * 60 * 60 * 1000);
        }

        const updatedAuction = await Auction.findByIdAndUpdate(id, updates, { new: true });
        return res.status(200).json({ message: "Auction updated", auction: updatedAuction });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// Delete Auction
router.delete("/delete-auction/:id", authenticateToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await Auction.findByIdAndDelete(id);
        return res.status(200).json({ message: "Auction deleted" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get All Auctions (public for users)
router.get("/all-auctions", async (req, res) => {
    try {
        const auctions = await Auction.find().populate("createdBy", "username");
        return res.status(200).json(auctions);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// Place a bid on an auction
router.post("/place-bid/:auctionId", authenticateToken, async (req, res) => {
    try {
        const { auctionId } = req.params;
        const { bidAmount } = req.body;
        const userId = req.user.id;

        if (!bidAmount || bidAmount <= 0) {
            return res.status(400).json({ message: "Bid amount must be greater than 0" });
        }

        const auction = await Auction.findById(auctionId);
        if (!auction) return res.status(404).json({ message: "Auction not found" });

        // Check if auction is still active
        const now = new Date();
        if (auction.endTime <= now || auction.currentStatus === "ended") {
            return res.status(400).json({ message: "Auction has already ended" });
        }

        // Ensure bid is higher than current price
        if (bidAmount <= auction.starting_price) {
            return res.status(400).json({ message: "Bid must be higher than current price" });
        }

        // Update auction's price
        auction.starting_price = bidAmount;
        await auction.save();

        // Save bid in Bid collection
        const newBid = new Bid({
            auction: auctionId,
            user: userId,
            bidAmount,
        });

        await newBid.save();

        return res.status(200).json({ message: "Bid placed successfully", auction, bid: newBid });
    } catch (error) {
        console.error("Error placing bid:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get all bids for all auctions individually and the usernames who placed them
router.get("/bids/:auctionId", async (req, res) => {
    try {
        const { auctionId } = req.params;

        // Fetch bids related to the auction, sorted from highest to lowest
        const bids = await Bid.find({ auction: auctionId })
            .populate("user", "username") // Optional: include bidder username
            .sort({ bidAmount: -1 });

        return res.status(200).json(bids);
    } catch (error) {
        console.error("Error fetching bids:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get highest bid and bidder username for each auction
router.get("/highest-bids", async (req, res) => {
    try {
        const highestBids = await Bid.aggregate([
            // Sort bids by amount descending
            { $sort: { bidAmount: -1 } },

            // Group by auction to keep only the highest bid per auction
            {
                $group: {
                    _id: "$auction",
                    highestBidAmount: { $first: "$bidAmount" },
                    userId: { $first: "$user" }
                }
            },

            // Lookup to get username from user collection
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userInfo"
                }
            },

            // Lookup to get auction title
            {
                $lookup: {
                    from: "auctions",
                    localField: "_id",
                    foreignField: "_id",
                    as: "auctionInfo"
                }
            },

            // Simplify result
            {
                $project: {
                    _id: 0,
                    auctionId: "$_id",
                    auctionTitle: { $arrayElemAt: ["$auctionInfo.title", 0] },
                    username: { $arrayElemAt: ["$userInfo.username", 0] },
                    highestBidAmount: 1
                }
            }
        ]);

        return res.status(200).json(highestBids);
    } catch (error) {
        console.error("Error fetching highest bids:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});



module.exports = router;
