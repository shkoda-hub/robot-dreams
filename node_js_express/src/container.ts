import {BrewController} from './controllers/brew.controller';
import {BrewService} from './services/brew.service';
import {asClass, createContainer, InjectionMode} from 'awilix';

interface BrewsModule {
  brewsService: BrewService;
  brewsController: BrewController;
}

const brewsContainer = createContainer<BrewsModule>({
  injectionMode: InjectionMode.CLASSIC,
  strict: true,
});

brewsContainer.register({
  brewsService: asClass(BrewService).singleton(),
  brewsController: asClass(BrewController).scoped(),
});

export default brewsContainer;
