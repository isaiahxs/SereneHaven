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

//Add an image to a review based on the review's id
    //REQUIRE AUTH: TRUE
router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    //extract review from params
    const reviewId = req.params.reviewId;
    //extract url from req body
    const {url} = req.body;

    //see if there is a review at this Id already
    const rev = await Review.findOne(
        {
            where: {id: reviewId}
        }
    )

    //if there is not, return a 404 saying Review couldn't be found
    if (!rev) return res.status(404).json({message: "Review couldn't be found", statusCode: 404});

    //since only authorized users can post here, check for auth
    const authorized = await Review.findOne({
        where: {
            id: reviewId,
            userId: req.user.id
        }
    })

    //if user is not authorized, return a 403 and Forbidden
    if (!authorized) return res.status(403).json({message: 'Forbidden', statusCode: 403})

    //we only want 10 images per spot so first, find all reviewImages
    const revImages = await ReviewImage.findAll({where: {reviewId}})

    //if we have more than 10 images in this array returned, return a 403 saying max has been reached
        //for some reason, if i just have > 10 here, it allows 10 additional ones to be created even though there was already an existing review here
    if (revImages.length >= 10) {
        return res.status(403).json({
            message: "Maximum number of images for this resource was reached",
            statusCode: 403
        })
    }

    //if user is authorized, and there are no more than 10 images for this resource, continue and create the new image
    const newImage = await ReviewImage.create({reviewId, url})

    //return 200 with id and url from newImage
    return res.status(200).json({
        id: newImage.id,
        url: newImage.url
    })
})



module.exports = router;
