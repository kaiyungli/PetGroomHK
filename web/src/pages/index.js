import { useState, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const SAMPLE_SHOPS = [
  { id: '1', name: 'Paw Palace', district: 'Causeway Bay', districtCn: '銅鑼灣', phone: '2576 3999', address: '香港銅鑼灣富明街1號寶富大樓4樓A室', rating: 4.8, reviewCount: 128, priceRange: '$300-800', priceMin: 300, priceMax: 800, services: ['日本水療', '寵物美容', '精品店'], image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400' },
  { id: '2', name: 'Paws In', district: 'Yuen Long', districtCn: '元朗', phone: '5538 0168', address: '元朗鳳攸北街11-15號益發大廈地下3號鋪', rating: 4.7, reviewCount: 95, priceRange: '$250-600', priceMin: 250, priceMax: 600, services: ['日式美容', 'SPA', '納米微泡'], image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400' },
  { id: '3', name: 'Fluffy Little Things', district: 'Wan Chai', districtCn: '灣仔', phone: '2368 9833', address: '灣仔活道21號1樓B室', rating: 4.9, reviewCount: 156, priceRange: '$350-900', priceMin: 350, priceMax: 900, services: ['按摩', '水療', '日托服務'], image: 'https://images.unsplash.com/photo-1591768575198-ad40e1715d53?w=400' },
  { id: '4', name: 'Ruff & Fetch', district: 'Jordan', districtCn: '佐敦', phone: '2348 0262', whatsapp: '6674 1567', address: '九龍佐敦官涌街7號', rating: 4.6, reviewCount: 203, priceRange: '$280-700', priceMin: 280, priceMax: 700, services: ['美容', '託管', '水療'], image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400' },
  { id: '5', name: 'Private i PETS', district: 'Causeway Bay', districtCn: '銅鑼灣', phone: '2877 3100', address: '銅鑼灣京士頓街9號Shop A', rating: 4.5, reviewCount: 89, priceRange: '$400-1000', priceMin: 400, priceMax: 1000, services: ['人寵共融', '游泳池', '診所'], image: 'https://images.unsplash.com/photo-1599148400620-8e1ff0bf28a8?w=400' },
  { id: '6', name: 'WOOF MAGIC', district: 'Sai Kung', districtCn: '西貢', phone: '9747 8349', address: '西貢惠民路28號WM酒店LG樓C2B號舖', rating: 4.7, reviewCount: 67, priceRange: '$350-850', priceMin: 350, priceMax: 850, services: ['美容', '派對租場', '寵物用品'], image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400' },
  { id: '7', name: 'Dogotel & Spa', district: 'Mong Kok', districtCn: '旺角', phone: '2711 0019', address: '旺角梭椏道11號地下A店', rating: 4.4, reviewCount: 145, priceRange: '$300-750', priceMin: 300, priceMax: 750, services: ['美容', '日托', '住宿'], image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400' },
  { id: '8', name: 'Q-Pet', district: 'Tsuen Wan', districtCn: '荃灣', phone: '2405 0616', address: '荃灣享和街88號安豐大廈6號舖', rating: 4.3, reviewCount: 234, priceRange: '$200-500', priceMin: 200, priceMax: 500, services: ['美容', '用品', '透明玻璃設計'], image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400' },
];

const DISTRICTS = ['全港', '銅鑼灣', '旺角', '佐敦', '元朗', '荃灣', '沙田', '西貢', '灣仔', '太子', '荔枝角', '何文田', '土瓜灣', '北角', '觀塘'];
const PRICE_RANGES = [{ label: '全部', value: 'all' }, { label: '$200以下', value: 'cheap', min: 0, max: 200 }, { label: '$200-400', value: 'medium', min: 200, max: 400 }, { label: '$400以上', value: 'expensive', min: 400, max: 9999 }];
const RATING_FILTERS = [{ label: '全部', value: 'all' }, { label: '⭐4.5+', value: 4.5 }, { label: '⭐4.0+', value: 4.0 }, { label: '⭐3.5+', value: 3.5 }];
const SORT_OPTIONS = [{ label: '評分最高', value: 'rating_desc' }, { label: '評分最低', value: 'rating_asc' }, { label: '價格最低', value: 'price_asc' }, { label: '價格最高', value: 'price_desc' }, { label: '最多評價', value: 'reviews_desc' }];
const HOT_TAGS = [
  { label: '🔥 日本水療', type: 'service', value: '日本水療' },
  { label: '🏆 銅鑼灣', type: 'district', value: '銅鑼灣' },
  { label: '⭐ 4.8分', type: 'rating', value: 4.8 },
  { label: '💆‍♀️ SPA', type: 'service', value: 'SPA' },
  { label: '🐕 美容', type: 'service', value: '美容' }
];
const SERVICE_CATEGORIES = [
  { icon: '🛁', name: '日本水療', color: 'from-purple-500 to-purple-600' },
  { icon: '💆‍♀️', name: 'SPA 按摩', color: 'from-pink-500 to-pink-600' },
  { icon: '✂️', name: '美容修剪', color: 'from-blue-500 to-blue-600' },
  { icon: '🏊', name: '游泳池', color: 'from-cyan-500 to-cyan-600' },
];
const WHY_US = [
  { icon: '💰', title: '透明價格', desc: '清楚列明收費，唔怕被呃錢' },
  { icon: '📱', title: 'WhatsApp 預約', desc: '唔洗打電話，最啱怕傾電話嘅你' },
  { icon: '⭐', title: '真實評價', desc: '用家真實體驗，揀啱先預約' },
  { icon: '🐾', title: '寵物檔案', desc: '記錄毛孩喜好，下次預約更方便' },
];

const TESTIMONIALS = [
  { name: 'Coco 媽', avatar: '👩', rating: 5, text: '好方便！一set就搵到附近嘅寵物美容店' },
  { name: '阿明', avatar: '👨', rating: 5, text: '價格透明，唔洗逐間打電話問' },
  { name: 'Sonia', avatar: '👩‍🦰', rating: 5, text: '我家主子好怕陌生環境，但呢度既店家好有愛心' },
];
const SERVICE_COLORS = {
  '日本水療': 'bg-purple-100 text-purple-700 border-purple-200',
  '寵物美容': 'bg-pink-100 text-pink-700 border-pink-200',
  'SPA': 'bg-blue-100 text-blue-700 border-blue-200',
  '按摩': 'bg-orange-100 text-orange-700 border-orange-200',
  '水療': 'bg-cyan-100 text-cyan-700 border-cyan-200',
  '美容': 'bg-pink-100 text-pink-700 border-pink-200',
  '日托服務': 'bg-green-100 text-green-700 border-green-200',
  '託管': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  '游泳池': 'bg-blue-100 text-blue-700 border-blue-200',
  '診所': 'bg-red-100 text-red-700 border-red-200',
  '派對租場': 'bg-purple-100 text-purple-700 border-purple-200',
  '寵物用品': 'bg-orange-100 text-orange-700 border-orange-200',
  '日托': 'bg-green-100 text-green-700 border-green-200',
  '住宿': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  '用品': 'bg-gray-100 text-gray-700 border-gray-200',
  '精品店': 'bg-amber-100 text-amber-700 border-amber-200',
  '納米微泡': 'bg-sky-100 text-sky-700 border-sky-200',
  '人寵共融': 'bg-pink-100 text-pink-700 border-pink-200',
};

function Header({ onShowFavorites }) {
  return (
    <header className="bg-gradient-to-r from-purple-600 to-violet-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="text-3xl">🐾</span>
          <span className="hidden sm:inline bg-white/20 px-3 py-1 rounded-full text-sm">PetGroom HK</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/pets" className="flex items-center gap-2 text-white/90 hover:text-white bg-white/10 px-3 py-2 rounded-full transition-all hover:bg-white/20">
            <span className="hidden sm:inline text-sm font-medium">我的寵物</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C13.1046 2 14 2.89543 14 4C14 5.10457 13.1046 6 12 6C10.8954 6 10 5.10457 10 4C10 2.89543 10.8954 2 12 2ZM18 4C18 2.89543 17.1046 2 16 2C14.8954 2 14 2.89543 14 4C14 5.10457 14.8954 6 16 6C17.1046 6 18 5.10457 18 4ZM6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6C5.10457 6 6 5.10457 6 4Z"/></svg>
          </Link>
          <button onClick={onShowFavorites} className="flex items-center gap-2 text-white/90 hover:text-white bg-white/10 px-3 py-2 rounded-full transition-all hover:bg-white/20">
            <span className="hidden sm:inline text-sm font-medium">收藏</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero({ onSearchFocus }) {
  return (
    <div className="relative bg-gradient-to-br from-purple-600 via-violet-600 to-purple-800 overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-pink-400 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      </div>
      <div className="relative max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-2 mb-6">
          <span className="text-2xl">🐕</span>
          <span className="text-white/90 text-sm font-medium">香港 No.1 寵物美容平台</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
          為毛孩搵最好嘅<br />
          <span className="text-yellow-300">美容服務 💆‍♀️</span>
        </h1>
        <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
          透明價格 • WhatsApp 預約 • 真實評價<br />
          一 App 搞掂毛孩美容大小事
        </p>
        <div className="relative max-w-2xl mx-auto" onClick={onSearchFocus}>
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-2xl blur opacity-30"></div>
          <div className="relative flex items-center bg-white rounded-2xl shadow-2xl p-2">
            <svg className="w-6 h-6 text-purple-400 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="搜尋地區、服務、店家名稱..." 
              className="flex-1 py-3 px-3 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 text-lg" />
            <button className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all">
              搜尋
            </button>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <span className="text-white/70 text-sm">🔥 熱門：</span>
          <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-white/30 transition">銅鑼灣</span>
          <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-white/30 transition">日本水療</span>
          <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-white/30 transition">SPA</span>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
    </div>
  );
}

function StatsBar() {
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-purple-600">127+</span>
            <span className="text-gray-500 text-sm mt-1">間合作店鋪</span>
          </div>
          <div className="flex flex-col items-center border-l border-r border-gray-100">
            <span className="text-3xl font-bold text-purple-600">5,000+</span>
            <span className="text-gray-500 text-sm mt-1">用戶評價</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-purple-600">18+</span>
            <span className="text-gray-500 text-sm mt-1">個地區覆蓋</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function WhyUsSection() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">點解用 PetGroom HK？</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {WHY_US.map((item, index) => (
          <div key={index} className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 text-center">
            <span className="text-4xl mb-3 block">{item.icon}</span>
            <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
            <p className="text-gray-500 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ServiceCategories({ onSelectCategory }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-xl font-bold text-gray-800 mb-6">熱門服務類型</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {SERVICE_CATEGORIES.map((cat, index) => (
          <button key={index} onClick={() => onSelectCategory(cat.name)}
            className={`relative overflow-hidden rounded-2xl p-6 text-white text-left hover:scale-105 transition-all shadow-lg`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-90`}></div>
            <div className="relative">
              <span className="text-4xl mb-2 block">{cat.icon}</span>
              <span className="font-bold text-lg">{cat.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function TopShopsSection({ shops, onShopClick }) {
  const topShops = [...shops].sort((a, b) => b.rating - a.rating).slice(0, 3);
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">🏆 熱門店家 TOP 3</h2>
        <button className="text-purple-600 text-sm font-medium hover:underline">查看全部 →</button>
      </div>
      <div className="grid gap-4">
        {topShops.map((shop, index) => (
          <div key={shop.id} onClick={() => onShopClick(shop)}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0">
                <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {index + 1}
                </div>
              </div>
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-lg text-gray-800">{shop.name}</h3>
                    <span className="flex items-center gap-1 bg-yellow-50 text-yellow-600 px-2 py-1 rounded-lg text-sm font-medium">
                      ⭐ {shop.rating}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">📍 {shop.districtCn}</p>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {shop.services.slice(0, 2).map((s, i) => (
                    <span key={i} className="px-2 py-0.5 bg-purple-50 text-purple-600 text-xs rounded-full">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TestimonialsSection() {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 py-12 mt-8">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-xl font-bold text-gray-800 text-center mb-8">用戶點講？</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((item, index) => (
            <div key={index} className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{item.avatar}</span>
                <span className="font-medium text-gray-800">{item.name}</span>
              </div>
              <div className="flex gap-0.5 mb-2">
                {[...Array(item.rating)].map((_, i) => (<span key={i} className="text-yellow-400">⭐</span>))}
              </div>
              <p className="text-gray-600 text-sm">"{item.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SearchBar({ value, onChange, suggestions, onSelectSuggestion }) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  return (
    <div className="relative max-w-4xl mx-auto px-4 my-6">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
        <div className="relative flex items-center bg-white rounded-2xl shadow-lg border border-gray-100 focus-within:ring-2 focus-within:ring-purple-500/50 transition-all">
          <svg className="w-5 h-5 text-purple-400 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="搜尋店家、服務、地區..." value={value} onChange={(e) => { onChange(e.target.value); setShowSuggestions(true); }} onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full py-4 pr-12 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400" />
          {value && <button onClick={() => onChange('')} className="mr-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>}
        </div>
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-4 right-4 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
          {suggestions.map((suggestion, index) => (
            <button key={index} onClick={() => { onSelectSuggestion(suggestion); setShowSuggestions(false); }}
              className="w-full px-5 py-4 text-left hover:bg-purple-50 border-b border-gray-50 last:border-0 transition-colors flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xs font-medium">{suggestion.type[0]}</span>
              <span className="font-medium text-gray-700">{suggestion.text}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function HotTags({ onSelectTag }) {
  return (
    <div className="max-w-4xl mx-auto px-4 mb-4">
      <div className="flex flex-wrap gap-2.5">
        {HOT_TAGS.map((tag, index) => (
          <button key={index} onClick={() => onSelectTag(tag)}
            className="px-4 py-2 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 text-orange-600 rounded-full text-sm font-medium hover:from-orange-100 hover:to-amber-100 hover:scale-105 transition-all shadow-sm active:scale-95">
            {tag.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function FilterPanel({ selectedDistrict, onSelectDistrict, selectedPrice, onSelectPrice, selectedRating, onSelectRating, onReset }) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="max-w-4xl mx-auto px-4 mb-4">
      <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
        {DISTRICTS.slice(0, 8).map((district) => (
          <button key={district} onClick={() => onSelectDistrict(district)}
            className={`px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all shadow-sm hover:shadow-md active:scale-95 ${
              selectedDistrict === district
                ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-purple-500/30 shadow-lg'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}>{district}</button>
        ))}
        <button onClick={() => setIsExpanded(!isExpanded)}
          className={`px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all shadow-sm ${
            isExpanded ? 'bg-gray-200 text-gray-700' : 'bg-white text-gray-600 border border-gray-200'
          }`}>{isExpanded ? '收起' : '更多'}</button>
      </div>
      {isExpanded && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 mb-4 space-y-5">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">💰</span>
              價格範圍
            </h4>
            <div className="flex flex-wrap gap-2">
              {PRICE_RANGES.map((range) => (
                <button key={range.value} onClick={() => onSelectPrice(range.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow-md active:scale-95 ${
                    selectedPrice === range.value
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-500/30'
                      : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}>{range.label}</button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">⭐</span>
              最低評分
            </h4>
            <div className="flex flex-wrap gap-2">
              {RATING_FILTERS.map((rating) => (
                <button key={rating.value} onClick={() => onSelectRating(rating.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow-md active:scale-95 ${
                    selectedRating === rating.value
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-yellow-500/30'
                      : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}>{rating.label}</button>
              ))}
            </div>
          </div>
          <div className="flex justify-end pt-2 border-t border-gray-100">
            <button onClick={onReset} className="text-sm text-gray-500 hover:text-purple-600 flex items-center gap-1 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              重置篩選
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SortDropdown({ value, onChange, count }) {
  return (
    <div className="max-w-4xl mx-auto px-4 mb-4">
      <div className="flex items-center justify-between bg-white/80 backdrop-blur rounded-xl px-4 py-3 shadow-sm">
        <span className="text-sm text-gray-500">找到 <span className="font-semibold text-purple-600">{count}</span> 間優質店家</span>
        <div className="relative">
          <select value={value} onChange={(e) => onChange(e.target.value)}
            className="appearance-none bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-xl px-4 py-2 pr-10 text-sm font-medium text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-pointer hover:shadow-md transition-all">
            {SORT_OPTIONS.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}
          </select>
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 pointer-events-none">▼</span>
        </div>
      </div>
    </div>
  );
}

function ShopCard({ shop, isFavorite, onClick, onToggleFavorite }) {
  return (
    <div onClick={onClick} className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group">
      <div className="flex">
        <div className="relative w-32 h-36 sm:w-40 sm:h-40 flex-shrink-0">
          <img src={shop.image} alt={shop.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute top-2 left-2 bg-white/95 backdrop-blur rounded-full px-2 py-1 shadow-md flex items-center gap-1">
            <span className="text-yellow-500 text-xs">⭐</span>
            <span className="text-xs font-bold text-gray-800">{shop.rating}</span>
          </div>
        </div>
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-lg text-gray-800 group-hover:text-purple-600 transition-colors">{shop.name}</h3>
              <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap border border-green-200">{shop.priceRange}</span>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-gray-400 text-sm">📍</span>
              <span className="text-sm text-gray-500">{shop.districtCn}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {shop.services.slice(0, 4).map((service, index) => (
              <span key={index} className={`px-2.5 py-1 rounded-full text-xs font-medium border ${SERVICE_COLORS[service] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                {service}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center pr-4">
          <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }} className="p-2 rounded-full hover:bg-gray-100 transition-all active:scale-90">
            <svg className={`w-7 h-7 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function AdBanner() {
  return (
    <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-5 my-4 text-center shadow-lg">
      <p className="text-white font-bold text-lg mb-1">📢 廣告位招募</p>
      <p className="text-white/90 text-sm">與我們合作，推廣您的寵物服務</p>
    </div>
  );
}

function WhatsAppButton({ phone, shopName }) {
  const handleClick = () => {
    const message = `你好，我想預約${shopName}的寵物美容服務，請問幾時有空？`;
    const url = `https://wa.me/852${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };
  return (
    <button onClick={handleClick} className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg shadow-green-500/30 active:scale-[0.98]">
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      WhatsApp 預約
    </button>
  );
}

function MapButton({ address }) {
  const handleClick = () => { window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank'); };
  return (
    <button onClick={handleClick} className="w-full flex items-center justify-center gap-2.5 bg-white border-2 border-purple-500 text-purple-600 py-4 rounded-xl font-semibold hover:bg-purple-50 transition-all active:scale-[0.98]">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
      查看地圖
    </button>
  );
}

function MapEmbed({ address }) {
  const encodedAddress = encodeURIComponent(address + ', Hong Kong');
  return (
    <div className="w-full h-56 rounded-2xl overflow-hidden shadow-md bg-gray-100">
      <iframe src={`https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`} width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" title="Shop Location" className="w-full h-full" />
    </div>
  );
}

function ShopModal({ shop, onClose }) {
  if (!shop) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur rounded-full p-2 shadow-lg hover:bg-gray-100 transition-all active:scale-90">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <div className="relative h-64">
          <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 pt-20">
            <h2 className="text-2xl font-bold text-white">{shop.name}</h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="flex items-center gap-1 bg-yellow-500 text-white px-2.5 py-1 rounded-full text-sm font-bold">⭐ {shop.rating}</span>
              <span className="text-white/90 text-sm">{shop.reviewCount} 則評價</span>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
              <span className="text-sm">{shop.districtCn}</span>
            </div>
            <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-semibold border border-green-200">{shop.priceRange}</span>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
              <p className="text-gray-600 text-sm">{shop.address}</p>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              <p className="text-purple-600 font-medium">{shop.phone}</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">✨</span>
              提供的服務
            </h3>
            <div className="flex flex-wrap gap-2">
              {shop.services.map((s, i) => (
                <span key={i} className={`px-3 py-1.5 rounded-full text-sm font-medium border ${SERVICE_COLORS[s] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>{s}</span>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">📍 地圖</h3>
            <MapEmbed address={shop.address} />
          </div>
          <div className="space-y-3">
            <WhatsAppButton phone={shop.phone} shopName={shop.name} />
            <MapButton address={shop.address} />
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyFavorites({ onGoHome }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
      </div>
      <p className="text-gray-500 mb-4 text-center">還沒有收藏的店家</p>
      <button onClick={onGoHome} className="text-purple-600 font-medium hover:underline flex items-center gap-1">
        去探索店家 →
      </button>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🐾</span>
              <span className="font-bold text-lg">PetGroom HK</span>
            </div>
            <p className="text-gray-400 text-sm">香港 No.1 寵物美容平台<br />為毛孩搵最好嘅服務</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">快速連結</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition">首頁</a></li>
              <li><a href="#" className="hover:text-white transition">所有店家</a></li>
              <li><a href="/pets" className="hover:text-white transition">我的寵物</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">聯絡我們</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>📧 hello@petgroom.hk</li>
              <li>📱 +852 1234 5678</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          <p>© 2026 PetGroom HK. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  const [searchText, setSearchText] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('全港');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [sortBy, setSortBy] = useState('rating_desc');
  const [selectedShop, setSelectedShop] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [shops] = useState(SAMPLE_SHOPS);

  const searchSuggestions = useMemo(() => {
    if (!searchText || searchText.length < 1) return [];
    const suggestions = [];
    SAMPLE_SHOPS.forEach(shop => { if (shop.name.toLowerCase().includes(searchText.toLowerCase())) suggestions.push({ type: '店家', text: shop.name }); });
    DISTRICTS.forEach(d => { if (d.includes(searchText)) suggestions.push({ type: '地區', text: d }); });
    [...new Set(SAMPLE_SHOPS.flatMap(s => s.services))].forEach(s => { if (s.includes(searchText)) suggestions.push({ type: '服務', text: s }); });
    return suggestions.slice(0, 5);
  }, [searchText]);

  const filteredAndSortedShops = useMemo(() => {
    let result = [...shops];
    if (searchText) { const lower = searchText.toLowerCase(); result = result.filter(shop => shop.name.toLowerCase().includes(lower) || shop.districtCn.includes(searchText) || shop.services.some(s => s.includes(searchText))); }
    if (selectedDistrict !== '全港') result = result.filter(shop => shop.districtCn === selectedDistrict || shop.district === selectedDistrict);
    if (selectedPrice !== 'all') { const range = PRICE_RANGES.find(r => r.value === selectedPrice); if (range) result = result.filter(shop => shop.priceMin >= range.min && shop.priceMax <= range.max); }
    if (selectedRating !== 'all') { const minRating = parseFloat(selectedRating); result = result.filter(shop => shop.rating >= minRating); }
    result.sort((a, b) => { switch (sortBy) { case 'rating_desc': return b.rating - a.rating; case 'rating_asc': return a.rating - b.rating; case 'price_asc': return a.priceMin - b.priceMin; case 'price_desc': return b.priceMin - a.priceMin; case 'reviews_desc': return b.reviewCount - a.reviewCount; default: return 0; } });
    return result;
  }, [shops, searchText, selectedDistrict, selectedPrice, selectedRating, sortBy]);

  const displayShops = showFavorites ? favorites : filteredAndSortedShops;

  const toggleFavorite = (shop) => {
    if (favorites.find(f => f.id === shop.id)) setFavorites(favorites.filter(f => f.id !== shop.id));
    else setFavorites([...favorites, shop]);
  };

  const handleSelectSuggestion = (suggestion) => setSearchText(suggestion.text);
  const handleSelectHotTag = (tag) => {
    if (tag.type === 'district') setSelectedDistrict(tag.value);
    else if (tag.type === 'rating') setSelectedRating(tag.value.toString());
    else if (tag.type === 'service') setSearchText(tag.value);
  };
  const handleSelectCategory = (name) => setSearchText(name);
  const handleReset = () => { setSelectedDistrict('全港'); setSelectedPrice('all'); setSelectedRating('all'); setSearchText(''); };

  return (
    <>
      <Head>
        <title>🐾 PetGroom HK - 香港寵物美容平台</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="尋找香港最佳寵物美容服務，一鍵 WhatsApp 預約" />
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header onShowFavorites={() => setShowFavorites(true)} />
        {!showFavorites ? (
          <>
            <Hero onSearchFocus={() => document.querySelector('input[type="text"]')?.focus()} />
            <WhyUsSection />
            <StatsBar />
            <ServiceCategories onSelectCategory={handleSelectCategory} />
            {!searchText && <TopShopsSection shops={shops} onShopClick={setSelectedShop} />}
            {!searchText && <TestimonialsSection />}
            <SearchBar value={searchText} onChange={setSearchText} suggestions={searchSuggestions} onSelectSuggestion={handleSelectSuggestion} />
            <HotTags onSelectTag={handleSelectHotTag} />
            <FilterPanel selectedDistrict={selectedDistrict} onSelectDistrict={setSelectedDistrict} selectedPrice={selectedPrice} onSelectPrice={setSelectedPrice} selectedRating={selectedRating} onSelectRating={setSelectedRating} onReset={handleReset} />
            <SortDropdown value={sortBy} onChange={setSortBy} count={filteredAndSortedShops.length} />
          </>
        ) : (
          <div className="max-w-4xl mx-auto px-4 py-4">
            <button onClick={() => setShowFavorites(false)} className="flex items-center gap-2 text-gray-600 mb-4 hover:text-purple-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              返回首頁
            </button>
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-red-500">❤️</span>
              我的收藏 ({favorites.length})
            </h2>
          </div>
        )}
        <main className="max-w-4xl mx-auto px-4 pb-8">
          {showFavorites && favorites.length === 0 ? (<EmptyFavorites onGoHome={() => setShowFavorites(false)} />) : (
            <>
              {!showFavorites && <AdBanner />}
              <div className="space-y-4">
                {displayShops.map(shop => (
                  <ShopCard key={shop.id} shop={shop} isFavorite={favorites.some(f => f.id === shop.id)} onClick={() => setSelectedShop(shop)} onToggleFavorite={() => toggleFavorite(shop)} />
                ))}
              </div>
              {displayShops.length > 0 && (
                <p className="text-center text-gray-400 text-sm py-8 flex items-center justify-center gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  已顯示 {displayShops.length} 間店家
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                </p>
              )}
            </>
          )}
        </main>
        <Footer />
      </div>
      <ShopModal shop={selectedShop} onClose={() => setSelectedShop(null)} />
    </>
  );
}