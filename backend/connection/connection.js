const mongoose = require("mongoose");

const connection = async () => {
    try {
        await mongoose.connect(process.env.URI);
        console.log("Database Connected");
    } catch (error) {
        console.log("❌ DB Connection Error:", error.message);
    }  
};

module.exports = connection;