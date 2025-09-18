import User from "../models/signupModel.js"; 
import bcrypt from "bcryptjs";
import { generateAccessToken } from "../utils/tokenGenerating.js";

export const Login = async (req, res) => {
    console.log("=== LOGIN DEBUG ===");
    console.log("Request body:", req.body);
    console.log("==================");

    try {
        
        if (!req.body) {
            return res.status(400).json({
                message: "No request body received"
            });
        }

        const { Email, Password } = req.body;

        // Validate required fields
        if (!Email || !Password) {
            return res.status(400).json({
                message: "Email and Password are required"
            });
        }

        
        const user = await User.findOne({ Email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        
        const isMatch = await bcrypt.compare(Password, user.Password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate access token
        const accessToken = generateAccessToken(user);

        // Update user tokens
        user.tokens.accessToken = accessToken; // Fixed: should be user.tokens.accessToken
        await user.save();

        // Prepare response
        const userResponse = {
            _id: user._id,
            Name: user.Name,        // Fixed: was userEmail, should be Name
            Email: user.Email,      // Fixed: added Email field
            Role: user.Role,        // Added Role field
            tokens: { accessToken }
        };

        res.status(200).json({ 
            message: "Login successful!",
            user: userResponse 
        });

    } catch (error) {
        console.log("Login error:", error);
        res.status(500).json({ 
            message: "Server error", 
            error: error.message 
        });
    }
};