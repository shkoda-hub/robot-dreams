import { ApiProperty } from '@nestjs/swagger';

export class UpdateTeaDto {
  @ApiProperty({ example: 'chinese tea' })
  name?: string;

  @ApiProperty({ example: 'China' })
  origin?: string;

  @ApiProperty({ example: 4 })
  rating?: number;

  @ApiProperty({ example: 75 })
  brewTemp?: number;

  @ApiProperty({ example: 'Good tea' })
  notes?: string;
}
