const express = require("express");
const cors = require('cors');
const app = express();
//const path = require('path');


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

require("dotenv").config();
const connectDB = require("./connection/connection");
connectDB();
const User = require("./routes/user");
const AuctionRoutes = require("./routes/auction");

//routes
app.use("/api/v1", User);
app.use("/api/v1/auction", AuctionRoutes);


//creating port
app.listen(process.env.PORT, () => {
    console.log(`Server Beginssss at ${process.env.PORT}`);
});