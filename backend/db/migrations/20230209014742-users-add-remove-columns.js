'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
  options.tableName = 'Users';
}

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    //add firstName column
    await queryInterface.addColumn(options, 'firstName', {
      type: Sequelize.STRING
    })

    await queryInterface.addColumn(options, 'lastName', {
      type: Sequelize.STRING
    })

    //add lastName column
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    //remove firstName
    await queryInterface.removeColumn(options, 'firstName');

    //remove lastName
    await queryInterface.removeColumn(options, 'lastName');
  }
};


//This code will set up the options object differently based on whether the application is in production or not. If it's in production, it will set the schema and tableName properties in the options object. This way, when the addColumn and removeColumn methods are called, they will use the options object as the first argument, which will specify the table and schema to operate on.
