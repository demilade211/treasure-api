import axios from "axios";
import OrderModel from "../models/order.js";
import ErrorHandler from "../utils/errorHandler.js";

const PAYSTACK_URL = "https://api.paystack.co";
let secreteKey = process.env.NODE_ENV === "DEVELOPMENT" ? process.env.PAYSTACK_SECRETE_KEY_TEST : process.env.PAYSTACK_SECRETE_KEY_LIVE

export const initializeOrderPayment = async (req, res, next) => {
    try {
        const { cartItems, recipient, delivery } = req.body;
        const { email, _id: userId } = req.user;

        if (!cartItems?.length) {
            return next(new ErrorHandler("Cart is empty", 400));
        }

        // Validate recipient details
        if (!recipient) {
            return next(new ErrorHandler("Recipient details are required", 400));
        }

        const requiredRecipientFields = [
            { field: 'deliveryDate', label: 'Delivery date' },
            { field: 'occasion', label: 'Occasion' },
            { field: 'name', label: 'Recipient name' },
            { field: 'phone', label: 'Recipient phone number' },
            { field: 'address', label: 'Recipient address' },
            { field: 'email', label: 'Recipient email' }
        ];

        for (const { field, label } of requiredRecipientFields) {
            if (!recipient[field] || recipient[field].trim() === '') {
                return next(new ErrorHandler(`${label} is required`, 400));
            }
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(recipient.email)) {
            return next(new ErrorHandler("Invalid recipient email format", 400));
        }

        // Validate phone number (basic validation)
        const phoneRegex = /^[0-9+\-\s()]+$/;
        if (!phoneRegex.test(recipient.phone)) {
            return next(new ErrorHandler("Invalid phone number format", 400));
        }

        // Validate delivery details
        if (!delivery) {
            return next(new ErrorHandler("Delivery details are required", 400));
        }

        if (!delivery.name || delivery.name.trim() === '') {
            return next(new ErrorHandler("Delivery location is required", 400));
        }

        if (!delivery.amount || delivery.amount <= 0) {
            return next(new ErrorHandler("Invalid delivery amount", 400));
        }


        const itemsPrice = cartItems.reduce(
            (acc, item) => acc + item.product.price * item.quantity,
            0
        );

        const deliveryPrice = delivery.amount;
        const totalPrice = itemsPrice + deliveryPrice;

        const config = {
            headers: {
                Authorization: `Bearer ${secreteKey}`,
                "Content-Type": "application/json",
            },
        };

        const data = {
            amount: totalPrice * 100,
            email,
            metadata: {
                userId,
                cartItems,
                recipient,
                delivery,
                itemsPrice,
                deliveryPrice,
                totalPrice,
            },
            callback_url: `https://www.treasurebox.ng/profile`
        };

        const response = await axios.post(
            `${PAYSTACK_URL}/transaction/initialize`,
            data,
            config
        );

        if (!response.data.status) {
            return next(new ErrorHandler("Payment initialization failed", 400));
        }

        return res.status(200).json({
            success: true,
            authorization_url: response.data.data.authorization_url,
        });
    } catch (err) {
        return next(err);
    }
};
