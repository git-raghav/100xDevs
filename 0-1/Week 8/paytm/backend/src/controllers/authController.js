import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";
import { generateOtp, otpExpiry } from "../utils/otp.js";
import { sendOtpMail } from "../utils/mailer.js";
import User from "../models/userModel.js";
import OtpCode from "../models/otpModel.js";
import RefreshToken from "../models/refreshTokenModel.js";
import { generateRefreshToken, refreshTokenExpiry } from "../utils/refreshToken.js";
const pepper = process.env.PEPPER;

// Signup
export async function signup(req, res) {
	const { firstName, lastName, email, username, password } = req.body;
	const existing = await User.exists({
		$or: [{ email }, { username }],
	});
	if (existing) return res.status(409).json({ message: "Email or username already exists" });

	const hash = await bcrypt.hash(password + pepper, 10);
	const user = await User.create({
		firstName,
		lastName,
		email,
		username,
		passwordHash: hash,
	});

	const otp = generateOtp();
	await OtpCode.create({
        userId: user._id,
        otpCode: otp,
        purpose: "verify_email",
        expiresAt: otpExpiry()
    });
	await sendOtpMail(email, otp, "verify_email");

	res.status(201).json({ message: "Signup successful. Please verify your email." });
}

// Verify email
export async function verifyEmail(req, res) {
	const { email, otp } = req.body;
	const user = await User.findOne({ email });
	if (!user) return res.status(400).json({ message: "Invalid user" });

	const otpRecord = await OtpCode.findOneAndDelete({
        userId: user._id,
        otpCode: otp,
        purpose: "verify_email",
        expiresAt: { $gt: new Date() }
    });
	if (!otpRecord) return res.status(400).json({ message: "Invalid or expired OTP" });

	await User.updateOne({ _id: user._id }, { $set: { isVerified: true } });

	res.status(200).json({ message: "Email verified successfully" });
}

// Login (passport is verifying email and password and saving user in req.user)
export async function loginSuccess(req, res) {
    // console.log(req.user);
	const accessToken = generateToken({ id: req.user._id, email: req.user.email });
	const refreshToken = generateRefreshToken();

    //Invalidate existing refresh tokens(comment this if you want to allow multiple device logins)
    await RefreshToken.deleteMany({userId: req.user._id});

	await RefreshToken.create({
        userId: req.user._id,
        tokenHash: refreshToken,
        expiresAt: refreshTokenExpiry()
    });
    await User.updateOne({ _id: req.user._id }, { $set: { lastLoginAt: new Date() } });

	// Send refresh token in HttpOnly cookie
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production", // only https in prod
		sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	});

	res.status(200).json({ accessToken: accessToken });
}

// Forgot password
export async function forgotPassword(req, res) {
	const { email } = req.body;
	const user = await User.findOne({ email });
	if (!user) return res.status(200).json({ message: "If an account exists for this email, an OTP has been sent." });

    //Invalidate existing OTPs
    await OtpCode.deleteMany({userId: user._id, purpose: "reset_password"});

	const otp = generateOtp();
	await OtpCode.create({
        userId: user._id,
        otpCode: otp,
        purpose: "reset_password",
        expiresAt: otpExpiry()
    });
	await sendOtpMail(email, otp, "reset_password");

	res.status(200).json({ message: "If an account exists for this email, an OTP has been sent." });
}

// Reset password
export async function resetPassword(req, res) {
	const { email, otp, newPassword } = req.body;
	const user = await User.findOne({ email });
	if (!user) return res.status(400).json({ message: "Invalid user" });

	const otpRecord = await OtpCode.findOneAndDelete({
        userId: user._id,
        otpCode: otp,
        purpose: "reset_password",
        expiresAt: { $gt: new Date() }
    });
	if (!otpRecord) return res.status(400).json({ message: "Invalid or expired OTP" });

	const hash = await bcrypt.hash(newPassword + pepper, 10);
    await User.updateOne({ _id: user._id }, { $set: { passwordHash: hash, passwordChangedAt: new Date() } });

    //Invalidate existing refresh tokens
    await RefreshToken.deleteMany({userId: user._id});

	res.status(200).json({ message: "Password reset successful" });
}

//Change password
export async function changePassword(req, res) {
	const { oldPassword, newPassword } = req.body;

	// req.user comes from JWT (authMiddleware)
	const user = await User.findOne({ email: req.user.email });
	if (!user) return res.status(404).json({ message: "User not found" });

	// Compare old password
	const isMatch = await bcrypt.compare(oldPassword + pepper, user.passwordHash);
	if (!isMatch) {
		return res.status(400).json({ message: "Old password is incorrect" });
	}

    // Check if new password is same as old
    const isSamePassword = await bcrypt.compare(newPassword + pepper, user.passwordHash);
    if (isSamePassword) {
        return res.status(400).json({ message: "New password must be different from old password" });
    }

	// Hash new password
	const hash = await bcrypt.hash(newPassword + pepper, 10);
	await User.updateOne({ _id: user._id }, { $set: { passwordHash: hash, passwordChangedAt: new Date() } });

    //Invalidate existing refresh tokens
    await RefreshToken.deleteMany({userId: user._id});

	res.status(200).json({ message: "Password updated successfully" });
}

// Generate new access token from refresh token
export async function refreshToken(req, res) {
	const refreshToken = req.cookies.refreshToken; // extract from cookie
	if (!refreshToken) return res.status(401).json({ message: "Refresh token required" });

	const stored = await RefreshToken.findOne({tokenHash: refreshToken, expiresAt: { $gt: new Date() }});
    if (!stored) return res.status(403).json({ message: 'Invalid or expired refresh token' });

    const user = await User.findById(stored.userId);
    if (!user) return res.status(403).json({ message: 'User no longer exists' });

	const accessToken = generateToken({ id: user._id, email: user.email });
	res.status(200).json({ accessToken: accessToken });
}

// Logout
export async function logout(req, res) {
	const refreshToken = req.cookies.refreshToken;
	if (refreshToken) {
        await RefreshToken.deleteOne({tokenHash: refreshToken});
		res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
	    });
	}
	res.json({ message: "Logged out successfully" });
}

// Delete User
export async function deleteAccount(req, res) {
    const { password } = req.body;

    // req.user comes from JWT (authMiddleware)
	const user = await User.findOne({ email: req.user.email });
	if (!user) return res.status(404).json({ message: "User not found" });

	// Compare password
	const isMatch = await bcrypt.compare(password + pepper, user.passwordHash);
	if (!isMatch) {
		return res.status(401).json({ message: "Password is incorrect" });
	}

	await User.findOneAndDelete({_id: user._id}); //with cascade everything will be deleted
	res.clearCookie("refreshToken", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
	});
	res.status(200).json({ message: "Account deleted successfully" });
}
