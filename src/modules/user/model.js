import {DataTypes, ENUM } from'sequelize';
import koneksi from'../../config/koneksi.js';

const User = koneksi.define('users', {
    // Model attributes are defined here
    id: {
      type: DataTypes.STRING,
        primaryKey: true
      },
    name: {
      type: DataTypes.STRING
    },
    email:{
        type: DataTypes.STRING,
        unique: true
    },
    password:{
      type: DataTypes.STRING
    },
    confirmation_code:{
      type: DataTypes.STRING
    },
    email:{
      type: DataTypes.STRING
    },
    status:{
      type: ENUM("pending", "active", "inactive"),
      defaultValue: "pending",
    },
    last_login:{
      type: DataTypes.DATE
    },
  }, {
    // Other model options go here
    freezeTableName: true,
    paranoid:true,
    deletedAt: 'deleted'
  });
export default User;