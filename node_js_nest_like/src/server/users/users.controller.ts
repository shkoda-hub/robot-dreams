import { UsersService } from './users.service';
import { Controller } from '../../core/decorators/controller';
import { Get, Post } from '../../core/decorators/router';
import { Body, Param, Query } from '../../core/decorators/body';
import { UsePipes } from '../../core/decorators/usePipes';
import { ZodValidationPipe } from './pipes/zod-validation.pipe';
import { CreateUserDto, createUserSchema } from './schema/create-user.schema';
import { AuthGuard } from './guards/auth.guard';
import { UseGuards } from '../../core/decorators/useGuards';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  async getAll(@Query() query: any) {
    return this.usersService.findAll();
  }

  @Get('/:id')
  async getOne(@Param('id') id: string) {
    console.log(`Getting user with id ${id}`);
  }

  @Post('/')
  @UsePipes(new ZodValidationPipe(createUserSchema))
  @UseGuards(AuthGuard)
  async create(@Body() body: CreateUserDto) {
    return this.usersService.createUser(body);
  }
}
