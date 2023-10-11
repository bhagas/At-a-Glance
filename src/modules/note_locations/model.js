import {DataTypes } from'sequelize';
import koneksi from'../../config/koneksi.js';
import fdModel from'../freshdesk/model.js';
import typeModel from'../type/model.js';
import user from '../user/model.js'
const fd_conversations_locations = koneksi.define('fd_conversations_locations', {
    // Model attributes are defined here
    id: {
      type: DataTypes.STRING,
        primaryKey: true
      },
    fd_ticket_id: {
        type:DataTypes.STRING
    },
    fd_conv_id: {
        type:DataTypes.STRING
    },
      long: {
          type: DataTypes.STRING
        },
        lat: {
          type: DataTypes.STRING
          },
          location_tag: {
            type: DataTypes.TEXT
            }
  }, {
    // Other model options go here
    freezeTableName: true,
    paranoid:true
  });

  fdModel.hasMany(fd_conversations_locations);
  fd_conversations_locations.belongsTo(fdModel);



user.hasMany(fd_conversations_locations,{
  foreignKey: 'created_by'
});
fd_conversations_locations.belongsTo(user,{
  foreignKey: 'created_by'
});
export default fd_conversations_locations;