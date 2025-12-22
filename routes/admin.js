import express from "express";
import { authenticateUser, allowedRoles } from "../middlewares/authMiddleware.js";
import { getAllOrders  } from "../controllers/adminController.js";

const router = express.Router(); 

router.route('/orders').get(authenticateUser, allowedRoles("admin"), getAllOrders);

export default router;