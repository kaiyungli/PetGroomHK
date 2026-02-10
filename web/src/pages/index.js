import { useState, useEffect, useMemo } from 'react';
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
const PRICE_RANGES = [{ label: '全部', value: 'all' }, { label: '$200 以下', value: 'cheap', min: 0, max: 200 }, { label: '$200-400', value: 'medium', min: 200, max: 400 }, { label: '$400 以上', value: 'expensive', min: 400, max: 9999 }];
const RATING_FILTERS = [{ label: '全部', value: 'all' }, { label: '⭐⭐⭐⭐⭐ 4.5以上', value: 4.5 }, { label: '⭐⭐⭐⭐ 4.0以上', value: 4.0 }, { label: '⭐⭐⭐ 3.5以上', value: 3.5 }];
const SORT_OPTIONS = [{ label: '評分最高', value: 'rating_desc' }, { label: '評分最低', value: 'rating_asc' }, { label: '價格最低', value: 'price_asc' }, { label: '價格最高', value: 'price_desc' }, { label: '最多評價', value: 'reviews_desc' }];
const HOT_TAGS = [{ label: '🔥 日本水療', type: 'service', value: '日本水療' }, { label: '🏆 銅鑼灣', type: 'district', value: '銅鑼灣' }, { label: '⭐ 4.8分以上', type: 'rating', value: 4.8 }, { label: '💆‍♀️ SPA', type: 'service', value: 'SPA' }, { label: '🐕 狗狗友善', type: 'service', value: '美容' }];

function Header({ onShowFavorites }) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-gray-800">🐾 PetGroom HK</Link>
        <div className="flex items-center gap-4">
          <Link href="/pets" className="flex items-center gap-2 text-gray-600 hover:text-purple-600">
            <span className="hidden sm:inline">我的寵物</span>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C13.1046 2 14 2.89543 14 4C14 5.10457 13.1046 6 12 6C10.8954 6 10 5.10457 10 4C10 2.89543 10.8954 2 12 2ZM18 4C18 2.89543 17.1046 2 16 2C14.8954 2 14 2.89543 14 4C14 5.10457 14.8954 6 16 6C17.1046 6 18 5.10457 18 4ZM6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6C5.10457 6 6 5.10457 6 4ZM19.5 9C20.8807 9 22 10.1193 22 11.5C22 12.8807 20.8807 14 19.5 14C18.1193 14 17 12.8807 17 11.5C17 10.1193 18.1193 9 19.5 9Z"/></svg>
          </Link>
          <button onClick={onShowFavorites} className="flex items-center gap-2 text-gray-600 hover:text-red-500">
            <span className="hidden sm:inline">收藏</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </button>
        </div>
      </div>
    </header>
  );
}

