import {DataTypes } from'sequelize';
import koneksi from'../../config/koneksi.js';
import userModel from'../user/model.js';
import roleModel from'../role/model.js';
const Pool = koneksi.define('role_pool', {
    // Model attributes are defined here
    id: {
      type: DataTypes.STRING,
        primaryKey: true
      }
  }, {
    // Other model options go here
    freezeTableName: true,
    paranoid:true
  });

  userModel.hasMany(Pool);
Pool.belongsTo(userModel);
roleModel.hasMany(Pool);
Pool.belongsTo(roleModel);
export default Pool;