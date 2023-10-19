const { envSECRET } = require('../../config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');

module.exports.createHasedPassword = function (password) {
    return bcrypt.hash(password, 5);
};

module.exports.compareHashedPassword = function (password, hashPassword) {
    return bcrypt.compare(password, hashPassword);
}
    
module.exports.createJWT = function (user) {
    if (user) {
        const token = jwt.sign(
            {
                email: user.username,
                id: user.id,
                verified: user.verified
            },
            envSECRET,
        );
    
        return token;
    }
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