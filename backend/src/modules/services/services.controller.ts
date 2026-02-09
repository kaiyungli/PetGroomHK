import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ServicesService } from './services.service';

@ApiTags('services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get('shop/:shopId')
  @ApiOperation({ summary: '獲取店家的服務列表' })
  async findByShop(@Param('shopId') shopId: string) {
    return this.servicesService.findByShop(shopId);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: '創建服務' })
  async create(@Body() data: any) {
    return this.servicesService.create(data);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新服務' })
  async update(@Param('id') id: string, @Body() data: any) {
    return this.servicesService.update(id, data);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '刪除服務' })
  async delete(@Param('id') id: string) {
    await this.servicesService.delete(id);
    return { message: '服務已刪除' };
  }
}
