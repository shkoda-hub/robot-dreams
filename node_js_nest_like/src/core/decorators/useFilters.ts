import { CONTROLLER_FILTERS, METHOD_FILTERS } from './keys';

export function UseFilters(
  ...filters: any[]
): MethodDecorator & ClassDecorator {
  return function (
    target: any,
    propertyKey?: string | symbol,
    descriptor?: PropertyDescriptor,
  ) {
    if (descriptor && propertyKey) {
      const existing =
        Reflect.getOwnMetadata(METHOD_FILTERS, descriptor.value) || [];
      Reflect.defineMetadata(
        METHOD_FILTERS,
        [...existing, ...filters],
        descriptor.value,
      );
    } else {
      const existing = Reflect.getOwnMetadata(CONTROLLER_FILTERS, target) || [];
      Reflect.defineMetadata(METHOD_FILTERS, [...existing, ...filters], target);
    }
  };
}
