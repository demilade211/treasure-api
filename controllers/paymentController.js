import axios from "axios";
import OrderModel from "../models/order.js";
import ErrorHandler from "../utils/errorHandler.js";

const PAYSTACK_URL = "https://api.paystack.co";
let secreteKey = process.env.NODE_ENV === "DEVELOPMENT" ? process.env.PAYSTACK_SECRETE_KEY_TEST:process.env.PAYSTACK_SECRETE_KEY_LIVE

export const initializeOrderPayment = async (req, res, next) => {
  try {
    const { cartItems, recipient, delivery } = req.body;
    const { email, _id: userId } = req.user;

    if (!cartItems?.length) {
      return next(new ErrorHandler("Cart is empty", 400));
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
