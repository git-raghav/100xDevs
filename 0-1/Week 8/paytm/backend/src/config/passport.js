import dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import bcrypt from "bcrypt";
import User from "../models/userModel.js";
const pepper = process.env.PEPPER;

// Generate a unique username
async function generateUniqueUsername(firstName, lastName) {
	const base = `${firstName}${lastName}`.toLowerCase().replace(/[^a-z0-9]/g, "");
	let username = base;
	let counter = 1;
	while (await User.exists({ username })) {
		username = `${base}${counter}`;
		counter++;
	}
	return username;
}

// Local strategy
passport.use(
	new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
		try {
			let user = await User.findOne({ email: email });
			if (!user || !user.isVerified) {
				return done(null, false, { message: "Invalid credentials or not verified" });
			}

			const match = await bcrypt.compare(password + pepper, user.passwordHash);
			if (!match) {
				return done(null, false, { message: "Incorrect password" });
			}

			return done(null, user);
		} catch (err) {
			return done(err);
		}
	}),
);

// Google strategy
passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: process.env.GOOGLE_CALLBACK_URL,
		},

		async (accessToken, refreshToken, profile, done) => {
			try {
				const googleId = profile.id;
				const email = profile.emails[0].value.toLowerCase();

				const firstName = profile.name?.givenName || "";
				const lastName = profile.name?.familyName || "";

				// 1. Check Google ID
				let user = await User.findOne({ googleId });

				if (user) {
					return done(null, user);
				}

				// 2. Check email
				user = await User.findOne({ email });

				if (user) {
					// Email already belongs to a local account
					if (user.provider === "local") {
						return done(null, false, {
							message: "An account with this email already exists. Please log in using your email and password.",
						});
					}

					return done(null, user);
				}

				// 3. Generate unique username
				const username = await generateUniqueUsername(firstName, lastName);

				// 4. Create new Google user
				user = await User.create({
					firstName,
					lastName,
					username,
					email,
					passwordHash: null,
					provider: "google",
					googleId,
					isVerified: true,
				});

				return done(null, user);
			} catch (err) {
				return done(err);
			}
		},
	),
);

export default passport;
