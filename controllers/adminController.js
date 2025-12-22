import OrderModel from "../models/order.js";
import ErrorHandler from "../utils/errorHandler.js";
import APIFeatures from "../utils/apiFeatures.js";
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
