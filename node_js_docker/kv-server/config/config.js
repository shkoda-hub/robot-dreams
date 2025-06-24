const config = {
  port: process.env.KV_PORT || 3000,
  redisUrl: process.env.REDIS_URL || undefined,
};

export default config;
