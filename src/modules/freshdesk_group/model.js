import {DataTypes, ENUM } from'sequelize';
import koneksi from'../../config/koneksi.js';

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
export default Ticket;