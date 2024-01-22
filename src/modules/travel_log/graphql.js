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
 travelHours(user_id:ID!, startDate: String!, endDate: String!): travelStatusOutput
 getAllUserPosition: AllUserPositionOutput
 getMemberPositionByAgent(id_agent:ID!): AllUserPositionOutput
 getUserTravelLog(user_id:ID!, dateStart: String!, dateEnd: String!): userTravelLogOutput
}

type travelStatusOutput{
    data:travelStatus,
    message:String,
    status:Int,
    error:String
  }
type userTravelLogOutput{
  data:[userTravelLog],
    message:String,
    status:Int,
    error:String
}
type userTravelLog{
  travel_id:ID,
    startTravel:String,
    endTravel:String,
    checkin_travel_location:String,
    checkout_travel_location:String,
    ticket_log:[ticketCheckinLog]
}
type ticketCheckinLog{
  ticket_id:ID,
  subject:String,
  checkin_log:[checkin_log]
}
type checkin_log{
  id:ID,
          fd_ticket_id: ID,
          ticket_id: ID,
          user_id: ID,
          check_in: String,
          checkin_location:String,
          check_out:  String,
          checkout_location:String,
}
  type AllUserPositionOutput{
    data:[AllUserPosition],
    message:String,
    status:Int,
    error:String
  }
  type AllUserPosition{
    travel_id:String,
    user_id:ID,
    isTraveling:Boolean,
    travel_start:String,
    isOnSite:Boolean,
    ticket_id:ID,
    email:String,
    name:String,
    onSite_start:String,
    travel_start_location:String,
    site_location:String,
    ticket_subject:String
   
  }
