import OrderModel from "../models/order.js";
import ErrorHandler from "../utils/errorHandler.js";
import APIFeatures from "../utils/apiFeatures.js";

// GET /api/v1/orders/me
export const getMyOrders = async (req, res, next) => {
    try {
        const resultsPerPage = 10;

        const apiFeatures = new APIFeatures(
            OrderModel.find({ user: req.user._id })
                .populate("orderItems.product", "name images")
                .sort({ createdAt: -1 }),
            req.query
        )
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
