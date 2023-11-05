import db from '../../config/koneksi.js';
import checkInModel from './model.js'
import { QueryTypes } from 'sequelize';
import gql from 'graphql-tag';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment/moment.js';
const typeDefs =
  gql`
 extend type Query {

 "Query untuk user by id"
 checkinStatus(user_id: ID!, fd_ticket_id:ID!): checkInStatusResult
}

type checkInStatusResult{
  data:checkInStatus,
  message:String,
  status:Int
}
type checkInStatus{
    isCheckedIn:Boolean!
    id:ID
}
 extend type Mutation{
  checkin(input: checkPointInput): Output
  checkout(id:ID!, input: checkPointInput): Output

 }

 input checkPointInput{
  fd_ticket_id:ID,
  ticket_id:String,
  user_id:String
 }

  `
const resolvers = {
  Query: {
    checkinStatus: async (obj, args, context, info) => {
      try {
        let replacements = {}
      let a = "";
      if (args.input) {
        if (args.input.user_id) {
          a += ` AND a."user_id" = :user_id`;
          replacements.user_id = args.input.user_id;
      }
      if (args.input.fd_ticket_id) {
        a += ` AND a."fd_ticket_id" = :fd_ticket_id`;
        replacements.fd_ticket_id = args.input.fd_ticket_id;
    }
    }
     
      let dt = await db.query('select a.* from check_in a where a."deletedAt" is null order by a."createdAt" desc limit 1'+a, {
        replacements
      })
      // console.log(dt);
      let output = {
        isCheckedIn:false,
        id:null
      }
      if(dt[0].length){
        if(dt[0][0].check_out==null){
            output.isCheckedIn=true;
            output.id = dt[0][0].id;
        } 
      }
      return { data: output, status: 200, message: 'Success' };
      } catch (error) {
          console.log(error);
          return { data: error, status: 500, message: 'Failed' };
      }
      
    },

  },
  Mutation: {
    checkin: async (_, { input }, context) => {
      try {
        // input.id = uuidv4()
        // console.log(input);
        let data = {
          "id": uuidv4(),
          "fd_ticket_id": input.fd_ticket_id,
          "ticket_id": input.fd_conv_id,
          "check_in":  moment()
        }
        await checkInModel.create(data)
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
    checkout: async (_, { input, id }) => {
      try {
        let data = {
      
            "fd_ticket_id": input.fd_ticket_id,
            "ticket_id": input.fd_conv_id,
            "check_out":  moment()
          }
        await checkInModel.update(
          data,
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
    }

  }
}
export { typeDefs, resolvers }