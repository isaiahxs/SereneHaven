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
        url: 'https://a0.muscache.com/im/pictures/prohost-api/Hosting-549139249395273435/original/ed7f1dbc-e834-478e-974d-0bea94926f0b.jpeg?im_w=1200',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://a0.muscache.com/im/pictures/prohost-api/Hosting-549139249395273435/original/27259071-06af-410f-ad25-7778d9aae4b1.jpeg?im_w=1200',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://a0.muscache.com/im/pictures/prohost-api/Hosting-549139249395273435/original/6ab06611-53b2-494e-8513-c6908d8bf6fe.jpeg?im_w=1200',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://a0.muscache.com/im/pictures/prohost-api/Hosting-549139249395273435/original/eff9096f-51f0-465d-97bc-fdb85bbd1bbe.jpeg?im_w=1200',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://a0.muscache.com/im/pictures/prohost-api/Hosting-549139249395273435/original/5a0ccf68-6421-46eb-a85d-644e8489fb9b.jpeg?im_w=1200',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-683194252577702880/original/c3cc9e96-c34d-42db-9ffe-c5d2b0738f7e.jpeg?im_w=1200',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-683194252577702880/original/03252d98-6223-4673-abe7-098a5b69b3cd.jpeg?im_w=1200',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-683194252577702880/original/1d775f85-3317-4553-82b1-e82cec4e0017.jpeg?im_w=1200',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-683194252577702880/original/272dadb7-e2f0-4823-b7ec-80a7c30ff88e.jpeg?im_w=1200',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-683194252577702880/original/45efdd2d-ccdc-46b1-8ed9-0cc599b29f5c.jpeg?im_w=1200',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-639959331064027836/original/1ff6f3aa-a449-469f-8f77-5d2f65dc4b50.jpeg?im_w=1200',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-639959331064027836/original/b34d8b9d-81a9-4e35-a256-526d5aa8440e.jpeg?im_w=1200',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-639959331064027836/original/0ff55dec-8e04-4334-90a3-88fb755dd448.jpeg?im_w=1200',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-639959331064027836/original/baf20e48-dbaf-4fff-a92a-540b0aa41968.jpeg?im_w=1200',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-639959331064027836/original/1a27f1b9-f9b5-4f07-a486-aa973b862a08.jpeg?im_w=1200',
        preview: false
      },
      {
        spotId: 4,
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-593627159555355698/original/3f1d5a52-d09a-41fa-9084-90612a44e217.jpeg?im_w=1200",
        preview: true
      },
      {
        spotId: 4,
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-593627159555355698/original/5ac63fde-0922-4376-ac52-48ee912510b7.jpeg?im_w=1200",
        preview: false
      },
      {
        spotId: 4,
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-593627159555355698/original/b2cd1569-fe2a-42a6-94ea-f9f8eefdcb3c.jpeg?im_w=1200",
        preview: false
      },
      {
        spotId: 4,
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-593627159555355698/original/da9bd3c5-5e2d-479a-aff1-0a1240409803.jpeg?im_w=1200",
        preview: false
      },
      {
        spotId: 4,
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-593627159555355698/original/b59a8e44-a251-4562-8bb3-ae44561e4915.jpeg?im_w=1200",
        preview: false
      },
      {
        spotId: 5,
        url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-37889645/original/a1204fd9-a5ea-46f4-b198-fc769406b99d.jpeg?im_w=1200",
        preview: true
      },
      {
        spotId: 5,
        url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-37889645/original/931868b1-cdde-45c7-97f0-9ac6e6fc70f0.jpeg?im_w=1200",
        preview: false
      },
      {
        spotId: 5,
        url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-37889645/original/ad7fd273-bdbb-41a1-8652-5ff2f5e04d8a.jpeg?im_w=1200",
        preview: false
      },
      {
        spotId: 5,
        url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-37889645/original/eaabad0a-535b-400e-8370-0367bb2c2ea2.jpeg?im_w=1200",
        preview: false
      },
      {
        spotId: 5,
        url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-37889645/original/945cb53d-6876-49ce-92b6-561593f8eecd.jpeg?im_w=1200",
        preview: false
      },
      {
        spotId: 6,
        url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-54227245/original/e13f3295-6e3d-489c-b705-e268e81a37ab.jpeg?im_w=1200",
        preview: true
      },
      {
        spotId: 6,
        url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-54227245/original/86f6ca77-e065-47dd-a43c-d2a21a8ff60c.jpeg?im_w=1200",
        preview: false
      },
      {
        spotId: 6,
        url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-54227245/original/99159512-82ca-4db9-a8c5-6d5533a812b6.jpeg?im_w=1200",
        preview: false
      },
      {
        spotId: 6,
        url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-54227245/original/eb78959a-7135-4955-946f-293525af0c1d.jpeg?im_w=1200",
        preview: false
      },
      {
        spotId: 6,
        url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-54227245/original/1b03b6f6-08af-452a-8e28-859e425786b5.jpeg?im_w=1200",
        preview: false
      },
      {
        spotId: 7,
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-789106883669530972/original/369a6c84-a0f5-4a7e-a8be-4a3653c0dda2.jpeg?im_w=1200",
        preview: true
      },
      {
        spotId: 7,
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-789106883669530972/original/13feb757-d04c-4c45-b6b3-b793abf9865b.jpeg?im_w=1200",
        preview: false
      },
      {
        spotId: 7,
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-789106883669530972/original/1ae366c5-f13b-43a8-9501-bc8d55d3622d.jpeg?im_w=1200",
        preview: false
      },
      {
        spotId: 7,
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-789106883669530972/original/584c1ae4-67df-46ec-9a98-29957455f01f.jpeg?im_w=1200",
        preview: false
      },
      {
        spotId: 7,
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-789106883669530972/original/54c0a8cd-dd4f-464c-bc10-9d0cfbcbb2ea.jpeg?im_w=1200",
        preview: false
      },
      {
        spotId: 8,
        url: "https://a0.muscache.com/im/pictures/beaf189e-8645-4b71-9456-8436cc73bb09.jpg?im_w=1200",
        preview: true
      },
      {
        spotId: 8,
        url: "https://a0.muscache.com/im/pictures/d0d2a442-fc5d-4279-8fe8-ab8cdf2b4856.jpg?im_w=1200",
        preview: false
      },
      {
        spotId: 8,
        url: "https://a0.muscache.com/im/pictures/31f782d3-d04f-425f-9e1f-b36558086213.jpg?im_w=1200",
        preview: false
      },
      {
        spotId: 8,
        url: "https://a0.muscache.com/im/pictures/97600e92-41c9-4c1b-b1b7-ae7199c43c8b.jpg?im_w=1200",
        preview: false
      },
      {
        spotId: 8,
        url: "https://a0.muscache.com/im/pictures/4f32a721-a4ba-4ff5-8679-eaa012d484d2.jpg?im_w=1200",
        preview: false
      },
      {
        spotId: 9,
        url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-750089121447866329/original/8915b146-d2fd-4317-bc8e-a278f4ed4ed6.jpeg?im_w=1200",
        preview: true
      },
      {
        spotId: 9,
        url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-750089121447866329/original/7361bc1c-f50e-499c-9b38-71ce9e58d372.jpeg?im_w=1200",
        preview: false
      },
      {
        spotId: 9,
        url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-750089121447866329/original/9483d835-7682-4e1c-ac82-f4b2d6d26f90.jpeg?im_w=1200",
        preview: false
      },
      {
        spotId: 9,
        url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-750089121447866329/original/9d193550-a53d-410f-8956-e029abbfbba0.jpeg?im_w=1200",
        preview: false
      },
      {
        spotId: 9,
        url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-750089121447866329/original/3eac1b85-d34a-446c-a745-c7565b240db9.jpeg?im_w=1200",
        preview: false
      },
      {
        spotId: 10,
        url: "https://a0.muscache.com/im/pictures/7db0c6fb-cb92-4c44-bae6-c6f4facbf9fe.jpg?im_w=1200",
        preview: true
      },
      {
        spotId: 10,
        url: "https://a0.muscache.com/im/pictures/33be7d94-feeb-4eef-a57a-ff3e9b1a549a.jpg?im_w=1200",
        preview: false
      },
      {
        spotId: 10,
        url: "https://a0.muscache.com/im/pictures/35e98eab-189b-4739-869d-2be936753fba.jpg?im_w=1200",
        preview: false
      },
      {
        spotId: 10,
        url: "https://a0.muscache.com/im/pictures/94046128-4b41-48cf-bcb6-5c927c8d41d5.jpg?im_w=1200",
        preview: false
      },
      {
        spotId: 10,
        url: "https://a0.muscache.com/im/pictures/b6017d67-eb3b-4bb0-bcae-f697de4fb5a2.jpg?im_w=1200",
        preview: false
      },
      {
        spotId: 11,
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-770973493232809347/original/0b6714ab-69e3-4af1-80c1-e0926f6bc9a4.jpeg?im_w=1200",
        preview: true
      },
      {
        spotId: 11,
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-770973493232809347/original/45aa3858-9f35-4a4b-af84-e727082521e4.jpeg?im_w=1200",
        preview: false
      },
      {
        spotId: 11,
        url: "https://a0.muscache.com/im/pictures/91205299-ed08-4aac-95a2-978d54617572.jpg?im_w=1200",
        preview: false
      },
      {
        spotId: 11,
        url: "https://a0.muscache.com/im/pictures/e282e036-afb9-4888-ba4c-5d1cd0fcef0f.jpg?im_w=1200",
        preview: false
      },
      {
        spotId: 11,
        url: "https://a0.muscache.com/im/pictures/65c14384-60bf-47e9-be19-452c62e75304.jpg?im_w=1200",
        preview: false
      },
      {
        spotId: 12,
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-868466610221935716/original/34f6b1a4-0110-4a84-a82c-43983054ed48.jpeg?im_w=1200",
        preview: true
      },
      {
        spotId: 12,
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-868466610221935716/original/8c4082e0-c971-4921-a548-924f4dcaef95.jpeg?im_w=1200",
        preview: false
      },
      {
        spotId: 12,
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-868466610221935716/original/b0e046f5-811f-47b4-a26f-c1c4709aa9db.jpeg?im_w=1200",
        preview: false
      },
      {
        spotId: 12,
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-868466610221935716/original/2c5188ca-91c8-40f6-a6c1-0b51bee22a8b.png?im_w=1200",
        preview: false
      },
      {
        spotId: 12,
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-868466610221935716/original/e7594850-3b29-4b63-9bf0-0fcc503f95bd.jpeg?im_w=1200",
        preview: false
      },
    ], {}) //DON'T FORGET TO PASS IN THE OPTIONS OBJECT
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
    }, {}) //DON'T FORGET TO PASS IN THE OPTIONS OBJECT
  }
};
