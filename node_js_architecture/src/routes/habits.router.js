import {HabitsController} from '../controllers/habits.controller.js';
import {parseConsoleInput} from '../utils/utils.js';

export class HabitsRouter {
  constructor() {
    this.controller = new HabitsController();
  }

  async route(input) {
    const params = parseConsoleInput(input);
    switch (params.operation) {
      case 'add': {
        const { name, freq } = params;
        await this.controller.addHabit({ name, freq });
        break;
      }
      case 'list': {
        await this.controller.listAllHabits();
        break;
      }
      case 'done': {
        await this.controller.makeDoneHabit(params.id);
        break;
      }
      case 'stats': {
        await this.controller.showStatistic();
        break;
      }
      case 'delete': {
        await this.controller.deleteHabit(params.id);
        break;
      }
      case 'update': {
        const { id, name, freq } = params;
        await this.controller.updateHabit(id, { name, freq });
        break;
      }
      default:
        throw new Error('Unsupported operation. Supported operations: add, list, done, stats, delete, update');
    }
  }
}
