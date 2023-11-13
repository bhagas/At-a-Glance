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
 travelCheckinStatus(user_id: ID!): checkInStatusResult

}



 extend type Mutation{
  travelCheckin(user_id: ID!): Output
  travelCheckout(id:ID!, user_id:ID!): Output

 }

  `
const resolvers = {
  Query: {
  
    travelCheckinStatus: async (obj, args, context, info) => {
      try {
        let replacements = {}
      let a = "";
      if (args) {
        if (args.user_id) {
          a += ` AND a."user_id" = :user_id`;
          replacements.user_id = args.user_id;
      }
     
    }
     
      let dt = await db.query('select a.* from travel_log a where a."deletedAt" is null order by a."createdAt" desc limit 1'+a, {
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
    travelCheckin: async (_, { input }, context) => {
      try {
        // input.id = uuidv4()
        // console.log(input);
        let data = {
          "id": uuidv4(),
      
          "user_id": input.user_id,
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
    travelCheckout: async (_, { input, id }) => {
      try {
        let data = {
    
          "user_id": input.user_id,
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