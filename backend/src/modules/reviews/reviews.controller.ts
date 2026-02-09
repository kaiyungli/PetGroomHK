import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('shop/:shopId')
  @ApiOperation({ summary: '獲取店家的評論列表' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  async findByShop(
    @Param('shopId') shopId: string,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.reviewsService.findByShop(
      shopId,
      skip ? Number(skip) : 0,
      take ? Number(take) : 10,
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '創建評論' })
  async create(@Body() data: any) {
    return this.reviewsService.create(data);
  }

  @Post(':id/approve')
  @ApiBearerAuth()
  @ApiOperation({ summary: '審核通過評論' })
  async approve(@Param('id') id: string) {
    return this.reviewsService.approve(id);
  }
}
