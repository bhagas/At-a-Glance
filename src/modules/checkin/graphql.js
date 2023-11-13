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
 getUserHours(user_id: ID!, fd_ticket_id:ID!): getUserHoursResult
 getAllUserHours(fd_ticket_id:ID!): getAllUserHoursResult
}

type checkInStatusResult{
  data:checkInStatus,
  message:String,
  status:Int
}
type getUserHoursResult{
  data:userHours,
  message:String,
  status:Int
}
type getAllUserHoursResult{
  data:[userHours],
  message:String,
  status:Int
}
type checkInStatus{
    isCheckedIn:Boolean!
    id:ID
}
type userHours{
    totalMinutes:Int!,
    hourConvert:Int!,
    minuteConvert:Int!,
    hour_salary:Float,
    total_salary:Float,
    user_id:ID,
    name:String
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
    getUserHours: async (obj, args, context, info) => {
      try {
      let replacements = {}
      let a = "";
      let b ="";
      let user_id="";
      let id_agent = "";
      if (args) {
        // console.log(args);
        if (args.user_id) {
          a += ` AND a."user_id" = :user_id`;
          b += ` AND a."id_member" = :user_id`;
          replacements.user_id = args.user_id;
          user_id=args.user_id;
          let user = await db.query(`select a.* from users a where a."id" = :user_id`,{
            replacements:{user_id}
          });
          // console.log(user[0]);
          if(user[0].length){
            let is_agent = await db.query(`select a.* from fd_agents a where a."email" = :email`,{
              replacements:{email: user[0][0].email}
            });
            // console.log(is_agent[0], 'abcde');
            if(is_agent[0].length){
              
              id_agent=is_agent[0][0].id;
            }
          }
      }


      if (args.fd_ticket_id) {
        a += ` AND a."fd_ticket_id" = :fd_ticket_id`;
        replacements.fd_ticket_id = args.fd_ticket_id;
    }
    }
     
      let dt = await db.query('select a.* from check_in a where a."deletedAt" is null and a.check_in is not null and a.check_out is not null '+a+' order by a."createdAt"  desc', {
        replacements
      })
      let totalMinutes = 0;
      if(dt[0].length){
        for (let i = 0; i < dt[0].length; i++) {
          let duration = moment.duration(moment(dt[0][i].check_out).diff(moment(dt[0][i].check_in)));
          // console.log(duration);
          totalMinutes += duration.asMinutes();
      
        }
     
      }
      // console.log(totalMinutes/60);
      let hours = Math.floor(totalMinutes / 60);          
      let minutes = Math.ceil(totalMinutes % 60);
      // console.log(hours, minutes);
  
      let hour_salary = 0;
      let total_salary=0;
      let dt2 = await db.query('select a.* from fd_agent_member a where a."deleted" is null '+b, {
        replacements
      })
      if(dt2[0].length){
        hour_salary=dt2[0][0].hour_salary;
        total_salary=((totalMinutes / 60) * hour_salary).toFixed(2);
      }
      if(id_agent){
        let dt3 = await db.query('select a.* from fd_agents a where a."deleted" is null AND id = :id_agent', {
          replacements:{id_agent}
        })
        if(dt3[0].length){
          hour_salary=dt3[0][0].hour_salary;
          total_salary=((totalMinutes / 60) * hour_salary).toFixed(2);
        }
      }
      totalMinutes=Math.ceil(totalMinutes);
      // console.log(totalMinutes, hours, minutes);
      return { data: { 
        totalMinutes,
        hourConvert:hours,
        minuteConvert:minutes,
        hour_salary,
        total_salary,
        user_id
      }, status: 200, message: 'Ok' };
      } catch (error) {
        console.log(error);
        return { data: error, status: 500, message: 'Failed' };
      }
      
    },
    getAllUserHours: async (obj, args, context, info) => {
      try {
      let replacements = {}
      let a = "";
      let b ="";
      let user_id="";
      let id_agent = "";
      let hasil =[];
      let user_name=""
      if (args.fd_ticket_id) {
        a += ` AND a."fd_ticket_id" = :fd_ticket_id`;
        replacements.fd_ticket_id = args.fd_ticket_id;
    }
      let dtx = await db.query('select user_id from check_in a where a."deletedAt" is null and a.check_in is not null and a.check_out is not null and user_id is not null  AND a."fd_ticket_id" = :fd_ticket_id group by a.user_id',{
        replacements:{fd_ticket_id:args.fd_ticket_id}
      })
      if (dtx[0].length) {
        for (let u = 0; u < dtx[0].length; u++) {
          if (dtx[0][u].user_id) {
            a += ` AND a."user_id" = :user_id`;
            b += ` AND a."id_member" = :user_id`;
            replacements.user_id =dtx[0][u].user_id;
            user_id=dtx[0][u].user_id;
            let user = await db.query(`select a.* from users a where a."id" = :user_id`,{
              replacements:{user_id}
            });
            // console.log(user[0]);
            if(user[0].length){
              user_name = user[0][0].name;
              let is_agent = await db.query(`select a.* from fd_agents a where a."email" = :email`,{
                replacements:{email: user[0][0].email}
              });
              // console.log(is_agent[0], 'abcde');
              if(is_agent[0].length){
                
                id_agent=is_agent[0][0].id;
              }
            }
        }
            let dt = await db.query('select a.* from check_in a where a."deletedAt" is null and a.check_in is not null and a.check_out is not null '+a+' order by a."createdAt"  desc', {
              replacements
            })
            let totalMinutes = 0;
            if(dt[0].length){
              for (let i = 0; i < dt[0].length; i++) {
                let duration = moment.duration(moment(dt[0][i].check_out).diff(moment(dt[0][i].check_in)));
                // console.log(duration);
                totalMinutes += duration.asMinutes();
            
              }
           
            }
            // console.log(totalMinutes/60);
            let hours = Math.floor(totalMinutes / 60);          
            let minutes = Math.ceil(totalMinutes % 60);
            // console.log(hours, minutes);
        
            let hour_salary = 0;
            let total_salary=0;
            let dt2 = await db.query('select a.* from fd_agent_member a where a."deleted" is null '+b, {
              replacements
            })
            if(dt2[0].length){
              hour_salary=dt2[0][0].hour_salary;
              total_salary=((totalMinutes / 60) * hour_salary).toFixed(2);
            }
            if(id_agent){
              let dt3 = await db.query('select a.* from fd_agents a where a."deleted" is null AND id = :id_agent', {
                replacements:{id_agent}
              })
              if(dt3[0].length){
                hour_salary=dt3[0][0].hour_salary;
                total_salary=((totalMinutes / 60) * hour_salary).toFixed(2);
              }
            }
            totalMinutes=Math.ceil(totalMinutes);
            hasil.push({ 
              totalMinutes,
              hourConvert:hours,
              minuteConvert:minutes,
              hour_salary,
              total_salary,
              user_id,
              name:user_name
            })
        }
 
    }

      return { data: hasil, status: 200, message: 'Ok' };
      } catch (error) {
        console.log(error);
        return { data: error, status: 500, message: 'Failed' };
      }
      
    },
    checkinStatus: async (obj, args, context, info) => {
      try {
        let replacements = {}
      let a = "";
      if (args) {
        if (args.user_id) {
          a += ` AND a."user_id" = :user_id`;
          replacements.user_id = args.user_id;
      }
      if (args.fd_ticket_id) {
        a += ` AND a."fd_ticket_id" = :fd_ticket_id`;
        replacements.fd_ticket_id = args.fd_ticket_id;
    }
    }
     
      let dt = await db.query('select a.* from check_in a where a."deletedAt"  is null '+a+' order by a."createdAt" desc limit 1', {
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
          "ticket_id": input.ticket_id,
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
    checkout: async (_, { input, id }) => {
      try {
        let data = {
          "fd_ticket_id": input.fd_ticket_id,
          "ticket_id": input.ticket_id,
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