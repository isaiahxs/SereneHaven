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
        startDate: '1-1-2001',
        endDate: '1-2-2001'
      },
      {
        spotId: 2,
        userId: 2,
        startDate: '2-2-2002',
        endDate: '2-3-2002'
      },
      {
        spotId: 3,
        userId: 3,
        startDate: '3-3-2003',
        endDate: '3-4-2003'
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
