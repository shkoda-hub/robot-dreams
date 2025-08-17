import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ProfileDto } from './dto/profile.dto';
import { plainToInstance } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProfilesService {
  private readonly store: Array<ProfileDto> = [];

  async findById(id: string): Promise<ProfileDto> {
    const profile = this.store.find((profile) => profile.id === id);
    if (!profile) {
      throw new NotFoundException(`Profile with id ${id} not found`);
    }
    return profile;
  }

  async create(createProfileDto: CreateProfileDto): Promise<ProfileDto> {
    if (this.userIsExists(createProfileDto.email)) {
      throw new BadRequestException(
        `Profile with email ${createProfileDto.email} already exists`,
      );
    }

    const profile = plainToInstance(
      ProfileDto,
      {
        id: uuidv4(),
        ...createProfileDto,
      },
      { excludeExtraneousValues: true },
    );

    this.store.push(profile);
    return profile;
  }

  userIsExists(email: string) {
    return this.store.some((store) => store.email === email);
  }
}
