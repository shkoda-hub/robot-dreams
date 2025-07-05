import {
  CanActivate,
  ExecutionContext,
} from '../../../core/interfaces/interfaces';
import { HttpException } from '../../../core/http/http-exception';

export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { req } = context;
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      throw new HttpException('Unauthorized', 401);
    }

    return true;
  }
}
