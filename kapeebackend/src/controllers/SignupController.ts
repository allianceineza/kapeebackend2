import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import { generateAccessToken } from "../utils/tokenGenerating.js";
import { sendEmail } from "../utils/sendEmail.js";

const Register = async (req: Request, res: Response) => {
    try {
        const { Name, Email, Password } = req.body;
        const existingUser = await User.findOne({ Email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(Password, 10);
        const user = new User({ Name, Email, Password: hashedPassword });
        await user.save();
        const token = generateAccessToken(user);
        user.tokens.accessToken = token;
        await user.save();
        await sendEmail(Email, "Welcome", "Welcome to our platform!");
        res.status(201).json({ message: "User registered successfully", token });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export { Register };
