import { Pool } from 'pg';
import SQL from 'sql-template-strings';

export class Orm<T extends { id: number | string }> {
  constructor(
    private readonly table: string,
    private readonly pool: Pool,
  ) {}

  async findAll(filters?: Partial<T>): Promise<T[]> {
    let query = SQL`SELECT * FROM `.append(this.table);

    const entries = filters ? Object.entries(filters) : [];

    entries.forEach(([key, value], idx) => {
      if (value === undefined) return;
      const condition = SQL``.append(key).append(SQL` = ${value}`);

      if (idx === 0) {
        query = query.append(SQL` WHERE `.append(condition));
      } else {
        query = query.append(SQL` AND `.append(condition));
      }
    });

    const result = await this.pool.query<T>(query);
    return result.rows;
  }

  async findOne(id: T['id']): Promise<T | null> {
    const query = SQL`SELECT * FROM `
      .append(this.table)
      .append(SQL` WHERE id = ${id}`);

    const result = await this.pool.query<T>(query);
    return result.rows[0] ?? null;
  }

  async save(entity: Omit<T, 'id'>): Promise<T> {
    const columns = Object.keys(entity);
    const values = Object.values(entity);

    const placeholders = values.map((_value, i) => `$${i + 1}`).join(', ');

    const query = SQL`INSERT INTO `
      .append(this.table)
      .append(SQL` (`)
      .append(columns.join(', '))
      .append(SQL`) VALUES (`)
      .append(placeholders)
      .append(SQL`) RETURNING *`);

    const { rows } = await this.pool.query<T>(query, values);
    return rows[0];
  }

  async update(id: T['id'], patch: Partial<T>): Promise<T | null> {
    const entries = Object.entries(patch);

    let query = SQL`UPDATE `.append(this.table).append(SQL` SET `);

    entries.forEach(([key, value], idx) => {
      if (value === undefined) return;
      query = query.append(key).append(SQL` = ${value}`);
      if (idx < entries.length - 1) {
        query = query.append(SQL`, `);
      }
    });

    query = query.append(SQL` WHERE id = ${id} RETURNING *`);

    const { rows } = await this.pool.query<T>(query);
    return rows[0] ?? null;
  }

  async delete(id: T['id']): Promise<void> {
    const query = SQL`DELETE FROM `
      .append(this.table)
      .append(SQL` WHERE id = ${id}`);

    await this.pool.query<T>(query);
  }
}
