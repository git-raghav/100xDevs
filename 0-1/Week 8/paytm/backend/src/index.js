import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();

import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import passport from "./config/passport.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import accountRouter from "./routes/accountRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";
import ExpressError from "./utils/ExpressError.js";
import "./utils/cleanup.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// routes
app.get("/api/v1/auth/health", (req, res) => {
	res.json({ status: "ok" });
});
app.get("/api/v1/user/health", (req, res) => {
	res.json({ status: "ok" });
});
app.get("/api/v1/account/health", (req, res) => {
	res.json({ status: "ok" });
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/account", accountRouter);

// if no above route matches, this middleware will be called
app.all(/.*/, (req, res, next) => {
	next(new ExpressError(404, "Page Not Found"));
});

app.use(errorHandler); // Custom error handling middleware that will handle all errors

// start server only after connecting to DB
const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 3001;
async function startServer() {
	try {
		// Check DB connectivity before boot
		await mongoose.connect(MONGO_URL, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });
		console.log("Connected to MongoDB");

		// Only now start server
		app.listen(PORT, () => {
			console.log(`Backend service running on port ${PORT}`);
		});
	} catch (err) {
		console.error("Database not reachable:", err);
		process.exit(1); // stop process
	}
}
startServer();
