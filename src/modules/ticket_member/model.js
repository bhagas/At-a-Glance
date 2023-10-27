import {DataTypes } from'sequelize';
import koneksi from'../../config/koneksi.js';
import fdModel from'../freshdesk/model.js';
import typeModel from'../type/model.js';
import user from '../user/model.js'
import freshdesk_agents from'../freshdesk_agents/model.js'

const ticket_member = koneksi.define('ticket_member', {
    // Model attributes are defined here
    id: {
      type: DataTypes.STRING,
        primaryKey: true
      },
    fd_ticket_id: {
        type:DataTypes.BIGINT
    },
   
  }, {
    // Other model options go here
    freezeTableName: true,
    paranoid:true
  });

//   fdModel.hasMany(ticket_member);
//   ticket_member.belongsTo(fdModel);

  freshdesk_agents.hasMany(ticket_member,{
    foreignKey: 'id_agent'
  });
  ticket_member.belongsTo(freshdesk_agents,{
    foreignKey: 'id_agent'
  });

  user.hasMany(ticket_member,{
    foreignKey: 'id_member'
  });
  ticket_member.belongsTo(user,{
    foreignKey: 'id_member'
  });

  user.hasMany(ticket_member,{
    foreignKey: 'id_user_agent'
  });
  ticket_member.belongsTo(user,{
    foreignKey: 'id_user_agent'
  });

user.hasMany(ticket_member,{
  foreignKey: 'created_by'
});
ticket_member.belongsTo(user,{
  foreignKey: 'created_by'
});
export default ticket_member;