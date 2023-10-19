// import { NextFunction, Response } from "express";
// import prisma from "../../lib/prisma/init";
// import { compareHashedPassword, createJWT } from "../../middleware/auth";
// import { Request } from "express-validator/src/base";

const express = require('express');
const pool = require('../../lib/sql/init');
const auth = require('../../middleware/auth');

const loginUser = async (req, res, next) => {
    const { name, email, password, username } = req.body;
    const formattedUserName = username.toLowerCase();

    // Query to fetch user with the provided username and password
    const loginQuery = {
        text: 'SELECT * FROM users WHERE (username = $1 OR email = $1) AND password = $2',
        values: [email, username, password],
    };

    try {
        const user = pool.query(loginQuery, (error, results) => {
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

        if (user) {
            const {
                email,
                username,
                imageUri,
                verified,
                emailIsVerified,
                name,
                id,
            } = user;

            if (await auth.compareHashedPassword(password, user.password)) {
                const token = auth.createJWT({
                    username,
                    id: user.id,
                    verified: user.emailIsVerified,
                });
                req.session.token = token;
                return res.status(200).json({
                    token,
                    data: {
                        email,
                        username,
                        imageUri,
                        emailIsVerified,
                        name,
                        id,
                        verified,
                    },

                    msg: "login success",
                });
            }
            return res
            .status(401)
            .json({ msg: "User Name or Password is incorrect" });
        }
        return res.status(401).json({ msg: "User Name or Password is incorrect" });
    } catch (e) {
        next(e);
    }
}

module.exports = loginUser;