import crypto from "crypto";
import OrderModel from "../models/order.js";
import dotenv from "dotenv";

dotenv.config({ path: "config/config.env" });

export const paystackWebhook = async (req, res, next) => {
    const hash = crypto
        .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
        .update(JSON.stringify(req.body))
        .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
        return res.sendStatus(401);
    }

    const event = req.body;

    if (event.event === "charge.success") {
        try {
            const { reference, amount, metadata } = event.data;
            const {
                userId,
                cartItems,
                recipient,
                delivery,
                itemsPrice,
                deliveryPrice,
                totalPrice,
            } = metadata;

            const order = await OrderModel.create({
                user: userId,
                orderItems: cartItems.map((item) => ({
                    product: item.product._id,
                    name: item.product.name,
                    price: item.product.price,
                    quantity: item.quantity,
                    image: item.product.images?.[0]?.url,
                })),
                recipient,
                delivery,
                itemsPrice,
                deliveryPrice,
                totalPrice,
                payment: {
                    reference,
                    amount: amount / 100,
                    status: "paid",
                },
            });

            return res.sendStatus(200);
        } catch (err) {
            console.error("Webhook error:", err);
            return res.sendStatus(500);
        }
    }

    res.sendStatus(200);
};
