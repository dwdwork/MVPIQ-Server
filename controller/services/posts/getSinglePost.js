const pool = require('../../../lib/sql/init');

const getSinglePost = async (req, res, next) => {
	const { id } = req.query;

	try {
		const client = await pool.connect();

		// Start a database transaction
		await client.query('BEGIN');

		try {
			const selectPostQuery = `
				SELECT
				p.*,
				l.userId as liked,
				ph.id as photo_id,
				ph.imageUri as photo_imageUri,
				ph.imageHeight as photo_imageHeight,
				ph.imageWidth as photo_imageWidth,
				u.id as user_id,
				u.imageUri as user_imageUri,
				u.name as user_name,
				u.userName as user_userName,
				u.verified as user_verified,
				li.id as link_id,
				li.imageHeight as link_imageHeight,
				li.imageUri as link_imageUri,
				li.imageWidth as link_imageWidth,
				li.title as link_title,
				(
					SELECT true
					FROM reposts rp
					WHERE rp.postId = p.id
					AND rp.userId = $1
				) as reposted
				FROM posts p
				LEFT JOIN likes l ON p.id = l.postId AND l.userId = $1
				LEFT JOIN photos ph ON p.photoId = ph.id
				INNER JOIN users u ON p.userId = u.id
				LEFT JOIN links li ON p.linkId = li.id
				WHERE p.id = $2`;
			const { rows } = await client.query(selectPostQuery, [req.user.id, id]);

			if (rows.length > 0) {
				const post = rows[0];
				const selectLikesCountQuery = `
					SELECT COUNT(*) as likes_count
					FROM likes
					WHERE postId = $1`;
				const selectCommentsCountQuery = `
					SELECT COUNT(*) as comments_count
					FROM comments
					WHERE postId = $1`;
				const likesCount = await client.query(selectLikesCountQuery, [post.id]);
				const commentsCount = await client.query(selectCommentsCountQuery, [post.id]);
				post.likes_count = likesCount.rows[0].likes_count;
				post.comments_count = commentsCount.rows[0].comments_count;

				return res.status(200).json({ post });
			}
		} catch (error) {
			// Rollback the transaction in case of an error
			await client.query('ROLLBACK');
		} finally {
			client.release();
		}
	} catch (e) {
		next(e);
	}
};

module.exports = getSinglePost;
