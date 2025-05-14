import {buildSubgraphSchema} from '@apollo/subgraph';
import { applyMiddleware } from 'graphql-middleware';
import permissions from '../helper/permissions.js';


import {typeDefs as roleTypeDefs, resolvers as roleResolvers} from '../modules/role/graphql.js';
import {typeDefs as fdTypeDefs, resolvers as fdResolvers} from '../modules/freshdesk/graphql.js';
import {typeDefs as userTypeDefs, resolvers as userResolvers} from '../modules/user/graphql.js';
import {typeDefs as configTypeDefs, resolvers as configResolvers} from '../modules/config/graphql.js';
import {typeDefs as qwTypeDefs, resolvers as qwResolvers} from '../modules/quoteworks_opportunity/graphql.js';
import {typeDefs as typeTypeDefs, resolvers as typeResolvers} from '../modules/type/graphql.js';
import {typeDefs as memberTypeDefs, resolvers as memberResolvers} from '../modules/freshdesk_agents/graphql.js';
import {typeDefs as locationTypeDefs, resolvers as locationResolvers} from '../modules/note_locations/graphql.js';
import {typeDefs as reviewTypeDefs, resolvers as reviewResolvers} from '../modules/review/graphql.js';
import {typeDefs as ticketMemberTypeDefs, resolvers as ticketMemberResolvers} from '../modules/ticket_member/graphql.js';
import {typeDefs as checkinTypeDefs, resolvers as checkinResolvers} from '../modules/checkin/graphql.js';
import {typeDefs as travelCheckinTypeDefs, resolvers as travelCheckinResolvers} from '../modules/travel_log/graphql.js';
import {typeDefs as versionTypeDefs, resolvers as versionResolvers} from '../modules/version_control/graphql.js';
import {typeDefs as msPointTypeDefs, resolvers as msPointResolvers} from '../modules/ms_point/graphql.js';
import {typeDefs as pointTypeDefs, resolvers as pointResolvers} from '../modules/point/graphql.js';
let gabungan= [
  {typeDefs:userTypeDefs, resolvers: userResolvers},
  {typeDefs:roleTypeDefs, resolvers: roleResolvers},
  {typeDefs:fdTypeDefs, resolvers: fdResolvers},
  {typeDefs:configTypeDefs, resolvers: configResolvers},
  {typeDefs:qwTypeDefs, resolvers: qwResolvers},
  {typeDefs:typeTypeDefs, resolvers: typeResolvers},
  {typeDefs:memberTypeDefs, resolvers: memberResolvers},
  {typeDefs:locationTypeDefs, resolvers: locationResolvers},
  {typeDefs:reviewTypeDefs, resolvers: reviewResolvers},
  {typeDefs:ticketMemberTypeDefs, resolvers: ticketMemberResolvers},
  {typeDefs:checkinTypeDefs, resolvers: checkinResolvers},
  {typeDefs:travelCheckinTypeDefs, resolvers: travelCheckinResolvers},
  {typeDefs:versionTypeDefs, resolvers: versionResolvers},
  {typeDefs:msPointTypeDefs, resolvers: msPointResolvers},
  {typeDefs:pointTypeDefs, resolvers: pointResolvers},
]
// gabungan.push(permissions);
const schemaWithMiddleware = applyMiddleware(buildSubgraphSchema(gabungan), permissions);
export default schemaWithMiddleware;