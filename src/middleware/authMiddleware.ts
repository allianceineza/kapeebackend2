import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/userModel";

interface AuthRequest extends Request {
    user?: IUser;
}

const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "defaultsecret") as any;
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
    }
    if (req.user.Role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
    }
    next();
};

export { authMiddleware, adminMiddleware };
