import rateLimit from "express-rate-limit";

function limiter({ windowMs, max, message }) {
	return rateLimit({
		windowMs,
		max,
		standardHeaders: true,
		legacyHeaders: false,
		message: { error: { message, status: 429 } },
	});
}

// Login brute force
export const loginLimiter = limiter({
	windowMs: 15 * 60 * 1000,
	max: 10,
	message: "Too many login attempts. Try again later.",
});

// Signup + verify + resend + forgot + reset (OTP spray / guess)
export const otpLimiter = limiter({
	windowMs: 15 * 60 * 1000,
	max: 10,
	message: "Too many OTP-related requests. Try again later.",
});

// Money movement
export const transferLimiter = limiter({
	windowMs: 15 * 60 * 1000,
	max: 20,
	message: "Too many transfers. Try again later.",
});

export const addMoneyLimiter = limiter({
	windowMs: 15 * 60 * 1000,
	max: 10,
	message: "Too many add-money requests. Try again later.",
});
