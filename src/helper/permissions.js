import { chain,not,and, or, rule, shield } from"graphql-shield";
import db from '../config/koneksi.js';
import { QueryTypes } from 'sequelize';
import _ from "lodash";

const isAuthenticated = rule({ cache: 'contextual' })(async (parent, args, ctx, info) => {

  if(ctx.user !== null){
  try {
    let user= await db.query(`select * from users where email= $1`, { bind: [ctx.user.email],type: QueryTypes.SELECT });
    // console.log(user, 'dd');
      if(user.length){
       user[0].roles= await db.query(`select b.id, b.code, b.role_name from role_pool a join roles b on a."roleId" = b.id where a."userId"= $1`, { bind: [user[0].id],type: QueryTypes.SELECT });
      }
      ctx.user = user[0];
 
      return true;
  } catch (error) {
    console.log(error);
    return new Error('Not Authenticated');
  }
     
  } else{
      return new Error('Not Authenticated');
  }
 
})


const isActive = rule({ cache: 'contextual' })(async (parent, args, ctx, info) => {
  if(ctx.user.status === 'active'){
      return true;
  } else{
      return new Error('Not Authenticated');
  }
 
})

   
  const isSuperAdmin = rule({ cache: 'contextual' })(async (parent, args, ctx, info) => {
    
    return _.some(ctx.user.roles, ['code', 'A-1']);
  })
   
  const isSalesManager = rule({ cache: 'contextual' })(async (parent, args, ctx, info) => {
    return _.some(ctx.user.roles, ['code', 'A-2']);
  })
   
  const isServiceManager = rule({ cache: 'contextual' })(async (parent, args, ctx, info) => {
    return _.some(ctx.user.roles, ['code', 'A-3']);
  })
  const isOperationsManager = rule({ cache: 'contextual' })(async (parent, args, ctx, info) => {
    return _.some(ctx.user.roles, ['code', 'A-4']);
  })
  const isWarehouseManager = rule({ cache: 'contextual' })(async (parent, args, ctx, info) => {
    return _.some(ctx.user.roles, ['code', 'A-5']);
  })
  const isExecutives = rule({ cache: 'contextual' })(async (parent, args, ctx, info) => {
    return _.some(ctx.user.roles, ['code', 'A-6']);
  })
  const isFieldServices = rule({ cache: 'contextual' })(async (parent, args, ctx, info) => {
    return _.some(ctx.user.roles, ['code', 'A-7']);
  })
  const isSalesReps = rule({ cache: 'contextual' })(async (parent, args, ctx, info) => {
    return _.some(ctx.user.roles, ['code', 'A-8']);
  })
  // Permissions
  const permissions = shield({
    Query: {
      // users: chain(isAuthenticated, isActive,isSuperAdmin),
      // user:chain(isAuthenticated, isActive,isSuperAdmin),
      // role:chain(isAuthenticated, isActive,isSuperAdmin),
      // roles:chain(isAuthenticated, isActive,isSuperAdmin)
    },
    Mutation:{
      // createRole:chain(isAuthenticated, isActive, isSuperAdmin),
      // createUser:chain(isAuthenticated, isActive, isSuperAdmin),
      // removeRole:chain(isAuthenticated, isActive,isSuperAdmin),
      // removeUser:chain(isAuthenticated, isActive,isSuperAdmin),
      // setRole:chain(isAuthenticated, isActive,isSuperAdmin),
      // updateRole:chain(isAuthenticated, isActive,isSuperAdmin),
      // updateUser:chain(isAuthenticated, isActive,isSuperAdmin),
      // agentSync:chain(isAuthenticated, isActive,isSuperAdmin)
    }
  })

export default permissions