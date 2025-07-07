import { UsersService } from './users.service';
import { Controller } from '../../core/decorators/controller';
import { Get, Post } from '../../core/decorators/router';
import { Body, Param, Query } from '../../core/decorators/body';
import { UsePipes } from '../../core/decorators/usePipes';
import { ZodValidationPipe } from './pipes/zod-validation.pipe';
import { CreateUserDto, createUserShema } from './dto/create-user.shema';
import { AuthGuard } from './guards/auth.guard';
import { UseGuards } from '../../core/decorators/useGuards';
import { Inject } from '../../core/decorators/inject';

@Controller('/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject('API_KEY') private readonly apiKey: string,
  ) {}

  @Get('/')
  async getAll(@Query() query: any) {
    return this.usersService.findAll();
  }

  @Get('/:id')
  async getOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post('/')
  @UsePipes(new ZodValidationPipe(createUserShema))
  @UseGuards(AuthGuard)
  async create(@Body() body: CreateUserDto) {
    return this.usersService.createUser(body);
  }
}
