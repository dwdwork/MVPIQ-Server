const { envSECRET } = require("../../config/scrtConfig");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports.createHashedPassword = async function (password) {
    try {
        const hash = await bcrypt.hash(password, 5);
        console.log("created hash password: ", hash);
        return hash;
    } catch (error) {
        console.error("Error creating hashed password:", error);
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
    
    let logoutTime = Date.now();

    // Calculate the token expiration based on the provided logoutTime
    const expirationTime = Math.min(
        Math.floor(logoutTime / 1000), // Convert logoutTime to seconds
        Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60 // 30 days in seconds
    );

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

    // Calculate the token expiration based on the provided logoutTime
    const expirationTime = Math.min(
        Math.floor(logoutTime / 1000), // Convert logoutTime to seconds
        Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60 // 30 days in seconds
    );


    const token = jwt.sign(
        { email },
        envSECRET,
        { expiresIn: "1h" }
    );
    
    return token;
};
      
module.exports.protect = function (req, res, next) {
    console.log("🔒 ~ file: index.js:77 ~ function: protect 🔒");
    if (!req || !res) { 
        console.error("protect: req or res is not available");
        return res.status(404).json({ msg: "blockJWT: 404, nothing found at this api url" });
    } else {
        const bearer = req.headers.authorization;
        
        if (!bearer) {
            return res.status(401).json({ msg: "protect: Unauthorized" });
        }

        const [, token] = bearer.split(" ");
        
        if (!token) {
            return res.status(401).json({ msg: "protect: invalid token" });
        }

        try {
            const user = jwt.verify(token, envSECRET);
            req.user = user;
            req.token = token;
            console.log("🔒 ~ file: index.js:77 ~ protect: Ending protect function 🔒");
            next();
        } catch (e) {
            console.error(e);
            console.log("🔒 ~ file: index.js:77 ~ function: protect 🔒");
            return res.status(401).json({ msg: "protect: invalid token" });
        }
    }
    
};
      
module.exports.blockJWT = async function (req, res, next) {
    console.log("🚫 ~ file: index.js:81 ~ function: blockJWT 🚫");
    if (!req || !res) {
        console.error("req or res is not available");
        return res.status(404).json({ msg: "blockJWT: 404, nothing found at this api url" });
    } else {
        const bearer = req.headers.authorization;
        const tokenFromSession = req.session.token;
        console.log(req.session);
        console.log(req.cookies);
        const [, token] = bearer.split(" ");
        console.log(
            "🚀 ~ file: index.ts:90 ~ blockJWT ~ tokenFromSession:",
            tokenFromSession
        );
        
        if (!tokenFromSession) {
            console.log("bearer: ", bearer);
            console.log("token: ", token);
            console.log("!tokenFromSession: ", tokenFromSession);
            return res.status(401).json({ msg: "No session", cookies: req.cookies, signedCookies: req.signedCookies });
        }
        
        if (!bearer) {
            console.log("!bearer: ", bearer);
            return res.status(401).json({ msg: "Unauthorized", cookies: req.cookies, signedCookies: req.signedCookies });
        }
        
        if (!token) {
            console.log("!token: ", token);
            return res.status(401).json({ msg: "invalid token", cookies: req.cookies, signedCookies: req.signedCookies });
        }
        
        if (token !== tokenFromSession) {
            console.log("token !== tokenFromSession");
            console.log("token: ", token);
            console.log("tokenS: ", tokenFromSession);
            return res.status(401).json({ msg: "invalid token", cookies: req.cookies, signedCookies: req.signedCookies });
        }
        console.log("🚫 ~ file: index.js:110 ~ function: blockJWT 🚫");
        next();
    }
    
};
      
module.exports.checkVerified = async function (req, res, next) {
    
    if (!req || !res) {
        console.error("req or res is not available");
        return next; 
    }

    const { verified } = req.user;
    if (verified) {
        return next;
    } else {
        return res.status(401).json({ msg: "User not verified" });
    }
}; 