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
    check('firstName')
        .exists({checkFalsy: true})
        .isString()
        .withMessage('Please provide a first name.'),
    check('lastName')
        .exists({checkFalsy: true})
        .isString()
        .withMessage('Please provide a last name.'),
    handleValidationErrors
];

// Sign up
router.post(
    '/',
    validateSignup,
    async (req, res) => {
        const { email, password, username, firstName, lastName } = req.body;
        try {
            const existingEmail = await User.findOne({where: {email}});
            if (existingEmail) {
                return res.status(403).json({message: "That email is already taken."});
            }

            const existingUsername = await User.findOne({where: {username}});
            if (existingUsername) {
                return res.status(403).json({message: "That username is already taken."});
            }
            const user = await User.signup({ email, username, password, firstName, lastName });
            const token = await setTokenCookie(res, user);


            return res.json({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                username: user.username,
                token
            });
        } catch (error) {
            next(error);
        }
    }
);

//--------------------
//ORIGINAL SIGN UP
// Sign up
// router.post(
//     '/',
//     validateSignup,
//     async (req, res) => {
//         const { email, password, username, firstName, lastName } = req.body;
//         const user = await User.signup({ email, username, password, firstName, lastName });

//         await setTokenCookie(res, user);

//         return res.json({
//         user
//         });
//     }
// );
//--------------------

// router.get('/', (req, res) => {
//     console.log('hello, world');
//     res.send('hello, world');
// });

module.exports = router;
