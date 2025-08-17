const express = require("express");
const router = express.Router();
const { isUser } = require("../middleware/user.js");
const { User, Course } = require("../db/index");

//user/signup
router.post('/signup', async (req, res) => {
    try {
		const { username, password } = req.body;

		// check if user already exists
		const existingUser = await User.findOne({ username });
		if (existingUser) {
			return res.status(400).json({ message: "Username already exists" });
		}

		await User.create({
			username: username,
			password: password,
		});

		res.status(201).json({ message: "User created successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Error creating user", error: error.message });
	}
});

//user/courses
router.get('/courses', async (req, res) => {
    const response = await Course.find({}); //Find all with no filtering conditions
    res.json({
        courses: response
    })
});

//user/courses/:courseId
router.post('/courses/:courseId', isUser, async (req, res) => {
    const courseId = req.params.courseId;

    const { username, password } = req.headers;
    await User.updateOne({
        username: username,
        password: password,
    },{
        $push: { purchasedCourses: courseId }
    })
    res.json({
        message: 'Course purchased successfully'
    })
});

//user/purchasedCourses
router.get('/purchasedCourses', isUser, async (req, res) => {
    const user = await User.findOne({
        username: req.headers.username,
        password: req.headers.password
    })

    //basically scan through the 'Course' table, find the courses whose IDs match with the IDs present in user.purchasedCourses and Return the full details of these matching courses
    const purchased_courses = await Course.find({
        _id: { $in: user.purchasedCourses }
    })
    res.json({
        kharida_hua_maal: purchased_courses
    })
});

module.exports = router;
