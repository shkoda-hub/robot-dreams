import {Router} from 'express';
import {kvController} from '../controllers/kv.controller.js';

const router = Router();

router.get('/:key', kvController.get);
router.post('/', kvController.set);

export default router;
