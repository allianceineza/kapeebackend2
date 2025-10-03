import { Request, Response } from "express";
import Cart, { ICart } from "../models/cartModel.js";
import Product from "../models/productModel.js";
import { IUser } from "../models/userModel.js";

interface AuthRequest extends Request {
    user?: IUser;
}

const addToCart = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Authentication required" });
        }
        const { productId, quantity } = req.body;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [], totalPrice: 0 });
        }
        const existingItem = cart.items.find(item => item.product.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity, price: product.price });
        }
        cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const getCart = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Authentication required" });
        }
        const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
        res.json(cart || { items: [], totalPrice: 0 });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const removeFromCart = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Authentication required" });
        }
        const { productId } = req.params;
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const updateCartItem = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Authentication required" });
        }
        const { productId, quantity } = req.body;
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        const item = cart.items.find(item => item.product.toString() === productId);
        if (!item) {
            return res.status(404).json({ message: "Item not found in cart" });
        }
        item.quantity = quantity;
        cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export { addToCart, getCart, removeFromCart, updateCartItem };
