const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth');
const { getUserById,
    getUser,
    addProfileInfo,
    getProfileById,
    getUserProfileInfo,
    updateProfileInfo,
    getAllProfile } = require('../controllers/profile');

router.param("userId", getUserById);
router.param("profileId", getProfileById);

router.get("/profile/:userId", isSignedIn, isAuthenticated, getUser);

router.post("/profile/:userId", [
    check('name', "name should be at least 5 characters").isLength({ min: 5 }),
    check('aboutme', "about me should be at least 20 characters and max of 500").isLength({ min: 20, max: 500 }),
    check('location', "please enter current location").isString(),
    check('email', "email is required")
        .isEmail()
        .normalizeEmail(),
    check('mobile', 'Mobile should be 10 digits').isLength({ min: 10, max: 10 }),
    check('skills', 'Add at least one skill').isArray({ min: 1 })
], isSignedIn, isAuthenticated, addProfileInfo);

router.get("/profile/:userId/:profileId", isSignedIn, isAuthenticated, getUserProfileInfo);

router.put("/profile/:userId/:profileId", [
    check('name', "name should be at least 5 characters").isLength({ min: 5 }),
    check('aboutme', "about me should be at least 20 characters and max of 500").isLength({ min: 20, max: 500 }),
    check('location', "please enter current location").isString(),
    check('email', "email is required")
        .isEmail()
        .normalizeEmail(),
    check('mobile', 'Mobile should be 10 digits').isLength({ min: 10, max: 10 }),
    check('skills', 'Add at least one skill').isArray({ min: 1 })
], isSignedIn, isAuthenticated, updateProfileInfo);

router.get("/user/:userId/fetchAll", isAdmin, getAllProfile)



module.exports = router;