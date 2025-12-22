import  express from "express";
import {paystackWebhook} from "../controllers/webhookController";

const router = express.Router()

router.route('/').post(paystackWebhook);




export default router;