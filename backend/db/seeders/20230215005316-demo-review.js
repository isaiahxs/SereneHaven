'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        spotId: 2,
        review: 'I loved my stay here. The views were amazing and the location was perfect.',
        stars: 4
      },
      {
        userId: 2,
        spotId: 3,
        review: 'This place was stunning. The interior design was immaculate and the location was perfect for exploring the city.',
        stars: 5
      },
      {
        userId: 3,
        spotId: 4,
        review: 'This spot was exactly what I was looking for. It was quiet, peaceful, and surrounded by nature.',
        stars: 5
      },
      {
        userId: 4,
        spotId: 5,
        review: 'This spot exceeded my expectations. The amenities were top-notch and the location was perfect for a relaxing getaway.',
        stars: 5
      },
      {
        userId: 5,
        spotId: 6,
        review: 'I had a great time staying here. The location was perfect for exploring the city and the amenities were great.',
        stars: 4
      },
      {
        userId: 1,
        spotId: 7,
        review: 'This spot was perfect for my needs. It was clean, cozy, and located in a great area.',
        stars: 4
      },
      {
        userId: 2,
        spotId: 8,
        review: 'I loved staying at this spot. The location was perfect and the amenities were great.',
        stars: 5
      },
      {
        userId: 3,
        spotId: 9,
        review: 'This spot was exactly what I needed. It was quiet, peaceful, and located in a great area.',
        stars: 4
      },
      {
        userId: 4,
        spotId: 10,
        review: 'I had a great time staying at this spot. The location was perfect and the amenities were great.',
        stars: 4
      },
      {
        userId: 5,
        spotId: 1,
        review: 'This spot was amazing. The location was perfect and the views were breathtaking.',
        stars: 5
      }
    ], {}) //DON'T FORGET TO PASS IN THE OPTIONS OBJECT
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
    }, {}) //DON'T FORGET TO PASS IN THE OPTIONS OBJECT
  }
};
