import { Request, Response } from "express";
import Product from "../models/productModel";

const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, description, price, salePrice, stock, category, image } = req.body;
        const product = new Product({ name, description, price, salePrice, stock, category, image });
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const getProductById = async (req: Request, res: Response) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const updateProduct = async (req: Request, res: Response) => {
    try {
        const { name, description, price, salePrice, stock, category, image } = req.body;
        const product = await Product.findByIdAndUpdate(req.params.id, { name, description, price, salePrice, stock, category, image }, { new: true });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const deleteProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };
