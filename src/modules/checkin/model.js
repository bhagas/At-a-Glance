import {DataTypes } from'sequelize';
import koneksi from'../../config/koneksi.js';

const check_in = koneksi.define('check_in', {
    // Model attributes are defined here
    id: {
      type: DataTypes.STRING,
        primaryKey: true
      },
    fd_ticket_id: {
        type:DataTypes.STRING
    },
      check_in: {
          type: DataTypes.DATE
        },
        check_out: {
          type: DataTypes.DATE
          },
          checkin_location: {
            type: DataTypes.STRING
            },
            checkin_long: {
              type: DataTypes.STRING
              },
              checkin_lat: {
                type: DataTypes.STRING
                },
            checkout_location: {
              type: DataTypes.STRING
              },
              checkout_long: {
                type: DataTypes.STRING
                },
                checkout_lat: {
                  type: DataTypes.STRING
                  },
  }, {
    // Other model options go here
    freezeTableName: true,
    paranoid:true
  });





export default check_in;