import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async add(userId: string, shopId: string) {
    const existing = await this.prisma.favorite.findUnique({
      where: { userId_shopId: { userId, shopId } },
    });

    if (existing) {
      throw new ConflictException('已經收藏過此店家');
    }

    return this.prisma.favorite.create({
      data: { userId, shopId },
      include: { shop: true },
    });
  }

  async remove(userId: string, shopId: string) {
    const existing = await this.prisma.favorite.findUnique({
      where: { userId_shopId: { userId, shopId } },
    });

    if (!existing) {
      throw new NotFoundException('收藏不存在');
    }

    return this.prisma.favorite.delete({
      where: { userId_shopId: { userId, shopId } },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: {
        shop: {
          include: { services: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async isFavorite(userId: string, shopId: string): Promise<boolean> {
    const favorite = await this.prisma.favorite.findUnique({
      where: { userId_shopId: { userId, shopId } },
    });
    return !!favorite;
  }
}
