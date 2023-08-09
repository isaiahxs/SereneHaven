'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
    options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
    async up(queryInterface, Sequelize) {
        const userId = 6;
        const spotIds = [1, 3, 5, 7, 12];

        const favorites = spotIds.map((spotId) => ({
            userId: userId,
            spotId: spotId,
        }));

        options.tableName = 'Favorites';
        return queryInterface.bulkInsert(options, favorites, {});
    },

    async down(queryInterface, Sequelize) {
        const Op = Sequelize.Op;

        options.tableName = 'Favorites';
        return queryInterface.bulkDelete(options, {
            userId: { [Op.eq]: 6 },
        }, {});
    }
};