type travelStatus{
    totalMinutes:Float
    totalMinutesOnSite:Float
}


 extend type Mutation{
  travelCheckin(user_id: ID!, location:String, long:String, lat:String, time:String): Output
  travelCheckout(id:ID!, user_id:ID!, location:String, long:String, lat:String, time:String): Output

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
     
      let dt = await db.query('select a.* from travel_log a where a."deletedAt" is null '+a+' order by a."createdAt" desc limit 1', {
        replacements
      })
      // console.log(dt);
      // let output = {
      //   isCheckedIn:false,
      //   id:null
      // }
      // if(dt[0].length){
      //   if(dt[0][0].check_out==null){
      //       output.isCheckedIn=true;
      //       output.id = dt[0][0].id;
      //   } 
      // }

      let output = {
        isCheckedIn:false,
        id:null
    
      }
      if(dt[0].length){
        output.location = "";
        if(dt[0][0].check_out==null){
            output.isCheckedIn=true;
            output.id = dt[0][0].id;
            output.location = dt[0][0].checkin_location;
        } else{
          output.location = dt[0][0].checkout_location;
        }
      }

      return { data: output, status: 200, message: 'Success' };
      } catch (error) {
          console.log(error);
          return { data: error, status: 500, message: 'Failed' };
      }
      
    },

    travelHours: async (obj, args, context, info) => {
        try {
          let replacements = {}
        let a = "";
        if (args) {
          if (args.user_id) {
            a += ` AND a."user_id" = :user_id`;
            replacements.user_id = args.user_id;
        }
        if (args.startDate && args.endDate) {
            a += ` AND  a."check_in" >= :startDate AND  a."check_in" <= :endDate`;
            replacements.startDate = args.startDate;
            replacements.endDate = args.endDate;
        }
       
      }
       
        let dt = await db.query('select a.* from travel_log a where a."deletedAt" is null '+a+' AND a."check_in" is not null AND a."check_out" is not null order by a."createdAt" desc', {
          replacements
        })
        console.log(dt);
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
      getAllUserPosition: async (obj, args, context, info) => {
        try {
          let replacements = {}
        let a = "";
        let output =[]
        // user_id:ID,
        // isTraveling:Boolean,
        // isOnSite:Boolean,
        // ticket_id:ID,
        // email:String,
        // name:String
        let dt = await db.query('select a.* from users a where a."deleted" is null', {
          replacements
        })
        // console.log(dt[0]);
       for (let i = 0; i < dt[0].length; i++) {
        let dt2 = await db.query('select a.*, CAST(a."check_in" AS TEXT) as check_in_convert from travel_log a where a."deletedAt" is null and a.check_out is null and user_id=:user_id', {
            replacements:{user_id:dt[0][i].id}
          })
      
          let isTraveling = false;
          let travel_start ="";
          let travel_start_location=""
          let travel_id="";
          if(dt2[0].length){
            isTraveling=true;
            travel_id = dt2[0][0].id;
            travel_start = dt2[0][0].check_in_convert;
            travel_start_location = dt2[0][0].checkin_location;
          }
          let dt3 = await db.query('select a.*, b.subject, CAST(a."check_in" AS TEXT) as check_in_convert from check_in a join fd_tickets b on a.fd_ticket_id = b.ticket_id::varchar where a."deletedAt" is null and a.check_out is null and user_id=:user_id', {
            replacements:{user_id:dt[0][i].id}
          })
          let isOnSite = false;
          let ticket_id ="";
          let onSite_start="";
          let site_location="";
          let subject = "";
          if(dt3[0].length){
            isOnSite=true;
            onSite_start = dt3[0][0].check_in_convert;
            ticket_id= dt3[0][0].fd_ticket_id;
            site_location = dt3[0][0].checkin_location;
            subject = dt3[0][0].subject;
          }
            let obj = {
                user_id: dt[0][i].id,
                isTraveling,
                travel_start,
                isOnSite,
                onSite_start,
                ticket_id,
                email:dt[0][i].email,
                name:dt[0][i].name,
                travel_start_location,
                site_location,
                ticket_subject:subject
            }
            output.push(obj)
       }
        return { data: output, status: 200, message: 'Success' };
        } catch (error) {
            console.log(error);
            return { data: error, status: 500, message: 'Failed' };
        }
        
      },

      getMemberPositionByAgent: async (obj, {id_agent}, context, info) => {
        try {
          let replacements = {}
        let a = "";
        let output =[]
        // user_id:ID,
        // isTraveling:Boolean,
        // isOnSite:Boolean,
        // ticket_id:ID,
        // email:String,
        // name:String
       let dt = await db.query('select a.* from fd_agents fam join users a on fam.email = a.email where a."deleted" is null and fam.id=:id_agent', {
          replacements:{id_agent}
        })
        let member = await db.query('select a.* from fd_agent_member fam join users a on fam.id_member = a.id where a."deleted" is null and fam.id_agent=:id_agent', {
          replacements:{id_agent}
        })
        if(member[0].length){
          dt[0] = dt[0].concat(member[0]);
        }

        // console.log(dt[0]);
       for (let i = 0; i < dt[0].length; i++) {
        let dt2 = await db.query('select a.*, CAST(a."check_in" AS TEXT) as check_in_convert from travel_log a where a."deletedAt" is null and a.check_out is null and user_id=:user_id', {
            replacements:{user_id:dt[0][i].id}
          })
      
          let isTraveling = false;
          let travel_start ="";
          let travel_start_location=""
          let travel_id="";
          if(dt2[0].length){
            isTraveling=true;
            travel_id = dt2[0][0].id;
            travel_start = dt2[0][0].check_in_convert;
            travel_start_location = dt2[0][0].checkin_location;
          }
          let dt3 = await db.query('select a.*, b.subject, CAST(a."check_in" AS TEXT) as check_in_convert from check_in a join fd_tickets b on a.fd_ticket_id = b.ticket_id::varchar where a."deletedAt" is null and a.check_out is null and user_id=:user_id', {
            replacements:{user_id:dt[0][i].id}
          })
          let isOnSite = false;
          let ticket_id ="";
          let onSite_start="";
          let site_location="";
          let subject = "";
          if(dt3[0].length){
            isOnSite=true;
            onSite_start = dt3[0][0].check_in_convert;
            ticket_id= dt3[0][0].fd_ticket_id;
            site_location = dt3[0][0].checkin_location;
            subject = dt3[0][0].subject;
          }
            let obj = {
                user_id: dt[0][i].id,
                isTraveling,
                travel_start,
                isOnSite,
                onSite_start,
                ticket_id,
                email:dt[0][i].email,
                name:dt[0][i].name,
                travel_start_location,
                site_location,
                ticket_subject:subject
            }
            output.push(obj)
       }
        return { data: output, status: 200, message: 'Success' };
        } catch (error) {
            console.log(error);
            return { data: error, status: 500, message: 'Failed' };
        }
        
      },

      getUserTravelLog: async (obj, args, context, info) => {
        try {
          // console.log(context);
          let replacements = {}
        let a = "";
        if (args) {
          if (args.user_id) {
            a += ` AND a."user_id" = :user_id`;
            replacements.user_id = args.user_id;
          }

          if (args.dateStart && args.dateEnd) {
            // $1::timestamp
            a += ` AND (a."check_in"::date >= :dateStart AND a."check_in"::date<=:dateEnd)`;
            replacements.dateStart = args.dateStart;
            replacements.dateEnd = args.dateEnd;
          }
      }
       
        let dt = await db.query('select a.*, CAST(a."check_in" AS TEXT) as check_in_convert , CAST(a."check_out" AS TEXT) as check_out_convert  from travel_log a where a."deletedAt" is null '+a+' order by a."createdAt" desc', {
          replacements
        })
        // console.log(dt[0]);
        let result=[]
        if(dt[0].length){
          for (let y = 0; y < dt[0].length; y++) {
            let output = {
              travel_id:null,
              startTravel:null,
              endTravel:null,
              checkout_travel_location:null,
              checkin_travel_location:null,
              ticket_log:[]
          
            }
            output.travel_id = dt[0][y].id;
            output.startTravel = dt[0][y].check_in_convert;
            output.endTravel = dt[0][y].check_out_convert;
            output.checkin_travel_location = dt[0][y].checkin_location;
            output.checkout_travel_location = dt[0][y].checkout_location;

            replacements.dateStart = dt[0][y].check_in_convert;
            replacements.dateEnd = dt[0][y].check_out_convert;
            let dt2 = await db.query(`select distinct(fd_ticket_id) as ticket_id, b.subject from check_in a join fd_tickets b on a.fd_ticket_id = b.ticket_id::varchar where a."deletedAt" is null ${a}`, {
              replacements
            })
           
            // console.log(dt2[0]);
            if(dt2[0].length){
              output.ticket_log = dt2[0];
              
              for (let i = 0; i < output.ticket_log.length; i++) {
                output.ticket_log[i].checkin_log = [];
                let dt3 = await db.query(`select id, fd_ticket_id, ticket_id,user_id,checkin_location,checkout_location, CAST(a."check_in" AS TEXT) as check_in, CAST(a."check_out" AS TEXT) as check_out from check_in a where a."deletedAt" is null and fd_ticket_id='${output.ticket_log[i].ticket_id}' ${a}`, {
                  replacements
                })
                if(dt3[0].length){
                  output.ticket_log[i].checkin_log = dt3[0]
                }
                
                // console.log(dt3[0]);
                
              }
              
            }
            result.push(output)
          }
        
         
        }
       
        return { data: result, status: 200, message: 'Success' };
        } catch (error) {
            console.log(error);
            return { data: error, status: 500, message: 'Failed' };
        }
        
      },
  },
  Mutation: {
    travelCheckin: async (_, { user_id, location, long,lat, time }, context) => {
      try {
        // input.id = uuidv4()
        // console.log(input);
        let check_in = moment();
        if(time){
          check_in = time;
        }
        let data = {
          "id": uuidv4(),
          "checkin_location":location,
          "checkin_long":long,
          "checkin_lat":lat,
          "user_id": user_id,
          "check_in":  check_in
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
    travelCheckout: async (_, { user_id, id, location, long,lat, time }) => {
      try {
        let check_out = moment();
        if(time){
          check_out = time;
        }
        let data = {
          "checkout_location":location,
          "checkout_long":location,
          "checkout_lat":location,
          "user_id": user_id,
          "check_out":  check_out
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