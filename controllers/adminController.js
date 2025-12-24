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

// GET /api/v1/admin/orders/summary
export const getOrderSummary = async (req, res, next) => {
    try {
        const totalOrders = await OrderModel.countDocuments();

        const deliveredOrders = await OrderModel.countDocuments({
            orderStatus: "delivered"
        });

        const processingOrders = await OrderModel.countDocuments({
            orderStatus: "processing"
        });

        res.status(200).json({
            success: true,
            summary: {
                totalOrders,
                deliveredOrders,
                processingOrders
            }
        });
    } catch (error) {
        next(error);
    }
};

// PUT /api/v1/admin/orders/:id/status
export const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        if (!status) {
            return next(new ErrorHandler("Order status is required", 400));
        }

        const order = await OrderModel.findById(req.params.id);

        if (!order) {
            return next(new ErrorHandler("Order not found", 404));
        }

        order.orderStatus = status;
        await order.save();

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order
        });
    } catch (error) {
        next(error);
    }
};


export const getOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            return next(new ErrorHandler("Order ID is required", 400));
        }

        // Populate related fields like user and order items
        const order = await OrderModel.findById(id)
            .populate("user", "name email phone category") // get customer info
            .populate("orderItems.product", "name image price"); // get product details

        if (!order) {
            return next(new ErrorHandler("Order not found", 404));
        }

        res.status(200).json({
            success: true,
            order,
        });
    } catch (err) {
        next(err);
    }
};