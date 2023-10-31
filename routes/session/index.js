const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    const token = req.session.token;
    const cookies = req.cookies;
    const signedCookies = req.signedCookies;
    const sessionCookies = req.session.cookie;
    
    res.status(200).json({ 
        token: token, 
        cookies: cookies,
        signedCookies: signedCookies,
        sessionCookies: sessionCookies,
    });
});

router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            res.status(500).json({ message: "Internal Server Error" });
        } else {
            var cookies = req.cookies;
            for (const [key, value] of Object.entries(cookies)) {
                res.clearCookie(key);
            }
            res.json({ message: "Logout successful" });
            res.end();
        }
    });
});

// This route checks if the user is authenticated and returns their session token.
router.get("/token", (req, res) => {
    if (req.session.token) {
        const token = req.session.token;
        res.status(200).json({ token });
    } else {
        res.status(401).json({ msg: "User is not authenticated" });
    }
});

// This route checks if the user is authenticated and returns their session token.
router.get("/cookie", (req, res) => {
    if (req.session.token) {
        const cookie = req.session.cookie;
        console.log(cookie);
        res.status(200).json({ cookie });
    } else {
        res.status(401).json({ msg: "User is not authenticated" });
    }
});

module.exports = router;