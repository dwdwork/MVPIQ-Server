const pool = require("../../lib/sql/init");
const envSECRET = require("../../config/scrtConfig");
const { compareHashedPassword, createJWT } = require("../../middleware/auth");

module.exports.loginUser = async function (req, res, next) {
    const { username, password } = req.body;
    const formattedUserName = username.toLowerCase();

    // Query to fetch user with the provided username
    const loginQuery = {
        text: "SELECT * FROM users WHERE username = $1",
        values: [formattedUserName],
    };

    try {
        const { rows } = await pool.query(loginQuery);
        if (rows.length != 0) {
            const user = rows[0];

            if (await compareHashedPassword(password, user.password)) {
                const token = createJWT({
                    username,
                    id: user.id,
                    verified: true,
                }, envSECRET);
                if (token) {
                    req.session.token = token;

                    // Set the session token in a cookie
                    res.cookie("sessionToken", token, {
                        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
                        httpOnly: true,
                        secure: true,
                        sameSite: "Lax",
                    });

                    // Set the session token in a cookie
                    res.cookie("loggedIn", "true");

                    console.log("Session(After login): ", req.session);
                    console.log("Cookies(After login): ", req.cookies);
                    console.log("User found: ", user);
                    
                    return res.status(200).json({
                        token,
                        data: {
                            email: user.email,
                            username,
                            imageUri: user.imageUri,
                            emailIsVerified: true,
                            name: user.name,
                            id: user.id,
                            verified: token.verified,
                        },
                        msg: "login success",
                        cookies: req.cookies,
                        signedCookies: req.signedCookies
                    });
                }
            } else {
                return res.status(401).json({ msg: "User Name or Password is incorrect" });
            }
            
        } else {
            console.log("No Users found.");
            return res.status(401).json({ msg: "User Name or Password is incorrect" });
        }
    } catch (e) {
        next(e);
    }
}
