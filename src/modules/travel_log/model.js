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