'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReviewImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ReviewImage.belongsTo(models.Review, {
        foreignKey: 'reviewId',
        onDelete: 'cascade'
      })
    }
  }
  ReviewImage.init({
    url: DataTypes.TEXT,
    reviewId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ReviewImage',
  });
  return ReviewImage;
};
