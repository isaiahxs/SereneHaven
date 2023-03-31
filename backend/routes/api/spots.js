//this file will hold the resources for the route paths beginning with /api/spots
const express = require('express')
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Spot, User, SpotImage, Review, Booking, ReviewImage, sequelize } = require('../../db/models');


//following two lines are from phase 5
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

//in case we need these models
    //ADDED OP IN REQUIRE
const {Model, Sequelize, Op, DataTypes} = require('sequelize');
const booking = require('../../db/models/booking');
// const spot = require('../../db/models/spot');

//spot validations
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

//bookings validations
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

//query filter validations
const validateQueryParamaters = [
    check("page")
      .default(1)
      .notEmpty()
      .withMessage("Page must be provided")
      .isFloat({min: 1, max: 10})
      .withMessage("Page must be greater than or equal to 1 and less than or equal to 10"),
    check("size")
      .default(20)
      .notEmpty()
      .withMessage("Size must be provided")
      .isFloat({min: 1, max: 20})
      .withMessage("Size must be greater than or equal to 1 and less than or equal to 20"),
    check("minLat")
      .optional()
      .isFloat()
      .withMessage("Minimum latitude is invalid"),
    check("maxLat")
      .optional()
      .isFloat()
      .withMessage("Maximum latitude is invalid"),
    check("minLng")
      .optional()
      .isFloat()
      .withMessage("Minimum longitude is invalid"),
    check("maxLng")
      .optional()
      .isFloat()
      .withMessage("Maximum longitude is invalid"),
    check("minPrice")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Maximum price must be greater than or equal to 0"),
    check("maxPrice")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Minimum price must be greater than or equal to 0"),
      handleValidationErrors
  ];


