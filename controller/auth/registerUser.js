// import { NextFunction, Request, Response } from "express";
// import prisma from "../../lib/prisma/init";
// import { createHashedPassword } from "../../middleware/auth";

const express = require('express');
const { NextFunction } = require('express');
const pool = require('../../lib/sql/init');
const auth = require('../../middleware/auth');

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

module.exports = registerUser;