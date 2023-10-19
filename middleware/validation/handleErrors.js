const { validationResult } = require('express-validator');

const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  // Build your resulting errors however you want! String, object, whatever - it works!
  return `${location}[${param}]: ${msg}`;
};

module.exports.handleErrors = function (req, res, next) {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        console.log({ errors: errors.array() });
        res.status(400).json(errors.array());
    } else {
        next();
    }
};