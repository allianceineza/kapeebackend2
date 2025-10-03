import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/userModel.js";

interface AuthRequest extends Request {
    user?: IUser;
}

const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
    }
    if (req.user.Role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
    }
    next();
};

export { adminMiddleware };
