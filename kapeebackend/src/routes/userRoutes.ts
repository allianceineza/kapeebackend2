import { Login, Register, getAllUsers, getUserById, deleteUser, bulkDeleteUsers, updateUserRole, getUserStats } from "../controllers/UserController.js";
import express from "express";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/SignupForm", Register);
userRouter.post("/login", Login);
userRouter.get("/getAllUsers", authMiddleware, adminMiddleware, getAllUsers);
userRouter.get("/getUserById/:id", authMiddleware, getUserById);
userRouter.delete("/deleteUser/:id", authMiddleware, adminMiddleware, deleteUser);
userRouter.delete("/bulkDeleteUsers", authMiddleware, adminMiddleware, bulkDeleteUsers);
userRouter.put("/updateUserRole/:id", authMiddleware, adminMiddleware, updateUserRole);
userRouter.get("/getUserStats", authMiddleware, adminMiddleware, getUserStats);

export default userRouter;
