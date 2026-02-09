# 🚀 PetGroom HK 部署指南

## 📋 部署清單

### 準備工作
- [ ] 確認程式碼已提交到 GitHub
- [ ] 申請 Railway 帳號
- [ ] 申請 Vercel 帳號
- [ ] 申請域名（可选）

---

## 🏗️ 步驟 1：部署後端（Railway）

### 1.1 安裝 Railway CLI

```bash
npm install -g @railway/cli
railway login
```

### 1.2 初始化專案

```bash
cd petgroom-hk/backend
railway init
```

### 1.3 添加 PostgreSQL

```bash
railway add postgresql
```

### 1.4 設定環境變數

```bash
railway variables set DATABASE_URL="$DATABASE_URL"
railway variables set JWT_SECRET="your-secure-secret-key"
railway variables set JWT_EXPIRES_IN="7d"
railway variables set NODE_ENV="production"
```

### 1.5 部署

```bash
railway up
```

### 1.6 驗證部署

```bash
# 檢查 logs
railway logs

# 測試 API
curl https://your-api.railway.app/api/v1/shops
```

---

## 🌐 步驟 2：部署前端（Vercel）

### 2.1 連接 GitHub

1. 登入 [Vercel](https://vercel.com)
2. Import GitHub Repository
3. 選擇 `petgroom-hk/web` 目錄

### 2.2 設定環境變數

在 Vercel Dashboard 中設定：

```
NEXT_PUBLIC_API_URL=https://your-api.railway.app/api/v1
```

### 2.3 部署

```
點擊 "Deploy"
```

---

## 🔗 步驟 3：設定域名（可選）

### Railway（API）
1. Railway Dashboard → Settings → Domains
2. 添加 `api.petgroomhk.com`

### Vercel（前端）
1. Vercel Dashboard → Settings → Domains
2. 添加 `petgroomhk.com`

---

## 📊 步驟 4：設定 API 文檔

API 文檔會自動部署到：
```
https://api.petgroomhk.com/api/docs
```

---

## 🧪 步驟 5：測試清單

### API 測試
```bash
# 測試店家列表
curl https://api.petgroomhk.com/api/v1/shops

# 測試搜尋
curl https://api.petgroomhk.com/api/v1/shops?district=銅鑼灣

# 測試店家詳情
curl https://api.petgroomhk.com/api/v1/shops/shop-001
```

### 前端測試
- [ ] 首頁正常載入
- [ ] 搜尋功能正常
- [ ] 地區篩選正常
- [ ] 店家詳情正常
- [ ] WhatsApp 跳轉正常

---

## 💰 成本估算

| 服務 | 免費額度 | 預估成本 |
|------|---------|----------|
| Railway | 500 小時/月 | $0-10/月 |
| Vercel | 100GB 流量/月 | $0/月 |
| PostgreSQL | 1GB | $0/月 |
| 域名 | - | $50/年 |

**合計：$0-10/月**

---

## 🔧 日常維護

### 更新程式
```bash
# 後端
git add .
git commit -m "Update"
git push
railway up

# 前端
cd ../web
git add .
git commit -m "Update"
git push
# Vercel 自動部署
```

### 備份數據
```bash
# Railway PostgreSQL 自動每日備份
```

---

## 🚨 問題解決

### Railway 部署失敗
```bash
# 檢查 logs
railway logs

# 常見問題：
# 1. 環境變數未設定
# 2. DATABASE_URL 格式錯誤
# 3. build 腳本錯誤
```

### CORS 錯誤
確保 `FRONTEND_URL` 設定正確

---

## 📞 緊急聯絡

| 問題 | 聯絡方式 |
|------|----------|
| API 故障 | 檢查 Railway logs |
| 前端故障 | 檢查 Vercel logs |
| 數據問題 | 檢查 PostgreSQL |

---

*最後更新：2026-02-08*
