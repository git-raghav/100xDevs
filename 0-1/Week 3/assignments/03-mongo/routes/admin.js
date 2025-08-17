const express = require("express");
const router = express.Router();
const { isAdmin } = require("../middleware/admin.js");
const { Admin, Course } = require("../db/index.js");

//admin/signup
router.post("/signup", async (req, res) => {
	try {
		const { username, password } = req.body;

		// check if user already exists
		const existingAdmin = await Admin.findOne({ username });
		if (existingAdmin) {
			return res.status(400).json({ message: "Username already exists" });
		}

		await Admin.create({
			username: username,
			password: password,
		});

		res.status(201).json({ message: "Admin created successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Error creating admin", error: error.message });
	}
});

//admin/courses - POST
router.post("/courses", isAdmin, async (req, res) => {
	try {
		const { title, description, price, imageLink } = req.body;

		const newCourse = await Course.create({
			title: title,
			description: description,
			price: price,
			imageLink: imageLink,
		});

        res.status(201).json({ message: "Course created successfully", courseId: newCourse._id });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Error creating course", error: error.message });
	}
});

//admin/courses - GET
router.get("/courses", isAdmin, async (req, res) => {
	// Implement fetching all courses logic
	const response = await Course.find({}); //Find all with no filtering conditions
	res.json({
		courses: response,
	});
});

module.exports = router;
