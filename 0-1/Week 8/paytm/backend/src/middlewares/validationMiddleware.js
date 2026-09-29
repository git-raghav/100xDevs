import ExpressError from "../utils/ExpressError.js"; // custom error class for Express
import {
	signupSchema,
	editNameSchema,
	editUserNameSchema,
	verifySchema,
	loginSchema,
	forgetPasswordSchema,
	resetPasswordSchema,
	changePasswordSchema,
	deleteSchema,
    transferSchema,
} from "../utils/zodSchema.js";

function validate(schema) {
	return (req, res, next) => {
		const result = schema.safeParse(req.body);
		if (!result.success) {
			throw new ExpressError(400, result.error.issues[0].message);
		}
		next();
	};
}

export const validateUserSignup = validate(signupSchema);
export const validateName = validate(editNameSchema);
export const validateUsername = validate(editUserNameSchema);
export const validateVerifyEmail = validate(verifySchema);
export const validateUserLogin = validate(loginSchema);
export const validateForgetPassword = validate(forgetPasswordSchema);
export const validateResetPassword = validate(resetPasswordSchema);
export const validateChangePassword = validate(changePasswordSchema);
export const validateDeleteAccount = validate(deleteSchema);
export const validateTransfer = validate(transferSchema);
