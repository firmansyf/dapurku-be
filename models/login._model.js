'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Login extends Model {
    static associate(models) {
      // define association here (jika ada)
    }
  }

  Login.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Login',
      tableName: 'tbl_login',
      timestamps: true,
    }
  );

  return Login;
};