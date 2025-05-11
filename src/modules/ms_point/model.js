import {DataTypes } from'sequelize';
import koneksi from'../../config/koneksi.js';

const ms_point = koneksi.define('ms_point', {
    // Model attributes are defined here
    id: {
      type: DataTypes.STRING,
        primaryKey: true
      },
    process_name: {
      type: DataTypes.TEXT
    },
    process_code: {
      type: DataTypes.STRING
    },
    point : {
      type: DataTypes.INTEGER
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
export default ms_point;