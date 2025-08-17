const { User } = require("../db/index.js");

module.exports.isUser = async (req, res, next) => {
    const username = req.headers.username;
    const password = req.headers.password;

    let user = await User.findOne({
        username: username,
        password: password
    })

    if (user) {
        next();
    } else {
        res.status(403).json({
            msg: "User doesnt exist"
        })
    }
};