//Get all spots after filters have been applied
router.get("/", validateQueryParamaters, async (req, res, next) => {
    //extract the values from the query parameters and specify default values for page and size
    const {
      page = 1,
      size = 20,
      minLat,
      maxLat,
      minLng,
      maxLng,
      minPrice,
      maxPrice,
    } = req.query;

    //set limit and offset variables used in the query to retrieve the result
        //IMPORTANT NOTES FROM PAGINATION READING
        //LIMIT = (x results/page)
        //OFFSET = (y pages) * (x results/page)
    const limit = size;
    const offset = (page - 1) * size;

    //define empty object that will hold the conditions used to filter the query result
    const filter = {};
        //we will use this filter object as a condition when querying the database to retrieve only the spots that match the specified criteria

    //check for existence of the other query parameters, if they are around, add them to the filter object
        //IMPORTANT: spread syntax will be used to spread properties of an object into a new object
            //without the spread syntax, only the new operator would be added to the object, and any previous operators would be overwritten
            //using the spread syntax ensures that all previous operators are preserved while adding the new operator

    //set property of lat on filter object to an object containing the gte operator and value of req.query.minLat
    //filter spots that have a latitude greater than or equal to the value of minLat
    if (minLat) filter.lat = {[Sequelize.Op.gte]: minLat};

    //filter spots that have a latitude less than or equal to the max latitude
    if (maxLat) filter.lat = {...filter.lat, [Sequelize.Op.lte]: maxLat};

    //if both min and max have been given, filter spots with latitudes in between the two values
    if (minLat && maxLat) {
        filter.lat = {
            ...filter.lat,
            [Sequelize.Op.and]: [
                {[Sequelize.Op.gte]: minLat},
                {[Sequelize.Op.lte]: maxLat}
            ]
        }
    }

    //filter spots that have a longitude greater than or equal to the min longitude
    if (minLng) filter.lng = {[Sequelize.Op.gte]: minLng};

    //filter spots that have a longitude less than or equal to the max longitude
    if (maxLng) filter.lng = {...filter.lng, [Sequelize.Op.lte]: maxLng};

    //if both min and max lng have been given, filter spots with longitudes in between the two values
    if (minLng && maxLng) {
        filter.lng = {
            ...filter.lng,
            [Sequelize.Op.and]: [
                {[Sequelize.Op.gte]: minLng},
                {[Sequelize.Op.lte]: minLng}
            ]
        }
    }

    //filter spots that have a price greater than or equal to the min price
    if (minPrice) filter.price = {[Sequelize.Op.gte]: minPrice};

    //filter spots that have a price less than or equal to the max price
    if (maxPrice) filter.price = {...filter.price, [Sequelize.Op.lte]: maxPrice};

    //if both min and max prices have been given, filter spots with prices in between the two values
    if (minPrice && maxPrice) {
        filter.price = {
            ...filter.price,
            [Sequelize.Op.and]: [
                {[Sequelize.Op.gte]: minPrice},
                {[Sequelize.Op.lte]: maxPrice}
            ]
        }
    }

  //find all locations that match the criteria
  const locations = await Spot.findAll({
    //specify associations within the query
        //for each spot/location that matches the filtered criteria, the response will include the url of the first image associated with the spot
      include: [
        {
          model: SpotImage,
          attributes: ["url"]
        },
        //as well as the star rating of any reviews associated with the spot
        {
          model: Review,
          attributes: ["stars"],
          required: false
        }
      ],
      //limit the number of spots returned and set the starting position for the results
      limit,
      offset,
      //the where property specifies the filter conditions for the query
        //i will pass in the filter object that was created earlier to filter the results baseed on the specified criteria for lat, lng, and price
      where: filter,
    });

    //create new array on locations that were retrieved from the database
        //for each spot/location (loc short for locations) in the locations array, a new object will be created with some same and new properties
    const allLocations = locations.map((loc) => {
      const reviews = loc.Reviews || [];
      //remember reduce uses the accumulator and current values
        //need to iterate through all reviews and apply a callback function to each element
        //first parameter is the accum which starts at 0, second is the current value of the element being processed
        //need to sum all of the 'stars' values in the reviews array
            //acc is the running total of the sum of 'stars' values, and 'cur' is the current 'stars' value of the review being processed

      //take the 'Reviews' property from the loc (short for locations) object (which contains an array of reviews for the spot) and reduce it to a single number
        //representing the sum of all review ratings
      const sumRatings = reviews.reduce((acc, cur) => acc + cur.stars, 0);

      //if there are reviews, divide the sum by the number of reviews to get the average rating for the spot
      //if there are no reviews for the spot, the avgRating will be set to null
      let avgRating;

      if (reviews.length > 0) {
        avgRating = sumRatings / reviews.length
      } else {
        avgRating = null;
      }

      //NEW ADDITIONS
      loc = loc.toJSON();
      const lat = parseFloat(loc.lat);
      const lng = parseFloat(loc.lng);
      const price = parseFloat(loc.price);

      return {
        id: loc.id,
        ownerId: loc.ownerId,
        address: loc.address,
        city: loc.city,
        state: loc.state,
        country: loc.country,
        lat,
        lng,
        //old lat and lng systems that were returning strings on live
        // lat: loc.lat,
        // lng: loc.lng,
        name: loc.name,
        description: loc.description,
        price,
        //old price system that was returning string on live
        // price: loc.price,
        createdAt: loc.createdAt,
        updatedAt: loc.updatedAt,
        avgRating,
        //previewImage property will be set to the url of the first image for the spot, which is retrieved from the SpotImages property of the spot object
            //if there are no images for the spot, set previewImage to null
        previewImage: loc.SpotImages[0]?.url || null,
      };
    });

  //if locations have been found, return 200 with Spots array + page + size
    if (allLocations.length > 0) return res.status(200).json({
        Spots: allLocations,
        page: parseInt(page),
        size: parseInt(size)
    })

    //if no locations were found, return 404 with message saying none were found
    return res.status(404).json({
        message: "Spots couldn't be found"
    })
  });


// //ORIGINAL GET ALL SPOTS OWNED BY CURRENT USER
// //Get all spots owned by the current user
//     //REQUIRE AUTH: TRUE
// router.get('/current', requireAuth, async (req, res, next) => {
//     //if user is authenticated, findAll spots that belong to user from Spot model
//     const usersSpots = await Spot.findAll({
//         //filter spots by authenticated user's id
//         where: {ownerId: req.user.id},
//         attributes: [
//             //specify which columns to include in the result set
//             'id',
//             'ownerId',
//             'address',
//             'city',
//             'state',
//             'country',
//             'lat',
//             'lng',
//             'name',
//             'description',
//             'price',
//             'createdAt',
//             'updatedAt',
//             [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating'],
//             [Sequelize.fn('MAX', Sequelize.col('SpotImages.url')), 'previewImage']
//         ],
//         //specify models to eager load, only including respective foreign keys
//             //this way we can use the JOIN to fetch reviews and images for each spot without having to include full details
//         include: [
//             {
//                 model: Review,
//                 attributes: []
//             },
//             {
//                 model: SpotImage,
//                 attributes: []
//             }
//         ],
//         group: ['Spot.id', 'SpotImages.id', 'Reviews.spotId']
//     })
//     //if there were spots, return usersSpots with 200 code
//     if (usersSpots) {
//         //easy way to get array of spots as part of JSON response is to wrap usersSpots array in an object with the key of Spots
//         return res.status(200).json({Spots: usersSpots});
//     }

