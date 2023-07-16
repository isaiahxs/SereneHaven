const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

//validateSignup middleware
const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Invalid email'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Username is required (must be at least 4 characters)'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    check('firstName')
        .exists({ checkFalsy: true })
        .isLength({ min: 1 })
        .isString()
        .withMessage('First Name is required'),
    check('lastName')
        .exists({ checkFalsy: true })
        .isLength({ min: 1 })
        .isString()
        .withMessage('Last Name is required'),
    handleValidationErrors
];

router.post('/', validateSignup, async (req, res, next) => {
    const { email, password, username, firstName, lastName, createdAt, updatedAt } = req.body;

    try {
        const existingEmail = await User.findOne({ where: { email } });
        const existingUsername = await User.findOne({ where: { username } });

        if (existingEmail || existingUsername) {
            const errorObj = {};
            if (existingEmail) {
                errorObj.email = 'User with that email already exists';
            }
            if (existingUsername) {
                errorObj.username = 'User with that username already exists';
            }

            const errorResponse = {
                message: "User already exists",
                statusCode: 403,
                errors: errorObj
            }
            console.log(errorResponse);
            return res.status(403).json(errorResponse);
        }

        const user = await User.signup({ email, username, password, firstName, lastName, createdAt, updatedAt });
        const token = await setTokenCookie(res, user);

        return res.json({
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                username: user.username,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                token
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            statusCode: 500
        });
    }
});

module.exports = router;