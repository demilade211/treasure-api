import ProductModel from "../models/product.js"
import UserModel from "../models/user.js"
import ErrorHandler from "../utils/errorHandler.js";
import APIFeatures from "../utils/apiFeatures.js";
import products from "../data/products.json"
import cloudinary from "cloudinary"
import { removeTemp } from "../utils/helpers.js" 

// PUT /api/v1/user/account
export const updateAccountDetails = async (req, res, next) => {
    try {
        const { firstName, lastName, email } = req.body;

        const user = await UserModel.findById(req.user._id);

        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName; 

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Account details updated successfully",
            user,
        });
    } catch (error) {
        return next(error);
    }
};


// PUT /api/v1/user/change-password
export const changePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return next(new ErrorHandler("All password fields are required", 400));
        }

        const user = await UserModel.findById(req.user._id).select("+password");

        const isMatch = await user.comparePassword(oldPassword);

        if (!isMatch) {
            return next(new ErrorHandler("Old password is incorrect", 401));
        }

        user.password = newPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (error) {
        return next(error);
    }
};


// PUT /api/v1/user/shipping-address
export const updateShippingAddress = async (req, res, next) => {
    try {
        const {
            fullName,
            email,
            country,
            city,
            street,
            phone,
            company,
            state,
        } = req.body;

        const user = await UserModel.findById(req.user._id);

        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        user.shippingAddress = {
            fullName,
            email,
            country,
            city,
            street,
            phone,
            company,
            state,
        };

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Shipping address updated successfully",
            shippingAddress: user.shippingAddress,
        });
    } catch (error) {
        return next(error);
    }
};