//     //NO SPECIFICS ON WHAT ERROR THEY WANT RETURNED
//     res.status(404).json({'message': 'This user did not have any spots'})
// })


//-----------------------------------------------------------------------------------------------------------------------
// //SECOND WIP GET SPOTS OF CURRENT USER
// //Get all spots owned by the current user
//     //REQUIRE AUTH: TRUE
//     router.get('/current', requireAuth, async (req, res, next) => {
//         //if user is authenticated, findAll spots that belong to user from Spot model
//         const usersSpots = await Spot.findAll({
//             //filter spots by authenticated user's id
//             where: {ownerId: req.user.id},
//             attributes: [
//                 //specify which columns to include in the result set
//                 'id',
//                 'ownerId',
//                 'address',
//                 'city',
//                 'state',
//                 'country',
//                 [Sequelize.fn('CAST', Sequelize.col('lat'), 'float'), 'lat'],
//                 [Sequelize.fn('CAST', Sequelize.col('lng'), 'float'), 'lng'],
//                 'name',
//                 'description',
//                 [Sequelize.fn('CAST', Sequelize.col('price'), 'float'), 'price'],
//                 'createdAt',
//                 'updatedAt',
//                 [Sequelize.fn('CAST', Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'float'), 'avgRating'],
//                 [Sequelize.fn('MAX', Sequelize.col('SpotImages.url')), 'previewImage']
//             ],
//             //specify models to eager load, only including respective foreign keys
//                 //this way we can use the JOIN to fetch reviews and images for each spot without having to include full details
//             include: [
//                 {
//                     model: Review,
//                     attributes: []
//                 },
//                 {
//                     model: SpotImage,
//                     attributes: []
//                 }
//             ],
//             // group: ['Spot.id', 'SpotImages.id', 'Reviews.spotId']
//         })

//         const spots = usersSpots.map(spot => ({
//             ...spot.toJSON(),
//             lat: parseFloat(spot.lat),
//             lng: parseFloat(spot.lng),
//             price: parseFloat(spot.price),
//             avgRating: parseFloat(spot.avgRating)
//         }));

//         if (spots.length > 0) {
//             return res.status(200).json({Spots: spots});
//         }

//         // //if there were spots, return usersSpots with 200 code
//         // if (usersSpots) {
//         //     //easy way to get array of spots as part of JSON response is to wrap usersSpots array in an object with the key of Spots
//         //     return res.status(200).json({Spots: usersSpots});
//         // }

//         //NO SPECIFICS ON WHAT ERROR THEY WANT RETURNED
//         res.status(404).json({'message': 'This user did not have any spots'})
//     })


//-----------------------------------------------------------------------------------------------------------------------

// //THIRD WIP OF GET ALL SPOTS OWNED BY CURRENT USER
//Get all spots owned by the current user
    //REQUIRE AUTH: TRUE
