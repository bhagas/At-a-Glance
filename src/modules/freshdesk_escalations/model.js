import {DataTypes, ENUM } from'sequelize';
import koneksi from'../../config/koneksi.js';
import modelTickets from'../freshdesk/model.js'
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
export default escalations;