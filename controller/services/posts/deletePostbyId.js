const pool = require('../../../lib/sql/init');

const deletePostById = async (req, res, next) => {
	const { id } = req.user;
	const postId = req.body?.id;

	console.log('Deleting post: ', id);
	const client = await pool.connect();
  
    try {
		await client.query('BEGIN');

		const deletePostQuery = 'DELETE FROM posts WHERE id = $1 AND user_id = $2';
		const result = await client.query(deletePostQuery, [postId, id]);
		await client.query('COMMIT');

		if (result.rowCount > 0) {
			res.json({msg: 'Post deleted'});
		} else {
			res.status(404).json({ msg: 'Post not found' });
		}
    } catch (e) {
		await client.query('ROLLBACK');
		next(e);
    } finally {
		client.release();
	}
};

module.exports = deletePostById;