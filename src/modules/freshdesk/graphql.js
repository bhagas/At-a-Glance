const db = require('../../config/koneksi.js');
const { QueryTypes } = require('sequelize');
const model = require('./model.js');
const rolePoolModel = require('../rolePool/model.js');
const gql = require('graphql-tag');
const uuid = require('uuid');
const jwt = require('../../helper/jwt.js');
const mail = require('../../helper/mail');
const bcrypt = require('../../helper/bcrypt');
const fd_module = require('./module')
const typeDefs=
  gql`

  extend type Query {
    "priority 1, 2 ,3 ,4 "
    ticketOverview(input:inputFilterTicketOverview): ticketOverviewOutput
    listTicket(input:inputFilterListTicket): listTicketOutput
  }
  extend type Mutation{
    ticketSync:ticketSyncOutput
  }

  type ticketOverviewOutput{
    data:[ticketStatusRecap],
    message:String,
    status:Int,
    error:String
  }
  type ticketSyncOutput{
    message:String,
    status:Int,
    error:String
  }
  type ticketStatusRecap{
    open: Int,
    unresolved: Int,
    on_hold: Int,
    overdue:Int,
    unassigned:Int,
    due_today:Int
  }
  input inputFilterTicketOverview {
    priority: Int
  }
  input inputFilterListTicket {
    priority: Int,
    condition: String!
  }
  type listTicketOutput{
    data:[ticket],
    message:String,
    status:Int,
    error:String
  }
  type ticket{
    cc_emails: [String],
    fwd_emails: [String],
    reply_cc_emails: [String],
    ticket_cc_emails: [String],
    fr_escalated: Boolean,
    spam: Boolean,
    email_config_id: String,
    group_id: String,
    priority: Int,
    requester_id: String,
    responder_id: String,
    source: Int,
    company_id: String,
    status: Int,
    subject: String,
    association_type: String,
    support_email: String,
    to_emails: String,
    product_id: String,
    id: String,
    type: String,
    due_by: String,
    fr_due_by: String,
    is_escalated: Boolean,
    fd_created_at: String,
    fd_updated_at: String,
    tags: [String],
    nr_due_by: String,
    nr_escalated: Boolean,
    ticket_id: Int
  }
`

