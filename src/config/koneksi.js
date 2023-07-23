import 'dotenv/config'
import { Sequelize } from'sequelize';


const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
  },
   logging:false,
   dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  }
  });

export default sequelize;
