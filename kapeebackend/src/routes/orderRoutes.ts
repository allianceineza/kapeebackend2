import { createOrder, getUserOrders, getAllOrders, updateOrderStatus } from "../controllers/OrderController.js";
import express from "express";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";

const orderRouter = express.Router();

orderRouter.post("/create", authMiddleware, createOrder);
orderRouter.get("/getUserOrders", authMiddleware, getUserOrders);
orderRouter.get("/getAll", authMiddleware, adminMiddleware, getAllOrders);
orderRouter.put("/updateStatus/:id", authMiddleware, adminMiddleware, updateOrderStatus);

export default orderRouter;
