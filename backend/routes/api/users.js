//this file will hold the resources for the route paths beginning with /api/users
const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
//following two lines are from phase 5
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

//validateSignup middleware
const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];

// Sign up
router.post(
    '/',
    validateSignup,
    async (req, res) => {
        const { email, password, username, firstName, lastName } = req.body;
        const user = await User.signup({ email, username, password, firstName, lastName });

        await setTokenCookie(res, user);

        return res.json({
        user
        });
    }
);

//NEED TO DO THIS STEP:
// Refactor to add firstName and lastName attributes
// Now, try to refactor your code to add this simple change.

// Update your server files to add firstName and lastName attributes to a User in your database. Make sure to update your migration and model files and your route handlers to reflect this change!

module.exports = router;