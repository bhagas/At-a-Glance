import Queue from'bull';
import model from'./model.js';
import { v4 as uuidv4 } from'uuid';
import fd_module from"./module.js";
import activitiesModel from'../freshdesk_activites/model.js'
import pubsub from '../../config/redis.js'
import * as Sentry from "@sentry/node";
let redisConn = `redis://${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}?db=${process.env.REDIS_DB}`
const queue_create = new Queue('create_ticket', redisConn);
// const create_queue = new Queue('create_ticket', { redis: { port: 8379, host: '8.215.33.60'} });

queue_create.process(50,async function (job, done) {
    try {
        let input ={};
        input.id=uuidv4()
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
        ticket.to_emails = JSON.stringify(ticket.to_emails);
        let merged = {...input, ...ticket};
        // console.log(merged, 'tickets created');
        await model.create(merged)
        pubsub.publish('UPDATE_TICKET', {
            syncTicket: {
              status: 'New Ticket Added',
              progress: '',
            },
          });
        done();
    } catch (error) {
        console.log(error);
        Sentry.captureException(error);
        done(new Error(error));
    }

  });

  const queue_update = new Queue('update_ticket', redisConn);
// const create_queue = new Queue('create_ticket', { redis: { port: 8379, host: '8.215.33.60'} });

queue_update.process(50,async function (job, done) {
    // console.log(job, 'job');
    try {
        let input ={};
        // input.id=uuidv4()
        // input.json = job.data.freshdesk_webhook
        let ticket = await fd_module.getTicketByid(job.data.freshdesk_webhook.ticket_id);
        let id = ticket.id;
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
        ticket.to_emails = JSON.stringify(ticket.to_emails);
        let merged = {...input, ...ticket};
       
        await model.update(merged,  { where: { ticket_id: merged.ticket_id } })
        await activitiesModel.create({
          id:uuidv4(),
            freshdesk_id:id,
            status: merged.status,
            priority: merged.priority

        })
        done();
    } catch (error) {
      console.log(error);
      Sentry.captureException(error);
        done(new Error(error));
    }

  });

export  {queue_create, queue_update}