const pool = require('../../lib/sql/init');
const {
    compareHashedPassword,
    createHashedPassword,
} = require('../../middleware/auth');

const changeData = async (req, res, next) => {
    try {
        const id = req.user.id;
        const { password, username, newPassword, name } = req.body;
    
        // Query to get the user's current password
        const getUserQuery = {
            text: 'SELECT password FROM users WHERE id = $1',
            values: [id],
        };
    
        const userResult = await pool.query(getUserQuery);
        const user = userResult.rows[0];
    
        if (user) {
            if (await compareHashedPassword(password, user.password)) {
                // Query to update user data
                const updateQuery = {
                    text: 'UPDATE users SET name = $1, password = $2, username = $3 WHERE id = $4',
                    values: [name || null, newPassword || null, username ? username.trim() : null, id],
                };
        
                const updatedUserResult = await pool.query(updateQuery);
        
                if (updatedUserResult.rowCount > 0) {
                    return res.status(200).json({ msg: 'success' });
                }
            }
            return res.status(401).json({ msg: 'Invalid password' });
        }
    } catch (e) {
        return next(e);
    }
};

module.exports = {
    changeData,
};