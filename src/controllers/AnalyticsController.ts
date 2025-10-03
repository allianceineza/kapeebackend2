import { Request, Response } from "express";
import User, { IUser } from "../models/userModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import Category from "../models/categoryModel.js";

interface AuthRequest extends Request {
    user?: IUser;
}

const getDashboardStats = async (req: AuthRequest, res: Response) => {
    try {
        // Get basic counts
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalCategories = await Category.countDocuments();

        // Get order statistics
        const orderStats = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalPrice" },
                    averageOrderValue: { $avg: "$totalPrice" }
                }
            }
        ]);

        const pendingOrders = await Order.countDocuments({ status: "pending" });
        const recentOrders = await Order.countDocuments({
            createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        });

        // Get low stock products (stock <= 10)
        const lowStockItems = await Product.countDocuments({ stock: { $lte: 10 } });

        const stats = {
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue: orderStats[0]?.totalRevenue || 0,
            averageOrderValue: orderStats[0]?.averageOrderValue || 0,
            pendingOrders,
            recentOrders,
            lowStockItems,
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const getSalesData = async (req: AuthRequest, res: Response) => {
    try {
        const { period = 'month' } = req.query;
        let matchStage: any = {};
        let groupStage: any = {};

        switch (period) {
            case 'week':
                // Last 7 days
                matchStage = {
                    createdAt: {
                        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    }
                };
                groupStage = {
                    _id: {
                        day: { $dayOfWeek: "$createdAt" },
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
                    },
                    sales: { $sum: "$totalPrice" },
                    orders: { $sum: 1 }
                };
                break;
            case 'year':
                // Last 4 years
                matchStage = {
                    createdAt: {
                        $gte: new Date(Date.now() - 4 * 365 * 24 * 60 * 60 * 1000)
                    }
                };
                groupStage = {
                    _id: { year: { $year: "$createdAt" } },
                    sales: { $sum: "$totalPrice" },
                    orders: { $sum: 1 }
                };
                break;
            default: // month
                // Last 12 months
                matchStage = {
                    createdAt: {
                        $gte: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000)
                    }
                };
                groupStage = {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    sales: { $sum: "$totalPrice" },
                    orders: { $sum: 1 }
                };
                break;
        }

        const salesData = await Order.aggregate([
            { $match: matchStage },
            { $group: groupStage },
            { $sort: { "_id": 1 } }
        ]);

        res.json(salesData);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const getTopProducts = async (req: AuthRequest, res: Response) => {
    try {
        const topProducts = await Order.aggregate([
            { $unwind: "$items" },
            {
                $lookup: {
                    from: "products",
                    localField: "items.product",
                    foreignField: "_id",
                    as: "productInfo"
                }
            },
            { $unwind: "$productInfo" },
            {
                $group: {
                    _id: "$items.product",
                    name: { $first: "$productInfo.name" },
                    category: { $first: "$productInfo.category" },
                    totalSales: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
                    totalQuantity: { $sum: "$items.quantity" }
                }
            },
            { $sort: { totalSales: -1 } },
            { $limit: 5 }
        ]);

        res.json(topProducts);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const getCategorySales = async (req: AuthRequest, res: Response) => {
    try {
        const categorySales = await Order.aggregate([
            { $unwind: "$items" },
            {
                $lookup: {
                    from: "products",
                    localField: "items.product",
                    foreignField: "_id",
                    as: "productInfo"
                }
            },
            { $unwind: "$productInfo" },
            {
                $group: {
                    _id: "$productInfo.category",
                    totalSales: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
                }
            },
            { $sort: { totalSales: -1 } }
        ]);

        // Calculate total sales to get percentages
        const totalSales = categorySales.reduce((sum, cat) => sum + cat.totalSales, 0);

        const categoriesWithPercentages = categorySales.map((cat, index) => ({
            name: cat._id,
            sales: cat.totalSales,
            percentage: totalSales > 0 ? ((cat.totalSales / totalSales) * 100).toFixed(1) : 0,
            color: getColorByIndex(index)
        }));

        res.json(categoriesWithPercentages);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Helper function to get colors for categories
const getColorByIndex = (index: number): string => {
    const colors = ['#4A90E2', '#50C878', '#FF8A80', '#9C27B0', '#FF9800', '#607D8B'];
    return colors[index % colors.length];
};

export { getDashboardStats, getSalesData, getTopProducts, getCategorySales };