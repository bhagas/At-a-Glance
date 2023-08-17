import {buildSubgraphSchema} from '@apollo/subgraph';
import { applyMiddleware } from 'graphql-middleware';
import permissions from '../helper/permissions.js';


import {typeDefs as roleTypeDefs, resolvers as roleResolvers} from '../modules/role/graphql.js';
import {typeDefs as fdTypeDefs, resolvers as fdResolvers} from '../modules/freshdesk/graphql.js';
import {typeDefs as userTypeDefs, resolvers as userResolvers} from '../modules/user/graphql.js';
import {typeDefs as configTypeDefs, resolvers as configResolvers} from '../modules/config/graphql.js';
let gabungan= [
  {typeDefs:userTypeDefs, resolvers: userResolvers},
  {typeDefs:roleTypeDefs, resolvers: roleResolvers},
  {typeDefs:fdTypeDefs, resolvers: fdResolvers},
  {typeDefs:configTypeDefs, resolvers: configResolvers}
]
// gabungan.push(permissions);
const schemaWithMiddleware = applyMiddleware(buildSubgraphSchema(gabungan), permissions);
export default schemaWithMiddleware;