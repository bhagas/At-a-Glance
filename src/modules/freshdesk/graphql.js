import db from '../../config/koneksi.js';
import { QueryTypes } from 'sequelize';
import model from './model.js';
import rolePoolModel from '../rolePool/model.js';
import gql from 'graphql-tag';
import { v4 as uuidv4 } from 'uuid';
import jwt from '../../helper/jwt.js';
import mail from '../../helper/mail.js';
import bcrypt from '../../helper/bcrypt.js';
import fd_module from './module.js'
import moment from 'moment'
import saveFile from '../../helper/saveFile.js';
import FormData from 'form-data';
import pubsub from '../../config/redis.js';
import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json';
import fd_ticket_conversations_model from '../ticket_conversations/model.js'
import fd_expense_log_model from '../expense_log/model.js'
const typeDefs =
  gql`
  scalar JSONObject
extend type Subscription {
    syncTicket: SyncTicket,
    updateTicket: SyncTicket
}
type SyncTicket {
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
   
    ticketFields: listTicketFields
    listExpenseByConvId(conv_id:ID!, filter:inputFilterExpense): listExpenses
    listExpenseByTicketId(ticketId:ID!, filter:inputFilterExpense): listExpenses
    listExpense(filter:inputFilterExpense): listExpenses
    listLogExpenseByTicketId(ticketId:ID): listLogExpenses
  }
  extend type Mutation{
    ticketSync(startDate:String):ticketSyncOutput
    agentSync:ticketSyncOutput
    createReply(filee:[Upload], input:inputReply):ticketSyncOutput
    createNotes(filee:[Upload], input:inputNotes):createNotesSyncOutput
    updateNotes(filee:[Upload], input:inputUpdateNotes):ticketSyncOutput
    updateTicket(input:inputUpdateTicket):ticketSyncOutput
    createExpense(input:inputExpense):ticketSyncOutput
    createBulkExpense(input:[inputExpense]):ticketSyncOutput
    updateExpense(id: ID!, input:inputExpense):ticketSyncOutput
    deleteExpense(id: ID!):ticketSyncOutput
    approveExpense(id:ID, input: inputApproveExpense):ticketSyncOutput
   
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
  # createNotesSyncOutput
  type createNotesSyncOutput{
    message:String,
    status:Int,
    error:String,
    data:JSONObject
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
  enum approved {
  YES
  NO
}

enum sort {
  ASC
  DESC
}
  input inputFilterExpense {
    approved: approved
  }
  input inputFilterListTicket {
    priority: [Int],
    condition: String!,
    row:Int!,
    start_from:Int!,
    agent_id:String,
    sort:sort!,
    key_search:String,
    member_id:String,
    ticket_id:ID
  }
  input inputDayGraph {
    startDate: String!,
    endDate: String!
  }
  input inputReply {
    body: String!,
    user_id: String,
    ticket_id: String!,
    cc_emails:[String],
    bcc_emails:[String]
  }
  input inputNotes {
          body: String!,
          user_id: String,
          ticket_id: String!,
          notify_emails:[String],
          private:String!
  }
  input inputExpense{
    fd_conv_id: String!,
    amount: String!,
    app_fdTicketId: String!,
    typeId:String!,
    fd_ticket_id:String!
  }
  input inputApproveExpense{
    approved:String!,
    approved_by:String!
  }
  
  input inputUpdateNotes {
    body: String!,
    id_notes: String!
  }
  input inputUpdateTicket {
    ticket_id: Int!
    priority: Int,
    status: Int,
    custom_fields: JSONObject,
    total_hours: Int
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
  type listExpenses{
    data:[expense],
    message:String,
    status:Int,
    error:String
  }
  type listLogExpenses{
    data:[logExpense],
    message:String,
    status:Int,
    error:String
  }
  type expense{
    id:String,
    fd_conv_id: String,
    amount: String,
    app_fdTicketId: String,
    typeId:String,
    fd_ticket_id:String,
    type_name:String,
    createdAt:String,
    updatedAt:String,
    approved: String,
             approved_at: String,
             approved_by: String,
             approved_by_name: String,
             created_by_name: String
  }
  type logExpense{
    id:String,
    fd_conv_id: String,
    amount: String,
    fdTicketId: String,
    typeId:String,
    fd_ticket_id:String,
    type_name:String,
    createdAt:String,
    updatedAt:String,
    action: String,
             created_by_name: String
  }
  type listTicketFields{
    data:[ticketFields],
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
    hour_salary:Float,
    salary:Float,
    idUserAgent:String
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
  amount:String,
  typeId:String,
  type_name:String,
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
  source_additional_info: String,
  long:String,
  lat:String,
  location_tag:String
  }
  type detailTicket{
    amount:String,
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
    to_emails: [String],
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
    conversations: [conversation],
    custom_fields:JSONObject,
    description:String,
    description_text:String,
    total_hours:String
  }
type ticketFields{
    id: String,
    name: String,
    label: String,
    label_for_customers: String,
    position: Int,
    type: String,
    default: Boolean,
    customers_can_edit: Boolean,
    customers_can_filter: Boolean,
    required_for_closure: Boolean,
    required_for_agents: Boolean,
    required_for_customers: Boolean,
    displayed_to_customers: Boolean,
    created_at: String,
    updated_at: String,
    archived: Boolean
}

`

