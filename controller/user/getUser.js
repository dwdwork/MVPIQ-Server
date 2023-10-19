const pool = require('../../lib/sql/init');

// async function getUser (req, res) {
//     const { id } = req.user;

//     try {
//         // Query to get user data
//         const getUserQuery = {
//             text: `
//                 SELECT email, 
//                 username, 
//                 imageUri, 
//                 emailIsVerified, 
//                 verified, 
//                 name, 
//                 id, 
//                 followersCount, 
//                 followingCount 
//                 FROM users WHERE id = $1`,
//             values: [id],
//         };

//         const userResult = await pool.query(getUserQuery);
//         const user = userResult.rows[0];

//         if (user) {
//             const {
//                 email,
//                 username,
//                 imageUri,
//                 emailIsVerified,
//                 name,
//                 id,
//                 verified,
//                 followersCount,
//                 followingCount,
//             } = user;

//             return res.status(200).send({
//                 data: {
//                     email,
//                     username,
//                     imageUri,
//                     emailIsVerified,
//                     verified,
//                     name,
//                     id,
//                 },
//             });
//         }

//         res.status(404).json({ msg: 'User does not exist' });
//     } catch (e) {
//         next(e);
//     }
// };

module.exports.getUser = async function(req, res) {
    const { id } = req.user;

    try {
        // Query to get user data
        const getUserQuery = {
            text: `
                SELECT email, 
                username, 
                imageUri, 
                emailIsVerified, 
                verified, 
                name, 
                id, 
                followersCount, 
                followingCount 
                FROM users WHERE id = $1`,
            values: [id],
        };

        const userResult = await pool.query(getUserQuery);
        const user = userResult.rows[0];

        if (user) {
            const {
                email,
                username,
                imageUri,
                emailIsVerified,
                name,
                id,
                verified,
                followersCount,
                followingCount,
            } = user;

            return res.status(200).send({
                data: {
                    email,
                    username,
                    imageUri,
                    emailIsVerified,
                    verified,
                    name,
                    id,
                },
            });
        }

        res.status(404).json({ msg: 'User does not exist' });
    } catch (e) {
        next(e);
    }
}; // Export the function directly
