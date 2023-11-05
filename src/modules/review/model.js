import {DataTypes } from'sequelize';
import koneksi from'../../config/koneksi.js';
import userModel from'../user/model.js';
const Review = koneksi.define('review', {
    // Model attributes are defined here
    id: {
      type: DataTypes.STRING,
        primaryKey: true
      },
    review: {
      type: DataTypes.STRING
    },
    rating: {
      type: DataTypes.INTEGER
    }
  }, {
    // Other model options go here
    freezeTableName: true,
    paranoid:true,
    deletedAt: 'deleted'
  });

  userModel.hasMany(Review);
  Review.belongsTo(userModel);

  userModel.hasMany(Review,{
    foreignKey: 'created_by'
  });
  Review.belongsTo(userModel,{
    foreignKey: 'created_by'
  });
export default Review;