import { verifyToken } from "../utils/jwt.js";
import ExpressError from "../utils/ExpressError.js";

export function authenticateToken(req, res, next) {
	const authHeader = req.headers["authorization"];
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return next(new ExpressError(401, "Authorization token missing"));
    }

	const token = authHeader.split(" ")[1]; // Bearer <token>
	if (!token) {
		return next(new ExpressError(401, "Authorization token missing"));
	}

	try {
		const payload = verifyToken(token);
		req.user = payload; // attach decoded payload to request
		next();
	} catch (err) {
		next(err); // forward ExpressError to global handler
	}
}
