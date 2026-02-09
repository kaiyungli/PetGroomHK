import { useState, useEffect } from 'react';

const STORAGE_KEY = 'petgroomhk_pets';

export function usePets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  // 從 LocalStorage 載入
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPets(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading pets:', error);
    }
    setLoading(false);
  }, []);

  // 儲存到 LocalStorage
  const savePets = (newPets) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPets));
      setPets(newPets);
    } catch (error) {
      console.error('Error saving pets:', error);
    }
  };

  // 新增寵物
  const addPet = (pet) => {
    const newPet = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...pet,
    };
    const newPets = [...pets, newPet];
    savePets(newPets);
    return newPet;
  };

  // 更新寵物
  const updatePet = (id, updates) => {
    const newPets = pets.map(pet =>
      pet.id === id ? { ...pet, ...updates, updatedAt: new Date().toISOString() } : pet
    );
    savePets(newPets);
  };

  // 刪除寵物
  const deletePet = (id) => {
    const newPets = pets.filter(pet => pet.id !== id);
    savePets(newPets);
  };

  // 獲取單一寵物
  const getPet = (id) => {
    return pets.find(pet => pet.id === id);
  };

  // 新增美容記錄
  const addGroomingRecord = (petId, record) => {
    const pet = getPet(petId);
    if (pet) {
      const newRecord = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        ...record,
      };
      const records = pet.groomingRecords || [];
      updatePet(petId, { groomingRecords: [...records, newRecord] });
    }
  };

  return {
    pets,
    loading,
    addPet,
    updatePet,
    deletePet,
    getPet,
    addGroomingRecord,
  };
}
