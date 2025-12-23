import express from "express";
import { authenticateUser, allowedRoles } from "../middlewares/authMiddleware.js";
import { getAllOrders,getAdminSummary,getRecentOrders  } from "../controllers/adminController.js";

const router = express.Router(); 

router.route('/orders').get(authenticateUser, allowedRoles("admin"), getAllOrders);
router.route('/summary').get(authenticateUser, allowedRoles("admin"), getAdminSummary);
router.route('/recent-orders').get(authenticateUser, allowedRoles("admin"), getRecentOrders);

export default router;