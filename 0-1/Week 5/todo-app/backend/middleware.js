const ExpressError = require("./utils/ExpressError.js"); // custom error class for Express
const { createTodo, updateTodo } = require("./schema.js"); // importing the Joi schema for validation

module.exports.validateCreateTodo = (req, res, next) => {
    const result = createTodo.safeParse(req.body);
    if (!result.success) {
        throw new ExpressError(400, result.error);
    } else {
        next();
    }
};

module.exports.validateUpdateTodo = (req, res, next) => {
    // console.log(req.body);
    const result = updateTodo.safeParse(req.body);
    if (!result.success) {
        throw new ExpressError(400, result.error);
    } else {
        next();
    }
};
