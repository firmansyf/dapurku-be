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
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'admin',
      },
    },
    {
      sequelize,
      modelName: 'LoginAdmin',
      tableName: 'tbl_login_admin',
      timestamps: true,
    }
  );

  return LoginAdmin;
};