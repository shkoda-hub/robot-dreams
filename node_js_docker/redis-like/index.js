import express from 'express';
import router from './routes/redis-like.router.js';
import config from './config/config.js';

const { port } = config;

const app = express();

app.use(express.json());
app.use('/', router);

app.listen(port, () => {
  console.log('redis-like server started on port ' + port);
});
