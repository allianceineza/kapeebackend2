import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import { generateAccessToken } from "../utils/tokenGenerating.js";

const Login = async (req: Request, res: Response) => {
    try {
        const { Email, Password } = req.body;
        const user = await User.findOne({ Email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(Password, user.Password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = generateAccessToken(user);
        user.tokens.accessToken = token;
        await user.save();
        res.json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export { Login };
