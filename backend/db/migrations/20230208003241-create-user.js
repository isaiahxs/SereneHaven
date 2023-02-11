//My original WIP
// 'use strict';
// // /** @type {import('sequelize-cli').Migration} */

// let options = {};
// if (process.env.NODE_ENV === 'production') {
//   options.schema = process.env.SCHEMA;  // define your schema in options object
// }

// module.exports = {
//   async up(queryInterface, Sequelize) {
//     await queryInterface.createTable('Users', {
//       id: {
//         //not null, primary key
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true,
//         type: Sequelize.INTEGER
//       },
//       username: {
//         //not null, indexed, unique, max 30 chars
//         type: Sequelize.STRING(30),
//         allowNull: false,
//         unique: true,
//       },
//       email: {
//         //not null, indexed, unique, max 256 chars
//         type: Sequelize.STRING(256),
//         allowNull: false,
//         unique: true,
//       },
//       hashedPassword: {
//         //not null
//         type: Sequelize.STRING,
//         allowNull: false,
//       },
//       createdAt: {
//         //not null, default value of now()
//         allowNull: false,
//         type: Sequelize.DATE,
//         defaultValue: Sequelize.NOW
//       },
//       updatedAt: {
//         //not null, default value of now()
//         allowNull: false,
//         type: Sequelize.DATE,
//         defaultValue: Sequelize.NOW
//       }
//     }, options);
//   },
//   async down(queryInterface, Sequelize) {
//     await queryInterface.dropTable('Users', options);
//   }
// };

//ReadMe code
"use strict";
/** @type {import('sequelize-cli').Migration} */


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true
      },
      email: {
        type: Sequelize.STRING(256),
        allowNull: false,
        unique: true
      },
      hashedPassword: {
        type: Sequelize.STRING.BINARY,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, options);
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Users", options);
  }
};