const resolvers= {
  Query: {
    ticketOverview: async (obj, args, context, info)=>{
        try {
            // console.log(args);
            let bind={ }
            let a =""
            if(args.input.priority){
                a+= " AND priority=$priority";
                bind.priority = args.input.priority;
            }
            let q = `SELECT (SELECT COUNT(*) FROM fd_tickets WHERE status <> 4 AND status <> 5 ${a}) as unresolved,
            (SELECT COUNT(*) FROM fd_tickets WHERE responder_id is null AND status =2 ${a}) as unassigned,
            (SELECT COUNT(*) FROM fd_tickets WHERE status = 3 OR status = 6 OR status = 7 ${a}) as on_hold,
            (SELECT COUNT(*) FROM fd_tickets WHERE status = 2 ${a}) as open,
            (SELECT COUNT(*) FROM fd_tickets WHERE due_by > now() ${a}) as overdue,
            (SELECT COUNT(*) FROM fd_tickets WHERE due_by = current_date ${a}) as due_today `;
           
            const graph_1 = await db.query(q, 
            { 
            // replacements: [],
            bind,
            type: QueryTypes.SELECT 
             });
            return {
                data:graph_1,
                status: '200',
                message: 'ok'
            }
        } catch (error) {
          console.log(error);
          return {
            status: '500',
            message: 'gagal',
            error: JSON.stringify(error)
        }
        }
       
      },
      listTicket: async (obj, args, context, info)=>{
        try {
            // console.log(args);
            let bind={ };
            let a ="";
          
            if(args.input.priority){
                a+= " AND priority=$priority";
                bind.priority = args.input.priority;
            }

            let q ='';
            if(args.input.condition){
                bind.condition = args.input.condition;
            }
            let kolom =` cc_emails,
            fwd_emails,
            reply_cc_emails,
            ticket_cc_emails,
            fr_escalated,
            spam,
            email_config_id,
            group_id,
            priority,
            requester_id,
            responder_id,
            source,
            company_id,
            status,
            subject,
            to_emails,
            product_id,
            id,
            type,
            due_by,
            fr_due_by,
            is_escalated,
            fd_created_at,
            fd_updated_at,
            tags,
            nr_due_by,
            nr_escalated,
            ticket_id`
            switch (args.input.condition) {
                case "unresolved":
                    q=`SELECT ${kolom} FROM fd_tickets WHERE status <> 4 AND status <> 5 ${a}`
                    break;
                case "unassigned":
                    q=`SELECT ${kolom} FROM fd_tickets WHERE responder_id is null AND status =2 ${a}`
                break;
                case "on_hold":
                    q=`SELECT ${kolom} FROM fd_tickets WHERE status = 3 OR status = 6 OR status = 7 ${a}`
                break;
                case "open":
                    q=`SELECT ${kolom} FROM fd_tickets WHERE status = 2 ${a}`
                break;
                case "overdue":
                    q=`SELECT ${kolom} FROM fd_tickets WHERE due_by > now() ${a}`
                break;
                case "due_today":
                    q=`SELECT ${kolom} FROM fd_tickets WHERE due_by = current_date ${a}`
                break;
                default:
                    q=`SELECT ${kolom} FROM fd_tickets WHERE status <> 4 AND status <> 5 ${a}`
                break;
            }
            // let q = `SELECT (SELECT COUNT(*) FROM fd_tickets WHERE status <> 4 AND status <> 5 ${a}) as unresolved,
            // (SELECT COUNT(*) FROM fd_tickets WHERE responder_id is null AND status =2 ${a}) as unassigned,
            // (SELECT COUNT(*) FROM fd_tickets WHERE status = 3 OR status = 6 OR status = 7 ${a}) as on_hold,
            // (SELECT COUNT(*) FROM fd_tickets WHERE status = 2 ${a}) as open,
            // (SELECT COUNT(*) FROM fd_tickets WHERE due_by > now() ${a}) as overdue,
            // (SELECT COUNT(*) FROM fd_tickets WHERE due_by = current_date ${a}) as due_today `;
           
            const graph_1 = await db.query(q, 
            { 
            // replacements: [],
            bind,
            type: QueryTypes.SELECT 
             });
            //   console.log({  data:graph_1,});
            return {
                data:graph_1,
                status: '200',
                message: 'ok'
            }
        } catch (error) {
          console.log(error);
          return {
            status: '500',
            message: 'gagal',
            error: JSON.stringify(error)
        }
        }
       
      },
    // users: async (obj, args, context, info) => {
    //   try {
    //     let dt = await db.query('select * from users where deleted is null',{type: QueryTypes.SELECT});
   
    //     for (let i = 0; i < dt.length; i++) {
    //       dt[i].roles= await db.query(`select b.id, b.code, b.role_name from role_pool a join roles b on a."roleId" = b.id where a."userId"= $1`, { bind: [dt[i].id],type: QueryTypes.SELECT });
    //     }
     
    //     return {data: dt, status:200, message:'Success'};
    //   } catch (error) {
    //     console.log(error);
    //   }
    
       
    // },
    // user: async (obj, args, context, info) =>
    //     {
           
    //       let dt = await db.query(`select * from Users where id= $1`,{bind:[args.id], type:QueryTypes.SELECT});
    //       //harus object return nya
    //         return dt[0];
    //     },
},
Mutation:{
    ticketSync:async (_)=>{
        try {
            await fd_module.syncTicket();
            return {
                status: '200',
                message: 'Ok',
            }
        } catch (error) {
            return {
                status: '500',
                message: 'Failed',
                error
            }
        }
    }

}
}


module.exports = {typeDefs, resolvers}
