const jwt = require('jsonwebtoken');
const { jwt_Password } = require('../config');

module.exports.isUser = async (req, res, next) => {
    const token = req.headers.authorization;

    //token ~ Bearer agdgvdggdgvdgvd => ["Bearer", "agdgvdggdgvdgvd"]
    const words = token.split(" "); //make string to array of substrings
    const our_jwt = words[1];
    try {
        const verifiedValue = jwt.verify(our_jwt, jwt_Password);//When you call jwt.verify(), it decodes and verifies the token, and then returns the payload of the token, which is the middle part of the JWT (the data encoded within the token), so now verifiedValue = payload part of the jwt

        if (verifiedValue.username) {
            req.headers.username = verifiedValue.username; //for user/courses/:courseId
            next();
        }
        else {
            res.status(403).json({
                msg: "User authentication failure"
            })
        }
    }
    catch (e) {
        console.log(e);
    }
};
