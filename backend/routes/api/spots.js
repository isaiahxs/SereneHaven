//this file will hold the resources for the route paths beginning with /api/spots
const express = require('express')
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Spot, User, SpotImage, Review, Booking } = require('../../db/models');


//following two lines are from phase 5
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

//in case we need these models
    //ADDED OP IN REQUIRE
const {Model, Sequelize, Op} = require('sequelize');
const booking = require('../../db/models/booking');
// const spot = require('../../db/models/spot');

const validateSpot = [
    check('address').exists({checkFalsy: true}).withMessage('Street address is required'),
    check('city').exists({checkFalsy: true}).withMessage('City is required'),
    check('state').exists({checkFalsy: true}).withMessage('State is required'),
    check('country').exists({checkFalsy: true}).withMessage('Country is required'),
    check('lat').exists({checkFalsy: true}).toFloat().isDecimal().withMessage('Latitude is not valid'),
    check('lng').exists({checkFalsy: true}).toFloat().isDecimal().withMessage('Longitude is not valid'),
    check('name').exists({checkFalsy: true}).isLength({ min: 1, max: 49}).withMessage('Name must be less than 50 characters'),
    check('description').exists({checkFalsy: true}).withMessage('Description is required'),
    check('price').exists({checkFalsy: true}).withMessage('Price per day is required'),
    handleValidationErrors
]

//review validations
const validateReview = [
    check('review').exists({checkFalsy: true}).withMessage('Review text is required'),
    check('stars').exists({checkFalsy: true}).isInt({min: 1, max: 5}).withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
]

//will have to create validation down the line for bookings
const validateBookings = [
    check('startDate').exists({checkFalsy: true}),
    check('endDate').exists({checkFalsy: true})
    .custom((value, {req}) => {
        if (value <= req.body.startDate) {
            throw new Error('endDate cannot be on or before startDate');
        }
        return true
    }),
    handleValidationErrors
]


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
        //must join Review and SpotImage tables so that I can use AVG and MAX functions
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
        //group by Spot.id, SpotImages.id, Reviews.spotId
        group: ['Spot.id', 'SpotImages.id', 'Reviews.spotId']
    })

    if (Spots) {
        return res.status(200).json({Spots})
    } else {
        res.status(400).json({message: "There are no spots available."})
    }
})

//Get all spots owned by the current user
    //REQUIRE AUTH: TRUE
    //NEED TO GET 'Spots' ARRAY TO SHOW
