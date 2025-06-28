import {configDotenv} from 'dotenv';

configDotenv();

const DEFAULT_PORT = 3000;
const DEFAULT_NODE_ENV = 'development';

export const config = {
  port: process.env.PORT || DEFAULT_PORT,
  node_env: process.env.NODE_ENV || DEFAULT_NODE_ENV,
};

console.log('Started with config: ' + JSON.stringify(config, null, 2));
