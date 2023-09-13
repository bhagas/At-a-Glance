import db from'../../config/koneksi.js';
import { QueryTypes } from'sequelize';
import userModel from'./model.js';
import rolePoolModel from'../rolePool/model.js';
import gql from'graphql-tag';
import { v4 as uuidv4 } from'uuid';
import jwt from'../../helper/jwt.js';
import mail from'../../helper/mail.js';
import bcrypt from'../../helper/bcrypt.js';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';


const typeDefs=
  gql`
#   enum CacheControlScope {
#   PUBLIC
#   PRIVATE
# }

# directive @cacheControl(
#   maxAge: Int
#   scope: CacheControlScope
#   inheritMaxAge: Boolean
# ) on FIELD_DEFINITION | OBJECT | INTERFACE | UNION
  scalar Upload
  extend type Query {
    """
    Deskripsi untuk user
    berisi tentang profil user
    """
      users: usersResult
      "Query untuk user by id"
      user(id: ID, email: String): usersResult
  }
  extend type Mutation {
    createUser(input: UserInput): Output
    updateUser(idUser: ID!, input: UserInputEdit): Output
    login(input: LoginInput): OutputLogin
    activation(token:String!, password:String!): Output
    setRole(idUser:String!, roles:[inputRole]): Output
    removeUser(idUser:String!): Output
  }


type usersResult{
  data:[User],
  message:String,
  status:Int
}
  
  input UserInput {
    name: String,
    email: String!,
    status: String,
    password: String!
  }

  input UserInputEdit {
    name: String,
    email: String,
    status: String
  }
  input LoginInput {
    email: String!,
    password:String!
  }
  input inputRole{
    roleId:String
  }

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }
  type User {
     id: ID!,
     name: String,
     email: String,
     createdAt: String,
     updatedAt:String,
     roles:[Role],
     status:String,
     agent_id: String
  }
  type OutputLogin{
    status:String,
    message:String,
    error:String,
    token:String,
    user:User
  }
  type Output{
    status:String,
    message:String,
    error:String
  }
  
`


