const pool = require('../../../lib/sql/init');

const likePost = async (req, res, next) => {
	const userId = req.user.id;
	const postId = req.query.id;
	const client = await pool.connect();
	console.log("🚀 ~ file: likePost.ts:6 ~ like ~ like:");
	console.log("🚀 ~ file: likePost.ts:6 ~ like ~ id:", id);

	try {
		await client.query('BEGIN');

		const checkLikeQuery = 'SELECT * FROM likes WHERE user_id = $1 AND post_id = $2';
		const checkLikeResult = await client.query(checkLikeQuery, [userId, postId]);

		if (checkLikeResult.rowCount === 0) {
			// User has not liked post, so add like
			const insertLikeQuery = 'INSERT INTO likes (user_id, post_id) VALUES ($1, $2)';
			await client.query (insertLikeQuery, [userId, postId]);
			await client.query('COMMIT');
			res.status(200).json({msg: 'liked'});
		} else {
			// User has already liked the post, so remove the like
			const deleteLikeQuery = 'DELETE FROM likes WHERE user_id = $1 AND post_id = $2';
			await client.query(deleteLikeQuery, [userId, postId]);
			await client.query('COMMIT');
			res.status(200).json({ms: 'unliked'});
		}
	} catch (e) {
		await client.query('ROLLBACK');
		next(e);
	} finally {
		client.release();
	}
};

module.exports = likePost;