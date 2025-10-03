import { Request, Response } from "express";
import Order, { IOrder } from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import { IUser } from "../models/userModel.js";

interface AuthRequest extends Request {
    user?: IUser;
}

const createOrder = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Authentication required" });
        }
        const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }
        const order = new Order({
            user: req.user._id,
            items: cart.items,
            totalPrice: cart.totalPrice
        });
        await order.save();
        await Cart.findByIdAndDelete(cart._id);
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const getUserOrders = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Authentication required" });
        }
        const orders = await Order.find({ user: req.user._id }).populate("items.product");
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const getAllOrders = async (req: AuthRequest, res: Response) => {
    try {
        const orders = await Order.find().populate("items.product").populate("user", "Name Email");
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const updateOrderStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export { createOrder, getUserOrders, getAllOrders, updateOrderStatus };
