import 'reflect-metadata';
import { INJECT, INJECTABLE } from './decorators/keys';

const DESIGN_PARAM_TYPES = 'design:paramtypes';

type Constructor<T> = new (...args: any[]) => T;

export class Container {
  private registry = new Map<any, any>();
  private singletons = new Map<any, any>();

  register<T>(token: Constructor<T> | any, useClass: Constructor<T> | any) {
    this.registry.set(token, useClass);
  }

  resolve<T = any>(token: any): T {
    const provider = this.registry.get(token);
    if (!provider) throw new Error(`Provider ${String(token)} not registered`);

    if (provider.useValue !== undefined) {
      return provider.useValue;
    }

    const TargetClass = provider.useClass ?? provider;

    if (this.singletons.has(token)) {
      return this.singletons.get(token);
    }

    if (!Reflect.getMetadata(INJECTABLE, TargetClass)) {
      throw new Error(`Class ${TargetClass.name} is not @Injectable`);
    }

    const paramTypes: any[] =
      Reflect.getMetadata(DESIGN_PARAM_TYPES, TargetClass) || [];

    const injectTokens: Record<number, any> =
      Reflect.getOwnMetadata(INJECT, TargetClass) || {};

    const tokens = paramTypes.map((type, i) =>
      injectTokens[i] != null ? injectTokens[i] : type,
    );

    const deps = tokens.map((t) => this.resolve(t));

    const instance = new TargetClass(...deps);
    this.singletons.set(token, instance);
    return instance;
  }
}
