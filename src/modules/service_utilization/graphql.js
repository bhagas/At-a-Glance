import db from '../../config/koneksi.js';
import reviewModel from './model.js'
import { QueryTypes } from 'sequelize';
import gql from 'graphql-tag';
import pubsub from '../../config/redis.js';
import { v4 as uuidv4 } from 'uuid';
const typeDefs =
  gql`
    scalar JSONObject
extend type Subscription {
    updateKpi: SyncKpi
}
type SyncKpi {
    status: String
}
  extend type Query{
    serviceUtilization:serviceUtilizationResult
     kpi:kpiResult
    # version(id: ID!):Version
  }

  type serviceUtilizationResult{
    data:[serviceUtilization],
    message:String,
    status:Int
  }

  type serviceUtilization {
   name:String,
   email:String,
   total_hour:String,
   total_amount:String,
   total_billable:String,
   last_activity:String
 }

  type kpiResult{
    data:kpi,
    message:String,
    status:Int
  }

  type kpi {
   totalExpenses:String,
   revenueAtRisk:String,
   avgBillable:String,
   projectOnTracks:String,
 }

# type day_graph{
#     date:String,
#     count:Int
#   }
#  extend type Mutation{
#   createVersion(input: VersionInput): Output
#   updateVersion(id: ID!, input: VersionInput): Output
#   deleteVersion(id: ID!): Output
#  }
#  input VersionInput{

#   log:String,
#   date:String,
#   version:String,
 
#  }
  `
const resolvers = {
  Query: {
    serviceUtilization: async (obj, args, context, info) => {
      try {
        let replacements = {}
      let a = "";
    //   if (args.input) {
    //     if (args.input.userId) {
    //       a += ` AND a."userId" = :userId`;
    //       replacements.userId = args.input.userId;
    //   }
    // }
     
      let dt = await db.query(`SELECT 
a."name" , a.email , a.id, 
    SUM(EXTRACT(EPOCH FROM (b.check_out - b.check_in)) / 3600) AS total_hour,
    (select SUM(amount::float) from fd_expense_log fel where created_by = a.id) as total_amount,
      (select SUM(amount::float) from fd_expense_log fel where created_by = a.id and fel."action"='APPROVE') as total_billable,
    (select tl.check_in from travel_log tl where tl.user_id=a.id order by tl.check_in desc limit 1) as last_activity
from "users" a left join travel_log b on a.id = b.user_id 
where a.deleted is null
GROUP BY  a."name" , a.email , a.id;`+a, {
        replacements
      })
      // console.log(dt[0]);
      return { data: dt[0], status: 200, message: 'Success' };
      } catch (error) {
          console.log(error);
          return { data: error, status: 500, message: 'Failed' };
      }
      
    },

     kpi: async (obj, args, context, info) => {
      try {
        let replacements = {}
      let a = "";
    //   if (args.input) {
    //     if (args.input.userId) {
    //       a += ` AND a."userId" = :userId`;
    //       replacements.userId = args.input.userId;
    //   }
    // }
     
      let totalExpenses = await db.query(`select SUM(amount::float) as total_expenses from fd_expense_log fel`+a, {
        replacements
      })
       let avgBillable = await db.query(`select SUM(amount::float) as total_billable from fd_expense_log fel where fel."action"='APPROVE'`+a, {
        replacements
      })
      
        let projectOnTracks = await db.query(`SELECT COUNT(*) as project_on_tracks FROM fd_tickets WHERE status <> 4 AND status <> 5 ${a}`, {
        replacements
      })
      // console.log(totalExpenses);
      return { data: {revenueAtRisk:'0',totalExpenses: totalExpenses[0][0].total_expenses, avgBillable: avgBillable[0][0].total_billable, projectOnTracks:projectOnTracks[0][0].project_on_tracks}, status: 200, message: 'Success' };
      } catch (error) {
          console.log(error);
          return { data: error, status: 500, message: 'Failed' };
      }
      
    },

  
  },
    Subscription: {
    updateKpi: {
      // More on pubsub below
      subscribe: () => pubsub.asyncIterator(['UPDATE_TICKET']),
    },
  },
  // Mutation: {
  //   createVersion: async (_, { input }, context) => {
  //     try {
  //       // input.id = uuidv4()
  //       // console.log(input);
  //       let data = {
  //         "id": uuidv4(),
  //         "version": input.version,
  //         "log": input.log,
  //         "date": input.date
  //       }
  //       await reviewModel.create(data)
  //       return {
  //         status: '200',
  //         message: 'Success'
  //       }
  //     } catch (error) {
  //       console.log(error);
  //       return {
  //         status: '500',
  //         message: 'Failed',
  //         error: JSON.stringify(error)
  //       }
  //     }
  //   },
  //   updateVersion: async (_, { id, input }) => {
  //     try {
        
  //       await reviewModel.update(
  //         input,
  //         { where: { id } }
  //       )
  //       return {
  //         status: '200',
  //         message: 'Updated'
  //       }
  //     } catch (error) {
  //       console.log(error);
  //       return {
  //         status: '500',
  //         message: 'Failed',
  //         error: JSON.stringify(error)
  //       }
  //     }
  //   },
  //   deleteVersion: async (_, { id }) => {
  //     try {
  //       await reviewModel.destroy(
  //         { where: { id } }
  //       )
  //       return {
  //         status: '200',
  //         message: 'Removed'
  //       }
  //     } catch (error) {
  //       return {
  //         status: '500',
  //         message: 'Internal Server Error',
  //         error: JSON.stringify(error)
  //       }
  //     }
  //   }

  // }
}
export { typeDefs, resolvers }