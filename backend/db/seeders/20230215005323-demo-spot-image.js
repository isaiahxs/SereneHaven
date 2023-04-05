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
      //https://www.airbnb.com/rooms/683194252577702880?adults=1&category_tag=Tag%3A8536&children=0&enable_m3_private_room=false&infants=0&pets=0&search_mode=flex_destinations_search&check_in=2023-04-16&check_out=2023-04-22&federated_search_id=54f8551e-e2bf-44b4-95ce-531c7231f00f&source_impression_id=p3_1680697164_Cq3OAZ0437bhvMbl
      {
        spotId: 2,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-683194252577702880/original/c3cc9e96-c34d-42db-9ffe-c5d2b0738f7e.jpeg?im_w=1200',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-683194252577702880/original/03252d98-6223-4673-abe7-098a5b69b3cd.jpeg?im_w=720',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-683194252577702880/original/1d775f85-3317-4553-82b1-e82cec4e0017.jpeg?im_w=720',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-683194252577702880/original/272dadb7-e2f0-4823-b7ec-80a7c30ff88e.jpeg?im_w=720',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-683194252577702880/original/45efdd2d-ccdc-46b1-8ed9-0cc599b29f5c.jpeg?im_w=720',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-639959331064027836/original/1ff6f3aa-a449-469f-8f77-5d2f65dc4b50.jpeg?im_w=960',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-639959331064027836/original/b34d8b9d-81a9-4e35-a256-526d5aa8440e.jpeg?im_w=480',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-639959331064027836/original/0ff55dec-8e04-4334-90a3-88fb755dd448.jpeg?im_w=720',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-639959331064027836/original/baf20e48-dbaf-4fff-a92a-540b0aa41968.jpeg?im_w=720',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-639959331064027836/original/1a27f1b9-f9b5-4f07-a486-aa973b862a08.jpeg?im_w=720',
        preview: true
      },
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
