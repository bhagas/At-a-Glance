import {DataTypes, ENUM } from'sequelize';
import koneksi from'../../config/koneksi.js';
import freshdesk_agents from'../freshdesk_agents/model.js'
import user from '../user/model.js'
const fd_agent_member = koneksi.define('fd_agent_member', {
    // Model attributes are defined here
    id: {
      type: DataTypes.STRING,
        primaryKey: true
      },
      "hour_salary" : {
        type: DataTypes.DOUBLE,
      },
      "salary" : {
        type: DataTypes.DOUBLE,
   
      },
  }, {
    // Other model options go here
    freezeTableName: true,
    paranoid:true,
    deletedAt: 'deleted'
  });

  freshdesk_agents.hasMany(fd_agent_member,{
    foreignKey: 'id_agent'
  });
  fd_agent_member.belongsTo(freshdesk_agents,{
    foreignKey: 'id_agent'
  });

  user.hasMany(fd_agent_member,{
    foreignKey: 'id_member'
  });
  fd_agent_member.belongsTo(user,{
    foreignKey: 'id_member'
  });

  user.hasMany(fd_agent_member,{
    foreignKey: 'id_user_agent'
  });
  fd_agent_member.belongsTo(user,{
    foreignKey: 'id_user_agent'
  });
export default fd_agent_member;