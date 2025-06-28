import {BrewDto, CreateBrewDto} from '../dto/brew.dto';
import {randomUUID} from 'node:crypto';
import {GetAllQueryParams} from '../interfaces/common.interfaces';

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

    return [...this.brews.values()].filter(brew => {
      if (method && brew.method !== method) {
        return false;
      }

      if (ratingMin != null) {
        if (brew.rating == null) {
          return false;
        }
        if (brew.rating < ratingMin) {
          return false;
        }
      }

      return true;
    });
  }

  async getBrewById(id: string): Promise<BrewDto | undefined> {
    return this.brews.get(id);
  }

  async updateBrew(id: string, brew: CreateBrewDto): Promise<BrewDto | undefined> {
    if (!this.brews.has(id)) {
      return undefined;
    }

    const updatedBrew: BrewDto = { id, ...brew };
    this.brews.set(id, updatedBrew);
    return updatedBrew;
  }

  async deleteBrew(id: string): Promise<boolean> {
    if (!this.brews.has(id)) {
      return false;
    }

    this.brews.delete(id);
    return true;
  }
}
