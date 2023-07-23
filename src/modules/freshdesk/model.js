import {DataTypes, ENUM } from'sequelize';
import koneksi from '../../config/koneksi.js';

const Ticket = koneksi.define('fd_tickets', {
    // Model attributes are defined here
    id: {
      type: DataTypes.STRING,
        primaryKey: true
      },
    json: {
      type: DataTypes.JSONB
    },
    "ticket_id" : {
      type: DataTypes.BIGINT,
      unique: true
    },
    "cc_emails" : {
      type: DataTypes.JSONB
    },
  "fwd_emails" : {
    type: DataTypes.JSONB
  },
  "reply_cc_emails" : {
    type: DataTypes.JSONB
  },
  "ticket_cc_emails" : {
    type: DataTypes.JSONB
  },
  "tags" : {
    type: DataTypes.JSONB
  },
  "email_config_id" : {
    type: DataTypes.BIGINT
  },
  "group_id" : {
    type: DataTypes.BIGINT
  },
  "priority" : {
    type: DataTypes.INTEGER
  },
  "requester_id" : {
    type: DataTypes.BIGINT
  },
  "responder_id" : {
    type: DataTypes.BIGINT
  },
  "source" : {
    type: DataTypes.INTEGER
  },
  "status" : {
    type: DataTypes.INTEGER
  },
  "subject" : {
    type: DataTypes.TEXT
  },
  "company_id" : {
    type: DataTypes.BIGINT
  },

  "type" : {
    type: DataTypes.STRING
  },
  "to_emails" : {
    type: DataTypes.TEXT
  },
  "product_id" : {
    type: DataTypes.BIGINT
  },
  "fr_escalated" : {
    type: DataTypes.BOOLEAN
  },
  "spam" : {
    type: DataTypes.BOOLEAN
  },
  "urgent" : {
    type: DataTypes.BOOLEAN
  },
  "is_escalated" : {
    type: DataTypes.BOOLEAN
  },
  "fd_created_at" : {
    type: DataTypes.DATE
  },
  "fd_updated_at" : {
    type: DataTypes.DATE
  },
  "due_by" : {
    type: DataTypes.DATE
  },
  "fr_due_by" : {
    type: DataTypes.DATE
  },
  "nr_due_by" : {
    type: DataTypes.DATE
  },
  nr_escalated:{
    type: DataTypes.BOOLEAN
  },
  json_custom_field: {
    type: DataTypes.JSONB
  },
  "cf_best_number_to_reach" : {
    type: DataTypes.STRING
  },
  "cf_best_number_note" : {
    type: DataTypes.STRING
  },
  "cf_quotewekrs" : {
    type: DataTypes.STRING
  },
  "cf_qbsalesorder" : {
    type: DataTypes.STRING
  },
  "cf_qbinv" : {
    type: DataTypes.STRING
  },
  "cf_totalhours" : {
    type: DataTypes.STRING
  },
  }, {
    // Other model options go here
    freezeTableName: true,
    paranoid:true,
    deletedAt: 'deleted'
  });
export default Ticket;