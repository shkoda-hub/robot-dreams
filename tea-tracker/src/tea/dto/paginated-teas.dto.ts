import { PaginatedDto } from '../../common/dto/paginated.dto';
import { Tea } from '../entities/tea.entity';

export class PaginatedTeasDto extends PaginatedDto(Tea) {}
