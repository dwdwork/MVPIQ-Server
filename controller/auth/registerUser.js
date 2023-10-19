const pool = require('../../lib/sql/init');
const { createHashedPassword } = require('../../middleware/auth');

module.exports.registerUser = async function (req, res, next) {
    console.log('Received POST request:', req.body);
    const { username, email, password } = req.body;
    const formattedUserName = username.toLowerCase();

    // Data validation (e.g., checking for required fields)
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Start a database transaction
    const client = await pool.connect();

    try {
        // Begin the transaction
        await client.query('BEGIN');

        // Check if a user with the same username already exists
        const checkUserQuery = {
            text: 'SELECT username FROM users WHERE username = $1',
            values: [formattedUserName],
        };

        const userCheck = await client.query(checkUserQuery);

        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Create a new user in the PostgreSQL database
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL
            )`;

        // Insert a new user in the PostgreSQL database
        const hashedPassword = await createHashedPassword(password); // Wait for the password to be hashed
        console.log('Hashed Password:', hashedPassword); // Add this debug logging
        const insertUserQuery = {
            text: 'INSERT INTO users(username, email, password) VALUES($1, $2, $3) RETURNING *',
            values: [formattedUserName, email, hashedPassword],
        };

        await client.query(createTableQuery);
        const user = await client.query(insertUserQuery);
        const createdUser = user.rows[0];

        // Commit the transaction
        await client.query('COMMIT');

        if (createdUser) {
            return res.status(200).json({ msg: 'Account created', user: createdUser });
        } else {
            return res.status(200).json({ msg: 'Table created' });
        }
    } catch (error) {
        // Rollback the transaction in case of an error
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ error: 'User creation failed' });
    } finally {
        // Release the client back to the pool
        client.release();
    }
};
