# 🐾 PetGroom HK

香港寵物美容平台 - 幫助寵物主人快速找到合適的美容店家

## 📊 專案狀態

**當前階段**：第 1 週 - 後端 API 開發 ✅ 完成

### 完成事項
- [x] 後端 API 框架（NestJS）
- [x] 用戶認證（JWT）
- [x] 店家 CRUD API
- [x] 搜尋與篩選
- [x] 收藏功能
- [x] 評論系統
- [x] 數據庫 Schema（Prisma）

### 待完成
- [ ] 前端 Web 開發
- [ ] 部署上線
- [ ] 數據填充
- [ ] 測試

## 📁 專案結構

```
petgroom-hk/
├── README.md                      # 專案總覽
├── backend/                       # 🐾 後端 API
│   ├── README.md                  # API 文檔
│   ├── package.json               # 依賴配置
│   ├── tsconfig.json             # TypeScript 配置
│   ├── nest-cli.json             # NestJS 配置
│   ├── src/
│   │   ├── main.ts              # 入口文件
│   │   ├── app.module.ts        # 主模組
│   │   ├── prisma/              # 數據庫模組
│   │   └── modules/              # 功能模組
│   │       ├── auth/             # 認證（登入/註冊）
│   │       ├── users/             # 用戶
│   │       ├── shops/             # 店家
│   │       ├── services/          # 服務
│   │       ├── reviews/           # 評論
│   │       └── favorites/         # 收藏
│   └── prisma/
│       └── schema.prisma         # 數據庫 Schema
├── web/                           # 🐾 前端 Web
│   ├── PROTOTYPE.md              # 原型說明
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── pages/
│       │   ├── index.js          # 首頁
│       │   └── _app.js
│       └── styles/
│           └── globals.css
└── data/
    └── processed/shops.json       # 127間店家資料
```

## 🚀 快速啟動

### 後端
```bash
cd backend
npm install
cp .env.example .env
# 編輯 .env 填入 DATABASE_URL
npm run prisma:generate
npm run prisma:migrate
npm run start:dev
```

### 前端
```bash
cd web
npm install
npm run dev
```

## 📚 API 文檔

啟動後端後訪問：`http://localhost:3000/api/docs`

## 📈 數據統計

| 指標 | 數值 |
|------|------|
| 總店家數 | 127 間 |
| API Endpoints | 20+ |
| 數據表 | 6 張 |

---

*最後更新：2026-02-08*
*版本：v1.0.0*
