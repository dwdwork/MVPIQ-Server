/**
 * Setup available actions
 *  - Items needed to ad are commented out 
 */
// const {
//     uploadOcean,
//     uploadOceanAudio,
//     uploadOceanVideo } = require( "./../../config/multer");
// const { handleErrors } = require( "./../../middleware/validation/handleErrors");
// const {
//     createPostValidator,
//     followValidator,
//     followerFollowingValidator,
//     getCommentValidator,
//     getPostsValidator,
//     likeValidator,
//     postCommentValidator,
//     searchValidator } = require( "./../../middleware/validation/inputValidation");
// const { Router } = require( "express");
// const config = require( "../../config/env");
// const { upload, uploadAudio, uploadVideo } = require( "../../config/multer");
// const { upload } = require( "../../config/multer");
// const { getAllPosts } = require( "../../controller/services/posts/getAllPosts");
// const { postContent } = require( "../../controller/services/posts/postContent");
// const { getRandomPosts } = require( "../../controller/services/posts/getRandomPosts");
// const { postAudio } = require( "../../controller/services/posts/postAudio");
// const { postPhoto } = require( "../../controller/services/posts/postPhoto");
// const { postVideo } = require( "../../controller/services/posts/postVideo");
// const { followUser } = require( "../../controller/services/follow/followUser");
// const { searchForPosts } = require( "../../controller/services/posts/searchForPosts");
// const { getRandomFollowers } = require( "../../controller/services/follow/getRandomPeople");
// const { searchPeople } = require( "../../controller/services/follow/searchPeople");
// const { unfollowUser } = require( "../../controller/services/follow/unfollowUser");
// const { like } = require( "../../controller/services/posts/likePost");
// const { postComment } = require( "../../controller/services/posts/postComment");
// const { getCommentByPost } = require( "../../controller/services/posts/getCommentsByPost");
// const { getPostByFollowing } = require( "../../controller/services/posts/getPostByFollowing");
// const { getMyPosts } = require( "../../controller/services/posts/getMyPosts");
// const { getGuestPosts } = require( "../../controller/services/posts/getGuestPosts");
// const { rePost } = require( "../../controller/services/posts/rePost");
// const { postPhotoUpload } = require( "../../modules/handlePhotoUpload/postPhotoUpload");
// const { getSinglePost } = require( "../../controller/services/posts/getSinglePost");
// const { deletePostById } = require( "../../controller/services/posts/deletePostbyId");

// const router = Router();

// router.post("/post", createPostValidator, handleErrors, postContent);
// router.get("/all-posts", getPostsValidator, handleErrors, getAllPosts);
// router.get("/random-posts", getRandomPosts);
// router.get("/random-people", getRandomFollowers);
// router.get("/search-posts", searchValidator, handleErrors, searchForPosts);


// router.post("/upload-photo", upload.single("photo"), postPhotoUpload);
// router.get("/follow", followValidator, handleErrors, followUser);
// router.get("/unfollow", followValidator, handleErrors, unfollowUser);
// router.get("/like-post", likeValidator, handleErrors, like);
// router.post("/post-comment", postCommentValidator, handleErrors, postComment);
// router.get(
//     "/get-postComment",
//     getCommentValidator,
//     handleErrors,
//     getCommentByPost);
// router.get(
//     "/followed-posts",
//     getPostsValidator,
//     handleErrors,
//     getPostByFollowing);
// router.get("/my-posts", getPostsValidator, handleErrors, getMyPosts);
// router.get("/single-post", getSinglePost);
// router.get("/guest-posts", getPostsValidator, handleErrors, getGuestPosts);
// router.get("/re-post", followValidator, handleErrors, rePost);
// router.delete("/delete-post", deletePostById);

// module.exports = router;