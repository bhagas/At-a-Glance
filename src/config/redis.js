import 'dotenv/config'
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';
const options = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    db: process.env.REDIS_DB,
    retryStrategy: times => {
      // reconnect after
      return Math.min(times * 50, 2000);
    }
  };
  const pubsub = new RedisPubSub({
    publisher: new Redis(options),
    subscriber: new Redis(options)
  });
  export default pubsub;