import {DataTypes, ENUM } from'sequelize';
import koneksi from'../../config/koneksi.js';

const Uom = koneksi.define('uom', {
    // Model attributes are defined here
    id: {
      type: DataTypes.STRING,
        primaryKey: true
      },
    "unit":{
        type: DataTypes.STRING
      },

    
  }, {
    // Other model options go here
    freezeTableName: true,
    paranoid:true,
    deletedAt: 'deleted'
  });
export default Uom;