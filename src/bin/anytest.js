import fd_module from"../modules/freshdesk/module.js";

let ticket = await fd_module.getTicketByid(5510);
console.log(ticket);
