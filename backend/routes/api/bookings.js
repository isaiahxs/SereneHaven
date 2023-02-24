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

//FIRST WIP
//Get all of the current user's bookings
    //REQUIRE AUTH: TRUE
// router.get('/current', requireAuth, async (req, res, next) => {
//     //if current user is authorized, return status 200 with json of bookings
//     //retrieve current user
//     const currentUser = req.user.id;

//     const userBookings = await Booking.findAll({
//         where: {
//             userId: currentUser
//         },
//         attributes: ['id', 'spotId', 'userId', 'startDate', 'endDate', 'createdAt', 'updatedAt']
//     })

//     for (let booking of userBookings) {
//         const spot = await Spot.findOne({
//             where: {
//                 ownerId: currentUser
//             },
//             attributes: [
//                 'id',
//                 'ownerId',
//                 'address',
//                 'city',
//                 'state',
//                 'country',
//                 'lat',
//                 'lng',
//                 'name',
//                 'price'
//                 //HOW CAN I RETURN PREVIEWIMAGE HERE
//                 // [Sequelize.fn('MAX', Sequelize.col('SpotImages.url')), 'previewImage']
//             ],
//             //SOMETHING LIKE THIS, LOOK AT HOW I DID IT IN REVIEWS.JS
//             // include: [
//             //     {
//             //         model: SpotImage,
//             //         attributes: ['url']
//             //     }
//             // ]
//         })
//         booking.dataValues.Spot = spot
//     }
//     return res.status(200).json({Bookings: userBookings});
// })

//SECOND WIP FOR GET CURRENT USER'S BOOKINGS
    //FOLLOWED SIMILAR STYLE AS REVIEWS.JS AND IT WORKS!
router.get('/current', requireAuth, async (req, res, next) => {
    const currentUser = req.user.id;
    const userBookings = await Booking.findAll({
      where: {
        userId: currentUser,
      },
      include: [
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
            'price',
          ],
          include: [
            {
              model: SpotImage,
              attributes: ['url'],
              limit: 1,
            },
          ],
        },
      ],
      attributes: ['id', 'spotId', 'userId', 'startDate', 'endDate', 'createdAt', 'updatedAt'],
    });

    //TESTING SIMILAR STYLE TO REVIEWS.JS
    if (userBookings) {
        const bookings = userBookings.map((booking) => {
            //convert each booking model into plain JS object with toJSON
            //destructure and extract only necessary properties
            const {id, spotId, userId, startDate, endDate, createdAt, updatedAt, Spot} = booking.toJSON();

            let previewImage = null;
            if (Spot.SpotImages.length > 0) {
                previewImage = Spot.SpotImages[0].url;
            } else {
                previewImage = null;
            }

            //return the order you want the response body in
            return {
                id, spotId, userId, startDate, endDate, createdAt, updatedAt, Spot: {
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
                }
            }
        })
        return res.status(200).json({ Bookings: bookings });
    }
    return res.status(404).json({
        message: "Reviews couldn't be found"
    })
  });



module.exports = router;
