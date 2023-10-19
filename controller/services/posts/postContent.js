const pool = require('../../../lib/sql/init');
const validator = require('validator');
const ogs = require('open-graph-scraper');

const postContent = async (req, res, next) => {
	const { 
		id 
	} = req?.user;
	const {
		audioUri,
		audioTitle,
		videoUri,
		videoTitle,
		photoUri,
		postText,
		videoThumbnail,
		photo,
	} = req.body;

	if (postText && validator.isURL(postText) === true) {
		console.log('reached after false');

		try {
			const options = { url: postText };
			const data = await ogs(options);

			if (data) {
				const { error, html, result, response } = data;

				if (result) {
					console.log('🚀 ~ file: postContent.ts:60 ~ result:', result);

					const results = result.ogImage
						? result?.ogImage?.length >= 1
						? result?.ogImage[0]
						: undefined
						: undefined;

					const title = result?.ogTitle;
					const client = await pool.connect();

					// Start a database transaction
					await client.query('BEGIN');

					try {
						const insertPostQuery = `
							INSERT INTO posts (user_id, post_text, post_link_url, post_link_image_height, post_link_image_width, post_link_image_uri, post_link_title)
							VALUES ($1, $2, $3, $4, $5, $6, $7)
							RETURNING id`;
						const values = [id, postText, postText, results?.height, results?.width, results?.url, title];

						const { rows } = await client.query(insertPostQuery, values);
						const postId = rows[0].id;

						// Commit the transaction
						await client.query('COMMIT');

						if (postId) {
							const signedInUserQuery = `
								SELECT user_name
								FROM users
								WHERE id = $1`;
							const { rows: signedInUserRows } = await client.query(signedInUserQuery, [id]);

							return res.json({ msg: 'posted' });
						}
					} catch (error) {
						// Rollback the transaction in case of an error
						await client.query('ROLLBACK');
					} finally {
						client.release();
					}
				}

				if (error) {
					console.log(error);
					const client = await pool.connect();

					// Start a database transaction
					await client.query('BEGIN');

					try {
						const insertPostQuery = `
							INSERT INTO posts (user_id, photo_uri, audio_title, audio_uri, video_uri, video_title, post_text, video_thumbnail_uri)
							VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
							RETURNING id`;
						const values = [id, photoUri, audioTitle, audioUriUpdated(), videoUriUpdated(), videoTitle, postText, videoThumbnail];
						const { rows } = await client.query(insertPostQuery, values);
						const postId = rows[0].id;

						// Commit the transaction
						await client.query('COMMIT');

						if (postId) {
							const signedInUserQuery = `
								SELECT user_name
								FROM users
								WHERE id = $1`;
							const { rows: signedInUserRows } = await client.query(signedInUserQuery, [id]);
							return res.json({ msg: 'posted' });
						}
					} catch (error) {
						// Rollback the transaction in case of an error
						await client.query('ROLLBACK');
					} finally {
						client.release();
					}
				}
			}
		} catch (e) {

		}
	} else {
		try {
			console.log('reached');
			const client = await pool.connect();

			// Start a database transaction
			await client.query('BEGIN');

			try {
				const insertPostQuery = `
					INSERT INTO posts (user_id, photo_uri, photo_image_height, photo_image_uri, photo_image_width, audio_title, audio_uri, video_uri, video_title, post_text, video_thumbnail_uri)
					VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
					RETURNING id`;
				const values = [
					id,
					photoUri,
					photo?.height,
					photo?.uri,
					photo?.width,
					audioTitle,
					audioUriUpdated(),
					videoUriUpdated(),
					videoTitle,
					postText,
					videoThumbnail];
				const { rows } = await client.query(insertPostQuery, values);
				const postId = rows[0].id;

				// Commit the transaction
				await client.query('COMMIT');

				if (postId) {
					const signedInUserQuery = `
						SELECT user_name, image_uri
						FROM users
						WHERE id = $1`;
					const { rows: signedInUserRows } = await client.query(signedInUserQuery, [id]);

					return res.json({ msg: 'posted' });
				}
			} catch (error) {
				// Rollback the transaction in case of an error
				await client.query('ROLLBACK');
				next(error);
			} finally {
				client.release();
			}
		} catch (e) {
			next(e);
		}
	}
};

module.exports = postContent;
