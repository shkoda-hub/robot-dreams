import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  private readonly users: UserDto[] = [];

  constructor() {
    const firstUserPasswordHash = bcrypt.hashSync('first123', 12);
    const secondUserPasswordHash = bcrypt.hashSync('second123', 12);

    this.users.push(
      {
        id: 1,
        email: 'first@mail.com',
        roles: ['admin'],
        passwordHash: firstUserPasswordHash,
      },
      {
        id: 2,
        email: 'second@mail.com',
        roles: ['user'],
        passwordHash: secondUserPasswordHash,
      },
    );

    console.log(this.users);
  }

  async findOne(email: string) {
    return this.users.find((user) => user.email === email);
  }
}
