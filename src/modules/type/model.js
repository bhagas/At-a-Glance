import {DataTypes } from'sequelize';
import koneksi from'../../config/koneksi.js';

const Type = koneksi.define('types', {
    // Model attributes are defined here
    id: {
      type: DataTypes.STRING,
        primaryKey: true
      },
    type_name: {
      type: DataTypes.STRING
    }
  }, {
    // Other model options go here
    freezeTableName: true,
    paranoid:true,
    deletedAt: 'deleted'
  });
export default Type;