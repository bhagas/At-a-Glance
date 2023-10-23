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
import fd_agent from './model.js'
const typeDefs=
  gql`
  extend type Query{
    listAgentMember(idAgent:ID!):listAgentMemberResult
    listAgentByMember(email: String): listAgentOutput
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
  memberName:String,
  id:String,
  hour_salary:String,
  salary:String
}
  extend type Mutation {
    # syncAgents: Output
    addMemberToAgent(idAgent:ID!,idUserAgent:ID!, idUserMember:ID!, hour_salary:String, salary:String):Output
    updateAgentSalary(id:ID!, hour_salary:Int, salary:Int):Output
    updateSalaryMember(id:ID!, hour_salary:Int, salary:Int):Output
    removeMemberFromAgent(id:ID!):Output
  }
  
`

const resolvers= {
  Query: {
    listAgentMember: async (obj, args, context, info) => {
      try {
        let dt = await db.query('select a.*, b.name as "memberName" from fd_agent_member a join users b on a.id_member  = b.id where a.deleted is null and a.id_agent=$1',{bind: [args.idAgent],type: QueryTypes.SELECT});
   
        return {data: dt, status:200, message:'Success'};
          } catch (error) {
            console.log(error);
          }
    
        },
        listAgentByMember: async (obj, {email}, context, info) => {
          try {
            // console.log(args);
            let dt = await db.query('select a.*, b.name as "memberName" from fd_agent_member a join users b on a.id_member  = b.id where a.deleted is null and b.deleted is null and b.email=$1',{bind: [email],type: QueryTypes.SELECT});
   
            let bind = {}
            let a = ""
            if (dt.length) {
              a += " AND id=$id_agent";
              bind.id_agent = dt[0].id_agent;
            }
            let q = '';
    
            let kolom = `
                  id,
                  name,
                  email,
                  phone,
                  type,
                  active,
                  ticket_scope
                `
            q = `SELECT ${kolom} FROM fd_agents  WHERE deleted is null `+a
       
            const graph_1 = await db.query(q,
              {
                // replacements: [],
                bind,
                type: QueryTypes.SELECT
              });
              // console.log({  data:graph_1,});
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
},
Mutation:{
  
  addMemberToAgent: async(_, {idAgent, idUserAgent, idUserMember, hour_salary,salary})=>{
    try {
    
      await fd_agent_member_model.create({id: uuidv4(),id_agent: idAgent, id_member:idUserMember, id_user_agent:idUserAgent,hour_salary,salary})
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

  updateSalaryMember: async(_, {id, hour_salary,salary})=>{
    try { 
      await fd_agent_member_model.update({ hour_salary,salary},{
        where: {
          id,
        },
      })
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

  updateAgentSalary: async(_, {id, hour_salary,salary})=>{
    try {
    
      await fd_agent.update({ hour_salary,salary},{
        where: {
          id,
        },
      })
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
  removeMemberFromAgent: async(_, {id})=>{
    try {
    
      await fd_agent_member_model.destroy({where: {id}})
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
