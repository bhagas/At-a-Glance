import db from '../../config/koneksi.js';
import reviewModel from './model.js'
import { QueryTypes } from 'sequelize';
import gql from 'graphql-tag';
import { v4 as uuidv4 } from 'uuid';
const typeDefs =
  gql`
  extend type Query{
    versions:versionsResult
    version(id: ID!):Version
  }

  type versionsResult{
    data:[Version],
    message:String,
    status:Int
  }

  type Version {
    id: ID!, 
    createdAt: String,
    updatedAt:String,
    log:String,
    date:String,
    version:String,
 }


 extend type Mutation{
  createVersion(input: VersionInput): Output
  updateVersion(id: ID!, input: VersionInput): Output
  deleteVersion(id: ID!): Output
 }
 input VersionInput{

  log:String,
  date:String,
  version:String,
 
 }
  `
const resolvers = {
  Query: {
    versions: async (obj, args, context, info) => {
      try {
        let replacements = {}
      let a = "";
    //   if (args.input) {
    //     if (args.input.userId) {
    //       a += ` AND a."userId" = :userId`;
    //       replacements.userId = args.input.userId;
    //   }
    // }
     
      let dt = await db.query('select * from version where a.deleted is null'+a, {
        replacements
      })
      // console.log(dt);
      return { data: dt[0], status: 200, message: 'Success' };
      } catch (error) {
          console.log(error);
          return { data: error, status: 500, message: 'Failed' };
      }
      
    },

  
    version: async (obj, args, context, info) => {
      console.log("get review");
      let dt = await db.query(`select a.* from version a where a.deleted is null and a.id= $1`, { bind: [args.id], type: QueryTypes.SELECT })
      // console.log(dt);
      return dt[0];
    }
  },
  Mutation: {
    createVersion: async (_, { input }, context) => {
      try {
        // input.id = uuidv4()
        // console.log(input);
        let data = {
          "id": uuidv4(),
          "version": input.version,
          "log": input.log,
          "date": input.date
        }
        await reviewModel.create(data)
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
    updateVersion: async (_, { id, input }) => {
      try {
        
        await reviewModel.update(
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
    deleteVersion: async (_, { id }) => {
      try {
        await reviewModel.destroy(
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