const resolvers= {
  Upload: GraphQLUpload,
  Query: {
    users: async (obj, args, context, info) => {
      try {
        let dt = await db.query('select * from users where deleted is null',{type: QueryTypes.SELECT});
   
        for (let i = 0; i < dt.length; i++) {
          dt[i].roles= await db.query(`select b.id, b.code, b.role_name from role_pool a join roles b on a."roleId" = b.id where a."userId"= $1`, { bind: [dt[i].id],type: QueryTypes.SELECT });
        }
        info.cacheControl.setCacheHint({ maxAge: 10 });
        return {data: dt, status:200, message:'Success'};
      } catch (error) {
        console.log(error);
      }
    
       
    },
    user: async (obj, args, context, info) =>
        {
           try {
            let dt =[];
            if(args.id){
              dt = await db.query(`select * from Users where id= $1`,{bind:[args.id], type:QueryTypes.SELECT});
            }else if(args.email){
              dt = await db.query(`select * from Users where email= $1`,{bind:[args.email], type:QueryTypes.SELECT});
           
            }
          //harus object return nya
          // info.cacheControl.setCacheHint({ maxAge: 0 });
          if(dt.length){
            dt[0].roles= await db.query(`select b.id, b.code, b.role_name from role_pool a join roles b on a."roleId" = b.id where a."userId"= $1`, { bind: [dt[0].id],type: QueryTypes.SELECT });
            let agent= await db.query(`select a.id from fd_agents a where a."email"= $1`, { bind: [dt[0].email],type: QueryTypes.SELECT });
           if(agent.length){
            dt[0].agent_id = agent[0].id;
           }else{
            dt[0].agent_id =null
           }
           
        
                return {
                    status: '200',
                    message: 'Success',
                 
                    data: [dt[0]]
                }
          }else{
            return {
              status: '200',
              message: 'Success',
       
              data: []
          }
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
},
Mutation:{
  createUser: async (_, {input})=>{
    try {
    //  let file = await saveFile(await image);
   
      input.id=uuidv4()
      // input.password=await enkrip.hash(input.password)
      input.confirmation_code = await jwt.generate({id: input.id}, '1h');
      let html =`<h1>Invitation</h1>
      <h2>Hello ${input.name}</h2>
      <p>Transition has invited you, You can login using this email as username and password: ${input.password}</p>
      <a href=${process.env.FE_URI}> Click here</a>
      </div>`
      mail(input.email, "Transition has invited you", html)
      input.status='active';
     await userModel.create(input)
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
  login: async (_, {input})=>{
    try {
      
      let dt = await db.query(`select * from users where email= $1 and deleted is null`, { bind: [input.email],type: QueryTypes.SELECT });
     if(dt.length){
      let hasil = await bcrypt.compare(input.password, dt[0].password);
 
      if(hasil){
        dt[0].roles= await db.query(`select b.id, b.code, b.role_name from role_pool a join roles b on a."roleId" = b.id where a."userId"= $1`, { bind: [dt[0].id],type: QueryTypes.SELECT });
        agent= await db.query(`select a.id from fd_agents a where a."email"= $1`, { bind: [input.email],type: QueryTypes.SELECT });
        dt[0].agent_id = agent[0].id;
        let token = await jwt.generate({id: dt[0].id}, '24h')
            return {
                status: '200',
                message: 'Success',
                token,
                user: dt[0]
            }
      }else{
        
        return {
          status: '403',
          message: 'Wrong Password',
          }
        }
      }else{
        return {
            status: '403',
            message: 'Email is not registered',
        }
     }
     
    } catch (error) {
      console.log(error);
      return {
        status: '500',
        message: 'gagal',
        error
    }
    }
   
  },
  activation: async (_, {token, password})=>{
    try {
      let user=await jwt.verify(token);
      if(user){
        let dt = await db.query(`select * from users where confirmation_code= $1 and deleted is null`, { bind: [token],type: QueryTypes.SELECT });
        
        if(dt.length){
         dt[0].roles= await db.query(`select b.id, b.code, b.role_name from role_pool a join roles b on a."roleId" = b.id where a."userId"= $1`, { bind: [dt[0].id],type: QueryTypes.SELECT });
       
         let pass = await bcrypt.gen(password);
     
         await userModel.update(
          {status:'active', password:pass},
           { where: { id:dt[0].id } }
         )
           return {
               status: '200',
               message: 'Success',
               user: dt[0]
           }
        }else{
         return {
           status: '403',
           message: 'User is not registered',
       }
        }
      }else{
        return {
          status: '500',
          message: 'Token Expired',
      }
      }
   
     
    } catch (error) {
      console.log(error);
      return {
        status: '500',
        message: 'Internal Server Error',
        error
    }
    }
   
  },
  updateUser: async (_, {idUser, input})=>{
      // console.log(idUser, input);
      await userModel.update(
        input,
         { where: { id:idUser } }
       )
      return {
          status: '200',
          message: 'Updated'
      }
  },

  removeUser: async (_, {idUser})=>{
    // console.log(idUser, input);
    try {
      await userModel.destroy(
        { where: { id:idUser } }
      )
     return {
         status: '200',
         message: 'Removed'
     }
    } catch (error) {
      return {
        status: '500',
        message: 'Internal Server Error',
        error:JSON.stringify(error)
    }
   } 
    },
    

  setRole: async (_, {idUser, roles})=>{
    try {
 
      const result = await db.transaction(async (t) => {
        await rolePoolModel.destroy({
          where: {
            userId:idUser
          },
          force: true,
          transaction: t
        });
        for (let i = 0; i < roles.length; i++) {
          roles[i].id = uuidv4();
          roles[i].userId = idUser;
          
        }
        // console.log(idUser, roles);
       await rolePoolModel.bulkCreate(roles, {transaction:t})
          return {
            status: '200',
            message: 'Updated'
        }
      })

      return result
    } catch (error) {
      console.log(error);
      return {
        status: '500',
        message: 'Failed',
        error
    }
    }
   
}
}
}


export {typeDefs, resolvers}
