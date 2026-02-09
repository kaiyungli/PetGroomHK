# 🐾 PetGroom HK Backend API

香港寵物美容平台 - 後端 API

## 📚 API 文檔

啟動後訪問：`http://localhost:3000/api/docs`

## 🔗 API Endpoints

### Auth (認證)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/auth/register | 用戶註冊 |
| POST | /api/v1/auth/login | 用戶登入 |
| GET | /api/v1/auth/me | 獲取當前用戶 |

### Users (用戶)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/users/me | 獲取當前用戶信息 |
| PUT | /api/v1/users/me | 更新用戶信息 |

### Shops (店家)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/shops | 獲取店家列表 |
| GET | /api/v1/shops/:id | 獲取店家詳情 |
| GET | /api/v1/shops/districts | 獲取所有地區 |
| POST | /api/v1/shops | 創建店家 |
| PUT | /api/v1/shops/:id | 更新店家 |
| DELETE | /api/v1/shops/:id | 刪除店家 |
| POST | /api/v1/shops/seed | 批量創建店家 |

### Services (服務)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/services/shop/:shopId | 獲取店家的服務 |
| POST | /api/v1/services | 創建服務 |
| PUT | /api/v1/services/:id | 更新服務 |
| DELETE | /api/v1/services/:id | 刪除服務 |

### Reviews (評論)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/reviews/shop/:shopId | 獲取店家的評論 |
| POST | /api/v1/reviews | 創建評論 |
| POST | /api/v1/reviews/:id/approve | 審核通過評論 |

### Favorites (收藏)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/favorites | 獲取我的收藏 |
| POST | /api/v1/favorites/:shopId | 收藏店家 |
| DELETE | /api/v1/favorites/:shopId | 取消收藏 |
| GET | /api/v1/favorites/:shopId/check | 檢查是否已收藏 |

## 🚀 啟動方式

```bash
# 安裝依賴
npm install

# 複製環境變數
cp .env.example .env
# 編輯 .env 填入數據庫連接

# 生成 Prisma Client
npm run prisma:generate

# 創建數據庫表
npm run prisma:migrate

# 啟動開發伺服器
npm run start:dev
```

## 📦 技術栈

- **框架**: NestJS 10
- **數據庫**: PostgreSQL + Prisma
- **認證**: JWT + Passport
- **API 文檔**: Swagger
- **部署**: Railway / Render

## 📁 專案結構

```
backend/
├── src/
│   ├── main.ts                    # 入口文件
│   ├── app.module.ts              # 主模組
│   ├── modules/
│   │   ├── auth/                  # 認證模組
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── dto/               # 數據傳輸對象
│   │   │   ├── strategies/       # JWT 策略
│   │   │   └── guards/            # 守衛
│   │   ├── users/                 # 用戶模組
│   │   ├── shops/                 # 店家模組
│   │   ├── services/              # 服務模組
│   │   ├── reviews/               # 評論模組
│   │   └── favorites/             # 收藏模組
│   └── prisma/
│       ├── prisma.module.ts
│       └── prisma.service.ts
└── prisma/
    └── schema.prisma             # 數據庫 Schema
```

---

*最後更新: 2026-02-08*
*版本: v1.0*
