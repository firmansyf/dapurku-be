'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Login extends Model {
    static associate(models) {
      Login.belongsTo(models.Registrasi, {
        foreignKey: 'registrasi_id',
        onDelete: 'CASCADE'
      });
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
      registrasi_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'tbl_registrasi', 
          key: 'id', 
        },
        onDelete: 'CASCADE',
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