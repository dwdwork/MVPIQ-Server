/**
 * Actions user can take
 */
const express = require('express');
const { Router } = express;
/**
 * Functionality for come user actions still need to be added
 *  Commenting out declaration below so I know what's missing
 * const { 
 *  getUser, 
 *  // getFollows, 
 *  updatePhoto, 
 *  // getGuest, 
 *  // saveNotificationId, 
 *  // getNotifications,
 *  // getFollowingList, 
 *  // getFollowersList, 
 *  changeData, 
 *  logout, 
 *  deleteAccount } = require('../../controller/user');
 */
const { getUser } = require('../../controller/user/getUser');
const { updatePhoto } = require('../../controller/user/updatePhoto');
const { changeData } = require('../../controller/user/changeData');
const { logout } = require('../../controller/user/logout');
const { deleteAccount } = require('../../controller/user/deleteAccount');
const { handleErrors } = require('../../middleware/validation/handleErrors');
const { deleteAccountValidator, followerFollowingValidator, updateDataValidator } = require('../../middleware/validation/inputValidation');
const { profilePhotoUpload } = require('../../modules/handlePhotoUpload/profilePhotoUpload');

const router = Router();

// Verify current route
router.get('/', (req, res) => {
    res.send('ok');
});
router.get('/get-user', getUser);

// router.get('/get-guest', getGuest);
// router.get('/get-follows', getFollows);
router.get('/token-valid', (req, res, next) => {
    res.json({ msg: true });
});
// router.get('/get-notifications', getNotifications);
router.post('/update-photo', profilePhotoUpload, updatePhoto);
// router.put('/update-notification-id', saveNotificationId);
// router.get('/get-following', followerFollowingValidator, handleErrors, getFollowingList);
// router.get('/get-followers', followerFollowingValidator, handleErrors, getFollowersList);
router.get('/logout', logout);
router.put('/update-data', updateDataValidator, handleErrors, changeData);
router.delete('/delete-account', deleteAccountValidator, handleErrors, deleteAccount);

module.exports = router;
