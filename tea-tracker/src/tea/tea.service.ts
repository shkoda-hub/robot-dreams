import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getOne(id: string): Promise<Tea> {
    const tea = this.teas.find((t) => t.id === id);

    if (!tea) throw new NotFoundException(`Tea with id ${id} not found`);

    return tea;
  }

  async create(tea: CreateTeaDto): Promise<Tea> {
    const newTea: Tea = {
      id: randomUUID(),
      ...tea,
    };
    this.teas.push(newTea);
    return newTea;
  }

  async update(id: string, tea: UpdateTeaDto): Promise<Tea> {
    const index = this.teas.findIndex((t) => t.id === id);

    if (index === -1)
      throw new NotFoundException(`Tea with id ${id} not found`);

    const existing = this.teas[index];
    const updated = {
      ...existing,
      ...tea,
    };

    this.teas[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<void> {
    const index = this.teas.findIndex((t) => t.id === id);

    if (index === -1)
      throw new NotFoundException(`Tea with id ${id} not found`);

    this.teas = this.teas.filter((t) => t.id !== id);
  }
}
