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
    },
    "period_start" : {
      type: DataTypes.DATE
    },
    "period_end" : {
      type: DataTypes.DATE
    },
    "productive" : {
      type: DataTypes.INTEGER
    },
    "accountable" : {
      type: DataTypes.INTEGER
    },
    "proactive" : {
      type: DataTypes.INTEGER
    },
    "attitude" : {
      type: DataTypes.INTEGER
    },
    "evalution_goals" : {
      type: DataTypes.STRING
    },
    "employee_verification_date" : {
      type: DataTypes.DATE
    },
    "manager_verification_date" : {
      type: DataTypes.DATE
    },
    "published" : {
      type: DataTypes.BOOLEAN,
      defaultValue:false
    },
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