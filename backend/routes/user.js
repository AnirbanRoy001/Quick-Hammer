const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require('bcryptjs');
//const hashedPass = await bcrypt.hash("plainpassword", 10);
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./userAuth");
//sign up
router.post("/sign-up", async (req,res) => {
    try {
        let { username, email, password, address } = req.body;

         // Normalize input
        username = username.toLowerCase().trim();
        email = email.toLowerCase().trim();
        //check username's length
        if (username.length < 6 )
        {
            return res
            .status(400)
            .json({ message: "Username length should be greater"});
        }

        //check if username already exist
        const existingUsername = await User.findOne({ username: username });
        if (existingUsername) {
            return res
            .status(400)
            .json({ message: "Username already exist" });
        }


        //check if email already exist
        const existingEmail = await User.findOne({ email: email });
        if (existingEmail) {
            return res
            .status(400)
            .json({ message: "Email already exist" });
        }

        //check password's length
        if (password.length < 6)
        {
            return res
            .status(400)
            .json({ message: "Password length should be greater"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ 
            username, 
            email, 
            password: hashedPassword, // Store hashed password
            address 
        });
        await newUser.save();
        return res.status(200).json({ message: "Signup Successful" });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

//sign in
router.post("/sign-in", async (req,res) => {
    try {
        
        let { username, password } = req.body;
        
        username = username.toLowerCase().trim();

        const existingUser = await User.findOne({ username });
        if (!existingUser)
        {
            //console.log("User not found");
            return res.status(400).json({ message: "Invalid credentials" });
        }

        //console.log("User found, comparing password...");
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            console.log("Password mismatch");
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate token
        const token = jwt.sign(
            { 
                id: existingUser._id,
                username: existingUser.username,
                role: existingUser.role 
            }, 
            "auctionplatform", 
            { expiresIn: "60d" }
        );

        return res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                id: existingUser._id,
                username: existingUser.username,
                role: existingUser.role
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

//get user info
router.get("/get-user-info", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const data = await User.findById(id).select('-password');
        return res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Internal Server error" });
    }
});

//update address
router.put("/update.address", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const { address } = req.body;
        await User.findByIdAndUpdate(id, { address: address });
        return res.status(200).json({message:"Address Updated"});
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
module.exports = router;
