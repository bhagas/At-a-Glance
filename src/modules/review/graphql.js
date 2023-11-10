import db from '../../config/koneksi.js';
import reviewModel from './model.js'
import { QueryTypes } from 'sequelize';
import gql from 'graphql-tag';
import { v4 as uuidv4 } from 'uuid';
const typeDefs =
  gql`
  extend type Query{
    reviews(input: filterReviewInput):reviewsResult
    reviewsByRating(input: filterReviewInput):reviewsRatingResult
    review(id: ID!):Review
  }

  type reviewsResult{
    data:[Review],
    message:String,
    status:Int
  }
  type reviewsRatingResult{
    data:[ReviewGroupRating],
    message:String,
    status:Int
  }
  type Review {
    id: ID!,
    review: String,
    createdAt: String,
    updatedAt:String,
    created_name:String,
    email:String,
    rating:Int,
    name:String
 }

 type ReviewGroupRating {
    rating:Int,
    name:String,
    email:String,
    userId:String,
    count:Int
 }
 extend type Mutation{
  createReview(input: ReviewInput): Output
  updateReview(id: ID!, input: ReviewInput): Output
  deleteReview(id: ID!): Output
 }
 input ReviewInput{
  review:String,
  userId:String,
  rating:Int
 }

 input filterReviewInput{
  userId:String
 }
  `
const resolvers = {
  Query: {
    reviews: async (obj, args, context, info) => {
      try {
        let replacements = {}
      let a = "";
      if (args.input) {
        if (args.input.userId) {
          a += ` AND a."userId" = :userId`;
          replacements.userId = args.input.userId;
      }
    }
     
      let dt = await db.query('select a.*, b.email, b.name,  (select name from users where id = a.created_by) as created_name from review a join users b on a."userId" = b.id where a.deleted is null'+a, {
        replacements
      })
      // console.log(dt);
      return { data: dt[0], status: 200, message: 'Success' };
      } catch (error) {
          console.log(error);
          return { data: error, status: 500, message: 'Failed' };
      }
      
    },

    reviewsByRating: async (obj, args, context, info) => {
      try {
        let replacements = {}
      let a = "";
      if (args.input) {
        if (args.input.userId) {
          a += ` AND a."userId" = :userId`;
          replacements.userId = args.input.userId;
      }
    }
     
      let dt = await db.query('select a."userId", a."created_by", b.email, b.name,  (select name from users where id = a.created_by) as created_name, AVG(a.rating) as rating, COUNT(a.*) as count from review a right join users b on a."userId" = b.id where a.deleted is null '+a+' GROUP BY a."userId", a."created_by", b.email, b.name', {
        replacements
      })
      // console.log(dt);
      return { data: dt[0], status: 200, message: 'Success' };
      } catch (error) {
          console.log(error);
          return { data: error, status: 500, message: 'Failed' };
      }
      
    },
    review: async (obj, args, context, info) => {
      console.log("get review");
      let dt = await db.query(`select a.*, b.email, b.name,  (select name from users where id = a.created_by) as created_name from review a join users b on a."userId" = b.id where a.deleted is null and a.id= $1`, { bind: [args.id], type: QueryTypes.SELECT })
      // console.log(dt);
      return dt[0];
    }
  },
  Mutation: {
    createReview: async (_, { input }, context) => {
      try {
        // input.id = uuidv4()
        // console.log(input);
        let data = {
          "id": uuidv4(),
          "review": input.review,
          "rating": input.rating,
          "userId": input.userId,
          "created_by":context.user_app.id
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