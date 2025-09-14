if (process.env.NODE_ENV !== "production") {
	require("dotenv").config(); // load environment variables from .env file in development mode
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const ExpressError = require("./utils/ExpressError.js"); // custom error class for Express
const wrapAsync = require("./utils/wrapAsync.js"); // utility to wrap async functions for error handling
const { validateCreateTodo, validateUpdateTodo } = require("./middleware.js");

const Todo = require("./models/todo.js");

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173"
}));

/* -------------------------- connecting to MongoDB ------------------------- */
const MONGO_URL = process.env.MONGO_URL;

main()
	.then(() => {
		console.log("Connected to MongoDB");
	})
	.catch((err) => console.log(err));

async function main() {
	try {
 	   await mongoose.connect(MONGO_URL, {
 		   serverSelectionTimeoutMS: 10000,
 		   socketTimeoutMS: 45000,
 	   });
    } catch (err) {
 	   console.error("Initial MongoDB connection error:", err);
 	   process.exit(1);
    }
}

//routes
app.get("/todos", wrapAsync(async (req, res) => {
    const allTodos = await Todo.find({});
    // console.log(allTodos);
    res.json(allTodos);
}));

app.post("/todo", validateCreateTodo, wrapAsync(async (req, res) => {
    // console.log(req.body);
    await Todo.create(req.body);
    res.json({ msg: "Todo created successfully" });
}));

app.put("/completed", validateUpdateTodo, wrapAsync(async (req, res) => {
    let id = req.body._id;
    await Todo.findByIdAndUpdate(id, { completed: true });
    res.json({ msg: "Todo updated successfully" });
}));

// if no above route matches, this middleware will be called
app.all(/.*/, (req, res, next) => {
	next(new ExpressError(404, "Page Not Found"));
});

// Custom error handling middleware jo saare errors ko handle karega
app.use((err, req, res, next) => {
	let { statusCode = 500, message = "Something went wrong" } = err;
	res.json({ err: { statusCode, message } });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
