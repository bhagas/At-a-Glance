import {DataTypes, ENUM } from'sequelize';
import koneksi from'../../config/koneksi.js';

const Warehouse = koneksi.define('warehouse', {
    // Model attributes are defined here
    id: {
      type: DataTypes.STRING,
        primaryKey: true
      },
    "name":{
        type: DataTypes.STRING
      },

    
  }, {
    // Other model options go here
    freezeTableName: true,
    paranoid:true,
    deletedAt: 'deleted'
  });
export default Warehouse;