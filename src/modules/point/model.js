import {DataTypes } from'sequelize';
import koneksi from'../../config/koneksi.js';
import user from '../user/model.js'
import ms_point from '../ms_point/model.js'

const point_log = koneksi.define('point_log', {
    // Model attributes are defined here
    id: {
      type: DataTypes.STRING,
        primaryKey: true
      },
    point_credit : {
      type: DataTypes.INTEGER
    },
    point_debit : {
        type: DataTypes.INTEGER
      },
      total_point : {
        type: DataTypes.INTEGER
      },
      desc : {
        type: DataTypes.TEXT
      },
  }, {
    // Other model options go here
    freezeTableName: true,
    paranoid:true,
    deletedAt: 'deleted'
  });

  // userModel.hasMany(Review);
  // Review.belongsTo(userModel);

  // userModel.hasMany(Review,{
  //   foreignKey: 'created_by'
  // });
  // Review.belongsTo(userModel,{
  //   foreignKey: 'created_by'
  // });

  user.hasMany(point_log,{
    foreignKey: 'user_id'
  });
  point_log.belongsTo(user,{
    foreignKey: 'user_id'
  });

  ms_point.hasMany(point_log,{
    foreignKey: 'ms_point_id'
  });
  point_log.belongsTo(ms_point,{
    foreignKey: 'ms_point_id'
  });
export default point_log;