router.get('/current', requireAuth, async (req, res, next) => {
    //if user is authenticated, findAll spots that belong to user from Spot model
    const usersSpots = await Spot.findAll({
        //filter spots by authenticated user's id
        where: {ownerId: req.user.id},
        // attributes: [
        //     //specify which columns to include in the result set
        //     'id',
        //     'ownerId',
        //     'address',
        //     'city',
        //     'state',
        //     'country',
        //     'lat',
        //     'lng',
        //     'name',
        //     'description',
        //     'price',
        //     'createdAt',
        //     'updatedAt',
        //     [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating'],
        //     [Sequelize.fn('MAX', Sequelize.col('SpotImages.url')), 'previewImage']
        // ],
        //specify models to eager load, only including respective foreign keys
            //this way we can use the JOIN to fetch reviews and images for each spot without having to include full details
        include: [
            {
                model: Review,
                attributes: ["stars"]
            },
            {
                model: SpotImage,
                attributes: ["url"]
            }
        ],
        // group: ['Spot.id', 'SpotImages.id', 'Reviews.spotId']
        // attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'price', 'updatedAt', 'createdAt']
    })

    if (usersSpots) {
        const spots = usersSpots.map((spot) => {
            // const {Spot} = spot.toJSON();
            const reviews = spot.Reviews || [];

            const sumRatings = reviews.reduce((acc, cur) => acc + cur.stars, 0);

            let avgRating;

            if (reviews.length > 0) {
                avgRating = sumRatings / reviews.length
              } else {
                avgRating = null;
              }

            //NEW ADDITIONS:
            spot = spot.toJSON();
            const lat = parseFloat(spot.lat);
            const lng = parseFloat(spot.lng);
            const price = parseFloat(spot.price);
            //possible source of error or fix
            // avgRating = parseFloat(spot.avgRating);

            //return the order you want the response body in
            return {
                id: spot.id,
                ownerId: spot.ownerId,
                address: spot.address,
                city: spot.city,
                state: spot.state,
                country: spot.country,
                lat,
                lng,
                name: spot.name,
                description: spot.description,
                price,
                createdAt: spot.createdAt,
                updatedAt: spot.updatedAt,
                avgRating,
                previewImage: spot.SpotImages[0]?.url || null
            }
        })
        return res.status(200).json({Spots: spots})
    }

    // //if there were spots, return usersSpots with 200 code
    // if (usersSpots) {
    //     //easy way to get array of spots as part of JSON response is to wrap usersSpots array in an object with the key of Spots
    //     return res.status(200).json({Spots: usersSpots});
    // }

    //NO SPECIFICS ON WHAT ERROR THEY WANT RETURNED
    res.status(404).json({'message': 'This user did not have any spots'})
})


//-----------------------------------------------------------------------------------------------------------------------



// //Get details of a spot by spotId ORIGINAL
//     //REQUIRE AUTH: FALSE
//     //error message suggests to me that the spotId is not an integer
// router.get('/:spotId', async (req, res, next) => {
//     //use findByPk() on Spot model to find spot with Id from URL parameter
//     const specificSpot = await Spot.findByPk(req.params.spotId, {
//         attributes: [
//             'id',
//             'ownerId',
//             'address',
//             'city',
//             'state',
//             'country',
//             'lat',
//             'lng',
//             'name',
//             'description',
//             'price',
//             'createdAt',
//             'updatedAt',
//             //THIS TIME THEY WANT THE TOTAL NUMBER OF REVIEWS, THEN AVG
//             [Sequelize.fn('COUNT', Sequelize.col('Reviews.id')), 'numReviews'],
//             [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgStarRating']
//         ],
//         //specify which models to eager load
//         include: [
//             {
//                 model: Review,
//                 attributes: []
//             },
//             {
//                 model: SpotImage,
//                 attributes: ['id', 'url', 'preview']
//             },
//             {
//                 model: User,
//                 as: 'Owner',
//                 attributes: ['id', 'firstName', 'lastName']
//             }
//         ],
//         group: ['Spot.id', 'SpotImages.id', 'Owner.id', 'Reviews.spotId']
//     })
//     //if the specified spot was found, respond with status code 200 and JSON body
//     if (specificSpot) {
//         return res.status(200).json(specificSpot)
//     }
//     //if not, return 404 with specific message and statusCode
//     return res.status(404).json({message: "Spot couldn't be found", statusCode: 404})
// })

