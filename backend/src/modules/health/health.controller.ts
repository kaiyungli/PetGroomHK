import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('health')
@Controller()
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: '健康檢查' })
  async check() {
    // 檢查數據庫連接
    let dbStatus = 'unknown';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbStatus = 'healthy';
    } catch {
      dbStatus = 'unhealthy';
    }

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      services: {
        api: 'healthy',
        database: dbStatus,
      },
    };
  }

  @Get('live')
  @ApiOperation({ summary: 'Liveness Probe（K8s/容器用）' })
  async live() {
    return { status: 'alive' };
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness Probe（K8s/容器用）' })
  async ready() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'ready' };
    } catch {
      return { status: 'not ready' };
    }
  }
}
