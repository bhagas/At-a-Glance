import db from'../../config/koneksi.js';
import { QueryTypes } from'sequelize';
import agentsModel from'./model.js';
import rolePoolModel from'../rolePool/model.js';
import gql from'graphql-tag';
import { v4 as uuidv4 } from'uuid';
import jwt from'../../helper/jwt.js';
import mail from'../../helper/mail.js';
import bcrypt from'../../helper/bcrypt.js';
const typeDefs=
  gql`

  extend type Mutation {
    syncAgents(): Output

  }


  
`

const resolvers= {
  Query: {
    // users: async (obj, args, context, info) => {
    //   try {
    //     let dt = await db.query('select * from users where deleted is null',{type: QueryTypes.SELECT});
   
    //     for (let i = 0; i < dt.length; i++) {
    //       dt[i].roles= await db.query(`select b.id, b.code, b.role_name from role_pool a join roles b on a."roleId" = b.id where a."userId"= $1`, { bind: [dt[i].id],type: QueryTypes.SELECT });
    //     }
     
    //     return {data: dt, status:200, message:'Success'};
    //   } catch (error) {
    //     console.log(error);
    //   }
    
       
    // },
    // user: async (obj, args, context, info) =>
    //     {
           
    //       let dt = await db.query(`select * from Users where id= $1`,{bind:[args.id], type:QueryTypes.SELECT});
    //       //harus object return nya
    //         return dt[0];
    //     },
},
Mutation:{
    syncAgents: async (_)=>{
    try {
    //  let file = await saveFile(await image);
   
      input.id=uuidv4()
      // input.password=await enkrip.hash(input.password)
        
     await agentsModel.create(input)
        return {
            status: '200',
            message: 'Berhasil Simpan'
        }
    } catch (error) {
      console.log(error);
      return {
        status: '500',
        message: 'gagal',
        error: JSON.stringify(error)
    }
    }
   
  },


}
}


export {typeDefs, resolvers}
