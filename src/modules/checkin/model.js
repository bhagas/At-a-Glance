import {DataTypes } from'sequelize';
import koneksi from'../../config/koneksi.js';
import fdModel from'../freshdesk/model.js';
import user from '../user/model.js'
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
            checkout_location: {
              type: DataTypes.STRING
              },
  }, {
    // Other model options go here
    freezeTableName: true,
    paranoid:true
  });

  fdModel.hasMany(check_in, {
    foreignKey: 'ticket_id'
  });
  check_in.belongsTo(fdModel,{
    foreignKey: 'ticket_id'
  });



user.hasMany(check_in,{
  foreignKey: 'user_id'
});
check_in.belongsTo(user,{
  foreignKey: 'user_id'
});
export default check_in;