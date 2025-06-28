import {Request, Response} from 'express';
import {BrewDto, CreateBrewDto} from '../dto/brew.dto';
import {BrewService} from '../services/brew.service';
import {ErrorMessage, GetAllQueryParams} from '../interfaces/common.interfaces';
import createHttpError from 'http-errors';

export class BrewController {

  constructor(
    private readonly brewsService: BrewService
  ) {}

  createBrew = async (
    req: Request<unknown, unknown, CreateBrewDto>,
    res: Response<BrewDto>
  ) => {
    const brew = await this.brewsService.createBrew(req.body);
    res.status(201).json(brew);
  };

  getAllBrews = async (
    req: Request<unknown, unknown, unknown, GetAllQueryParams>,
    res: Response<BrewDto[]>,
  ) => {
    const brews = await this.brewsService.getAllBrews(req.query);
    res.json(brews);
  };

  getBrewById = async (
    req: Request,
    res: Response<BrewDto>
  ) => {
    console.log('some');
    const brew = await this.brewsService.getBrewById(req.params.id);

    if (!brew) {
      throw createHttpError(404, `Brew with id ${req.params.id} not found`);
    }

    res.status(200).json(brew);
  };

  updateBrew = async (
    req: Request<{id: string}, unknown, CreateBrewDto>,
    res: Response<BrewDto | ErrorMessage>
  ) => {
    const brew = await this.brewsService.updateBrew(req.params.id, req.body);

    if (!brew) {
      throw createHttpError(404, `Brew with id ${req.params.id} not found`);
    }

    res.status(201).json(brew);
  };

  deleteBrew = async (
    req: Request<{id: string}>,
    res: Response
  ) => {
    const result = await this.brewsService.deleteBrew(req.params.id);

    if (!result) {
      throw createHttpError(404, `Brew with id ${req.params.id} not found`);
    }

    res.sendStatus(204);
  };
}
