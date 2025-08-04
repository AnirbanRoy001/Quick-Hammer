const mongoose = require("mongoose");

const auctionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    imgUrl: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    starting_price: {
        type: Number,
        required: true,
    },
    duration: {
        type: Number, // in hours
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    currentStatus: {
        type: String,
        enum: ["active", "ended"],
        default: "active",
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("auction", auctionSchema);
