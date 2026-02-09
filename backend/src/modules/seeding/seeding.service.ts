import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SeedingService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    // 開發環境自動填充數據
    if (process.env.NODE_ENV === 'development') {
      await this.seedShops();
    }
  }

  async seedShops() {
    const existingShops = await this.prisma.shop.count();
    if (existingShops > 0) {
      console.log(`✅ 數據庫已有 ${existingShops} 間店家，跳過填充`);
      return;
    }

    console.log('🌱 開始填充店家數據...');

    const shops = this.getSampleShops();

    for (const shop of shops) {
      await this.prisma.shop.upsert({
        where: { id: shop.id },
        update: shop,
        create: shop,
      });
    }

    console.log(`✅ 已填充 ${shops.length} 間店家`);
  }

  async seedAllData() {
    console.log('🌱 開始填充所有數據...');

    // 清空現有數據
    await this.prisma.review.deleteMany();
    await this.prisma.favorite.deleteMany();
    await this.prisma.booking.deleteMany();
    await this.prisma.service.deleteMany();
    await this.prisma.shop.deleteMany();
    await this.prisma.user.deleteMany();

    // 填充店家
    const shops = this.getSampleShops();
    for (const shop of shops) {
      await this.prisma.shop.create({ data: shop });
    }

    // 填充服務
    const services = this.getSampleServices();
    for (const service of services) {
      await this.prisma.service.create({ data: service });
    }

    // 填充評論
    const reviews = this.getSampleReviews();
    for (const review of reviews) {
      await this.prisma.review.create({ data: review });
    }

    console.log('✅ 數據填充完成！');
  }

  private getSampleShops() {
    return [
      {
        id: 'shop-001',
        name: 'Paw Palace',
        phone: '25763999',
        address: '香港銅鑼灣富明街1號寶富大樓4樓A室',
        district: 'Causeway Bay',
        districtCn: '銅鑼灣',
        rating: 4.8,
        reviewCount: 128,
        priceRange: '$300-800',
        isVerified: true,
        isActive: true,
        facebook: 'https://facebook.com/pawpalace',
        instagram: '@pawpalace_hk',
      },
      {
        id: 'shop-002',
        name: 'Paws In',
        phone: '55380168',
        address: '元朗鳳攸北街11-15號益發大廈地下3號鋪',
        district: 'Yuen Long',
        districtCn: '元朗',
        rating: 4.7,
        reviewCount: 95,
        priceRange: '$250-600',
        isVerified: true,
        isActive: true,
        website: 'https://pawsin.com.hk',
        facebook: 'https://facebook.com/pawsinhk',
        instagram: '@pawsin_hk',
      },
      {
        id: 'shop-003',
        name: 'Fluffy Little Things',
        phone: '23689833',
        address: '灣仔活道21號1樓B室',
        district: 'Wan Chai',
        districtCn: '灣仔',
        rating: 4.9,
        reviewCount: 156,
        priceRange: '$350-900',
        isVerified: true,
        isActive: true,
        website: 'https://fluffy.com.hk',
        facebook: 'https://facebook.com/FluffyLittleThingsHK',
        instagram: '@fluffy_little_things',
      },
      {
        id: 'shop-004',
        name: 'Ruff & Fetch',
        phone: '23480262',
        whatsapp: '66741567',
        address: '九龍佐敦官涌街7號',
        district: 'Jordan',
        districtCn: '佐敦',
        rating: 4.6,
        reviewCount: 203,
        priceRange: '$280-700',
        isVerified: true,
        isActive: true,
        website: 'https://ruffandfetch.com',
        facebook: 'https://facebook.com/RUFFANDFETCH',
        instagram: '@ruffandfetch',
      },
      {
        id: 'shop-005',
        name: 'Private i PETS',
        phone: '28773100',
        address: '銅鑼灣京士頓街9號Shop A',
        district: 'Causeway Bay',
        districtCn: '銅鑼灣',
        rating: 4.5,
        reviewCount: 89,
        priceRange: '$400-1000',
        isVerified: false,
        isActive: true,
        facebook: 'https://facebook.com/PrivateiConceptStore',
      },
      {
        id: 'shop-006',
        name: 'WOOF MAGIC',
        phone: '97478349',
        address: '西貢惠民路28號WM酒店LG樓C2B號舖',
        district: 'Sai Kung',
        districtCn: '西貢',
        rating: 4.7,
        reviewCount: 67,
        priceRange: '$350-850',
        isVerified: false,
        isActive: true,
        instagram: '@woofmagic_hk',
      },
      {
        id: 'shop-007',
        name: 'Dogotel & Spa',
        phone: '27110019',
        address: '旺角梭椏道11號地下A店',
        district: 'Mong Kok',
        districtCn: '旺角',
        rating: 4.4,
        reviewCount: 145,
        priceRange: '$300-750',
        isVerified: true,
        isActive: true,
        facebook: 'https://facebook.com/DOGOTELnSPA',
        instagram: '@dogotel',
      },
      {
        id: 'shop-008',
        name: 'Q-Pet',
        phone: '24050616',
        address: '荃灣享和街88號安豐大廈6號舖',
        district: 'Tsuen Wan',
        districtCn: '荃灣',
        rating: 4.3,
        reviewCount: 234,
        priceRange: '$200-500',
        isVerified: true,
        isActive: true,
        website: 'https://q-pets.com',
        facebook: 'https://facebook.com/qpetshk',
      },
    ];
  }

  private getSampleServices() {
    return [
      // Paw Palace 服務
      { shopId: 'shop-001', name: '基本洗澡', petType: 'both', priceMin: 150, priceMax: 250, durationMin: 45 },
      { shopId: 'shop-001', name: '全身美容', petType: 'dog', priceMin: 350, priceMax: 600, durationMin: 90 },
      { shopId: 'shop-001', name: '日本水療', petType: 'both', priceMin: 200, priceMax: 400, durationMin: 60 },
      
      // Paws In 服務
      { shopId: 'shop-002', name: '日式洗澡', petType: 'both', priceMin: 180, priceMax: 280, durationMin: 50 },
      { shopId: 'shop-002', name: '納米微泡SPA', petType: 'both', priceMin: 250, priceMax: 450, durationMin: 75 },
      
      // Fluffy Little Things 服務
      { shopId: 'shop-003', name: '按摩服務', petType: 'dog', priceMin: 100, priceMax: 200, durationMin: 30 },
      { shopId: 'shop-003', name: '全套美容', petType: 'both', priceMin: 400, priceMax: 800, durationMin: 120 },
      
      // Ruff & Fetch 服務
      { shopId: 'shop-004', name: '基本美容', petType: 'both', priceMin: 200, priceMax: 400, durationMin: 60 },
      { shopId: 'shop-004', name: '牛奶水療', petType: 'dog', priceMin: 180, priceMax: 350, durationMin: 45 },
      
      // Q-Pet 服務
      { shopId: 'shop-008', name: '快速洗澡', petType: 'both', priceMin: 120, priceMax: 200, durationMin: 30 },
      { shopId: 'shop-008', name: '美容套餐', petType: 'both', priceMin: 280, priceMax: 500, durationMin: 90 },
    ];
  }

  private getSampleReviews() {
    return [
      { shopId: 'shop-001', rating: 5, comment: '好正呀！師傅手勢好好狗狗好乖', petName: '旺旺', petType: 'dog', isApproved: true },
      { shopId: 'shop-001', rating: 4, comment: '環境唔錯，服務都ok', petName: '豆豆', petType: 'dog', isApproved: true },
      { shopId: 'shop-002', rating: 5, comment: '貓貓第一次沖涼都冇呷聲', petName: '奶茶', petType: 'cat', isApproved: true },
      { shopId: 'shop-003', rating: 5, comment: 'SPA好正，下次再嚟', petName: '妹妹', petType: 'dog', isApproved: true },
      { shopId: 'shop-004', rating: 4, comment: '地方幾大，狗狗有位走', petName: '波波', petType: 'dog', isApproved: true },
    ];
  }
}
