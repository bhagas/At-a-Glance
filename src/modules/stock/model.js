import {DataTypes, ENUM } from'sequelize';
import koneksi from'../../config/koneksi.js';
import uomModel from '../uom/model.js'
import itemModel from '../items/model.js'

const stock = koneksi.define('stock', {
    // Model attributes are defined here
    id: {
      type: DataTypes.STRING,
        primaryKey: true
      },
      qty: {
        type: DataTypes.STRING,
        },
    status:{
      type: DataTypes.STRING,
    }
    
  }, {
    // Other model options go here
    freezeTableName: true,
    paranoid:true,
    deletedAt: 'deleted'
  });

  itemModel.hasMany(stock);
     stock.belongsTo(itemModel);

     uomModel.hasMany(stock);
stock.belongsTo(uomModel);
export default stock;