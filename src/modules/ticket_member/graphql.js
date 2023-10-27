import db from'../../config/koneksi.js';
import { QueryTypes } from'sequelize';
import agentsModel from'./model.js';
import rolePoolModel from'../rolePool/model.js';
import gql from'graphql-tag';
import { v4 as uuidv4 } from'uuid';
import jwt from'../../helper/jwt.js';
import mail from'../../helper/mail.js';
import bcrypt from'../../helper/bcrypt.js';
import fd_agent_member_model from '../fd_agent_member/model.js'
import ticket_member from './model.js'
const typeDefs=
  gql`
  extend type Query{
    listMemberByTicket(ticketId:ID!):listAgentMemberResult
  }
#   type listAgentMemberResult{
#   data:[agentMember],
#   message:String,
#   status:Int
# }
# type agentMember{
#   id_agent:String,
#   id_member: String,
#   idUserAgent:String,
#   memberName:String,
#   id:String,
#   hour_salary:String,
#   salary:String
# }
  extend type Mutation {
    # syncAgents: Output
    addMemberToTicket(idAgent:ID!,idUserAgent:ID!, idUserMember:ID!, fd_ticket_id:ID!):Output
    removeMemberFromTicket(id:ID!):Output
  }
  
`

const resolvers= {
  Query: {
    listMemberByTicket: async (obj, args, context, info) => {
      try {
        let dt = await db.query('select a.*, b.name as "memberName" from ticket_member a join users b on a.id_member  = b.id where a."deletedAt" is null and a.fd_ticket_id=$1',{bind: [args.ticketId],type: QueryTypes.SELECT});
   
        return {data: dt, status:200, message:'Success'};
          } catch (error) {
            console.log(error);
          }
    
        },
    
},
Mutation:{
  
    addMemberToTicket: async(_, {idAgent, idUserAgent, idUserMember, fd_ticket_id}, context)=>{
    try {
    
      await ticket_member.create({id: uuidv4(),id_agent: idAgent, id_member:idUserMember, id_user_agent:idUserAgent,fd_ticket_id, created_by:context.user_app.id})
      return {
        status: '200',
        message: 'success'
    }
    } catch (error) {
      return {
        status: '500',
        message: 'Failed',
        error
    }
    }
   
  },


  removeMemberFromTicket: async(_, {id})=>{
    try {
    
      await ticket_member.destroy({where: {id}})
      return {
        status: '200',
        message: 'success'
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


export {typeDefs, resolvers}
