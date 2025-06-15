import * as fs from 'node:fs/promises';
import crypto from 'crypto';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const DB_PATH    = path.join(__dirname, '../../database.json');

export class HabitsModel {

  async add({name, freq, history = []}) {
    const data = await this._read();
    const habit = {
      id: crypto.randomUUID(),
      name,
      freq,
      history,
    };

    data.push(habit);
    await this._write(data);
    return habit;
  }

  async update(id, updates = {}) {
    const data = await this._read();
    const habitToUpdate = data.find(habit => habit.id === id);

    const safeUpdates = Object.fromEntries(
      Object.entries(updates)
        .filter(([, v]) => v !== undefined)
    );

    Object.assign(habitToUpdate, safeUpdates);

    await this._write(data);
    return habitToUpdate;
  }

  async delete(id) {
    const data = await this._read();
    const filtered = data.filter(habit => habit.id !== id);

    await this._write(filtered);
    return id;
  }

  async getAll() {
    return this._read();
  }

  async getOne(id) {
    const data = await this._read();
    return data.find(habit => habit.id === id);
  }

  async addHistory(id, date) {
    const data = await this._read();
    const habit = data.find(habit => habit.id === id);

    if (!habit.history.includes(date)) {
      habit.history.push(date);
      await this._write(data);
    }

    return habit;
  }

  async _read() {
    const habits = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(habits);
  }

  async _write(data) {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  }
}
