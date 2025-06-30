import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class TeasQueryParamsDto extends PaginationQueryDto {
  @ApiPropertyOptional({ example: 7 })
  minRating?: number;
}
