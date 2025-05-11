import 'dotenv/config'
import userModel from '../modules/user/model.js';
import roleModel from '../modules/role/model.js';
import rolePoolModel from '../modules/rolePool/model.js';
import configModel from '../modules/config/model.js';
import msPointModel from '../modules/ms_point/model.js'
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

              await roleModel.findOrCreate({
                where: { id: '8e934a0f-9edf-4c70-8f3e-0f4d753368fa' },
                defaults: {
                  role_name: "Admin",
                  createdAt: new Date(),
                  code:'A-2'
                }
              })

              await roleModel.findOrCreate({
                where: { id: '201d137b-d115-4a2e-b79f-dae3461a135b' },
                defaults: {
                  role_name: "Field Agent",
                  createdAt: new Date(),
                  code:'F-1'
                }
              })
              await roleModel.findOrCreate({
                where: { id: '85664f3d-9728-4c65-9f6a-dbcffaa7952f' },
                defaults: {
                  role_name: "Support Agent ( Lead )",
                  createdAt: new Date(),
                  code:'S-1'
                }
              })
              // Support Agent ( Lead )
              await rolePoolModel.findOrCreate({
                where: { id: 'd5864088-af94-4ea9-a651-a3b78c4a4d88' },
                defaults: {
                  userId: "60d9c4ad-d770-4999-9468-a7953fbc42a3",
                  createdAt: new Date(),
                  roleId:'99bcd0a5-66b0-4688-86b1-751904100cdb'
                }
              })

              await configModel.findOrCreate({
                where: { id: '60d9c4ad-d770-4999-9468-a7953fbc42xx' },
                defaults: {
                  mail_user: "sample@mail.com",
                  createdAt: new Date(),
                  mail_from:'sample@mail.com',
                  mail_host:'smtp.gmail.com',
                  mail_port:465,
                  mail_password:'abcd',
                  mail_secure:true
                }
              })

              await msPointModel.findOrCreate({
                where: { id: 'J01' },
                defaults: {
                  id: 'J01',
                  createdAt: new Date(),
                  process_name:'starts travel',
                  process_code:'J01',
                  point:1
                }
              })

              await msPointModel.findOrCreate({
                where: { id: 'J02' },
                defaults: {
                  id: 'J02',
                  createdAt: new Date(),
                  process_name:'signs into a job',
                  process_code:'J02',
                  point:1
                }
              })
              await msPointModel.findOrCreate({
                where: { id: 'J03' },
                defaults: {
                  id: 'J03',
                  createdAt: new Date(),
                  process_name:'signs off a job',
                  process_code:'J03',
                  point:1
                }
              })
              await msPointModel.findOrCreate({
                where: { id: 'J04' },
                defaults: {
                  id: 'J04',
                  createdAt: new Date(),
                  process_name:'ends travel',
                  process_code:'J04',
                  point:1
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