'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LoginAdmin extends Model {
    static associate(models) {
    //  Ini untuk relasi
    }
  }

  LoginAdmin.init(
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
      modelName: 'LoginAdmin',
      tableName: 'tbl_login-admin',
      timestamps: true,
    }
  );

  return LoginAdmin;
};