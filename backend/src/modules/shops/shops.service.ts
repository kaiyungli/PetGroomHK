import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, Shop } from '@prisma/client';

@Injectable()
export class ShopsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ShopCreateInput): Promise<Shop> {
    return this.prisma.shop.create({
      data,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    search?: string;
    district?: string;
    petType?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
  }): Promise<{ shops: Shop[]; total: number }> {
    const { skip = 0, take = 20, search, district, sortBy = 'rating', order = 'desc' } = params;

    const where: Prisma.ShopWhereInput = {
      isActive: true,
      ...(district && district !== '全港' && {
        OR: [
          { district: { contains: district, mode: 'insensitive' } },
          { districtCn: { contains: district, mode: 'insensitive' } },
        ],
      }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { address: { contains: search, mode: 'insensitive' } },
          { services: { some: { name: { contains: search, mode: 'insensitive' } } } },
        ],
      }),
    };

    const [shops, total] = await Promise.all([
      this.prisma.shop.findMany({
        where,
        skip,
        take,
        orderBy: { [sortBy]: order },
        include: {
          services: true,
          _count: {
            select: { reviews: true, favorites: true },
          },
        },
      }),
      this.prisma.shop.count({ where }),
    ]);

    return { shops, total };
  }

  async findById(id: string): Promise<Shop | null> {
    return this.prisma.shop.findUnique({
      where: { id },
      include: {
        services: true,
        reviews: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { name: true, avatarUrl: true } } },
        },
        _count: {
          select: { reviews: true, favorites: true },
        },
      },
    });
  }

  async update(id: string, data: Prisma.ShopUpdateInput): Promise<Shop> {
    const shop = await this.prisma.shop.findUnique({ where: { id } });
    if (!shop) {
      throw new NotFoundException('店家不存在');
    }
    return this.prisma.shop.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    const shop = await this.prisma.shop.findUnique({ where: { id } });
    if (!shop) {
      throw new NotFoundException('店家不存在');
    }
    await this.prisma.shop.delete({ where: { id } });
  }

  async getDistricts(): Promise<string[]> {
    const shops = await this.prisma.shop.findMany({
      where: { isActive: true },
      select: { district: true, districtCn: true },
      distinct: ['district'],
    });
    return shops.map(s => s.district);
  }

  async seedShops(shops: any[]): Promise<void> {
    for (const shop of shops) {
      await this.prisma.shop.upsert({
        where: { id: shop.id },
        update: shop,
        create: shop,
      });
    }
  }
}
