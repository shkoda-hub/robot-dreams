import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Module } from '../../core/decorators/module';

@Module({
  controllers: [UsersController],
  providers: [UsersService, { provide: 'API_KEY', useValue: 'someApikey' }],
})
export class UsersModule {}
