import {
  Body,
  Controller,
  Get,
  Headers,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Response } from 'express';
import { UserDto } from './dto/user.dto';
import * as path from 'node:path';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<{ items: UserDto[]; total: number }> {
    const users = await this.usersService.getAll();
    return { items: users, total: users.length };
  }

  @Get(':id/icon')
  async getUserIcon(@Param('id') id: string, @Res() response: Response) {
    const icon = await this.usersService.getIcon(id);

    if (icon) {
      response.setHeader('Content-Type', icon.contentType);
      return response.status(HttpStatus.OK).send(icon.data);
    }

    return response.sendFile('unknown.png', {
      root: path.join(process.cwd(), 'src', 'public', 'icons'),
    });
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('icon', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async createUser(
    @Headers('X-User') admin: string,
    @Body('name') name: string,
    @UploadedFile() icon?: Express.Multer.File,
  ): Promise<UserDto> {
    return await this.usersService.create(name, icon);
  }
}
