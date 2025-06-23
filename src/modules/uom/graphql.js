import db from '../../config/koneksi.js';
import Model from './model.js'
import { QueryTypes } from 'sequelize';
import gql from 'graphql-tag';
import { v4 as uuidv4 } from 'uuid';
const typeDefs =
  gql`
  extend type Query{
    uoms:uomsResult
    uom(id: ID!):uom
  }

  type uomsResult{
    data:[uom],
    message:String,
    status:Int
  }

  type uom {
    id: ID!, 
    createdAt: String,
    updatedAt:String,
    unit:String,
 }


 extend type Mutation{
  createUom(input: uomInput): Output
  updateUom(id: ID!, input: uomInput): Output
  deleteUom(id: ID!): Output
 }
 input uomInput{

  unit:String
 
 }
  `
const resolvers = {
  Query: {
    uoms: async (obj, args, context, info) => {
      try {
        let replacements = {}
      let a = "";
    //   if (args.input) {
    //     if (args.input.userId) {
    //       a += ` AND a."userId" = :userId`;
    //       replacements.userId = args.input.userId;
    //   }
    // }
     
      let dt = await db.query('select * from uom a where a.deleted is null'+a, {
        replacements
      })
      // console.log(dt);
      return { data: dt[0], status: 200, message: 'Success' };
      } catch (error) {
          console.log(error);
          return { data: error, status: 500, message: 'Failed' };
      }
      
    },

  
    uom: async (obj, args, context, info) => {
      console.log("get review");
      let dt = await db.query(`select a.* from uom a where a.deleted is null and a.id= $1`, { bind: [args.id], type: QueryTypes.SELECT })
    
      return dt[0];
    }
  },
  Mutation: {
    createUom: async (_, { input }, context) => {
      try {
        // input.id = uuidv4()
        // console.log(input);
        let data = {
          "id": uuidv4(),
          "unit": input.unit,
       
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
    updateUom: async (_, { id, input }) => {
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
    deleteUom: async (_, { id }) => {
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