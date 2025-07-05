import { INJECTABLE } from './keys';

export function Injectable(): ClassDecorator {
  return function (target: any) {
    Reflect.defineMetadata(INJECTABLE, true, target);
  };
}
