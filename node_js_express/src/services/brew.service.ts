import {BrewDto, CreateBrewDto} from '../dto/brew.dto';
import {randomUUID} from 'node:crypto';
import {GetAllQueryParams} from '../interfaces/common.interfaces';
import createHttpError from 'http-errors';

export class BrewService {
  private readonly brews = new Map<string, BrewDto>();

  async createBrew(brew: CreateBrewDto): Promise<BrewDto> {
    const id = randomUUID();
    const createdBrew: BrewDto = { id, ...brew };

    this.brews.set(id, createdBrew);

    return createdBrew;
  }

  async getAllBrews(queryParams: GetAllQueryParams = {}): Promise<BrewDto[]> {
    const { method, ratingMin } = queryParams;

    return [...this.brews.values()]
      .filter(brew => !method || brew.method === method)
      .filter(brew => !ratingMin || (brew.rating != null && brew.rating >= ratingMin));
  }

  async getBrewById(id: string): Promise<BrewDto> {
    const brew = this.brews.get(id);

    if (!brew) {
      throw createHttpError(400, `Brew with id ${id} not found`);
    }

    return brew;
  }

  async updateBrew(id: string, brew: CreateBrewDto): Promise<BrewDto | undefined> {
    if (!this.brews.has(id)) {
      throw createHttpError(400, `Brew with id ${id} not found`);
    }

    const updatedBrew: BrewDto = { id, ...brew };
    this.brews.set(id, updatedBrew);
    return updatedBrew;
  }

  async deleteBrew(id: string): Promise<void> {
    if (!this.brews.has(id)) {
      throw createHttpError(400, `Brew with id ${id} not found`);
    }

    this.brews.delete(id);
  }
}
