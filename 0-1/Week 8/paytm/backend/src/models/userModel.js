import mongoose from "mongoose";
import OtpCode from "./otpModel.js";
import RefreshToken from "./refreshTokenModel.js";

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50
        },

        lastName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50
        },

        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3,
            maxlength: 30
        },

        email: {
            type: String,
            required: true,
            unique: true,
            maxlength: 255,
            trim: true,
            lowercase: true
        },

        passwordHash: {
            type: String,
            default: null
        },

        provider: {
            type: String,
            enum: ["local", "google"],
            default: "local",
            required: true
        },

        googleId: {
            type: String,
            unique: true,
            sparse: true
        },

        isVerified: {
            type: Boolean,
            default: false
        },

        lastLoginAt: {
            type: Date,
            default: null
        },

        passwordChangedAt: {
            type: Date,
            default: null
        },
    },
    {
        timestamps: true
    }
);

userSchema.post("findOneAndDelete", async (user) => {
    if (!user) return;
    await OtpCode.deleteMany({
        userId: user._id
    });
    await RefreshToken.deleteMany({
        userId: user._id
    });
});

const User = mongoose.model("User", userSchema);

export default User;
