import Redis from 'ioredis';

let redisClient = null;
let hasLoggedError = false;

const connectRedis = () => {
  redisClient = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
    // Stop retrying after 3 failures (so the app doesn't hang)
    retryStrategy(times) {
      if (times > 3) return null;
      return 500;
    },
  });

  redisClient.on('connect', () => {
    console.log('✅ Redis Connected');
    hasLoggedError = false;
  });
  
  redisClient.on('error', (err) => {
    if (err.message.includes('ECONNREFUSED')) {
      if (!hasLoggedError) {
        console.log('⚠️ Redis is not running locally. Caching disabled (falling back to MongoDB).');
        hasLoggedError = true;
      }
    } else {
      console.error(`❌ Redis Error: ${err.message}`);
    }
  });

  return redisClient;
};

export const getRedisClient = () => redisClient;
export default connectRedis;
