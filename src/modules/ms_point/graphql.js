import db from '../../config/koneksi.js';
import Model from './model.js'
import { QueryTypes } from 'sequelize';
import gql from 'graphql-tag';
import { v4 as uuidv4 } from 'uuid';
const typeDefs =
  gql`
  extend type Query{
    msPoints:msPointsResult
    msPoint(id: ID!):msPointsResult
  }

  type msPointsResult{
    data:[msPoint],
    message:String,
    status:Int
  }
  

  type msPoint {
    id: ID!, 
    createdAt: String,
    updatedAt:String,
    process_name:String,
    process_code:String,
    point:Int
 }


 extend type Mutation{
  createMsPoint(input: msPointInput): Output
  updateMsPoint(id: ID!, input: msPointInput): Output
  deleteMsPoint(id: ID!): Output
 }
 input msPointInput{

    process_name:String,
    process_code:String,
    point:Int
 
 }
  `
const resolvers = {
  Query: {
    msPoints: async (obj, args, context, info) => {
      try {
        let replacements = {}
      let a = "";
    //   if (args.input) {
    //     if (args.input.userId) {
    //       a += ` AND a."userId" = :userId`;
    //       replacements.userId = args.input.userId;
    //   }
    // }
     
      let dt = await db.query('select * from ms_point a order by a."createdAt" desc'+a, {
        replacements
      })
      // console.log(dt);
      return { data: dt[0], status: 200, message: 'Success' };
      } catch (error) {
          console.log(error);
          return { data: error, status: 500, message: 'Failed' };
      }
      
    },

  
    msPoint: async (obj, args, context, info) => {
      // console.log("get review");
      try {
        let dt = await db.query(`select a.* from ms_point a where a.id= $1`, { bind: [args.id], type: QueryTypes.SELECT })
        // console.log(dt);
        // return dt[0];
        return { data: dt, status: 200, message: 'Success' };
      } catch (error) {
        console.log(error);
        return { data: error, status: 500, message: 'Failed' };
      }
   
    }
  },
  Mutation: {
    createMsPoint: async (_, { input }, context) => {
      try {
        // input.id = uuidv4()
        // console.log(input);
        // process_name:String,
        // process_code:String,
        // point:Int
        let data = {
          "id": input.process_code,
          "process_name": input.process_name,
          "point": input.point,
          "process_code": input.process_code
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
    updateMsPoint: async (_, { id, input }) => {
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
    deleteMsPoint: async (_, { id }) => {
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