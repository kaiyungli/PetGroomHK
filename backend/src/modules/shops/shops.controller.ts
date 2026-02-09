import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ShopsService } from './shops.service';

@ApiTags('shops')
@Controller('shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @Get()
  @ApiOperation({ summary: '獲取店家列表' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'district', required: false })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'] })
  async findAll(
    @Query('search') search?: string,
    @Query('district') district?: string,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('sortBy') sortBy?: string,
    @Query('order') order?: 'asc' | 'desc',
  ) {
    return this.shopsService.findAll({
      search,
      district,
      skip: skip ? Number(skip) : 0,
      take: take ? Number(take) : 20,
      sortBy,
      order,
    });
  }

  @Get('districts')
  @ApiOperation({ summary: '獲取所有地區' })
  async getDistricts() {
    return this.shopsService.getDistricts();
  }

  @Get(':id')
  @ApiOperation({ summary: '獲取店家詳情' })
  async findOne(@Param('id') id: string) {
    return this.shopsService.findById(id);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: '創建店家' })
  async create(@Body() data: any) {
    return this.shopsService.create(data);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新店家' })
  async update(@Param('id') id: string, @Body() data: any) {
    return this.shopsService.update(id, data);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '刪除店家' })
  async delete(@Param('id') id: string) {
    await this.shopsService.delete(id);
    return { message: '店家已刪除' };
  }

  @Post('seed')
  @ApiBearerAuth()
  @ApiOperation({ summary: '批量創建店家（開發用）' })
  async seed(@Body() shops: any[]) {
    await this.shopsService.seedShops(shops);
    return { message: `已創建 ${shops.length} 間店家` };
  }
}
