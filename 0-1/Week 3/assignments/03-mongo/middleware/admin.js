const { Admin } = require("../db/index.js");

module.exports.isAdmin = async (req, res, next) => {
    const username = req.headers.username;
    const password = req.headers.password;

    let admin = await Admin.findOne({
        username: username,
        password: password
    })

    if (admin) {
        next();
    } else {
        res.status(403).json({
            msg: "Admin doesnt exist"
        })
    }
};
