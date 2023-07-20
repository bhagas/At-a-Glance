const {DataTypes } = require('sequelize');
const koneksi = require('../../config/koneksi.js');
const userModel = require('../user/model.js');
const roleModel = require('../role/model.js');
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
module.exports = Pool;