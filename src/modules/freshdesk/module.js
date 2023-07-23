import 'dotenv/config'
import axios from'axios';
import { v4 as uuidv4 } from'uuid';
import model from'./model.js';
import modelAgents from'../freshdesk_agents/model.js';
const API_KEY = process.env.FD_API_KEY;
const FD_ENDPOINT = process.env.FD_ENDPOINT;
const URL =  "https://" + FD_ENDPOINT + ".freshdesk.com";

class Fd{
    static getAllTickets(){
        return new Promise(async (resolve, reject) => {
            try {
              let page =1;
              let tickets =[];
              let link ='yay'
              while (link) {
                let PATH = `/api/v2/tickets?per_page=10&page=${page}`;
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
              
              }
           
                resolve(tickets)
            } catch (error) {
                    
              reject(error.response.data.description)
            }
          
        })

    }
    static syncTicket(){
      return new Promise(async (resolve, reject) => {
        try {
          let tickets = await this.getAllTickets();
          for (let i = 0; i < tickets.length; i++) {
            tickets[i].ticket_id = tickets[i].id;
            tickets[i].id =  uuidv4();
            tickets[i].fd_created_at = tickets[i].created_at
            tickets[i].fd_updated_at = tickets[i].fd_updated_at
          }
             
                //  console.log(tickets)
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
              let PATH = `/api/v2/tickets/${id}?include=conversations`;
              let dt =    await axios.get(URL+PATH, {
                      auth: {
                        username: API_KEY,
                        password: "X"
                      }
                    });
                    console.log(dt.data);
                    resolve(dt.data)
          } catch (error) {
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
          console.log(error.response.data.errors, 'error createReply');
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
        console.log(error, 'error createNotes');
              reject(error)
      }
    
  })

}
}
// Fd.getTicketByid(52)
// Fd.getAllAgents();
export default Fd