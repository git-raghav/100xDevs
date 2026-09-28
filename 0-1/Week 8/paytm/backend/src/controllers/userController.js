import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";
import { generateOtp, otpExpiry } from "../utils/otp.js";
import { sendOtpMail } from "../utils/mailer.js";
import User from "../models/userModel.js";
import OtpCode from "../models/otpModel.js";
import RefreshToken from "../models/refreshTokenModel.js";
import { generateRefreshToken, refreshTokenExpiry } from "../utils/refreshToken.js";
const pepper = process.env.PEPPER;

//Change name
export async function changeName(req, res) {
	const { oldPassword, newPassword } = req.body;

	// req.user comes from JWT (authMiddleware)
	const user = await findUserByEmail(req.user.email);
	if (!user) return res.status(404).json({ message: "User not found" });

	// Compare old password
	const isMatch = await bcrypt.compare(oldPassword + pepper, user.password_hash);
	if (!isMatch) {
		return res.status(400).json({ message: "Old password is incorrect" });
	}

    // Check if new password is same as old
    if(oldPassword === newPassword) return res.status(400).json({ message: "New password must be different from old password" });

	// Hash new password
	const hash = await bcrypt.hash(newPassword + pepper, 10);
	await updatePassword(user.id, hash);

	res.json({ message: "Password updated successfully" });
}
