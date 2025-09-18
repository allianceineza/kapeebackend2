import User from "../models/signupModel.js";
import bcrypt from "bcryptjs"; 
import { generateAccessToken } from "../utils/tokenGenerating.js";

export const Register = async (req, res) => {
    // Add debugging to see what's being received
    console.log("=== DEBUG INFO ===");
    console.log("Request body:", req.body);
    console.log("Request headers:", req.headers);
    console.log("Content-Type:", req.headers['content-type']);
    console.log("==================");

    try {
        // Check if req.body exists
        if (!req.body) {
            return res.status(400).json({
                message: "No request body received",
                debug: {
                    body: req.body,
                    contentType: req.headers['content-type']
                }
            });
        }

        const { Name, Email, Password, Role } = req.body;

        // Check if required fields are present
        if (!Name || !Email || !Password) {
            return res.status(400).json({
                message: "Missing required fields",
                received: { Name, Email, Password: Password ? "***" : undefined, Role }
            });
        }

        const existingUser = await User.findOne({ Email });
        if (existingUser) {
            return res.status(400).json({ message: "email already exists" });
        }

        const hashedPassword = await bcrypt.hash(Password, 10);

        const user = new User({
            Name, Email, Password: hashedPassword, Role
        });

        user.tokens.accessToken = generateAccessToken(user);
        await user.save();

        res.status(201).json({
            message: "Account created Successfully!",
            user: {
                ...user.toObject(),
                tokens: {
                    accessToken: user.tokens.accessToken, // Fixed typo: was "accesssToken"
                },
            },
        });
    } catch (error) {
        console.log("Error details:", error);
        res.status(500).json({ message: "Failed to register user", error: error.message });
    }
};