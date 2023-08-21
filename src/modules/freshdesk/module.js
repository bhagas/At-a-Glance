import 'dotenv/config'
import axios from'axios';
import { v4 as uuidv4 } from'uuid';
import model from'./model.js';
import modelAgents from'../freshdesk_agents/model.js';
import PubSUb from '../../config/redis.js'
const API_KEY = process.env.FD_API_KEY;
const FD_ENDPOINT = process.env.FD_ENDPOINT;
const URL =  "https://" + FD_ENDPOINT + ".freshdesk.com";
let stillUpdate = false;
class Fd{
    static getAllTickets(startDate){
        return new Promise(async (resolve, reject) => {
            try {
              let date = "2023-01-01";
              if(startDate){
                date = startDate;
              }
              let page =1;
              let tickets =[];
              let link ='yay'
              while (link) {
                let PATH = `/api/v2/tickets?include=requester&per_page=${process.env.FD_MAX_TICKETS_GET}&page=${page}&updated_since=${date}T00:00:00Z`;
                let dt =    await axios.get(URL+PATH, {
                        auth: {
                          username: API_KEY,
                          password: "X"
                        }
                      });
                tickets = tickets.concat(dt.data)
                console.log(dt.headers.link);
                if(dt.headers.link){
                  link = dt.headers.link
                  page++
                }else{
                  link=null
                }
                PubSUb.publish('SYNC_TICKET', {
                  syncTicket: {
                    status: 'Loading data from Freshdesk',
                    progress: '',
                  },
                });
              }
           
                resolve(tickets)
            } catch (error) {
                    console.log(error);
              reject(error.response.data.description)
            }
          
        })

    }
    static syncTicket(startDate){
      return new Promise(async (resolve, reject) => {
        try {
          stillUpdate=true;
          let tickets = await this.getAllTickets(startDate);
          let t = []
          for (let i = 0; i < tickets.length; i++) {
           
            tickets[i].ticket_id = tickets[i].id;
            tickets[i].id =  uuidv4();
            tickets[i].fd_created_at = tickets[i].created_at
            tickets[i].fd_updated_at = tickets[i].fd_updated_at
            tickets[i].requester_name =  tickets[i].requester.name
            tickets[i].requester_email =  tickets[i].requester.email
            tickets[i].json_custom_field = tickets[i].custom_fields
            if(tickets[i].custom_fields.cf_best_number_to_reach){
              tickets[i].cf_best_number_to_reach = tickets[i].custom_fields.cf_best_number_to_reach
            }
            if(tickets[i].custom_fields.cf_best_number_note){
              tickets[i].cf_best_number_note = tickets[i].custom_fields.cf_best_number_note
            }
            if(tickets[i].custom_fields.cf_quotewekrs){
              tickets[i].cf_quotewekrs = tickets[i].custom_fields.cf_quotewekrs
            }
            if(tickets[i].custom_fields.cf_qbsalesorder){
              tickets[i].cf_qbsalesorder = tickets[i].custom_fields.cf_qbsalesorder
            }
            if(tickets[i].custom_fields.cf_qbinv){
              tickets[i].cf_qbinv = tickets[i].custom_fields.cf_qbinv
            }
            if(tickets[i].custom_fields.cf_totalhours){
              tickets[i].cf_totalhours = tickets[i].custom_fields.cf_totalhours
            }
            t.push(tickets[i])
            if(((i+1) % 20)==0 || ((i+1) == tickets.length)){
              PubSUb.publish('SYNC_TICKET', {
                syncTicket: {
                  status: 'Save data to database',
                  progress: '',
                },
              });
                    //  console.log(tickets)
                    console.log(tickets.length);
                    await model.bulkCreate(t, {
                      updateOnDuplicate: ['ticket_id',
                       'cc_emails',
                       "fwd_emails",
                       "reply_cc_emails",
                       "ticket_cc_emails",
                       "tags",
                       "email_config_id",
                       "group_id",
                       "priority",
                       "requester_id",
                       "requester_name",
                       "requester_email",
                       "responder_id",
                       "source",
                       "status",
                       "subject",
                       "company_id",
                       "type",
                       "to_emails",
                       "product_id",
                       "fr_escalated",
                       "spam",
                       "is_escalated",
                       "due_by",
                       "fr_due_by",
                       "nr_due_by",
                       "nr_escalated",
                       "fd_updated_at",
                       "fd_created_at", 
                       "json_custom_field",
                      "cf_best_number_to_reach",
                      "cf_best_number_note",
                      "cf_quotewekrs",
                      "cf_qbsalesorder",
                      "cf_qbinv",
                      "cf_totalhours"]
                    });
                    t=[];
            }
           
  
          }
          stillUpdate=false;

                PubSUb.publish('SYNC_TICKET', {
                  syncTicket: {
                    status: 'Done',
                    progress: '',
                  },
                });
                
                resolve()
      } catch (error) {
        console.log(error);
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
              reject(error.response.data.description)
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
            // console.log(error);
            reject(error.response.data.description)
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
      console.log(error);
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
              reject(error.response.data.description)
            }
          
        })

    }

