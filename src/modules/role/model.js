import {DataTypes } from'sequelize';
import koneksi from'../../config/koneksi.js';

const Role = koneksi.define('roles', {
    // Model attributes are defined here
    id: {
      type: DataTypes.STRING,
        primaryKey: true
      },
    role_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    code:{
        type: DataTypes.STRING
    }
  }, {
    // Other model options go here
    freezeTableName: true,
    paranoid:true,
    deletedAt: 'deleted'
  });
export default Role;