const resolvers = {
  JSONObject: GraphQLJSONObject,
  Query: {
    ticketOverview: async (obj, args, context, info) => {
      try {
        // console.log(args);
        let bind = {}
        let a = ""
        if (args.input.priority) {
          a += " AND priority=$priority";
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
          data: graph_1,
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
    listTicket: async (obj, args, context, info) => {
      try {
        // console.log(args);
        let bind = {};
        let replacements = {}
        let a = "";
        let limit = 10;
        let offset = 0
        if (args.input.priority) {
          if (args.input.priority.length > 0) {
            a += " AND priority IN(:priority)";
            replacements.priority = args.input.priority;
          }
        }
        if (args.input.agent_id) {
            a += " AND responder_id = :agent_id";
            replacements.agent_id = args.input.agent_id;
          
        }
        if (args.input.ticket_id) {
          a += " AND ticket_id = :ticket_id";
          replacements.ticket_id = args.input.ticket_id;
        
      }
        if (args.input.member_id) {
          a += ' AND (select count(*) from ticket_member where id_member = :member_id and fd_ticket_id = a.ticket_id and "deletedAt" is null) > 0';
          replacements.member_id = args.input.member_id;
        
      }
        if (args.input.key_search) {

          a += ` AND (CAST(ticket_id AS TEXT) ILIKE :key_search OR subject ILIKE :key_search OR requester_name ILIKE :key_search OR requester_email ILIKE :key_search OR json_custom_field->>'cf_quote_po' ILIKE :key_search)`
          replacements.key_search = '%'+args.input.key_search+'%';
    
        }
        a += ' order by fd_created_at '+args.input.sort
        if (args.input.row) {
          limit = args.input.row;
          offset = args.input.start_from;
          a += ` LIMIT :limit OFFSET :offset`
          replacements.limit = limit;
          replacements.offset = offset;
        }

     

        let q = '';
        if (args.input.condition) {
          replacements.condition = args.input.condition;
        }

        let kolom = ` cc_emails,
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
            q = `SELECT ${kolom} FROM fd_tickets a left join fd_agents b on a.responder_id = cast(b.id as BIGINT) WHERE a.status <> 4 AND a.status <> 5 `
            break;
          case "unassigned":
            q = `SELECT ${kolom} FROM fd_tickets a left join fd_agents b on a.responder_id = cast(b.id as BIGINT) WHERE a.responder_id is null AND a.status =2 `
            break;
          case "on_hold":
            q = `SELECT ${kolom} FROM fd_tickets a left join fd_agents b on a.responder_id = cast(b.id as BIGINT) WHERE a.status = 3 OR a.status = 6 OR a.status = 7 `
            break;
          case "open":
            q = `SELECT ${kolom} FROM fd_tickets a left join fd_agents b on a.responder_id = cast(b.id as BIGINT) WHERE a.status = 2 `
            break;
          case "overdue":
            q = `SELECT ${kolom} FROM fd_tickets a left join fd_agents b on a.responder_id = cast(b.id as BIGINT) WHERE a.due_by > now() `
            break;
          case "due_today":
            q = `SELECT ${kolom} FROM fd_tickets a left join fd_agents b on a.responder_id = cast(b.id as BIGINT) WHERE a.due_by = current_date `
            break;
          default:
            q = `SELECT ${kolom} FROM fd_tickets a left join fd_agents b on a.responder_id = cast(b.id as BIGINT) WHERE a.status <> 4 AND a.status <> 5 `
            break;
        }
        q += a;

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
        let total_rows =0;
        if(graph_1.length){
          total_rows = graph_1[0].total_rows
        }
        return {
          data: graph_1,
          status: '200',
          message: 'ok',
          total_rows: total_rows
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
    listAgents: async (obj, args, context, info) => {
      try {
        // console.log(args);
        let bind = {};
        let a = "";


        let q = '';

        let kolom = `
        a.id,
        a.name,
             a.email,
             a.phone,
             a.type,
             a.active,
             a.ticket_scope,
             a.hour_salary,
             a.salary,
             b.id as "idUserAgent"
            `
        q = `SELECT ${kolom}  FROM fd_agents a join users b on a.email = b.email WHERE a.deleted is null`
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
          console.log({  data:graph_1,});
        return {
          data: graph_1,
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

    dayGraph: async (_, { input }) => {
      let bind = [input.startDate, input.endDate];
      // console.log(input);
      // var currDate = moment(input.startDate).startOf('day');
      // var lastDate = moment(input.endDate).startOf('day');
      // dates.push(currDate.format("YYYY-MM-DD"));
      // while(currDate.add(1, 'days').diff(lastDate) <= 0) {
      //     // console.log(currDate.toDate());
      //     dates.push(currDate.clone().format("YYYY-MM-DD"));
      // }
      try {
        let q = `SELECT date_trunc('day', dd):: date as date, (select count(*) from fd_tickets where "fd_created_at"::date= date_trunc('day', dd):: date) as count
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
          data: graph_1,
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
    ticketDetail: async (_, { id }) => {
      try {

        let data = await fd_module.getTicketByid(id);
    
        data.requester_name = data.requester.name;
        data.requester_email = data.requester.email;
        data.amount =0;
        // console.log(data.conversations);
         data.conversations = await fd_module.getConversationsByTicketid(id);
        for (let i = 0; i < data.conversations.length; i++) {
          let result_conv = await db.query(`SELECT sum(amount::FLOAT) as amount FROM fd_ticket_conversations WHERE "deletedAt" is null AND fd_conv_id = '${data.conversations[i].id}'`, { type: QueryTypes.SELECT })
         
          if (result_conv.length) {
          
            data.conversations[i].amount = result_conv[0].amount;
            if(parseInt(result_conv[0].amount)){
           
              data.amount += parseInt(result_conv[0].amount);
            }
           
          }


          //longlat
          let locations = await db.query(`SELECT long,lat,location_tag FROM fd_conversations_locations WHERE "deletedAt" is null AND fd_conv_id = '${data.conversations[i].id}'`, { type: QueryTypes.SELECT })
         
          if (locations.length) {
          
            data.conversations[i].long = locations[0].long;
            data.conversations[i].lat = locations[0].lat;
            data.conversations[i].location_tag = locations[0].location_tag;
           
           
          }
          let ticket_db = await db.query(`SELECT * FROM fd_tickets WHERE  ticket_id = '${id}'`, { type: QueryTypes.SELECT })
          data.total_hours =0;
          if (ticket_db.length) {
            data.total_hours =ticket_db[0].total_hours;
          //   data.conversations[i].long = locations[0].long;
          //   data.conversations[i].lat = locations[0].lat;
          //   data.conversations[i].location_tag = locations[0].location_tag;
           
           
          }
        }
       
        // console.log(data.amount);
        // console.log(result_conv);
        // console.log(data.conversations);
        //  console.log(data.conversations[0].attachments);
        // console.log(data);
        return {
          data: data,
          status: '200',
          message: 'Ok',
        }
      } catch (error) {
        console.log(error);
        return {
          status: '500',
          message: 'Failed',
          error
        }
      }
    },
    ticketFields: async (_, { id }) => {
      try {

        let data = await fd_module.getTicketFields();

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
    },
    listExpenseByConvId: async (_, { conv_id, filter }) => {
      try {
        let data=  []
        let a =''
        if(filter.approved){
          a+= ` and a.approved = '${filter.approved}'`
        }
        const result_conv = await db.query(`SELECT a.*,
        (select name from users where id = a.approved_by) as approved_name, 
        (select name from users where id = a.created_by) as created_by_name, 
         CAST(a."createdAt" AS TEXT) as created_at,
         CAST(a."updatedAt" AS TEXT) as updated_at,
         CAST(a."approved_at" AS TEXT) as approved_at_date,
          b.type_name FROM fd_ticket_conversations a join types b on a."typeId" = b.id  WHERE a."deletedAt" is null and a.fd_conv_id = '${conv_id}' ${a}`, { type: QueryTypes.SELECT })
   
        if (result_conv) {
          for (let i = 0; i < result_conv.length; i++) {
            data.push({
              id:result_conv[i].id,
             fd_conv_id: result_conv[i].fd_conv_id,
             amount: result_conv[i].amount,
             app_fdTicketId: result_conv[i].fdTicketId,
             typeId:result_conv[i].typeId,
             fd_ticket_id:result_conv[i].fd_ticket_id,
             type_name: result_conv[i].type_name,
             createdAt: result_conv[i].created_at,
             updatedAt: result_conv[i].updated_at,
             approved: result_conv[i].approved,
             approved_at: result_conv[i].approved_at_date,
             approved_by: result_conv[i].approved_by,
             approved_by_name: result_conv[i].approved_name,
             created_by_name: result_conv[i].created_by_name,
             })
          }
        }

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
    },
    listExpenseByTicketId: async (_, { ticketId, filter }) => {
      try {
        let data=  []
        let a =''
        if(filter.approved){
          a+= ` and a.approved = '${filter.approved}'`
        }
        const result_conv = await db.query(`SELECT a.*,
        (select name from users where id = a.approved_by) as approved_name, 
         CAST(a."createdAt" AS TEXT) as created_at,
         CAST(a."updatedAt" AS TEXT) as updated_at,
         CAST(a."approved_at" AS TEXT) as approved_at_date,
          b.type_name FROM fd_ticket_conversations a join types b on a."typeId" = b.id  WHERE a."deletedAt" is null and a.fd_ticket_id = '${ticketId}' ${a}`, { type: QueryTypes.SELECT })
   
        if (result_conv) {
          for (let i = 0; i < result_conv.length; i++) {
            data.push({
              id:result_conv[i].id,
             fd_conv_id: result_conv[i].fd_conv_id,
             amount: result_conv[i].amount,
             app_fdTicketId: result_conv[i].fdTicketId,
             typeId:result_conv[i].typeId,
             fd_ticket_id:result_conv[i].fd_ticket_id,
             type_name: result_conv[i].type_name,
             createdAt: result_conv[i].created_at,
             updatedAt: result_conv[i].updated_at,
             approved: result_conv[i].approved,
             approved_at: result_conv[i].approved_at_date,
             approved_by: result_conv[i].approved_by,
             approved_by_name: result_conv[i].approved_name,
             })
          }
        }

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
    },
    listExpense: async (_, {filter }) => {
      try {
        let data=  []
        let a =''
        if(filter.approved){
          a+= ` and a.approved = '${filter.approved}'`
        }
        const result_conv = await db.query(`SELECT a.*,
        (select name from users where id = a.approved_by) as approved_name, 
        (select name from users where id = a.created_by) as created_by_name, 
         CAST(a."createdAt" AS TEXT) as created_at,
         CAST(a."updatedAt" AS TEXT) as updated_at,
         CAST(a."approved_at" AS TEXT) as approved_at_date,
          b.type_name FROM fd_ticket_conversations a join types b on a."typeId" = b.id  WHERE a."deletedAt" is null ${a}`, { type: QueryTypes.SELECT })
  //  console.log('abcde');
        if (result_conv) {
          // console.log(result_conv);
          for (let i = 0; i < result_conv.length; i++) {
            data.push({
              id:result_conv[i].id,
             fd_conv_id: result_conv[i].fd_conv_id,
             amount: result_conv[i].amount,
             app_fdTicketId: result_conv[i].fdTicketId,
             typeId:result_conv[i].typeId,
             fd_ticket_id:result_conv[i].fd_ticket_id,
             type_name: result_conv[i].type_name,
             createdAt: result_conv[i].created_at,
             updatedAt: result_conv[i].updated_at,
             approved: result_conv[i].approved,
             approved_at: result_conv[i].approved_at_date,
             approved_by: result_conv[i].approved_by,
             approved_by_name: result_conv[i].approved_name,
             })
          }
        }

        return {
          data,
          status: '200',
          message: 'Ok',
        }
      } catch (error) {
        // console.log(error);
        return {
          status: '500',
          message: 'Failed',
          error
        }
      }
    },
    listLogExpenseByTicketId: async (_, { ticketId }) => {
      try {
        let data=  []
        let a =""
        if(ticketId){
          a=`and a.fd_ticket_id = '${ticketId}'`
        }
        const result_conv = await db.query(`SELECT a.*,
        (select name from users where id = a.created_by) as created_by_name, 
         CAST(a."createdAt" AS TEXT) as created_at,
         CAST(a."updatedAt" AS TEXT) as updated_at,
          b.type_name FROM fd_expense_log a join types b on a."typeId" = b.id  WHERE a."deletedAt" is null ${a}`, { type: QueryTypes.SELECT })
   
        if (result_conv) {
          for (let i = 0; i < result_conv.length; i++) {
            // id:String,
            // fd_conv_id: String,
            // amount: String,
            // fdTicketId: String,
            // typeId:String,
            // fd_ticket_id:String,
            // type_name:String,
            // createdAt:String,
            // updatedAt:String,
            // action: String,
            //          created_by_name: String
            data.push({
              id:result_conv[i].id,
             fd_conv_id: result_conv[i].fd_conv_id,
             amount: result_conv[i].amount,
             fdTicketId: result_conv[i].fdTicketId,
             typeId:result_conv[i].typeId,
             fd_ticket_id:result_conv[i].fd_ticket_id,
             type_name: result_conv[i].type_name,
             createdAt: result_conv[i].created_at,
             updatedAt: result_conv[i].updated_at,
             action: result_conv[i].action,
             created_by_name: result_conv[i].created_by_name,
             })
          }
        }

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
  Mutation: {
    ticketSync: async (_, { startDate }) => {
      if (fd_module.getSyncStatus()) {
        return {
          status: '200',
          message: 'Sync In Progress',
          error: ''
        }
      } else {
        try {
          pubsub.publish('SYNC_TICKET', {
            syncTicket: {
              status: 'Sync Started',
              progress: '',
            },
          });
          fd_module.syncTicket(startDate);

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
    agentSync: async (obj, args, context, info) => {
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

    createReply: async (_, { filee, input }, context, info) => {
      try {
        const form = new FormData();
        if (filee) {
          let files = await Promise.all(filee)
          if (Array.isArray(files)) {
            for (let i = 0; i < files.length; i++) {
              let { createReadStream, filename, mimetype, encoding } = await files[i];
              let stream = createReadStream()
              form.append('attachments[]', stream, filename);
            }
          }

        }

        form.append('body', input.body);
        // form.append('user_id', input.user_id)
        if(input.user_id){
          form.append('user_id', input.user_id)
        }
     
        if (input.cc_emails) {
          for (let i = 0; i < input.cc_emails.length; i++) {
            form.append('cc_emails[]', input.cc_emails[i]);
          }
        }

        if (input.bcc_emails) {
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

    createNotes: async (_, { filee, input }, context, info) => {
      try {
        const form = new FormData();
        if (filee) {
          let files = await Promise.all(filee)
          if (Array.isArray(files)) {
            for (let i = 0; i < files.length; i++) {
              let { createReadStream, filename, mimetype, encoding } = await files[i];
              let stream = createReadStream()
              form.append('attachments[]', stream, filename);
            }
          }
        }



        form.append('body', input.body);
        if(input.user_id){
          form.append('user_id', input.user_id)
        }
     
        // notify_emails:[String],
        // private:Boolean
        if (input.notify_emails) {
          for (let x = 0; x < input.notify_emails.length; x++) {

            form.append('notify_emails[]', input.notify_emails[x]);

          }
        }


        form.append('private', input.private)
        let hasil = await fd_module.createNotes(input.ticket_id, form);
        
        return {
          status: '200',
          message: 'Ok',
          data:hasil
        }
      } catch (error) {
        // console.log(error);
        return {
          error,
          status: '500',
          message: 'error',
        }
      }

    },



    updateNotes: async (_, { filee, input }, context, info) => {
      try {
        const form = new FormData();
        if (filee) {
          let files = await Promise.all(filee)

          for (let i = 0; i < files.length; i++) {
            let { createReadStream, filename, mimetype, encoding } = await files[i];
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
          status: '500',
          message: 'Error',
        }
      }

    },

    createExpense: async (_, { input }, context, info) => {
      // console.log(context);
      try {
        let data = {
          "id": uuidv4(),
          "fd_conv_id": input.fd_conv_id,
          "amount": input.amount,
          "fdTicketId": input.app_fdTicketId,
          "typeId": input.typeId,
          "fd_ticket_id": input.fd_ticket_id,
          "created_by":context.user_app.id
        }
        await fd_ticket_conversations_model.create(data)
        await fd_expense_log_model.create({
          "id": uuidv4(),
          "fd_conv_id": input.fd_conv_id,
          "amount": input.amount,
          "fdTicketId": input.app_fdTicketId,
          "typeId": input.typeId,
          "fd_ticket_id": input.fd_ticket_id,
          "created_by":context.user_app.id,
          "action":"CREATE"
        })
        return {
          status: '200',
          message: 'Ok',
        }
      } catch (error) {
        return {
          error,
          status: '500',
          message: 'Error',
        }
      }
    },
    createBulkExpense: async (_, { input }, context, info) => {
      // console.log(context);
      try {
        for (let i = 0; i < input.length; i++) {
          let e = input[i];
          let data = {
            "id": uuidv4(),
            "fd_conv_id": e.fd_conv_id,
            "amount": e.amount,
            "fdTicketId": e.app_fdTicketId,
            "typeId": e.typeId,
            "fd_ticket_id": e.fd_ticket_id,
            "created_by":context.user_app.id
          }
          await fd_ticket_conversations_model.create(data)
          await fd_expense_log_model.create({
            "id": uuidv4(),
            "fd_conv_id": e.fd_conv_id,
            "amount": e.amount,
            "fdTicketId": e.app_fdTicketId,
            "typeId": e.typeId,
            "fd_ticket_id": e.fd_ticket_id,
            "created_by":context.user_app.id,
            "action":"CREATE"
          })
        }
       
        return {
          status: '200',
          message: 'Ok',
        }
      } catch (error) {
        return {
          error,
          status: '500',
          message: 'Error',
        }
      }
    },

    updateExpense: async (_, {id, input }, context, info) => {
      try {
        let data = {
          "fd_conv_id": input.fd_conv_id,
          "amount": input.amount,
          "fdTicketId": input.app_fdTicketId,
          "typeId": input.typeId,
          "fd_ticket_id": input.fd_ticket_id
        }
     
        await fd_ticket_conversations_model.update(data, {
          where: {
            id: id,
          },
        });
        
        await fd_expense_log_model.create({
          "id": uuidv4(),
          "fd_conv_id": input.fd_conv_id,
          "amount": input.amount,
          "fdTicketId": input.app_fdTicketId,
          "typeId": input.typeId,
          "fd_ticket_id": input.fd_ticket_id,
          "created_by":context.user_app.id,
          "action":"UPDATE"
        })
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
    deleteExpense: async (_, {id }, context, info) => {
      try {
   
      let data =  await fd_ticket_conversations_model.destroy({
          where: {
            id: id,
          },
        });
        const result_conv = await db.query(`SELECT a.*,
        (select name from users where id = a.approved_by) as approved_name, 
        (select name from users where id = a.created_by) as created_by_name, 
         CAST(a."createdAt" AS TEXT) as created_at,
         CAST(a."updatedAt" AS TEXT) as updated_at,
         CAST(a."approved_at" AS TEXT) as approved_at_date,
          b.type_name FROM fd_ticket_conversations a join types b on a."typeId" = b.id  WHERE  a.id = '${id}'`, { type: QueryTypes.SELECT })
   
        // console.log(result_conv,'dataaa',context.user_app);
        if(result_conv.length && context.user_app){
          await fd_expense_log_model.create({
            "id": uuidv4(),
            "fd_conv_id": result_conv[0].fd_conv_id,
            "amount": result_conv[0].amount,
            "fdTicketId": result_conv[0].fdTicketId,
            "typeId": result_conv[0].typeId,
            "fd_ticket_id": result_conv[0].fd_ticket_id,
            "created_by":context.user_app.id,
            "action":"DELETE"
          })
        }
       
        return {
          status: '200',
          message: 'Ok',
        }
      } catch (error) {
        return {
          error,
          status: '500',
          message: 'failed',
        }
      }
    },
    approveExpense: async (_, {id, input }, context, info) => {
      try {
        let data = {
          "approved": input.approved,
          "approved_by": input.approved_by,
          "approved_at": moment()
         
        }
     
        await fd_ticket_conversations_model.update(data, {
          where: {
            id: id,
          },
        });
        let act = 'APPROVE';
        if(input.approved=="NO"){
          act = 'UNAPPROVE';
        }
        const result_conv = await db.query(`SELECT a.*,
        (select name from users where id = a.approved_by) as approved_name, 
        (select name from users where id = a.created_by) as created_by_name, 
         CAST(a."createdAt" AS TEXT) as created_at,
         CAST(a."updatedAt" AS TEXT) as updated_at,
         CAST(a."approved_at" AS TEXT) as approved_at_date,
          b.type_name FROM fd_ticket_conversations a join types b on a."typeId" = b.id  WHERE  a.id = '${id}'`, { type: QueryTypes.SELECT })
   
        // console.log(result_conv,'dataaa',context.user_app);
        if(result_conv.length && context.user_app){
          await fd_expense_log_model.create({
            "id": uuidv4(),
            "fd_conv_id": result_conv[0].fd_conv_id,
            "amount": result_conv[0].amount,
            "fdTicketId": result_conv[0].fdTicketId,
            "typeId": result_conv[0].typeId,
            "fd_ticket_id": result_conv[0].fd_ticket_id,
            "created_by":context.user_app.id,
            "action":act
          })
        }
        // await fd_expense_log_model.create({
        //   "id": uuidv4(),
        //   "fd_conv_id": input.fd_conv_id,
        //   "amount": input.amount,
        //   "fdTicketId": input.app_fdTicketId,
        //   "typeId": input.typeId,
        //   "fd_ticket_id": input.fd_ticket_id,
        //   "created_by":context.user_app.id,
        //   "action":act
        // })
        return {
          status: '200',
          message: 'Ok',
        }
      } catch (error) {
        return {
          error,
          status: '500',
          message: 'Error',
        }
      }
    },
    updateTicket: async (_, { input }, context, info) => {
      try {

        let id = input.ticket_id;
        delete input.ticket_id
        let total_hours = input.total_hours;
        delete input.total_hours;
        await fd_module.updateTicket(id, input);

        await fd_ticket_conversations_model.update({total_hours: total_hours}, {
          where: {
            ticket_id: id,
          },
        });
        return {
          status: '200',
          message: 'Ok',
        }
      } catch (error) {
        // console.log(error);
        return {
          error: JSON.stringify(error),
          status: '500',
          message: 'Error',
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


export { typeDefs, resolvers }
