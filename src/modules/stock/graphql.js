import db from '../../config/koneksi.js';
import Model from './model.js'
import { QueryTypes } from 'sequelize';
import gql from 'graphql-tag';
import { v4 as uuidv4 } from 'uuid';
const typeDefs =
  gql`
  extend type Query{
    stocks:stockCardResult
    stockCard(item_id: ID!):stockCardResult
  }

  type stockCardResult{
    data:[item],
    message:String,
    status:Int
  }

  type stockCard {
    id: ID!, 
    createdAt: String,
    updatedAt:String,
    item_name:String,
    item_code:String,
    uom:String,
    price:Float,
    status:stockStatus,
    qty:Float,
    transaction_date:String,
    warehousename:String,
 }


 extend type Mutation{
  stock_transaction(input: stockInput): Output

 }
 input stockInput{

    itemId:ID!,
    uomId:ID!,
    warehouseId:ID!,
    qty:Float,
    price:Float,
    transaction_date:String,
    status: stockStatus
 
 }


 enum stockStatus {
  INBOUND
  OUTBOUND
  ADJUSTMENT
}
  `
const resolvers = {
  Query: {
    stocks: async (obj, args, context, info) => {
      try {
        let replacements = {}
      let a = "";
    //   if (args.input) {
    //     if (args.input.userId) {
    //       a += ` AND a."userId" = :userId`;
    //       replacements.userId = args.input.userId;
    //   }
    // }
     
      let dt = await db.query('select a.*, i.item_name , i.item_code , u.unit as uom , w."name" as warehousename from stock a join items i on a."itemId" = i.id join uom u on a."uomId" = u.id join warehouse w on a."warehouseId" = w.id where a.deleted is null'+a, {
        replacements
      })
      // console.log(dt);
      return { data: dt[0], status: 200, message: 'Success' };
      } catch (error) {
          console.log(error);
          return { data: error, status: 500, message: 'Failed' };
      }
      
    },

  
    stockCard: async (obj, args, context, info) => {
      console.log("get review");
      let dt = await db.query(`select a.*, i.item_name , i.item_code , u.unit as uom , w."name" as warehousename from stock a join items i on a."itemId" = i.id join uom u on a."uomId" = u.id join warehouse w on a."warehouseId" = w.id where a.deleted is null a."itemId"= $1`, { bind: [args.id], type: QueryTypes.SELECT })
      // console.log(dt);
      return dt[0];
    }
  },
  Mutation: {
    stock_transaction: async (_, { input }, context) => {
      try {
        // input.id = uuidv4()
        // console.log(input);
        let data = {
            "id": uuidv4(),
            "itemId": input.itemId,
            "uomId": input.uomId,
            "warehouseId": input.warehouseId,
            "qty": input.qty,
            "price": input.price,
            "status": input.status,
            "transaction_date": input.transaction_date
         
          }
          await Model.create(data)
          return {
            status: '200',
            message: 'Success'
          }
       
      } catch (error) {
        console.log(error);
        return {
          status: '500',
          message: 'Failed',
          error: JSON.stringify(error)
        }
      }
    },


  }
}
export { typeDefs, resolvers }