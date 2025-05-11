import Model from './model.js';
import MsPoint from '../ms_point/model.js';
import db from '../../config/koneksi.js';
export async function addPoints(data=null) {
    //userId
    //process_code
    //debit
    //desc
if(data){
    let replacements = {}
    let a = "";
   
        replacements.process_code = data.process_code;
    
   
   
    let dt = await db.query('select a.* from ms_point a where a.deleted is null AND AND a."process_code" = :process_code', {
      replacements
    })
    console.log(dt[0]);
    if(dt[0].length){
        
    }
    
}
    
}

export function removePoints(data=null) {
    //userId
    //process_code
    //kredit
    //desc
if(data){

}
    
}

addPoints()