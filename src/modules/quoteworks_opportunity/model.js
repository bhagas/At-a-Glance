import {DataTypes, ENUM } from'sequelize';
import koneksi from'../../config/koneksi.js';

const qw = koneksi.define('qw_opportunity', {
    // Model attributes are defined here
    id: {
      type: DataTypes.STRING,
        primaryKey: true
      },
    "number":{
        type: DataTypes.STRING
      },

     "name":{
        type: DataTypes.STRING
      },

    "sold_to_company":{
         type: DataTypes.STRING
       },
       "opp_date":{
        type: DataTypes.DATEONLY
    },
    "opp_stage":{
        type: DataTypes.STRING
    },
    "sales_rep":{
        type: DataTypes.STRING
    },
    "total_amount":{
        type: DataTypes.STRING
    },
    "cust_po_number":{
        type: DataTypes.STRING
    },
    "est_close_date":{
        type: DataTypes.DATEONLY
    },
    "created":{
        type: DataTypes.DATE
    },
    "pnx_engineer":{
        type: DataTypes.STRING
    },
    "line_of_business":{
        type: DataTypes.STRING
    },
    "doc_status_date":{
        type: DataTypes.DATEONLY
    },
    "root_cause":{
        type: DataTypes.STRING
    },
    "sold_to_contact":{
        type: DataTypes.STRING
    },
    "preparer":{
        type: DataTypes.STRING
    },
    "ship_to_company":{
        type: DataTypes.STRING
    },
    "bill_to_company":{
        type: DataTypes.STRING
    }
       
  }, {
    // Other model options go here
    freezeTableName: true,
    paranoid:true,
    deletedAt: 'deleted'
  });
export default qw;