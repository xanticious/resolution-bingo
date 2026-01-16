// LocalStorage wrapper for data persistence
export class Storage {
  constructor(key = 'resolution-bingo-data') {
    this.key = key;
  }

  load() {
    try {
      const data = localStorage.getItem(this.key);
      return data ? JSON.parse(data) : this.getDefaultData();
    } catch (error) {
      console.error('Failed to load data from localStorage:', error);
      return this.getDefaultData();
    }
  }

  save(data) {
    try {
      localStorage.setItem(this.key, JSON.stringify(data));
      return true;
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.error('Storage quota exceeded');
        alert('Storage is full. Please export your data and clear old items.');
      } else {
        console.error('Failed to save data to localStorage:', error);
      }
      return false;
    }
  }

  clear() {
    try {
      localStorage.removeItem(this.key);
      return true;
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
      return false;
    }
  }

  getDefaultData() {
    return {
      version: '1.0.0',
      currentProfileId: null,
      profiles: [],
      resolutions: [],
      lifeCategories: [],
      bingoCards: [],
      preferences: {},
      lastBackup: null,
    };
  }
}
