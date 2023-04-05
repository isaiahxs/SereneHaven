'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 1,
        startDate: '2025-01-01',
        endDate: '2025-01-02'
      },
      {
        spotId: 2,
        userId: 2,
        startDate: '2025-02-02',
        endDate: '2025-02-03'
      },
      {
        spotId: 3,
        userId: 3,
        startDate: '2025-03-03',
        endDate: '2025-03-04'
      },
      {
        spotId: 4,
        userId: 4,
        startDate: '2025-04-04',
        endDate: '2025-04-05'
      },
      {
        spotId: 5,
        userId: 5,
        startDate: '2025-05-05',
        endDate: '2025-05-06'
      },
      {
        spotId: 6,
        userId: 1,
        startDate: '2025-06-06',
        endDate: '2025-06-07'
      },
      {
        spotId: 7,
        userId: 2,
        startDate: '2025-07-07',
        endDate: '20025-07-08'
      },
      {
        spotId: 8,
        userId: 3,
        startDate: '2025-08-08',
        endDate: '2025-08-09'
      },
      {
        spotId: 9,
        userId: 4,
        startDate: '2025-09-09',
        endDate: '2025-09-10'
      },
      {
        spotId: 10,
        userId: 5,
        startDate: '2025-10-10',
        endDate: '2025-10-11'
      }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
    })
  }
};
