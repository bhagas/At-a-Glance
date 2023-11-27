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
    createdAt: String,
    updatedAt:String,
    created_name:String,
    email:String,
    name:String,
    period_start:String,
  period_end:String,
  productive:Float,
  accountable:Float,
  proactive:Float,
  attitude:Float,
  productive_text:String,
  accountable_text:String,
  proactive_text:String,
  attitude_text:String,
  evalution_goals:String,
  employee_verification_date:String,
  manager_verification_date:String,
  published:Boolean
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

  userId:String,
  period_start:String,
  period_end:String,
  productive:Float,
  accountable:Float,
  proactive:Float,
  attitude:Float,
  productive_text:String,
  accountable_text:String,
  proactive_text:String,
  attitude_text:String,
  evalution_goals:String,
  employee_verification_date:String,
  manager_verification_date:String,
  published:Boolean
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
    
      let dt = await db.query('select b."id" as "userId", a."created_by", b.email, b.name,  (select name from users where id = a.created_by) as created_name, COUNT(a.*) as count from review a right join users b on a."userId" = b.id where a.deleted is null '+a+' GROUP BY b."id", a."created_by", b.email, b.name', {
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
          "userId": input.userId,
          "period_start": input.period_start,
          "period_end": input.period_end,
          "productive": input.productive,
          "accountable": input.accountable,
          "proactive": input.proactive,
          "attitude": input.attitude,
          "productive_text": input.productive_text,
          "accountable_text": input.accountable_text,
          "proactive_text": input.proactive_text,
          "attitude_text": input.attitude_text,
          "evalution_goals": input.evalution_goals,
          "employee_verification_date": input.employee_verification_date,
          "manager_verification_date": input.manager_verification_date,
          "published":input.published,
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