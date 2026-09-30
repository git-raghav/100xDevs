import { z } from "zod";

const passwordSchema = z
    .string()
    .min(8)
    .max(100)
    .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
        "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
    );

const emailSchema = z
    .email();

const otpSchema = z
    .string()
    .regex(/^[0-9]{6}$/, "OTP must be exactly 6 digits");

const usernameSchema = z
    .string()
    .min(3)
    .max(30)
    .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
    );

export const signupSchema = z.object({
    firstName: z.string().min(1).max(50),
    lastName: z.string().min(1).max(50),
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema
});

export const editNameSchema = z.object({
    firstName: z.string().min(1).max(50),
    lastName: z.string().min(1).max(50),
});

export const editUserNameSchema = z.object({
    username: usernameSchema,
});

export const verifySchema = z.object({
    email: emailSchema,
    otp: otpSchema
});

export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema
});

export const forgetPasswordSchema = z.object({
    email: emailSchema
});

export const resetPasswordSchema = z.object({
    email: emailSchema,
    otp: otpSchema,
    newPassword: passwordSchema
});

export const changePasswordSchema = z.object({
    oldPassword: passwordSchema,
    newPassword: passwordSchema
});

export const deleteSchema = z
	.object({
		password: passwordSchema.optional(),
		confirm: z.literal(true).optional(),
	})
	.refine((data) => data.password || data.confirm === true, {
		message: "Password or confirm is required",
	});

export const transferSchema = z.object({
    to: z.string().regex(/^[a-f\d]{24}$/i, "Invalid recipient ID"),
    amount: z
        .number()
        .positive("Amount must be greater than 0")
        .multipleOf(0.01, "Amount can have at most 2 decimal places")
        .max(100000, "Amount cannot exceed 100000"),
});
