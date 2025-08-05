import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TeaService } from './tea.service';
import { ZBody } from '../common/decorators/zbody.decorator';
import { createTeaSchema, updateTeaSchema } from './schema/tea.schema';
import { ZQuery } from '../common/decorators/zquery.decorator';
import { teasQuerySchema } from './schema/teas-query.schema';
import { TeasQueryParamsDto } from './dto/teas-query.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { Public } from '../common/decorators/public.decorator';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import {
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTeaDto } from './dto/create-tea.dto';
import { UpdateTeaDto } from './dto/update-tea.dto';
import { TeaDto } from './dto/tea.dto';
import { PaginatedTeasDto } from './dto/paginated-teas.dto';

@ApiTags('tea')
@ApiSecurity('x-api-key')
@Controller('tea')
@UseGuards(AuthGuard)
@UseInterceptors(LoggingInterceptor)
export class TeaController {
  constructor(private readonly teaService: TeaService) {}

  @Get()
  @Public()
  @ApiQuery({
    type: TeasQueryParamsDto,
  })
  @ApiResponse({
    status: 200,
    type: PaginatedTeasDto,
  })
  async getAll(
    @ZQuery(teasQuerySchema) query: TeasQueryParamsDto,
  ): Promise<PaginatedTeasDto> {
    return await this.teaService.getAll(query);
  }

  @Get(':id')
  @Public()
  @ApiResponse({
    status: 200,
    type: TeaDto,
  })
  async getOne(@Param('id') id: string) {
    return await this.teaService.getOne(id);
  }

  @Post()
  @ApiBody({ type: CreateTeaDto })
  @ApiResponse({
    status: 201,
    type: TeaDto,
  })
  async create(@ZBody(createTeaSchema) body: CreateTeaDto) {
    return await this.teaService.create(body);
  }

  @Put(':id')
  @ApiBody({ type: UpdateTeaDto })
  @ApiResponse({
    status: 201,
    type: TeaDto,
  })
  async update(
    @Param('id') id: string,
    @ZBody(updateTeaSchema) body: UpdateTeaDto,
  ) {
    return await this.teaService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
  })
  async delete(@Param('id') id: string) {
    await this.teaService.delete(id);
  }
}
