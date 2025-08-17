import { Body, Controller, Post, UseFilters, UseGuards } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ProfilesService } from './profiles.service';
import { AuthGuard } from './guards/auth.guard';
import { BadRequestExceptionFilter } from './filters/bad-request-execption.filter';
import { CustomLogger } from '../logger/logger';

@Controller('profiles')
@UseFilters(BadRequestExceptionFilter)
@UseGuards(AuthGuard)
export class ProfilesController {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly logger: CustomLogger,
  ) {}

  @Post()
  async createProfile(@Body() createProfileDto: CreateProfileDto) {
    const profile = await this.profilesService.create(createProfileDto);
    this.logger.log(`Profile created: ${JSON.stringify(profile, null, 2)}`);
    return profile;
  }
}
