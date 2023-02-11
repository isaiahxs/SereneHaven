'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
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
    await queryInterface.addColumn('Users', 'firstName', {
      type: Sequelize.STRING
    }, options)

    await queryInterface.addColumn("Users", 'lastName', {
      type: Sequelize.STRING
    }, options)

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
    await queryInterface.removeColumn('Users', 'firstName', options);

    //remove lastName
    await queryInterface.removeColumn('Users', 'lastName', options);
  }
};
