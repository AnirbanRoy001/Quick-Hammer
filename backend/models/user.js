const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "https://i.sstatic.net/l60Hf.png",
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"],
    },
    favourites:[
        {
            type: mongoose.Types.ObjectId,
            ref: "items",
        },
    ],
    cart: [
        {
            type: mongoose.Types.ObjectId,
            ref: "items",
        },
    ],
    corders: [
        {
            type: mongoose.Types.ObjectId,
            ref: "order",
        },
    ],
  },
  { timestamps: true }
);


module.exports = mongoose.models.user || mongoose.model("user", userSchema);