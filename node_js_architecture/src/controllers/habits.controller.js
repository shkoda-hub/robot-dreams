import {HabitsService} from '../services/habits.service.js';

export class HabitsController {
  #supportedFrequencies = ['daily', 'weekly', 'monthly'];

  constructor() {
    this.service = new HabitsService();
  }

  addHabit = async ({ name, freq }) => {
    if (!name || !freq) {
      console.error('Name and freq should be defined');
      return;
    }

    if (this.#supportedFrequencies.indexOf(freq) === -1) {
      console.error('Please, provide a valid frequency: (daily, weekly, monthly)');
      return;
    }

    const habit = await this.service.addHabit({ name, freq });
    console.log(`Habit was created: ${JSON.stringify(habit, null, 2)}`);
  };

  listAllHabits = async () => {
    const data = await this.service.getAllHabits();
    console.table(data);
  };

  makeDoneHabit = async (id) => {
    const habit = await this._findHabit(id);
    if (!habit) return;

    const updated = await this.service.markHabitAsDone(id);
    console.log(`Habit was marked as done: ${JSON.stringify(updated, null, 2)}`);
  };

  showStatistic = async () => {
    const data = await this.service.getStatistics();
    console.table(data);
  };

  deleteHabit = async (id) => {
    const habit = await this._findHabit(id);
    if (!habit) return;

    await this.service.deleteHabit(id);
    console.log(`Habit with id ${id} deleted.`);
  };

  updateHabit = async (id, { name, freq }) => {
    const habit = await this._findHabit(id);
    if (!habit) return;

    if (!name && !freq) {
      console.error('Name or freq should be defined');
      return;
    }

    const updatedHabit = await this.service.update(id, { name, freq });
    console.log(`Habit with id ${id} updated: ${JSON.stringify(updatedHabit)}`);
  };

  _findHabit = async (id) => {
    const habit = await this.service.getHabitById(id);
    if (!habit) {
      console.error(`Habit with id ${id} not found.`);
    }
    return habit;
  };
}
