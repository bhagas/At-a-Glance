import db from '../../config/koneksi.js';
import Model from './model.js'
import { QueryTypes } from 'sequelize';
import gql from 'graphql-tag';
import { v4 as uuidv4 } from 'uuid';
const typeDefs =
  gql`
  extend type Query{
    items:itemsResult
    item(id: ID!):item
  }

  type itemsResult{
    data:[item],
    message:String,
    status:Int
  }

  type item {
    id: ID!, 
    createdAt: String,
    updatedAt:String,
    item_name:String,
    item_code:String,
    default_uom:String,
    unit:String,
    default_sell_price:Float

 }


 extend type Mutation{
  createItem(input: itemInput): Output
  updateItem(id: ID!, input: itemInput): Output
  deleteItem(id: ID!): Output
 }
 input itemInput{

    item_name:String,
    item_code:String,
    default_uom:String,
    default_sell_price:Float
 
 }
  `
const resolvers = {
  Query: {
    items: async (obj, args, context, info) => {
      try {
        let replacements = {}
      let a = "";
    //   if (args.input) {
    //     if (args.input.userId) {
    //       a += ` AND a."userId" = :userId`;
    //       replacements.userId = args.input.userId;
    //   }
    // }
     
      let dt = await db.query('select a.*, u.unit from items a join uom u on a.default_uom = u.id where a.deleted is null'+a, {
        replacements
      })
      // console.log(dt);
      return { data: dt[0], status: 200, message: 'Success' };
      } catch (error) {
          console.log(error);
          return { data: error, status: 500, message: 'Failed' };
      }
      
    },

  
    item: async (obj, args, context, info) => {
      console.log("get review");
      let dt = await db.query(`select a.*, u.unit from items a join uom u on a.default_uom = u.id where a.deleted is null and a.id= $1`, { bind: [args.id], type: QueryTypes.SELECT })
      // console.log(dt);
      return dt[0];
    }
  },
  Mutation: {
    createItem: async (_, { input }, context) => {
      try {
        // input.id = uuidv4()
        // console.log(input);
        let data = {
          "id": uuidv4(),
          "item_name": input.item_name,
          "item_code": input.item_code,
          "default_uom": input.default_uom,
       
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
    updateItem: async (_, { id, input }) => {
      try {
        
        await Model.update(
          input,
          { where: { id } }
        )
        return {
          status: '200',
          message: 'Updated'
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
    deleteItem: async (_, { id }) => {
      try {
        await Model.destroy(
          { where: { id } }
        )
        return {
          status: '200',
          message: 'Removed'
        }
      } catch (error) {
        return {
          status: '500',
          message: 'Internal Server Error',
          error: JSON.stringify(error)
        }
      }
    }

  }
}
export { typeDefs, resolvers }