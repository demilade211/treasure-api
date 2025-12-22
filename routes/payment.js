import  express from "express";
import { authenticateUser } from "../middlewares/authMiddleware";
import { initializeOrderPayment} from "../controllers/paymentController";

const router = express.Router()

router.route('/').post(authenticateUser,initializeOrderPayment);

    

export default router;