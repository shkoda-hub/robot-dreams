import express from 'express';
import router from './routes/kv.router.js';
import config from './config/config.js';

const { port } = config;
const app = express();

app.use(express.json());
app.use('/kv', router);

app.listen(port, () => {
  console.log('kv-sever started on port ' + port);
});
