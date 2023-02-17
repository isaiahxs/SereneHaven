'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.belongsTo(models.User, {
        foreignKey: 'ownerId',
        // WAS THIS MY ERROR?
        // onDelete: 'cascade'
      })

      Spot.hasMany(models.SpotImage, {
        foreignKey: 'spotId'
      })

      Spot.hasMany(models.Review, {
        foreignKey: 'spotId'
      })

      Spot.hasMany(models.Booking, {
        foreignKey: 'spotId'
      })
    }

    //WIP for Preview Image
    // async getPreviewImage() {
    //   const image = await SpotImage.findOne({
    //     where: {spotId: this.id, preview:true},
    //     attributes: ['url']
    //   })
    //   return image ? image.url : null;
    // }
      //Then, in your route handler, you can call spot.getPreviewImage() to get the URL of the spot's preview image.
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lat: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    lng: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Spot',
    defaultScope: {
      include: [
        {
          model: sequelize.models.Review,
          attributes: [
            [Sequelize.fn('AVG', Sequelize.col('stars')), 'avgRating']
          ]
        }
      ]
    }
  });
  return Spot;
};




//--------------------------------------------------
//this was my original Spot model before I started tweaking with it to add default scopes:
// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class Spot extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//       Spot.belongsTo(models.User, {
//         foreignKey: 'ownerId',
//         // WAS THIS MY ERROR?
//         // onDelete: 'cascade'
//       })

//       Spot.hasMany(models.SpotImage, {
//         foreignKey: 'spotId'
//       })

//       Spot.hasMany(models.Review, {
//         foreignKey: 'spotId'
//       })

//       Spot.hasMany(models.Booking, {
//         foreignKey: 'spotId'
//       })
//     }
//   }
//   Spot.init({
//     ownerId: {
//       type: DataTypes.INTEGER,
//     },
//     address: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     city: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     state: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     country: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     lat: {
//       type: DataTypes.DECIMAL,
//       allowNull: false
//     },
//     lng: {
//       type: DataTypes.DECIMAL,
//       allowNull: false
//     },
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     description: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     price: {
//       type: DataTypes.DECIMAL,
//       allowNull: false
//     }
//   }, {
//     sequelize,
//     modelName: 'Spot',
//   });
//   return Spot;
// };
