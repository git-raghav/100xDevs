// Understanding middlewares with help of hospital example during the pandemic season.
// To visit the doctor for a health checkup, a patient would have to undergo some tasks before.
// These tasks include document verification, medical history, BP/Blood/temperature checkups etc.
// Consider these tasks as requests waiting to get processed by the server(hospital staff).
// User needs to send a kidneyId as a query param which should be a number from 1-2 (humans only have 2 kidneys).
// User should send a username and password in headers.
// In terms of code, it would look like:
const express = require("express");
const app = express();
const zod = require("zod"); //input validation

// Generally used to parse the body of POST requests.
app.use(express.json());
// This middleware helps us to parse the body of the request as a url encoded string.
app.use(express.urlencoded({ extended: true }));

// Adding Middlewares - UGLY WAYS: 1) Using If/Else checks
//This is acceptable for one route but leads to repetition in cases of multiple routes requiring the same check (VIOLATION of DRY principle) and also is limited to only one file.
app.get("/health-checkup-two", function (req, res) {
	// Performing health checkups. These are the inputs.
	const username = req.headers.username;
	const password = req.headers.password;
	const kidneyId = req.query.kidneyId;
	// Username verification for the given inputs.
	if (username != "demo" || password != "pass") {
		res.status(403).json({ msg: "User doesn't exists!" });
		return;
	}
	if (kidneyId != 1 && kidneyId != 2) {
		res.status(411).json({ msg: "Wrong inputs!" });
		return;
	}
	// If all health checkups are successful.
	res.json({
		msg: "Your kidney is fine!",
	});
});

// Adding Middlewares - UGLY WAYS: 2) Using functions, better but still we would have to call them and pass some values (VIOLATION of DRY principle)
function usernameValidator(username, password) {
	if (username != "demo" || password != "pass") {
		return false;
	}
	return true;
}

function kidneyValidator(kidneyId) {
	if (kidneyId != 1 && kidneyId != 2) {
		return false;
	}
	return true;
}

app.get("/health-checkup-three", function (req, res) {
	// Performing health checkups. These are the inputs.
	const username = req.headers.username;
	const password = req.headers.password;
	const kidneyId = req.query.kidneyId;
	// Username verification for the given inputs.
	if (!usernameValidator(username, password)) {
		res.status(403).json({
			message: "User doesn't exists!",
		});
		return;
	}
	// Input validation for the given inputs.
	if (!kidneyValidator(kidneyId)) {
		res.status(411).json({
			message: "Wrong inputs!",
		});
		return;
	}
	// If all health checkups are successful.
	res.json({
		msg: "Your kidney is fine!",
	});
});

// This is where middlewares come into picture.
// Middlewares are used to perform pre-checks in the program like authentication and user input validation.
// Best Solution : create a middleware and use it in both routes
// To make the above solution more better, we enhance the middleware functions.
// These functions will perform the complete validation and send the response.
// So, the only thing that remains in the request body is the kidney replacement logic and the final response.
// This makes the code more shorter, cleaner and readable.

// While making API requests, we can pass any number of functional parameters.
// These functional parameters work as middlewares to make our work easier.
// The order of the middleware functions is important when writing the code.
// The function which is written first will be executed first.

// While defining a middleware function, the important parameters are request, response and next.
// Request is the HTTP request same that is passed to the API to get the data.
// Response is the HTTP reponse same that is expected to be returned from the API.
// Next is a callback function that is used to call the next middleware function.
function userMiddleware(req, res, next) {
	// Username verification for the given inputs.
	const username = req.headers.username;
	const password = req.headers.password;
	if (username != "demo" || password != "pass") {
		res.status(403).json({
			message: "User doesn't exists!",
		});
		return;
	}
	// If the validation is successful, call the next middleware function.
	next();
}

function kidneyMiddleware(req, res, next) {
	// Input validation for the given inputs.
	const kidneyId = req.query.kidneyId;
	if (kidneyId != 1 && kidneyId != 2) {
		res.status(411).json({
			message: "Wrong inputs!",
		});
		return;
	}
	// If the validation is successful, call the next middleware function.
	next();
}

// In the route, we are passing the middleware functions as arguments for the validation tasks.
// Here, first the userMiddleware function will be executed and then the kidneyMiddleware function will execute.
app.get("/health-checkup-four", userMiddleware, kidneyMiddleware, function (req, res) {
	// Do something with kidney here
	res.send("You are healthy!");
});

// We can use the middleware functions in other routes as well.
// Here, we don't have to pass the kidneyMiddleware function for the heart check.
app.get("/heart-check", userMiddleware, function (req, res) {
	// Do something with user here.
	res.send("Your heart is healthy!");
});

//this should be at the top, as all routes below this will use this middleware and not above it
// We can add a path to the app.use() function to apply the middleware to only those routes that match the path.
// Let's apply the middleware to all the routes that start with /health-checkup.
app.use("/health-checkup-five", userMiddleware, kidneyMiddleware);

// In real world, multiple checks are needed to be done for the input validation.
// This is where Zod comes into picture. It helps to check user input based on the data type.
// It checks the data type of the input that the server needs and the data type of the user input.
// Using zod makes easy for the developer to perform input validation. The tricky part here is to define the schema.
// First step is to install it and then import it.
const schema = zod2.object({
	email: zod2.string().email(), //email with @ .com format //z.string().email(); inbuilt given by Zod
	password: zod2.string().min(8), //password with atleast 8 letters
	country: zod2.literal("IN").or(zod2.literal("US")), //country either India or USA
});

// Global Catches
// The backend servers are hosted on the internet and are accessed by many users.
// They always look for valid input to return the response to the user. But a user can give any type of input and make the server crash.
// The error messages shown by the backend code are quite long and not every user can understand, and it is also not safe to display server information to the user on the frontend.
// Another way is to use global catches. It is a middleware that helps in error handling.
// Global catches should be defined after all the routes so that any time an exception occurs in any route, the Global catches middleware will get called.
// Global catches takes 4 inputs. The extra input is the error message that needs to be shown to the user.
app.use(function (err, req, res, next) {
	res.json({
		msg: "Something's wrong with the server!",
	});
});

app.listen(3000);
//Extra: Rate Limiting is also part of Middleware concept //Rate Limiting ~ like make sure a single person can only send 5 requests per day

// Authentication

// As you can tell by now, anyone can send requests to your backend
// They can just go to postman and send a request
// How do you ensure that this user has access to a certain resource
// Dumb way - Ask user to send username and password in all requests as headers

// Slightly better way -
// 1. Give the user back a token on signup/signin
// 2. Ask the user to send back the token in all future requests
// 3. When the user logs out, ask the user to forget the token (or revoke it from the backend)

//Why send token stored in local storage each time to the backend, why not just store username/password in local storage and send username/password on each request to the backend? ~ in short, to avoid security risks

// Library to get comfortable with - [jsonwebtokens](https://jwt.io)

// JSON Web Tokens(JWT) is a library:
// - Commonly used for creating tokens that can be **securely transmitted between parties**.
// - These tokens contain claims that **can be verified and trusted**, making them a **robust choice for implementing authentication** mechanisms in web applications.
