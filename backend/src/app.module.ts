import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ShopsModule } from './modules/shops/shops.module';
import { ServicesModule } from './modules/services/services.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { SeedingModule } from './modules/seeding/seeding.module';

@Module({
  imports: [
    // 配置模組
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Prisma 數據庫
    PrismaModule,
    
    // 功能模組
    AuthModule,
    UsersModule,
    ShopsModule,
    ServicesModule,
    ReviewsModule,
    FavoritesModule,
    
    // 數據填充（僅開發環境）
    SeedingModule,
  ],
})
export class AppModule {}
