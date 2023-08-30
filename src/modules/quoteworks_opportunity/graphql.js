import db from'../../config/koneksi.js';
import { QueryTypes } from'sequelize';
import qwModel from'./model.js';
import gql from'graphql-tag';
import { v4 as uuidv4 } from'uuid';
import moment from 'moment';
import { getMimeType } from 'stream-mime-type';
import * as XLSX from 'xlsx/xlsx.mjs';

const typeDefs=
  gql`
  extend type Query {
 
      quoteWorks: quoteWorksResult
      quoteWorksByNumber(number: ID!): quoteWorksDetailResult
     
  }

  extend type Mutation {
 
 updateQuoteWorks(id:ID!, input:qwInput): Output
 importQuoteWorks(filee:[Upload]): Output

}

input qwInput {
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
type quoteWorksResult{
  data:[quoteWork],
  message:String,
  status:Int
}
type quoteWorksDetailResult{
  data:quoteWork,
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
   
    },
    quoteWorksByNumber: async (obj, args, context, info) => {
        try {
            let dt = await db.query('select * from qw_opportunity where deleted is null and number=$number',{bind:{number:args.number}} );
            // console.log(dt);
            //bisa array return nya
            if(dt[0]){
                return {data: dt[0][0], status:200, message:'Success'};
            }else{
                return {data: {}, status:200, message:'Success'};
            }
       
             
        } catch (error) {
            console.log(error);
        }
           
            },
},
Mutation:{
    updateQuoteWorks: async (obj, {id, input}, context, info) => {
        try {
            await qwModel.update(
                input,
                 { where: { id } }
               )
            return {status:200, message:'Success'};
             
        } catch (error) {
            console.log(error);
            return {status:200, message:'Failed'};
        }
           
            },
    importQuoteWorks: async (obj, {filee}, context, info) => {
        try {
            if(filee){
                let files = await Promise.all(filee)
                console.log(files);
                if(Array.isArray(files)){
                  for (let i = 0; i < files.length; i++) {
                    let {createReadStream, filename, mimetype, encoding } = await files[i];
                    var buffers = [];
                    const streamA = createReadStream();
                    let {stream, mime} = await getMimeType( streamA )
               
                        if (mime==='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                      
                    stream.on("data", function(data) { buffers.push(data); });
                    stream.on("end", async function() {
                        const buf = Buffer.concat(buffers);
                        const wb = XLSX.read(buf);
                        // res(wb);
                      await  readExcel(wb);
                      
                    });
                    // console.log({createReadStream, filename, mimetype, encoding });
                    
                  }
                }
                }
                return {status:200, message:'Success'};
              
              }
        } catch (error) {
            return {status:500, message:'Failed'};
        }
       
    }
}
}
function ec(r, c){
    return XLSX.utils.encode_cell({r:r,c:c});
}
function delete_row(ws, row_index){
    var variable = XLSX.utils.decode_range(ws["!ref"])
    for(var R = row_index; R < variable.e.r; ++R){
        for(var C = variable.s.c; C <= variable.e.c; ++C){
            ws[ec(R,C)] = ws[ec(R+1,C)];
        }
    }
    variable.e.r--
    ws['!ref'] = XLSX.utils.encode_range(variable.s, variable.e);
}

async function readExcel(workbook) {
    return new Promise(async(resolve, reject) => {
        try {
             // console.log("__dirname:    ", __dirname);
    
    // var workbook = XLSX.readFile("./src/temp/temp_opps.xlsx");
    var sheet_name_list = workbook.SheetNames;
    let worksheet = workbook.Sheets[sheet_name_list[0]]
   delete_row(worksheet, 0);
  
    var xlData = XLSX.utils.sheet_to_json(worksheet, {raw: false});
    // console.log(xlData);
//    let sample = {
//         'Opportunity Name': 'City of Pell City-Dell Desktop & Laptop August 9th 2023',
//         'Sold to Company': 'City of Pell City',
//         'Opp No.': 'PNXQ21673',
//         'Last Modified': 45149.38590277778,
//         'Opp Date': 45146,
//         'Opp Stage': 'Open',
//         'Sales Rep.': 'rcollins',
//         'Total Amt': 2324.22,
//         Created: 45146.397685185184,
//         'Sold to Contact': 'Bernard White',
//         Preparer: 'rcollins',
//         'Ship to Company': 'City of Pell City',
//         'Bill to Company': 'City of Pell City'
//       }
      let t = []
      for (let i = 0; i < xlData.length; i++) {
        if(xlData[i]['Opp Date']){
            xlData[i]['Opp Date']=  moment(xlData[i]['Opp Date'], 'MM/DD/YY').format('YYYY-MM-DD')
        }
        if(xlData[i]['Created']){
            xlData[i]['Created']=  moment(xlData[i]['Created'], 'MM/DD/YY').format('YYYY-MM-DD')
        }
        if(xlData[i]['Doc Status Date']){
            xlData[i]['Doc Status Date']=  moment(xlData[i]['Doc Status Date'], 'MM/DD/YY').format('YYYY-MM-DD')
        }
        if(xlData[i]['Est Close Date']){
            xlData[i]['Est Close Date']=  moment(xlData[i]['Est Close Date'], 'MM/DD/YY').format('YYYY-MM-DD')
        }
        let tem = {
            "id":uuidv4(),
            "number":xlData[i]['Opp No.'],
            "name":xlData[i]['Opportunity Name'],
            "sold_to_company":xlData[i]['Sold to Company'],
            "opp_date":xlData[i]['Opp Date'],
            "opp_stage":xlData[i]['Opp Stage'],
            "sales_rep":xlData[i]['Sales Rep.'],
            "total_amount":xlData[i]['Total Amt'],
            "cust_po_number":xlData[i]['Cust PO#'],
            "est_close_date":xlData[i]['Est Close Date'],
            "created":xlData[i]['Created'],
            "pnx_engineer":xlData[i]['PNX Engineer'],
            "line_of_business":xlData[i]['Line of Business'],
            "doc_status_date":xlData[i]['Doc Status Date'],
            "root_cause":xlData[i]['Root Cause'],
            "sold_to_contact":xlData[i]['Sold to Contact'],
            "preparer":xlData[i]['Preparer'],
            "ship_to_company":xlData[i]['Ship to Company'],
            "bill_to_company":xlData[i]['Bill to Company']
        }
        t.push(tem)
        
      }
      console.log(t);
      await qwModel.bulkCreate(t, {
        updateOnDuplicate: [
            "number",
            "name",
            "sold_to_company",
            "opp_date",
            "opp_stage",
            "sales_rep",
            "total_amount",
            "cust_po_number",
            "est_close_date",
            "created",
            "pnx_engineer",
            "line_of_business",
            "doc_status_date",
            "root_cause",
            "sold_to_contact",
            "preparer",
            "ship_to_company",
            "bill_to_company"
        ]
      });
      resolve()
        } catch (error) {
            reject(error)
        }
    })
   
  
}

export {typeDefs, resolvers}
