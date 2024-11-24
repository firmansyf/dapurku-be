'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('tbl_login', 'registrasi_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'tbl_registrasi',
        key: 'id',
      },
      onDelete: 'CASCADE', 
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('tbl_login', 'registrasi_id');
  },
};