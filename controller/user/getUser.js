const pool = require("../../lib/sql/init");

module.exports.getUser = async function(req, res, next) {
    const { id } = req.user;

    try {
        // Query to get user data
        const getUserQuery = {
            text: `
                SELECT email, 
                    username, 
                    emailIsVerified, 
                    verified, 
                    id
                FROM users
                WHERE id = $1`,
            values: [id],
        };

        const userResult = await pool.query(getUserQuery);
        const user = userResult.rows[0];

        if (user) {
            const {
                email,
                username,
                emailIsVerified,
                name,
                id,
                verified,
            } = user;

            return res.status(200).send({
                data: {
                    email,
                    username,
                    emailIsVerified,
                    verified,
                    name,
                    id,
                },
                cookies: req.cookies
            });
        }

        res.status(404).json({ msg: "User does not exist" });
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: "getUser failed" });
        next();
    }
};