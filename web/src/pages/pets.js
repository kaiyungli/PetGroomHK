import { useState } from 'react';
import { PET_TYPES, SERVICE_TYPES } from '../data/petConstants';
import usePets from '../hooks/usePets';

export default function MyPetsPage() {
  const { pets, loading, addPet, deletePet, updatePet, addGroomingRecord } = usePets();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [showRecordModal, setShowRecordModal] = useState(null);

  // 新增寵物表單
  const [newPet, setNewPet] = useState({
    name: '',
    type: 'dog',
    breed: '',
    age: '',
    gender: '',
    weight: '',
    color: '',
    notes: '',
    allergies: '',
    preferences: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPet) {
      updatePet(editingPet.id, newPet);
      setEditingPet(null);
    } else {
      addPet(newPet);
    }
    setNewPet({
      name: '',
      type: 'dog',
      breed: '',
      age: '',
      gender: '',
      weight: '',
      color: '',
      notes: '',
      allergies: '',
      preferences: '',
    });
    setShowAddForm(false);
  };

  const handleEdit = (pet) => {
    setNewPet(pet);
    setEditingPet(pet);
    setShowAddForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="max-w-md mx-auto">
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🐾</div>
            <p className="text-gray-500">載入中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-md mx-auto">
        {/* 標題 */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">🐾 我的寵物</h1>
          <button
            onClick={() => {
              setNewPet({
                name: '',
                type: 'dog',
                breed: '',
                age: '',
                gender: '',
                weight: '',
                color: '',
                notes: '',
                allergies: '',
                preferences: '',
              });
              setEditingPet(null);
              setShowAddForm(true);
            }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full font-medium"
          >
            + 新增
          </button>
        </div>

        {/* 寵物列表 */}
        {pets.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">🐕</div>
            <p className="text-gray-500 mb-4">尚未添加寵物</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="text-purple-600 font-medium"
            >
              + 添加第一隻寵物
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {pets.map(pet => (
              <div key={pet.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* 寵物頭部 */}
                <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <div className="flex items-center">
                    <div className="text-4xl mr-4">
                      {PET_TYPES[pet.type]?.icon || '🐾'}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">{pet.name}</h3>
                      <p className="text-sm opacity-90">
                        {pet.breed && `${pet.breed} • `}
                        {pet.age && `${pet.age}歲`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(pet)}
                        className="bg-white/20 p-2 rounded-lg"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => deletePet(pet.id)}
                        className="bg-white/20 p-2 rounded-lg"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>

                {/* 寵物資料 */}
                <div className="p-4 space-y-3">
                  {pet.allergies && (
                    <div className="bg-red-50 p-3 rounded-lg">
                      <p className="text-xs text-red-600 font-medium">⚠️ 過敏資訊</p>
                      <p className="text-red-800">{pet.allergies}</p>
                    </div>
                  )}

                  {pet.preferences && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-xs text-green-600 font-medium">✂️ 造型偏好</p>
                      <p className="text-green-800">{pet.preferences}</p>
                    </div>
                  )}

                  <div className="flex justify-between text-sm text-gray-500">
                    <span>上次美容：{pet.lastGrooming || '未記錄'}</span>
                    <button
                      onClick={() => setShowRecordModal(pet)}
                      className="text-purple-600 font-medium"
                    >
                      + 記錄
                    </button>
                  </div>

                  {/* 美容記錄 */}
                  {pet.groomingRecords && pet.groomingRecords.length > 0 && (
                    <div className="border-t pt-3 mt-3">
                      <p className="text-xs text-gray-500 mb-2">歷史記錄</p>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {pet.groomingRecords.slice(-3).reverse().map(record => (
                          <div key={record.id} className="bg-gray-50 p-2 rounded-lg text-sm">
                            <div className="flex justify-between">
                              <span>{record.date.slice(0, 10)}</span>
                              <span className="text-purple-600">{record.service}</span>
                            </div>
                            {record.shop && (
                              <p className="text-xs text-gray-500">📍 {record.shop}</p>
                            )}
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

        {/* 新增/編輯表單 */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">
                  {editingPet ? '編輯寵物' : '新增寵物'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* 寵物名稱 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      寵物名稱 *
                    </label>
                    <input
                      type="text"
                      required
                      value={newPet.name}
                      onChange={e => setNewPet({ ...newPet, name: e.target.value })}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="例如：旺旺"
                    />
                  </div>

                  {/* 寵物類型 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      類型
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(PET_TYPES).map(([key, { label, icon }]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setNewPet({ ...newPet, type: key })}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            newPet.type === key
                              ? 'bg-purple-500 text-white'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {icon} {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 品種 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      品種
                    </label>
                    <input
                      type="text"
                      value={newPet.breed}
                      onChange={e => setNewPet({ ...newPet, breed: e.target.value })}
                      className="w-full p-3 border rounded-lg"
                      placeholder="例如：貴婦狗 / 英短"
                    />
                  </div>

                  {/* 年齡和體重 */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        年齡
                      </label>
                      <input
                        type="text"
                        value={newPet.age}
                        onChange={e => setNewPet({ ...newPet, age: e.target.value })}
                        className="w-full p-3 border rounded-lg"
                        placeholder="例如：3"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        體重 (kg)
                      </label>
                      <input
                        type="text"
                        value={newPet.weight}
                        onChange={e => setNewPet({ ...newPet, weight: e.target.value })}
                        className="w-full p-3 border rounded-lg"
                        placeholder="例如：5"
                      />
                    </div>
                  </div>

                  {/* 性別 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      性別
                    </label>
                    <div className="flex gap-4">
                      {['男仔', '女仔', '未知'].map(gender => (
                        <label key={gender} className="flex items-center">
                          <input
                            type="radio"
                            name="gender"
                            checked={newPet.gender === gender}
                            onChange={() => setNewPet({ ...newPet, gender })}
                            className="mr-2"
                          />
                          {gender}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 過敏資訊 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ⚠️ 過敏資訊（如有）
                    </label>
                    <textarea
                      value={newPet.allergies}
                      onChange={e => setNewPet({ ...newPet, allergies: e.target.value })}
                      className="w-full p-3 border rounded-lg"
                      placeholder="例如：對某些洗髮水過敏..."
                      rows={2}
                    />
                  </div>

                  {/* 造型偏好 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ✂️ 造型偏好
                    </label>
                    <textarea
                      value={newPet.preferences}
                      onChange={e => setNewPet({ ...newPet, preferences: e.target.value })}
                      className="w-full p-3 border rounded-lg"
                      placeholder="例如：短剪、耳朵修剪..."
                      rows={2}
                    />
                  </div>

                  {/* 備註 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      其他備註
                    </label>
                    <textarea
                      value={newPet.notes}
                      onChange={e => setNewPet({ ...newPet, notes: e.target.value })}
                      className="w-full p-3 border rounded-lg"
                      placeholder=""
                      rows={2}
                    />
                  </div>

                  {/* 按鈕 */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingPet(null);
                      }}
                      className="flex-1 py-3 bg-gray-100 rounded-lg font-medium"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium"
                    >
                      {editingPet ? '儲存' : '新增'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* 記錄 Modal */}
        {showRecordModal && (
          <GroomingRecordModal
            pet={showRecordModal}
            onClose={() => setShowRecordModal(null)}
            onSave={(record) => {
              addGroomingRecord(showRecordModal.id, record);
              setShowRecordModal(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

// 美容記錄 Modal
function GroomingRecordModal({ pet, onClose, onSave }) {
  const [record, setRecord] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRecord({
        date: new Date().toISOString().slice(0, 10),
        service: '',
        shop: '',
        notes: '',
      });
    }
  }, []);

  if (!record) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl w-full max-w-md p-6">
          <p className="text-center text-gray-500">載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">
          📅 記錄美容 - {pet.name}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">日期</label>
            <input
              type="date"
              value={record.date}
              onChange={e => setRecord({ ...record, date: e.target.value })}
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">服務項目</label>
            <select
              value={record.service}
              onChange={e => setRecord({ ...record, service: e.target.value })}
              className="w-full p-3 border rounded-lg"
            >
              <option value="">選擇服務</option>
              {SERVICE_TYPES.map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">店家（可選）</label>
            <input
              type="text"
              value={record.shop}
              onChange={e => setRecord({ ...record, shop: e.target.value })}
              className="w-full p-3 border rounded-lg"
              placeholder="例如：Paw Palace"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-100 rounded-lg font-medium"
            >
              取消
            </button>
            <button
              type="button"
              onClick={() => onSave(record)}
              className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium"
            >
              儲存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
