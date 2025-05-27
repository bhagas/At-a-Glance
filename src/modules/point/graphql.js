
import Model from './model.js'
import { QueryTypes } from 'sequelize';
import gql from 'graphql-tag';
import { v4 as uuidv4 } from 'uuid';
import db from '../../config/koneksi.js';
const typeDefs =
//total point by user
//list point all user
//transactions list by user
//update user transactions
//add point to users manualy
//remove point to users manualy
  gql`
  extend type Query{
    totalPointAllUsers:totalPointAllResult
    totalPointUser(user_id: ID!):totalPointAllResult
    pointTransactionsUser(user_id: ID!):totalPointResult
  }

  type totalPointAllResult{
    data:[totalPointAllUsers],
    message:String,
    status:Int
  }

  type totalPointResult{
    data:[transactionsPoint],
    message:String,
    status:Int
  }
  

  type transactionsPoint {
    id: ID!, 
    user_id:String,
    point:String,

    desc: String,
    point_type:point_type
 }

 type totalPointAllUsers {
    user_id:String,
    email:String,
    name:String,
    total_point:Int
 }


 extend type Mutation{
  addUsersPoint(input: updatePointInput): Output
  removeUsersPoint(input: updatePointInput): Output
 }
 input updatePointInput{

    user_id:String,
    point:String,

    desc: String,
    point_type:point_type
 
 }
 enum point_type {
  REDEEM
  ADJUSTMENT
  SYSTEM_ADDED
}
  `
const resolvers = {
  Query: {
    totalPointAllUsers: async (obj, args, context, info) => {
      try {
        let replacements = {}
      let a = "";
    //   if (args.input) {
    //     if (args.input.userId) {
    //       a += ` AND a."userId" = :userId`;
    //       replacements.userId = args.input.userId;
    //   }
    // }
     
      let dt = await db.query('select (sum(point_debit) - sum(point_credit)) as total_point, pl.user_id, us.email, us."name" from point_log pl join users us on pl.user_id =us.id group by pl.user_id, us.email, us."name"'+a, {
        replacements
      })
      // console.log(dt);
      return { data: dt[0], status: 200, message: 'Success' };
      } catch (error) {
          console.log(error);
          return { data: error, status: 500, message: 'Failed' };
      }
      
    },

  
    totalPointUser: async (obj, args, context, info) => {
      // console.log("get review");
      try {
        let dt = await db.query(`select (sum(point_debit) - sum(point_credit)) as total_point, pl.user_id, us.email, us."name" from point_log pl join users us on pl.user_id =us.id where pl.user_id=$1 group by pl.user_id, us.email, us."name"`, { bind: [args.user_id], type: QueryTypes.SELECT })
        // console.log(dt);
        // return dt[0];
        return { data: dt, status: 200, message: 'Success' };
      } catch (error) {
        console.log(error);
        return { data: error, status: 500, message: 'Failed' };
      }
   
    },
    pointTransactionsUser: async (obj, args, context, info) => {
        // console.log("get review");
        try {
          let dt = await db.query(`select pl.id, point_debit, point_credit, pl.user_id, us.email, us."name", pl."createdAt", mp.id as process_code, mp.process_name, mp.point  from point_log pl join users us on pl.user_id =us.id join ms_point mp on pl.ms_point_id = mp.id where pl.user_id=$1`, { bind: [args.user_id], type: QueryTypes.SELECT })
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
    addUsersPoint: async (_, { input }, context) => {
      try {
        // input.id = uuidv4()
        // console.log(input);
        // process_name:String,
        // process_code:String,
        // point:Int
        // let dt = await db.query('select a.* from ms_point a where a.deleted is null AND a."id" = :process_code', {
        //     replacements
        //   })
          // console.log(dt[0]);
          let replacements = {}
          replacements.user_id = input.user_id
              let total = await db.query('select (sum(point_debit) - sum(point_credit)) as total from point_log pl where user_id = :user_id', {
                  replacements
                })
                let ttl=0
              if(total[0].length){
                  if(total[0][0].total){
                      ttl=parseInt(total[0][0].total)+input.point
                  }else{
                      ttl=input.point
                  }
              }else{
                ttl=input.point
              }
              
              let dataInput = {
                  "id": uuidv4(),
                  "point_debit": input.point,
                  "point_credit": 0,
                  "total_point":ttl,
                  "desc":input.desc,
                  "user_id": input.user_id,
                  "point_type": input.point_type
                }
              //   console.log(dataInput);
                
              await Model.create(dataInput)
              //  console.log(h);
               

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
    removeUsersPoint: async (_, { id, input }) => {
        try {
            // input.id = uuidv4()
            // console.log(input);
            // process_name:String,
            // process_code:String,
            // point:Int
            // let dt = await db.query('select a.* from ms_point a where a.deleted is null AND a."id" = :process_code', {
            //     replacements
            //   })
              // console.log(dt[0]);
              let replacements = {}
              replacements.user_id = input.user_id
                  let total = await db.query('select (sum(point_debit) - sum(point_credit)) as total from point_log pl where user_id = :user_id', {
                      replacements
                    })
                    let ttl=0
                  if(total[0].length){
                      if(total[0][0].total){
                          ttl=parseInt(total[0][0].total)-input.point
                      }
                  }
                  
                  let dataInput = {
                      "id": uuidv4(),
                      "point_debit": 0,
                      "point_credit": input.point,
                      "total_point":ttl,
                      "desc":input.desc,
                      "user_id": input.user_id,
                      "point_type": input.point_type
                    }
                  //   console.log(dataInput);
                    
                  await Model.create(dataInput)
                  //  console.log(h);
                   
    
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