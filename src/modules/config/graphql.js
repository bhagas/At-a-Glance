import db from'../../config/koneksi.js';
import { QueryTypes } from'sequelize';
import configModel from'./model.js';
import gql from'graphql-tag';
import { v4 as uuidv4 } from'uuid';
import mail from '../../helper/mail.js'
const typeDefs=
  gql`
  extend type Query {
 
      config: configResult,
      testSendMail: Output
  }
  extend type Mutation {

    updateConfig(input: configInput): Output
  }


type configResult{
  data:[Config],
  message:String,
  status:Int,
  error:String
}
  
  input configInput {
    mail_user: String,
    mail_from:String,
    mail_host:String,
    mail_port:Int,
    mail_password:String,
    mail_secure:Boolean
  }


  type Config {
     mail_user: String,
    mail_from:String,
    mail_host:String,
    mail_port:String,
    mail_password:String,
    mail_secure:Boolean
  }
`

const resolvers= {
  Query: {
    config: async (obj, args, context, info) => {

      let dt = await db.query("select * from config where id='60d9c4ad-d770-4999-9468-a7953fbc42xx'");
      //bisa array return nya
      return {data: dt[0], status:200, message:'Success'};
       
    },

    testSendMail: async (obj, args, context, info) => {
try {
    let dt = await mail("belajar@fosan.id", "test","<p>aaa</p>");
    //bisa array return nya
    return {
        status: '200',
        message: 'Success'
    }
} catch (error) {
    return {
        error,
        status: '200',
        message: 'failed'
    }
}
       
         
      },
   
},
Mutation:{

 
  updateConfig: async (_, {input})=>{
    
      await configModel.update(
       input,
        { where: { id:"60d9c4ad-d770-4999-9468-a7953fbc42xx" } }
      )
      return {
          status: '200',
          message: 'Updated'
      }
  }
}
}


export {typeDefs, resolvers}
