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

module.exports = router;
