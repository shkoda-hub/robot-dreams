import * as http from 'node:http';
import {config} from './config/config';
import {Router} from './lib/router';
import {spawn} from 'node:child_process';

const { port, env } = config;
const router = new Router();

if (env === 'development') {
  const tsc = spawn(
    'npx tsc -b --watch',
    { stdio: 'inherit', shell: true }
  );

  tsc.on('error', err => console.error('tsc watch failed:', err));
  process.on('exit', () => tsc.kill());
  process.on('SIGINT', () => process.exit());
}

const server = http.createServer(async (req, res) => {
  await router.handle(req, res);
});

server.listen(port, async () => {
  console.log(`Node.js server listening on ${port}`);
});
