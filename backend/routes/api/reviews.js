//this file will hold the resources for the route paths beginning with /api/reviews
const express = require('express')
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Spot, User, SpotImage, Review } = require('../../db/models');

//following two lines are from phase 5
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

const {Sequelize} = require('sequelize');

const validateReview = [

]
