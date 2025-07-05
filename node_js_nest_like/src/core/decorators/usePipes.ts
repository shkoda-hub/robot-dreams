import { ArgumentMetadata } from '../interfaces/interfaces';
import { CONTROLLER_PIPES, METHOD_PIPES, PARAMS_KEY } from './keys';

export function UsePipes(...pipes: any[]) {
  return function (
    target: any,
    propertyKey: string,
    descriptorOrIndex: PropertyDescriptor | number,
  ) {
    if (typeof descriptorOrIndex === 'number') {
      const params: ArgumentMetadata[] =
        Reflect.getOwnMetadata(PARAMS_KEY, target, propertyKey!) || [];
      const index = descriptorOrIndex;
      const meta = params.find((m) => m.index === index)!;
      const existing = meta.pipes || [];
      meta.pipes = [...existing, ...pipes];
      Reflect.defineMetadata(PARAMS_KEY, params, target, propertyKey!);
      return;
    }

    if (propertyKey && descriptorOrIndex) {
      const existing =
        Reflect.getOwnMetadata(METHOD_PIPES, target[propertyKey]) || [];
      Reflect.defineMetadata(
        METHOD_PIPES,
        [...existing, ...pipes],
        target[propertyKey],
      );
      return;
    }

    const existing = Reflect.getOwnMetadata(CONTROLLER_PIPES, target) || [];
    Reflect.defineMetadata(CONTROLLER_PIPES, [...existing, ...pipes], target);
  };
}
