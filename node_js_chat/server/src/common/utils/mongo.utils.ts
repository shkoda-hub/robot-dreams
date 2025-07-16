import { ClassConstructor, plainToInstance } from 'class-transformer';

export function transformToDto<R, T = unknown>(
  dtoClass: ClassConstructor<R>,
  plain: T,
): R {
  return plainToInstance(dtoClass, plain, {
    excludeExtraneousValues: true,
  });
}

export function transformToDtoArray<R, T = unknown>(
  dtoClass: ClassConstructor<R>,
  plains: T[],
): R[] {
  return plainToInstance(dtoClass, plains, {
    excludeExtraneousValues: true,
  });
}
