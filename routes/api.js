/**
 * JS Version
 */
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

router.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost', // or your PostgreSQL host
    database: 'postgres',
    password: 'P0$tGr3$qL-SuPrUzR-2o23',
    port: 5432, // or your PostgreSQL port
});

router.get('/', (req, res) => {
    const data = { msg: 'This is your API data' };
    res.json(data);
});

router.get('/data', (req, res) => {
    const data = { msg: 'This is your API data' };
    res.json(data);
});

router.get('/users', (req, res) => {
    const selectQuery = 'SELECT * FROM users';

    pool.query(selectQuery, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to retrieve user data' });
        }

        const data = { users: results };
        res.json(data);
    });
});

// Define a route for creating a user
router.post('/users', async (req, res) => {
    console.log('Received POST request:', req.body);
    const { username, email, password } = req.body;

    // Create a new user in the PostgreSQL database
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
        )
    `;

    const insertUserQuery = {
        text: 'INSERT INTO users(username, email, password) VALUES($1, $2, $3) RETURNING *',
        values: [username, email, password],
    };

    // Data validation (e.g., checking for required fields)
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        await pool.query(createTableQuery);

        // Insert the user data
        const result = await pool.query(insertUserQuery);
        const createdUser = result.rows[0];
        res.json({ msg: 'User created successfully', user: createdUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'User creation failed' });
    }
});


// Define a route for getting user data by user ID
router.get('/user', (req, res) => {
    const userId = req.query.id;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    // Query to fetch user data by user ID
    const getUserQuery = {
        text: 'SELECT * FROM users WHERE id = $1',
        values: [userId],
    };

    pool.query(getUserQuery, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'An error occurred' });
        }

        const user = results.rows[0];

        if (user) {
            res.json({ user });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    });
});

// Define a route for user login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    // Query to fetch user with the provided username and password
    const loginQuery = {
        text: 'SELECT * FROM users WHERE username = $1 AND password = $2',
        values: [username, password],
    };
  
    pool.query(loginQuery, (error, results) => {
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
});

// DELETE /api/auth/logout
router.delete('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.status(400).send('Unable to log out')
            } else {
                res.send('Logout successful')
            }
        });
    } else {
        res.end();
    }
});

module.exports = router;