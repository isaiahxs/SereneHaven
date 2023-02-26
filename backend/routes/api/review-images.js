//this file will hold the resources for the route paths beginning with /api/review-images
const express = require('express')
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Spot, User, SpotImage, Review, Booking, ReviewImage } = require('../../db/models');


//following two lines are from phase 5
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

//in case we need these models
    //ADDED OP IN REQUIRE
const {Model, Sequelize, Op} = require('sequelize');
const booking = require('../../db/models/booking');
// const spot = require('../../db/models/spot');

//Delete an existing image for a review
    //REQUIRE AUTH: TRUE
    //REVIEW MUST BELONG TO CURRENT USER
router.delete('/:imageId', requireAuth, async (req, res) => {
    //extract imageId from params
    const imageId = req.params.imageId;

    //see if there is a review-image at this id
    const image = await ReviewImage.findOne({
        where: {id: imageId},
        include: [{model: Review}]
    })

    //if there is not, return a 404 with message
    if (!image) return res.status(404).json({
        message: "Review Image couldn't be found",
        statusCode: 404
    })

    //check for authorization
    if (image.Review.userId !== req.user.id) return res.status(403).json({
        message: "Forbidden",
        statusCode: 403
    })

    //if there is an image at this location and the user is authorized to delete it, destroy
    await image.destroy();

    return res.status(200).json({
        message: "Successfully deleted",
        statusCode: 200
    })

})

module.exports = router;
