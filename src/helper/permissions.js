import { chain,not,and, or, rule, shield } from"graphql-shield";
import db from '../config/koneksi.js';
import { QueryTypes } from 'sequelize';
import _ from "lodash";

const isAuthenticated = rule({ cache: 'contextual' })(async (parent, args, ctx, info) => {
  // console.log(ctx,'ctxxxxxxx');
  ctx.user_app=null;
  if(ctx.user !== null){
  try {
    let user= await db.query(`select * from users where email= $1`, { bind: [ctx.user.email],type: QueryTypes.SELECT });
    // console.log(user, 'dd');
      if(user.length){
       user[0].roles= await db.query(`select b.id, b.code, b.role_name from role_pool a join roles b on a."roleId" = b.id where a."userId"= $1`, { bind: [user[0].id],type: QueryTypes.SELECT });
       ctx.user_app = user[0];
       return true;
      }else{
        return new Error('User Unregistered');
      }
      
 
    
  } catch (error) {
    console.log(error);
    return new Error('Not Authenticated');
  }
     
  } else{
      return new Error('Not Authenticated or Token Expired');
  }
 
})


const isActive = rule({ cache: 'contextual' })(async (parent, args, ctx, info) => {
  if(ctx.user_app.status === 'active'){
      return true;
  } else{
      return new Error('Not Authenticated');
  }
 
})

   
  const isSuperAdmin = rule({ cache: 'contextual' })(async (parent, args, ctx, info) => {
    
    return _.some(ctx.user_app.roles, ['code', 'A-1']);
  })
   
  const isSalesManager = rule({ cache: 'contextual' })(async (parent, args, ctx, info) => {
    return _.some(ctx.user_app.roles, ['code', 'A-2']);
  })
   
  const isServiceManager = rule({ cache: 'contextual' })(async (parent, args, ctx, info) => {
    return _.some(ctx.user_app.roles, ['code', 'A-3']);
  })
  const isOperationsManager = rule({ cache: 'contextual' })(async (parent, args, ctx, info) => {
    return _.some(ctx.user_app.roles, ['code', 'A-4']);
  })
  const isWarehouseManager = rule({ cache: 'contextual' })(async (parent, args, ctx, info) => {
    return _.some(ctx.user_app.roles, ['code', 'A-5']);
  })
  const isExecutives = rule({ cache: 'contextual' })(async (parent, args, ctx, info) => {
    return _.some(ctx.user_app.roles, ['code', 'A-6']);
  })
  const isFieldServices = rule({ cache: 'contextual' })(async (parent, args, ctx, info) => {
    return _.some(ctx.user_app.roles, ['code', 'A-7']);
  })
  const isSalesReps = rule({ cache: 'contextual' })(async (parent, args, ctx, info) => {
    return _.some(ctx.user_app.roles, ['code', 'A-8']);
  })
  // Permissions
  const permissions = shield({
    Query: {
      users: chain(isAuthenticated),
      user:chain(isAuthenticated),
      types:chain(isAuthenticated),
      type:chain(isAuthenticated),
      travelCheckinStatus:chain(isAuthenticated),
      travelHours:chain(isAuthenticated),
      getAllUserPosition:chain(isAuthenticated),
      getMemberPositionByAgent:chain(isAuthenticated),
      getUserTravelLog:chain(isAuthenticated),
      listMemberByTicket:chain(isAuthenticated),
      roles:chain(isAuthenticated),
      role:chain(isAuthenticated),
      reviews:chain(isAuthenticated),
      reviewsByRating:chain(isAuthenticated),
      review:chain(isAuthenticated),
      quoteWorks:chain(isAuthenticated),
      quoteWorksByNumber:chain(isAuthenticated),
      getGeocoding:chain(isAuthenticated),
      listAgentMember:chain(isAuthenticated),
      listAgentByMember:chain(isAuthenticated),
      ticketOverview:chain(isAuthenticated),
      listTicket:chain(isAuthenticated),
      dayGraph:chain(isAuthenticated),
      ticketDetail:chain(isAuthenticated),
      listAgents:chain(isAuthenticated),
      ticketFields:chain(isAuthenticated),
      listExpenseByConvId:chain(isAuthenticated),
      listExpenseByTicketId:chain(isAuthenticated),
      listExpense:chain(isAuthenticated),
      listLogExpenseByTicketId:chain(isAuthenticated),
      config:chain(isAuthenticated),
      checkinStatus:chain(isAuthenticated),
      getUserHours:chain(isAuthenticated),
      getAllUserHours:chain(isAuthenticated),
      msPoints:chain(isAuthenticated),
      msPoint:chain(isAuthenticated),
      // role:chain(isAuthenticated, isActive,isSuperAdmin),
      // roles:chain(isAuthenticated, isActive,isSuperAdmin)
      // listLogExpenseByTicketId:chain(isAuthenticated)
    },
    Mutation:{
      createExpense:chain(isAuthenticated),
      updateExpense:chain(isAuthenticated),
      deleteExpense:chain(isAuthenticated),
      approveExpense:chain(isAuthenticated),
      createBulkExpense:chain(isAuthenticated),
      addMemberToTicket:chain(isAuthenticated),
      createReview:chain(isAuthenticated),
      createUser:chain(isAuthenticated),
      updateUser:chain(isAuthenticated),
      // login:chain(isAuthenticated),
      activation:chain(isAuthenticated),
      setRole:chain(isAuthenticated),
      removeUser:chain(isAuthenticated),
      // biometricAuthRequest:chain(isAuthenticated),
      // biometricAuthResult:chain(isAuthenticated),
      createType:chain(isAuthenticated),
      updateType:chain(isAuthenticated),
      deleteType:chain(isAuthenticated),
      travelCheckin:chain(isAuthenticated),
      travelCheckout:chain(isAuthenticated),
      addMemberToTicket:chain(isAuthenticated),
      removeMemberFromTicket:chain(isAuthenticated),
      createRole:chain(isAuthenticated),
      updateRole:chain(isAuthenticated),
      removeRole:chain(isAuthenticated),
      createReview:chain(isAuthenticated),
      updateReview:chain(isAuthenticated),
      deleteReview:chain(isAuthenticated),
      updateQuoteWorks:chain(isAuthenticated),
      importQuoteWorks:chain(isAuthenticated),
      createLocations:chain(isAuthenticated),
      updateLocations:chain(isAuthenticated),
      addMemberToAgent:chain(isAuthenticated),
      updateAgentSalary:chain(isAuthenticated),
      updateSalaryMember:chain(isAuthenticated),
      removeMemberFromAgent:chain(isAuthenticated),
      ticketSync:chain(isAuthenticated),
    agentSync:chain(isAuthenticated),
    createReply:chain(isAuthenticated),
    createNotes:chain(isAuthenticated),
    updateNotes:chain(isAuthenticated),
    updateTicket:chain(isAuthenticated),
    createExpense:chain(isAuthenticated),
    createBulkExpense:chain(isAuthenticated),
    updateExpense:chain(isAuthenticated),
    deleteExpense:chain(isAuthenticated),
    approveExpense:chain(isAuthenticated),
    testSendMail:chain(isAuthenticated),
    updateConfig:chain(isAuthenticated),
    checkin:chain(isAuthenticated),
    checkout:chain(isAuthenticated),
    checkinUpdate:chain(isAuthenticated),
    checkoutUpdate:chain(isAuthenticated),
    travelCheckinUpdate:chain(isAuthenticated),
    travelCheckoutUpdate:chain(isAuthenticated),
    createMsPoint:chain(isAuthenticated),
    updateMsPoint:chain(isAuthenticated),
    deleteMsPoint:chain(isAuthenticated),
    activateMsPoint:chain(isAuthenticated),
    addUsersPoint:chain(isAuthenticated, isSuperAdmin),
    removeUsersPoint:chain(isAuthenticated, isSuperAdmin),
    createItem:chain(isAuthenticated, isSuperAdmin),
    updateItem:chain(isAuthenticated, isSuperAdmin),
    deleteItem:chain(isAuthenticated, isSuperAdmin),
    createUom:chain(isAuthenticated, isSuperAdmin),
    updateUom:chain(isAuthenticated, isSuperAdmin),
    deleteUom:chain(isAuthenticated, isSuperAdmin),
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