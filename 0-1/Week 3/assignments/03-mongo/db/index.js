const mongoose = require('mongoose');

// Define Mongoose Schemas
const AdminSchema = new mongoose.Schema({
    username: String,
    password: String
});

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    purchasedCourses:[{
        ref: 'Course',
        type: mongoose.Schema.Types.ObjectId
    }]
});

const CourseSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    imageLink: String
});

const Admin = mongoose.model('Admin', AdminSchema);
const User = mongoose.model('User', UserSchema);
const Course = mongoose.model('Course', CourseSchema);


// Export Mongoose Models for Use in Other Files
module.exports = {
    Admin,
    User,
    Course
}
