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
const typeDefs=
  gql`

  extend type Query {
    "priority 1, 2 ,3 ,4 "
    ticketOverview(input:inputFilterTicketOverview): ticketOverviewOutput
    listTicket(input:inputFilterListTicket): listTicketOutput
    dayGraph(input: inputDayGraph): listDayGraphOutput
    ticketDetail(id: Int!): detailTicketOutput
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
    data:[String],
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
  input inputDayGraph {
    startDate: String!,
    endDate: String!
  }
  input inputReply {
    body: String!,
    user_id: String!,
    ticket_id: String!
  }
  input inputNotes {
    body: String!,
    user_id: String!,
    ticket_id: String!,
    notify_emails:[String],
    private:String
  }
  input inputUpdateNotes {
    body: String!,
    id_notes: String!
  }
  type listTicketOutput{
    data:[ticket],
    message:String,
    status:Int,
    error:String
  }
  type detailTicketOutput{
    data:detailTicket,
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
      dayGraph:async(_, {input})=>{
        var dates = [];
          // console.log(input);
          var currDate = moment(input.startDate).startOf('day');
          var lastDate = moment(input.endDate).startOf('day');
      
          while(currDate.add(1, 'days').diff(lastDate) < 0) {
              // console.log(currDate.toDate());
              dates.push(currDate.clone().toDate());
          }
      
     
          return {
              data:dates,
              status: '200',
              message: 'ok'
          }
    
  },
  ticketDetail: async(_,{id})=>{
    try {
     
     let data= await fd_module.getTicketByid(id);
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
     
        for (let i = 0; i < files.length; i++) {
          let {createReadStream, filename, mimetype, encoding } = await files[i];
          let stream = createReadStream()
          form.append('attachments[]', stream, filename);
        }
      }
 
      form.append('body', input.body);
      form.append('user_id', input.user_id)
      await fd_module.createReply(input.ticket_id, form);
      return {
        status: '200',
        message: 'Ok',
    }
    } catch (error) {
      return {
        error,
        status: '200',
        message: 'Ok',
    }
    }
  
   },

     createNotes: async(_, {filee, input}, context, info)=>{
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
      form.append('user_id', input.user_id)
      // notify_emails:[String],
      // private:Boolean
      for (let x = 0; x < input.notify_emails.length; x++) {
       
        form.append('notify_emails[]', input.notify_emails[x]);
        
      }
    
      form.append('private', input.private)
      await fd_module.createNotes(input.ticket_id, form);
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
}
}


export {typeDefs, resolvers}
