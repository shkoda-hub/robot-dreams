import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from '../common/decorators';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('admin')
export class AdminController {
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('metrics')
  async getMetrics() {
    return { ok: true };
  }
}
