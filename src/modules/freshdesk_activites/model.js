import {DataTypes, ENUM } from'sequelize';
import koneksi from '../../config/koneksi.js';
import modelTickets from '../freshdesk/model.js'
const activites = koneksi.define('fd_activities', {
    // Model attributes are defined here
    id: {
      type: DataTypes.STRING,
        primaryKey: true
      },
      "status":{
        type: DataTypes.INTEGER
      },
      "priority":{
        type: DataTypes.STRING
      }
  }, {
    // Other model options go here
    freezeTableName: true,
    paranoid:true,
    deletedAt: 'deleted'
  });

  modelTickets.hasMany(activites,{
    foreignKey: 'freshdesk_id'
  });
  activites.belongsTo(modelTickets,{
    foreignKey: 'freshdesk_id'
  });
export default activites;