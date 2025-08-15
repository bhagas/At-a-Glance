import {buildSubgraphSchema} from '@apollo/subgraph';
import { applyMiddleware } from 'graphql-middleware';
import permissions from '../helper/permissions.js';

import {typeDefs as service_utilizationTypeDefs, resolvers as service_utilizationResolvers} from '../modules/service_utilization/graphql.js';
// import {typeDefs as checkinTypeDefs, resolvers as checkinResolvers} from '../modules/checkin/graphql.js';

let gabungan= [
  {typeDefs:service_utilizationTypeDefs, resolvers: service_utilizationResolvers},  
  // {typeDefs:checkinTypeDefs, resolvers: checkinResolvers},

]
// gabungan.push(permissions);
const schemaWithMiddleware = applyMiddleware(buildSubgraphSchema(gabungan), permissions);
export default schemaWithMiddleware;