import {DataTypes } from'sequelize';
import koneksi from'../../config/koneksi.js';

const Config = koneksi.define('config', {
    // Model attributes are defined here
    id: {
      type: DataTypes.STRING,
        primaryKey: true
      },
    mail_user: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mail_from:{
        type: DataTypes.STRING
    },
    mail_host:{
        type: DataTypes.STRING,
        allowNull: false
    },
    mail_port:{
        type: DataTypes.STRING,
        allowNull: false
    },
    mail_password:{
        type: DataTypes.STRING,
        allowNull: false
    },
    mail_secure:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    expense_mail:{
      type: DataTypes.STRING,
      allowNull: true
  }
  }, {
    // Other model options go here
    freezeTableName: true,
    paranoid:true,
    deletedAt: 'deleted'
  });
export default Config;