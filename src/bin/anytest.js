import fd_module from"../modules/freshdesk/module.js";
import model from"../modules/freshdesk/model.js";
// let ticket = await fd_module.getTicketByid(5510);
// console.log(ticket);
let results = await model.update({ticket_id:4953},  { where: { ticket_id: 4953 }, returning:true })
console.log(results[1][0].dataValues.id);

