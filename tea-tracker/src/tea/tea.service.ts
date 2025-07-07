import { Injectable } from '@nestjs/common';
import { Tea } from './entities/tea.entity';
import { randomUUID } from 'node:crypto';
import { CreateTeaDto } from './dto/create-tea.dto';
import { UpdateTeaDto } from './dto/update-tea.dto';
import { TeasQueryParamsDto } from './dto/teas-query.dto';
import { PaginatedTeasDto } from './dto/paginated-teas.dto';

@Injectable({})
export class TeaService {
  private teas: Tea[] = [];

  async getAll(query: TeasQueryParamsDto): Promise<PaginatedTeasDto> {
    const { minRating, page, limit } = query;
    let items = this.teas;

    if (minRating !== undefined) {
      items = items.filter(
        (t): t is Tea & { rating: number } =>
          typeof t.rating === 'number' && t.rating >= minRating,
      );
    }

    const total = this.teas.length;
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      data: items.slice(start, end),
      total,
      page,
      pageSize: limit,
    };
  }

  async getOne(id: string): Promise<Tea | undefined> {
    return this.teas.find((tea) => tea.id === id);
  }

  async create(tea: CreateTeaDto): Promise<Tea> {
    const newTea: Tea = {
      id: randomUUID(),
      ...tea,
    };
    this.teas.push(newTea);
    return newTea;
  }

  async update(id: string, tea: UpdateTeaDto): Promise<Tea | undefined> {
    const index = this.teas.findIndex((t) => t.id === id);

    if (index === -1) {
      return undefined;
    }

    const existing = this.teas[index];
    const updated = {
      ...existing,
      ...tea,
    };

    this.teas[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.teas.findIndex((t) => t.id === id);

    if (index === -1) {
      return false;
    }

    this.teas = this.teas.filter((t) => t.id !== id);
    return true;
  }
}
