import jwt from "jsonwebtoken";
import User from "../models/userModal.js"; // Ensure filename is correct
import dotenv from "dotenv";

dotenv.config();
console.log("JWT_SECRET:", process.env.JWT_SECRET);

export const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Invalid Authorization header format" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Token missing" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOne({
            _id: decoded._id, // Make sure _id is included in token
            "tokens.accessToken": token,
        });

        if (!user) {
            return res.status(401).json({ message: "User not found or token invalid" });
        }

        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
        res.status(401).json({ message: "Authentication failed", error: error.message });
    }
};
