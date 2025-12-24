import express from "express";
import { authenticateUser, allowedRoles } from "../middlewares/authMiddleware.js";
import { submitContactForm  } from "../controllers/contactController.js";

const router = express.Router(); 

router.route('/contact').post(submitContactForm);

export default router;
