//this file will hold the resources for the route paths beginning with /api/users
const express = require('express')
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Spot, User, SpotImage, Review } = require('../../db/models');


//following two lines are from phase 5
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

//in case we need these models
const {Model, Sequelize} = require('sequelize');

const validateSpot = [
    check('address').exists({checkFalsy: true}).withMessage('Street address is required'),
    check('city').exists({checkFalsy: true}).withMessage('City is required'),
    check('state').exists({checkFalsy: true}).withMessage('State is required'),
    check('country').exists({checkFalsy: true}).withMessage('Country is required'),
    check('lat').exists({checkFalsy: true}).toFloat().isDecimal().withMessage('Latitude is not valid'),
    check('lng').exists({checkFalsy: true}).toFloat().isDecimal().withMessage('Longitude is not valid'),
    check('name').exists({checkFalsy: true}).isLength({max: 50}),
    check('description').exists({checkFalsy: true}).withMessage('Description is required'),
    check('price').exists({checkFalsy: true}).withMessage('Price per day is required')
]

//will have to create validation down the line for reviews

//Get all spots
    //DOES NOT ASK FOR SPECIFIC ERROR RETURNS
    //Require Auth: false
router.get('/', async (req, res, next) => {
    const Spots = await Spot.findAll({
        //need to include Reviews table and SpotImages table
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
            'createdAt',
            'updatedAt',
            //Old literal way
                // [Sequelize.literal('(SELECT AVG(stars) FROM Reviews WHERE Reviews.spotId = Spot.id)'), 'avgRating'],
                // [Sequelize.literal('(SELECT url FROM SpotImages WHERE SpotImages.spotId = Spot.id ORDER BY createdAt DESC LIMIT 1)'), 'previewImage']
            [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating'],
            //Since the SpotImages table has a createdAt column, MAX is applied there to get the image with the greatest createdAt value for each spot
            [Sequelize.fn('MAX', Sequelize.col('SpotImages.url')), 'previewImage']
        ],
        include: [
            {
                model: Review,
                attributes: []
            },
            {
                model: SpotImage,
                attributes: []
            }
        ],
        group: ['Spot.id', 'SpotImages.id', 'Reviews.spotId']
    })

    if (Spots) {
        return res.status(200).json({Spots})
    } else {
        res.status(400).json({message: "There are no spots available."})
    }
})

//Create a spot
router.post('/', validateSpot, requireAuth, async (req, res, next) => {
    if (req.user) {
        const {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price,
        } = req.body

        const ownerId = req.user.id;

        const spot = await Spot.create({
            ownerId,
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        })

        if (spot) return res.status(201).json(spot);
    }
})

//Get details of a spot by spotId


module.exports = router;
