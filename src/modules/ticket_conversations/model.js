import {DataTypes } from'sequelize';
import koneksi from'../../config/koneksi.js';
import fdModel from'../freshdesk/model.js';
import typeModel from'../type/model.js';
const fd_ticket_conversations = koneksi.define('fd_ticket_conversations', {
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
      amount: {
        type: DataTypes.STRING
        }
  }, {
    // Other model options go here
    freezeTableName: true,
    paranoid:true
  });

  fdModel.hasMany(fd_ticket_conversations);
  fd_ticket_conversations.belongsTo(fdModel);
typeModel.hasMany(fd_ticket_conversations);
fd_ticket_conversations.belongsTo(typeModel);
export default fd_ticket_conversations;