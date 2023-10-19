const pool = require('../../lib/sql/init');
const { compareHashedPassword } = require('../../middleware/auth');

module.exports.deleteAccount = async function (req, res, next) {
    try {
        const { password } = req.body;

        // Query to get the user's password
        const getUserQuery = {
            text: 'SELECT password FROM users WHERE id = $1',
            values: [req.user.id],
        };

        const userAccount = await pool.query(getUserQuery);

        if (!(await compareHashedPassword(password, userAccount.rows[0].password))) {
            return res.status(401).json({ msg: 'Invalid password' });
        }

        // Query to delete the user's account
        const deleteUserQuery = {
            text: 'DELETE FROM users WHERE id = $1',
            values: [req.user.id],
        };

        const user = await pool.query(deleteUserQuery);

        if (user.rowCount > 0) {
            res.json({ msg: 'Account deleted' });
        } else {
            res.json({ msg: 'No user found to delete' });
        }
    } catch (e) {
        next(e);
    }
};