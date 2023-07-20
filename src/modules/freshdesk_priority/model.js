const {DataTypes, ENUM } = require('sequelize');
const koneksi = require('../../config/koneksi.js');

const Priority = koneksi.define('fd_priority', {
    // Model attributes are defined here
    id: {
      type: DataTypes.STRING,
        primaryKey: true
      },
    "priority_id":{
        type: DataTypes.STRING
      },
      "name":{
        type: DataTypes.STRING
      }
  }, {
    // Other model options go here
    freezeTableName: true,
    paranoid:true,
    deletedAt: 'deleted'
  });
module.exports = Priority;