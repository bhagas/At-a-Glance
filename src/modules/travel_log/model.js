import {DataTypes } from'sequelize';
import koneksi from'../../config/koneksi.js';
import fdModel from'../freshdesk/model.js';
import user from '../user/model.js'
const travel_log = koneksi.define('travel_log', {
    // Model attributes are defined here
    id: {
      type: DataTypes.STRING,
        primaryKey: true
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


user.hasMany(travel_log,{
  foreignKey: 'user_id'
});
travel_log.belongsTo(user,{
  foreignKey: 'user_id'
});
export default travel_log;