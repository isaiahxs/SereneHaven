'use strict';

/** @type {import('sequelize-cli').Migration} */
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
    })

    await queryInterface.addColumn("Users", 'lastName', {
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
    await queryInterface.removeColumn('Users', 'firstName');

    //remove lastName
    await queryInterface.removeColumn('Users', 'lastName');
  }
};
