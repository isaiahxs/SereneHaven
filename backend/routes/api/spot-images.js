//this file will hold the resources for the route paths beginning with /api/spot-images
const express = require('express')
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Spot, User, SpotImage, Review, Booking, ReviewImage } = require('../../db/models');


//following two lines are from phase 5
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

//in case we need these models
//ADDED OP IN REQUIRE
const { Model, Sequelize, Op } = require('sequelize');
const booking = require('../../db/models/booking');

const validateSpot = [
    check('address').exists({ checkFalsy: true }).withMessage('Street address is required'),
    check('city').exists({ checkFalsy: true }).withMessage('City is required'),
    check('state').exists({ checkFalsy: true }).withMessage('State is required'),
    check('country').exists({ checkFalsy: true }).withMessage('Country is required'),
    check('lat').exists({ checkFalsy: true }).toFloat().isDecimal().withMessage('Latitude is not valid'),
    check('lng').exists({ checkFalsy: true }).toFloat().isDecimal().withMessage('Longitude is not valid'),
    check('name').exists({ checkFalsy: true }).isLength({ min: 1, max: 49 }).withMessage('Name must be less than 50 characters'),
    check('description').exists({ checkFalsy: true }).withMessage('Description is required'),
    check('price').exists({ checkFalsy: true }).withMessage('Price per day is required'),
    handleValidationErrors
]

//Delete an existing image for a spot
//REQUIRE AUTH: TRUE
//WILL NEED TO ADD AUTHORIZATION HERE. SPOT MUST BELONG TO CURRENT USER
router.delete('/:imageId', requireAuth, async (req, res) => {
    //extract imageId from params
    const imageId = req.params.imageId;

    //see if there is an image at this id location
    const image = await SpotImage.findOne({
        where: { id: imageId },
        include: [{ model: Spot }]
    })

    //if there is not an image here, return 404 with message
    if (!image) return res.status(404).json({
        message: "Spot Image couldn't be found",
        statusCode: 404
    })

    //see if user has authorization to delete
    //they must be the owner of the spot if they want to
    if (image.Spot.ownerId !== req.user.id) return res.status(403).json({
        message: "Forbidden",
        statusCode: 403
    })

    //if the spot is here, and the user has the authorization, destroy
    await image.destroy();

    return res.status(200).json({
        message: "Successfully deleted",
        statusCode: 200
    })
})


module.exports = router;
