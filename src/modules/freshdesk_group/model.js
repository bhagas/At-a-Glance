const {DataTypes, ENUM } = require('sequelize');
const koneksi = require('../../config/koneksi.js');

const Ticket = koneksi.define('fd_group', {
    // Model attributes are defined here
    id: {
      type: DataTypes.STRING,
        primaryKey: true
      },
    "group_id":{
        type: DataTypes.STRING
      },
      "group_name":{
        type: DataTypes.STRING
      }
  }, {
    // Other model options go here
    freezeTableName: true,
    paranoid:true,
    deletedAt: 'deleted'
  });
module.exports = Ticket;