router.get('/current', requireAuth, async (req, res, next) => {
    //if user is authenticated, findAll spots that belong to user from Spot model
    const usersSpots = await Spot.findAll({
        //filter spots by authenticated user's id
        where: {ownerId: req.user.id},
        attributes: [
            //specify which columns to include in the result set
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
            [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating'],
            [Sequelize.fn('MAX', Sequelize.col('SpotImages.url')), 'previewImage']
        ],
        //specify models to eager load, only including respective foreign keys
            //this way we can use the JOIN to fetch reviews and images for each spot without having to include full details
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
    //if there were spots, return usersSpots with 200 code
    if (usersSpots) {
        //easy way to get array of spots as part of JSON response is to wrap usersSpots array in an object with the key of Spots
        return res.status(200).json({Spots: usersSpots});
    }
    //NO SPECIFICS ON WHAT ERROR THEY WANT RETURNED
    res.status(404).json({'message': 'This user did not have any spots'})
})


//Get details of a spot by spotId //ON POSTMAN, THIS WORKS IF I SPECIFY SPOT MYSELF BUT NOT IF I LEAVE THE SQUIGGLY SPOTID REQUEST
    //REQUIRE AUTH: FALSE
    //error message suggests to me that the spotId is not an integer
router.get('/:spotId', async (req, res, next) => {
    //use findByPk() on Spot model to find spot with Id from URL parameter
    const specificSpot = await Spot.findByPk(req.params.spotId, {
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
            //THIS TIME THEY WANT THE TOTAL NUMBER OF REVIEWS, THEN AVG
            [Sequelize.fn('COUNT', Sequelize.col('Reviews.id')), 'numReviews'],
            [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgStarRating']
        ],
        //specify which models to eager load
        include: [
            {
                model: Review,
                attributes: []
            },
            {
                model: SpotImage,
                attributes: ['id', 'url', 'preview']
            },
            {
                model: User,
                as: 'Owner',
                attributes: ['id', 'firstName', 'lastName']
            }
        ],
        group: ['Spot.id', 'SpotImages.id', 'Owner.id', 'Reviews.spotId']
    })
    //if the specified spot was found, respond with status code 200 and JSON body
    if (specificSpot) {
        return res.status(200).json(specificSpot)
    }
    //if not, return 404 with specific message and statusCode
    return res.status(404).json({message: "Spot couldn't be found", statusCode: 404})
})


//Create a spot //NEED TO SEND USER TO FORBIDDEN IF THEY ARE NOT AUTHORIZED
    //Price accepts a string at the moment
    //REQUIRE AUTH MUST BE TRUE
router.post('/', requireAuth, validateSpot, async (req, res, next) => {
    //if user is authenticated,
    if (req.user) {
        //check if there is an existing Spot in the database using findAll
        const Locations = await Spot.findAll();

        //extract required fields for creating new Spot from req.body
        const {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        } = req.body;

        //if there was an existing location, we can check who owns that location
        if (Locations) {
            //retrieve current location owner from req.user object
            //must be ownerId because it could be used to associate a spot with its owner
                //if a user is the owner of a spot, they may have certain permissions that non-owners do not have
                    //such as the abilty to edit or delete a spot
            const ownerId = req.user.id

            //call Spot.create with extracted fields and ownerId
            const newLocation = await Spot.create({
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

            //if the newLocation was successfully created, return a 201 status code with JSON of new location
            if (newLocation) return res.status(201).json(newLocation);
        }
    }
})


//Add image to a spot based on Spot's id
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    //extract url and preview from request body
    const {url, preview} = req.body

    //find spot with given id using findOne()
    const spot = await Spot.findOne({
        where: {id: req.params.spotId}
    });

    //if there is no spot, return a 404
    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }

    //check for user authorization
    const authorized = await Spot.findOne({
        where: {ownerId: req.user.id, id: req.params.spotId}
    })

    //if the user is not authorized, return a 403 with 'Forbidden' message
    if (!authorized) {
        return res.status(403).json({
            message: 'Forbidden',
            statusCode: 403
        })
    }

    //if the user is authorized and there is a spot, create a record in SpotImage
    const image = await SpotImage.create({
        spotId: parseInt(req.params.spotId),
        url,
        preview
    })

    //if image was successfully added as a record in SpotImage, return status 200 with JSON of the image
    if (image) return res.status(200).json({
        id: image.id,
        url: image.url,
        preview: image.preview
    });


})

//Edit a spot
    //REQUIRE AUTH: TRUE
router.put('/:spotId', requireAuth, validateSpot, async (req, res, next) => {
    //find spot by parameter passed in
    const specificSpot = await Spot.findByPk(req.params.spotId);

    //extract everything needed from the request body
    const {address, city, state, country, lat, lng, name, description, price} = req.body;

    const ownerId = req.user.id;

    //if there is no specific spot, immediately return 404 saying it couldn't be found
    if (!specificSpot) {
        return res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }

    //if user is authorized, they can update, if not, send them a 403 with message of 'Forbidden'
    const authorized = await Spot.findOne({
        where: {id: req.params.spotId, ownerId}
    })

    if (!authorized) {
        return res.status(403).json({
            message: "Forbidden",
            statusCode: 403
        })
    }

    //if there is a specific spot, then update it
    const updatedSpot = await specificSpot.update({
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

    if (updatedSpot) return res.status(200).json(updatedSpot);
})

//Delete a spot
    //REQUIRE AUTH: TRUE
router.delete('/:spotId', requireAuth, async (req, res, next) => {
    //spot must belong to current user in order for them to be able to destroy it
    const spotId = req.params.spotId;
    const ownerId = req.user.id;

    //check if there is a spot
    const spot = await Spot.findOne({where: {
        id: spotId,
    }})

    //if there is no spot, immediately return a 404 saying it couldn't be found
    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }

    //check if current user is authorized to delete this spot or not
    const authorized = await Spot.findOne({
        where: {id: spotId, ownerId}
    })

    //if they are not, give them a 403 and a forbidden
    if (!authorized) {
        return res.status(403).json({
            message: "Forbidden",
            statusCode: 403
        })
    }

    //if the currentUser is in fact, the owner of this spot, then they are authorized to destroy it
    await spot.destroy();

    return res.status(200).json({
        message: "Successfully deleted",
        statusCode: 200
    })
})


//NEED TO CREATE A REVIEW FOR THIS SPOT FIRST BEFORE I CAN ACCESS IT WITH GET
//This has to be in spots.js because of the url that Postman is trying to access
//Create a review for a spot based on the spot's id
    //REQUIRE AUTH: TRUE
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res, next) => {
    //extract review's text/string and stars from req body
    const {review, stars} = req.body;

    //extract spotId from params
    const spotId = req.params.spotId;

    //query to find spot with the passed in Id, if the spot does not exist, return a 404
    const spot = await Spot.findOne({where: {id: spotId}});

    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }

    //check if this user already has a review for this spot
    const userReview = await Review.findOne({
        where: {userId: req.user.id, spotId}
    })

    //if so, return a 403
    if (userReview) {
        return res.status(403).json({
            message: "User already has a review for this spot",
            statusCode: 403
        })
    }

    //if this user has not yet created a review for this spot, create review
    const newUserReview = await Review.create({
        userId: req.user.id,
        spotId,
        review,
        stars
    })

    //return success with status of 201
    return res.status(201).json(newUserReview);
})

