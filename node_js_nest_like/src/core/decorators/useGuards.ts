import { CONTROLLER_GUARDS, METHOD_GUARDS } from './keys';

export function UseGuards(...guards: any[]): MethodDecorator & ClassDecorator {
  return function (
    target: any,
    propertyKey?: string | symbol,
    descriptor?: PropertyDescriptor,
  ) {
    if (descriptor && propertyKey) {
      const existing =
        Reflect.getOwnMetadata(METHOD_GUARDS, descriptor.value) || [];
      Reflect.defineMetadata(
        METHOD_GUARDS,
        [...existing, ...guards],
        descriptor.value,
      );
    } else {
      const existing = Reflect.getOwnMetadata(CONTROLLER_GUARDS, target) || [];
      Reflect.defineMetadata(
        CONTROLLER_GUARDS,
        [...existing, ...guards],
        target,
      );
    }
  };
}
