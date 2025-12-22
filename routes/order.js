import express from "express";
import { authenticateUser, allowedRoles } from "../middlewares/authMiddleware.js";
import { getMyOrders  } from "../controllers/orderController.js";

const router = express.Router(); 

router.route('/').get(authenticateUser, getMyOrders);

export default router;
