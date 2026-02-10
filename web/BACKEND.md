# PetGroom HK Backend Setup Guide

## 🚀 Vercel Postgres Setup

### 1. Install Vercel CLI
```bash
npm i -g vercel
vercel login
```

### 2. Create Postgres Database
```bash
vercel postgres create
```

### 3. Get Connection String
After creating the database, Vercel will provide a `POSTGRES_URL` environment variable.
You can view it in Vercel Dashboard:
- Go to Project → Settings → Environment Variables
- Or run: `vercel env pull`

### 4. Run Schema
Copy the contents of `src/lib/schema.sql` and run it in:
- Vercel Postgres Console (https://vercel.com/postgres)
- Or using psql: `psql "YOUR_CONNECTION_STRING" -f src/lib/schema.sql`

### 5. Deploy
```bash
vercel deploy --prod
```

## 📁 Files Created

```
web/src/
├── lib/
│   ├── db.js           # Database utilities
│   └── schema.sql      # Database schema
├── pages/api/
│   ├── shops/
│   │   ├── index.js    # GET /api/shops?search=...&district=...
│   │   └── [id].js     # GET /api/shops/[id]
│   └── users/
│       └── [device_id].js  # GET/PUT /api/users/[device_id]
```

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/shops` | List shops with filters |
| GET | `/api/shops/[id]` | Get shop details + reviews |
| GET | `/api/users/[device_id]` | Get user favorites |
| PUT | `/api/users/[device_id]` | Update user favorites |

### API Examples

```bash
# List all shops
curl https://pet-groom-hk.vercel.app/api/shops

# Search with filters
curl "https://pet-groom-hk.vercel.app/api/shops?district=銅鑼灣&rating=4.5&sort=rating_desc"

# Get shop details
curl https://pet-groom-hk.vercel.app/api/shops/1

# Get user favorites
curl https://pet-groom-hk.vercel.app/api/users/device-123

# Update favorites
curl -X PUT -H "Content-Type: application/json" \
  -d '{"favorites":[1,2,3]}' \
  https://pet-groom-hk.vercel.app/api/users/device-123
```

## ⚠️ Important Notes

1. **Environment Variables**: Make sure `POSTGRES_URL` is set in Vercel
2. **Cold Starts**: First request after deployment may be slow (database connection)
3. **Free Tier Limits**: 
   - 500MB database storage
   - 1GB bandwidth per month
   - Sufficient for MVP

## 📊 Database Schema

| Table | Description |
|-------|-------------|
| `shops` | 127 pet grooming shops |
| `reviews` | User reviews for shops |
| `users` | User preferences (favorites, pets) |

## 🔧 Development

For local development, use:
```bash
# Pull environment variables
vercel env pull

# Run locally with database
vercel dev
```

## 📝 To Do

- [ ] Run schema in Vercel Postgres Console
- [ ] Update frontend to fetch from API
- [ ] Add error handling for offline mode
- [ ] Add loading states
- [ ] Add retry logic for API calls
