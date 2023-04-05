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
      address: '100 Ocean Dr',
      city: 'Miami Beach',
      state: 'Florida',
      country: 'USA',
      lat: 25.7841,
      lng: -80.1314,
      name: 'Oceanfront Oasis',
      description: 'Luxury condo with stunning ocean views',
      price: 300.00
    },
    {
      ownerId: 2,
      address: '432 Park Ave',
      city: 'New York City',
      state: 'New York',
      country: 'USA',
      lat: 40.7648,
      lng: -73.9742,
      name: 'Park Avenue Penthouse',
      description: 'Sprawling duplex with panoramic city views',
      price: 400.00
    },
    {
      ownerId: 3,
      address: '555 W 5th St',
      city: 'Los Angeles',
      state: 'California',
      country: 'USA',
      lat: 34.0502,
      lng: -118.2562,
      name: 'Downtown Dream',
      description: 'Chic loft in the heart of the city',
      price: 300.00
    },
    {
      ownerId: 4,
      address: '123 Main St',
      city: 'Houston',
      state: 'Texas',
      country: 'USA',
      lat: 29.7604,
      lng: -95.3698,
      name: 'Space City',
      description: 'Experience NASA and Space Center Houston',
      price: 250.00
    },
    {
      ownerId: 5,
      address: '456 Oak St',
      city: 'Seattle',
      state: 'Washington',
      country: 'USA',
      lat: 47.6062,
      lng: -122.3321,
      name: 'Emerald City',
      description: 'Visit the Space Needle and Pike Place Market',
      price: 400.00
    },
    {
      ownerId: 1,
      address: '789 Elm St',
      city: 'Nashville',
      state: 'Tennessee',
      country: 'USA',
      lat: 36.1627,
      lng: -86.7816,
      name: 'Music City',
      description: 'Experience country music and southern hospitality',
      price: 300.00
    },
    {
      ownerId: 2,
      address: '1011 Pine St',
      city: 'Miami',
      state: 'Florida',
      country: 'USA',
      lat: 25.7617,
      lng: -80.1918,
      name: 'Magic City',
      description: 'Enjoy beaches, nightlife, and Cuban food',
      price: 250.00
    },
    {
      ownerId: 3,
      address: '1213 Maple St',
      city: 'Boston',
      state: 'Massachusetts',
      country: 'USA',
      lat: 42.3601,
      lng: -71.0589,
      name: 'Beantown',
      description: 'Discover history, culture, and seafood',
      price: 280.00
    },
    {
      ownerId: 4,
      address: '1415 Oak St',
      city: 'New Orleans',
      state: 'Louisiana',
      country: 'USA',
      lat: 29.9511,
      lng: -90.0715,
      name: 'The Big Easy',
      description: 'Experience jazz, Cajun cuisine, and Mardi Gras',
      price: 220.00
    },
    {
      ownerId: 5,
      address: '1617 Pine St',
      city: 'San Francisco',
      state: 'California',
      country: 'USA',
      lat: 37.7749,
      lng: -122.4194,
      name: 'The City by the Bay',
      description: 'Visit the Golden Gate Bridge and Alcatraz Island',
      price: 280.00
    }
   ], {}) //REMEMBER TO PASS IN OPTION OBJECT
  },

  //think in the Op.in here, i will have to change it from state to something else because i think if i have multiple locations in the same state, it might delete all of the ones with the same state name?
  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Oceanfront Oasis', 'Park Avenue Penthouse', 'Downtown Dream', 'Space City', 'Emerald City', 'Music City', 'Magic City', 'Beantown', 'The Big Easy', 'The City by the Bay']}
    }, {}) //REMEMBER TO PASS IN OPTION OBJECT
  }
};
