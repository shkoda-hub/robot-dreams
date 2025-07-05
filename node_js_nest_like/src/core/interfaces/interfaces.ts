import { NextFunction, Request, Response } from 'express';

export enum ParamType {
  BODY = 'body',
  QUERY = 'query',
  PARAM = 'param',
  HEADER = 'header',
}

export interface ArgumentMetadata {
  index: number;
  type: ParamType;
  data?: string;
  pipes?: any[];
}

export interface IModuleMetadata {
  imports?: any[];
  providers?: any[];
  controllers?: any[];
}

export interface IRouteDefinition {
  method: 'get' | 'post' | 'put' | 'delete';
  path: string;
  handlerName: string;
}

export interface PipeTransform<T = any, R = any> {
  transform(value: T, metadata: ArgumentMetadata): R;
}

export interface ExceptionFilter {
  catch(exception: any, req: Request, res: Response, next: NextFunction): any;
}

export interface ExecutionContext {
  req: Request;
  res: Response;
}

export interface CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean>;
}
