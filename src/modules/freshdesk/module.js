require('dotenv').config()
const axios = require('axios');
const API_KEY = process.env.FD_API_KEY;
const FD_ENDPOINT = process.env.FD_ENDPOINT;
const URL =  "https://" + FD_ENDPOINT + ".freshdesk.com";

class Fd{
    static getAllTickets(){
        return new Promise(async (resolve, reject) => {
            try {
                let PATH = "/api/v2/tickets?include=description";
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
// Fd.getTicketByid(10)
module.exports =Fd