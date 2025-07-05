import { CONTROLLER_INTERCEPTORS, METHOD_INTERCEPTORS } from './keys';

export function UseInterceptors(
  ...interceptors: any[]
): ClassDecorator & MethodDecorator {
  return function (
    target: any,
    propertyKey?: string | symbol,
    descriptor?: PropertyDescriptor,
  ) {
    if (descriptor && propertyKey) {
      const existing =
        Reflect.getOwnMetadata(METHOD_INTERCEPTORS, descriptor.value) || [];
      Reflect.defineMetadata(
        METHOD_INTERCEPTORS,
        [...existing, ...interceptors],
        descriptor.value,
      );
    } else {
      const existing =
        Reflect.getOwnMetadata(CONTROLLER_INTERCEPTORS, target) || [];
      Reflect.defineMetadata(
        CONTROLLER_INTERCEPTORS,
        [...existing, ...interceptors],
        target,
      );
    }
  };
}
