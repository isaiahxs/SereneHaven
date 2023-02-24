//this file will hold the resources for the route paths beginning with /api/bookings
const express = require('express')
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Spot, User, SpotImage, Review, ReviewImage, Booking } = require('../../db/models');

//following two lines are from phase 5
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const {Sequelize} = require('sequelize');
const router = express.Router();

//likely going to need validateBookings
    //onl requirement here is that endDate cannot be before startDate
const validateBookings = [
    check('startDate').exists({checkFalsy: true}),
    check('endDate').exists({checkFalsy: true})
    .custom((value, {req}) => {
        if (value < req.body.startDate) {
            throw new Error('endDate cannot come before startDate');
        }
        return true
    }),
    handleValidationErrors
]

//Get all of the current user's bookings FIRST NEED TO CREATE BOOKING (IN SPOTS.JS) OR ELSE I'LL GET SOMETHING EMPTY HERE
//     //REQUIRE AUTH: TRUE
// router.get('/current', requireAuth, async (req, res, next) => {


//     //if current user is authorized, return status 200 with json of bookings
// })




module.exports = router;
