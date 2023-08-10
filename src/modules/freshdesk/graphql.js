import db from'../../config/koneksi.js';
import { QueryTypes } from'sequelize';
import model from'./model.js';
import rolePoolModel from'../rolePool/model.js';
import gql from'graphql-tag';
import { v4 as uuidv4 } from'uuid';
import jwt from'../../helper/jwt.js';
import mail from'../../helper/mail.js';
import bcrypt from'../../helper/bcrypt.js';
import fd_module from'./module.js'
import moment from'moment'
import saveFile from'../../helper/saveFile.js';
import  FormData from 'form-data';
import pubsub from '../../config/redis.js';
const typeDefs=
  gql`
  
extend type Subscription {
    syncTicket: SyncTicket,
    updateTicket: SyncTicket
}
type SyncTicket{
    status: String
    progress: String 
}
  extend type Query {
    "priority 1, 2 ,3 ,4 "
    ticketOverview(input:inputFilterTicketOverview): ticketOverviewOutput
    listTicket(input:inputFilterListTicket): listTicketOutput
    dayGraph(input: inputDayGraph): listDayGraphOutput
    ticketDetail(id: Int!): detailTicketOutput
    listAgents: listAgentOutput
  }
  extend type Mutation{
    ticketSync:ticketSyncOutput
    agentSync:ticketSyncOutput
    createReply(filee:[Upload], input:inputReply):ticketSyncOutput
    createNotes(filee:[Upload], input:inputNotes):ticketSyncOutput
    updateNotes(filee:[Upload], input:inputUpdateNotes):ticketSyncOutput
  }

  type ticketOverviewOutput{
    data:[ticketStatusRecap],
    message:String,
    status:Int,
    error:String
  }
  type listDayGraphOutput{
    data:[day_graph],
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
    priority: [Int],
    condition: String!,
    row:Int!,
    start_from:Int!
  }
  input inputDayGraph {
    startDate: String!,
    endDate: String!
  }
  input inputReply {
    body: String!,
    user_id: String!,
    ticket_id: String!,
    cc_emails:[String],
    bcc_emails:[String]
  }
  input inputNotes {
    body: String!,
    user_id: String!,
    ticket_id: String!,
    notify_emails:[String],
    private:String!
  }
  input inputUpdateNotes {
    body: String!,
    id_notes: String!
  }
  type listTicketOutput{
    data:[ticket],
    message:String,
    status:Int,
    error:String,
    total_rows:Int
  }
  type detailTicketOutput{
    data:detailTicket,
    message:String,
    status:Int,
    error:String
  }
  type listAgentOutput{
    data:[agent],
    message:String,
    status:Int,
    error:String
  }
  type day_graph{
    date:String,
    count:Int
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
    requester_name: String,
    requester_email:String,
    responder_id: String,
    responder_name:String,
    responder_email:String,
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
    ticket_id: Int,
    total_rows:Int
  }
  type agent{
    name:String,
    email:String,
    active:String,
    id:String,
    ticket_scope:String,
    type:String,
    phone:String,
  }
  type attachment{
    id: String,
    content_type: String,
    size: Int,
    name: String,
    attachment_url: String,
    created_at: String,
    updated_at: String
  }
  type conversation{
  body: String,
  body_text: String,
  id: String,
  incoming: Boolean,
  private: Boolean,
  user_id: String,
  support_email: String,
  source: Int,
  category: Int,
  to_emails: [String],
  from_email: String,
  cc_emails: [String],
  bcc_emails: [String],
  email_failure_count: Boolean,
  outgoing_failures: Boolean,
  thread_id: String,
  thread_message_id: String,
  created_at: String,
  updated_at: String,
  last_edited_at: String,
  last_edited_user_id: String,
  attachments: [attachment],
  automation_id: String,
  automation_type_id: String,
  auto_response: Boolean,
  ticket_id: Int,
  source_additional_info: String
  }
  type detailTicket{
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
    requester_name:String,
    requester_email:String,
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
    created_at: String,
    updated_at: String,
    tags: [String],
    nr_due_by: String,
    nr_escalated: Boolean,
    ticket_id: Int,
    attachments:[attachment],
    conversations: [conversation]
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
            let replacements={}
            let a ="";
            let limit = 10;
            let offset =0
            if(args.input.priority){
              if(args.input.priority.length>0){
                a+= " AND priority IN(:priority)";
                replacements.priority = args.input.priority;
              }
            }
            a+=' order by fd_created_at desc'
            if(args.input.row){
              limit=args.input.row;
              offset=args.input.start_from;
              a+=` LIMIT :limit OFFSET :offset`
              replacements.limit = limit;
              replacements.offset = offset;
            }

            let q ='';
            if(args.input.condition){
              replacements.condition = args.input.condition;
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
            requester_name,
            requester_email,
            responder_id,
            source,
            company_id,
            status,
            subject,
            to_emails,
            product_id,
            a.id,
            a.type,
            CAST(due_by AS TEXT) as due_by,
            CAST(fr_due_by AS TEXT) as fr_due_by,
            is_escalated,
            CAST(fd_created_at AS TEXT) as fd_created_at,
            CAST(fd_updated_at AS TEXT) as fd_updated_at,
            tags,
            CAST(nr_due_by AS TEXT) as nr_due_by,
            nr_escalated,
            ticket_id,
            b.name as responder_name,
            b.email as responder_email,
            count(*) OVER() AS total_rows
            `
            switch (args.input.condition) {
                case "unresolved":
                    q=`SELECT ${kolom} FROM fd_tickets a left join fd_agents b on a.responder_id = cast(b.id as BIGINT) WHERE a.status <> 4 AND a.status <> 5 `
                    break;
                case "unassigned":
                    q=`SELECT ${kolom} FROM fd_tickets a left join fd_agents b on a.responder_id = cast(b.id as BIGINT) WHERE a.responder_id is null AND a.status =2 `
                break;
                case "on_hold":
                    q=`SELECT ${kolom} FROM fd_tickets a left join fd_agents b on a.responder_id = cast(b.id as BIGINT) WHERE a.status = 3 OR a.status = 6 OR a.status = 7 `
                break;
                case "open":
                    q=`SELECT ${kolom} FROM fd_tickets a left join fd_agents b on a.responder_id = cast(b.id as BIGINT) WHERE a.status = 2 `
                break;
                case "overdue":
                    q=`SELECT ${kolom} FROM fd_tickets a left join fd_agents b on a.responder_id = cast(b.id as BIGINT) WHERE a.due_by > now() `
                break;
                case "due_today":
                    q=`SELECT ${kolom} FROM fd_tickets a left join fd_agents b on a.responder_id = cast(b.id as BIGINT) WHERE a.due_by = current_date `
                break;
                default:
                    q=`SELECT ${kolom} FROM fd_tickets a left join fd_agents b on a.responder_id = cast(b.id as BIGINT) WHERE a.status <> 4 AND a.status <> 5 `
                break;
            }
            q+=a;
           
            // console.log(a);
            // let q = `SELECT (SELECT COUNT(*) FROM fd_tickets WHERE status <> 4 AND status <> 5 ${a}) as unresolved,
            // (SELECT COUNT(*) FROM fd_tickets WHERE responder_id is null AND status =2 ${a}) as unassigned,
            // (SELECT COUNT(*) FROM fd_tickets WHERE status = 3 OR status = 6 OR status = 7 ${a}) as on_hold,
            // (SELECT COUNT(*) FROM fd_tickets WHERE status = 2 ${a}) as open,
            // (SELECT COUNT(*) FROM fd_tickets WHERE due_by > now() ${a}) as overdue,
            // (SELECT COUNT(*) FROM fd_tickets WHERE due_by = current_date ${a}) as due_today `;
          //  console.log(q);
            const graph_1 = await db.query(q, 
            { 
            replacements,
            // bind,
            type: QueryTypes.SELECT 
             });
              // console.log({  data:graph_1,});
            return {
                data:graph_1,
                status: '200',
                message: 'ok',
                total_rows: graph_1[0].total_rows
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
      listAgents: async (obj, args, context, info)=>{
        try {
            // console.log(args);
            let bind={ };
            let a ="";
          
         
            let q ='';
          
            let kolom =`
              id,
              name,
              email,
              phone,
              type,
              active,
              ticket_scope
            `
            q=`SELECT ${kolom} FROM fd_agents  WHERE deleted is null`
            // let q = `SELECT (SELECT COUNT(*) FROM fd_tickets WHERE status <> 4 AND status <> 5 ${a}) as unresolved,
            // (SELECT COUNT(*) FROM fd_tickets WHERE responder_id is null AND status =2 ${a}) as unassigned,
            // (SELECT COUNT(*) FROM fd_tickets WHERE status = 3 OR status = 6 OR status = 7 ${a}) as on_hold,
            // (SELECT COUNT(*) FROM fd_tickets WHERE status = 2 ${a}) as open,
            // (SELECT COUNT(*) FROM fd_tickets WHERE due_by > now() ${a}) as overdue,
            // (SELECT COUNT(*) FROM fd_tickets WHERE due_by = current_date ${a}) as due_today `;
          //  console.log(q);
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
      dayGraph:async(_, {input})=>{
        let bind=[input.startDate, input.endDate];
          // console.log(input);
          // var currDate = moment(input.startDate).startOf('day');
          // var lastDate = moment(input.endDate).startOf('day');
          // dates.push(currDate.format("YYYY-MM-DD"));
          // while(currDate.add(1, 'days').diff(lastDate) <= 0) {
          //     // console.log(currDate.toDate());
          //     dates.push(currDate.clone().format("YYYY-MM-DD"));
          // }
try {
  let q = `SELECT date_trunc('day', dd):: date as date, (select count(*) from fd_tickets where "createdAt"::date= date_trunc('day', dd):: date) as count
  FROM generate_series
      ( $1::timestamp 
      , $2::timestamp
      , '1 day'::interval) dd`

      const graph_1 = await db.query(q, 
        { 
        // replacements: [],
        bind,
        type: QueryTypes.SELECT 
         });
        //  console.log(graph_1);
  return {
      data:graph_1,
      status: '200',
      message: 'ok'
  }
} catch (error) {
  // console.log(error);
  return {
    status: '500',
    message: 'failed',
    error: JSON.stringify(error)
}
}
     
    
  },
      ticketDetail: async(_,{id})=>{
        try {
        
        let data= await fd_module.getTicketByid(id);
        data.requester_name = data.requester.name;
        data.requester_email = data.requester.email;
        //  console.log(data.conversations[0].attachments);
          return {
              data,
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

},
Mutation:{
    ticketSync:async (_)=>{
      if(fd_module.getSyncStatus()){
        return {
          status: '200',
          message: 'Sync In Progress',
          error:''
      }
      }else{
        try {
          pubsub.publish('SYNC_TICKET', {
            syncTicket: {
              status: 'Sync Started',
              progress: '',
            },
          });
            fd_module.syncTicket();
           
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
        
    },
    agentSync:async (obj, args, context, info)=>{
        try {
      
            await fd_module.syncAgents();
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
    },

   createReply: async(_, {filee, input}, context, info)=>{
    try {
      const form = new FormData();
      if(filee){
        let files = await Promise.all(filee)
        if(Array.isArray(files)){
          for (let i = 0; i < files.length; i++) {
            let {createReadStream, filename, mimetype, encoding } = await files[i];
            let stream = createReadStream()
            form.append('attachments[]', stream, filename);
          }
        }
      
      }
 
      form.append('body', input.body);
      form.append('user_id', input.user_id)
      if(input.cc_emails){
        for (let i = 0; i < input.cc_emails.length; i++) {
          form.append('cc_emails[]', input.cc_emails[i]);
        }
      }
     
      if(input.bcc_emails){
        for (let i = 0; i < input.bcc_emails.length; i++) {
          form.append('bcc_emails[]', input.bcc_emails[i]);
        }
      }
    
      
      await fd_module.createReply(input.ticket_id, form);
      return {
        status: '200',
        message: 'Ok',
    }
    } catch (error) {
      console.log(error);
      return {
        error,
        status: '500',
        message: 'error',
    }
    }
  
   },

     createNotes: async(_, {filee, input}, context, info)=>{
    try {
      const form = new FormData();
      if(filee){
        let files = await Promise.all(filee)
        if(Array.isArray(files)){
        for (let i = 0; i < files.length; i++) {
          let {createReadStream, filename, mimetype, encoding } = await files[i];
          let stream = createReadStream()
          form.append('attachments[]', stream, filename);
        }
      }
      }
     
     
 
      form.append('body', input.body);
      form.append('user_id', input.user_id)
      // notify_emails:[String],
      // private:Boolean
      if(input.notify_emails){
        for (let x = 0; x < input.notify_emails.length; x++) {
       
          form.append('notify_emails[]', input.notify_emails[x]);
          
        }
      }
    
    
      form.append('private', input.private)
      await fd_module.createNotes(input.ticket_id, form);
      return {
        status: '200',
        message: 'Ok',
    }
    } catch (error) {
      // console.log(error);
      return {
        error,
        status: '200',
        message: 'Ok',
    }
    }
  
   },



   updateNotes: async(_, {filee, input}, context, info)=>{
    try {
      const form = new FormData();
      if(filee){
        let files = await Promise.all(filee)
   
        for (let i = 0; i < files.length; i++) {
          let {createReadStream, filename, mimetype, encoding } = await files[i];
          let stream = createReadStream()
          form.append('attachments[]', stream, filename);
        }
      }
     
     
 
      form.append('body', input.body);
    
      await fd_module.updateNotes(input.id_notes, form);
      return {
        status: '200',
        message: 'Ok',
    }
    } catch (error) {
      console.log(error);
      return {
        error,
        status: '200',
        message: 'Ok',
    }
    }
  
   }
},
Subscription: {
  syncTicket: {
    // More on pubsub below
    subscribe: () => pubsub.asyncIterator(['SYNC_TICKET']),
  },
  updateTicket: {
    // More on pubsub below
    subscribe: () => pubsub.asyncIterator(['UPDATE_TICKET']),
  },
},
}


export {typeDefs, resolvers}
