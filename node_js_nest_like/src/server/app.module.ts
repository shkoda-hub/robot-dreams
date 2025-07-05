import { UsersModule } from './users/users.module';
import { Module } from '../core/decorators/module';

@Module({
  imports: [UsersModule],
})
export class AppModule {}
