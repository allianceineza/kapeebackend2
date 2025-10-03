import { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } from "../controllers/CategoryController.js";
import express from "express";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware";

const categoryRouter = express.Router();

categoryRouter.post("/create", authMiddleware, adminMiddleware, createCategory);
categoryRouter.get("/getAll", getAllCategories);
categoryRouter.get("/get/:id", getCategoryById);
categoryRouter.put("/update/:id", authMiddleware, adminMiddleware, updateCategory);
categoryRouter.delete("/delete/:id", authMiddleware, adminMiddleware, deleteCategory);

export default categoryRouter;
