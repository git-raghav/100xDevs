const jwt = require('jsonwebtoken');
const { jwt_Password } = require('../config.js');

module.exports.isAdmin = async (req, res, next) => {
    const token = req.headers.authorization; // Bearer token

    //token ~ Bearer agdgvdggdgvdgvd => ["Bearer", "agdgvdggdgvdgvd"]
    const words = token.split(" "); //make string to array of substrings ~ ["Bearer","token"]
    const our_jwt = words[1]; // token
    // console.log(our_jwt);
    try {
        const verifiedValue = jwt.verify(our_jwt, jwt_Password);//When you call jwt.verify(), it decodes and verifies the token, and then returns the payload of the token, which is the middle part of the JWT (the data encoded within the token), so now verifiedValue = payload part of the jwt

        if (verifiedValue.username) {
            next();
        }
        else {
            res.status(403).json({
                msg: "Admin authentication failure"
            })
        }
    }
    catch (e) {
        console.log(e);
    }
};
