import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const STORAGE_KEY = 'petgroomhk_pets';

const PET_TYPES = {
  dog: { label: '狗狗', icon: '🐕' },
  cat: { label: '貓貓', icon: '🐈' },
  rabbit: { label: '兔仔', icon: '🐰' },
  hamster: { label: '倉鼠', icon: '🐹' },
  bird: { label: '雀鳥', icon: '🦜' },
  other: { label: '其他', icon: '🐾' },
};

const SERVICE_TYPES = [
  '基本洗澡', '日本水療', '美容修剪', '牙齒清潔',
  '指甲修剪', '耳朵清潔', 'SPA', '按摩', '剃毛', '造型設計',
];

export default function PetsPage() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [showRecordModal, setShowRecordModal] = useState(null);
  const [mounted, setMounted] = useState(false);

  const [newPet, setNewPet] = useState({
    name: '', type: 'dog', breed: '', age: '', gender: '',
    weight: '', color: '', notes: '', allergies: '', preferences: '',
  });

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setPets(JSON.parse(stored));
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [mounted]);

  const savePets = (data) => {
    if (!mounted) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); setPets(data); }
    catch (e) { console.error(e); }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPet) {
      setPets(pets.map(p => p.id === editingPet.id ? { ...p, ...newPet, updatedAt: new Date().toISOString() } : p));
      setEditingPet(null);
    } else {
      const pet = { id: Date.now().toString(), createdAt: new Date().toISOString(), ...newPet };
      setPets([...pets, pet]);
    }
    setNewPet({ name: '', type: 'dog', breed: '', age: '', gender: '', weight: '', color: '', notes: '', allergies: '', preferences: '' });
    setShowAddForm(false);
  };

  const deletePet = (id) => { if (confirm('確定刪除？')) savePets(pets.filter(p => p.id !== id)); };
  const addRecord = (petId, record) => {
    const newRecord = { id: Date.now().toString(), date: new Date().toISOString(), ...record };
    setPets(pets.map(p => p.id === petId ? { ...p, groomingRecords: [...(p.groomingRecords || []), newRecord] } : p));
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="max-w-md mx-auto text-center py-12">
          <div className="text-4xl mb-4">🐾</div>
          <p className="text-gray-500">載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <Head><title>🐾 我的寵物 - PetGroom HK</title></Head>
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="text-2xl font-bold text-gray-800">🐾 我的寵物</Link>
          <button onClick={() => { setNewPet({ name: '', type: 'dog', breed: '', age: '', gender: '', weight: '', color: '', notes: '', allergies: '', preferences: '' }); setEditingPet(null); setShowAddForm(true); }} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full font-medium">+ 新增</button>
        </div>

        {pets.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">🐕</div>
            <p className="text-gray-500 mb-4">尚未添加寵物</p>
            <button onClick={() => setShowAddForm(true)} className="text-purple-600 font-medium">+ 添加第一隻寵物</button>
          </div>
        ) : (
          <div className="space-y-4">
            {pets.map(pet => (
              <div key={pet.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <div className="flex items-center">
                    <div className="text-4xl mr-4">{PET_TYPES[pet.type]?.icon || '🐾'}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">{pet.name}</h3>
                      <p className="text-sm opacity-90">{pet.breed && `${pet.breed} • `}{pet.age && `${pet.age}歲`}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setNewPet(pet); setEditingPet(pet); setShowAddForm(true); }} className="bg-white/20 p-2 rounded-lg">✏️</button>
                      <button onClick={() => deletePet(pet.id)} className="bg-white/20 p-2 rounded-lg">🗑️</button>
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  {pet.allergies && <div className="bg-red-50 p-3 rounded-lg"><p className="text-xs text-red-600 font-medium">⚠️ 過敏資訊</p><p className="text-red-800">{pet.allergies}</p></div>}
                  {pet.preferences && <div className="bg-green-50 p-3 rounded-lg"><p className="text-xs text-green-600 font-medium">✂️ 造型偏好</p><p className="text-green-800">{pet.preferences}</p></div>}
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>上次美容：{pet.lastGrooming || '未記錄'}</span>
                    <button onClick={() => setShowRecordModal(pet)} className="text-purple-600 font-medium">+ 記錄</button>
                  </div>
                  {pet.groomingRecords && pet.groomingRecords.length > 0 && (
                    <div className="border-t pt-3 mt-3">
                      <p className="text-xs text-gray-500 mb-2">歷史記錄</p>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {pet.groomingRecords.slice(-3).reverse().map(r => (
                          <div key={r.id} className="bg-gray-50 p-2 rounded-lg text-sm">
                            <div className="flex justify-between"><span>{r.date?.slice(0, 10)}</span><span className="text-purple-600">{r.service}</span></div>
                            {r.shop && <p className="text-xs text-gray-500">📍 {r.shop}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">{editingPet ? '編輯寵物' : '新增寵物'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">寵物名稱 *</label><input type="text" required value={newPet.name} onChange={e => setNewPet({...newPet, name: e.target.value})} className="w-full p-3 border rounded-lg" placeholder="例如：旺旺" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">類型</label><div className="flex flex-wrap gap-2">{Object.entries(PET_TYPES).map(([k, {label, icon}]) => (<button type="button" key={k} onClick={() => setNewPet({...newPet, type: k})} className={`px-3 py-2 rounded-lg text-sm font-medium ${newPet.type === k ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700'}`}>{icon} {label}</button>))}</div></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">品種</label><input type="text" value={newPet.breed} onChange={e => setNewPet({...newPet, breed: e.target.value})} className="w-full p-3 border rounded-lg" placeholder="例如：貴婦狗" /></div>
                <div className="flex gap-4"><div className="flex-1"><label className="block text-sm font-medium text-gray-700 mb-1">年齡</label><input type="text" value={newPet.age} onChange={e => setNewPet({...newPet, age: e.target.value})} className="w-full p-3 border rounded-lg" placeholder="例如：3" /></div><div className="flex-1"><label className="block text-sm font-medium text-gray-700 mb-1">體重 (kg)</label><input type="text" value={newPet.weight} onChange={e => setNewPet({...newPet, weight: e.target.value})} className="w-full p-3 border rounded-lg" placeholder="例如：5" /></div></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">⚠️ 過敏資訊</label><textarea value={newPet.allergies} onChange={e => setNewPet({...newPet, allergies: e.target.value})} className="w-full p-3 border rounded-lg" rows={2} placeholder="例如：對某些洗髮水過敏..." /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">✂️ 造型偏好</label><textarea value={newPet.preferences} onChange={e => setNewPet({...newPet, preferences: e.target.value})} className="w-full p-3 border rounded-lg" rows={2} placeholder="例如：短剪、耳朵修剪..." /></div>
                <div className="flex gap-4 pt-4"><button type="button" onClick={() => { setShowAddForm(false); setEditingPet(null); }} className="flex-1 py-3 bg-gray-100 rounded-lg font-medium">取消</button><button type="submit" className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium">{editingPet ? '儲存' : '新增'}</button></div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showRecordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">📅 記錄美容 - {showRecordModal.name}</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">日期</label><input type="date" className="w-full p-3 border rounded-lg" onChange={e => setShowRecordModal({...showRecordModal, recordDate: e.target.value})} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">服務項目</label><select className="w-full p-3 border rounded-lg" onChange={e => setShowRecordModal({...showRecordModal, service: e.target.value})}><option value="">選擇服務</option>{SERVICE_TYPES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">店家（可選）</label><input type="text" className="w-full p-3 border rounded-lg" placeholder="例如：Paw Palace" onChange={e => setShowRecordModal({...showRecordModal, shop: e.target.value})} /></div>
              <div className="flex gap-4 pt-4"><button onClick={() => setShowRecordModal(null)} className="flex-1 py-3 bg-gray-100 rounded-lg font-medium">取消</button><button onClick={() => { addRecord(showRecordModal.id, { date: showRecordModal.recordDate, service: showRecordModal.service, shop: showRecordModal.shop }); setShowRecordModal(null); }} className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium">儲存</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
