import { Controller, Get, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: '獲取當前用戶信息' })
  async me(@Request() req) {
    return this.usersService.findById(req.user.id);
  }

  @Put('me')
  @ApiOperation({ summary: '更新當前用戶信息' })
  async updateMe(@Request() req, @Body() data: any) {
    return this.usersService.update(req.user.id, data);
  }

  @Get(':id')
  @ApiOperation({ summary: '獲取指定用戶信息' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: '刪除用戶' })
  async delete(@Param('id') id: string) {
    await this.usersService.delete(id);
    return { message: '用戶已刪除' };
  }
}
