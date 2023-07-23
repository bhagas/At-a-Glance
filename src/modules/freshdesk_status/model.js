import {DataTypes, ENUM } from'sequelize';
import koneksi from'../../config/koneksi.js';

const Status = koneksi.define('fd_status', {
    // Model attributes are defined here
    id: {
      type: DataTypes.STRING,
        primaryKey: true
      },
    "status_id":{
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
export default Status;