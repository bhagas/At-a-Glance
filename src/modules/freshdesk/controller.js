
// const model = require('./model');
const uuid = require('uuid');
const fd_module = require("./module");
const {queue_create, queue_update} = require('./queue');
class Fd{
   static async ticketCreate(req,res){
      // console.log(req.body);
      try {
        
         queue_create.add(req.body,{delay:60000});
         res.json({status:'ok'})
      } catch (error) {
         console.log(error);
         res.json({status:"Failed", error})
      }
   }

   static async ticketUpdate(req,res){
     
      try {
        
         queue_update.add(req.body, {delay:60000})
         res.json({status:'ok'})
      } catch (error) {
         console.log(error);
         res.json({status:"Failed", error})
      }
   }
}

module.exports = Fd;