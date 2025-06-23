import {DataTypes, ENUM } from'sequelize';
import koneksi from'../../config/koneksi.js';
import uomModel from '../uom/model.js'

const items = koneksi.define('items', {
    // Model attributes are defined here
    id: {
      type: DataTypes.STRING,
        primaryKey: true
      },
      item_name: {
        type: DataTypes.STRING,
        },
      item_code: {
          type: DataTypes.STRING,
        },
    
  }, {
    // Other model options go here
    freezeTableName: true,
    paranoid:true,
    deletedAt: 'deleted'
  });

  uomModel.hasMany(items,{
       foreignKey: 'default_uom'
     });
items.belongsTo(uomModel,{
  foreignKey: 'default_uom'
});
export default items;