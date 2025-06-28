import {Router} from 'express';
import {makeClassInvoker} from 'awilix-express';
import {BrewController} from '../controllers/brew.controller';
import {validateBody} from '../middlewares/requestBody.validator';
import {createBrewSchema} from '../schemas/brew.schema';
import {validateParams} from '../middlewares/params.validator';
import {paramsSchema} from '../schemas/params.schema';
import {validateQuery} from '../middlewares/query.validator';
import {querySchema} from '../schemas/query.schema';
import rateLimit from 'express-rate-limit';

const router: Router = Router();
const invoker = makeClassInvoker(BrewController);

router.post(
  '/brews',
  rateLimit({
    windowMs: 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false
  }),
  validateBody(createBrewSchema),
  invoker('createBrew'),
);

router.get(
  '/brews',
  validateQuery(querySchema),
  invoker('getAllBrews'),
);

router.get(
  '/brews/:id',
  validateParams(paramsSchema),
  invoker('getBrewById'),
);

router.put(
  '/brews/:id',
  validateParams(paramsSchema),
  validateBody(createBrewSchema),
  invoker('updateBrew'),
);

router.delete(
  '/brews/:id',
  validateParams(paramsSchema),
  invoker('deleteBrew'),
);

export default router;
