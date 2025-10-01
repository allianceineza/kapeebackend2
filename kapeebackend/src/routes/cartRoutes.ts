import { addToCart, getCart, removeFromCart, updateCartItem } from "../controllers/CartController.js";
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";

const cartRouter = express.Router();

cartRouter.post("/add", authMiddleware, addToCart);
cartRouter.get("/get", authMiddleware, getCart);
cartRouter.delete("/remove/:productId", authMiddleware, removeFromCart);
cartRouter.put("/update", authMiddleware, updateCartItem);

export default cartRouter;