//---------------------------------------------------------------------------------------------
//SECOND ORIGINAL Get details of a spot by spotId
    //REQUIRE AUTH: FALSE
    //error message suggests to me that the spotId is not an integer
    // router.get('/:spotId', async (req, res, next) => {
    //     //use findByPk() on Spot model to find spot with Id from URL parameter
    //     const specificSpot = await Spot.findByPk(req.params.spotId, {
    //         attributes: [
    //             'id',
    //             'ownerId',
    //             'address',
    //             'city',
    //             'state',
    //             'country',
    //             'lat',
    //             'lng',
    //             'name',
    //             'description',
    //             'price',
    //             'createdAt',
    //             'updatedAt',
    //             //THIS TIME THEY WANT THE TOTAL NUMBER OF REVIEWS, THEN AVG
    //             [Sequelize.fn('COUNT', Sequelize.col('Reviews.id')), 'numReviews'],
    //             [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgStarRating']
    //         ],
    //         //specify which models to eager load
    //         include: [
    //             {
    //                 model: Review,
    //                 attributes: []
    //             },
    //             {
    //                 model: SpotImage,
    //                 attributes: ['id', 'url', 'preview']
    //             },
    //             {
    //                 model: User,
    //                 as: 'Owner',
    //                 attributes: ['id', 'firstName', 'lastName']
    //             }
    //         ],
    //         group: ['Spot.id', 'SpotImages.id', 'Owner.id', 'Reviews.spotId']
    //     })
    //     //if the specified spot was found, respond with status code 200 and JSON body
    //     if (specificSpot) {
    //         return res.status(200).json(specificSpot)
    //     }
    //     //if not, return 404 with specific message and statusCode
    //     return res.status(404).json({message: "Spot couldn't be found", statusCode: 404})
    // })



//------------------------------------------------------------------------------------------
// SECOND WIP Get details of a spot by spotId
//     REQUIRE AUTH: FALSE
// router.get('/:spotId', async (req, res, next) => {
//     //use findByPk() on Spot model to find spot with Id from URL parameter
//     const specificSpot = await Spot.findAll({
//         where: {id: req.params.spotId},
//         // attributes: [
//         //     'id',
//         //     'ownerId',
//         //     'address',
//         //     'city',
//         //     'state',
//         //     'country',
//         //     'lat',
//         //     'lng',
//         //     'name',
//         //     'description',
//         //     'price',
//         //     'createdAt',
//         //     'updatedAt',
//         //     //THIS TIME THEY WANT THE TOTAL NUMBER OF REVIEWS, THEN AVG
//         //     [Sequelize.fn('COUNT', Sequelize.col('Reviews.id')), 'numReviews'],
//         //     [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgStarRating']
//         // ],
//         //specify which models to eager load
//         include: [
//             {
//                 model: Review,
//                 attributes: ["stars"]
//             },
//             {
//                 model: SpotImage,
//                 attributes: ['id', 'url', 'preview']
//             },
//             {
//                 model: User,
//                 as: 'Owner',
//                 attributes: ['id', 'firstName', 'lastName']
//             }
//         ],
//         // group: ['Spot.id', 'SpotImages.id', 'Owner.id', 'Reviews.spotId']
//     })

//     if (specificSpot.length === 0) return res.status(404).json({message: "Spot couldn't be found", statusCode: 404})

//     //original mini wip------------------------------
//     const spots = specificSpot.map((spot) => {
//         const reviews = spot.Reviews || [];

//         const sumRatings = reviews.reduce((acc, cur) => acc + cur.stars, 0);

//         let avgStarRating;

//         if (reviews.length > 0) {
//             avgStarRating = sumRatings / reviews.length
//         } else {
//             avgStarRating = null;
//         }

//         //NEW ADDITIONS:
//         spot = spot.toJSON();
//         const lat = parseFloat(spot.lat);
//         const lng = parseFloat(spot.lng);
//         const price = parseFloat(spot.price);

//         //IMPORTANT QUESTION, IS NUMREVIEWS JUST THE LENGTH OF REVIEWS ARRAY
//         let numReviews = reviews.length;

//         return {
//             id: spot.id,
//             ownerId: spot.ownerId,
//             address: spot.address,
//             city: spot.city,
//             state: spot.state,
//             country: spot.country,
//             lat,
//             lng,
//             name: spot.name,
//             description: spot.description,
//             price,
//             createdAt: spot.createdAt,
//             updatedAt: spot.updatedAt,
//             numReviews,
//             avgStarRating,
//             SpotImages: spot.SpotImages,
//             Owner: spot.Owner
//         }
//     })
//     return res.status(200).json(spots)


//     //---------------------------------------------------------------
//     //ITERATION OF FIRST MINI WIP TO SEE IF I CAN NOT USE MAP
//     //     const reviews = specificSpot.Reviews || [];

//     //     const sumRatings = reviews.reduce((acc, cur) => acc + cur.stars, 0);

//     //     let avgStarRating;

