import OrderModel from "../models/order.js";
import ErrorHandler from "../utils/errorHandler.js";
import APIFeatures from "../utils/apiFeatures.js";
import UserModel from "../models/user.js";

// GET /api/v1/admin/orders
export const getAllOrders = async (req, res, next) => {
    try {
        const resultsPerPage = 20;

        const apiFeatures = new APIFeatures(
            OrderModel.find()
                .populate("user", "name email")
                .sort({ createdAt: -1 }),
            req.query
        )
            .search()
            .filter()
            .pagination(resultsPerPage);

        const orders = await apiFeatures.query;

        return res.status(200).json({
            success: true,
            count: orders.length,
            orders,
        });
    } catch (error) {
        return next(error);
    }
};

/**
 * GET /api/admin/summary
 */
export const getAdminSummary = async (req, res, next) => {
    try {
        // Total orders
        const totalOrders = await OrderModel.countDocuments();

        // Paid orders
        const paidOrders = await OrderModel.find({ "payment.status": "paid" });

        // Revenue
        const revenue = paidOrders.reduce(
            (acc, order) => acc + order.totalPrice,
            0
        );

        res.status(200).json({
            success: true,
            summary: {
                totalSales: paidOrders.length,
                totalOrders,
                revenue
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/admin/orders/recent
 */
export const getRecentOrders = async (req, res, next) => {
    try {
        const orders = await OrderModel.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        next(error);
    }
};
