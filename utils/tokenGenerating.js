import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateAccessToken = (user) => {
  return jwt.sign(
    { _id:user._id, Email: user.Email,Role:user.Role },
    process.env.JWT_SECRET,
    { expiresIn: "7h" }
  );
};