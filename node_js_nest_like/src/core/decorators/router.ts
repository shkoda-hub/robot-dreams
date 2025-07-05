import { ROUTES } from './keys';
import { IRouteDefinition } from '../interfaces/interfaces';

function createRoute(method: IRouteDefinition['method']) {
  return (path: string): MethodDecorator =>
    (target, propertyKey) => {
      const controllerClass = target.constructor;

      const routes: IRouteDefinition[] =
        Reflect.getMetadata(ROUTES, controllerClass) || [];
      routes.push({ method, path, handlerName: propertyKey as string });

      Reflect.defineMetadata(ROUTES, routes, controllerClass);
    };
}

export const Get = createRoute('get');
export const Post = createRoute('post');
export const Put = createRoute('put');
export const Delete = createRoute('delete');
