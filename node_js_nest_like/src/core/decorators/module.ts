import { MODULE_META } from './keys';
import { IModuleMetadata } from '../interfaces/interfaces';

export function Module(metaData: IModuleMetadata): ClassDecorator {
  return function (target: any) {
    Reflect.defineMetadata(MODULE_META, metaData, target);
  };
}
