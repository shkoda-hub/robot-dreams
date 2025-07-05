import { PARAMS_KEY } from './keys';
import { ArgumentMetadata, ParamType } from '../interfaces/interfaces';

export function createParamDecorator(type: ParamType) {
  return (data?: string, ...pipes: any[]): ParameterDecorator => {
    return (target, propertyKey, parameterIndex) => {
      const existing: ArgumentMetadata[] =
        Reflect.getOwnMetadata(PARAMS_KEY, target, propertyKey!) || [];

      existing.push({
        index: parameterIndex,
        type,
        data,
        pipes,
      });

      const fn = target[propertyKey as string];
      Reflect.defineMetadata(PARAMS_KEY, existing, fn);
    };
  };
}

export const Body = createParamDecorator(ParamType.BODY);
export const Query = createParamDecorator(ParamType.QUERY);
export const Param = createParamDecorator(ParamType.PARAM);
export const Header = createParamDecorator(ParamType.HEADER);
