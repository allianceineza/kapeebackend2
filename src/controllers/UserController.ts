import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/userModel.js";
import { generateAccessToken } from "../utils/tokenGenerating.js";
import { sendEmail } from "../utils/sendEmail.js";

interface AuthRequest extends Request {
    user?: IUser;
}

const Register = async (req: Request, res: Response) => {
    try {
        const { Name, Email, Password, Role } = req.body;
        const existingUser = await User.findOne({ Email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(Password, 10);
        const user = new User({ Name, Email, Password: hashedPassword, Role: Role || 'user' });
        await user.save();
        const token = generateAccessToken(user);
        user.tokens.accessToken = token;
        await user.save();
        await sendEmail(Email, "Welcome", "Welcome to our platform!");
        res.status(201).json({ message: "User registered successfully", token, user: { _id: user._id, Name: user.Name, Email: user.Email, Role: user.Role } });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

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
        res.json({ message: "Login successful", token, user: { _id: user._id, Name: user.Name, Email: user.Email, Role: user.Role } });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const getAllUsers = async (req: AuthRequest, res: Response) => {
    try {
        const users = await User.find().select("-Password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const getUserById = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.params.id).select("-Password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const deleteUser = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const bulkDeleteUsers = async (req: AuthRequest, res: Response) => {
    try {
        const { ids } = req.body;
        await User.deleteMany({ _id: { $in: ids } });
        res.json({ message: "Users deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const updateUserRole = async (req: AuthRequest, res: Response) => {
    try {
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { Role: role }, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const getUserStats = async (req: AuthRequest, res: Response) => {
    try {
        const totalUsers = await User.countDocuments();
        const adminUsers = await User.countDocuments({ Role: "admin" });
        res.json({ totalUsers, adminUsers });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export { Login, Register, getAllUsers, getUserById, deleteUser, bulkDeleteUsers, updateUserRole, getUserStats };
