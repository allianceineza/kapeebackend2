import jwt from "jsonwebtoken";
import { IUser } from "../models/userModel";

const generateAccessToken = (user: IUser): string => {
    const payload = {
        id: user._id,
        email: user.Email,
        role: user.Role
    };
    const secret = process.env.JWT_SECRET || "defaultsecret";
    const token = jwt.sign(payload, secret, { expiresIn: "1h" });
    return token;
};

export { generateAccessToken };
