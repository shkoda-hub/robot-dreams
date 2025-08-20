import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from '../auth/types/types';

export const CurrentUser = createParamDecorator(
  (_, context: ExecutionContext) => {
    const request: Request = context.switchToHttp().getRequest();
    return request.user as JwtPayload;
  },
);

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
