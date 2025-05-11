import Model from './model.js';
import MsPoint from '../ms_point/model.js';
import { v4 as uuidv4 } from 'uuid';
import db from '../../config/koneksi.js';
export async function addPoints(data=null) {
    return new Promise(async (resolve, reject) => {
        if(data){
            try {
                let replacements = {}
              
           
                replacements.process_code = data.process_code;
                replacements.user_id = data.user_id
            
           
           //select (sum(point_debit) - sum(point_credit)) as total from point_log pl where user_id = '17d5cf0f-fa90-4cec-8db5-3e0a51e9ab60'
            let dt = await db.query('select a.* from ms_point a where a.deleted is null AND a."id" = :process_code', {
              replacements
            })
            // console.log(dt[0]);
            if(dt[0].length){
                let total = await db.query('select (sum(point_debit) - sum(point_credit)) as total from point_log pl where user_id = :user_id', {
                    replacements
                  })
                  let ttl=0
                if(total[0].length){
                    if(total[0][0].total){
                        ttl=parseInt(total[0][0].total)+dt[0][0].point
                    }else{
                        ttl=dt[0][0].point
                    }
                }
                
                let dataInput = {
                    "id": uuidv4(),
                    "point_debit": dt[0][0].point,
                    "point_credit": 0,
                    "total_point":ttl,
                    "desc":dt[0][0].process_name,
                    "ms_point_id": data.process_code,
                    "user_id": data.user_id
                  }
                //   console.log(dataInput);
                  
                await Model.create(dataInput)
                //  console.log(h);
                 
            }
            
            resolve()
            } catch (error) {
                console.log(error);
                reject(error)
            }
          
            
        }else{
            reject("Data must be provided")
        }
    })
    //userId
    //process_code
    //debit
    //desc

    
}

export function removePoints(data=null) {
    //userId
    //process_code
    //kredit
    //desc
if(data){

}
    
}

// await addPoints({process_code:'J01', user_id:"17d5cf0f-fa90-4cec-8db5-3e0a51e9ab60"})