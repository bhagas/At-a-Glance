import jwt from'jsonwebtoken';
let key = process.env.JWT_KEY
class Jewete{
 static  generate(data, expiresIn) {
    return new Promise((resolve, reject) => {
        jwt.sign(data, key, { expiresIn }, function(err, token) {
            if(err){
                reject(err)
            }else{
                resolve(token)
            }
           
          });
    })
}
static  verify(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, key, function(err, decoded) {
            if(err){
                reject(err)
            }else{
                resolve(decoded)
            }
          });
    })
}
}




export default Jewete;