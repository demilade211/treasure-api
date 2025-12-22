import mongoose from "mongoose";

const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderItems: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],

    recipient: {
      name: String,
      phone: String,
      email: String,
      address: String,
      occasion: String,
      note: String,
      deliveryDate: Date,
    },

    delivery: {
      area: String,
      fee: Number,
    },

    payment: {
      reference: String,
      amount: Number,
      status: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
      },
      provider: {
        type: String,
        default: "paystack",
      },
    },

    itemsPrice: Number,
    deliveryPrice: Number,
    totalPrice: Number,

    orderStatus: {
      type: String,
      enum: ["processing", "confirmed", "delivered", "cancelled"],
      default: "processing",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
