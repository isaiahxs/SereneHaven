const express = require('express')
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Spot, SpotImage, Review, Favorite } = require('../../db/models');

//following two lines are from phase 5
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

//ADDED OP IN REQUIRE
const { Model, Sequelize, Op, DataTypes } = require('sequelize');
const booking = require('../../db/models/booking');

//get all favorite spots for the current user
//REQUIRE AUTH: TRUE
router.get('/', requireAuth, async (req, res, next) => {
    //find all favorite spots that belong to the authenticated user
    const userFavorites = await Favorite.findAll({
        //filter favorites by authenticated user's id
        where: { userId: req.user.id },
        //specify models to eager load, including the Spot model to get details about each favorite spot
        include: [
            {
                model: Spot,
                include: [
                    {
                        model: Review,
                        attributes: ["stars"]
                    },
                    {
                        model: SpotImage,
                        as: 'spotImages',
                        attributes: ["url"]
                    }
                ]
            }
        ],
    })

    if (userFavorites && userFavorites.length > 0) {
        const favorites = userFavorites.map((favorite) => {
            const spot = favorite.Spot;
            const reviews = spot.Reviews || [];
            const sumRatings = reviews.reduce((acc, cur) => acc + cur.stars, 0);

            let avgRating;
            if (reviews.length > 0) {
                avgRating = sumRatings / reviews.length;
            } else {
                avgRating = null;
            }

            const lat = parseFloat(spot.lat);
            const lng = parseFloat(spot.lng);
            const price = parseFloat(spot.price);

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
                previewImage: spot.spotImages[0]?.url || null
            }
        });
        return res.status(200).json({ favorites });
    }

    res.status(404).json({ 'message': 'This user did not have any favorite spots' });
});

//POST route to favorite a spot based on its id
router.post('/:spotId', requireAuth, async (req, res, next) => {
    //get the spot ID from the request parameters
    const spotId = parseInt(req.params.spotId, 10);

    //get the user ID from the authenticated user
    const userId = req.user.id;

    //check if the favorite already exists for this user and spot
    const existingFavorite = await Favorite.findOne({
        where: { userId, spotId }
    });

    if (existingFavorite) {
        return res.status(400).json({ message: 'This spot is already in your favorites' });
    }

    //create the new favorite
    const newFavorite = await Favorite.create({
        userId,
        spotId
    });

    //return the new favorite
    return res.status(201).json({ newFavorite });
});

module.exports = router;