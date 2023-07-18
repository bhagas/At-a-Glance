const {buildSubgraphSchema} = require('@apollo/subgraph');
const { applyMiddleware } = require('graphql-middleware');
const permissions = require('../helper/permissions');

const UserModule = require('../modules/user/graphql.js');
const roleModule = require('../modules/role/graphql');
const freshdeskModule = require('../modules/freshdesk/graphql');
let gabungan= [
  {typeDefs:UserModule.typeDefs, resolvers: UserModule.resolvers},
  {typeDefs:roleModule.typeDefs, resolvers: roleModule.resolvers},
  {typeDefs:freshdeskModule.typeDefs, resolvers: freshdeskModule.resolvers}
]
// gabungan.push(permissions);
const schemaWithMiddleware = applyMiddleware(buildSubgraphSchema(gabungan), permissions);
module.exports = schemaWithMiddleware;