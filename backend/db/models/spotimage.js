'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SpotImage.belongsTo(models.Spot, {
        foreignKey: 'spotId',
        //is this part necessary
        // onDelete: 'cascade'
      })
    }
  }
  SpotImage.init({
    spotId: {type: DataTypes.INTEGER},
    url: {type: DataTypes.TEXT},
    preview: {type: DataTypes.BOOLEAN}
  }, {
    sequelize,
    modelName: 'SpotImage',
  });
  return SpotImage;
};
