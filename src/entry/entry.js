const  express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const { ApolloServerPluginLandingPageDisabled }  = require('@apollo/server/plugin/disabled');
const path = require('path');
  const http = require('http');
  const cors = require('cors');
  const bodyParser = require('body-parser');
  const app = express()
  const jwt = require('../helper/jwt')
const router = require('../router')
const httpServer = http.createServer(app);
  // app.use(express.static(path.join(path.resolve(), 'dist')));
// // parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// // parse application/json
app.use(bodyParser.json());


const startServer = async function() {

const schema  = require('../config/graphqlmerge.js');

  const server = new ApolloServer({
    schema:schema,
    cache: 'bounded',
    // introspection:false,
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

 };

 startServer()
 app.use('/',router);
 app.use((err, req, res, next)=>{
  res.json({pesan:'error', error: err})
})
 module.exports= httpServer;