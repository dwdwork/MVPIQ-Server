const pool = require('../../lib/sql/init');
const envSECRET = require('../../config/scrtConfig');
const { compareHashedPassword, createJWT } = require('../../middleware/auth');

module.exports.loginUser = async function (req, res, next) {
    const { username, password } = req.body;
    const formattedUserName = username.toLowerCase();

    // Query to fetch user with the provided username
    const loginQuery = {
        text: 'SELECT * FROM users WHERE username = $1',
        values: [formattedUserName],
    };

    try {
        const { rows } = await pool.query(loginQuery);
        if (rows.length != 0) {
            const user = rows[0];
            console.log('User found: ', user);

            if (await compareHashedPassword(password, user.password)) {
                const token = createJWT({
                    username,
                    id: user.id,
                    verified: user.emailIsVerified,
                }, envSECRET);
                if (token) {
                    req.session.token = token;
                    return res.status(200).json({
                        token,
                        data: {
                            email: user.email,
                            username,
                            imageUri: user.imageUri,
                            emailIsVerified: user.emailIsVerified,
                            name: user.name,
                            id: user.id,
                            verified: user.verified,
                        },
                        msg: "login success",
                    });
                }
            } else {
                return res.status(401).json({ msg: "User Name or Password is incorrect" });
            }
            
        } else {
            console.log('No Users found.');
            return res.status(401).json({ msg: "User Name or Password is incorrect" });
        }
    } catch (e) {
        next(e);
    }
}
