import db from'../../config/koneksi.js';
import { Model, QueryTypes } from'sequelize';
import locationsModel from'./model.js';
import rolePoolModel from'../rolePool/model.js';
import gql from'graphql-tag';
import { v4 as uuidv4 } from'uuid';
import jwt from'../../helper/jwt.js';
import mail from'../../helper/mail.js';
import bcrypt from'../../helper/bcrypt.js';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';


const typeDefs=
  gql`

  extend type Mutation {
    createLocations(input: locationInput): Output
    updateLocations(id: ID!, input: locationInput): Output
  }



  
  input locationInput{
    fd_conv_id: String!,
    app_fdTicketId: String!,
    fd_ticket_id:String!,
    long:String!,
    lat:String!,
    location_tag:String

  }

 
  
`


const resolvers= {

Mutation:{
  createLocations: async (_, {input}, context)=>{
    try {
    //  let file = await saveFile(await image);
   
    let data = {
        "id": uuidv4(),
        "fd_conv_id": input.fd_conv_id,
        "fdTicketId": input.app_fdTicketId,
        "fd_ticket_id": input.fd_ticket_id,
        "long": input.long,
        "lat": input.lat,
        "location_tag": input.location_tag
      }
      if(context.user_app){
        data.created_by = context.user_app.id
      }
      await locationsModel.create(data)
        return {
            status: '200',
            message: 'Success'
        }
    } catch (error) {
      console.log(error);
      return {
        status: '500',
        message: 'Failed',
        error: JSON.stringify(error)
    }
    }
   
  },
  updateLocations: async (_, {id, input}, context)=>{
    try {
   
    let data = {
        "fd_conv_id": input.fd_conv_id,
        "fdTicketId": input.app_fdTicketId,
        "fd_ticket_id": input.fd_ticket_id,
        "long": input.long,
        "lat": input.lat,
        "location_tag": input.location_tag,
        "created_by":context.user_app.id
      }
      await locationsModel.update(data, {
        where: {
          id: id,
        },
      });
        return {
            status: '200',
            message: 'Success'
        }
    } catch (error) {
      console.log(error);
      return {
        status: '500',
        message: 'Failed',
        error: JSON.stringify(error)
    }
    }
   
  }
}
}


export {typeDefs, resolvers}
