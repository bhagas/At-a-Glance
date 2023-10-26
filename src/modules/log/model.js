import {DataTypes, ENUM } from'sequelize';
import koneksi from'../../config/koneksi.js';

const Status = koneksi.define('log', {
    // Model attributes are defined here
    id: {
      type: DataTypes.STRING,
        primaryKey: true
      },
    "email":{
        type: DataTypes.STRING
      },

     "action_name":{
        type: DataTypes.STRING
      },
      "graphql_schema":{
        type: DataTypes.STRING
      },
      "graphql_type":{
        type: DataTypes.STRING
      },
      "graphql_queries":{
        type: DataTypes.TEXT
      },
      "graphql_variables":{
        type: DataTypes.JSON
      },
  }, {
    // Other model options go here
    freezeTableName: true,
    paranoid:true,
    deletedAt: 'deleted'
  });
export default Status;