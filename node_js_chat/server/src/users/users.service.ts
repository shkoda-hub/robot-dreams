import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { UserDto } from './dto/user.dto';
import { UserIcon } from './schemas/icon.schema';

import {
  transformToDto,
  transformToDtoArray,
} from '../common/utils/mongo.utils';
import { IconDTO } from './dto/icon.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserIcon.name) private userIconModel: Model<UserIcon>,
  ) {}

  async getAll(): Promise<UserDto[]> {
    const users = await this.userModel.find().exec();
    return transformToDtoArray(UserDto, users);
  }

  async getIcon(id: string): Promise<IconDTO | null> {
    const icon = await this.userIconModel.findOne({ userId: id }).exec();
    if (!icon) return null;

    return { data: icon.img.data, contentType: icon.img.contentType };
  }

  async create(name: string, icon?: Express.Multer.File): Promise<UserDto> {
    const userDoc = await this.userModel.create({ name });

    const userDto = transformToDto(
      UserDto,
      userDoc.toObject({ virtuals: true }),
    );

    if (icon) {
      await this.saveIcon(userDto.id, icon);
    }

    return userDto;
  }

  private async saveIcon(
    userId: string,
    icon: Express.Multer.File,
  ): Promise<void> {
    const createdUserIcon = new this.userIconModel({
      userId,
      img: {
        data: icon.buffer,
        contentType: icon.mimetype,
      },
    });

    await createdUserIcon.save();
  }
}
