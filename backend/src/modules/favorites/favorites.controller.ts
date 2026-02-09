import { Controller, Get, Post, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('favorites')
@Controller('favorites')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @ApiOperation({ summary: '獲取我的收藏' })
  async findAll(@Request() req) {
    return this.favoritesService.findByUser(req.user.id);
  }

  @Post(':shopId')
  @ApiOperation({ summary: '收藏店家' })
  async add(@Request() req, @Param('shopId') shopId: string) {
    return this.favoritesService.add(req.user.id, shopId);
  }

  @Delete(':shopId')
  @ApiOperation({ summary: '取消收藏' })
  async remove(@Request() req, @Param('shopId') shopId: string) {
    return this.favoritesService.remove(req.user.id, shopId);
  }

  @Get(':shopId/check')
  @ApiOperation({ summary: '檢查是否已收藏' })
  async check(@Request() req, @Param('shopId') shopId: string) {
    const isFavorite = await this.favoritesService.isFavorite(req.user.id, shopId);
    return { isFavorite };
  }
}
