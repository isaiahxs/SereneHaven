'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: 'https://a0.muscache.com/im/pictures/prohost-api/Hosting-549139249395273435/original/ed7f1dbc-e834-478e-974d-0bea94926f0b.jpeg?im_w=960',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://a0.muscache.com/im/pictures/prohost-api/Hosting-549139249395273435/original/27259071-06af-410f-ad25-7778d9aae4b1.jpeg?im_w=480',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://a0.muscache.com/im/pictures/prohost-api/Hosting-549139249395273435/original/6ab06611-53b2-494e-8513-c6908d8bf6fe.jpeg?im_w=480',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://a0.muscache.com/im/pictures/prohost-api/Hosting-549139249395273435/original/eff9096f-51f0-465d-97bc-fdb85bbd1bbe.jpeg?im_w=480',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://a0.muscache.com/im/pictures/prohost-api/Hosting-549139249395273435/original/5a0ccf68-6421-46eb-a85d-644e8489fb9b.jpeg?im_w=480',
        preview: true
      },
      {
        spotId: 2,
        url: 'www.abnb/spot-images/nyc.com',
        preview: true
      },
      {
        spotId: 3,
        url: 'www.abnb/spot-images/la.com',
        preview: true
      }
    ], {}) //DON'T FORGET TO PASS IN THE OPTIONS OBJECT
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3]}
    }, {}) //DON'T FORGET TO PASS IN THE OPTIONS OBJECT
  }
};
