
const model = require('./model');
const uuid = require('uuid');
class Fd{
   static async ticketUpdate(req,res){
      // console.log(req.body);
      let input ={};
      input.id=uuid.v4()
      input.json = JSON.stringify(req.body)
      let merged = {...input, ...req.body.freshdesk_webhook};
      await model.create(merged)
      res.json({status:'ok'})
   }
}

module.exports = Fd;