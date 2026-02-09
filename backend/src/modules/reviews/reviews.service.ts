import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    const review = await this.prisma.review.create({ data });
    
    // 更新店家的評分和評論數
    await this.updateShopRating(data.shopId);
    
    return review;
  }

  async findByShop(shopId: string, skip = 0, take = 10) {
    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { shopId, isApproved: true },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, avatarUrl: true } } },
      }),
      this.prisma.review.count({ where: { shopId, isApproved: true } }),
    ]);
    
    return { reviews, total };
  }

  async updateShopRating(shopId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { shopId, isApproved: true },
      select: { rating: true },
    });

    const avgRating = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    await this.prisma.shop.update({
      where: { id: shopId },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length,
      },
    });
  }

  async approve(id: string) {
    const review = await this.prisma.review.update({
      where: { id },
      data: { isApproved: true },
    });
    
    await this.updateShopRating(review.shopId);
    
    return review;
  }
}
