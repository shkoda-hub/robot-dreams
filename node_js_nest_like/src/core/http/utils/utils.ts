import { Request } from 'express';
import { ParamType } from '../../interfaces/interfaces';

export function extractParams(req: Request, type: ParamType) {
  switch (type) {
    case ParamType.BODY:
      return req.body;
    case ParamType.QUERY:
      return req.query;
    case ParamType.PARAM:
      return req.params;
    case ParamType.HEADER:
      return req.headers;
    default:
      return undefined;
  }
}