//     //     if (reviews.length > 0) {
//     //         avgStarRating = sumRatings / reviews.length
//     //     } else {
//     //         avgStarRating = null;
//     //     }

//     //     //NEW ADDITIONS:
//     //     // specificSpot = specificSpot.toJSON();
//     //     const lat = parseFloat(specificSpot.lat);
//     //     const lng = parseFloat(specificSpot.lng);
//     //     const price = parseFloat(specificSpot.price);

//     //     //IMPORTANT QUESTION, IS NUMREVIEWS JUST THE LENGTH OF REVIEWS ARRAY
//     //     let numReviews = reviews.length;

//     //     const spots = {
//     //         id: specificSpot.id,
//     //         ownerId: specificSpot.ownerId,
//     //         address: specificSpot.address,
//     //         city: specificSpot.city,
//     //         state: specificSpot.state,
//     //         country: specificSpot.country,
//     //         lat,
//     //         lng,
//     //         name: specificSpot.name,
//     //         description: specificSpot.description,
//     //         price,
//     //         createdAt: specificSpot.createdAt,
//     //         updatedAt: specificSpot.updatedAt,
//     //         numReviews,
//     //         avgStarRating,
//     //         SpotImages: specificSpot.SpotImages,
//     //         Owner: specificSpot.Owner
//     //     }
//     //     return res.status(200).json(spots)

//     // })

//     //end of original mini wip----------------------------------

//     //second iteration---------------------------------------------------------
//     // if (specificSpot) {
//     //     const reviews = specificSpot.Reviews || [];

//     //     const sumRatings = reviews.reduce((acc, cur) => acc + cur.stars, 0);

//     //     let avgStarRating;

//     //     if (reviews.length > 0) {
//     //         avgStarRating = sumRatings / reviews.length
//     //     } else {
//     //         avgStarRating = null;
//     //     }

//     //     //NEW ADDITIONS:
//     //     const lat = parseFloat(specificSpot.lat);
//     //     const lng = parseFloat(specificSpot.lng);
//     //     const price = parseFloat(specificSpot.price);

//     //     //IMPORTANT QUESTION, IS NUMREVIEWS JUST THE LENGTH OF REVIEWS ARRAY
//     //     let numReviews = reviews.length;

//     //     const spot = {
//     //         id: specificSpot.id,
//     //         ownerId: specificSpot.ownerId,
//     //         address: specificSpot.address,
//     //         city: specificSpot.city,
//     //         state: specificSpot.state,
//     //         country: specificSpot.country,
//     //         lat,
//     //         lng,
//     //         name: specificSpot.name,
//     //         description: specificSpot.description,
//     //         price,
//     //         createdAt: specificSpot.createdAt,
//     //         updatedAt: specificSpot.updatedAt,
//     //         numReviews,
//     //         avgStarRating,
//     //         SpotImages: specificSpot.SpotImages,
//     //         User: specificSpot.User
//     //     };

//     //     return res.status(200).json({Spots: [spot]});
//     // }
//     //end of second iteration----------------------------------------------------


//     //if the specified spot was found, respond with status code 200 and JSON body
//     // if (specificSpot) {
//     //     return res.status(200).json(specificSpot)
//     // }

//     //if not, return 404 with specific message and statusCode
// })





