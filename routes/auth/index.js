const express = require('express');
const { loginValidation, signupValidation } = require('../../middleware/validation/inputValidation');
const { registerUser } = require('../../controller/auth/registerUser');
const { loginUser } = require('../../controller/auth/loginUser');
const { displayAllUsers } = require('../../controller/auth/displayAllUsers');
const { handleErrors } = require('../../middleware/validation/handleErrors');

const router = express.Router();

// Verify current route
router.get('/', (req, res) => {
    res.send('ok');
});

// Show all stored user info
router.get('/users', displayAllUsers);

// Verify /register route
router.post('/register', signupValidation, handleErrors, registerUser);
router.get('/register', (req, res) => {
    res.send('Register requires PUT request');
});

// Verify /login route
router.post('/login', loginValidation, handleErrors, loginUser);
router.get('/login', (req, res) => {
    res.send('Login requires POST request');
});

module.exports = router;