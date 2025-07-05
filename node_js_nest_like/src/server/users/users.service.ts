import {Injectable} from '../../core/decorators/injectable';
import { randomUUID } from 'node:crypto';
import {th} from 'zod/dist/types/v4/locales';

@Injectable()
export class UsersService {
  private readonly users: Map<string, any> = new Map();

  async findAll(): Promise<any[]> {
    return ['Bob', 'Jon'];
  }

  async createUser(userDto: any): Promise<any> {
    const id = randomUUID();
    const newUser = {
      id,
      ...userDto,
    }

    this.users.set(id, newUser);
    return newUser;
  }
}
