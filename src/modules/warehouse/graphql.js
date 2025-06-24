import db from '../../config/koneksi.js';
import Model from './model.js'
import { QueryTypes } from 'sequelize';
import gql from 'graphql-tag';
import { v4 as uuidv4 } from 'uuid';
const typeDefs =
  gql`
  extend type Query{
    warehouses:warehousesResult
    warehouse(id: ID!):warehouse
  }

  type warehousesResult{
    data:[warehouse],
    message:String,
    status:Int
  }

  type warehouse {
    id: ID!, 
    createdAt: String,
    updatedAt:String,
    name:String,
 }


 extend type Mutation{
  createWarehouse(input: warehouseInput): Output
  updateWarehouse(id: ID!, input: warehouseInput): Output
  deleteWarehouse(id: ID!): Output
 }
 input warehouseInput{

  name:String
 
 }
  `
const resolvers = {
  Query: {
    warehouses: async (obj, args, context, info) => {
      try {
        let replacements = {}
      let a = "";
    //   if (args.input) {
    //     if (args.input.userId) {
    //       a += ` AND a."userId" = :userId`;
    //       replacements.userId = args.input.userId;
    //   }
    // }
     
      let dt = await db.query('select * from warehouse a where a.deleted is null'+a, {
        replacements
      })
      // console.log(dt);
      return { data: dt[0], status: 200, message: 'Success' };
      } catch (error) {
          console.log(error);
          return { data: error, status: 500, message: 'Failed' };
      }
      
    },

  
    warehouse: async (obj, args, context, info) => {
     
      let dt = await db.query(`select a.* from warehouse a where a.deleted is null and a.id= $1`, { bind: [args.id], type: QueryTypes.SELECT })
    
      return dt[0];
    }
  },
  Mutation: {
    createWarehouse: async (_, { input }, context) => {
      try {
        // input.id = uuidv4()
        // console.log(input);
        let data = {
          "id": uuidv4(),
          "name": input.name,
       
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
    updateWarehouse: async (_, { id, input }) => {
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
    deleteWarehouse: async (_, { id }) => {
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