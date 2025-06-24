import { Router } from 'express';
import {controller} from '../controllers/redis-like.controller.js';

const router = Router();

router.get('/get', controller.get);
router.post('/set', controller.set);

export default router;
