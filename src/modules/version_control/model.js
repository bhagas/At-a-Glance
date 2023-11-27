import {DataTypes } from'sequelize';
import koneksi from'../../config/koneksi.js';
import userModel from'../user/model.js';
const Version = koneksi.define('version', {
    // Model attributes are defined here
    id: {
      type: DataTypes.STRING,
        primaryKey: true
      },
    version: {
      type: DataTypes.STRING
    },
    log: {
      type: DataTypes.STRING
    },
    "date" : {
      type: DataTypes.DATE
    }
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
export default Version;