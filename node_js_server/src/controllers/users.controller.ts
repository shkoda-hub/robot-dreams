import {IncomingMessage, ServerResponse} from 'node:http';
import {usersService} from '../services/users.service';
import {RequestOptions} from '../lib/router.interfaces';
import {CreateUserDto, UpdateUserDto} from '../dto/user.dto';
import {createUserSchema, updateUserSchema} from '../schemas/user.schema';

class UsersController {
  public getAllUsers = async (
    _req: IncomingMessage,
    res: ServerResponse
  ) => {
    const users = await usersService.getAllUsers();

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(users));
  };

  public getUser = async (
    _req: IncomingMessage,
    res: ServerResponse,
    opts: RequestOptions,
  ) => {
    const { params } = opts;
    const user = await usersService.getUserById(params.id);

    if (!user) {
      return await this.handleUserIsNotFound(res, params.id);
    }

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(user));
  };

  public createUser = async (
    _req: IncomingMessage,
    res: ServerResponse,
    opts: RequestOptions<CreateUserDto>,
  ) => {
    const { body } = opts;
    const parsed = await createUserSchema.safeParseAsync(body);
    if (!parsed.success) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ errors: parsed.error.format() }));
    }
    const user = await usersService.createUser(body);

    res.writeHead(201, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(user));
  };

  public deleteUser = async (
    _req: IncomingMessage,
    res: ServerResponse,
    opts: RequestOptions) => {
    const { params } = opts;
    const user = await usersService.getUserById(params.id);

    if (!user) {
      return await this.handleUserIsNotFound(res, params.id);
    }

    await usersService.deleteUser(params.id);
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({ message: `User ${ params.id } was successfully deleted` }));
  };

  public updateUser = async (
    _req: IncomingMessage,
    res: ServerResponse,
    opts: RequestOptions<UpdateUserDto>,
  ) => {
    const { params, body } = opts;
    const parsed = await updateUserSchema.safeParseAsync(body);

    if (!parsed.success) {
      res.writeHead(400, {'Content-Type': 'application/json'});
      return res.end(JSON.stringify({ errors: parsed.error.format() }));
    }
    const userToUpdate = await usersService.getUserById(params.id);

    if (!userToUpdate) {
      return await this.handleUserIsNotFound(res, params.id);
    }

    const user = await usersService.updateUser(params.id, body);
    res.writeHead(201, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(user));
  };

  private handleUserIsNotFound = async (
    res: ServerResponse,
    id: string,
  ): Promise<void> => {
    res.writeHead(404, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({ message: `User ${ id } not found` }));
  };
}

export const usersController = new UsersController();
