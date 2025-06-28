import {App} from './app';
import {config} from './config/config';
import * as http from 'node:http';
import container from './container';

const app = new App().init();

const server = http.createServer(app);

server.listen(Number(config.port), () => {
  console.log(`Server started on port ${config.port}`);
});

async function shutdown(signal: string) {
  console.log(`Shutting down due to ${signal}`);
  try {
    server.close(async () => {
      await container.dispose();
      process.exit(0);
    });
  } catch (err) {
    console.error('Error while shutting down', err);
    process.exit(1);
  }
}


process.on('SIGINT', async () => shutdown('SIGINT'));
process.on('SIGTERM', async () => shutdown('SIGTERM'));
