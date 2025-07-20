//in lodgr we used session based authentication
// 🔁 What Happens Behind the Scenes
// User logs in
// You probably have a route like POST /login using passport.authenticate("local")
// This uses passport-local strategy to verify username and password
// If login is successful
// passport.serializeUser() is called
// It stores a small piece of data (e.g., user ID) in the session
// That session ID is sent to the client as a cookie automatically
// On every future request
// The client sends that cookie (automatically, if httpOnly) as cookie is a part of the req
// passport.session() kicks in and calls deserializeUser()
// That function fetches the full user object and attaches it to req.user
// You access req.user or res.locals.currentUser in your routes or views
/* ----------------------------------------------------------------------- @ ---------------------------------------------------------------------- */
// 🔑 1. Passport.js with Sessions (Traditional Auth)
// ➤ How it works:
// User logs in → server validates credentials.
// Server creates a session (a row in memory or DB) and assigns a session ID.
// Server sends session ID as a cookie to the client.
// On every next request, the browser automatically sends this cookie.
// Server finds the session from the cookie and authenticates the user.
// ➤ Characteristics:
// Server-side storage of sessions.
// Scales poorly unless you use sticky sessions or shared session stores (like Redis).
// Very secure in monolithic or server-rendered apps.
/* ----------------------------------------------------------------------- @ ---------------------------------------------------------------------- */
// 🔐 2. JWT Auth (Stateless, Token-based)
// ➤ How it works:
// User logs in → server validates credentials.
// Server generates a JWT (JSON Web Token) and sends it to the client.
// Client stores JWT (e.g., in localStorage or cookies).
// On every next request, the client sends the JWT (usually in the Authorization header).
// Server verifies the JWT signature and decodes the payload — no DB lookup needed.
// ➤ Characteristics:
// Stateless — no server-side session storage.
// Great for scaling and microservices.
// Token can contain custom data (user ID, roles, etc.).
// Can be used across multiple domains or services (mobile/web).
/* ----------------------------------------------------------------------- @ ---------------------------------------------------------------------- */
//Assignment 1
//A website which has 2 endpoints:

//endpoint 1 - POST /signin which takes username and password as input from FE and Returns a json web token (JWT) with username encrypted
//endpoint 2 - GET /users which takes Authorization header or previosly returned JWT as input from FE and Returns an array of all users if user is signed in (token is correct) or Returns 403 status code if not

const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

const jwtPassword = "123456"; //secret key used for verifying the JWT's authenticity and is only known to the backend server

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//hamara in memory database for now
const ALL_USERS = [
	{
		username: "demo@gmail.com",
		password: "123",
		name: "demo user",
	},
	{
		username: "raman@gmail.com",
		password: "456",
		name: "raman singh",
	},
	{
		username: "priya@gmail.com",
		password: "789",
		name: "priya kumari",
	},
];

function userExists(username, password) {
	let userExists = false;
	const foundUser = ALL_USERS.find((user) => {
		if (user.username == username && user.password == password) {
			userExists = true;
		}
	});
	return userExists;
}

app.post("/login", (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	if (!userExists(username, password)) {
		return res.status(403).json({
			msg: "User doesnt exist in our in memory db",
		});
	}

	//jwt.sign ~ backend server generates a new token using this function
	//this creates the token/JWT that is send back to the FE during the first user log in, also here by specifying the secret key (jwtPassword), you ensure that: Tokens are authentic and come from your trusted servers only.
	let token = jwt.sign({ username: username }, jwtPassword);
	console.log("JWT :", token);
	return res.json({
		JWT: token,
	});
});

app.get("/users", (req, res) => {
	const token = req.headers.authorization;
	try {
		const verified = jwt.verify(token, jwtPassword); //jwt.verify ~ backend server verifies token using this function, verified will store the payload of the token eg username
		console.log(verified);
		console.log(verified.username);
		console.log(verified.iat);

		// return a list of users other than this username ~ basically, return everyone but themselves
		const username = verified.username;
		res.json({
			users: ALL_USERS.filter((user) => {
				if (user.username == username) {
					return false;
				}
				return true;
			}),
		});
	} catch (err) {
		return res.status(403).json({
			msg: "Invalid token",
		});
	}
});

const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
