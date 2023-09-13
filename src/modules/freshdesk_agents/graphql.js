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
const typeDefs=
  gql`
  extend type Query{
    listAgentMember(idAgent:ID!):listAgentMemberResult
  }
  type listAgentMemberResult{
  data:[agentMember],
  message:String,
  status:Int
}
type agentMember{
  id_agent:String,
  id_member: String,
  idUserAgent:String,
  memberName:String
}
  extend type Mutation {
    # syncAgents: Output
    addMemberToAgent(idAgent:ID!,idUserAgent:ID!, idUserMember:ID!):Output
  }
  
`

const resolvers= {
  Query: {
    listAgentMember: async (obj, args, context, info) => {
      try {
        let dt = await db.query('select a.*, b.name as "memberName" from fd_agent_member a join users b on a.id_user_agent  = b.id where a.deleted is null and a.id_agent=$1',{bind: [args.idAgent],type: QueryTypes.SELECT});
   
        return {data: dt, status:200, message:'Success'};
          } catch (error) {
            console.log(error);
          }
    
        }
},
Mutation:{
  
  addMemberToAgent: async(_, {idAgent, idUserAgent, idUserMember})=>{
    try {
    
      await fd_agent_member_model.create({id: uuidv4(),id_agent: idAgent, id_member:idUserMember, id_user_agent:idUserAgent})
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
