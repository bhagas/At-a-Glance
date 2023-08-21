import db from'../../config/koneksi.js';
import { QueryTypes } from'sequelize';
import roleModel from'./model.js';
import gql from'graphql-tag';
import { v4 as uuidv4 } from'uuid';
const typeDefs=
  gql`
  extend type Query {
 
      quoteWorks: quoteWorksResult
     
  }


type quoteWorksResult{
  data:[quoteWork],
  message:String,
  status:Int
}
  

  type quoteWork {
    id: ID!,
    number:String,
    name:String,
    sold_to_company:String,
    opp_date:String,
    opp_stage:String,
    sales_rep:String,
    total_amount:String,
    cust_po_number:String,
    est_close_date:String,
    created:String,
    pnx_engineer:String,
    line_of_business:String,
    doc_status_date:String,
    root_cause:String,
    sold_to_contact:String,
    preparer:String,
    ship_to_company:String,
    bill_to_company:String
  }
`

const resolvers= {
  Query: {
    quoteWorks: async (obj, args, context, info) => {
try {
    let dt = await db.query('select * from qw_opportunity where deleted is null');
    // console.log(dt);
    //bisa array return nya
    return {data: dt[0], status:200, message:'Success'};
     
} catch (error) {
    console.log(error);
}
   
    }
}
}


export {typeDefs, resolvers}
