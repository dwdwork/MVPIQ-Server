const pool = require('../../lib/sql/init');

module.exports.displayAllUsers = async function (req, res, next) {

    // Create a new user in the PostgreSQL database
    const userQuery = `SELECT * FROM users`;

    try {
        const gotUsers = await pool.query(userQuery);
        console.log('users?: ', gotUsers);

        if (gotUsers) {
            return res.status(200).json({ msg: "Users are in the db", users: gotUsers });
        } else {
            return res.status(200).json({ msg: 'No users found'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Search for users failed' });
        next();
    }
}