import {HabitsModel} from '../models/habits.model.js';
import config from '../config/config.js';

const { dayOffset } = config;

export class HabitsService {
  constructor() {
    this.model = new HabitsModel();
  }

  async addHabit({ name, freq }) {
    return this.model.add({ name, freq });
  }

  async getAllHabits() {
    return this.model.getAll();
  }

  async getHabitById(id) {
    return this.model.getOne(id);
  }

  async markHabitAsDone(id) {
    return await this.model.addHistory(id, this._today.toLocaleDateString('en-US'));
  }

  async getStatistics() {
    const data = await this.model.getAll();
    return data.map((habit) => ({
      id: habit.id,
      name: habit.name,
      freq: habit.freq,
      percent: this._getStatistics(habit),
    }));
  }

  async deleteHabit(id) {
    await this.model.delete(id);
  }

  async update(id, { name, freq }) {
    return this.model.update(id, { name, freq });
  }

  _getStatistics(habit, period = 7) {
    const ref = this._today;

    let doneCount = 0;
    for (let i = 0; i < period; i++) {
      const date = new Date(ref);
      date.setDate(ref.getDate() - i);
      const dayString = date.toLocaleDateString('en-US');
      if (habit.history.includes(dayString)) {
        doneCount++;
      }
    }

    return +((doneCount / period) * 100).toFixed(1);
  }

  get _today() {
    const d = new Date();
    d.setDate(d.getDate() + dayOffset);
    d.setHours(0,0,0,0);
    return d;
  }
}
