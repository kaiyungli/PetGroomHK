-- PetGroom HK Database Schema
-- Generated: 2026-02-10

-- Shops table
CREATE TABLE shops (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_cn VARCHAR(255),
    district VARCHAR(100),
    district_cn VARCHAR(100),
    phone VARCHAR(50),
    whatsapp VARCHAR(50),
    address TEXT,
    rating DECIMAL(2,1),
    review_count INTEGER,
    price_min INTEGER,
    price_max INTEGER,
    price_range VARCHAR(50),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    opening_hours VARCHAR(100),
    is_24hours BOOLEAN DEFAULT FALSE,
    image_url TEXT,
    services TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_shops_district ON shops(district);
CREATE INDEX idx_shops_rating ON shops(rating DESC);
CREATE INDEX idx_shops_price ON shops(price_min, price_max);

-- Reviews table
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    shop_id INTEGER REFERENCES shops(id),
    user_name VARCHAR(100),
    user_avatar VARCHAR(255),
    rating DECIMAL(2,1) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table (for favorites sync)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(255) UNIQUE,
    favorites JSONB DEFAULT '[]',
    pets JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data (8 shops)
INSERT INTO shops (name, name_cn, district, district_cn, phone, whatsapp, address, rating, review_count, price_min, price_max, price_range, latitude, longitude, opening_hours, is_24hours, image_url, services) VALUES
('Paw Palace', 'Paw Palace', 'Causeway Bay', '銅鑼灣', '2576 3999', NULL, '香港銅鑼灣富明街1號寶富大樓4樓A室', 4.8, 128, 300, 800, '$300-800', 22.2805, 114.1836, '10:00-20:00', FALSE, 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400', ARRAY['日本水療', '寵物美容', '精品店']),
('Paws In', 'Paws In', 'Yuen Long', '元朗', '5538 0168', NULL, '元朗鳳攸北街11-15號益發大廈地下3號鋪', 4.7, 95, 250, 600, '$250-600', 22.4446, 114.0224, '11:00-21:00', FALSE, 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400', ARRAY['日式美容', 'SPA', '納米微泡']),
('Fluffy Little Things', 'Fluffy Little Things', 'Wan Chai', '灣仔', '2368 9833', NULL, '灣仔活道21號1樓B室', 4.9, 156, 350, 900, '$350-900', 22.2793, 114.1718, '09:00-19:00', FALSE, 'https://images.unsplash.com/photo-1591768575198-ad40e1715d53?w=400', ARRAY['按摩', '水療', '日托服務']),
('Ruff & Fetch', 'Ruff & Fetch', 'Jordan', '佐敦', '2348 0262', '6674 1567', '九龍佐敦官涌街7號', 4.6, 203, 280, 700, '$280-700', 22.3050, 114.1718, '10:00-22:00', FALSE, 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400', ARRAY['美容', '託管', '水療']),
('Private i PETS', 'Private i PETS', 'Causeway Bay', '銅鑼灣', '2877 3100', NULL, '銅鑼灣京士頓街9號Shop A', 4.5, 89, 400, 1000, '$400-1000', 22.2783, 114.1822, '00:00-23:59', TRUE, 'https://images.unsplash.com/photo-1599148400620-8e1ff0bf28a8?w=400', ARRAY['人寵共融', '游泳池', '診所']),
('WOOF MAGIC', 'WOOF MAGIC', 'Sai Kung', '西貢', '9747 8349', NULL, '西貢惠民路28號WM酒店LG樓C2B號舖', 4.7, 67, 350, 850, '$350-850', 22.3841, 114.2703, '12:00-20:00', FALSE, 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400', ARRAY['美容', '派對租場', '寵物用品']),
('Dogotel & Spa', 'Dogotel & Spa', 'Mong Kok', '旺角', '2711 0019', NULL, '旺角梭椏道11號地下A店', 4.4, 145, 300, 750, '$300-750', 22.3193, 114.1694, '08:00-22:00', FALSE, 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400', ARRAY['美容', '日托', '住宿']),
('Q-Pet', 'Q-Pet', 'Tsuen Wan', '荃灣', '2405 0616', NULL, '荃灣享和街88號安豐大廈6號舖', 4.3, 234, 200, 500, '$200-500', 22.3738, 114.1133, '10:00-20:00', FALSE, 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400', ARRAY['美容', '用品', '透明玻璃設計']);

-- Insert sample reviews
INSERT INTO reviews (shop_id, user_name, user_avatar, rating, comment) VALUES
(1, 'Coco 媽', '👩', 5.0, '好方便！一set就搵到附近嘅寵物美容店'),
(1, '阿明', '👨', 4.5, '價錢合理，服务態度好好'),
(2, 'Sonia', '👩‍🦰', 5.0, '我家主子好怕陌生環境，但呢度既店家好有愛心'),
(3, 'John', '👨‍🦱', 4.8, '環境唔錯，毛仔好鍾意'),
(4, 'Mary', '👩', 4.5, '地理位置方便，價錢透明');
