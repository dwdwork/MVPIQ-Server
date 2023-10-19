const express = require('express');
const { loginValidation, signupValidation } = require('../../middleware/validation/inputValidation');
const { registerUser } = require('../../controller/auth/registerUser');
const { loginUser } = require('../../controller/auth/loginUser');
const { displayAllUsers } = require('../../controller/auth/displayAllUsers');
const { handleErrors } = require('../../middleware/validation/handleErrors');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('ok');
});
router.post('/register', signupValidation, handleErrors, registerUser);
router.post('/login', loginValidation, handleErrors, loginUser);
router.get('/display-all-users', displayAllUsers);

module.exports = router;