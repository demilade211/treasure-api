import crypto from "crypto";
import OrderModel from "../models/order.js";
import UserModel from "../models/user.js";
import sendEmail from "../utils/sendEmail.js";
import dotenv from "dotenv";

dotenv.config({ path: "config/config.env" });

const secreteKey = process.env.NODE_ENV === "DEVELOPMENT" ? process.env.PAYSTACK_SECRETE_KEY_TEST : process.env.PAYSTACK_SECRETE_KEY_LIVE;

export const paystackWebhook = async (req, res, next) => {
    const hash = crypto
        .createHmac("sha512", secreteKey)
        .update(JSON.stringify(req.body))
        .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
        return res.sendStatus(401);
    }

    const event = req.body;

    if (event.event === "charge.success") {
        console.log("Payment successful:", event.data);
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

            const user = await UserModel.findByIdAndUpdate(
                userId,
                { $set: { cartItems: [] } },
                { new: true }
            );

            const itemsListHtml = cartItems.map((item) =>
                `<tr>
                    <td style="padding:8px;border:1px solid #eee;">${item.product.name}</td>
                    <td style="padding:8px;border:1px solid #eee;">${item.quantity}</td>
                    <td style="padding:8px;border:1px solid #eee;">₦${(item.product.price).toLocaleString()}</td>
                </tr>`
            ).join("");

            const itemsListText = cartItems.map((item) =>
                `- ${item.product.name} x${item.quantity} — ₦${(item.product.price).toLocaleString()}`
            ).join("\n");

            // Email to customer
            await sendEmail({
                email: user.email,
                subject: "Your Treasurebox Order Confirmation",
                html: `
                    <h2>Thank you for your order, ${user.name}!</h2>
                    <p>Your payment of <strong>₦${(amount / 100).toLocaleString()}</strong> was successful.</p>
                    <h3>Order Summary</h3>
                    <table style="border-collapse:collapse;width:100%;">
                        <thead>
                            <tr>
                                <th style="padding:8px;border:1px solid #eee;text-align:left;">Item</th>
                                <th style="padding:8px;border:1px solid #eee;text-align:left;">Qty</th>
                                <th style="padding:8px;border:1px solid #eee;text-align:left;">Price</th>
                            </tr>
                        </thead>
                        <tbody>${itemsListHtml}</tbody>
                    </table>
                    <p><strong>Delivery:</strong> ₦${Number(deliveryPrice).toLocaleString()}</p>
                    <p><strong>Total:</strong> ₦${Number(totalPrice).toLocaleString()}</p>
                    <p><strong>Delivery Area:</strong> ${delivery.area}</p>
                    <br/>
                    <p>We'll be in touch soon. Thank you for choosing Treasurebox!</p>
                `,
                message: `Thank you for your order, ${user.name}!\n\nItems:\n${itemsListText}\n\nDelivery: ₦${Number(deliveryPrice).toLocaleString()}\nTotal: ₦${Number(totalPrice).toLocaleString()}\nDelivery Area: ${delivery.area}`,
            });

            // Email to admin
            await sendEmail({
                email: "thetreasureboxng@gmail.com",
                subject: `New Order — Ref: ${reference}`,
                html: `
                    <h2>New Order Received</h2>
                    <p><strong>Reference:</strong> ${reference}</p>
                    <p><strong>Customer:</strong> ${user.name} (${user.email})</p>
                    <p><strong>Delivery Area:</strong> ${delivery.area}</p>
                    <h3>Items to Deliver</h3>
                    <table style="border-collapse:collapse;width:100%;">
                        <thead>
                            <tr>
                                <th style="padding:8px;border:1px solid #eee;text-align:left;">Item</th>
                                <th style="padding:8px;border:1px solid #eee;text-align:left;">Qty</th>
                                <th style="padding:8px;border:1px solid #eee;text-align:left;">Price</th>
                            </tr>
                        </thead>
                        <tbody>${itemsListHtml}</tbody>
                    </table>
                    <p><strong>Items Total:</strong> ₦${Number(itemsPrice).toLocaleString()}</p>
                    <p><strong>Delivery Fee:</strong> ₦${Number(deliveryPrice).toLocaleString()}</p>
                    <p><strong>Total Paid:</strong> ₦${(amount / 100).toLocaleString()}</p>
                `,
                message: `New Order — Ref: ${reference}\nCustomer: ${user.name} (${user.email})\nDelivery Area: ${delivery.area}\n\nItems:\n${itemsListText}\n\nTotal Paid: ₦${(amount / 100).toLocaleString()}`,
            });

            return res.sendStatus(200);
        } catch (err) {
            console.error("Webhook error:", err);
            return res.sendStatus(500);
        }
    }

    res.sendStatus(200);
};
