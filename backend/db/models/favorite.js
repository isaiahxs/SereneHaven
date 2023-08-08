'use strict';
const {
    Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Favorite extends sequelize.Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Favorite.belongsTo(models.User, { foreignKey: 'userId' });
            Favorite.belongsTo(models.Spot, { foreignKey: 'spotId' });
        }
    }
    Favorite.init({
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        spotId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Spots',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'Favorite',
    });
    return Favorite;
};