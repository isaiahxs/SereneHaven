'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
   //create demo spots with the columns
   options.tableName = 'Spots';
   return queryInterface.bulkInsert(options, [
    {
      ownerId: 1,
      address: '1 street',
      city: 'miami',
      state: 'florida',
      country: 'usa',
      lat: 1.0,
      lng: 1.0,
      name: 'vice city',
      description: 'sunny',
      price: 1000000.00
    },
    {
      ownerId: 2,
      address: '2 street',
      city: 'nyc',
      state: 'new york',
      country: 'usa',
      lat: 2.0,
      lng: 2.0,
      name: 'rat city',
      description: 'the big apple',
      price: 2000000.00
    },
    {
      ownerId: 3,
      address: '3 street',
      city: 'los angeles',
      state: 'california',
      country: 'usa',
      lat: 3.0,
      lng: 3.0,
      name: 'traffic congestion',
      description: 'smog',
      price: 3000000.00
    }
   ], {}) //REMEMBER TO PASS IN OPTION OBJECT
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      state: { [Op.in]: ['florida', 'new york', 'california']}
    }, {}) //REMEMBER TO PASS IN OPTION OBJECT
  }
};
