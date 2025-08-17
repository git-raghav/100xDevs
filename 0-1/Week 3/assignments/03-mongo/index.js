const express = require('express');
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override"); // for PUT and DELETE requests

const adminRouter = require("./routes/admin.js")
const userRouter = require("./routes/user.js");

// Middleware for parsing request bodies
app.use(bodyParser.json()); //allow req.body parsing in entire application
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

/* -------------------------- connecting to MongoDB ------------------------- */
main()
	.then(() => {
		console.log("Connected");
	})
	.catch((err) => console.log(err));

async function main() {
	await mongoose.connect("mongodb://127.0.0.1:27017/course_selling_app");
}

//routes
app.use("/admin", adminRouter);
app.use("/user", userRouter);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
