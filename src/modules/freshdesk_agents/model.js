const {DataTypes, ENUM } = require('sequelize');
const koneksi = require('../../config/koneksi.js');
const modelTickets = require('../freshdesk/model')
const agents = koneksi.define('fd_agents', {
    // Model attributes are defined here
    id: {
      type: DataTypes.STRING,
        primaryKey: true
      },
    "available":{
        type: DataTypes.STRING
      },
      "ticket_scope":{
        type: DataTypes.INTEGER
      },
      "type":{
        type: DataTypes.STRING
      },
      "active":{
        type: DataTypes.STRING
      },
      "email":{
        type: DataTypes.STRING
      },
      "name":{
        type: DataTypes.STRING
      },
      "phone":{
        type: DataTypes.STRING
      },
      "last_active_at":{
        type: DataTypes.STRING
      }
  }, {
    // Other model options go here
    freezeTableName: true,
    paranoid:true,
    deletedAt: 'deleted'
  });

//   modelTickets.hasMany(agents,{
//     foreignKey: 'freshdesk_id'
//   });
//   agents.belongsTo(modelTickets);
module.exports = agents;