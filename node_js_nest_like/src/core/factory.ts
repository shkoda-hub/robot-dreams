import express, { Application, RequestHandler } from 'express';
import { Container } from './container';
import { HandlerMiddleware } from './http/handler.middleware';
import { CONTROLLER_PREFIX, MODULE_META, ROUTES } from './decorators/keys';
import { asyncHandler } from './http/async.handler';
import { IRouteDefinition } from './interfaces/interfaces';
import { GuardsMiddleware } from './http/guards.middleware';
import { FiltersMiddleware } from './http/filters.middleware';

export class Factory {
  private static application: Application = express();
  private static router = express.Router();
  private static container = new Container();

  private static globalPipes: any[] = [];
  private static globalFilters: any[] = [];
  private static globalGuards: any[] = [];

  public static useGlobalPipes(...pipes: any[]) {
    Factory.globalPipes.push(...pipes);
  }

  public static userGlobalFilters(...filters: any[]) {
    Factory.globalFilters.push(...filters);
  }

  public static async create(module: any) {
    await Factory.loadModule(module);
    await Factory.loadRoutes();

    Factory.application.use(express.json());
    Factory.application.use(Factory.router);
    return Factory.application;
  }

  private static async loadModule(module: any) {
    const meta = Reflect.getMetadata(MODULE_META, module);
    if (!meta) return;
    (meta.imports || []).forEach(Factory.loadModule);
    (meta.providers || []).forEach((provider: any) =>
      Factory.container.register(provider, provider),
    );
    (meta.controllers || []).forEach((controller: any) =>
      Factory.container.register(controller, controller),
    );
  }

  private static async loadRoutes() {
    for (const [token] of (Factory.container as any).registry) {
      if (!Reflect.hasMetadata(ROUTES, token)) continue;

      const prefix = Reflect.getMetadata(CONTROLLER_PREFIX, token);
      const routes = Reflect.getMetadata(ROUTES, token);

      const instance = Factory.container.resolve(token) as any;

      routes.forEach((route: IRouteDefinition) => {
        const handler = instance[route.handlerName] as RequestHandler;

        (Factory.router as any)[route.method](
          prefix + route.path,
          asyncHandler(
            GuardsMiddleware(instance, handler, Factory.globalGuards),
          ),
          asyncHandler(
            HandlerMiddleware(instance, handler, Factory.globalPipes),
          ),
          asyncHandler(
            FiltersMiddleware(instance, handler, Factory.globalFilters),
          ),
        );
      });
    }
  }
}
