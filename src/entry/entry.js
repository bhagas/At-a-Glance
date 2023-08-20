import 'dotenv/config'
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
import { request, gql } from 'graphql-request'
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import PubSub from '../config/redis.js';
import Keyv from "keyv";
import { KeyvAdapter } from "@apollo/utils.keyvadapter";
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';
import responseCachePlugin from '@apollo/server-plugin-response-cache';
import { ApolloServerPluginCacheControlDisabled } from '@apollo/server/plugin/disabled';


const httpServer = http.createServer(app);
  // app.use(express.static(path.join(path.resolve(), 'dist')));
// // parse application/x-www-form-urlencoded
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));

// // parse application/json
app.use(bodyParser.json());
app.use(graphqlUploadExpress())

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/gql',
});
const serverCleanup = useServer({ schema }, wsServer);
// console.log(`redis://${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}?db=${process.env.REDIS_DB}`);
const server = new ApolloServer({
  schema:schema,
  cache: 'bounded',
  // cache:  new KeyvAdapter(new Keyv(`redis://serova.id:8379`)),
  // introspection:false,
  csrfPrevention: true,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
    // ApolloServerPluginLandingPageDisabled()
    // ApolloServerPluginCacheControl({ defaultMaxAge: 100 }),
    // ApolloServerPluginCacheControlDisabled(),
    // responseCachePlugin()
  ],
});
await server.start();
app.use(
  '/gql',
  expressMiddleware(server,
    {
      context: async ({ req }) => { 
        try {
       
          let user =null;
          let token = (req.headers.authorization)?req.headers.authorization:'';
       
          if(token){
           
            let dt = token.split(" ");
            if(dt.length>1){
        
              let qu = gql`
             query getMe {
                          me {
                            id
                            email
                            firstName
                            middleName
                            lastName
                            dateJoined
                            modified
                            dateJoined
                            lastName
                            lastLogin
                            verified
                            socialAuth {
                              id
                              provider
                            }
                            profile {
                              created
                              modified
                              id
                              gender
                              picture
                              dateOfBirth
                              nationality
                              timezone
                              address
                              inviteCode
                              company
                              legacyId
                            }
                          }
                        }`
              let requestHeaders = {
                authorization: `Bearer ${dt[1]}`
              }
              let h=    await request({
                url:process.env.SHELIAK_URL,
                document:qu,
                requestHeaders,
              });
              // console.log(h, 'cccc');
              // user=await jwt.verify(dt[1]);
              if(h.me){
                user = h.me
              }
        
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