//----------------------------------------------------------------------------------
//ONE MORE ITERATION FOR GET DETAILS OF SPOT BY ITS ID
router.get('/:spotId', async (req, res, next) => {
    try {
        // Use findByPk() on Spot model to find spot with Id from URL parameter
        const specificSpot = await Spot.findByPk(req.params.spotId, {
            include: [
                {
                    model: Review,
                    attributes: ["stars"]
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
            ]
        });

        if (!specificSpot) {
            return res.status(404).json({message: "Spot couldn't be found", statusCode: 404});
        }

        // Calculate the average star rating and the total number of reviews
        const reviews = specificSpot.Reviews || [];
        const sumRatings = reviews.reduce((acc, cur) => acc + cur.stars, 0);
        const numReviews = reviews.length;
        const avgStarRating = numReviews > 0 ? sumRatings / numReviews : null;

        // Convert the spot to JSON and parse numeric values
        const spot = specificSpot.toJSON();
        spot.lat = parseFloat(spot.lat);
        spot.lng = parseFloat(spot.lng);
        spot.price = parseFloat(spot.price);

        // Return the formatted spot object
        return res.status(200).json({
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            description: spot.description,
            price: spot.price,
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt,
            numReviews,
            avgStarRating,
            SpotImages: spot.SpotImages,
            Owner: spot.Owner
        });
    } catch (error) {
        next(error);
    }
});

//------------------------------------------------------------------------------------------

// //Create a spot ORIGINAL
//     //REQUIRE AUTH: TRUE
// router.post('/', requireAuth, validateSpot, async (req, res, next) => {
//     //if user is authenticated,
//     if (req.user) {
//         //check if there is an existing Spot in the database using findAll
//         const Locations = await Spot.findAll();

//         //extract required fields for creating new Spot from req.body
//         const {
//             address,
//             city,
//             state,
//             country,
//             lat,
//             lng,
//             name,
//             description,
//             price
//         } = req.body;

//         //if there was an existing location, we can check who owns that location
//         if (Locations) {
//             //retrieve current location owner from req.user object
//             //must be ownerId because it could be used to associate a spot with its owner
//                 //if a user is the owner of a spot, they may have certain permissions that non-owners do not have
//                     //such as the abilty to edit or delete a spot
//             const ownerId = req.user.id

//             //call Spot.create with extracted fields and ownerId
//             const newLocation = await Spot.create({
//                 ownerId,
//                 address,
//                 city,
//                 state,
//                 country,
//                 lat,
//                 lng,
//                 name,
//                 description,
//                 price
//             })

//             //if the newLocation was successfully created, return a 201 status code with JSON of new location
//             if (newLocation) return res.status(201).json(newLocation);
//         }
//     }
// })

//-----------------------------------------------------------------------------------------
//SECOND WIP Create a spot
    //REQUIRE AUTH: TRUE
    router.post('/', requireAuth, validateSpot, async (req, res, next) => {

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

            //retrieve current location owner from req.user object
                //must be ownerId because it could be used to associate a spot with its owner
                    //if a user is the owner of a spot, they may have certain permissions that non-owners do not have
                        //such as the abilty to edit or delete a spot
            const ownerId = req.user.id

            //create new location
            const Location = await Spot.create({ownerId, address, city, state, country, lat, lng, name, description, price})

            if (Location) {
                //convert lat, lng, and price to floats using parseFloat (this is so we get numbers in responses from live postman requests)
                let loc = Location.toJSON();
                const lat = parseFloat(loc.lat);
                const lng = parseFloat(loc.lng);
                const price = parseFloat(loc.price);

                //return 201 with JSON of new location
                return res.status(200).json({
                    id: loc.id,
                    ownerId: loc.ownerId,
                    address: loc.address,
                    city: loc.city,
                    state: loc.state,
                    country: loc.country,
                    lat,
                    lng,
                    name: loc.name,
                    description: loc.description,
                    price,
                    createdAt: loc.createdAt,
                    updatedAt: loc.updatedAt
                })
            }
    })

//-------------------------------------------------------------------------------------------------

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

//Get all reviews by a spot's id
    //REQUIRE AUTH: FALSE
router.get('/:spotId/reviews', async (req, res) => {
    //extract spotId from params
    const spotId = req.params.spotId;

    //obtain reviews for this spotId and include Users and ReviewImages
    const reviews = await Review.findAll({
        where: {
            spotId
        },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ],
        group: ['Review.id', 'User.id', 'ReviewImages.id']
    })

    //put these reviews in an array
    const spotReviews = reviews.map((rev) => ({
        id: rev.id,
        userId: rev.userId,
        spotId: rev.spotId,
        review: rev.review,
        stars: rev.stars,
        createdAt: rev.createdAt,
        updatedAt: rev.updatedAt,
        User: rev.User,
        ReviewImages: rev.ReviewImages
    }))

    //if there have been reviews retreived for this spot, return status 200 with json
    if (spotReviews.length > 0) return res.status(200).json({Reviews: spotReviews})

    //if no reviews were found for this spot, return a 404 with specific message
    return res.status(404).json({
        message: "Spot couldn't be found",
        statusCode: 404
    })
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
    if (spot.ownerId === userId) return res.status(403).json({
        message: "Forbidden: Sorry, since you own the spot, you cannot create bookings for it",
        statusCode: 403
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
        return res.status(200).json({Bookings: bookings})
    }
})

module.exports = router;
