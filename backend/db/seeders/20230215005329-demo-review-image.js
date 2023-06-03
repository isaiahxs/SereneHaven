'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    return queryInterface.bulkInsert(options, [
      {
        url: 'www.serene-stay/review-images/miami.com',
        reviewId: 1
      },
      {
        url: 'www.serene-stay/review-images/nyc.com',
        reviewId: 2
      },
      {
        url: 'www.serene-stay/review-images/la.com',
        reviewId: 3
      }
    ], {}) //DON'T FORGET TO PASS IN THE OPTIONS OBJECT
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [1, 2, 3]}
    }, {}) //DON'T FORGET TO PASS IN THE OPTIONS OBJECT
  }
};
