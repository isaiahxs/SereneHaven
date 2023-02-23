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

// Get all reviews of a current user
//     REQUIRE AUTH: TRUE
//this was not working previously because the currentUser had not posted a review yet
router.get('/current', requireAuth, async (req, res, next) => {
    const currentUserReviews = await Review.findAll({
        where: {userId: req.user.id},
        include: [
            {
            model: User,
            attributes: ["id", "firstName", "lastName"]
            },
            {
                model: Spot,
                attributes: [
                    'id',
                    'ownerId',
                    'address',
                    'city',
                    'state',
                    'country',
                    'lat',
                    'lng',
                    'name',
                    'description',
                    'price',
                ],
                include: [
                    {
                    model: SpotImage,
                    attributes: ['url'],
                    }
                ]
            },
            {
            model: ReviewImage,
            attributes: ['id', 'url']
            }
        ],
        // group: ['Review.id', 'User.id', 'Spot.id', 'ReviewImages.id']
        attributes: ['id', 'userId', 'spotId', 'review', 'stars', 'createdAt', 'updatedAt']
    })

    //if currentUserReviews exists, perform the following
    if(currentUserReviews) {
        //create new array of reviews from currentUserReviews
        const reviews = currentUserReviews.map((review) => {
            //in order to return reviews data to client as JSON, each review model instance must be converted to plain JS object first
                //convert Sequelize model instance to plain JS object with toJSON
                //destructure/extract only the necessary properties
            const {id, userId, spotId, review:reviewText, stars, createdAt, updatedAt, User, Spot, ReviewImages} = review.toJSON();

            //use let instead of const since we will reassign it
            let previewImage = null;
            if (Spot.SpotImages.length > 0) {
                //if Spot.SpotImages has any items, set previewImage to url property of
                    //first item in Spot.SpotImages array
                previewImage = Spot.SpotImages[0].url;
            } else {
                //if Spot.SpotImages is empty, set previewImage to null
                previewImage = null;
            }

            //return the order you want the response body to be in
            return {
                id, userId, spotId, review:reviewText, stars, createdAt, updatedAt, User, Spot: {
                    id: Spot.id,
                    ownerId: Spot.ownerId,
                    address: Spot.address,
                    city: Spot.city,
                    state: Spot.state,
                    country: Spot.country,
                    lat: Spot.lat,
                    lng: Spot.lng,
                    name: Spot.name,
                    price: Spot.price,
                    previewImage
                },
                ReviewImages
            }
        });
        return res.status(200).json({
            Reviews: reviews
        })
    }
    return res.status(404).json({
        message: "Reviews couldn't be found"
    })

})



module.exports = router;
