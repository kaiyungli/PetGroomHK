import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.service.create({ data });
  }

  async findByShop(shopId: string) {
    return this.prisma.service.findMany({
      where: { shopId, isActive: true },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.service.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.service.delete({ where: { id } });
  }
}
