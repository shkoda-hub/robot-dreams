import { Injectable } from '../../core/decorators/injectable';
import { randomUUID } from 'node:crypto';
import { CreateUserDto } from './dto/create-user.shema';

@Injectable()
export class UsersService {
  private readonly users: Map<string, any> = new Map();

  async findAll(): Promise<any[]> {
    return Array.from(this.users.values());
  }

  async findOne(id: string): Promise<any> {
    return this.users.get(id);
  }

  async createUser(userDto: CreateUserDto): Promise<any> {
    const id = randomUUID();
    const newUser = {
      id,
      ...userDto,
    };

    this.users.set(id, newUser);
    return newUser;
  }
}
