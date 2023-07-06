const {DataTypes, ENUM } = require('sequelize');
const koneksi = require('../../config/koneksi.js');

const Ticket = koneksi.define('tickets', {
    // Model attributes are defined here
    id: {
      type: DataTypes.STRING,
        primaryKey: true
      },
    json: {
      type: DataTypes.TEXT
    },
    "ticket_id":{
        type: DataTypes.BIGINT
      },
    "ticket_subject":{
        type: DataTypes.STRING
      },
    "ticket_description":{
        type: DataTypes.TEXT
      },
    "ticket_url":{
        type: DataTypes.TEXT
      },
    "ticket_portal_url":{
        type: DataTypes.TEXT
      },
    "ticket_tags":{
        type: DataTypes.TEXT
      },
    "ticket_latest_public_comment":{
        type: DataTypes.TEXT
      },
    "ticket_latest_private_comment":{
        type: DataTypes.TEXT
      },
    "ticket_group_name":{
        type: DataTypes.TEXT
      },
    "ticket_agent_name":{
        type: DataTypes.STRING
      },
    "ticket_agent_email":{
        type: DataTypes.STRING
      },
    "ticket_satisfaction_survey":{
        type: DataTypes.TEXT
      },
    "ticket_due_by_time":"July 10 2023 at 05:00 PM EDT",
    "ticket_status":{
        type: DataTypes.STRING
      },
    "ticket_priority":{
        type: DataTypes.STRING
      },
    "ticket_source":{
        type: DataTypes.STRING
      },
    "ticket_ticket_type":{
        type: DataTypes.STRING
      },
    "ticket_cf_reference_number":{
        type: DataTypes.STRING
      },
    "helpdesk_name":{
        type: DataTypes.STRING
      },
    "ticket_portal_name":{
        type: DataTypes.STRING
      },
    "ticket_product_description":{
        type: DataTypes.TEXT
      },
    "triggered_event":{
        type: DataTypes.TEXT
      },
    "ticket_company_name":{
        type: DataTypes.STRING
      },
    "ticket_company_note":{
        type: DataTypes.TEXT
      },
    "ticket_company_domains":{
        type: DataTypes.STRING
      },
    "ticket_company_health_score":{
        type: DataTypes.STRING
      },
    "ticket_company_account_tier":{
        type: DataTypes.STRING
      },
    "ticket_company_renewal_date":{
        type: DataTypes.STRING
      },
    "ticket_company_industry":{
        type: DataTypes.STRING
      },
    "ticket_contact_name":{
        type: DataTypes.STRING
      },
    "ticket_contact_firstname":{
        type: DataTypes.STRING
      },
    "ticket_contact_lastname":{
        type: DataTypes.STRING
      },
    "ticket_contact_mobile":{
        type: DataTypes.STRING
      },
    "ticket_contact_email":{
        type: DataTypes.STRING
      },
    "ticket_contact_phone":{
        type: DataTypes.STRING
      },
    "ticket_contact_address":{
        type: DataTypes.STRING
      },
    "ticket_contact_unique_external_id":{
        type: DataTypes.STRING
      },
    "ticket_company_description":{
        type: DataTypes.STRING
      }
  }, {
    // Other model options go here
    freezeTableName: true,
    paranoid:true,
    deletedAt: 'deleted'
  });
module.exports = Ticket;