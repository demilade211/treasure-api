import express from "express";
import { authenticateUser, allowedRoles } from "../middlewares/authMiddleware.js";
import { updateAccountDetails,updateShippingAddress,changePassword  } from "../controllers/userController.js";

const router = express.Router(); 

router.route('/account').put(authenticateUser, updateAccountDetails);
router.route('/shipping-address').put(authenticateUser, updateShippingAddress);
router.route('/change-password').put(authenticateUser, changePassword);

export default router;
