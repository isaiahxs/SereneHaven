//this file will hold the resources for the route paths beginning with /api/reviews
const express = require('express')
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Spot, User, SpotImage, Review, ReviewImage, Booking } = require('../../db/models');

//following two lines are from phase 5
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const {Sequelize} = require('sequelize');
const router = express.Router();


const validateReview = [
    check('review').exists({checkFalsy: true}).withMessage('Review text is required'),
    check('stars').exists({checkFalsy: true}).isInt({min: 1, max: 5}).withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
]

//Get all reviews of a current user
    //REQUIRE AUTH: TRUE
// router.get('/current', requireAuth, async (req, res, next) => {
//     const currentUserReviews = await Review.findAll({
//         where: {userId: req.user.id},
//         include: [
//             {
//             model: User,
//             attributes: ["id", "firstName", "lastName"]
//             },
//             {
//                 model: Spot,
//                 attributes: [
//                     'id',
//                     'ownerId',
//                     'address',
//                     'city',
//                     'state',
//                     'country',
//                     'lat',
//                     'lng',
//                     'name',
//                     'description',
//                     'price'
//                 ],
//                 include: [
//                     {
//                     model: SpotImage,
//                     attributes: ['url']
//                     }
//                 ]
//             },
//             {
//             model: ReviewImage,
//             attributes: ['id', 'url']
//             }
//         ],
//         // group: ['Review.id', 'User.id', 'Spot.id', 'ReviewImages.id']
//         attributes: ['id', 'userId', 'spotId', 'review', 'stars', 'createdAt', 'updatedAt']
//     })

//     if (currentUserReviews) {
//         return res.status(200).json({currentUserReviews})
//     }
//     res.status(404).json({message: "Spot couldn't be found"});


// })



module.exports = router;
