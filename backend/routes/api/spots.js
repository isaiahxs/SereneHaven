//this file will hold the resources for the route paths beginning with /api/users
const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
//IMPORTANT DO I NEED TO IMPORT SPOT MODEL HERE INSTEAD OF USER
const { Spot } = require('../../db/models');


//following two lines are from phase 5
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

//in case we need these models
const {Model, Sequelize} = require('sequelize');
const { User } = require('../../db/models');
const { SpotImage } = require('../../db/models');
const { Review } = require('../../db/models');

router.get('/', async (req, res) => {
    //response will be res.json

    //expected structure of response body has: id, ownerId, address, city, state, country, lat, lng, name, description, price, createdAt, updatedAt, avgRating, previewImage

    //need to return an object of name Spots that has an array of objects with those sets of properties in the objects

    //might require object manipulation of our code
        //when dealing with aggregate data or preview images
        //might have to do some looping
    try {
        const spots = await Spot.findAll();
        res.status(200).json({Spots: spots});
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
})

module.exports = router;
