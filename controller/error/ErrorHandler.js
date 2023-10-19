const multer = require('multer');

module.exports.ErrorHandler = (error, req, res, next) => {

    if (error.code === '23505') {
        const constraintName = error.constraint;

        if (constraintName === 'your_constraint_name') {
            return res.status(400).json({ msg: 'This value already exists' });
        }

    } else if (error instanceof multer.MulterError) {
        
        return res.status(400).json({ msg: `Multer Error: ${error.msg}` });
    } else {
        console.error(error);

        return res.status(500).json({ msg: 'Internal server error' });
    }
};