    static getTicketByid(id){
      return new Promise(async (resolve, reject) => {
          try {
              let PATH = `/api/v2/tickets/${id}?include=conversations,requester`;
              let dt =    await axios.get(URL+PATH, {
                      auth: {
                        username: API_KEY,
                        password: "X"
                      }
                    });
                    // console.log(dt.data);
                    resolve(dt.data)
          } catch (error) {
            console.log(error);
            reject(error.response.data.description)
          }
        
      })

  }

  static createReply(id, data){
    return new Promise(async (resolve, reject) => {
        try {
            let PATH = `/api/v2/tickets/${id}/reply`;
            let dt =    await axios.post(URL+PATH, data, {
                    auth: {
                      username: API_KEY,
                      password: "X"
                    },
                    headers: {
                      'Content-Type': 'multipart/form-data'
                    }
                  });
                  // console.log(dt.data);
                  resolve(dt.data)
        } catch (error) {
          console.log(error.response.data, 'error createReply');
                reject(error.response.data.description)
        }
      
    })

}


static createNotes(id, data){
  return new Promise(async (resolve, reject) => {
      try {
          let PATH = `/api/v2/tickets/${id}/notes`;
          let dt =    await axios.post(URL+PATH, data, {
                  auth: {
                    username: API_KEY,
                    password: "X"
                  },
                  headers: {
                    'Content-Type': 'multipart/form-data'
                  }
                });
                // console.log(dt.data);
                resolve(dt.data)
      } catch (error) {
        console.log(error.response.data, 'error createNotes');
              reject(error)
      }
    
  })

}

static updateNotes(id, data){
  return new Promise(async (resolve, reject) => {
      try {
          let PATH = `/api/v2/conversations/${id}`;
          let dt =    await axios.put(URL+PATH, data, {
                  auth: {
                    username: API_KEY,
                    password: "X"
                  },
                  headers: {
                    'Content-Type': 'multipart/form-data'
                  }
                });
                // console.log(dt.data);
                resolve(dt.data)
      } catch (error) {
        console.log(error, 'error updateNotes');
              reject(error)
      }
    
  })

}

static getTicketFields(id, data){
  return new Promise(async (resolve, reject) => {
      try {
          let PATH = `/api/v2/admin/ticket_fields`;
          let dt =    await axios.get(URL+PATH, {
                  auth: {
                    username: API_KEY,
                    password: "X"
                  }
                });
                console.log(dt.data);
                resolve(dt.data)
      } catch (error) {
        console.log(error, 'error getTicketfields');
              reject(error)
      }
    
  })

}
static updateTicket(id, data){
  return new Promise(async (resolve, reject) => {
      try {
          let PATH = `/api/v2/tickets/${id}`;
          let dt =    await axios.put(URL+PATH, data, {
                  auth: {
                    username: API_KEY,
                    password: "X"
                  },
                  headers: {
                    'Content-Type': 'application/json'
                  }
                });
                // console.log(dt.data);
                resolve(dt.data)
      } catch (error) {
        console.log(error, 'error updateTicket');
              reject(error.response.data)
      }
    
  })

}
static getSyncStatus(){
  return stillUpdate;
}
}
// Fd.getTicketFields()
// Fd.getTicketByid(7)
// Fd.syncTicket();
// Fd.syncAgents();
export default Fd