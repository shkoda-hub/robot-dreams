import { CONTROLLER_PREFIX, INJECTABLE } from './keys';

export function Controller(prefix = ''): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(INJECTABLE, true, target);
    Reflect.defineMetadata(CONTROLLER_PREFIX, prefix, target);
  };
}
