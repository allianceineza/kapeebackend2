import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from "../controllers/productController";
import express from "express";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware";

const productRouter = express.Router();

productRouter.post("/create", authMiddleware, adminMiddleware, createProduct);
productRouter.get("/getAll", getAllProducts);
productRouter.get("/get/:id", getProductById);
productRouter.put("/update/:id", authMiddleware, adminMiddleware, updateProduct);
productRouter.delete("/delete/:id", authMiddleware, adminMiddleware, deleteProduct);

export default productRouter;
