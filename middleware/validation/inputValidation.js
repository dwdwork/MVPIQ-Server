const { body, query, param } = require('express-validator');

module.exports.signupValidation = [
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

module.exports.loginValidation = [
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

module.exports.createPostValidator = [
    body('user')
        .exists()    
        .withMessage('Invalid user ID'),
    body(['audioUri', 'videoUri', 'photo']).custom((value, { req }) => {
        if (
            ((req.body.audioUri || req.body.audioTitle) && !(req.body.videoUri || req.body.photo)) ||
            ((req.body.videoUri || req.body.videoTitle) && !(req.body.audioUri || req.body.photo)) ||
            (req.body.photo && !(req.body.audioUri || req.body.videoUri)) || req.body.postText
        ) {
            return true;
        }
        throw new Error(
            'Either audio (URI and title) or video URI or photo URIs must be provided'
        );
    }),
    body('photo')
        .optional()
        .isObject()
        .withMessage('Photo must be an object')
        .bail()
        .custom((value) => {
        if (!value.uri || !value.height || !value.width) {
            throw Error('Incomplete or malformed object');
        }
        if (
            typeof value.uri !== 'string' ||
            typeof value.height !== 'number' ||
            typeof value.width !== 'number'
        ) {
            throw new Error(`Either uri isn\'t a string or height isn\'t a string or width isn\'t a string`);
        }
        return true;
        })
        .withMessage('Photo Uri must be an array of URI'),
    body('audioTitle')
        .if(body('audioUri').exists())
        .notEmpty()
        .withMessage('Audio title is required if audio URI is provided'),
    body('videoTitle')
        .if(body('videoUri').exists())
        .isString()
        .notEmpty()
        .withMessage('Video title is required if video URI is provided'),
    body('postText')
        .optional()
        .isString()
        .withMessage('Post text must be a string'),
];

module.exports.followValidator = [
    query('id').exists().withMessage('Not a valid ID'),
];

module.exports.searchValidator = [
    query('q').exists().isString().withMessage('Query cannot be empty'),
];

module.exports.getPostsValidator = [
    query('take').exists().isNumeric().withMessage('Specify the number of posts to take'),
    query('skip').exists().isNumeric().withMessage('Specify the number of posts to skip'),
];

module.exports.likeValidator = [
    query('id').exists().withMessage('Not a valid ID'),
];

module.exports.postCommentValidator = [
    body('id').exists().withMessage('Not a valid ID'),
    body('comment').exists().isString().withMessage('Comment must be valid'),
];

module.exports.getCommentValidator = [
    query('id').exists().withMessage('Not a valid ID'),
];

module.exports.notifIdValidator = [
    query('notificationId').exists().withMessage('Not a valid ID'),
];

module.exports.followerFollowingValidator = [
    query('take').exists().isNumeric().withMessage('Specify the number of posts to take'),
    query("skip").exists().isNumeric().withMessage("produce skip to take"),
];

module.exports.updateDataValidator = [
    body("password").exists().isString().withMessage("invalid password"),
    body(["username", "newPassword", "name"]).custom((value, { req }) => {
        console.log(req.body);
        if (req.body.username && !req.body.name && !req.body.newPassword) {
            return true;
        } else if (!req.body.username && req.body.name && !req.body.newPassword) {
            return true;
        } else if (!req.body.username && !req.body.name && req.body.newPassword) {
            return true;
        }
        throw new Error("Either username | newPassword | name is needed");
    }),
];

module.exports.deleteAccountValidator = [
    body("password").exists().isString().withMessage("invalid password"),
];