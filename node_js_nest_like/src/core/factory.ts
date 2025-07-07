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
    console.log('Initializing app...');
    await Factory.loadModule(module);
    await Factory.loadRoutes();

    Factory.application.use(express.json());
    Factory.application.use(Factory.router);
    console.log('App was initialized successfully.');
    return Factory.application;
  }

  private static async loadModule(module: any) {
    console.log(`Loading module: ${module.name}`);
    const meta = Reflect.getMetadata(MODULE_META, module);
    if (!meta) return;

    (meta.imports || []).forEach(Factory.loadModule);

    const providers = meta.providers ?? [];
    const controllers = meta.controllers ?? [];

    await Factory.loadProviders(providers);
    await Factory.loadControllers(controllers);
  }

  private static async loadProviders(providers: any[]) {
    providers.forEach((provider: any) => {
      if (provider.provide && provider.useValue !== undefined) {
        console.log(
          `Register injected provider: ${provider.provide} with value: ${provider.useValue}`,
        );
        Factory.container.register(provider.provide, {
          useValue: provider.useValue,
        });
      } else if (provider.provide && provider.useClass) {
        console.log(
          `Register injected provider: ${provider.provide} with value: ${provider.useClass}`,
        );
        Factory.container.register(provider.provide, {
          useClass: provider.useClass,
        });
      } else {
        console.log(`Register provider: ${provider.name}`);
        Factory.container.register(provider, provider);
      }
    });
  }

  private static async loadControllers(controllers: any[]) {
    controllers.forEach((controller: any) => {
      console.log(`Register controller: ${controller.name}`);
      Factory.container.register(controller, controller);
    });
  }

  private static async loadRoutes() {
    for (const [token] of (Factory.container as any).registry) {
      if (typeof token !== 'function' || !Reflect.hasMetadata(ROUTES, token))
        continue;

      const prefix: string = Reflect.getMetadata(CONTROLLER_PREFIX, token);
      const routes: IRouteDefinition[] = Reflect.getMetadata(ROUTES, token);

      const instance = Factory.container.resolve(token) as any;

      routes.forEach((route) => {
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
