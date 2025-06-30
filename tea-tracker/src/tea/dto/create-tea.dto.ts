import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTeaDto {
  @ApiProperty({ example: 'chinese tea' })
  name!: string;

  @ApiProperty({ example: 'China' })
  origin!: string;

  @ApiPropertyOptional({ example: 4 })
  rating?: number;

  @ApiPropertyOptional({ example: 75 })
  brewTemp?: number;

  @ApiPropertyOptional({ example: 'Good tea' })
  notes?: string;
}
