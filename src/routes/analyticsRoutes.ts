import { getDashboardStats, getSalesData, getTopProducts, getCategorySales } from "../controllers/AnalyticsController.js";
import express from "express";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";

const analyticsRouter = express.Router();

analyticsRouter.get("/dashboard-stats", authMiddleware, adminMiddleware, getDashboardStats);
analyticsRouter.get("/sales-data", authMiddleware, adminMiddleware, getSalesData);
analyticsRouter.get("/top-products", authMiddleware, adminMiddleware, getTopProducts);
analyticsRouter.get("/category-sales", authMiddleware, adminMiddleware, getCategorySales);

export default analyticsRouter;