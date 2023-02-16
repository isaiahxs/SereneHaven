'use strict';

const bcrypt = require('bcryptjs')

const {
  Model, Validator
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    //Define an instance method toSafeObject in the user.js model file. This method will return an object with only the User instance information that is safe to save to a JWT, like id, username, and email.
    toSafeObject() {
      const {id, username, email, firstName, lastName} = this; //context will be the User instance
      return {id, username, email, firstName, lastName};
    }

    //Define an instance method validatePassword in the user.js model file. It should accept a password string and return true if there is a match with the User instance's hashedPassword. If there is no match, it should return false.
    validatePassword(password) {
      return bcrypt.compareSync(password, this.hashedPassword.toString());
    }

    //Defining static method login
    static async login({ credential, password }) {
      const { Op } = require('sequelize');
      const user = await User.scope('loginUser').findOne({
        where: {
          [Op.or]: {
            username: credential,
            email: credential
          }
        }
      });
      if (user && user.validatePassword(password)) {
        return await User.scope('currentUser').findByPk(user.id);
      }
    }

    //Defining static method signup
    static async signup({ username, email, password, firstName, lastName }) {
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({
        username,
        email,
        hashedPassword,
        firstName,
        lastName
      });
      return await User.scope('currentUser').findByPk(user.id);
    }

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Spot, {
        foreignKey: 'ownerId',
        //could this have been the error?
        // onDelete: 'cascade'
      })

      User.hasMany(models.Booking, {
        foreignKey: 'userId',
        //could this have been the error?
        // onDelete: 'cascade'
      })

      User.hasMany(models.Reviews, {
        foreignKey: 'userId',
        //could this have been the error?
        // onDelete: 'cascade'
      })
    }
  }
  User.init({

    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    //not null, unique, min 4 chars, max 30 chars, isNotEmail
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4, 30],
        isNotEmail(value) {
          if (Validator.isEmail(value)) {
            throw new Error('Cannot be an email.');
          }
        }
      }
    },
    //not null, unique, min 3 chars, max 256 chars, isEmail
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 256],
        isEmail: true
      }
    },
    //not null, min and max 60 chars
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
      validate: {
        len: [60, 60]
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {
        exclude: ['hashedPassword', 'email', 'createdAt', 'updatedAt']
      }
    },
    scopes: {
      currentUser: {
        attributes: {exclude: ['hashedPassword']}
      },
      loginUser: {
        attributes: {}
      }
    }
  });
  return User;
};
