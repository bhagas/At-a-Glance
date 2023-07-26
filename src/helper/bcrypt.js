import bcrypt from'bcrypt';
const saltRounds = 10;

class Bcrypt{
    static async gen(pass){
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(saltRounds, function(err, salt) {
                bcrypt.hash(pass, salt, function(err, hash) {
                    resolve(hash)
                });
            });
        })
    }

    static async compare(text, pass){
        return new Promise((resolve, reject) => {
            bcrypt.compare(text, pass, function(err, result) {
                resolve(result)
            });
        })
    }
}

export default Bcrypt;