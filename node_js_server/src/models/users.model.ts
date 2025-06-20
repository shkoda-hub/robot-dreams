import * as path from 'path';
import { promises as fs } from 'fs';
import {CreateUserDto, UpdateUserDto, UserDto} from '../dto/user.dto';
import * as crypto from 'crypto';

const DB_PATH = path.resolve(process.cwd(), 'database.json');

export class UsersModel {
  async add(user: CreateUserDto): Promise<UserDto> {
    const data = await this.read();
    const newUser: UserDto = {
      id: crypto.randomUUID(),
      ...user,
    };
    data.push(newUser);
    await this.write(data);
    return newUser;
  }

  async update(id: string, updates: UpdateUserDto) {
    const data = await this.read();
    const user = data.find(user => user.id === id);

    if (!user) {
      return;
    }

    const safeUpdates = Object.fromEntries(
      Object.entries(updates)
        .filter(([, v]) => v !== undefined)
    ) as Partial<UpdateUserDto>;

    Object.assign(user, safeUpdates);

    await this.write(data);
    return user;
  }

  async delete(id: string): Promise<string> {
    const data = await this.read();
    const filtered = data.filter(user => user.id !== id);

    await this.write(filtered);
    return id;
  }

  async getAll(): Promise<UserDto[]> {
    return this.read();
  }

  async getOne(id: string): Promise<UserDto | undefined> {
    const data = await this.read();
    return data.find(user => user.id === id);
  }

  private async read(): Promise<UserDto[]> {
    try {
      const users = await fs.readFile(DB_PATH, 'utf8');
      return JSON.parse(users);
    } catch {
      throw new Error('Unable to read users');
    }
  }

  private async write(data: UserDto[]): Promise<void> {
    try {
      await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    } catch {
      throw new Error('Unable to write users');
    }
  }
}
