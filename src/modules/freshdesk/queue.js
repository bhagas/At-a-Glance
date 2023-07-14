const Queue = require('bull');
const model = require('./model');
const uuid = require('uuid');
const fd_module = require("./module");
const queue_create = new Queue('create_ticket', `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);
// const create_queue = new Queue('create_ticket', { redis: { port: 8379, host: '8.215.33.60'} });

queue_create.process(50,async function (job, done) {
    try {
        let input ={};
        input.id=uuid.v4()
        input.json = job.data.freshdesk_webhook
        let ticket = await fd_module.getTicketByid(job.data.freshdesk_webhook.ticket_id);
        ticket.fd_created_at = ticket.created_at;
        ticket.fd_updated_at = ticket.updated_at;
        ticket.ticket_id = ticket.id;
        delete ticket.created_at;
        delete ticket.updated_at;
        delete ticket.description;
        delete ticket.description_text;
        delete ticket.custom_fields;
        delete ticket.attachments;
        delete ticket.source_additional_info;
        delete ticket.id;
        let merged = {...input, ...ticket};
        await model.create(merged)
        done();
    } catch (error) {
        done(new Error(error));
    }

  });

  const queue_update = new Queue('update_ticket', `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);
// const create_queue = new Queue('create_ticket', { redis: { port: 8379, host: '8.215.33.60'} });

queue_update.process(50,async function (job, done) {
    try {
        let input ={};
        input.id=uuid.v4()
        input.json = job.data.freshdesk_webhook
        let ticket = await fd_module.getTicketByid(job.data.freshdesk_webhook.ticket_id);
        ticket.fd_created_at = ticket.created_at;
        ticket.fd_updated_at = ticket.updated_at;
        ticket.ticket_id = ticket.id;
        delete ticket.created_at;
        delete ticket.updated_at;
        delete ticket.description;
        delete ticket.description_text;
        delete ticket.custom_fields;
        delete ticket.attachments;
        delete ticket.source_additional_info;
        delete ticket.id;
        let merged = {...input, ...ticket};
        await model.update(merged,  { where: { ticket_id: merged.ticket_id } })
        done();
    } catch (error) {
        done(new Error(error));
    }

  });

module.exports ={queue_create, queue_update}