
// const model from'./model');
import { v4 as uuidv4 } from'uuid';
import fd_module from "./module.js";
import {queue_create, queue_update} from'./queue.js';
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

export default Fd;