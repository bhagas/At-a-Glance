import csvToJson from "csv-file-to-json";
import { v4 as uuidv4 } from'uuid';
import moment from "moment";
import model from "../modules/quoteworks_opportunity/model.js"
const dataInJSON = csvToJson({ filePath: "./assets/baru.csv", separator: ";" });
// console.log(dataInJSON);

let dt =[]
for (let i = 0; i < dataInJSON.length; i++) {
let x ={};
    x.id=uuidv4()
   x.number = dataInJSON[i]['Opp No.'];
   x.name = dataInJSON[i]['Opportunity Name'];
   x.sold_to_company =dataInJSON[i]['Sold to Company'];
   let opp_date = moment(dataInJSON[i]['Opp Date']).format('YYYY-MM-DD');
   if(opp_date!='Invalid date'){
       x.opp_date =opp_date;
   }
   
   x.opp_stage = dataInJSON[i]['Opp Stage'];
    x.sales_rep =dataInJSON[i]['Sales Rep.'];
    x.total_amount =dataInJSON[i]['Total Amt'];
    x.cust_po_number = dataInJSON[i]['Cust PO#'];

    let est_close_date = moment(dataInJSON[i]['Est Close Date']).format('YYYY-MM-DD');
    if(est_close_date!='Invalid date'){
        x.est_close_date =est_close_date;
    }
    let date = moment(dataInJSON[i]['Created']).format('YYYY-MM-DD hh:mm');
    if(date!='Invalid date'){
        x.created =date;
    }
 
    x.pnx_engineer=dataInJSON[i]['PNX Engineer'];
    x.line_of_business=dataInJSON[i]['Line of Business'];
    let doc_status_date = moment(dataInJSON[i]['Doc Status Date']).format('YYYY-MM-DD');
    if(doc_status_date!='Invalid date'){
        x.doc_status_date =doc_status_date;
    }
    x.root_cause=dataInJSON[i]['Root Cause'];
    x.sold_to_contact=dataInJSON[i]['Sold to Contact'];
    x.preparer=dataInJSON[i]['Preparer'];
    x.ship_to_company=dataInJSON[i]['Ship to Company'];
    x.bill_to_company=dataInJSON[i]['Bill to Company'];
   x.createdAt = moment().format('YYYY-MM-DD');
   x.updatedAt=moment().format('YYYY-MM-DD');
    // console.log(date);
    dt.push(x)
}
console.log(dt);
model.bulkCreate(dt).then(() => console.log("Users data have been saved"));
