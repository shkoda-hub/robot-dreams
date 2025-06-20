import {UsersModel} from '../models/users.model';
import {CreateUserDto, UpdateUserDto, UserDto} from '../dto/user.dto';

class UsersService {
  private readonly usersModel: UsersModel;

  constructor() {
    this.usersModel = new UsersModel();
  }

  async getAllUsers(): Promise<UserDto[]> {
    return await this.usersModel.getAll();
  }

  async getUserById(id: string): Promise<UserDto | undefined> {
    return await this.usersModel.getOne(id);
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserDto> {
    return await this.usersModel.add(createUserDto);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserDto | undefined> {
    return await this.usersModel.update(id, updateUserDto);
  }

  async deleteUser(id: string): Promise<string> {
    return await this.usersModel.delete(id);
  }
}

export const usersService = new UsersService();
