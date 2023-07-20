require('dotenv').config()
const axios = require('axios');
const uuid = require('uuid');
const model = require('./model.js');
const modelAgents = require('../freshdesk_agents/model');
const API_KEY = process.env.FD_API_KEY;
const FD_ENDPOINT = process.env.FD_ENDPOINT;
const URL =  "https://" + FD_ENDPOINT + ".freshdesk.com";

class Fd{
    static getAllTickets(){
        return new Promise(async (resolve, reject) => {
            try {
                let PATH = "/api/v2/tickets";
                let dt =    await axios.get(URL+PATH, {
                        auth: {
                          username: API_KEY,
                          password: "X"
                        }
                      });
                      console.log(dt.data);
                    
                      resolve(dt.data)
            } catch (error) {
                    reject(error)
            }
          
        })

    }
    static syncTicket(){
      return new Promise(async (resolve, reject) => {
        try {
          let tickets = await this.getAllTickets();
          for (let i = 0; i < tickets.length; i++) {
            tickets[i].ticket_id = tickets[i].id;
            tickets[i].id =  uuid.v4();
            tickets[i].fd_created_at = tickets[i].created_at
            tickets[i].fd_updated_at = tickets[i].fd_updated_at
          }
             
                // resolve(dt.data)
                console.log(tickets.length);
                await model.bulkCreate(tickets, {
                  updateOnDuplicate: ['ticket_id', 'cc_emails',"fwd_emails","reply_cc_emails","ticket_cc_emails","tags","email_config_id","group_id","priority","requester_id","responder_id","source","status","subject","company_id","type","to_emails","product_id","fr_escalated","spam","is_escalated","due_by","fr_due_by","nr_due_by","nr_escalated","fd_updated_at","fd_created_at"]
                });
                resolve()
      } catch (error) {
              reject(error)
      }
       
      })
    
    }
    static getAllGroups(){
        return new Promise(async (resolve, reject) => {
            try {
                let PATH = "/api/v2/admin/groups";
                let dt =    await axios.get(URL+PATH, {
                        auth: {
                          username: API_KEY,
                          password: "X"
                        }
                      });
               
                      resolve(dt.data)
            } catch (error) {
                    reject(error)
            }
          
        })

    }
    static getAllAgents(){

    

      return new Promise(async (resolve, reject) => {
          try {
              let PATH = "/api/v2/agents";
              let dt =    await axios.get(URL+PATH, {
                      auth: {
                        username: API_KEY,
                        password: "X"
                      }
                    });
                    // console.log(dt.data);
                    resolve(dt.data)
          } catch (error) {
                  reject(error)
          }
        
      })

  }

  static syncAgents(){
    return new Promise(async (resolve, reject) => {
      try {
        let agents = await this.getAllAgents();
        let dt =[]
        for (let i = 0; i < agents.length; i++) {
          let x ={}
          x.id = agents[i].id;
          x.available = agents[i].available
          x.ticket_scope = agents[i].ticket_scope
          x.type = agents[i].type
          x.active = agents[i].contact.active
          x.email = agents[i].contact.email
          x.name = agents[i].contact.name
          x.phone = agents[i].contact.phone
          dt.push(x)
        }
           
              // resolve(dt.data)
              // console.log(tickets.length);
              await modelAgents.bulkCreate(dt, {
                updateOnDuplicate: ['id', 'available',"ticket_scope","type","active","email","name","phone"]
              });
              resolve()
    } catch (error) {
            reject(error)
    }
     
    })
  }
    static getAgentsInGroup(group_id){
        return new Promise(async (resolve, reject) => {
            try {
                let PATH = "/api/v2/admin/groups/"+group_id+"/agents";
                let dt =    await axios.get(URL+PATH, {
                        auth: {
                          username: API_KEY,
                          password: "X"
                        }
                      });
                      
                      resolve(dt.data)
            } catch (error) {
                    reject(error)
            }
          
        })

    }

    static getTicketByid(id){
      return new Promise(async (resolve, reject) => {
          try {
              let PATH = `/api/v2/tickets/${id}`;
              let dt =    await axios.get(URL+PATH, {
                      auth: {
                        username: API_KEY,
                        password: "X"
                      }
                    });
                    console.log(dt.data);
                    resolve(dt.data)
          } catch (error) {
                  reject(error)
          }
        
      })

  }
}
// Fd.getTicketByid(16)
// Fd.getAllAgents();
module.exports =Fd