function SearchBar({ value, onChange, suggestions, onSelectSuggestion }) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  return (
    <div className="relative max-w-4xl mx-auto px-4 my-4">
      <div className="relative">
        <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <input type="text" placeholder="搜尋店家、服務，地區..." value={value} onChange={(e) => { onChange(e.target.value); setShowSuggestions(true); }} onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="w-full pl-12 pr-12 py-4 bg-white rounded-xl shadow-sm border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        {value && <button onClick={() => onChange('')} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">✕</button>}
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-4 right-4 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
          {suggestions.map((suggestion, index) => (
            <button key={index} onClick={() => { onSelectSuggestion(suggestion); setShowSuggestions(false); }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-500">{suggestion.type}：</span>
              <span className="font-medium text-gray-800">{suggestion.text}</span>
            </button>
          ))}
        </div>
      )}
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
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${selectedDistrict === district ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>{district}</button>
        ))}
        <button onClick={() => setIsExpanded(!isExpanded)} className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-gray-100 text-gray-600">{isExpanded ? '收起 ▲' : '更多 ▼'}</button>
      </div>
      {isExpanded && (
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4 space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">💰 價格範圍</h4>
            <div className="flex flex-wrap gap-2">
              {PRICE_RANGES.map((range) => (
                <button key={range.value} onClick={() => onSelectPrice(range.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition ${selectedPrice === range.value ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{range.label}</button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">⭐ 最低評分</h4>
            <div className="flex flex-wrap gap-2">
              {RATING_FILTERS.map((rating) => (
                <button key={rating.value} onClick={() => onSelectRating(rating.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition ${selectedRating === rating.value ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{rating.label}</button>
              ))}
            </div>
          </div>
          <div className="flex justify-end"><button onClick={onReset} className="text-sm text-gray-500 hover:text-gray-700">重置所有篩選</button></div>
        </div>
      )}
    </div>
  );
}

function SortDropdown({ value, onChange, count }) {
  return (
    <div className="max-w-4xl mx-auto px-4 mb-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">找到 {count} 間店家</span>
        <div className="relative">
          <select value={value} onChange={(e) => onChange(e.target.value)}
            className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            {SORT_OPTIONS.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}
          </select>
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">▼</span>
        </div>
      </div>
    </div>
  );
}

function HotTags({ onSelectTag }) {
  return (
    <div className="max-w-4xl mx-auto px-4 mb-4">
      <div className="flex flex-wrap gap-2">
        {HOT_TAGS.map((tag, index) => (
          <button key={index} onClick={() => onSelectTag(tag)}
            className="px-3 py-1.5 bg-gradient-to-r from-orange-50 to-red-50 text-orange-600 rounded-full text-sm hover:from-orange-100 hover:to-red-100 transition">{tag.label}</button>
        ))}
      </div>
    </div>
  );
}

function ShopCard({ shop, onClick }) {
  return (
    <div onClick={onClick} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
      <div className="flex">
        <img src={shop.image} alt={shop.name} className="w-32 h-36 object-cover" />
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-lg text-gray-800">{shop.name}</h3>
              <span className="bg-yellow-50 text-yellow-600 px-2 py-1 rounded text-sm font-medium">⭐ {shop.rating}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">📍 {shop.districtCn}</p>
            <p className="text-xs text-gray-400 mt-1 truncate">{shop.address}</p>
            <div className="flex items-center gap-2 mt-2"><span className="text-sm font-medium text-green-600">{shop.priceRange}</span></div>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {shop.services.slice(0, 3).map((service, index) => (
              <span key={index} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded">{service}</span>
            ))}
          </div>
        </div>
        <div className="flex items-center pr-4">
          <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </div>
      </div>
    </div>
  );
}

function AdBanner() {
  return (<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-4 text-center"><p className="text-yellow-700 font-medium">📢 廣告位</p><p className="text-yellow-600 text-sm">Google Ads</p></div>);
}

function WhatsAppButton({ phone, shopName }) {
  const handleClick = () => { const url = `https://wa.me/852${phone}?text=${encodeURIComponent(`你好，我想預約${shopName}的寵物美容服務，請問幾時有空？`)}`); window.open(url, '_blank'); };
  return (<button onClick={handleClick} className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-4 rounded-lg font-medium hover:bg-green-600 transition"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>WhatsApp 預約</button>);
}

function MapButton({ address }) {
  const handleClick = () => { window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank'); };
  return (<button onClick={handleClick} className="w-full flex items-center justify-center gap-2 bg-white border-2 border-blue-500 text-blue-500 py-4 rounded-lg font-medium hover:bg-blue-50 transition"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>查看地圖</button>);
}

function MapEmbed({ address }) {
  return (<div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100"><iframe src={`https://maps.google.com/maps?q=${encodeURIComponent(address + ', Hong Kong')}&t=&z=15&ie=UTF8&iwloc=&output=embed`} width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" title="Shop Location" /></div>);
}

function ShopModal({ shop, onClose }) {
  if (!shop) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 bg-white/80 rounded-full p-2"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
        <img src={shop.image} alt={shop.name} className="w-full h-64 object-cover" />
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div><h2 className="text-2xl font-bold text-gray-800">{shop.name}</h2><p className="text-gray-500 mt-1">⭐ {shop.rating} ({shop.reviewCount} 則評價)</p></div>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg font-medium">{shop.priceRange}</span>
          </div>
          <div className="space-y-3 mb-4">
            <div className="flex items-start gap-3"><svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg><p className="text-gray-600">{shop.address}</p></div>
            <div className="flex items-center gap-3"><svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg><p className="text-blue-600">{shop.phone}</p></div>
          </div>
          <div className="mb-4"><h3 className="font-semibold text-gray-800 mb-2">📍 地圖</h3><MapEmbed address={shop.address} /></div>
          <div className="mb-6"><h3 className="font-semibold text-gray-800 mb-3">提供的服務</h3><div className="flex flex-wrap gap-2">{shop.services.map((s, i) => (<span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-600 text-sm rounded-lg">{s}</span>))}</div></div>
          <div className="space-y-3"><WhatsAppButton phone={shop.phone} shopName={shop.name} /><MapButton address={shop.address} /></div>
        </div>
      </div>
    </div>
  );
}

function EmptyFavorites({ onGoHome }) {
  return (<div className="flex flex-col items-center justify-center py-16"><svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg><p className="text-gray-500 mb-4">還沒有收藏的店家</p><button onClick={onGoHome} className="text-blue-500 font-medium hover:underline">去探索店家 →</button></div>);
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

  const toggleFavorite = (e, shop) => { e.stopPropagation(); if (favorites.find(f => f.id === shop.id)) setFavorites(favorites.filter(f => f.id !== shop.id)); else setFavorites([...favorites, shop]); };
  const handleSelectSuggestion = (suggestion) => setSearchText(suggestion.text);
  const handleSelectHotTag = (tag) => { if (tag.type === 'district') setSelectedDistrict(tag.value); else if (tag.type === 'rating') setSelectedRating(tag.value.toString()); else if (tag.type === 'service') setSearchText(tag.value); };
  const handleReset = () => { setSelectedDistrict('全港'); setSelectedPrice('all'); setSelectedRating('all'); setSearchText(''); };

  return (
    <>
      <Head><title>🐾 PetGroom HK - 香港寵物美容平台</title><meta name="viewport" content="width=device-width, initial-scale=1" /></Head>
      <div className="min-h-screen bg-gray-50">
        <Header onShowFavorites={() => setShowFavorites(true)} />
        {!showFavorites ? (
          <>
            <SearchBar value={searchText} onChange={setSearchText} suggestions={searchSuggestions} onSelectSuggestion={handleSelectSuggestion} />
            <HotTags onSelectTag={handleSelectHotTag} />
            <FilterPanel selectedDistrict={selectedDistrict} onSelectDistrict={setSelectedDistrict} selectedPrice={selectedPrice} onSelectPrice={setSelectedPrice} selectedRating={selectedRating} onSelectRating={setSelectedRating} onReset={handleReset} />
            <SortDropdown value={sortBy} onChange={setSortBy} count={filteredAndSortedShops.length} />
          </>
        ) : (
          <div className="max-w-4xl mx-auto px-4 py-4"><button onClick={() => setShowFavorites(false)} className="flex items-center gap-2 text-gray-600 mb-4">← 返回首頁</button><h2 className="text-xl font-bold text-gray-800 mb-4">❤️ 我的收藏 ({favorites.length})</h2></div>
        )}
        <main className="max-w-4xl mx-auto px-4 pb-8">
          {showFavorites && favorites.length === 0 ? (<EmptyFavorites onGoHome={() => setShowFavorites(false)} />) : (
            <>
              {showFavorites ? null : <AdBanner />}
              <div className="space-y-4">
                {(showFavorites ? favorites : filteredAndSortedShops).map(shop => (
                  <div key={shop.id} onClick={() => setSelectedShop(shop)} className="relative">
                    <ShopCard shop={shop} onClick={() => setSelectedShop(shop)} />
                    <button onClick={(e) => toggleFavorite(e, shop)} className="absolute right-4 mt-2 p-2"><svg className={`w-6 h-6 ${favorites.find(f => f.id === shop.id) ? 'text-red-500 fill-current' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg></button>
                  </div>
                ))}
              </div>
              <p className="text-center text-gray-400 text-sm py-8">已顯示 {displayShops.length} 間店家</p>
            </>
          )}
        </main>
      </div>
      <ShopModal shop={selectedShop} onClose={() => setSelectedShop(null)} />
    </>
  );
}