//Create a booking from a spot based on the spot's id
    //REQUIRE AUTH: TRUE
router.post('/:spotId/bookings', requireAuth, validateBookings, async (req, res, next) => {
    //extract spotId from params
    const spotId = req.params.spotId;

    //look for spot with specified Id
    const spot = await Spot.findByPk(spotId);

    //extract user
    const userId = req.user.id;

    //extract startDate and endDate from req body
    const {startDate, endDate} = req.body;

    //if there is no spot with this spotId, return a 404
    if (!spot) return res.status(404).json({
        message: "Spot couldn't be found",
        statusCode: 404
    })

    //a user is only authorized to create a booking if they do NOT OWN THE SPOT
    if (spot.ownerId === userId) return res.status(400).json({
        message: "Sorry, since you own the spot, you cannot create bookings for it",
        statusCode: 400
    })

    //i think our endDate before startDate should be getting taken care of by the validateBookings

    //if the dates selected by the user are already taken, return a 403
        //need to query the Bookings table and see if startDate and endDate of the new booking fall between the existing bookings
            //or if new booking overlaps old bookings

        //if there are conflicting times/dates, return a 403 saying the dates are already taken
    const conflictingDate = await Booking.findOne({
        where: {
            spotId,
            [Op.and]: [
                {
                    //first, check if start and end dates fall between existing booking's start and end date
                    [Op.or]: [
                        {startDate: {[Op.between]: [startDate, endDate]}},
                        {endDate: {[Op.between]: [startDate, endDate]}},
                    ]
                },
                {
                    //then, check if an existing booking's start and end dates fall between the start and end dates provided
                    [Op.or]: [
                        {startDate: {[Op.gte]: startDate}},
                        {endDate: {[Op.lte]: endDate}}
                    ]
                }
            ]
        }
    })

    //if there is a conflictingDate, return necessary errors
    if (conflictingDate) {
        //USE NEWDATE() TO CONVERT DATE STRINGS TO JS DATE OBJECTS
            //if there is a conflict, add appropriate error message to error object
            //at last, return 403 with desired messages and code
        const errors = {};

        //check if start date conflicts with existing booking
        if (new Date(startDate) >= new Date(conflictingDate.startDate) && new Date(startDate) <= new Date(conflictingDate.endDate)) {
            errors.startDate = 'Start date conflicts with an existing booking';
        }

        //check if end date conflicts with existing booking
        if (new Date(endDate) >= new Date(conflictingDate.startDate) && new Date(endDate) <= new Date(conflictingDate.endDate)) {
            errors.endDate = 'End date conflicts with an existing booking';
        }

        return res.status(403).json({
            message: 'Sorry, this spot is already booked for the specified dates',
            statusCode: 403,
            errors: errors
        })
    }

    //if there is not a conflictingDate, create the new booking
    const newBooking = await Booking.create({spotId, userId, startDate, endDate})

    //return the new booking
    return res.status(200).json(newBooking);
})

//Get all bookings for a spot based on spot's id
    //REQUIRE AUTH: TRUE
router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
    //extract specific spotId from params
    const spotId = req.params.spotId;

    //retrieve spot by its Id
    const spot = await Spot.findByPk(spotId);

    //if spot could not be found, return a 404 with message
    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }

    //find out who the owner is, if there is a spot
    const owner = spot.ownerId;

    //get current user (will likely need this for authorization check)
    const userId = req.user.id;
        //could add a where clause here to make sure user isn't the owner

    //THERE WILL BE TWO SUCCESSFUL OUTCOMES, ONE IF YOU'RE THE OWNER
        //AND ONE IF YOU'RE NOT
    //First, if USER IS NOT THE OWNER OF THIS SPOT
    if (owner !== userId) {
        const bookings = await Booking.findAll({
            where: {
                spotId: spotId
            },
            attributes: [
                'spotId',
                'startDate',
                'endDate'
            ]
        })
        // console.log('bookings', bookings);

        return res.status(200).json({Bookings: bookings})
    } else {
    //Second, if USER IS THE OWNER OF THE SPOT
        const bookings = await Booking.findAll({
            where: {
                spotId: spotId
            },
            include: [
                {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
                }
            ]
        })
        // console.log('bookings', bookings);
        // bookings.forEach((booking) => {
        //     console.log(`Booking Start Date: ${booking.startDate.toISOString()}`);
        //     console.log(`Booking End Date: ${booking.endDate.toISOString()}`);
        //   });

        return res.status(200).json({Bookings: bookings})
    }
})

module.exports = router;
