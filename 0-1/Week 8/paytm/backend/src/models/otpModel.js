import mongoose from "mongoose";

const otpCodeSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        otpCode: {
            type: String,
            required: true,
            minlength: 6,
            maxlength: 6
        },

        purpose: {
            type: String,
            enum: ["verify_email", "reset_password"],
            required: true
        },

        expiresAt: {
            type: Date,
            required: true,
            expires: 0
        }
    },
    {
        timestamps: true
    }
);

const OtpCode = mongoose.model("OtpCode", otpCodeSchema);

export default OtpCode;
