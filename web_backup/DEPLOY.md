# 🚀 Vercel 部署指引

## 方法一：Vercel 網頁部署（推薦）

### 步驟 1：上傳程式碼到 GitHub

```bash
# 在 GitHub 建立新 repository
# 例如：petgroom-hk

cd /root/.openclaw/workspace/petgroom-hk/web

# 初始化 git
git init
git add .
git commit -m "Initial commit: PetGroom HK Web Prototype"
git branch -M main
git remote add origin https://github.com/你的用戶名/petgroom-hk-web.git
git push -u origin main
```

### 步驟 2：連接到 Vercel

1. 打開 [Vercel](https://vercel.com)
2. 點擊 **"Add New..."** → **"Project"**
3. 選擇 **"Import Git Repository"**
4. 選擇你的 `petgroom-hk-web` repository
5. 設定如下：

```
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
```

6. 點擊 **"Deploy"**

### 步驟 3：取得網址

部署完成後，你會獲得一個網址，例如：
```
https://petgroom-hk-web.vercel.app
```

用手機瀏覽這個網址即可測試！

---

## 方法二：本地部署測試

### 在電腦運行

```bash
cd web
npm install
npm run dev
```

### 在手機測試

1. 確保手機和電腦連接同一 Wi-Fi
2. 取得電腦 IP 地址：
   ```bash
   # Mac
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # Windows
   ipconfig
   ```
3. 手機瀏覽器打開：
   ```
   http://你的電腦IP:3000
   ```

例如：`http://192.168.1.100:3000`

---

## 🌐 部署後的網址格式

| 環境 | 網址格式 |
|------|----------|
| 開發環境 | `http://localhost:3000` |
| Vercel | `https://petgroom-hk-web.vercel.app` |

---

## 📱 手機測試項目

| 項目 | 檢查內容 |
|------|----------|
| 首頁載入 | 搜尋框、篩選、店家列表 |
| 搜尋功能 | 輸入關鍵字是否正常篩選 |
| 點擊店家 | 是否彈出詳情 Modal |
| WhatsApp | 按鈕是否正常跳轉 |
| 收藏功能 | 是否正常添加/移除 |

---

## 🔧 常見問題

### Q: 部署後樣式錯亂？
A: 確認 `npm install` 已完成，並重新部署

### Q: API 無法連接？
A: 這是預期行為，原型使用模擬數據，API 連接需要部署後端

### Q: 如何更新？
A: 
```bash
git add .
git commit -m "Update"
git push
# Vercel 會自動重新部署
```

---

*最後更新：2026-02-08*
