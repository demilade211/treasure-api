import express from "express";
import { authenticateUser, allowedRoles } from "../middlewares/authMiddleware.js";
import { getAllOrders,getAdminSummary,getRecentOrders,getOrderSummary,updateOrderStatus  } from "../controllers/adminController.js";

const router = express.Router(); 

router.route('/orders').get(authenticateUser, allowedRoles("admin"), getAllOrders);
router.route('/summary').get(authenticateUser, allowedRoles("admin"), getAdminSummary);
router.route('/recent-orders').get(authenticateUser, allowedRoles("admin"), getRecentOrders);
router.route('/orders/:id/status').put(authenticateUser, allowedRoles("admin"), updateOrderStatus);
router.route('/orders/summary').get(authenticateUser, allowedRoles("admin"), getOrderSummary);

export default router;