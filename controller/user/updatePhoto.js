
const pool = require('../../lib/sql/init');

const updatePhoto = async (req, res, next) => {
    console.log('🚀 ~ file: postPhoto.ts:4 ~ postPhoto ~ req:', req.file);
  
    try {
        const updatePhotoQuery = {
            text: 'UPDATE users SET imageUri = $1 WHERE id = $2',
            values: [req.imageUri, req.user.id],
        };

        const result = await pool.query(updatePhotoQuery);

        if (result.rowCount > 0) {
            return res.status(200).json({ msg: 'Successfully Uploaded' });
        }
        return res.status(400).json({ msg: 'Bad request' });
    } catch (e) {
        next(e);
    }
};
  
module.exports = {
    updatePhoto,
};