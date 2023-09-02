import db from '../../config/koneksi.js';
import typeModel from './model.js'
import { QueryTypes } from 'sequelize';
import gql from 'graphql-tag';
import { v4 as uuidv4 } from 'uuid';
const typeDefs =
  gql`
  extend type Query{
    types:typesResult
    type(id: ID!):Type
  }

  type typesResult{
    data:[Type],
    message:String,
    status:Int
  }
  type Type {
    id: ID!,
    type_name: String,
    createdAt: String,
    updatedAt:String
 }
 extend type Mutation{
  createType(inputType: TypeInput): Output
  updateType(id: ID!, input: TypeInput): Output
  deleteType(id: ID!): Output
 }
 input TypeInput{
  type_name:String
 }
  `
const resolvers = {
  Query: {
    types: async (obj, args, context, info) => {
      let dt = await db.query('select * from types where deleted is null')
      // console.log(dt);
      return { data: dt[0], status: 200, message: 'Success' };
    },
    type: async (obj, args, context, info) => {
      console.log("get type");
      let dt = await db.query(`select * from types where id= $1`, { bind: [args.id], type: QueryTypes.SELECT })
      // console.log(dt);
      return dt[0];
    }
  },
  Mutation: {
    createType: async (_, { inputType }) => {
      try {
        inputType.id = uuidv4()
        console.log(inputType);
        await typeModel.create(inputType)
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
    updateType: async (_, { id, input }) => {
      try {
        await typeModel.update(
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
    deleteType: async (_, { id }) => {
      try {
        await typeModel.destroy(
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