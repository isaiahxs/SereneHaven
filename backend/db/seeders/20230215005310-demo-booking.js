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
        startDate: '2001-01-01',
        endDate: '2001-01-02'
      },
      {
        spotId: 2,
        userId: 2,
        startDate: '2002-02-02',
        endDate: '2002-02-03'
      },
      {
        spotId: 3,
        userId: 3,
        startDate: '2003-03-03',
        endDate: '2003-03-04'
      }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3]}
    })
  }
};
