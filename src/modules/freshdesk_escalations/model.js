const {DataTypes, ENUM } = require('sequelize');
const koneksi = require('../../config/koneksi.js');
const modelTickets = require('../freshdesk/model')
const escalations = koneksi.define('fd_escalations', {
    // Model attributes are defined here
    id: {
      type: DataTypes.STRING,
        primaryKey: true
      },
      "escalation_type":{
        type: DataTypes.STRING
      }
  }, {
    // Other model options go here
    freezeTableName: true,
    paranoid:true,
    deletedAt: 'deleted'
  });

  modelTickets.hasMany(escalations,{
    foreignKey: 'freshdesk_id'
  });
  escalations.belongsTo(modelTickets,{
    foreignKey: 'freshdesk_id'
  });
module.exports = escalations;