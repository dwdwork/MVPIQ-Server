const { envSECRET } = require('../../config/scrtConfig');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');

module.exports.createHashedPassword = async function (password) {
    try {
        const hash = await bcrypt.hash(password, 5);
        console.log('created hash password: ', hash);
        return hash;
    } catch (error) {
        console.error('Error creating hashed password:', error);
        throw error; // Handle the error as needed
    }
};

module.exports.compareHashedPassword = async function (password, hashPassword) {
    try {
        const match = await bcrypt.compare(password, hashPassword);
        return match;
    } catch (error) {
        // Handle any errors, e.g., log them or throw an error
        throw error;
    }
}
    
module.exports.createJWT = function (user) {
    const token = jwt.sign(
        {
            email: user.username,
            id: user.id,
            verified: user.verified
        },
        envSECRET,
    );

    return token;
};
      
module.exports.createEmailJWT = function (email) {
    const token = jwt.sign(
        { email },
        envSECRET,
        { expiresIn: "1h" }
    );
    
    return token;
};
      
module.exports.protect = function (req, res, next) {

    if (!req || !res) {
        console.error('req or res is not available');
        return next; // You can also return next or handle it as needed
    }

    const bearer = req.headers.authorization;
    
    if (!bearer) {
        return res.status(401).json({ msg: "Unauthorized" });
    }

    const [, token] = bearer.split(" ");
    
    if (!token) {
        return res.status(401).json({ msg: "invalid token" });
    }

    try {
        const user = jwt.verify(token, envSECRET);
        req.user = user;
        req.token = token;
        next;
    } catch (e) {
        console.error(e);
        return res.status(401).json({ msg: "invalid token" });
    }
};
      
module.exports.blockJWT = async function (req, res, next) {
    
    if (!req || !res) {
        console.error('req or res is not available');
        return next; // You can also return next or handle it as needed
    }

    const bearer = req.headers.authorization;
    console.log(bearer);
    const tokenFromSession = req.session.token;
    console.log(
        "🚀 ~ file: middleware/auth/index.js:80 ~ blockJWT ~ tokenFromSession:",
        tokenFromSession
    );
    if (!tokenFromSession) {
        return res.status(401).json({ msg: "Session Expired or no session" });
    }
    if (!bearer) {
        return res.status(401).json({ msg: "Unauthorized" });
    }
    
    const [, token] = bearer.split(" ");
    
    if (!token) {
        return res.status(401).json({ msg: "invalid token" });
    }
    if (token !== tokenFromSession) {
        return res.status(401).json({ msg: "invalid token" });
    }
    next;
};
      
module.exports.checkVerified = async function (req, res, next) {
    
    if (!req || !res) {
        console.error('req or res is not available');
        return next; // You can also return next or handle it as needed
    }

    const { verified } = req.user;
    if (verified) {
        return next;
    } else {
        return res.status(401).json({ msg: "User not verified" });
    }
};