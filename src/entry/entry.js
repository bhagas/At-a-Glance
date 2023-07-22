import  express from 'express';
import { ApolloServer } from'@apollo/server';
import { expressMiddleware } from'@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer }from'@apollo/server/plugin/drainHttpServer';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';
import { ApolloServerPluginLandingPageDisabled }  from'@apollo/server/plugin/disabled';
import path from'path';
import http from'http';
import cors from'cors';
import bodyParser from'body-parser';
const app = express()
import jwt from'../helper/jwt.js'
import router  from'../router.js'
import schema from '../config/graphqlmerge.js';
const httpServer = http.createServer(app);
  // app.use(express.static(path.join(path.resolve(), 'dist')));
// // parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// // parse application/json
app.use(bodyParser.json());
app.use(graphqlUploadExpress())


const server = new ApolloServer({
  schema:schema,
  cache: 'bounded',
  // introspection:false,
  csrfPrevention: true,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    // ApolloServerPluginLandingPageDisabled()
  ],
});
await server.start();
app.use(
  '/gql',
  cors(),
  expressMiddleware(server,
    {
      context: async ({ req }) => { 
        try {
       
          let user =null;
          let token = (req.headers.authorization)?req.headers.authorization:'';
       
          if(token){
            let dt = token.split(" ");
            if(dt.length>1){
          
              user=await jwt.verify(dt[1]);
            } 
          }
         
          return {user};
        } catch (error) {
       
          return {user:null};
        }
      

    }
  }),
);

 app.use('/',router);
 app.use((err, req, res, next)=>{
  res.json({pesan:'error', error: err})
})
export default httpServer;