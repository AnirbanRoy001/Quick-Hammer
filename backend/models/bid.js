const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema({
  auction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "auction",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  bidAmount: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true // creates `createdAt` (when bid was made) and `updatedAt`
});

module.exports = mongoose.model("bid", bidSchema);
