import 'reflect-metadata';
import { INJECTABLE } from './decorators/keys';

const DESIGN_PARAM_TYPES = 'design:paramtypes';

type Constructor<T> = new (...args: any[]) => T;

export class Container {
  private registry = new Map<any, any>();
  private singletons = new Map<any, any>();

  register<T>(token: Constructor<T>, useClass: Constructor<T>) {
    this.registry.set(token, useClass);
  }

  resolve<T>(token: Constructor<T>): T {
    if (this.singletons.has(token)) {
      return this.singletons.get(token);
    }

    const target = this.registry.get(token);
    if (!target) throw new Error(`Provider ${token.name} not registered`);

    if (!Reflect.getMetadata(INJECTABLE, target)) {
      throw new Error(`Class ${token.name} is not @Injectable`);
    }

    const deps = (Reflect.getMetadata(DESIGN_PARAM_TYPES, target) || []).map(
      (dep: any) => this.resolve(dep),
    );

    const instance = new target(...deps);

    this.singletons.set(token, instance);
    return instance;
  }
}
