import { INJECT } from './keys';

export function Inject(token: any): ParameterDecorator {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    const existing: Record<number, any> =
      Reflect.getOwnMetadata(INJECT, target) || {};
    existing[parameterIndex] = token;
    Reflect.defineMetadata(INJECT, existing, target);
  };
}
