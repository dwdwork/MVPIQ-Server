// const express = require('express');
// const { loginValidation, signupValidation } = require('../../middleware/validation/inputValidation');
// const { registerUser } = require('../../controller/auth/registerUser');
// const { loginUser } = require('../../controller/auth/loginUser');
// const { handleErrors } = require('../../middleware/validation/handleErrors');


/**
 * redifining imports
 */
//inputValidation
const { body, query, param } = require('express-validator');
//registerUser
const express = require('express');
const { NextFunction } = require('express');
const pool = require('../../lib/sql/init');
const auth = require('../../middleware/auth');
//loginUser(same as registerUser)
//handlErrors
const { validationResult } = require('express-validator');
/**
 * 
 */



/**
 * redifining functions
 */
//inputValidation.js 
const signupValidation = [
    body('username')
        .custom((value) => {
            if (value.includes(' ')) {
                throw new Error('Spaces are not allowed in the input.');
            }
            return true;
        })
        .exists()
        .withMessage('username field is required.')
        .isString()
        .withMessage('username field must be a string.')
        .isLength({ max: 20, min: 1 })
        .withMessage('username must be between 2 and 15 characters long.'),
    body('email')
        .exists()
        .withMessage('Email field is required.')
        .isEmail()
        .withMessage('Invalid email address.'),
    body('password')
        .exists()
        .withMessage('Password field is required.')
        .isStrongPassword()
        .withMessage(
            `Password must be at least 8 characters long and include a mix of 
            uppercase and lowercase letters, numbers, and symbols.`
        ),
];
const loginValidation = [
    body('username')
        .exists()
        .withMessage('User Name field is required.')
        .isString()
        .withMessage('Invalid user name'),
    body('password')
        .exists()
        .withMessage('Password field is required.')
        .isLength({ max: 15, min: 2 })
        .withMessage('Password must be between 2 and 15 characters long.'),
];
//registerUser.js
const registerUser = async (req, res) => {
    console.log('Received POST request:', req.body);
    const { username, email, password } = req.body;
    const formattedUserName = username.toLowerCase();

    // Create a new user in the PostgreSQL database
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
        )`;

    // Insert a new user in the PostgreSQL database
    const insertUserQuery = {
        text: 'INSERT INTO users(username, name, email, password) VALUES($1, $2, $3, $4) RETURNING *',
        values: [formattedUserName, email, createHashedPassword(password)],
    };

    // Data validation (e.g., checking for required fields)
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const tableCreated = await pool.query(createTableQuery);
        if(!tableCreated) {
            const user = await pool.query(insertUserQuery);
            const createdUser = user.rows[0];
            if(createdUser) {
                return res.status(200).json({ msg: "Account created", user: createdUser});
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'User creation failed' });
        NextFunction(error);
    }
}
//loginUser.js
const loginUser = async (req, res, next) => {
    const { name, email, password, username } = req.body;
    const formattedUserName = username.toLowerCase();

    // Query to fetch user with the provided username and password
    const loginQuery = {
        text: 'SELECT * FROM users WHERE (username = $1 OR email = $1) AND password = $2',
        values: [email, username, password],
    };

    try {
        const user = pool.query(loginQuery, (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'An error occurred' });
            }
        
            // Check if a user with the provided username and password was found
            const user = results.rows[0];
        
            if (user) {
                res.json({ msg: 'Login successful' });
            } else {
                res.status(401).json({ error: 'Login failed' });
            }
        });

        if (user) {
            const {
                email,
                username,
                imageUri,
                verified,
                emailIsVerified,
                name,
                id,
            } = user;

            if (await auth.compareHashedPassword(password, user.password)) {
                const token = auth.createJWT({
                    username,
                    id: user.id,
                    verified: user.emailIsVerified,
                });
                req.session.token = token;
                return res.status(200).json({
                    token,
                    data: {
                        email,
                        username,
                        imageUri,
                        emailIsVerified,
                        name,
                        id,
                        verified,
                    },

                    msg: "login success",
                });
            }
            return res
            .status(401)
            .json({ msg: "User Name or Password is incorrect" });
        }
        return res.status(401).json({ msg: "User Name or Password is incorrect" });
    } catch (e) {
        next(e);
    }
}
//handleErrors.js
const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    // Build your resulting errors however you want! String, object, whatever - it works!
    return `${location}[${param}]: ${msg}`;
};
const handleErrors = (req, res, next) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        console.log({ errors: errors.array() });
        res.status(400).json(errors.array());
    } else {
        next();
    }
};
/**
 * 
 */

const router = express.Router();

router.get('/', (req, res) => {
    res.send('ok');
});
router.post('/api/register', signupValidation, handleErrors, registerUser);
router.post('/api/login', loginValidation, handleErrors, loginUser);

module.exports = router;