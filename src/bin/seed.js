import 'dotenv/config'
import userModel from '../modules/user/model.js';
import roleModel from '../modules/role/model.js';
import rolePoolModel from '../modules/rolePool/model.js';

function seed() {
    return new Promise(async (resolve, reject) => {
        try {
            await userModel.findOrCreate({
                where: { id: '60d9c4ad-d770-4999-9468-a7953fbc42a3' },
                defaults: {
                  email: process.env.SUPERADMIN_EMAIL,
                  createdAt: new Date(),
                  name:'Admin',
                  status:'active'
                }
              })
        
              await roleModel.findOrCreate({
                where: { id: '99bcd0a5-66b0-4688-86b1-751904100cdb' },
                defaults: {
                  role_name: "Super Admin",
                  createdAt: new Date(),
                  code:'A-1'
                }
              })
        
              await rolePoolModel.findOrCreate({
                where: { id: 'd5864088-af94-4ea9-a651-a3b78c4a4d88' },
                defaults: {
                  userId: "60d9c4ad-d770-4999-9468-a7953fbc42a3",
                  createdAt: new Date(),
                  roleId:'99bcd0a5-66b0-4688-86b1-751904100cdb'
                }
              })
              resolve()
        } catch (error) {
            reject(error)
            console.log(error);
        }
    })
    
}

export default seed;