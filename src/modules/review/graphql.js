import db from '../../config/koneksi.js';
import reviewModel from './model.js'
import { QueryTypes } from 'sequelize';
import gql from 'graphql-tag';
import { v4 as uuidv4 } from 'uuid';
const typeDefs =
  gql`
  extend type Query{
    reviews:reviewsResult
    review(id: ID!):Review
  }

  type reviewsResult{
    data:[Review],
    message:String,
    status:Int
  }
  type Review {
    id: ID!,
    review: String,
    createdAt: String,
    updatedAt:String,
    created_name:String,

 }
 extend type Mutation{
  createReview(input: ReviewInput): Output
  updateReview(id: ID!, input: ReviewInput): Output
  deleteReview(id: ID!): Output
 }
 input ReviewInput{
  review:String,
  userId:String
 }
  `
const resolvers = {
  Query: {
    reviews: async (obj, args, context, info) => {
      let dt = await db.query('select * from review where deleted is null')
      // console.log(dt);
      return { data: dt[0], status: 200, message: 'Success' };
    },
    review: async (obj, args, context, info) => {
      console.log("get review");
      let dt = await db.query(`select * from review where id= $1`, { bind: [args.id], type: QueryTypes.SELECT })
      // console.log(dt);
      return dt[0];
    }
  },
  Mutation: {
    createReview: async (_, { input }) => {
      try {
        input.id = uuidv4()
        console.log(input);
        await reviewModel.create(input)
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
    updateReview: async (_, { id, input }) => {
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
    deleteReview: async (_, { id }) => {
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