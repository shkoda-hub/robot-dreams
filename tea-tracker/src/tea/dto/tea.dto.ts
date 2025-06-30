import { ApiProperty } from '@nestjs/swagger';
import { CreateTeaDto } from './create-tea.dto';

export class TeaDto extends CreateTeaDto {
  @ApiProperty({ description: 'Tea id', example: 'uuid-v4' })
  id!: string;
}
