const db = require('../../config/koneksi.js');
const { QueryTypes } = require('sequelize');
const agentsModel = require('./model.js');
const rolePoolModel = require('../rolePool/model.js');
const gql = require('graphql-tag');
const uuid = require('uuid');
const jwt = require('../../helper/jwt.js');
const mail = require('../../helper/mail');
const bcrypt = require('../../helper/bcrypt');
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
   
      input.id=uuid.v4()
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


module.exports = {typeDefs, resolvers}
