import { ApiProperty } from '@nestjs/swagger';
import { Type } from '@nestjs/common';

export function PaginatedDto<T>(ItemClass: Type<T>) {
  class PaginatedResult {
    @ApiProperty({ type: [ItemClass] })
    data!: T[];

    @ApiProperty()
    total!: number;

    @ApiProperty()
    page!: number;

    @ApiProperty()
    pageSize!: number;
  }
  return PaginatedResult;
}
