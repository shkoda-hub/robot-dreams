import 'reflect-metadata';

import { AppModule } from './server/app.module';
import { Factory } from './core/factory';
import { HttpExceptionFilter } from './server/users/filters/httpErrors.filter';

async function bootstrap() {
  Factory.userGlobalFilters(HttpExceptionFilter);

  const app = await Factory.create(AppModule);

  app.listen(3000, () => {
    console.log(`Listening on port 3000`);
  });
}

bootstrap();
