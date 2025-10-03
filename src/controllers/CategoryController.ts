import { Request, Response } from "express";
import Category from "../models/categoryModel.js";

const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, description, image } = req.body;
        const category = new Category({ name, description, image });
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const getCategoryById = async (req: Request, res: Response) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const updateCategory = async (req: Request, res: Response) => {
    try {
        const { name, description, image } = req.body;
        const category = await Category.findByIdAndUpdate(req.params.id, { name, description, image }, { new: true });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const deleteCategory = async (req: Request, res: Response) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory };
